import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { Category } from '../../types';
import { formatCurrency, getPercentage, getColorByPercentage } from '../../utils/helpers';
import { Edit2, Save, Sliders } from 'lucide-react';

const BudgetView: React.FC = () => {
  const { 
    activeTrip, 
    dispatch, 
    getCategorySpent, 
    getCategoryRemaining 
  } = useBudget();
  
  const [editMode, setEditMode] = useState(false);
  const [editedCategories, setEditedCategories] = useState<Record<string, number>>({});
  
  if (!activeTrip) return null;
  
  const { categories } = activeTrip;
  
  const handleBudgetChange = (categoryId: string, value: string) => {
    const budgetValue = value === '' ? 0 : parseFloat(value);
    setEditedCategories({ ...editedCategories, [categoryId]: budgetValue });
  };
  
  const saveChanges = () => {
    Object.entries(editedCategories).forEach(([categoryId, budget]) => {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        dispatch({
          type: 'UPDATE_CATEGORY',
          payload: { ...category, budget }
        });
      }
    });
    
    setEditMode(false);
    setEditedCategories({});
  };
  
  const cancelEdit = () => {
    setEditMode(false);
    setEditedCategories({});
  };
  
  const getBudgetValue = (category: Category) => {
    return editedCategories[category.id] !== undefined
      ? editedCategories[category.id]
      : category.budget;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Budget Management</h2>
        
        <div>
          {editMode ? (
            <div className="flex space-x-3">
              <button
                onClick={cancelEdit}
                className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Budgets
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <div className="flex items-center">
            <Sliders className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Category Budgets</h3>
          </div>
          <div className="text-sm text-gray-500">
            Total Budget: {formatCurrency(activeTrip.budget, activeTrip.currency)}
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {categories.map((category) => {
            const spent = getCategorySpent(category.id);
            const remaining = getCategoryRemaining(category.id);
            const percentage = getPercentage(spent, getBudgetValue(category));
            const statusColor = getColorByPercentage(percentage);
            
            return (
              <div key={category.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <h4 className="font-medium text-gray-800">{category.name}</h4>
                  </div>
                  
                  {editMode ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">
                          {activeTrip.currency === 'USD' ? '$' : 
                           activeTrip.currency === 'EUR' ? '€' : 
                           activeTrip.currency === 'GBP' ? '£' : ''}
                        </span>
                      </div>
                      <input
                        type="number"
                        className="pl-8 pr-4 py-1 w-32 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={getBudgetValue(category)}
                        onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                        min="0"
                        step="1"
                      />
                    </div>
                  ) : (
                    <div className="text-gray-900 font-medium">
                      {formatCurrency(getBudgetValue(category), activeTrip.currency)}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="text-gray-500">
                    Spent: {formatCurrency(spent, activeTrip.currency)}
                  </div>
                  <div className={`font-medium ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {remaining < 0 ? 'Over by ' : 'Remaining: '}
                    {formatCurrency(Math.abs(remaining), activeTrip.currency)}
                  </div>
                </div>
                
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${statusColor}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-end mt-1 text-xs text-gray-500">
                  {percentage}% used
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetView;