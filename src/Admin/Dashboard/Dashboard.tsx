import React from 'react';
import StatsCards from './StatsCards';
import RecentApplications from './RecentApplications';
import JobsOverview from './JobsOverview';
import SkillsChart from './SkillsChart';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Tuyển dụng</h1>
        <p className="text-gray-600 mt-1">Tổng quan về hoạt động tuyển dụng của công ty</p>
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentApplications />
        <JobsOverview />
      </div>
      
      <SkillsChart />
    </div>
  );
};

export default Dashboard;