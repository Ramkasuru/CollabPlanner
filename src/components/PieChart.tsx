import React from 'react';
import { BudgetData } from '../types';

interface PieChartProps {
  data: BudgetData;
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const total = data.dailyEarning + data.dailySaving + data.dailySpending;
  
  const calculatePercentage = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  const earningPercentage = calculatePercentage(data.dailyEarning);
  const savingPercentage = calculatePercentage(data.dailySaving);
  const spendingPercentage = calculatePercentage(data.dailySpending);

  const createPath = (percentage: number, startAngle: number) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

    return `M 50,50 L ${x1},${y1} A 40,40 0 ${largeArcFlag},1 ${x2},${y2} Z`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Daily Budget Overview</h3>
      <div className="flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 100 100" className="transform -rotate-90">
          <path
            d={createPath(earningPercentage, 0)}
            fill="#10b981"
            className="hover:opacity-80 transition-opacity"
          />
          <path
            d={createPath(savingPercentage, (earningPercentage / 100) * 360)}
            fill="#f59e0b"
            className="hover:opacity-80 transition-opacity"
          />
          <path
            d={createPath(spendingPercentage, ((earningPercentage + savingPercentage) / 100) * 360)}
            fill="#ef4444"
            className="hover:opacity-80 transition-opacity"
          />
        </svg>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Daily Earning</span>
          </div>
          <span className="text-sm font-medium text-white">${data.dailyEarning}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Daily Saving</span>
          </div>
          <span className="text-sm font-medium text-white">${data.dailySaving}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Daily Spending</span>
          </div>
          <span className="text-sm font-medium text-white">${data.dailySpending}</span>
        </div>
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Monthly Earning</span>
            <span className="text-sm font-bold text-emerald-400">${data.monthlyEarning}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;