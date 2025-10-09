const express = require('express');
const router = express.Router();

// Helper function để chạy query bất đồng bộ
const queryAsync = (db, sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

router.get('/stats', async (req, res) => {
    try {
        const db = req.db;

        // Sử dụng Promise.all để chạy các query song song
        const [
            totalJobsRes,
            activeJobsRes,
            totalCandidatesRes,
            newApplicationsRes,
            interviewsTodayRes,
            hiredThisMonthRes,
            recentApplications,
            jobsOverview,
            aiAnalysisResults
        ] = await Promise.all([
            queryAsync(db, "SELECT COUNT(*) as count FROM jobs"),
            queryAsync(db, "SELECT COUNT(*) as count FROM jobs WHERE status = 'active'"),
            queryAsync(db, "SELECT COUNT(DISTINCT email) as count FROM applications"),
            queryAsync(db, "SELECT COUNT(*) as count FROM applications WHERE submitted_at >= CURDATE() - INTERVAL 7 DAY"),
            queryAsync(db, "SELECT COUNT(*) as count FROM interviews WHERE DATE(interview_date) = CURDATE()"),
            queryAsync(db, "SELECT COUNT(*) as count FROM applications WHERE status = 'hired' AND MONTH(submitted_at) = MONTH(CURDATE()) AND YEAR(submitted_at) = YEAR(CURDATE())"),
            queryAsync(db, `
                SELECT a.id, a.full_name, a.email, a.status, a.ai_analysis, j.title as job_title 
                FROM applications a
                JOIN jobs j ON a.job_id = j.id
                ORDER BY a.submitted_at DESC 
                LIMIT 5
            `),
            queryAsync(db, "SELECT id, title, location, num_applicants, posted_date, department, employment_type, urgency_level, status FROM jobs ORDER BY posted_date DESC LIMIT 5"),
            queryAsync(db, "SELECT ai_analysis FROM applications WHERE ai_analysis IS NOT NULL")
        ]);

        // Xử lý top skills
        const skillCounts = {};
        aiAnalysisResults.forEach(row => {
            try {
                if (row.ai_analysis) {
                    const analysis = typeof row.ai_analysis === 'string' ? JSON.parse(row.ai_analysis) : row.ai_analysis;
                    if (analysis && Array.isArray(analysis.skills)) {
                        analysis.skills.forEach(skill => {
                            if (skill.name) {
                                skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1;
                            }
                        });
                    }
                }
            } catch (e) {
                // Bỏ qua lỗi parse JSON
            }
        });

        const topSkills = Object.entries(skillCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([skill, count]) => ({ skill, count }));

        // Tạo đối tượng stats để trả về
        const stats = {
            totalJobs: totalJobsRes[0].count,
            activeJobs: activeJobsRes[0].count,
            totalCandidates: totalCandidatesRes[0].count,
            newApplications: newApplicationsRes[0].count,
            interviewsToday: interviewsTodayRes[0].count,
            hiredThisMonth: hiredThisMonthRes[0].count,
            averageTimeToHire: 25, // Tạm thời
            recentApplications: recentApplications.map(app => ({
                id: app.id,
                name: app.full_name,
                position: app.job_title,
                status: app.status,
                aiScore: app.ai_analysis ? (JSON.parse(app.ai_analysis).overallScore || 0) : 0,
            })),
            jobsOverview: jobsOverview.map(job => ({
                ...job,
                postedDate: job.posted_date,
                applicationCount: job.num_applicants,
                type: job.employment_type,
                priority: job.urgency_level
            })),
            topSkills: topSkills,
        };

        res.json(stats);

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Không thể tải dữ liệu dashboard" });
    }
});

module.exports = router;
