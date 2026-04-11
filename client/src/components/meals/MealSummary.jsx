import { useState, useEffect } from 'react';
import { mealSelectionService } from '../../services/mealSelection.service';
import { billingService } from '../../services/billing.service';
import toast from 'react-hot-toast';

const MealSummary = ({ year, month }) => {
  const [summary, setSummary] = useState(null);
  const [billSummary, setBillSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [year, month]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const mealRes = await mealSelectionService.getMealSummary(year, month);
      setSummary(mealRes.data.summary);

      // Fetch bill summary if available
      try {
        const billRes = await billingService.getStudentBillSummary(year, month);
        setBillSummary(billRes.data.summary);
      } catch (error) {
        console.log('Bill not yet generated');
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      toast.error('Failed to load meal summary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded w-1/3" />
          <div className="h-24 bg-secondary-200 dark:bg-secondary-700 rounded" />
        </div>
      </div>
    );
  }

  const mealStats = [
    {
      label: 'Breakfast',
      value: summary?.totalBreakfast || 0,
      icon: '🌅',
      color: 'from-amber-500 to-orange-600',
    },
    {
      label: 'Lunch',
      value: summary?.totalLunch || 0,
      icon: '☀️',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Dinner',
      value: summary?.totalDinner || 0,
      icon: '🌙',
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Meal Statistics */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold gradient-text mb-6">Monthly Meal Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {mealStats.map((stat, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.color} p-6 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold">{stat.value}</p>
                </div>
                <span className="text-5xl opacity-50">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total Meals */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 dark:text-secondary-400 mb-1">Total Meals Selected</p>
              <p className="text-4xl font-bold gradient-text">{summary?.totalMeals || 0}</p>
            </div>
            <div className="text-6xl">🍽️</div>
          </div>
        </div>
      </div>

      {/* Bill Summary */}
      {billSummary && (
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold gradient-text mb-6">Billing Summary</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
              <span className="text-secondary-700 dark:text-secondary-300 font-semibold">Fixed Hostel Fee</span>
              <span className="text-xl font-bold text-secondary-900 dark:text-white">
                ৳{billSummary.fixedCost?.toFixed(2) || '0.00'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
              <span className="text-secondary-700 dark:text-secondary-300 font-semibold">Meal Cost</span>
              <span className="text-xl font-bold text-secondary-900 dark:text-white">
                ৳{billSummary.mealCost?.toFixed(2) || '0.00'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-lg border-2 border-violet-300 dark:border-violet-700">
              <span className="text-violet-700 dark:text-violet-300 font-bold text-lg">Total Amount</span>
              <span className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                ৳{billSummary.totalAmount?.toFixed(2) || '0.00'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
              <span className="text-secondary-700 dark:text-secondary-300 font-semibold">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  billSummary.status === 'paid'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}
              >
                {billSummary.status?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSummary;
