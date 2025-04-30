import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { Expense, Category } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Plus, Filter, Search, Trash2, Edit } from 'lucide-react';

const ExpenseList: React.FC = () => {
  const { activeTrip, state, dispatch } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (!activeTrip) return null;

  const { expenses, categories } = activeTrip;

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Sure You Want To Delete?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    }
  };

  const handleEditExpense = (expense: Expense) => {
    // In a real app, you would open a modal or navigate to an edit page
    console.log('Edit expense:', expense);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.color : '#6B7280';
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-1" />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search expenses..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center">
                    <span>Date</span>
                    {sortBy === 'date' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('amount')}
                >
                  <div className="flex items-center justify-end">
                    <span>Amount</span>
                    {sortBy === 'amount' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedExpenses.length > 0 ? (
                sortedExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getCategoryColor(expense.categoryId) }}
                        ></div>
                        <div className="text-sm font-medium text-gray-900">
                          {getCategoryName(expense.categoryId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{expense.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(expense.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(expense.amount, expense.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;