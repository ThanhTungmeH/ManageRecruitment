const express = require('express');
const router = express.Router();
const {  extractTextFromCV, analyzeCV, checkAIConnection } = require('./AIService');
const fs = require('fs');
const path = require('path');
const multer=require('multer');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Chỉ chấp nhận file PDF'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 12 * 1024 * 1024 // 12MB
  }
});

// POST /api/ai-screening/analyze - Phân tích CV
router.post('/analyze', upload.single('cv'), async (req, res) => {
  let tempFilePath = null;
  
  try {
    const file = req.file;
    const jobRequirements = JSON.parse(req.body.jobRequirements || '{}');
    const jobId = req.body.jobId;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Vui lòng tải lên file CV' });
    }

    tempFilePath = req.file.path;

    if (!jobRequirements) {
      return res.status(400).json({ error: 'Thiếu thông tin yêu cầu công việc' });
    }

    console.log('Analyzing CV with Gemini AI:', req.file.originalname);
    
    // Trích xuất text từ CV
    const cvText = await extractTextFromCV(tempFilePath, req.file.mimetype);
    
    if (!cvText || cvText.trim().length < 50) {
      return res.status(400).json({ error: 'Không thể đọc nội dung CV hoặc CV quá ngắn' });
    }

    // Phân tích với Gemini
    const analysis = await analyzeCV(cvText, jobRequirements);
    
    res.json({
      success: true,
      analysis: analysis,
      filename: req.file.originalname,
      aiProvider: 'Google Gemini',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in CV analysis:', error);
    res.status(500).json({ 
      error: 'Có lỗi xảy ra khi phân tích CV', 
      details: error.message 
    });
  } finally {
    // Xóa file tạm
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
});

// POST /api/ai-screening/analyze-existing - Phân tích CV đã có sẵn
router.post('/analyze-existing', async (req, res) => {
  try {
    const { cv_path, jobRequirements, applicationId } = req.body;
    const db= req.db;
    
    console.log("Analyzing existing CV:", { cv_path, applicationId });
    
    // Kiểm tra file tồn tại
    if (!fs.existsSync(cv_path)) {
      console.error("CV file not found:", cv_path);
      return res.status(404).json({ 
        success: false, 
        message: `File CV không tồn tại: ${cv_path}` 
      });
    }
    
    // Xác định MIME type dựa vào phần mở rộng
    const fileExt = path.extname(cv_path).toLowerCase();
    const mimeType = fileExt === '.pdf' ? 'application/pdf' : '';
                    
    
    // Trích xuất text từ CV
    const cvText = await extractTextFromCV(cv_path, mimeType);
    
    if (!cvText || cvText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Không thể trích xuất nội dung từ CV hoặc CV quá ngắn"
      });
    }
    
    // Phân tích với Gemini
    const analysis = await analyzeCV(cvText, jobRequirements);
        if (analysis && analysis.overallScore !== undefined && applicationId) {
      const analysisJson = JSON.stringify(analysis);
      const aiscore = analysis.overallScore;
      const updateSql = "UPDATE applications SET ai_score = ?, ai_analysis = ? WHERE id = ?";

      db.query(updateSql, [aiscore, analysisJson, applicationId], (err, result) => {
        if (err) {
          // Log lỗi nhưng không làm gián đoạn quá trình trả về kết quả cho người dùng
          console.error("Error saving AI analysis to DB:", err);
        } else {
          console.log(`AI analysis saved for application ID: ${applicationId}`);
        }
      });
    }
    return res.status(200).json({
      success: true,
      analysis: analysis,
      filename: path.basename(cv_path),
      aiProvider: 'Google Gemini',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in CV analysis:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể phân tích CV",
      error: error.message
    });
  }
});

// GET /api/ai-screening/health - Kiểm tra trạng thái AI service
router.get('/health', async (req, res) => {
  try {
    const isConnected = await checkAIConnection();
    res.json({
      status: isConnected ? 'healthy' : 'unhealthy',
      provider: 'Google Gemini',
      timestamp: new Date().toISOString(),
      apiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      provider: 'Google Gemini',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
router.get('/check-folder', (req, res) => {
  const folder = path.join("D:", "CV_Storage", "uploaded_cvs");
  try {
    if (fs.existsSync(folder)) {
      const files = fs.readdirSync(folder);
      res.json({
        exists: true,
        fileCount: files.length,
        files: files.slice(0, 10) // Chỉ hiển thị 10 file đầu tiên
      });
    } else {
      res.json({
        exists: false,
        message: "Thư mục không tồn tại"
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
module.exports = router;