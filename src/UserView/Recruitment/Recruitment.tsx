import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,

  Calendar,
  Search,
  Filter,
  ArrowLeft,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { Job } from "../../types";
import { jobsAPI } from "../../services/api";

const Recruitment: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await jobsAPI.getAllJobs();
      // Chỉ hiển thị các job có status 'active'
      setJobs(data.filter((job) => job.status === "active"));
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lọc jobs theo các tiêu chí
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || job.department === selectedDepartment;
    const matchesLocation =
      !selectedLocation || job.location === selectedLocation;
    const matchesType = !selectedType || job.employment_type === selectedType;

    return matchesSearch && matchesDepartment && matchesLocation && matchesType;
  });

  // Lấy unique values cho filter options
  const departments = [...new Set(jobs.map((job) => job.department))];
  const locations = [...new Set(jobs.map((job) => job.location))];
  const employmentTypes = [...new Set(jobs.map((job) => job.employment_type))];

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      high: "text-red-600",
      medium: "text-yellow-600",
      low: "text-green-600",
    };
    return colors[urgency as keyof typeof colors] || "text-gray-600";
  };
  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };
  const getEmploymentTypeText = (type: string) => {
    const texts = {
      "full-time": "Full time",
      "part-time": "Part time",
      internship: "Internship",
    };
    return texts[type as keyof typeof texts] || type;
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: "Đang tuyển",
      paused: "Tạm dừng",
      closed: "Đã đóng",
    };
    return texts[status as keyof typeof texts] || status;
  };
  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case "full-time":
        return "Toàn thời gian";
      case "part-time":
        return "Bán thời gian";
      case "internship":
        return "Thực tập";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

   const handleViewDetail = (jobId: string) => {
    navigate(`/recruit/${jobId}`);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-100 to-indigo-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 left-4 sm:left-6 lg:left-8 flex items-center text-blue-200 hover:text-white mb-6 transition-colors group z-10"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium text-white">Trở về trang chủ</span>
          </button>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Cơ Hội Nghề Nghiệp
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Kiến tạo tương lai của bạn. Khám phá những vị trí đầy thử thách và trở thành một phần của đội ngũ tài năng.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Bộ lọc
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo vị trí, mô tả..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phòng ban
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả phòng ban</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa điểm
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả địa điểm</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employment Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại hình
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả loại hình</option>
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {getEmploymentTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("");
                  setSelectedLocation("");
                  setSelectedType("");
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                Vị trí đang tuyển ({filteredJobs.length})
              </h2>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy vị trí phù hợp
                </h3>
                <p className="text-gray-600">
                  Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
              </div>
            ) : (
              <div className="space-y-6">
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
                                {new Date(job.deadline).toLocaleDateString(
                                  "vi-VN"
                                )}
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
                            onClick={() => handleViewDetail(job.id)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Xem chi tiết
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
