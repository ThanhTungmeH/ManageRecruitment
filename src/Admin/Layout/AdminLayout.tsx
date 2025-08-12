import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../Dashboard/Dashboard";
import JobsManagement from "../Jobs/JobsManagement";
import CandidatesManagement from "../Candidates/Candidates";
import InterviewsManagement from "../Interviews/InterviewsManagement";
import AIScreening from "../AI/AIScreening";
import { Route, Routes } from 'react-router-dom';
import JobDetail from '../Jobs/JobsDetail';
import JobForm from '../Jobs/JobsForm';


const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location= useLocation();
  useEffect (() => {
    const path=location.pathname;
    if(path=== '/admin' || path === '/admin/dashboard') {
      setActiveTab('dashboard');
    }
    else {
       const segments = path.split('/admin/')[1]?.split('/');
      const tabName = segments?.[0];
      if(tabName) {
        setActiveTab(tabName);
      }
    }
  }, [location.pathname]);

  return (
    
          <div className="min-h-screen bg-gray-50">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <Header />
            <main className="ml-64 pt-16 p-6">
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="jobs/new" element={<JobForm />} />
                <Route path="jobs/edit/:id" element={<JobForm />} />
                <Route path="jobs/:id" element={<JobDetail />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<JobsManagement />} />
                <Route path="candidates" element={<CandidatesManagement />} />
                <Route path="interviews" element={<InterviewsManagement />} />
                <Route path="ai-screening" element={<AIScreening />} />
                <Route path="admin/reports" element={
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Báo cáo & Phân tích</h2>
                    <p className="text-gray-600">Tính năng này sẽ được phát triển trong phiên bản tiếp theo</p>
                  </div>
                } />
                <Route path="documents" element={
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Quản lý tài liệu</h2>
                    <p className="text-gray-600">Tính năng này sẽ được phát triển trong phiên bản tiếp theo</p>
                  </div>
                } />
                <Route path="settings" element={
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Cài đặt hệ thống</h2>
                    <p className="text-gray-600">Tính năng này sẽ được phát triển trong phiên bản tiếp theo</p>
                  </div>
                } />
                
              </Routes>
            </main>
          </div>
  );
}


export default AdminLayout;