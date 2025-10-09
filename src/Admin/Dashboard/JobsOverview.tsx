// filepath: d:\JSproject\TTTT\src\Admin\Dashboard\JobsOverview.tsx
import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { getStatusColor, getStatusText } from '../../utils/statusUtils';

interface Job {
  id: string;
  title: string;
  location: string;
  applicationCount: number;
  postedDate: string;
  department: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'paused' | 'closed' | string;
}

interface JobsOverviewProps {
  jobs: Job[];
}

const JobsOverview: React.FC<JobsOverviewProps> = ({ jobs }) => {
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
            <p className="text-gray-500">Không có vị trí nào đang hoạt động.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className={`border border-gray-100 rounded-lg p-4 border-l-4 ${getPriorityColor(job.priority)} hover:bg-gray-50 transition-colors`}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{job.title}</h4>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1"><MapPin className="w-4 h-4" /><span>{job.location}</span></div>
                    <div className="flex items-center space-x-1"><Users className="w-4 h-4" /><span>{job.applicationCount} ứng viên</span></div>
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