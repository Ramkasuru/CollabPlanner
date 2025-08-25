export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  snoozedUntil?: Date;
  isOverdue?: boolean;
}

export interface BudgetData {
  monthlyEarning: number;
  dailyEarning: number;
  dailySaving: number;
  dailySpending: number;
}

export interface Class {
  id: string;
  name: string;
  homework: Homework[];
}

export interface Homework {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  subject: string;
}

export interface Career {
  id: string;
  courseName: string;
  progress: number;
  startDate: Date;
  estimatedCompletion: Date;
  description: string;
}

export interface SpendingAnalysis {
  suggestion: string;
  potentialSavings: number;
  category: string;
}