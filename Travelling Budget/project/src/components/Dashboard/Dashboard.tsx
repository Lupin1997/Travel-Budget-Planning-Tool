import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import ExpenseSummary from './ExpenseSummary';
import ExpenseChart from './ExpenseChart';
import { formatDate } from '../../utils/helpers';
import { CalendarDays } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { activeTrip } = useBudget();

  if (!activeTrip) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">No trip selected</h2>
        <p className="text-gray-500 mt-2">Please create or select a trip to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{activeTrip.name}</h2>
          <div className="flex items-center text-gray-500 mt-1">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>
              {formatDate(activeTrip.startDate)} - {formatDate(activeTrip.endDate)}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white text-blue-500 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Export Data
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Add Expense
          </button>
        </div>
      </div>

      <ExpenseSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseChart />
        </div>
        <div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Average</h3>
            <div className="space-y-4">
              {/* Calculate daily spending stats */}
              <DailySpendingStats trip={activeTrip} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DailySpendingStats = ({ trip }: { trip: any }) => {
  // Calculate trip duration in days
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const tripDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Calculate total spent and daily average
  const totalSpent = trip.expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
  const dailyAverage = totalSpent / tripDays;
  
  // Check if we're over or under daily budget
  const dailyBudget = trip.budget / tripDays;
  const isOverBudget = dailyAverage > dailyBudget;
  
  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Total Days</p>
        <p className="font-medium">{tripDays} days</p>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Daily Budget</p>
        <p className="font-medium">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: trip.currency
          }).format(dailyBudget)}
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Daily Average</p>
        <p className={`font-medium ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: trip.currency
          }).format(dailyAverage)}
        </p>
      </div>
      
      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600 mb-2">Daily Spend Status</p>
        <div className={`text-sm font-medium rounded-lg p-2 ${
          isOverBudget ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {isOverBudget 
            ? `${((dailyAverage / dailyBudget - 1) * 100).toFixed(1)}% over daily budget` 
            : `${((1 - dailyAverage / dailyBudget) * 100).toFixed(1)}% under daily budget`
          }
        </div>
      </div>
    </>
  );
};

export default Dashboard;