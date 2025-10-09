const express = require("express");
const router = express.Router();

const { sendEmail } = require('./emailService');
// POST /api/interviews - Lên lịch phỏng vấn (chỉ offline)
router.post("/", async (req, res) => {
  try {
    const {
      candidateId,
      candidateName,
      candidateEmail,
      date,
      time,
      duration,
      type,
      interviewer,
      interviewerEmail,
      location,
      notes,
      jobTitle,
    } = req.body;
  // Kiểm tra ứng viên đã có lịch phỏng vấn chưa
    const existingInterview = await new Promise((resolve, reject) => {
      req.db.query(
        `SELECT id FROM interviews 
         WHERE candidate_id = ? 
         AND status IN ('scheduled', 'in_progress')`,
        [candidateId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
       if (existingInterview.length > 0) {
      return res.status(400).json({ 
        error: "Ứng viên này đã được lên lịch phỏng vấn" 
      });
    }
    // Validate type chỉ cho phép 'onsite'
    if (type !== 'onsite') {
      return res.status(400).json({ error: "Chỉ hỗ trợ phỏng vấn trực tiếp tại văn phòng" });
    }

    // Validate required fields for onsite interview
    if (!location || !location.trim()) {
      return res.status(400).json({ error: "Địa điểm phỏng vấn là bắt buộc" });
    }

    // Tạo datetime từ date và time
    const interviewDateTime = new Date(`${date}T${time}`);

    const result = await new Promise((resolve, reject) => {
      req.db.query(
        `INSERT INTO interviews (
          candidate_id, candidate_name, candidate_email, 
          interview_date, duration, type, 
          interviewer, interviewer_email, location, 
          notes, job_title, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', NOW())`,
        [
          candidateId,
          candidateName,
          candidateEmail,
          interviewDateTime,
          duration,
          'onsite', // Force type to be onsite
          interviewer,
          interviewerEmail,
          location,
          notes || null,
          jobTitle || null,
        ],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    // ✅ Cập nhật status application thành "scheduled_interview"  
    await new Promise((resolve, reject) => {
      req.db.query(
        `UPDATE applications 
         SET status = 'scheduled_interview' 
         WHERE user_id = ? AND job_id = (
           SELECT id FROM jobs WHERE title = ? LIMIT 1
         )`,
        [candidateId, jobTitle],
        (err, results) => {
          if (err) {
            console.error('Error updating application status:', err);
            // Không reject, chỉ log error
          }
          resolve(results);
        }
      );
    });
               
    res.status(201).json({
      message: "Lên lịch phỏng vấn thành công!",
      interviewId: result.insertId,
    });
     // ✅ Gửi email mời phỏng vấn (async)
    sendEmail(candidateEmail, 'interviewInvitation', {
      candidateName,
      jobTitle: jobTitle ,
      date,
      time,
      location,
      interviewer,
      duration
    }).catch(error => {
      console.error('Failed to send interview invitation email:', error);
    });

  } catch (error) {
    console.error("Error creating interview:", error);
    res.status(500).json({ error: "Không thể lên lịch phỏng vấn" });
  }
});

// GET /api/interviews - Lấy danh sách phỏng vấn
router.get("/", async (req, res) => {
  try {
    const interviews = await new Promise((resolve, reject) => {
      req.db.query(
        `SELECT 
          id,
          candidate_id,
          candidate_name,
          candidate_email,
          interview_date,
          duration,
          type,
          interviewer,
          interviewer_email,
          location,
          notes,
          job_title,
          status,
          created_at
         FROM interviews 
         WHERE type = 'onsite' 
         ORDER BY interview_date ASC`,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    res.json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ error: "Không thể tải danh sách phỏng vấn" });
  }
});


// PUT /api/interviews/:id/status - Cập nhật trạng thái phỏng vấn
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["scheduled", "completed", "cancelled", "rescheduled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ" });
    }

    await new Promise((resolve, reject) => {
      req.db.query(
        "UPDATE interviews SET status = ? WHERE id = ?",
        [status, id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
  
    res.status(500).json({ error: "Không thể cập nhật trạng thái" });
  }
});
// GET /api/interviews/check/:candidateId - Kiểm tra ứng viên đã được lên lịch chưa
router.get("/check/:candidateId", async (req, res) => {
  try {
    const { candidateId } = req.params;
    const existingInterview = await new Promise((resolve, reject) => {
      req.db.query(
        `SELECT 
          id, 
          interview_date, 
          status, 
          interviewer,
          location,
          candidate_email
         FROM interviews 
         WHERE candidate_id = ? AND status IN ('scheduled', 'in_progress')
         ORDER BY created_at DESC
         LIMIT 1`,
        [candidateId], // ✅ candidateId giờ là user_id
        (err, results) => {
          if (err) {
           
            reject(err);
          } else {
           
            resolve(results);
          }
        }
      );
    });

      if (existingInterview.length > 0) {
      const interview = existingInterview[0];
      
      // Tách date và time từ interview_date
      const interviewDate = new Date(interview.interview_date);
      const date = interviewDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const time = interviewDate.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

      const responseData = {
        hasScheduledInterview: true,
        interview: {
          id: interview.id,
          date: date,
          time: time,
          status: interview.status,
          interviewer: interview.interviewer,
          location: interview.location
        }
      };

     
      res.json(responseData);
    } else {
      res.json({
        hasScheduledInterview: false,
        interview: null
      });
    }
  } catch (error) {
   
    res.status(500).json({ error: "Không thể kiểm tra trạng thái phỏng vấn" });
  }
});

module.exports = router;