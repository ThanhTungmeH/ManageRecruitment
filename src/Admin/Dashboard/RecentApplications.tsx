// filepath: d:\JSproject\TTTT\src\Admin\Dashboard\RecentApplications.tsx
import React from 'react';
import { getStatusColor, getStatusText } from '../../utils/statusUtils'; // Tạo file này nếu chưa có

interface Application {
  id: string;
  name: string;
  position: string;
  status: string;
  aiScore: number;
}

interface RecentApplicationsProps {
  applications: Application[];
}

const RecentApplications: React.FC<RecentApplicationsProps> = ({ applications }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Ứng viên mới nhất</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Xem tất cả
        </button>
      </div>
      
      <div className="space-y-4">
        {applications.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Chưa có ứng viên nào.</p>
        ) : (
          applications.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">AI Score: {candidate.aiScore}%</span>
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-1.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                      style={{ width: `${candidate.aiScore}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                  {getStatusText(candidate.status)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentApplications;