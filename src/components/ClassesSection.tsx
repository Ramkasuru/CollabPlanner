import React, { useState } from 'react';
import { BookOpen, Calendar, CheckCircle, Plus, X } from 'lucide-react';
import { Class, Homework } from '../types';

interface ClassesSectionProps {
  classes: Class[];
  onUpdateClasses: (classes: Class[]) => void;
}

const ClassesSection: React.FC<ClassesSectionProps> = ({ classes, onUpdateClasses }) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [newHomework, setNewHomework] = useState({ title: '', dueDate: '', subject: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleHomework = (classId: string, homeworkId: string) => {
    const updatedClasses = classes.map(cls => {
      if (cls.id === classId) {
        return {
          ...cls,
          homework: cls.homework.map(hw => 
            hw.id === homeworkId ? { ...hw, completed: !hw.completed } : hw
          )
        };
      }
      return cls;
    });
    onUpdateClasses(updatedClasses);
  };

  const handleAddHomework = (classId: string) => {
    if (!newHomework.title || !newHomework.dueDate) return;

    const homework: Homework = {
      id: Date.now().toString(),
      title: newHomework.title,
      dueDate: new Date(newHomework.dueDate),
      completed: false,
      subject: newHomework.subject || 'General'
    };

    const updatedClasses = classes.map(cls => {
      if (cls.id === classId) {
        return { ...cls, homework: [...cls.homework, homework] };
      }
      return cls;
    });

    onUpdateClasses(updatedClasses);
    setNewHomework({ title: '', dueDate: '', subject: '' });
    setShowAddForm(false);
  };

  const getUpcomingDeadlines = () => {
    const allHomework = classes.flatMap(cls => cls.homework.filter(hw => !hw.completed));
    return allHomework
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Calendar size={20} />
          <span>Upcoming Deadlines</span>
        </h3>
        <div className="space-y-2">
          {getUpcomingDeadlines().map(homework => (
            <div key={homework.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <p className="text-white text-sm">{homework.title}</p>
                <p className="text-gray-400 text-xs">{homework.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-amber-400 text-sm">
                  {new Date(homework.dueDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">
                  {Math.ceil((new Date(homework.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <BookOpen size={20} />
          <span>My Classes</span>
        </h3>
        
        <div className="space-y-4">
          {classes.map(cls => (
            <div key={cls.id} className="border border-gray-700 rounded-lg">
              <button
                onClick={() => setSelectedClass(selectedClass === cls.id ? null : cls.id)}
                className="w-full p-4 text-left hover:bg-gray-700 transition-colors rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{cls.name}</h4>
                    <p className="text-sm text-gray-400">
                      {cls.homework.filter(hw => !hw.completed).length} pending assignments
                    </p>
                  </div>
                  <div className="text-gray-400">
                    {selectedClass === cls.id ? '−' : '+'}
                  </div>
                </div>
              </button>
              
              {selectedClass === cls.id && (
                <div className="p-4 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-white font-medium">Assignments</h5>
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {showAddForm ? <X size={16} /> : <Plus size={16} />}
                    </button>
                  </div>
                  
                  {showAddForm && (
                    <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Assignment title"
                          value={newHomework.title}
                          onChange={(e) => setNewHomework({...newHomework, title: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Subject"
                          value={newHomework.subject}
                          onChange={(e) => setNewHomework({...newHomework, subject: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                        <input
                          type="date"
                          value={newHomework.dueDate}
                          onChange={(e) => setNewHomework({...newHomework, dueDate: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        />
                        <button
                          onClick={() => handleAddHomework(cls.id)}
                          className="w-full px-3 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors"
                        >
                          Add Assignment
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {cls.homework.map(homework => (
                      <div key={homework.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleToggleHomework(cls.id, homework.id)}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                              homework.completed 
                                ? 'bg-emerald-600 border-emerald-600' 
                                : 'border-gray-500 hover:border-emerald-500'
                            }`}
                          >
                            {homework.completed && <CheckCircle size={10} className="text-white" />}
                          </button>
                          <div>
                            <p className={`text-sm ${homework.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                              {homework.title}
                            </p>
                            <p className="text-xs text-gray-400">{homework.subject}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            Due: {new Date(homework.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassesSection;