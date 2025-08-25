import React, { useState, useEffect } from 'react';
import { Plus, Check, Clock, AlertTriangle, SunSnow as Snooze } from 'lucide-react';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onSnoozeTodo: (id: string, hours: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onAddTodo, onToggleTodo, onSnoozeTodo }) => {
  const [newTodo, setNewTodo] = useState('');
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  const [snoozeId, setSnoozeId] = useState<string | null>(null);
  const [snoozeHours, setSnoozeHours] = useState(1);

  const activeTodos = todos.filter(todo => !todo.completed);
  const hasOverdueTasks = todos.some(todo => todo.isOverdue && !todo.completed);

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    
    if (activeTodos.length >= 6) {
      setShowMaxWarning(true);
      setTimeout(() => setShowMaxWarning(false), 3000);
      return;
    }

    if (hasOverdueTasks) {
      return; // Prevent adding new tasks when there are overdue ones
    }

    onAddTodo(newTodo.trim());
    setNewTodo('');
  };

  const handleSnooze = (todoId: string) => {
    onSnoozeTodo(todoId, snoozeHours);
    setSnoozeId(null);
  };

  const getTaskClassName = (todo: Todo) => {
    let baseClass = "bg-gray-800 rounded-lg p-4 transition-all duration-200 hover:bg-gray-750 border-l-4";
    
    if (todo.isOverdue && !todo.completed) {
      return `${baseClass} border-red-500 bg-red-900/20`;
    }
    
    if (todo.completed) {
      return `${baseClass} border-emerald-500 opacity-60`;
    }
    
    return `${baseClass} border-gray-600`;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Daily Tasks</h3>
        <span className="text-sm text-gray-400">{activeTodos.length}/6 tasks</span>
      </div>

      {hasOverdueTasks && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="text-red-400" size={16} />
          <span className="text-red-300 text-sm">High priority tasks must be finished to continue adding new ones</span>
        </div>
      )}

      <div className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            disabled={hasOverdueTasks}
          />
          <button
            onClick={handleAddTodo}
            disabled={hasOverdueTasks}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {showMaxWarning && (
          <p className="text-amber-400 text-sm mt-2 animate-pulse">Keep it real! Complete some tasks first.</p>
        )}
      </div>

      <div className="space-y-3">
        {todos.map((todo) => (
          <div key={todo.id} className={getTaskClassName(todo)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onToggleTodo(todo.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-emerald-600 border-emerald-600'
                      : 'border-gray-500 hover:border-emerald-500'
                  }`}
                >
                  {todo.completed && <Check size={12} className="text-white" />}
                </button>
                <span className={`${todo.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                  {todo.text}
                </span>
                {todo.isOverdue && !todo.completed && (
                  <AlertTriangle className="text-red-400" size={16} />
                )}
              </div>
              
              {!todo.completed && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSnoozeId(snoozeId === todo.id ? null : todo.id)}
                    className="p-1 text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <Snooze size={16} />
                  </button>
                  <Clock className="text-gray-400" size={14} />
                  <span className="text-xs text-gray-400">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            
            {snoozeId === todo.id && (
              <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">Remind me in:</span>
                  <select
                    value={snoozeHours}
                    onChange={(e) => setSnoozeHours(parseInt(e.target.value))}
                    className="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={4}>4 hours</option>
                    <option value={8}>8 hours</option>
                    <option value={24}>1 day</option>
                  </select>
                  <button
                    onClick={() => handleSnooze(todo.id)}
                    className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 transition-colors"
                  >
                    Snooze
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;