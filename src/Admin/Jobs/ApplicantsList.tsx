import React, { useState, useEffect } from "react";
import {
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  User,
  FileText,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Star,
} from "lucide-react";
import { Application, Job, AIScoreResult } from "../../types";
import { applicationsAPI, aiScreeningAPI, jobsAPI } from "../../services/api";
import AIScoreModal from "../AI/AIScoreModal";

interface ApplicantsListProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

const ApplicantsList: React.FC<ApplicantsListProps> = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [jobDetails, setJobDetails] = useState<Job | null>(null);

  const [aiResult, setAiResult] = useState<AIScoreResult | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchApplications();
      fetchJobDetails();
    }
  }, [isOpen, jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationsAPI.getJobApplications(jobId);
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Không thể tải danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  };
  const handleViewAIScore = async (application: Application) => {
    setAiLoading(true);
    try {
      // Kiểm tra nếu đã có kết quả phân tích AI trước đó
      if (application.ai_analysis) {
        try {
          const existingAnalysis = JSON.parse(application.ai_analysis);
          setAiResult(existingAnalysis);
          setShowAiModal(true);
          setAiLoading(false);
          return;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (parseError) {
          console.log("Existing AI analysis invalid, running new analysis");
        }
      }

      // Kiểm tra jobDetails
      if (!jobDetails) {
        await fetchJobDetails();
        if (!jobDetails) {
          alert("Không thể tải thông tin công việc");
          setAiLoading(false);
          return;
        }
      }

      // Tạo đường dẫn CV hợp lệ
      const cvPath =
        application.cv_path ||
        `D:\\CV_Storage\\uploaded_cvs\\${application.cv_filename}`;

      console.log("Sending CV for analysis:", {
        cv_path: cvPath,
        jobTitle,
      });

      // Phân tích CV mới sử dụng API
      const result = await aiScreeningAPI.analyzeExistingCV(
        cvPath,
        { ...jobDetails },
        application.id
      );

      console.log("AI analysis result:", result);

      if (!result || !result.analysis) {
        throw new Error("Kết quả phân tích không hợp lệ");
      }

      setAiResult(result.analysis);
      setShowAiModal(true);

      // Cập nhật application với kết quả AI mới
      setApplications((prev) =>
        prev.map((app) =>
          app.id === application.id
            ? {
                ...app,
                ai_score: result.analysis.overallScore,
                ai_analysis: JSON.stringify(result.analysis),
              }
            : app
        )
      );
    } catch (error) {
      console.error("AI analysis error:", error);
      alert(
        "Không thể phân tích AI: " +
          (error instanceof Error ? error.message : "Lỗi không xác định")
      );
    } finally {
      setAiLoading(false);
    }
  };
  const handleDownloadCV = async (applicationId: string) => {
    try {
      await applicationsAPI.downloadCV(applicationId);
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Không thể tải CV");
    }
  };

  const fetchJobDetails = async () => {
    try {
      const job = await jobsAPI.getJobById(jobId);
      setJobDetails(job);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const getAIScoreColor = (score?: number) => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewing: "bg-blue-100 text-blue-800",
      scheduled_interview: "bg-purple-100 text-purple-800",
      interviewed: "bg-indigo-100 text-indigo-800",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Danh sách ứng viên
            </h2>
            <p className="text-gray-600 mt-1">{jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có ứng viên nào
                </h3>
                <p className="text-gray-600">
                  Vị trí này chưa nhận được đơn ứng tuyển nào.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full">
              {/* Danh sách ứng viên */}
              <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {applications.length} ứng viên
                  </h3>
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className={`p-4 border border-gray-200 rounded-lg cursor-pointer transition-all ${
                          selectedApplication?.id === app.id
                            ? "border-blue-500 bg-blue-50"
                            : "hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedApplication(app)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {app.fullName}
                            </h4>
                            <p className="text-sm text-gray-600">{app.email}</p>
                            {/* AI Score Badge */}
                            {app.ai_score && (
                              <div className="flex items-center mt-2">
                                <Brain className="w-4 h-4 text-blue-500 mr-1" />
                                <span
                                  className={`text-sm font-medium ${getAIScoreColor(
                                    app.ai_score
                                  )}`}
                                >
                                  AI: {app.ai_score}%
                                </span>
                                {app.ai_score >= 80 && (
                                  <Star className="w-3 h-3 text-yellow-500 ml-1" />
                                )}
                              </div>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {getStatusText(app.status)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(app.submitted_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chi tiết ứng viên */}
              <div className="w-1/2 overflow-y-auto">
                {selectedApplication ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedApplication.fullName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {selectedApplication.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {selectedApplication.phone}
                        </div>
                      </div>

                      {/* AI Score Display */}
                      {selectedApplication.ai_score && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Brain className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="font-medium text-gray-900">
                                AI Đánh giá
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-2xl font-bold ${getAIScoreColor(
                                  selectedApplication.ai_score
                                )}`}
                              >
                                {selectedApplication.ai_score}%
                              </span>
                              {selectedApplication.ai_score >= 80 && (
                                <Star className="w-5 h-5 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      {/* Thông tin ứng tuyển */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Thông tin ứng tuyển
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Trạng thái:
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                selectedApplication.status
                              )}`}
                            >
                              {getStatusText(selectedApplication.status)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Ngày ứng tuyển:
                            </span>
                            <span className="text-sm font-medium">
                              {formatDate(selectedApplication.submitted_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Thư xin việc */}
                      {selectedApplication.coverLetter && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Thư xin việc
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {selectedApplication.coverLetter}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* CV */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">CV</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="text-sm font-medium">
                                {selectedApplication.cv_filename}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                handleDownloadCV(selectedApplication.id)
                              }
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Tải xuống
                            </button>

                            <button
                              className="inline-flex items-center ml-3 px-3 py-2 border border-transparent border-gray-300 text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                              onClick={() =>
                                handleViewAIScore(selectedApplication!)
                              }
                              disabled={aiLoading}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {aiLoading
                                ? "Đang phân tích..."
                                : "Xem AI đánh giá"}
                            </button>
                          </div>
                        </div>
                      </div>
                      {aiResult && (
                        <AIScoreModal
                          isOpen={showAiModal}
                          onClose={() => setShowAiModal(false)}
                          result={aiResult}
                        />
                      )}
                      {/* Actions */}
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Hành động
                        </h4>
                        <div className="flex space-x-3">
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Chấp nhận
                          </button>
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors">
                            <XCircle className="w-4 h-4 mr-1" />
                            Từ chối
                          </button>
                          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            <Clock className="w-4 h-4 mr-1" />
                            Đánh dấu đang xem xét
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Chọn ứng viên
                      </h3>
                      <p className="text-gray-600">
                        Nhấp vào một ứng viên để xem chi tiết
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantsList;
