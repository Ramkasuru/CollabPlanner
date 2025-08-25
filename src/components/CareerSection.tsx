import React, { useState } from 'react';
import { Target, TrendingUp, Clock, Plus, X, Sparkles } from 'lucide-react';
import { Career } from '../types';

interface CareerSectionProps {
  careers: Career[];
  onUpdateCareers: (careers: Career[]) => void;
}

const CareerSection: React.FC<CareerSectionProps> = ({ careers, onUpdateCareers }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    description: '',
    estimatedCompletion: ''
  });

  const handleAddCourse = () => {
    if (!newCourse.courseName || !newCourse.estimatedCompletion) return;

    const course: Career = {
      id: Date.now().toString(),
      courseName: newCourse.courseName,
      progress: 0,
      startDate: new Date(),
      estimatedCompletion: new Date(newCourse.estimatedCompletion),
      description: newCourse.description
    };

    onUpdateCareers([...careers, course]);
    setNewCourse({ courseName: '', description: '', estimatedCompletion: '' });
    setShowAddForm(false);
  };

  const handleProgressUpdate = (id: string, newProgress: number) => {
    const updatedCareers = careers.map(career =>
      career.id === id ? { ...career, progress: newProgress } : career
    );
    onUpdateCareers(updatedCareers);
  };

  const requestAIUpdate = async (courseId: string) => {
    // Simulate AI progress update (replace with actual Gemini API call)
    const randomProgress = Math.min(100, Math.floor(Math.random() * 20) + 70);
    handleProgressUpdate(courseId, randomProgress);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Target size={20} />
            <span>Career Development</span>
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm flex items-center space-x-1"
          >
            {showAddForm ? <X size={14} /> : <Plus size={14} />}
            <span>{showAddForm ? 'Cancel' : 'Add Course'}</span>
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Course name"
                value={newCourse.courseName}
                onChange={(e) => setNewCourse({...newCourse, courseName: e.target.value})}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
              />
              <textarea
                placeholder="Course description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm h-20 resize-none"
              />
              <input
                type="date"
                value={newCourse.estimatedCompletion}
                onChange={(e) => setNewCourse({...newCourse, estimatedCompletion: e.target.value})}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
              />
              <button
                onClick={handleAddCourse}
                className="w-full px-3 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors"
              >
                Add Course
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {careers.map(career => (
            <div key={career.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{career.courseName}</h4>
                  <p className="text-gray-400 text-sm mt-1">{career.description}</p>
                </div>
                <button
                  onClick={() => requestAIUpdate(career.id)}
                  className="ml-4 p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  title="Request AI Progress Update"
                >
                  <Sparkles size={14} />
                </button>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-white font-medium">{career.progress}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(career.progress)}`}
                    style={{ width: `${career.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>Started: {new Date(career.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp size={12} />
                  <span>Target: {new Date(career.estimatedCompletion).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={career.progress}
                  onChange={(e) => handleProgressUpdate(career.id, parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          ))}

          {careers.length === 0 && (
            <div className="text-center py-8">
              <Target className="mx-auto mb-2 text-gray-500" size={32} />
              <p className="text-gray-400">No courses yet. Add your first career development goal!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerSection;