import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../Dashboard/Dashboard';
import ExpenseList from '../Expenses/ExpenseList';
import BudgetView from '../Budget/BudgetView';
import TripDetails from '../Trip/TripDetails';
import AddExpenseForm from '../Expenses/AddExpenseForm';
import Settings from '../Settings/Settings';

const Layout: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <ExpenseList />;
      case 'budget':
        return <BudgetView />;
      case 'trip':
        return <TripDetails />;
      case 'addExpense':
        return <AddExpenseForm onComplete={() => setActiveView('expenses')} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="pt-16 pl-64">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default Layout;