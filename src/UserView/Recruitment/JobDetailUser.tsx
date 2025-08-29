import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Send,
  Briefcase,
  Award,
  Building2,
  Tag,
  Package,
  List,
  LogIn,
  X,
} from "lucide-react";
import { ApplicationData, Job } from "../../types";
import { applicationsAPI, jobsAPI } from "../../services/api";
import ApplicationModal from "./ApplicationModal";

// Component Modal yêu cầu đăng nhập
const LoginRequiredModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Yêu cầu đăng nhập
          </h3>

          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để có thể ứng tuyển vào vị trí này. Vui lòng đăng
            nhập để tiếp tục.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onLogin}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying] = useState(false);
  useEffect(() => {
    if (id) {
      fetchJobDetail(id);
    }
    checkAuthentication();
  }, [id]);
  const checkAuthentication = async () => {
    try {
      const response = await fetch("http://localhost:3001/profile", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.email) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setIsAuthenticated(false);
    }
  };

  const fetchJobDetail = async (jobId: string) => {
    try {
      setLoading(true);
      const jobData = await jobsAPI.getJobById(jobId);
      setJob(jobData);
      setError(null);
    } catch (err) {
      setError("Không thể tải thông tin chi tiết công việc");
      console.error("Error fetching job detail:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleApply = async () => {
    if (!job) {
      alert("Thông tin công việc không hợp lệ");
      return;
    }

    // Check if job is still active
    if (job.status !== "active") {
      alert("Vị trí này hiện không còn nhận hồ sơ ứng tuyển");
      return;
    }

    // Check deadline
    if (job.deadline && new Date(job.deadline) < new Date()) {
      alert("Hạn nộp hồ sơ đã kết thúc");
      return;
    }
    // THÊM: Kiểm tra đã ứng tuyển chưa
    if (hasApplied) {
      alert(
        "Bạn đã ứng tuyển vào vị trí này rồi. Vui lòng chờ phản hồi từ nhà tuyển dụng."
      );
      return;
    }

    // Re-check authentication before applying
    await checkAuthentication();

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setShowApplicationModal(true);
  };

  const checkIfAlreadyApplied = async () => {
    if (!isAuthenticated || !job?.id) return;

    try {
      const applications = await applicationsAPI.getUserApplications();

      // SỬA: So sánh với jobId (theo Application type)
      const hasAppliedToJob = applications.some((app) => {
        const matches = String(app.job_id) === String(job.id);

        return matches;
      });

      setHasApplied(hasAppliedToJob);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };
  useEffect(() => {
    if (isAuthenticated && job) {
      checkIfAlreadyApplied();
    }
  }, [isAuthenticated, job]);

  const handleLogin = () => {
    // Lưu trữ ID công việc hiện tại để trả về sau khi đăng nhập
    localStorage.setItem("pendingApplicationJobId", job?.id || "");
    // Chuyển hướng đến trang đăng nhập Google
    window.location.href = "http://localhost:3001/auth/google";
  };
  useEffect(() => {
    const pendingJobId = localStorage.getItem("pendingApplicationJobId");
    if (pendingJobId && pendingJobId === id && isAuthenticated) {
      localStorage.removeItem("pendingApplicationJobId");
      setShowApplicationModal(true);
    }
  }, [isAuthenticated, id]);
  const handleSubmitApplication = async (applicationData: ApplicationData) => {
    try {
      console.log("Submitting application:", applicationData); // Debug log

      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append("jobId", applicationData.jobId);
      formData.append("fullName", applicationData.fullName);
      formData.append("email", applicationData.email);
      formData.append("phone", applicationData.phone);
      formData.append("coverLetter", applicationData.coverLetter);

      if (applicationData.cv) {
        formData.append("cv", applicationData.cv);
      }

      await applicationsAPI.submitApplication(formData);

      alert("Ứng tuyển thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
      setShowApplicationModal(false);
      setHasApplied(true);
      // Refresh job data
      if (id) {
        await fetchJobDetail(id);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Có lỗi xảy ra khi ứng tuyển. Vui lòng thử lại.");
    }
  };
  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-emerald-100 text-emerald-800", // Xanh ngọc tươi sáng hơn
      paused: "bg-amber-100 text-amber-800", // Vàng hổ phách
      closed: "bg-gray-100 text-gray-700",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: "Đang tuyển",
      paused: "Tạm dừng",
      closed: "Đã đóng",
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    };
    return (
      colors[urgency as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  const getEmploymentTypeText = (type: string) => {
    const texts = {
      "full-time": "Full time",
      "part-time": "Part time",
      internship: "Internship",
    };
    return texts[type as keyof typeof texts] || type;
  };

  const parseSkills = (skillsString: string): string[] => {
    if (!skillsString) return [];
    return skillsString.split(",").map((skill) => skill.trim());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Không tìm thấy công việc
          </h3>
          <p className="text-gray-600 mb-6">
            {error || "Công việc này có thể đã bị xóa hoặc không tồn tại."}
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Component phụ trợ cho các mục thông tin (giúp code gọn hơn và dễ quản lý style)

  // Component cho thẻ thông tin sidebar
  const SidebarInfoCard: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-5">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 ease-in-out py-2 px-3 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Quay lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Job Details Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Job Header Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>Đăng {formatDate(job.posted_date)}</span>
                    </div>
                    {job.deadline && (
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <span>
                          Hạn:{" "}
                          {new Date(job.deadline).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end space-y-2">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${getStatusColor(
                      job.status
                    )}`}
                  >
                    {getStatusText(job.status)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getUrgencyColor(
                      job.urgency_level
                    )}`}
                  >
                    {job.urgency_level.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {job.department}
                </span>
                <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                  {getEmploymentTypeText(job.employment_type)}
                </span>
                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  {job.experience_level}
                </span>
              </div>

              <button
                onClick={handleApply}
                disabled={job?.status !== "active" || isApplying || hasApplied}
                className={`inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl transition-all duration-300 ease-in-out font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-105 ${
                  hasApplied
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : job?.status !== "active"
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Send className="w-5 h-5" />
                <span>
                  {hasApplied
                    ? " Đã ứng tuyển"
                    : isApplying
                    ? "Đang xử lý..."
                    : "Ứng tuyển ngay"}
                </span>
              </button>
              {/* Modal yêu cầu đăng nhập */}
              <LoginRequiredModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLogin}
              />
              {/* Modal ứng tuyển */}
              <ApplicationModal
                isOpen={showApplicationModal}
                onClose={() => setShowApplicationModal(false)}
                jobTitle={job?.title || ""}
                jobId={job?.id || ""}
                onSubmit={handleSubmitApplication}
              />
            </div>

            {/* Job Description */}
            <SidebarInfoCard title="Mô tả công việc">
              <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed">
                {/* Sử dụng map để tạo danh sách nếu description là dạng list */}
                {job.description.split("\n").map((line, index) => (
                  <p key={index} className="flex items-start text-base mb-2">
                    <List className="w-4 h-4 text-blue-400 mr-2 mt-1 flex-shrink-0" />{" "}
                    {line}
                  </p>
                ))}
              </div>
            </SidebarInfoCard>

            {/* Requirements */}
            <SidebarInfoCard title="Yêu cầu công việc">
              <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed">
                {job.requirements.split("\n").map((line, index) => (
                  <p key={index} className="flex items-start text-base mb-2">
                    <List className="w-4 h-4 text-blue-400 mr-2 mt-1 flex-shrink-0" />{" "}
                    {line}
                  </p>
                ))}
              </div>
            </SidebarInfoCard>

            {/* Benefits */}
            {job.benefits && (
              <SidebarInfoCard title="Quyền lợi">
                <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed">
                  {job.benefits.split("\n").map((line, index) => (
                    <p key={index} className="flex items-start text-base mb-2">
                      <Package className="w-4 h-4 text-blue-400 mr-2 mt-1 flex-shrink-0" />{" "}
                      {line}
                    </p>
                  ))}
                </div>
              </SidebarInfoCard>
            )}

            {/* Skills Required */}
            {job.skills_required && (
              <SidebarInfoCard title="Kỹ năng yêu cầu">
                <div className="flex flex-wrap gap-2">
                  {parseSkills(job.skills_required).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 transition-transform duration-200 hover:scale-105"
                    >
                      <Tag className="w-3.5 h-3.5 mr-1.5" /> {skill}
                    </span>
                  ))}
                </div>
              </SidebarInfoCard>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Salary & Quick Info Card */}
            <SidebarInfoCard title="Thông tin chi tiết">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gray-900 leading-tight">
                    {job.salary || "Thỏa thuận"}
                  </div>
                  <div className="text-sm text-gray-600 mt-0.5">Mức lương</div>
                </div>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Loại hình:</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {getEmploymentTypeText(job.employment_type)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Kinh nghiệm:</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {job.experience_level}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Phòng ban:</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {job.department}
                  </span>
                </div>
                <div className="flex items-center space-x-5 border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Địa điểm:</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {job.address}
                  </span>
                </div>
              </div>
            </SidebarInfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
