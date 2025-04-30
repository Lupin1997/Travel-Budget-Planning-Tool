import React from 'react';
import { BudgetProvider } from './context/BudgetContext';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <BudgetProvider>
      <Layout />
    </BudgetProvider>
  );
}

export default App;