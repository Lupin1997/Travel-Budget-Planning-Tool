import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { Wallet, Globe } from 'lucide-react';

const Header: React.FC = () => {
  const { activeTrip } = useBudget();

  return (
    <header className="bg-white shadow fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Wallet className="h-8 w-8 text-blue-500 mr-2" />
          <h1 className="text-xl font-bold text-gray-800">TravelBudget</h1>
        </div>
        
        {activeTrip && (
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-lg font-medium text-gray-700">{activeTrip.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;