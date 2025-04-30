// Generate a unique ID with a given prefix
export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date to a readable format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Get percentage of budget spent
export const getPercentage = (spent: number, budget: number): number => {
  if (budget <= 0) return 0;
  return Math.min(Math.round((spent / budget) * 100), 100);
};

// Get color based on percentage
export const getColorByPercentage = (percentage: number): string => {
  if (percentage < 50) return 'bg-green-500';
  if (percentage < 80) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Convert amount from one currency to another
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: { [key: string]: number }
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first (if not already USD)
  const amountInUSD = fromCurrency === 'USD' ? amount : amount / rates[fromCurrency];
  
  // Convert from USD to target currency (if not USD)
  return toCurrency === 'USD' ? amountInUSD : amountInUSD * rates[toCurrency];
};

// Download data as JSON file
export const downloadJson = (data: any, filename: string): void => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const link = document.createElement('a');
  link.setAttribute('href', dataUri);
  link.setAttribute('download', `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Get chart colors based on categories
export const getChartColors = (categories: { color: string }[]): string[] => {
  return categories.map(cat => cat.color);
};