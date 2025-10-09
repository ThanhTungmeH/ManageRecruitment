import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";
import { Job } from "../../types";
import { jobsAPI } from "../../services/api";

const JobsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    jobId: string;
    jobTitle: string;
  }>({
    isOpen: false,
    jobId: "",
    jobTitle: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const jobsData = await jobsAPI.getAllJobs();
      setJobs(jobsData);
    } catch (err) {
      setError(
        "Không thể tải danh sách việc làm. Vui lòng kiểm tra kết nối database."
      );
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    navigate("/admin/jobs/new");
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/admin/jobs/edit/${jobId}`);
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/admin/jobs/${jobId}`);
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await jobsAPI.deleteJob(jobId);
      setJobs(jobs.filter((job) => job.id !== jobId));
      setDeleteConfirm({ isOpen: false, jobId: "", jobTitle: "" });
      alert("Xóa công việc thành công!");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Có lỗi xảy ra khi xóa công việc");
    }
  };

  const openDeleteConfirm = (jobId: string, jobTitle: string) => {
    setDeleteConfirm({ isOpen: true, jobId, jobTitle });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ isOpen: false, jobId: "", jobTitle: "" });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
      high: "text-red-600",
      medium: "text-yellow-600",
      low: "text-green-600",
    };
    return colors[urgency as keyof typeof colors] || "text-gray-600";
  };

  const getEmploymentTypeText = (type: string) => {
    const texts = {
      "full-time": "Full time",
      "part-time": "Part time",
      internship: "Internship",
    };
    return texts[type as keyof typeof texts] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ngày trước`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Lỗi kết nối</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchJobs}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý vị trí tuyển dụng
          </h1>
          <p className="text-gray-600 mt-1">
            Tạo và quản lý các vị trí tuyển dụng
          </p>
        </div>
        <button
          onClick={handleCreateJob}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo vị trí mới</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm vị trí, phòng ban..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang tuyển</option>
            <option value="paused">Tạm dừng</option>
            <option value="closed">Đã đóng</option>
          </select>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có vị trí tuyển dụng
            </h3>
            <p className="text-gray-600 mb-4">
              Bắt đầu bằng cách tạo vị trí tuyển dụng đầu tiên
            </p>
            <button
              onClick={handleCreateJob}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Tạo vị trí mới
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {getStatusText(job.status)}
                      </span>
                      <span
                        className={`text-xs font-medium ${getUrgencyColor(
                          job.urgency_level
                        )}`}
                      >
                        ● {job.urgency_level.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
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

                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {job.department}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {getEmploymentTypeText(job.employment_type)}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {job.experience_level}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewJob(job.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditJob(job.id)}
                      className="p-2 text-gray-400 hover:text-yellow-600 border border-gray-300 rounded-lg hover:border-yellow-300 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(job.id, job.title)}
                      className="p-2 text-gray-400 hover:text-red-600 border border-gray-300 rounded-lg hover:border-red-300 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Xác nhận xóa
                </h3>
                <p className="text-sm text-gray-600">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa vị trí tuyển dụng{" "}
              <strong>"{deleteConfirm.jobTitle}"</strong>?
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteJob(deleteConfirm.jobId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsManagement;
