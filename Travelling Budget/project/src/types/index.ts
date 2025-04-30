export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
  budget: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  tripId: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  categoryId: string;
  currency: string;
  tripId: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export interface CurrencyRates {
  [key: string]: number;
}

export interface TripWithExpenses extends Trip {
  expenses: Expense[];
  categories: Category[];
}