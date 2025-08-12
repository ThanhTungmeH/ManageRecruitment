import React from 'react';
import { Briefcase, Users, Calendar, TrendingUp, Clock, Target } from 'lucide-react';
import { mockStats } from '../../data/mockData';

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Tổng số vị trí',
      value: mockStats.totalJobs,
      icon: Briefcase,
      color: 'bg-blue-500',
      change: '+3 vị trí mới',
      changeType: 'positive'
    },
    {
      title: 'Vị trí đang tuyển',
      value: mockStats.activeJobs,
      icon: Target,
      color: 'bg-green-500',
      change: '67% đang hoạt động',
      changeType: 'neutral'
    },
    {
      title: 'Tổng ứng viên',
      value: mockStats.totalCandidates,
      icon: Users,
      color: 'bg-purple-500',
      change: `+${mockStats.newApplications} ứng viên mới`,
      changeType: 'positive'
    },
    {
      title: 'Phỏng vấn hôm nay',
      value: mockStats.interviewsToday,
      icon: Calendar,
      color: 'bg-orange-500',
      change: '2 cuộc đã hoàn thành',
      changeType: 'neutral'
    },
    {
      title: 'Tuyển dụng tháng này',
      value: mockStats.hiredThisMonth,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      change: '+25% so với tháng trước',
      changeType: 'positive'
    },
    {
      title: 'Thời gian tuyển dụng TB',
      value: `${mockStats.averageTimeToHire} ngày`,
      icon: Clock,
      color: 'bg-red-500',
      change: '-2 ngày so với trước',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${
                stat.changeType === 'positive' ? 'text-green-600' : 
                stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;