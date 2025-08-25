import React, { useState } from 'react';
import { DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import { BudgetData, SpendingAnalysis } from '../types';
import PieChart from './PieChart';

interface BudgetTrackerProps {
  budgetData: BudgetData;
  onUpdateBudget: (data: BudgetData) => void;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ budgetData, onUpdateBudget }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(budgetData);
  const [aiAnalysis, setAiAnalysis] = useState<SpendingAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSave = () => {
    onUpdateBudget(editData);
    setIsEditing(false);
  };

  const generateAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis (replace with actual Gemini API call)
    setTimeout(() => {
      const analysis: SpendingAnalysis = {
        suggestion: `Based on your spending pattern of $${budgetData.dailySpending}/day, consider reducing dining out by 20% to save $${(budgetData.dailySpending * 0.2).toFixed(2)} daily.`,
        potentialSavings: budgetData.dailySpending * 0.2,
        category: "Dining & Entertainment"
      };
      setAiAnalysis(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <DollarSign size={20} />
            <span>Budget Overview</span>
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors text-sm"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Monthly Earning</label>
                <input
                  type="number"
                  value={editData.monthlyEarning}
                  onChange={(e) => setEditData({...editData, monthlyEarning: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Daily Earning</label>
                <input
                  type="number"
                  value={editData.dailyEarning}
                  onChange={(e) => setEditData({...editData, dailyEarning: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Daily Saving</label>
                <input
                  type="number"
                  value={editData.dailySaving}
                  onChange={(e) => setEditData({...editData, dailySaving: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Daily Spending</label>
                <input
                  type="number"
                  value={editData.dailySpending}
                  onChange={(e) => setEditData({...editData, dailySpending: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Monthly Earning:</span>
                <span className="text-emerald-400 font-medium">${budgetData.monthlyEarning}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Daily Earning:</span>
                <span className="text-emerald-400 font-medium">${budgetData.dailyEarning}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Daily Saving:</span>
                <span className="text-amber-400 font-medium">${budgetData.dailySaving}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Daily Spending:</span>
                <span className="text-red-400 font-medium">${budgetData.dailySpending}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <PieChart data={budgetData} />

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Sparkles size={20} />
            <span>AI Spending Analysis</span>
          </h3>
          <button
            onClick={generateAIAnalysis}
            disabled={isAnalyzing}
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 flex items-center space-x-1"
          >
            <TrendingUp size={14} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>

        {aiAnalysis ? (
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="mb-2">
              <span className="text-sm text-purple-400 font-medium">Recommendation:</span>
            </div>
            <p className="text-gray-300 text-sm mb-3">{aiAnalysis.suggestion}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Category: {aiAnalysis.category}</span>
              <span className="text-emerald-400 font-medium">
                Potential monthly savings: ${(aiAnalysis.potentialSavings * 30).toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Click "Analyze" to get AI-powered spending insights and savings recommendations.</p>
        )}
      </div>
    </div>
  );
};

export default BudgetTracker;