
const express = require("express");
const router = express.Router();

// Jobs API Routes
router.get("/", (req, res) => {
  req.db.query("SELECT * FROM jobs", (err, results) => {
    if (err) {
      return;
    }
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const jobId = req.params.id;
  req.db.query("SELECT * FROM jobs WHERE id = ?", [jobId], (err, results) => {
    if (err) {
      
      return;
    }
    if (results.length === 0) {
      return;
    }
    res.json(results[0]);
  });
});
router.post("/update-applicant-counts", (req, res) => {
  const query = `
        UPDATE jobs j
        SET num_applicants = (
            SELECT COUNT(*) 
            FROM applications a 
            WHERE a.job_id = j.id
        )
    `;
  req.db.query(query, (err, results) => {
    if (err) {
      return;
    }
  });
});

router.post("/", (req, res) => {
  const {
    title,
    department,
    location,
    employment_type,
    description,
    requirements,
    benefits,
    skills_required,
    experience_level,
    urgency_level,
    salary,
    deadline,
    status,
    address,
  } = req.body;

  const query = `
        INSERT INTO jobs (
            title, department, location, employment_type, description,
            requirements, benefits, skills_required, experience_level,
            urgency_level, salary, deadline, status, num_applicants, posted_date,address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(),?)
    `;

  req.db.query(
    query,
    [
      title,
      department,
      location,
      employment_type,
      description,
      requirements,
      benefits,
      skills_required,
      experience_level,
      urgency_level,
      salary,
      deadline,
      status,
      address,
    ],
    (err, results) => {
      if (err) {
        return;
      }
      res
        .status(201)
        .json({ id: results.insertId, message: "Job created successfully" });
    }
  );
});

router.put("/:id", (req, res) => {
  const jobId = req.params.id;
  const updates = req.body;

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(updates);
  values.push(jobId);

  const query = `UPDATE jobs SET ${fields}, updated_at = NOW() WHERE id = ?`;

  req.db.query(query, values, (err, results) => {
    if (err) {
    console.error("Database error:", err);
      return res.status(500).json({ error: "Lỗi cập nhật database" });
    }
    if (results.affectedRows === 0) {

      return res.status(404).json({ error: "Không tìm thấy job" });
    }
      res.json({ 
      message: "Cập nhật job thành công",
      jobId: jobId,
      updatedFields: Object.keys(updates)
    });
  });
});

router.delete("/:id", (req, res) => {
  const jobId = req.params.id;
  
  // Xóa applications trước
  req.db.query("DELETE FROM applications WHERE job_id = ?", [jobId], (err, result) => {
    if (err) {
      console.error("Error deleting applications:", err);
      return res.status(500).json({ error: "Lỗi xóa applications" });
    }
    
    // Sau đó xóa job
    req.db.query("DELETE FROM jobs WHERE id = ?", [jobId], (err, results) => {
      if (err) {
        console.error("Error deleting job:", err);
        return res.status(500).json({ error: "Lỗi xóa job" });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy job" });
      }
      
      // THÊM RESPONSE TRẢ VỀ
      res.json({ 
        message: "Xóa job thành công",
        jobId: jobId
      });
    });
  });
});
router.put("/:id/status", (req, res) => {
  const jobId = req.params.id;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['active', 'paused', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ" });
  }

  const query = "UPDATE jobs SET status = ?, updated_at = NOW() WHERE id = ?";
  
  req.db.query(query, [status, jobId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Lỗi cập nhật database" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy job" });
    }
    
    res.json({ 
      message: "Cập nhật trạng thái thành công",
      status: status
    });
  });
});
module.exports=router;