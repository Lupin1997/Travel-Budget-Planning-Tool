import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { currencyOptions } from '../../utils/currencyUtils';
import { getTodayDate } from '../../utils/helpers';
import { ArrowLeft, Plus } from 'lucide-react';

interface AddExpenseFormProps {
  onComplete: () => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onComplete }) => {
  const { activeTrip, dispatch } = useBudget();
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: getTodayDate(),
    categoryId: '',
    currency: activeTrip?.currency || 'USD',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  if (!activeTrip) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        categoryId: formData.categoryId,
        currency: formData.currency,
        tripId: activeTrip.id,
      },
    });
    
    onComplete();
  };
  
  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="flex items-center mb-6">
        <button 
          onClick={onComplete}
          className="mr-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Add New Expense</h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="E.g., Hotel Booking, Dinner, Taxi"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">
                      {formData.currency === 'USD' ? '$' : 
                       formData.currency === 'EUR' ? '€' : 
                       formData.currency === 'GBP' ? '£' : ''}
                    </span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  {currencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {activeTrip.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onComplete}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;