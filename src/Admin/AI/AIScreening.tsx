import React, { useState } from 'react';
import { Upload, Bot, CheckCircle, XCircle, Star, TrendingUp } from 'lucide-react';

const AIScreening: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  type Skill = {
    name: string;
    match: number;
    required: boolean;
  };

  type AnalysisResult = {
    score: number;
    strengths: string[];
    weaknesses: string[];
    skills: Skill[];
    recommendation: string;
    ranking: string;
  };

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleFileUpload = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        score: 87,
        strengths: [
          'Kinh nghiệm React/TypeScript vững chắc (5 năm)',
          'Có kinh nghiệm lead team và mentor junior',
          'Portfolio dự án ấn tượng với các công nghệ hiện đại',
          'Kỹ năng giao tiếp và làm việc nhóm tốt'
        ],
        weaknesses: [
          'Thiếu kinh nghiệm với GraphQL',
          'Chưa có chứng chỉ AWS/Cloud',
          'Thiếu kinh nghiệm với microservices'
        ],
        skills: [
          { name: 'React', match: 95, required: true },
          { name: 'TypeScript', match: 90, required: true },
          { name: 'Node.js', match: 85, required: false },
          { name: 'GraphQL', match: 30, required: false },
          { name: 'AWS', match: 20, required: false }
        ],
        recommendation: 'Ứng viên phù hợp cao với vị trí Senior Frontend Developer. Có thể đào tạo thêm về GraphQL và AWS.',
        ranking: 'Top 10%'
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Sàng lọc CV</h1>
        <p className="text-gray-600 mt-1">Sử dụng AI để phân tích và đánh giá CV ứng viên tự động</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload CV để phân tích</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Kéo thả CV vào đây hoặc</p>
            <button 
              onClick={handleFileUpload}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isAnalyzing ? 'Đang phân tích...' : 'Chọn file'}
            </button>
            <p className="text-xs text-gray-500 mt-2">Hỗ trợ PDF, DOC, DOCX (tối đa 10MB)</p>
          </div>

          {isAnalyzing && (
            <div className="mt-6 flex items-center space-x-3">
              <Bot className="w-6 h-6 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-gray-900">AI đang phân tích CV...</p>
                <p className="text-sm text-gray-600">Đang trích xuất thông tin và so sánh với job requirements</p>
              </div>
            </div>
          )}
        </div>

        {/* Job Requirements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yêu cầu công việc</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Senior Frontend Developer</h4>
              <p className="text-sm text-gray-600 mb-3">Phòng Engineering • Ho Chi Minh City • Full-time</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Kỹ năng bắt buộc:</h5>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'JavaScript', '3+ years'].map(skill => (
                  <span key={skill} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs border border-red-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-2">Kỹ năng mong muốn:</h5>
              <div className="flex flex-wrap gap-2">
                {['Node.js', 'GraphQL', 'AWS', 'Docker'].map(skill => (
                  <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Kết quả phân tích AI</h3>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{analysisResult.score}%</div>
                <div className="text-sm text-gray-600">AI Match Score</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600">{analysisResult.ranking}</div>
                <div className="text-sm text-gray-600">Ranking</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Điểm mạnh
              </h4>
              <ul className="space-y-2">
                {analysisResult.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                Điểm cần cải thiện
              </h4>
              <ul className="space-y-2">
                {analysisResult.weaknesses.map((weakness: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              Phân tích kỹ năng
            </h4>
            <div className="space-y-3">
              {analysisResult.skills.map((skill: Skill, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium text-gray-700 flex items-center">
                    {skill.name}
                    {skill.required && <Star className="w-3 h-3 text-red-500 ml-1" />}
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <div className="w-full h-6 bg-gray-200 rounded-lg overflow-hidden">
                        <div 
                          className={`h-full rounded-lg transition-all duration-1000 ${
                            skill.match >= 80 ? 'bg-green-500' : 
                            skill.match >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${skill.match}%` }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{skill.match}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Khuyến nghị của AI:</h4>
            <p className="text-blue-800 text-sm">{analysisResult.recommendation}</p>
          </div>
        </div>
      )}

      {/* Recent Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích gần đây</h3>
        
        <div className="space-y-4">
          {[
            { name: 'Nguyen Van An', position: 'Senior Frontend Developer', score: 92, status: 'Recommended' },
            { name: 'Tran Thi Binh', position: 'UX/UI Designer', score: 88, status: 'Recommended' },
            { name: 'Le Minh Duc', position: 'Product Manager', score: 95, status: 'Highly Recommended' },
            { name: 'Pham Thu Hang', position: 'Data Scientist', score: 85, status: 'Recommended' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.position}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{item.score}%</div>
                  <div className="text-xs text-gray-500">AI Score</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Highly Recommended' ? 'bg-green-100 text-green-800' :
                  item.status === 'Recommended' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIScreening;