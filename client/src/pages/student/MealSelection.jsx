import { useState } from 'react';
import MealSelectionCalendar from '../../components/meals/MealSelectionCalendar';
import MealSummary from '../../components/meals/MealSummary';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

const MealSelection = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const handlePreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-violet-50/30 to-purple-50/30 dark:from-secondary-900 dark:via-violet-950/30 dark:to-purple-950/30 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <CalendarDaysIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">Meal Selection</h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Plan your meals in advance and manage your budget
            </p>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg flex items-center justify-between">
          <button
            onClick={handlePreviousMonth}
            className="px-4 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-lg font-semibold hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-all"
          >
            ← Previous
          </button>

          <h2 className="text-2xl font-bold gradient-text">
            {monthNames[month - 1]} {year}
          </h2>

          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-lg font-semibold hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-all"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <MealSelectionCalendar year={year} month={month} />
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <MealSummary year={year} month={month} />
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-violet-200 dark:border-violet-800">
          <h3 className="text-xl font-bold gradient-text mb-4">How it works</h3>
          <ul className="space-y-3 text-secondary-700 dark:text-secondary-300">
            <li className="flex items-start gap-3">
              <span className="text-2xl">📅</span>
              <span>Click on any date to select or deselect meals for that day</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🍽️</span>
              <span>You can select breakfast, lunch, and dinner independently</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <span>Meals can only be modified before the cutoff time (10 PM)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <span>Your bill is calculated based on meals you select</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MealSelection;
