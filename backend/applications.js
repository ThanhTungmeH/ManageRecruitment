const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const { sendEmail } =require('./emailService')
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
    fileSize: 12 * 1024 * 1024,
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
        // Lấy thông tin job để gửi email
    const jobInfo = await new Promise((resolve, reject) => {
      req.db.query(
        "SELECT title FROM jobs WHERE id = ?",
        [jobId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0]);
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

    sendEmail(email, "applicationReceived", {
      candidateName: fullName,
      jobTitle: jobInfo.title,
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
      "scheduled_interview",
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

    // ✅ Lấy thông tin ứng viên và job để gửi email
    if (status === 'accepted' || status === 'rejected') {
      const applicationData = await new Promise((resolve, reject) => {
        req.db.query(
          `SELECT a.full_name, a.email, j.title as job_title
           FROM applications a
           JOIN jobs j ON a.job_id = j.id  
           WHERE a.id = ?`,
          [id],
          (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
          }
        );
      });

      // Gửi email theo trạng thái
      if (applicationData) {
        const emailData = {
          candidateName: applicationData.full_name,
          jobTitle: applicationData.job_title
        };

        if (status === 'accepted') {
          sendEmail(applicationData.email, 'applicationAccepted', emailData)
            .catch(error => console.error('Failed to send acceptance email:', error));
        } else if (status === 'rejected') {
          sendEmail(applicationData.email, 'applicationRejected', emailData)
            .catch(error => console.error('Failed to send rejection email:', error));
        }
      }
    }
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Không thể cập nhật trạng thái" });
  }
});

// GET /api/applications/download-cv/:applicationId - Download CV
router.get("/download-cv/:applicationId", async (req, res) => {
  try {
    const { applicationId } = req.params;
    console.log("Download CV request for application:", applicationId);

    // Lấy thông tin file từ database
    const application = await new Promise((resolve, reject) => {
      req.db.query(
        "SELECT cv_filename, cv_path FROM applications WHERE id = ?",
        [applicationId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (application.length === 0) {
      console.log("Application not found for ID:", applicationId);
      return res.status(404).json({ error: "Không tìm thấy đơn ứng tuyển" });
    }

    const { cv_filename, cv_path } = application[0];
    console.log("CV filename:", cv_filename);
    console.log("CV path:", cv_path);

    // Xây dựng đường dẫn file
    const uploadsDir = path.join("D:", "CV_Storage", "uploaded_cvs");
    const filePath = path.join(uploadsDir, cv_filename);

    console.log("Full file path:", filePath);

    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(filePath)) {
      console.error("File not found at path:", filePath);

      // Kiểm tra thư mục có tồn tại không
      if (!fs.existsSync(uploadsDir)) {
        console.error("Uploads directory does not exist:", uploadsDir);
      } else {
        // List files trong thư mục để debug
        const files = fs.readdirSync(uploadsDir);
        console.log("Files in uploads directory:", files);
      }

      return res.status(404).json({ error: "File CV không tồn tại" });
    }

    // Lấy thông tin file
    const stats = fs.statSync(filePath);
    console.log("File stats:", {
      size: stats.size,
      isFile: stats.isFile(),
      modified: stats.mtime,
    });

    // Xác định MIME type dựa trên extension
    const ext = path.extname(cv_filename).toLowerCase();
    let mimeType = "application/octet-stream";

    switch (ext) {
      case ".pdf":
        mimeType = "application/pdf";
        break;
    }

    console.log("MIME type:", mimeType);

    // Set headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${cv_filename}"`
    );
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", "no-cache");

    console.log("Headers set, starting file stream...");

    // Stream file
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("error", (error) => {
      console.error("File stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Lỗi khi đọc file CV" });
      }
    });

    fileStream.on("end", () => {
      console.log("File stream completed");
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error("Error downloading CV:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Không thể tải file CV" });
    }
  }
});

// GET /api/applications/candidates - Lấy danh sách tất cả ứng viên
router.get("/candidates", async (req, res) => {
  try {
    const candidates = await new Promise((resolve, reject) => {
      req.db.query(
        `
       SELECT 
          a.email,
          MAX(a.full_name) as full_name,
          MAX(a.phone) as phone,
          COUNT(DISTINCT a.id) as total_applications,
          MAX(a.submitted_at) as latest_application_date,
          (
            SELECT status 
            FROM applications a2 
            WHERE a2.email = a.email 
            ORDER BY a2.submitted_at DESC 
            LIMIT 1
          ) as status,
          GROUP_CONCAT(DISTINCT j.title ORDER BY j.title ASC SEPARATOR ', ') as job_titles_raw,
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
          ) as latest_application_id,
          (
            SELECT user_id 
            FROM applications a5 
            WHERE a5.email = a.email
            ORDER BY a5.submitted_at DESC 
            LIMIT 1
          ) as user_id
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        GROUP BY a.email
        ORDER BY latest_application_date DESC
      `,
            (err, results) => {
          if (err) reject(err);
          else {
            const processedResults = results.map((row) => ({
              ...row,
              id: row.user_id ? row.user_id.toString() : null,
              job_titles: row.job_titles_raw
                ? row.job_titles_raw.split(", ")
                : [],
              job_titles_raw: undefined, // Remove raw field
              user_id: undefined, // Remove redundant field
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
