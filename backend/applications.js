const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Tạo thư mục uploads nếu chưa có
const uploadsDir = path.join("D:", "CV_Storage", "uploaded_cvs");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình multer để upload CV
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const filename = `cv-${uniqueSuffix}${extension}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file PDF"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

// POST /api/applications - Nộp đơn ứng tuyển
router.post("/", upload.single("cv"), async (req, res) => {
  try {
    const { jobId, fullName, email, phone, coverLetter } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Vui lòng tải lên CV" });
    }

    const userId = req.user?.dbId;

    if (!userId) {
      return res.status(401).json({ error: "Vui lòng đăng nhập để ứng tuyển" });
    }

    // Kiểm tra job có tồn tại không
    const jobExists = await new Promise((resolve, reject) => {
      req.db.query(
        "SELECT id FROM jobs WHERE id = ?",
        [jobId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (jobExists.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy công việc" });
    }

    // Kiểm tra đã ứng tuyển chưa
    const existingApplication = await new Promise((resolve, reject) => {
      req.db.query(
        "SELECT id FROM applications WHERE user_id = ? AND job_id = ?",
        [userId, jobId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    // THÊM: Tự động cập nhật num_applicants

    if (existingApplication.length > 0) {
      return res.status(400).json({ error: "Bạn đã ứng tuyển vị trí này rồi" });
    }

    // Lưu application vào database
    const result = await new Promise((resolve, reject) => {
      req.db.query(
        `
        INSERT INTO applications (
          user_id, job_id, full_name, email, phone, 
          cover_letter, cv_filename, cv_path, status, submitted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending' , NOW())
      `,
        [
          userId,
          jobId,
          fullName,
          email,
          phone,
          coverLetter || null,
          req.file.filename, // Chỉ lưu tên file
          path.join(uploadsDir, req.file.filename),
        ],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    await new Promise((resolve, reject) => {
      req.db.query(
        `UPDATE jobs 
         SET num_applicants = (
           SELECT COUNT(*) FROM applications WHERE job_id = ?
         ) 
         WHERE id = ?`,
        [jobId, jobId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    res.status(201).json({
      message: "Ứng tuyển thành công!",
      applicationId: result.insertId,
    });
  } catch (error) {
    console.error("Error submitting application:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: "Có lỗi xảy ra khi nộp đơn ứng tuyển" });
  }
});

// GET /api/applications/my-applications - Lấy danh sách đơn ứng tuyển của user
router.get("/my-applications", async (req, res) => {
  try {
    const userId = req.user?.dbId;

    if (!userId) {
      return res.status(401).json({ error: "Vui lòng đăng nhập" });
    }

    const applications = await new Promise((resolve, reject) => {
      req.db.query(
        `
        SELECT 
          a.id,
          a.job_id,
          a.full_name,
          a.email,
          a.phone,
          a.cover_letter,
          a.cv_filename,
          a.submitted_at,
          j.title as job_title,
          j.department,
          j.location,
          j.status as job_status
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.user_id = ?
        ORDER BY a.submitted_at DESC
      `,
        [userId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ error: "Không thể tải danh sách đơn ứng tuyển" });
  }
});

// GET /api/applications/job/:jobId - Lấy danh sách ứng viên cho job (admin only)
router.get("/job/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await new Promise((resolve, reject) => {
      req.db.query(
        `
       SELECT 
          a.id,
          a.job_id,
          a.full_name,
          a.email,
          a.phone,
          a.cover_letter,
          a.cv_filename,
          a.cv_path,
          COALESCE(a.status, 'pending') as status,
          a.submitted_at,
          j.title as job_title
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.job_id = ?
        ORDER BY a.submitted_at DESC
      `,
        [jobId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    // Trả về trực tiếp array applications, không wrap trong object
    res.json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ error: "Không thể tải danh sách ứng viên" });
  }
});
// PUT /api/applications/:id/status - Cập nhật trạng thái ứng tuyển
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "reviewing",
      "interviewed",
      "accepted",
      "rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ" });
    }

    await new Promise((resolve, reject) => {
      req.db.query(
        "UPDATE applications SET status = ? WHERE id = ?",
        [status, id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Không thể cập nhật trạng thái" });
  }
});
// GET /api/applications/download-cv/:applicationId - Download CV
// ...existing code...
// GET /api/applications/download-cv/:applicationId - Download CV
router.get("/download-cv/:applicationId", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await new Promise((resolve, reject) => {
      req.db.query(
        "SELECT * FROM applications WHERE id = ?",
        [applicationId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (application.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy đơn ứng tuyển" });
    }

    const app = application[0];

    // Xử lý đường dẫn file - kiểm tra cả đường dẫn cũ và mới
    let filePath = app.cv_path;

    // Nếu file không tồn tại ở đường dẫn trong DB, thử đường dẫn mới
    if (!fs.existsSync(filePath)) {
      // Thử đường dẫn mới nếu file không tồn tại ở đường dẫn cũ
      const newPath = path.join(uploadsDir, app.cv_filename);
      if (fs.existsSync(newPath)) {
        filePath = newPath;
      } else {
        return res.status(404).json({ error: "File CV không tồn tại" });
      }
    }
    const filename = app.cv_filename;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", fs.statSync(filePath).size);

    // Stream file để tránh load toàn bộ vào memory
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    fileStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Không thể tải file CV" });
      }
    });
  } catch (error) {
    console.error("Error downloading CV:", error);
    res.status(500).json({ error: "Không thể tải file CV" });
  }
});

// GET /api/applications/candidates - Lấy danh sách tất cả ứng viên
router.get("/candidates", async (req, res) => {
  try {
    const candidates = await new Promise((resolve, reject) => {
      req.db.query(
        `
       SELECT 
          CONCAT('candidate-', MD5(a.email)) as id,
          a.full_name,
          a.email,
          a.phone,
          COUNT(DISTINCT a.id) as total_applications,
          MAX(a.submitted_at) as latest_application_date,
          (
            SELECT status 
            FROM applications a2 
            WHERE a2.email = a.email 
            ORDER BY a2.submitted_at DESC 
            LIMIT 1
          ) as status,
          GROUP_CONCAT(DISTINCT j.title ORDER BY j.title ASC) as job_titles_raw,
          (
            SELECT cv_filename 
            FROM applications a3 
            WHERE a3.email = a.email 
            ORDER BY a3.submitted_at DESC 
            LIMIT 1
          ) as cv_filename,
          (
            SELECT id 
            FROM applications a4 
            WHERE a4.email = a.email 
            ORDER BY a4.submitted_at DESC 
            LIMIT 1
          ) as latest_application_id
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        GROUP BY a.email, a.full_name, a.phone
        ORDER BY latest_application_date DESC
      `,
        (err, results) => {
          if (err) reject(err);
          else {
            const processedResults = results.map(row => ({
              ...row,
              job_titles: row.job_titles_raw ? row.job_titles_raw.split(',') : [],
              job_titles_raw: undefined // Remove raw field
            }));
            resolve(processedResults);
          }
        }
      );
    });

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: "Không thể tải danh sách ứng viên" });
  }
});

module.exports = router;
