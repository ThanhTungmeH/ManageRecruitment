const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Khởi tạo model với các tham số đầy đủ
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.3,
    maxOutputTokens: 6144,
  },
});

// Cấu hình multer cho upload CV
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join("D:", "CV_Storage", "uploaded_cvs");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file PDF"), false);
    }
  },
  limits: {
    fileSize: 12 * 1024 * 1024, // 12MB
  },
});

// Trích xuất text từ CV
const extractTextFromCV = async (filePath, mimetype) => {
  try {
    let text = "";

    if (mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      text = data.text;
      //   console.log("-------- EXTRACTED TEXT FROM PDF --------");
      // console.log(`Text length: ${text.length} characters`);
      // console.log("First 500 characters:");
      // console.log(text);
     
      // console.log("----------------------------------------");
    } 
    return text;
  } catch (error) {
    console.error("Error extracting text from CV:", error);
    throw new Error("Không thể đọc nội dung CV");
  }
};

// Phân tích CV với Gemini AI
const analyzeCV = async (cvText, jobRequirements) => {
  const maxRetries = 3;
  let retryCount = 0;
  const baseDelay = 2000;

  while (retryCount < maxRetries) {
    try {
      console.log(
        `Phân tích CV với Gemini (lần thử ${retryCount + 1}/${maxRetries})`
      );

      const prompt = `
Bạn là một AI chuyên phân tích CV. Hãy phân tích CV sau đây và đánh giá mức độ phù hợp với mô tả công việc.

 ### CV:
      ${cvText}
      
      ### Mô tả công việc:
      ${JSON.stringify(jobRequirements)}
      
      ### Yêu cầu:
      1. Hãy cung cấp phân tích chi tiết về CV này
      2. Đánh giá mức độ phù hợp với vị trí dựa theo yêu cầu và mô tả công việc đã cho.
      3. Liệt kê điểm mạnh và điểm yếu dựa theo các tiêu chí yêu cầu và mô tả công việc.
      4. Đánh giá các kỹ năng phù hợp với mô tả công việc như trên hay không.
      5. Trả về kết quả CHÍNH XÁC theo định dạng JSON sau đây (không thêm markdown, giải thích hay bất kỳ text nào khác):
      
      {
        "overallScore": <điểm số từ 0-100>,
        "recommendation": "<khuyến nghị ngắn gọn>",
        "ranking": "<xếp loại: Rất phù hợp/Phù hợp/Cần cân nhắc/Không phù hợp>",
        "strengths": ["<điểm mạnh 1>", "<điểm mạnh 2>", ...],
        "weaknesses": ["<điểm yếu 1>", "<điểm yếu 2>", ...],
        "skills": [
          {"name": "<tên kỹ năng>", "match": <điểm số từ 0-100>, "required": <true/false>},
          ...
        ],
        "experience": {
          "years": <số năm kinh nghiệm>,
          "level": "<cấp bậc: junior/mid-level/senior>",
          "relevant": <true/false>
        },
        "education": {
          "degree": "<bằng cấp cao nhất>",
          "relevant": <true/false>,
          "score": <điểm đánh giá học vấn từ 0-100>
        },
        "fitScore": {
          "overall": <điểm tổng thể từ 0-100>,
          "skills": <điểm kỹ năng từ 0-100>,
          "experience": <điểm kinh nghiệm từ 0-100>,
          "education": <điểm học vấn từ 0-100>
        }
      }
      
      CHÚ Ý QUAN TRỌNG: Phản hồi của bạn PHẢI CHỈ bao gồm JSON hợp lệ, không có text giải thích, không có markdown.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
     
      const rawText = response.text(); 
    
      
      // Xử lý để tìm JSON từ phản hồi
      let jsonText = rawText;
      
      // Nếu kết quả bắt đầu hoặc kết thúc với markdown fences ```
      if (jsonText.includes('```')) {
        const jsonMatch = jsonText.match(/```(?:json)?\n?([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonText = jsonMatch[1].trim();
        }
      }
      
      // Tìm phần JSON trong văn bản nếu có { và }
      if (jsonText.indexOf('{') >= 0 && jsonText.indexOf('}') >= 0) {
        const start = jsonText.indexOf('{');
        const end = jsonText.lastIndexOf('}') + 1;
        if (start >= 0 && end > start) {
          jsonText = jsonText.substring(start, end);
        }
      }
      
      try {
        // Parse JSON
        
        const parsedResult = JSON.parse(jsonText);
        
        // Xác thực và chuẩn hóa kết quả
        return validateAndNormalizeResult(parsedResult);
      } catch (jsonError) {
        console.log("JSON parse error:", jsonError.message);
        console.log("Raw AI response:", rawText);
        
        // Nếu không thể parse JSON, thử sửa một số lỗi cú pháp phổ biến
        let fixedJson = jsonText
          .replace(/,\s*]/g, ']')         // Sửa lỗi dấu phẩy thừa trước ]
          .replace(/,\s*}/g, '}')         // Sửa lỗi dấu phẩy thừa trước }
          .replace(/'/g, '"')             // Thay ' bằng "
          .replace(/\n/g, ' ')            // Loại bỏ xuống dòng
          .replace(/([a-zA-Z0-9_]+):/g, '"$1":') // Thêm dấu ngoặc kép vào keys
          .replace(/:\s*"([^"]*?)"\s*([,}])/g, ':"$1"$2') // Sửa lỗi dấu nháy
          .replace(/:\s*'([^']*?)'\s*([,}])/g, ':"$1"$2'); // Sửa lỗi nháy đơn
          
        try {
        
          const parsedFixedResult = JSON.parse(fixedJson);
          console.log("Fixed JSON successfully");
          return validateAndNormalizeResult(parsedFixedResult);
        } catch (fixError) {
          console.log("Failed to fix JSON:", fixError.message);
          throw new Error("Không thể xử lý phản hồi từ AI");
        }
      }
    } catch (error) {
      console.error(`Lần thử ${retryCount + 1} thất bại:`, error.message);
      retryCount++;
      
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount - 1);
        console.log(`Waiting ${delay}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.log("⚠️ Max retries reached, using fallback response");
  return createFallbackResponse(cvText, jobRequirements);
};
// Validate và normalize kết quả
const validateAndNormalizeResult = (result) => {
  // Đảm bảo tất cả các trường cần thiết đều tồn tại
  const normalized = {
    overallScore: result.overallScore || 0,
    recommendation: result.recommendation || "Không có khuyến nghị",
    ranking: result.ranking || "Cần cân nhắc",
    strengths: Array.isArray(result.strengths) ? result.strengths : [],
    weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
    skills: Array.isArray(result.skills) ? result.skills : [],
    experience: result.experience || {
      years: 0,
      level: "junior",
      relevant: false
    },
    education: result.education || {
      degree: "Không xác định",
      relevant: false,
      score: 0
    },
    fitScore: result.fitScore || {
      overall: 0,
      skills: 0,
      experience: 0,
      education: 0
    }
  };
  
  // Đảm bảo mỗi kỹ năng có các trường cần thiết
  normalized.skills = normalized.skills.map(skill => ({
    name: skill.name || "Không xác định",
    match: skill.match || 0,
    required: !!skill.required
  }));
  
  return normalized;
};

// Tạo response fallback khi AI không khả dụng
const createFallbackResponse = (cvText, jobRequirements) => {
  const skillsFromJob = jobRequirements.skills_required
    ? jobRequirements.skills_required.split(",").map((s) => s.trim())
    : [];

  const foundSkills = skillsFromJob.map((skill) => {
    const found = cvText.toLowerCase().includes(skill.toLowerCase());
    return {
      name: skill,
      match: found ? 80 + Math.random() * 15 : 20 + Math.random() * 30,
      required: true,
    };
  });

  const foundRequiredSkills = foundSkills.filter((s) => s.match > 60).length;
  const skillScore =
    skillsFromJob.length > 0
      ? (foundRequiredSkills / skillsFromJob.length) * 100
      : 70;

  return {
    overallScore: Math.round(skillScore * 0.7 + 30),
    ranking:
      skillScore >= 85
        ? "Top 10%"
        : skillScore >= 70
        ? "Top 25%"
        : skillScore >= 50
        ? "Top 50%"
        : "Cần cải thiện",
    fitScore: {
      overall: Math.round((skillScore + 75 + 75) / 3),
      skills: Math.round(skillScore),
      experience: 75,
      education: 75,
    },
    recommendation:
      foundRequiredSkills >= skillsFromJob.length * 0.7
        ? "Ứng viên có tiềm năng tốt, khuyên nên mời phỏng vấn để đánh giá kỹ hơn"
        : "Ứng viên cần được đào tạo thêm về các kỹ năng thiếu, có thể xem xét cho vị trí junior",
    strengths: [
      foundRequiredSkills > 0
        ? `Có ${foundRequiredSkills} kỹ năng phù hợp với yêu cầu`
        : "CV được trình bày rõ ràng",
      "Thông tin cá nhân đầy đủ",
      "Định dạng CV chuyên nghiệp",
    ],
    weaknesses: [
      foundRequiredSkills < skillsFromJob.length
        ? "Thiếu một số kỹ năng bắt buộc"
        : "Cần đánh giá chi tiết hơn qua phỏng vấn",
      "Thông tin kinh nghiệm có thể chi tiết hơn",
    ],
    skills: foundSkills,
    experience: {
      years: cvText.match(/\d+\s*(năm|year)/i)
        ? parseInt(cvText.match(/\d+/)[0])
        : 2,
      level: skillScore >= 80 ? "senior" : skillScore >= 60 ? "mid" : "junior",
      relevant: true,
    },
    education: {
      degree:
        cvText.toLowerCase().includes("đại học") ||
        cvText.toLowerCase().includes("university")
          ? "Đại học"
          : "Chưa xác định",
      relevant: true,
      score: 75,
    },
  };
};

// Kiểm tra Gemini connection
const checkAIConnection = async () => {
  try {
    const testPrompt = "Trả về từ 'connected' nếu bạn nhận được tin nhắn này.";
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini AI connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Gemini connection failed:", error.message);
    return false;
  }
};

module.exports = {
  upload,
  extractTextFromCV,
  analyzeCV,
  checkAIConnection,
};
