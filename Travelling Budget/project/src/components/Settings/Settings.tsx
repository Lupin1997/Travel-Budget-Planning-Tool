import React, { useEffect, useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { currencyOptions } from '../../utils/currencyUtils';
import { downloadJson } from '../../utils/helpers';
import { 
  Download, Upload, RefreshCw, Languages, 
  Moon, Palette, Bell
} from 'lucide-react';

const Settings: React.FC = () => {
  const { activeTrip, state } = useBudget();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  
  useEffect(() => {
    // Check system preference and localStorage
    const darkModePreference = localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(darkModePreference);
    
    // Apply dark mode if needed
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    }
    
    // Load saved color preference
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
      document.documentElement.style.setProperty('--color-primary', savedColor);
      setPrimaryColor(savedColor);
    }
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };
  
  const handleColorChange = (color: string) => {
    document.documentElement.style.setProperty('--color-primary', color);
    setPrimaryColor(color);
    localStorage.setItem('primaryColor', color);
  };
  
  if (!activeTrip) return null;
  
  const handleExportData = () => {
    downloadJson({
      trips: state.trips,
      categories: state.categories,
      expenses: state.expenses,
    }, 'travel-budget-data');
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Data Management</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-900">Export Data</h4>
              <p className="mt-1 text-sm text-gray-500">
                Download all your trip data including expenses and budgets as a JSON file.
              </p>
              <button
                onClick={handleExportData}
                className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 transition-colors"
              >
                Export All Data
              </button>
            </div>
          </div>
          
          <div className="border-t pt-6 flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Upload className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-900">Import Data</h4>
              <p className="mt-1 text-sm text-gray-500">
                Import previously exported trip data or data from other budget tools.
              </p>
              <button
                className="mt-3 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Application Settings</h3>
        </div>
        
        <div className="divide-y">
          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 text-primary mr-3" />
                <div>
                  <h4 className="font-medium text-gray-800">Default Currency</h4>
                  <p className="text-sm text-gray-500">Set your preferred currency for new trips</p>
                </div>
              </div>
              
              <select
                className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700"
                defaultValue={activeTrip.currency}
              >
                {currencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Languages className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-800">Language</h4>
                  <p className="text-sm text-gray-500">Change your preferred language</p>
                </div>
              </div>
              
              <select
                className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
          
          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Moon className="h-5 w-5 text-purple-500 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-800">Dark Mode</h4>
                  <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
                </div>
              </div>
              
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Palette className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-800">Theme Color</h4>
                  <p className="text-sm text-gray-500">Customize your app's primary color</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {['#3B82F6', '#10B981', '#8B5CF6', '#EF4444'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      primaryColor === color ? 'scale-110 border-gray-400' : 'border-white'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-yellow-500 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-800">Notifications</h4>
                  <p className="text-sm text-gray-500">Configure budget alerts and reminders</p>
                </div>
              </div>
              
              <button className="text-primary hover:text-opacity-80 text-sm font-medium">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;