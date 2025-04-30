import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { Category, Expense } from '../../types';
import { formatCurrency, getPercentage } from '../../utils/helpers';
import { PieChart, ArrowUp, ArrowDown, Banknote } from 'lucide-react';

const ExpenseSummary: React.FC = () => {
  const { 
    activeTrip, 
    getTotalSpent, 
    getRemainingBudget,
    getTripCategories,
    getCategorySpent
  } = useBudget();

  if (!activeTrip) return null;

  const totalSpent = getTotalSpent();
  const remainingBudget = getRemainingBudget();
  const categories = getTripCategories(activeTrip.id);
  
  // Find top spending category
  const topCategory = categories.reduce((top, current) => {
    const topSpent = getCategorySpent(top.id);
    const currentSpent = getCategorySpent(current.id);
    return currentSpent > topSpent ? current : top;
  }, categories[0]);
  
  const topCategorySpent = getCategorySpent(topCategory?.id || '');
  
  // Get most recent expenses
  const recentExpenses = [...activeTrip.expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const spendingPercentage = getPercentage(totalSpent, activeTrip.budget);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Budget Overview</h3>
          <Banknote className="h-5 w-5 text-blue-500" />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Total Budget</span>
            <span className="font-medium">{formatCurrency(activeTrip.budget, activeTrip.currency)}</span>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Total Spent</span>
            <span className="font-medium">{formatCurrency(totalSpent, activeTrip.currency)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Remaining</span>
            <span className={`font-medium ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {formatCurrency(remainingBudget, activeTrip.currency)}
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium">{spendingPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                spendingPercentage < 80 ? 'bg-blue-500' : 'bg-red-500'
              }`}
              style={{ width: `${spendingPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Top Spending</h3>
          <PieChart className="h-5 w-5 text-blue-500" />
        </div>
        
        {topCategory && (
          <div className="flex items-center mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
              style={{ backgroundColor: topCategory.color + '20', color: topCategory.color }}
            >
              <ArrowUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Top Category</p>
              <p className="font-medium text-gray-800">{topCategory.name}</p>
              <p className="text-sm font-medium text-gray-600">
                {formatCurrency(topCategorySpent, activeTrip.currency)}
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Category Breakdown</h4>
          {categories.slice(0, 3).map((category) => {
            const spent = getCategorySpent(category.id);
            const percentage = getPercentage(spent, category.budget);
            return (
              <div key={category.id} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(spent, activeTrip.currency)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full"
                    style={{ 
                      width: `${percentage}%`, 
                      backgroundColor: category.color 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Expenses</h3>
          <ArrowDown className="h-5 w-5 text-blue-500" />
        </div>
        
        {recentExpenses.length > 0 ? (
          <div className="space-y-4">
            {recentExpenses.map((expense) => {
              const category = categories.find(c => c.id === expense.categoryId);
              return (
                <div key={expense.id} className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: category?.color + '20', color: category?.color }}
                  >
                    <span className="text-xs">{category?.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{expense.description}</p>
                    <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-medium text-gray-800">{formatCurrency(expense.amount, activeTrip.currency)}</p>
                </div>
              );
            })}
            
            <button 
              onClick={() => {}} 
              className="text-sm text-blue-500 hover:text-blue-700 font-medium mt-2"
            >
              View all expenses
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No recent expenses</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseSummary;