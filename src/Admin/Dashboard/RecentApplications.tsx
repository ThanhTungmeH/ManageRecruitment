import React from 'react';
import { mockCandidates } from '../../data/mockData';
import { Eye, Mail, Phone } from 'lucide-react';

const RecentApplications: React.FC = () => {
  const recentApplications = mockCandidates
    .sort((a, b) => b.appliedDate.getTime() - a.appliedDate.getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'screening': 'bg-yellow-100 text-yellow-800',
      'interview': 'bg-purple-100 text-purple-800',
      'offer': 'bg-green-100 text-green-800',
      'hired': 'bg-emerald-100 text-emerald-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      'new': 'Mới',
      'screening': 'Sàng lọc',
      'interview': 'Phỏng vấn',
      'offer': 'Chào giá',
      'hired': 'Đã tuyển',
      'rejected': 'Từ chối'
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Ứng viên mới nhất</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Xem tất cả
        </button>
      </div>
      
      <div className="space-y-4">
        {recentApplications.map((candidate) => (
          <div key={candidate.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                <p className="text-sm text-gray-600">{candidate.position}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">{candidate.experience} năm kinh nghiệm</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{candidate.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-gray-900">AI Score: {candidate.aiScore}%</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                      style={{ width: `${candidate.aiScore}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                  {getStatusText(candidate.status)}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentApplications;