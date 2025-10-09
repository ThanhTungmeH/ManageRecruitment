import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Filter, Eye, Edit, Trash2, Search, CalendarDays } from 'lucide-react';
import { interviewAPI } from '../../services/api';
import { Interview } from '../../types';

const InterviewsManagement: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // Thêm filter ngày
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const data = await interviewAPI.getAllInterviews();
      setInterviews(data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions cho date filtering
  const isToday = (date: string) => {
    const today = new Date();
    const interviewDate = new Date(date);
    return interviewDate.toDateString() === today.toDateString();
  };

  const isThisWeek = (date: string) => {
    const today = new Date();
    const interviewDate = new Date(date);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 6);
    
    return interviewDate >= startOfWeek && interviewDate <= endOfWeek;
  };

  const isThisMonth = (date: string) => {
    const today = new Date();
    const interviewDate = new Date(date);
    return interviewDate.getMonth() === today.getMonth() && 
           interviewDate.getFullYear() === today.getFullYear();
  };

  const isInCustomRange = (date: string) => {
    if (!customDateRange.startDate || !customDateRange.endDate) return true;
    const interviewDate = new Date(date);
    const startDate = new Date(customDateRange.startDate);
    const endDate = new Date(customDateRange.endDate);
    return interviewDate >= startDate && interviewDate <= endDate;
  };

  // Filter interviews với date filter
  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = 
      interview.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter;
    
    let matchesDate = true;
    switch (dateFilter) {
      case "today":
        matchesDate = isToday(interview.interview_date);
        break;
      case "this_week":
        matchesDate = isThisWeek(interview.interview_date);
        break;
      case "this_month":
        matchesDate = isThisMonth(interview.interview_date);
        break;
      case "custom":
        matchesDate = isInCustomRange(interview.interview_date);
        break;
      default:
        matchesDate = true;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      rescheduled: "bg-yellow-100 text-yellow-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeText = (type: string) => {
    const texts = {
      video: "Video call",
      phone: "Điện thoại",
      onsite: "Tại văn phòng",
    };
    return texts[type as keyof typeof texts] || type;
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const dateStr = date.toLocaleDateString("vi-VN");
    const timeStr = date.toLocaleTimeString("vi-VN", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return { dateStr, timeStr };
  };

  const handleUpdateStatus = async (interviewId: string, newStatus: string) => {
    try {
      await interviewAPI.updateInterviewStatus(interviewId, newStatus);
      fetchInterviews();
    } catch (error) {
      console.error('Error updating interview status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý phỏng vấn
        </h1>
        <p className="text-gray-600">
          Xem và quản lý tất cả cuộc phỏng vấn đã được lên lịch
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {interviews.length}
              </p>
              <p className="text-gray-600">Tổng phỏng vấn</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {interviews.filter(i => i.status === "scheduled").length}
              </p>
              <p className="text-gray-600">Đã lên lịch</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarDays className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {interviews.filter(i => isToday(i.interview_date)).length}
              </p>
              <p className="text-gray-600">Hôm nay</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {interviews.filter(i => i.status === "cancelled").length}
              </p>
              <p className="text-gray-600">Đã hủy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên ứng viên, vị trí..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
              <option value="rescheduled">Đã đổi lịch</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="this_week">Tuần này</option>
              <option value="this_month">Tháng này</option>
              <option value="custom">Tùy chọn</option>
            </select>
          </div>

          {/* Add Button */}
          <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Lên lịch phỏng vấn
          </button>
        </div>

        {/* Custom Date Range */}
        {dateFilter === "custom" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={customDateRange.startDate}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={customDateRange.endDate}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold">{filteredInterviews.length}</span> trong tổng số <span className="font-semibold">{interviews.length}</span> cuộc phỏng vấn
        </p>
      </div>

      {/* Interviews Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* ...existing table code... */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ứng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phỏng vấn viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại & Địa điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredInterviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Không tìm thấy phỏng vấn nào phù hợp với bộ lọc
                  </td>
                </tr>
              ) : (
                filteredInterviews.map((interview) => (
                  <tr key={interview.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {interview.candidate_name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {interview.candidate_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {interview.job_title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(() => {
                          const { dateStr, timeStr } = formatDateTime(interview.interview_date);
                          return (
                            <>
                              <div className="font-medium">{dateStr}</div>
                              <div className="text-gray-500">
                                {timeStr} ({interview.duration} phút)
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{interview.interviewer}</div>
                        <div className="text-gray-500">{interview.interviewer_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{getTypeText(interview.type)}</div>
                        {interview.location && (
                          <div className="text-gray-500">{interview.location}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={interview.status}
                        onChange={(e) => handleUpdateStatus(interview.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(interview.status)} border-0 focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="scheduled">Đã lên lịch</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                        <option value="rescheduled">Đã đổi lịch</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InterviewsManagement;