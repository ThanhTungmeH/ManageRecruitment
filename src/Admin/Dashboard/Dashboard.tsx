// filepath: d:\JSproject\TTTT\src\Admin\Dashboard\Dashboard.tsx
import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import RecentApplications from './RecentApplications';
import JobsOverview from './JobsOverview';
import SkillsChart from './SkillsChart';
import { Skeleton } from '../../components/skeleton';
import { dashboardAPI } from '../../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Tuyển dụng</h1>
        <p className="text-gray-600 mt-1">Tổng quan về hoạt động tuyển dụng của công ty</p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}
        </div>
      ) : (
        <StatsCards stats={stats} />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? <Skeleton className="h-96 w-full" /> : <RecentApplications applications={stats?.recentApplications || []} />}
        </div>
        {loading ? <Skeleton className="h-96 w-full" /> : <SkillsChart skills={stats?.topSkills || []} />}
      </div>
      
      {loading ? <Skeleton className="h-80 w-full" /> : <JobsOverview jobs={stats?.jobsOverview || []} />}
    </div>
  );
};

export default Dashboard;