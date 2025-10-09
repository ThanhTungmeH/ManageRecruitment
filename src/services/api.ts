import axios from "axios";
import {
  Application,
  Candidate,
  InterviewScheduleData,
  Job,
  JobFormData,
  Interview,
} from "../types";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - có thể redirect to login
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);
// Jobs API
export const jobsAPI = {
  // Lấy tất cả jobs
  getAllJobs: async (): Promise<Job[]> => {
    try {
      const response = await api.get("/jobs");
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },
  // Cập nhật trạng thái job
  updateJobStatus: async (
    id: string,
    status: string
  ): Promise<{ message: string }> => {
    try {
      const response = await api.put(`/jobs/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating job status:", error);
      throw new Error("Không thể cập nhật trạng thái công việc");
    }
  },
  // Lấy job theo ID
  getJobById: async (id: string): Promise<Job> => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job:", error);
      throw error;
    }
  },

  // Tạo job mới
  createJob: async (
    jobData: JobFormData
  ): Promise<{ id: number; message: string }> => {
    try {
      const response = await api.post("/jobs", jobData);
      return response.data;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  },

  // Cập nhật job
  updateJob: async (
    id: string,
    jobData: Partial<JobFormData>
  ): Promise<{ message: string }> => {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  },

  // Xóa job
  deleteJob: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  },
  // Cập nhật số lượng ứng viên
  updateApplicantCounts: async (): Promise<void> => {
    try {
      await api.post("/jobs/update-applicant-counts");
    } catch (error) {
      console.error("Error updating applicant counts:", error);
      throw error;
    }
  },
};

// Applications API
export const applicationsAPI = {
  // Nộp đơn ứng tuyển
  submitApplication: async (formData: FormData): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      credentials: "include",
      body: formData, // FormData tự động set Content-Type
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Không thể gửi đơn ứng tuyển");
    }

    return response.json();
  },

  getAllCandidates: async (): Promise<Candidate[]> => {
    try {
      const response = await api.get("/applications/candidates");
      console.log("API response candidates:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Error fetching candidates:", error);
      throw new Error("Không thể tải danh sách ứng viên");
    }
  },

  // Lấy danh sách đơn ứng tuyển của user
  getUserApplications: async (): Promise<Application[]> => {
    try {
      const response = await api.get("/applications/my-applications");
      return response.data;
    } catch (error) {
      console.error("Error fetching user applications:", error);
      throw new Error("Không thể tải danh sách đơn ứng tuyển");
    }
  },

  // Lấy danh sách ứng viên cho job (admin only)
  getJobApplications: async (jobId: string): Promise<Application[]> => {
    try {
      const response = await api.get(`/applications/job/${jobId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job applications:", error);
      throw new Error("Không thể tải danh sách ứng viên");
    }
  },
  // Cập nhật trạng thái ứng tuyển
  updateApplicationStatus: async (
    applicationId: string,
    status: string
  ): Promise<{ message: string }> => {
    try {
      const response = await api.put(`/applications/${applicationId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating application status:", error);
      throw new Error("Không thể cập nhật trạng thái ứng tuyển");
    }
  },
  // Download CV
  downloadCV: async (applicationId: string): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/applications/download-cv/${applicationId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Download error response:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        throw new Error(errorData.error || "Không thể tải file CV");
      }

      // Kiểm tra Content-Type
      const contentType = response.headers.get("Content-Type");
      console.log("Content-Type:", contentType);

      // Lấy filename từ Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `CV_${applicationId}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      console.log("Filename:", filename);

      // Tạo blob và download
      const blob = await response.blob();
      console.log("Blob created, size:", blob.size, "type:", blob.type);

      if (blob.size === 0) {
        throw new Error("File rỗng hoặc không tồn tại");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log("Download completed successfully");
    } catch (error) {
      console.error("Error downloading CV:", error);
      throw error;
    }
  },
};

// Interviews API
export const interviewAPI = {
  // Schedule a new interview
  // Lên lịch phỏng vấn
  scheduleInterview: async (
    data: InterviewScheduleData
  ): Promise<{ message: string; interviewId: number }> => {
    try {
      const response = await api.post("/interviews", data);

      return response.data;
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { error?: string } } };
        if (err.response?.data?.error) {
          throw new Error(err.response.data.error);
        }
      }
      throw new Error("Không thể lên lịch phỏng vấn");
    }
  },

  // Lấy tất cả phỏng vấn
  getAllInterviews: async (): Promise<Interview[]> => {
    try {
     
      const response = await api.get("/interviews");
  
      return response.data;
    } catch  {
    
      throw new Error("Không thể tải danh sách phỏng vấn");
    }
  },
  // Kiểm tra ứng viên đã được lên lịch phỏng vấn chưa
  checkCandidateInterview: async (
    candidateId: string
  ): Promise<{
    hasScheduledInterview: boolean;
    interview?: {
      id: number;
      date: string;
      time: string;
      status: string;
      interviewer: string;
      location: string;
    };
  }> => {
    try {
      const response = await api.get(`/interviews/check/${candidateId}`);
      return response.data;
    } catch {
      throw new Error("Không thể kiểm tra trạng thái phỏng vấn");
    }
  },

  // Cập nhật trạng thái phỏng vấn
  updateInterviewStatus: async (
    interviewId: string,
    status: string
  ): Promise<{ message: string }> => {
    try {
      const response = await api.put(`/interviews/${interviewId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating interview status:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { error?: string } } };
        if (err.response?.data?.error) {
          throw new Error(err.response.data.error);
        }
      }
      throw new Error("Không thể cập nhật trạng thái phỏng vấn");
    }
  },
  // Lấy lịch phỏng vấn theo ID
  getInterviewById: async (interviewId: string): Promise<Interview> => {
    try {
      const response = await api.get(`/interviews/${interviewId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching interview:", error);
      throw new Error("Không thể tải thông tin phỏng vấn");
    }
  },
  // Cập nhật thông tin phỏng vấn
  updateInterview: async (
    interviewId: string,
    data: Partial<InterviewScheduleData>
  ): Promise<{ message: string }> => {
    try {
      const response = await api.put(`/interviews/${interviewId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating interview:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { error?: string } } };
        if (err.response?.data?.error) {
          throw new Error(err.response.data.error);
        }
      }
      throw new Error("Không thể cập nhật thông tin phỏng vấn");
    }
  },

  // Xóa phỏng vấn
  deleteInterview: async (
    interviewId: string
  ): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/interviews/${interviewId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting interview:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { error?: string } } };
        if (err.response?.data?.error) {
          throw new Error(err.response.data.error);
        }
      }
      throw new Error("Không thể xóa lịch phỏng vấn");
    }
  },
};

// AI Screening API
export const aiScreeningAPI = {
  // Phân tích CV đã có sẵn
  analyzeExistingCV: async (cvPath: string, jobRequirements: Record<string, unknown>, applicationId?: string) => {
    try {
      const response = await api.post('/ai-screening/analyze-existing', {
        cv_path: cvPath,
        jobRequirements,
        applicationId
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing existing CV:', error);
      throw new Error('Không thể phân tích CV với AI');
    }
  },

  // Kiểm tra trạng thái AI service
  checkHealth: async () => {
    try {
      const response = await api.get('/ai-screening/health');
      return response.data;
    } catch (error) {
      console.error('Error checking AI health:', error);
      throw new Error('Không thể kết nối với AI service');
    }
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
    return response.data;
  },
};