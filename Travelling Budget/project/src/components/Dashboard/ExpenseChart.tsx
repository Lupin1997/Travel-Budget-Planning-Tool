import React, { useEffect, useRef } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { Category, Expense } from '../../types';
import { getChartColors } from '../../utils/helpers';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
}

const ExpenseChart: React.FC = () => {
  const { activeTrip, getTripCategories, getCategorySpent } = useBudget();
  const chartContainer = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!activeTrip) return;
    
    const categories = getTripCategories(activeTrip.id);
    
    // Skip if no categories or Chart.js is not loaded
    if (categories.length === 0 || typeof window.Chart === 'undefined') return;

    const categoryData = categories.map(cat => ({
      name: cat.name,
      value: getCategorySpent(cat.id),
      color: cat.color
    }));

    // Filter out zero values
    const filteredData = categoryData.filter(item => item.value > 0);
    
    if (filteredData.length === 0) return;

    const data: ChartData = {
      labels: filteredData.map(item => item.name),
      datasets: [
        {
          data: filteredData.map(item => item.value),
          backgroundColor: filteredData.map(item => item.color),
        }
      ]
    };

    // Clear previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Draw new chart
    const ctx = chartContainer.current?.getContext('2d');
    if (ctx) {
      chartInstance.current = new window.Chart(ctx, {
        type: 'doughnut',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 12,
                padding: 15,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const currency = activeTrip?.currency || 'USD';
                  return `${label}: ${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency
                  }).format(value)}`;
                }
              }
            }
          },
          cutout: '70%',
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [activeTrip]);

  if (!activeTrip) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
      <div className="h-80">
        <canvas ref={chartContainer}></canvas>
      </div>
    </div>
  );
};

// Add Chart.js to the global window object
declare global {
  interface Window {
    Chart: any;
  }
}

export default ExpenseChart;