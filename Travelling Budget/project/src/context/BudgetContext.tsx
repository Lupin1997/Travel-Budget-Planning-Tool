import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Trip, Category, Expense, TripWithExpenses } from '../types';
import { generateId } from '../utils/helpers';

// Define the initial categories
const defaultCategories = [
  { name: 'Accommodation', icon: 'home', color: '#3B82F6' },
  { name: 'Food', icon: 'utensils', color: '#10B981' },
  { name: 'Transportation', icon: 'car', color: '#F97316' },
  { name: 'Activities', icon: 'ticket', color: '#8B5CF6' },
  { name: 'Shopping', icon: 'shopping-bag', color: '#EC4899' },
  { name: 'Other', icon: 'more-horizontal', color: '#6B7280' },
];

// Sample data for demo purposes
const sampleTrip: Trip = {
  id: 'trip-1',
  name: 'Summer Vacation',
  startDate: '2025-06-01',
  endDate: '2025-06-14',
  currency: 'INR',
  budget: 250000,
};

const sampleCategories: Category[] = defaultCategories.map((cat, index) => ({
  id: `cat-${index + 1}`,
  name: cat.name,
  icon: cat.icon,
  color: cat.color,
  budget: Math.round((sampleTrip.budget / defaultCategories.length) * 10) / 10,
  tripId: sampleTrip.id,
}));

const sampleExpenses: Expense[] = [
  {
    id: 'exp-1',
    date: '2025-06-02',
    description: 'Hotel in Paris',
    amount: 210,
    categoryId: 'cat-1',
    currency: 'INR',
    tripId: 'trip-1',
  },
  {
    id: 'exp-2',
    date: '2025-06-02',
    description: 'Metro ticket',
    amount: 15,
    categoryId: 'cat-3',
    currency: 'INR',
    tripId: 'trip-1',
  },
  {
    id: 'exp-3',
    date: '2025-06-03',
    description: 'Lunch at café',
    amount: 35,
    categoryId: 'cat-2',
    currency: 'INR',
    tripId: 'trip-1',
  },
  {
    id: 'exp-4',
    date: '2025-06-03',
    description: 'Museum entry',
    amount: 25,
    categoryId: 'cat-4',
    currency: 'INR',
    tripId: 'trip-1',
  },
];

// Initial state
const initialState = {
  trips: [sampleTrip],
  categories: sampleCategories,
  expenses: sampleExpenses,
  activeTrip: sampleTrip.id,
  isLoading: false,
  error: null,
};

// Action types
type ActionType =
  | { type: 'ADD_TRIP'; payload: Trip }
  | { type: 'UPDATE_TRIP'; payload: Trip }
  | { type: 'DELETE_TRIP'; payload: string }
  | { type: 'SET_ACTIVE_TRIP'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Partial<Category> }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Partial<Expense> }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Reducer function
const budgetReducer = (state: typeof initialState, action: ActionType) => {
  switch (action.type) {
    case 'ADD_TRIP':
      return {
        ...state,
        trips: [...state.trips, action.payload],
        activeTrip: action.payload.id,
      };
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map((trip) =>
          trip.id === action.payload.id ? action.payload : trip
        ),
      };
    case 'DELETE_TRIP':
      return {
        ...state,
        trips: state.trips.filter((trip) => trip.id !== action.payload),
        activeTrip:
          state.activeTrip === action.payload && state.trips.length > 1
            ? state.trips.find((trip) => trip.id !== action.payload)?.id || null
            : state.activeTrip,
      };
    case 'SET_ACTIVE_TRIP':
      return {
        ...state,
        activeTrip: action.payload,
      };
    case 'ADD_CATEGORY': {
      const newCategory: Category = {
        id: generateId('cat'),
        name: '',
        icon: 'circle',
        color: '#6B7280',
        budget: 0,
        tripId: state.activeTrip,
        ...action.payload,
      };
      return {
        ...state,
        categories: [...state.categories, newCategory],
      };
    }
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
        expenses: state.expenses.filter((exp) => exp.categoryId !== action.payload),
      };
    case 'ADD_EXPENSE': {
      const newExpense: Expense = {
        id: generateId('exp'),
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: 0,
        categoryId: '',
        currency: state.trips.find((trip) => trip.id === state.activeTrip)?.currency || 'INR',
        tripId: state.activeTrip,
        ...action.payload,
      };
      return {
        ...state,
        expenses: [...state.expenses, newExpense],
      };
    }
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((exp) =>
          exp.id === action.payload.id ? action.payload : exp
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((exp) => exp.id !== action.payload),
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Create context
interface BudgetContextType {
  state: typeof initialState;
  activeTrip: TripWithExpenses | null;
  dispatch: React.Dispatch<ActionType>;
  getTripExpenses: (tripId: string) => Expense[];
  getTripCategories: (tripId: string) => Category[];
  getCategoryExpenses: (categoryId: string) => Expense[];
  getTotalSpent: (tripId?: string) => number;
  getCategorySpent: (categoryId: string) => number;
  getRemainingBudget: (tripId?: string) => number;
  getCategoryRemaining: (categoryId: string) => number;
  getTrips: () => Trip[];
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Provider component
export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  // Utility functions
  const getTripExpenses = (tripId: string) =>
    state.expenses.filter((exp) => exp.tripId === tripId);

  const getTripCategories = (tripId: string) =>
    state.categories.filter((cat) => cat.tripId === tripId);

  const getCategoryExpenses = (categoryId: string) =>
    state.expenses.filter((exp) => exp.categoryId === categoryId);

  const getTotalSpent = (tripId?: string) => {
    const targetTripId = tripId || state.activeTrip;
    return state.expenses
      .filter((exp) => exp.tripId === targetTripId)
      .reduce((total, exp) => total + exp.amount, 0);
  };

  const getCategorySpent = (categoryId: string) =>
    getCategoryExpenses(categoryId).reduce((total, exp) => total + exp.amount, 0);

  const getRemainingBudget = (tripId?: string) => {
    const targetTripId = tripId || state.activeTrip;
    const trip = state.trips.find((trip) => trip.id === targetTripId);
    return trip ? trip.budget - getTotalSpent(targetTripId) : 0;
  };

  const getCategoryRemaining = (categoryId: string) => {
    const category = state.categories.find((cat) => cat.id === categoryId);
    return category ? category.budget - getCategorySpent(categoryId) : 0;
  };

  const getTrips = () => state.trips;

  // Get active trip with its expenses and categories
  const activeTrip: TripWithExpenses | null = state.activeTrip
    ? {
        ...state.trips.find((trip) => trip.id === state.activeTrip)!,
        expenses: getTripExpenses(state.activeTrip),
        categories: getTripCategories(state.activeTrip),
      }
    : null;

  const value = {
    state,
    activeTrip,
    dispatch,
    getTripExpenses,
    getTripCategories,
    getCategoryExpenses,
    getTotalSpent,
    getCategorySpent,
    getRemainingBudget,
    getCategoryRemaining,
    getTrips,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

// Custom hook to use the budget context
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};