import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx'; 
import Index from './UserView/Home/index.tsx';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Recruitment from './UserView/Recruitment/Recruitment.tsx';
import JobDetail from './UserView/Recruitment/JobDetailUser.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Router>
      <Routes>
        {/* Route cho trang index */}
        <Route path="/" element={<Index />} />
        {/* Route cho trang tuyển dụng */}
        <Route path="/recruit" element={<Recruitment />} />
        <Route path="/recruit/:id" element={<JobDetail />} />
        {/* Route cho giao diện admin */}
        <Route path="/admin/*" element={<App />} />
      </Routes>
    </Router>
  </StrictMode>
);
