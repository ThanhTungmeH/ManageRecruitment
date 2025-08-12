import React from 'react';
import { mockStats } from '../../data/mockData';

const SkillsChart: React.FC = () => {
  const maxCount = Math.max(...mockStats.topSkills.map(skill => skill.count));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Kỹ năng phổ biến nhất</h3>
        <span className="text-sm text-gray-500">Dựa trên CV ứng viên</span>
      </div>
      
      <div className="space-y-4">
        {mockStats.topSkills.map((skill, index) => (
          <div key={skill.skill} className="flex items-center space-x-4">
            <div className="w-20 text-sm font-medium text-gray-700">
              {skill.skill}
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="w-full h-8 bg-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg transition-all duration-1000 ease-out"
                    style={{ width: `${(skill.count / maxCount) * 100}%` }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <span className="text-white font-medium text-sm">{skill.count} ứng viên</span>
                  <span className="text-white text-sm">{Math.round((skill.count / maxCount) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsChart;