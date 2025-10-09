import React from 'react';
import { X, Star, TrendingUp, CheckCircle, XCircle, Award, Brain } from 'lucide-react';
import { AIScoreResult } from '../../types';

interface AIScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AIScoreResult;
}

const AIScoreModal: React.FC<AIScoreModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // const getScoreColorBg = (score: number) => {
  //   if (score >= 80) return 'from-green-500 to-green-600';
  //   if (score >= 60) return 'from-yellow-500 to-yellow-600';
  //   return 'from-red-500 to-red-600';
  // };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Kết quả AI đánh giá</h2>
              <p className="text-gray-600">Phân tích chi tiết bởi Google Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Overall Score */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Điểm tổng quan</h3>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(result.overallScore || 0)}`}>
                    {result.overallScore || 0}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">AI Match Score</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">{result.ranking}</div>
                  <div className="text-sm text-gray-600">Xếp hạng</div>
                </div>
              </div>
            </div>

            {/* Fit Score Breakdown */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Tổng thể', score: result.fitScore?.overall || 0, icon: Award },
                { label: 'Kỹ năng', score: result.fitScore?.skills || 0, icon: Star },
                { label: 'Kinh nghiệm', score: result.fitScore?.experience || 0, icon: TrendingUp },
                { label: 'Học vấn', score: result.fitScore?.education || 0, icon: CheckCircle }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${getScoreColor(item.score).split(' ')[0]}`}>
                      {item.score}%
                    </div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Điểm mạnh
              </h4>
              <ul className="space-y-3">
                {result.strengths?.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                Điểm cần cải thiện
              </h4>
              <ul className="space-y-3">
                {result.weaknesses?.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skills Analysis */}
          {/* {result.skills && result.skills.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                Phân tích kỹ năng
              </h4>
              <div className="space-y-3">
                {result.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-28 text-sm font-medium text-gray-700 flex items-center">
                      {skill.name}
                      {skill.required && <Star className="w-3 h-3 text-red-500 ml-1" />}
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <div className="w-full h-6 bg-gray-200 rounded-lg overflow-hidden">
                          <div 
                            className={`h-full rounded-lg transition-all duration-1000 bg-gradient-to-r ${getScoreColorBg(skill.match || 0)}`}
                            style={{ width: `${skill.match || 0}%` }}
                          ></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{skill.match || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Experience & Education */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Experience */}
            {result.experience && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Kinh nghiệm</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Số năm:</span>
                    <span className="font-medium text-blue-900">{result.experience.years} năm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Cấp độ:</span>
                    <span className="font-medium text-blue-900 capitalize">{result.experience.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Liên quan:</span>
                    <span className={`font-medium ${result.experience.relevant ? 'text-green-600' : 'text-red-600'}`}>
                      {result.experience.relevant ? 'Có' : 'Không'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Education */}
            {result.education && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3">Học vấn</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Bằng cấp:</span>
                    <span className="font-medium text-purple-900">{result.education.degree}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Điểm số:</span>
                    <span className="font-medium text-purple-900">{result.education.score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Liên quan:</span>
                    <span className={`font-medium ${result.education.relevant ? 'text-green-600' : 'text-red-600'}`}>
                      {result.education.relevant ? 'Có' : 'Không'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Brain className="w-5 h-5 text-blue-600 mr-2" />
              Khuyến nghị của AI
            </h4>
            <p className="text-gray-800 leading-relaxed">{result.recommendation}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Phân tích bởi Google Gemini AI • {new Date().toLocaleString('vi-VN')}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIScoreModal;