import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency, getPercentage } from '../../utils/helpers';
import { 
  Home, PieChart, Plus, CreditCard, 
  Calendar, Settings, Banknote
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, active = false, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-102 ${
          active
            ? 'bg-blue-500 text-white shadow-lg'
            : 'text-gray-700 hover:bg-blue-100'
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span className="font-medium">{text}</span>
      </button>
    </li>
  );
};

const Sidebar: React.FC<{ activeView: string; setActiveView: (view: string) => void }> = ({ 
  activeView, 
  setActiveView 
}) => {
  const { activeTrip, getTotalSpent, getRemainingBudget } = useBudget();

  if (!activeTrip) return null;

  const totalSpent = getTotalSpent();
  const remainingBudget = getRemainingBudget();
  const percentage = getPercentage(totalSpent, activeTrip.budget);

  const getBudgetColor = () => {
    if (percentage < 50) return 'text-green-500';
    if (percentage < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white shadow-md p-4 z-10">
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-sm uppercase text-gray-500 font-semibold mb-2">Budget Progress</h2>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${percentage < 80 ? 'bg-blue-500' : 'bg-red-500'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Spent: {formatCurrency(totalSpent, activeTrip.currency)}</span>
            <span className={getBudgetColor()}>
              {formatCurrency(remainingBudget, activeTrip.currency)} left
            </span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 flex items-center mb-6">
          <Banknote className="h-5 w-5 text-blue-500 mr-2" />
          <div>
            <p className="text-xs text-gray-600">Total Budget</p>
            <p className="font-bold text-gray-800">
              {formatCurrency(activeTrip.budget, activeTrip.currency)}
            </p>
          </div>
        </div>
      </div>

      <nav>
        <ul className="space-y-1">
          <NavItem
            icon={<Home className="h-5 w-5" />}
            text="Dashboard"
            active={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
          />
          <NavItem
            icon={<CreditCard className="h-5 w-5" />}
            text="Expenses"
            active={activeView === 'expenses'}
            onClick={() => setActiveView('expenses')}
          />
          <NavItem
            icon={<PieChart className="h-5 w-5" />}
            text="Budget"
            active={activeView === 'budget'}
            onClick={() => setActiveView('budget')}
          />
          <NavItem
            icon={<Calendar className="h-5 w-5" />}
            text="Trip Details"
            active={activeView === 'trip'}
            onClick={() => setActiveView('trip')}
          />
          <NavItem
            icon={<Settings className="h-5 w-5" />}
            text="Settings"
            active={activeView === 'settings'}
            onClick={() => setActiveView('settings')}
          />
        </ul>
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={() => setActiveView('addExpense')}
          className="w-full flex items-center justify-center py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Add Expense</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;