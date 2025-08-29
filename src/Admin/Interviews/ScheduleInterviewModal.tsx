import React, { useState } from 'react';
import { X, Calendar, Clock, User, MapPin, Save } from 'lucide-react';
import { Candidate, InterviewScheduleData } from '../../types';

interface ScheduleInterviewModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (interviewData: InterviewScheduleData) => void;
}


const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onSchedule,
}) => {
  const [formData, setFormData] = useState<InterviewScheduleData>({
    candidateId: candidate.id,
    candidateName: candidate.full_name,
    candidateEmail: candidate.email,
    date: '',
    time: '',
    duration: 60,
    type: 'onsite', // Mặc định và cố định là offline
    interviewer: '',
    interviewerEmail: '',
    location: '',
    notes: '',
    jobTitle: candidate.job_titles[0] || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Vui lòng chọn ngày phỏng vấn';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Ngày phỏng vấn không thể là quá khứ';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Vui lòng chọn giờ phỏng vấn';
    }

    if (!formData.interviewer.trim()) {
      newErrors.interviewer = 'Vui lòng nhập tên người phỏng vấn';
    }

    if (!formData.interviewerEmail.trim()) {
      newErrors.interviewerEmail = 'Vui lòng nhập email người phỏng vấn';
    } else if (!/\S+@\S+\.\S+/.test(formData.interviewerEmail)) {
      newErrors.interviewerEmail = 'Email không hợp lệ';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Vui lòng nhập địa điểm phỏng vấn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSchedule(formData);
      onClose();
    } catch (error) {
      console.error('Error scheduling interview:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Lên lịch phỏng vấn trực tiếp
            </h2>
            <p className="text-gray-600 mt-1">
              Ứng viên: <span className="font-medium">{candidate.full_name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Candidate Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Thông tin ứng viên</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{candidate.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Điện thoại:</span>
                <span className="ml-2 font-medium">{candidate.phone}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600">Vị trí ứng tuyển:</span>
                <span className="ml-2 font-medium">{candidate.job_titles.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Interview Type Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <h4 className="font-medium text-blue-900">Phỏng vấn trực tiếp tại văn phòng</h4>
                <p className="text-sm text-blue-700">Ứng viên sẽ đến trực tiếp văn phòng công ty để phỏng vấn</p>
              </div>
            </div>
          </div>

          {/* Schedule Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày phỏng vấn <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={getMinDate()}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ phỏng vấn <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời lượng (phút)
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={30}>30 phút</option>
                <option value={45}>45 phút</option>
                <option value={60}>60 phút</option>
                <option value={90}>90 phút</option>
                <option value={120}>120 phút</option>
              </select>
            </div>

            {/* Interviewer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Người phỏng vấn <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="interviewer"
                  value={formData.interviewer}
                  onChange={handleInputChange}
                  placeholder="Tên người phỏng vấn"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.interviewer ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.interviewer && <p className="text-red-500 text-xs mt-1">{errors.interviewer}</p>}
            </div>
          </div>

          {/* Interviewer Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email người phỏng vấn <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="interviewerEmail"
              value={formData.interviewerEmail}
              onChange={handleInputChange}
              placeholder="interviewer@company.com"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.interviewerEmail ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.interviewerEmail && <p className="text-red-500 text-xs mt-1">{errors.interviewerEmail}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa điểm phỏng vấn <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <textarea
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                rows={3}
                placeholder="Ví dụ: Phòng họp A, Tầng 5, Tòa nhà ABC, 123 Đường XYZ, Quận 1, TP.HCM"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Hãy cung cấp địa chỉ chi tiết và hướng dẫn đường đi (nếu cần)
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú thêm
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Ghi chú về yêu cầu chuẩn bị, tài liệu mang theo, người liên hệ..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Additional Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2">Lưu ý cho ứng viên:</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Vui lòng đến đúng giờ hẹn</li>
              <li>• Mang theo CV và các giấy tờ liên quan</li>
              <li>• Ăn mặc lịch sự, chuyên nghiệp</li>
              <li>• Liên hệ HR nếu có thay đổi lịch hẹn</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Đang lên lịch...' : 'Lên lịch phỏng vấn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;