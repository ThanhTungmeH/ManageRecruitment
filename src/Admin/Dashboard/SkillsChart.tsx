// filepath: d:\JSproject\TTTT\src\Admin\Dashboard\SkillsChart.tsx
import React from 'react';

interface Skill {
  skill: string;
  count: number;
}

interface SkillsChartProps {
  skills: Skill[];
}

const SkillsChart: React.FC<SkillsChartProps> = ({ skills }) => {
  const maxCount = skills.length > 0 ? Math.max(...skills.map(skill => skill.count)) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Kỹ năng phổ biến nhất</h3>
      <div className="space-y-4">
        {skills.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Chưa có dữ liệu kỹ năng để phân tích.</p>
        ) : (
          skills.map((skill) => (
            <div key={skill.skill} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700 truncate" title={skill.skill}>
                {skill.skill}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-6 rounded-full flex items-center justify-end px-2 text-white text-xs font-medium"
                  style={{ width: maxCount > 0 ? `${(skill.count / maxCount) * 100}%` : '0%' }}
                >
                  {skill.count}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SkillsChart;