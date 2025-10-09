// filepath: d:\JSproject\TTTT\src\Admin\Dashboard\StatsCards.tsx
import React from 'react';
import { Briefcase, Users, Calendar, TrendingUp, Clock, Target } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalCandidates: number;
    newApplications: number;
    interviewsToday: number;
    hiredThisMonth: number;
    averageTimeToHire: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cardData = [
    { title: 'Tổng số vị trí', value: stats.totalJobs, icon: Briefcase, color: 'bg-blue-500' },
    { title: 'Vị trí đang tuyển', value: stats.activeJobs, icon: Target, color: 'bg-green-500' },
    { title: 'Tổng ứng viên', value: stats.totalCandidates, icon: Users, color: 'bg-purple-500', change: `+${stats.newApplications} mới (7 ngày)` },
    { title: 'Phỏng vấn hôm nay', value: stats.interviewsToday, icon: Calendar, color: 'bg-orange-500' },
    { title: 'Tuyển dụng tháng này', value: stats.hiredThisMonth, icon: TrendingUp, color: 'bg-indigo-500' },
    { title: 'Thời gian tuyển dụng TB', value: `${stats.averageTimeToHire} ngày`, icon: Clock, color: 'bg-red-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((stat, index) => {
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
            {stat.change && (
              <div className="mt-4">
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;