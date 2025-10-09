import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  Home,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "jobs", label: "Vị trí tuyển dụng", icon: Briefcase },
    { id: "candidates", label: "Ứng viên", icon: Users },
    { id: "interviews", label: "Phỏng vấn", icon: Calendar },
    { id: "home", label: "Trang chủ", icon: Home },
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === "home") {
      navigate("/"); // Điều hướng về trang chủ (Index.tsx)
    } else {
      onTabChange(tabId);
      navigate(`/admin/${tabId}`);
    }
  };
  const isActive = (itemId: string) => {
    const currentPath = location.pathname;
    return currentPath.startsWith(`/admin/${itemId}`);
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">RecruitAI</h1>
            <p className="text-sm text-gray-500">Hệ thống tuyển dụng</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-6 text-left transition-colors ${
                isActive(item.id)
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
