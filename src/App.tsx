import React, { useState, useEffect } from 'react';
import { CheckSquare, Target, DollarSign } from 'lucide-react';
import TodoList from './components/TodoList';
import BudgetTracker from './components/BudgetTracker';
import ClassesSection from './components/ClassesSection';
import CareerSection from './components/CareerSection';
import Clock from './components/Clock';
import { Todo, BudgetData, Class, Career } from './types';

type Tab = 'todo' | 'goals';
type GoalsTab = 'classes' | 'career';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('todo');
  const [activeGoalsTab, setActiveGoalsTab] = useState<GoalsTab>('classes');
  
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      text: 'Complete React project documentation',
      completed: false,
      createdAt: new Date(Date.now() - 49 * 60 * 60 * 1000), // 49 hours ago
      isOverdue: true
    }
  ]);

  const [budgetData, setBudgetData] = useState<BudgetData>({
    monthlyEarning: 5000,
    dailyEarning: 167,
    dailySaving: 50,
    dailySpending: 80
  });

  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      name: 'Advanced Mathematics',
      homework: [
        {
          id: '1',
          title: 'Calculus Problem Set 5',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          completed: false,
          subject: 'Calculus'
        },
        {
          id: '2',
          title: 'Linear Algebra Essay',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          completed: false,
          subject: 'Linear Algebra'
        }
      ]
    },
    {
      id: '2',
      name: 'Computer Science',
      homework: [
        {
          id: '3',
          title: 'Data Structures Assignment',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          completed: false,
          subject: 'Algorithms'
        }
      ]
    }
  ]);

  const [careers, setCareers] = useState<Career[]>([
    {
      id: '1',
      courseName: 'Full Stack Web Development',
      progress: 75,
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      estimatedCompletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: 'Comprehensive course covering React, Node.js, databases, and deployment'
    },
    {
      id: '2',
      courseName: 'Machine Learning Fundamentals',
      progress: 45,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      estimatedCompletion: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      description: 'Introduction to ML concepts, algorithms, and practical applications'
    }
  ]);

  // Check for overdue todos
  useEffect(() => {
    const checkOverdue = () => {
      const now = Date.now();
      const fortyEightHours = 48 * 60 * 60 * 1000;
      
      setTodos(prevTodos => 
        prevTodos.map(todo => ({
          ...todo,
          isOverdue: !todo.completed && (now - new Date(todo.createdAt).getTime()) > fortyEightHours
        }))
      );
    };

    checkOverdue();
    const interval = setInterval(checkOverdue, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleAddTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
      isOverdue: false
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed, completedAt: !todo.completed ? new Date() : undefined }
          : todo
      )
    );
  };

  const handleSnoozeTodo = (id: string, hours: number) => {
    const snoozeUntil = new Date(Date.now() + hours * 60 * 60 * 1000);
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, snoozedUntil: snoozeUntil, isOverdue: false }
          : todo
      )
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Life Planner</h1>
            <Clock />
          </div>
        </header>

        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('todo')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'todo' 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <CheckSquare size={18} />
              <span>Todo & Budget</span>
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'goals' 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Target size={18} />
              <span>Goals</span>
            </button>
          </div>
        </div>

        {activeTab === 'todo' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <TodoList
                todos={todos}
                onAddTodo={handleAddTodo}
                onToggleTodo={handleToggleTodo}
                onSnoozeTodo={handleSnoozeTodo}
              />
            </div>
            <div>
              <BudgetTracker
                budgetData={budgetData}
                onUpdateBudget={setBudgetData}
              />
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <>
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 max-w-md">
                <button
                  onClick={() => setActiveGoalsTab('classes')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeGoalsTab === 'classes' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>Classes</span>
                </button>
                <button
                  onClick={() => setActiveGoalsTab('career')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeGoalsTab === 'career' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <span>Career</span>
                </button>
              </div>
            </div>

            {activeGoalsTab === 'classes' && (
              <ClassesSection classes={classes} onUpdateClasses={setClasses} />
            )}

            {activeGoalsTab === 'career' && (
              <CareerSection careers={careers} onUpdateCareers={setCareers} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;