import React, { useEffect, useState } from "react";
import {
  X,
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
  User,
  Clock,
} from "lucide-react";
import { Candidate, InterviewScheduleData } from "../../types";
import ScheduleInterviewModal from "../Interviews/ScheduleInterviewModal";
import { interviewAPI } from "../../services/api";

interface CandidateDetailModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  isOpen,
  onClose,
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [hasScheduledInterview, setHasScheduledInterview] = useState(false);
  const [, setInterviewInfo] = useState<{
    id: number;
    date: string;
    time: string;
    interviewer: string;
    location: string;
    status: string;
  } | null>(null);
  const [checkingInterview, setCheckingInterview] = useState(false);
    // Kiểm tra trạng thái phỏng vấn khi modal mở
  useEffect(() => {
    if (isOpen && candidate.id) {
      checkInterviewStatus();
    }
  }, [isOpen, candidate.id]);
    const checkInterviewStatus = async () => {
    try {
      setCheckingInterview(true);
      console.log('Checking interview status for candidate:', candidate.id);
      
      const result = await interviewAPI.checkCandidateInterview(candidate.id);
      console.log('Interview check result:', result);
      
      setHasScheduledInterview(result.hasScheduledInterview);
      
      if (result.hasScheduledInterview && result.interview) {
        setInterviewInfo({
          id: result.interview.id,
          date: result.interview.date,
          time: result.interview.time,
          interviewer: result.interview.interviewer,
          location: result.interview.location || 'Chưa xác định',
          status: result.interview.status
        });
      } else {
        setInterviewInfo(null);
      }
    } catch (error) {
      console.error('Error checking interview status:', error);
      // Nếu có lỗi, vẫn cho phép lên lịch
      setHasScheduledInterview(false);
      setInterviewInfo(null);
    } finally {
      setCheckingInterview(false);
    }
  };
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewing: "bg-blue-100 text-blue-800",
      scheduled_interview: "bg-purple-100 text-purple-800",
      interviewed: "bg-purple-100 text-purple-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: "Chờ duyệt",
      reviewing: "Đang xem xét",
      scheduled_interview: "Đã lên lịch phỏng vấn",
      interviewed: "Đã phỏng vấn",
      accepted: "Đã tuyển",
      rejected: "Từ chối",
    };
    return texts[status as keyof typeof texts] || status;
  };
  const handleScheduleInterview = async (
    scheduleData: InterviewScheduleData
  ) => {
    try {
      // Gọi API để lưu vào database
      await interviewAPI.scheduleInterview(scheduleData);

      alert("Lịch phỏng vấn đã được tạo thành công!");
      setShowScheduleModal(false);
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết ứng viên
              </h2>
              <p className="text-gray-600 mt-1">
                Thông tin chi tiết và lịch sử ứng tuyển
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Basic Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {candidate.full_name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {candidate.phone}
                    </div>
                  </div>
                </div>
                <div className="ml-auto">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      candidate.status
                    )}`}
                  >
                    {getStatusText(candidate.status)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {candidate.total_applications}
                  </div>
                  <div className="text-sm text-gray-600">Đơn ứng tuyển</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {candidate.job_titles.length}
                  </div>
                  <div className="text-sm text-gray-600">Vị trí ứng tuyển</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-900">
                    {new Date(
                      candidate.latest_application_date
                    ).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="text-sm text-gray-600">
                    Lần cuối ứng tuyển
                  </div>
                </div>
              </div>
            </div>

            {/* Applied Positions */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Vị trí đã ứng tuyển
              </h4>
              <div className="space-y-3">
                {candidate.job_titles.map((title, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">{title}</h5>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Ứng tuyển ngày{" "}
                          {new Date(
                            candidate.latest_application_date
                          ).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                        {candidate.cv_filename && (
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CV Information */}
            {candidate.cv_filename && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">CV</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {candidate.cv_filename}
                        </div>
                        <div className="text-sm text-gray-600">CV mới nhất</div>
                      </div>
                    </div>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors">
                      <Download className="w-4 h-4 mr-1" />
                      Tải xuống
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {(candidate.skills ||
              candidate.experience_level ||
              candidate.location) && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin bổ sung
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {candidate.experience_level && (
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Kinh nghiệm
                      </div>
                      <div className="text-gray-900">
                        {candidate.experience_level}
                      </div>
                    </div>
                  )}
                  {candidate.location && (
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Địa điểm
                      </div>
                      <div className="text-gray-900">{candidate.location}</div>
                    </div>
                  )}
                  {candidate.skills && (
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Kỹ năng
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {candidate.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {candidate.notes && candidate.notes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Ghi chú
                </h4>
                <div className="space-y-2">
                  {candidate.notes.map((note, index) => (
                    <div
                      key={index}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                    >
                      <div className="text-sm text-gray-700">{note}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              
              
              {/* Schedule Interview Button */}
              {checkingInterview ? (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center space-x-2"
                >
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang kiểm tra...</span>
                </button>
              ) : hasScheduledInterview ? (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center space-x-2"
                  title="Ứng viên này đã được lên lịch phỏng vấn"
                >
                  <Clock className="w-4 h-4" />
                  <span>Đã lên lịch phỏng vấn</span>
                </button>
              ) : (
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Lên lịch phỏng vấn</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Interview Schedule Modal */}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        candidate={candidate}
        onSchedule={handleScheduleInterview}
      />
    </>
  );
};

export default CandidateDetailModal;
