import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { currencyOptions } from '../../utils/currencyUtils';
import { 
  Calendar, MapPin, Wallet, Clock, 
  Globe, ArrowUpDown, Edit
} from 'lucide-react';

const TripDetails: React.FC = () => {
  const { activeTrip, getTotalSpent, getRemainingBudget } = useBudget();
  
  if (!activeTrip) return null;
  
  const totalSpent = getTotalSpent();
  const remainingBudget = getRemainingBudget();
  
  // Calculate trip duration
  const startDate = new Date(activeTrip.startDate);
  const endDate = new Date(activeTrip.endDate);
  const tripDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Calculate daily budget
  const dailyBudget = activeTrip.budget / tripDays;
  
  // Get currency name
  const currencyName = currencyOptions.find(c => c.value === activeTrip.currency)?.label || activeTrip.currency;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Trip Details</h2>
        
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Trip
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{activeTrip.name}</h1>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {formatDate(activeTrip.startDate)} - {formatDate(activeTrip.endDate)}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="bg-blue-100 text-blue-800 rounded-full px-4 py-1 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                <span>{currencyName}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2 text-blue-700">
                <Wallet className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Total Budget</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(activeTrip.budget, activeTrip.currency)}
              </p>
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Spent:</span>
                  <span>{formatCurrency(totalSpent, activeTrip.currency)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Remaining:</span>
                  <span className={remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}>
                    {formatCurrency(remainingBudget, activeTrip.currency)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2 text-green-700">
                <Clock className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Trip Duration</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">{tripDays} days</p>
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Start:</span>
                  <span>{formatDate(activeTrip.startDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>End:</span>
                  <span>{formatDate(activeTrip.endDate)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2 text-purple-700">
                <ArrowUpDown className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Daily Budget</h3>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(dailyBudget, activeTrip.currency)}
              </p>
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Per week:</span>
                  <span>{formatCurrency(dailyBudget * 7, activeTrip.currency)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Budget/day:</span>
                  <span>{Math.round(100 * activeTrip.budget / tripDays) / 100}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Trip Summary</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Categories</span>
                  <span className="font-medium">{activeTrip.categories.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Expenses</span>
                  <span className="font-medium">{activeTrip.expenses.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Average Expense</span>
                  <span className="font-medium">
                    {formatCurrency(
                      activeTrip.expenses.length > 0 
                        ? totalSpent / activeTrip.expenses.length 
                        : 0, 
                      activeTrip.currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Budget Used</span>
                  <span className="font-medium">
                    {activeTrip.budget > 0 
                      ? Math.round((totalSpent / activeTrip.budget) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Actions</h4>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Add expenses from calendar view</span>
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
                  <ArrowUpDown className="h-4 w-4 mr-2 text-green-500" />
                  <span>Adjust category budgets</span>
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />
                  <span>Add trip locations</span>
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50">
                  <Wallet className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Export trip financial report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;