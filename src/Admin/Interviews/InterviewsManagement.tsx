import React, { useState } from 'react';
import { Calendar, Clock, User, Video, Phone, MapPin, Plus, Filter } from 'lucide-react';
import { mockInterviews } from '../../data/mockData';

const InterviewsManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInterviews = mockInterviews.filter(interview => 
    statusFilter === 'all' || interview.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      'scheduled': 'Đã lên lịch',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'onsite': return <MapPin className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: string) => {
    const texts = {
      'video': 'Video call',
      'phone': 'Điện thoại',
      'onsite': 'Tại văn phòng'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phỏng vấn</h1>
          <p className="text-gray-600 mt-1">Lên lịch và theo dõi các cuộc phỏng vấn</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Lên lịch phỏng vấn</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Danh sách
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'calendar' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Lịch
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredInterviews.map((interview) => (
              <div key={interview.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {interview.candidateName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{interview.candidateName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                          {getStatusText(interview.status)}
                        </span>
                      </div>
                      
                      <p className="text-blue-600 font-medium mb-3">{interview.position}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(interview.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(interview.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Phỏng vấn viên: {interview.interviewer}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(interview.type)}
                          <span>{getTypeText(interview.type)}</span>
                        </div>
                      </div>
                      
                      {/* {interview.feedback && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700"><strong>Phản hồi:</strong> {interview.feedback}</p>
                          {interview.rating && (
                            <div className="flex items-center mt-2">
                              <span className="text-sm text-gray-600 mr-2">Đánh giá:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <div
                                    key={star}
                                    className={`w-4 h-4 ${star <= interview.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                                  >
                                    ★
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )} */}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {interview.status === 'scheduled' && (
                      <>
                        <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                          Tham gia
                        </button>
                        <button className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium">
                          Đổi lịch
                        </button>
                        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                          Hủy
                        </button>
                      </>
                    )}
                    {interview.status === 'completed' && (
                      <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                        Xem kết quả
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chế độ xem lịch</h3>
            <p className="text-gray-600">Tính năng này sẽ được phát triển trong phiên bản tiếp theo</p>
          </div>
        )}
      </div>

      {/* Today's Interviews */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phỏng vấn hôm nay</h3>
        
        <div className="space-y-3">
          {filteredInterviews
            .filter(interview => {
              const today = new Date();
              const interviewDate = new Date(interview.date);
              return interviewDate.toDateString() === today.toDateString();
            })
            .map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {interview.candidateName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{interview.candidateName}</h4>
                    <p className="text-sm text-gray-600">{interview.position}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatTime(interview.date)}</p>
                    <p className="text-sm text-gray-600">{getTypeText(interview.type)}</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Tham gia
                  </button>
                </div>
              </div>
            ))}
          
          {filteredInterviews.filter(interview => {
            const today = new Date();
            const interviewDate = new Date(interview.date);
            return interviewDate.toDateString() === today.toDateString();
          }).length === 0 && (
            <p className="text-gray-500 text-center py-4">Không có phỏng vấn nào hôm nay</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewsManagement;