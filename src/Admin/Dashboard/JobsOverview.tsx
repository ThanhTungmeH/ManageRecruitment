import React from 'react';
import { MapPin, Users, Clock } from 'lucide-react';

const JobsOverview: React.FC = () => {
  // Tạm thời hiển thị thông báo cho đến khi tích hợp API
  interface Job {
    id: string;
    title: string;
    location: string;
    applicationCount: number;
    postedDate: Date;
    department: string;
    type: string;
    priority: 'high' | 'medium' | 'low';
    status: 'active' | 'paused' | 'closed' | string;
  }

  const jobs: Job[] = [];

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      'active': 'Đang tuyển',
      'paused': 'Tạm dừng',
      'closed': 'Đã đóng'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'border-l-red-500',
      'medium': 'border-l-yellow-500',
      'low': 'border-l-green-500'
    };
    return colors[priority as keyof typeof colors] || 'border-l-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Vị trí tuyển dụng</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Quản lý vị trí
        </button>
      </div>
      
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Đang tải dữ liệu việc làm...</p>
          </div>
        ) : (
          jobs.slice(0, 4).map((job) => (
          <div key={job.id} className={`border border-gray-100 rounded-lg p-4 border-l-4 ${getPriorityColor(job.priority)} hover:bg-gray-50 transition-colors`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{job.title}</h4>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{job.applicationCount} ứng viên</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor((Date.now() - job.postedDate.getTime()) / (1000 * 60 * 60 * 24))} ngày</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {job.department}
                  </span>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    {job.type}
                  </span>
                </div>
              </div>
              
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {getStatusText(job.status)}
              </span>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobsOverview;