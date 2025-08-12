import axios from 'axios';
import { Application, Candidate, Job, JobFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jobsAPI = {
  // Lấy tất cả jobs
  getAllJobs: async (): Promise<Job[]> => {
    try {
      const response = await api.get('/jobs');
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Lấy job theo ID
  getJobById: async (id: string): Promise<Job> => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  },

  // Tạo job mới
  createJob: async (jobData: JobFormData): Promise<{ id: number; message: string }> => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  // Cập nhật job
  updateJob: async (id: string, jobData: Partial<JobFormData>): Promise<{ message: string }> => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  // Xóa job
  deleteJob: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },
};
// Thêm vào file api.ts hiện có




export const applicationsAPI = {
  // Nộp đơn ứng tuyển
  submitApplication: async (formData: FormData): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // FormData tự động set Content-Type
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Không thể gửi đơn ứng tuyển');
    }

    return response.json();
  },
  
  getAllCandidates: async (): Promise<Candidate[]> => {
    const response = await fetch(`${API_BASE_URL}/applications/candidates`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Không thể tải danh sách ứng viên');
    }

    const data = await response.json();
    console.log("API response candidates:", data); // Debug log
    return data;
  },
  // Lấy danh sách đơn ứng tuyển của user
  getUserApplications: async (): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications/my-applications`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Không thể tải danh sách đơn ứng tuyển');
    }

    return response.json();
  },

  // Lấy danh sách ứng viên cho job (admin only)
  getJobApplications: async (jobId: string): Promise<Application[]> => {
    const response = await fetch(`${API_BASE_URL}/applications/job/${jobId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Không thể tải danh sách ứng viên');
    }

    return response.json();
  },

  // Download CV
  downloadCV: async (applicationId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/applications/download-cv/${applicationId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Không thể tải file CV');
    }

    // Tạo blob và download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;

    
    a.download = `CV_${applicationId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
