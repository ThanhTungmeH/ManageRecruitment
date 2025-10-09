import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../Dashboard/Dashboard";
import JobsManagement from "../Jobs/JobsManagement";
import CandidatesManagement from "../Candidates/Candidates";
import InterviewsManagement from "../Interviews/InterviewsManagement";
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
           
              </Routes>
            </main>
          </div>
  );
}


export default AdminLayout;