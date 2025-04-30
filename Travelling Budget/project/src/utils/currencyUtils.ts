import { CurrencyRates } from '../types';

// Sample exchange rates (in real app, these would come from an API)
export const sampleRates: CurrencyRates = {
  USD: 0.012,  // 1 INR = 0.012 USD
  EUR: 0.011,  // 1 INR = 0.011 EUR
  GBP: 0.0095, // 1 INR = 0.0095 GBP
  JPY: 1.81,   // 1 INR = 1.81 JPY
  INR: 1.0,    // Base currency
  AUD: 0.018   // 1 INR = 0.018 AUD
};

export const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  AUD: 'A$'
};

// Format currency amount with symbol
export const formatCurrencyWithSymbol = (
  amount: number,
  currency: string = 'INR'
): string => {
  const symbol = currencySymbols[currency] || '₹';
  return `${symbol}${amount.toFixed(2)}`;
};

// Function to convert between currencies
export const convertAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: CurrencyRates = sampleRates
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to INR first (as base currency)
  const amountInINR = fromCurrency === 'INR' ? amount : amount / rates[fromCurrency];
  
  // Convert from INR to target currency
  return toCurrency === 'INR' ? amountInINR : amountInINR * rates[toCurrency];
};

// List of available currencies
export const currencyOptions = [
  { value: 'INR', label: 'Indian Rupee (INR)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'JPY', label: 'Japanese Yen (JPY)' },
  { value: 'AUD', label: 'Australian Dollar (AUD)' }
];