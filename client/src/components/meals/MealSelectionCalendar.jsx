import { useState, useEffect } from 'react';
import { mealSelectionService } from '../../services/mealSelection.service';
import toast from 'react-hot-toast';

const MealSelectionCalendar = ({ year, month }) => {
  const [mealSelections, setMealSelections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  useEffect(() => {
    fetchMealCalendar();
  }, [year, month]);

  const fetchMealCalendar = async () => {
    try {
      setLoading(true);
      const response = await mealSelectionService.getMealCalendar(year, month);
      setMealSelections(response.data.mealSelections || []);
    } catch (error) {
      console.error('Error fetching meal calendar:', error);
      toast.error('Failed to load meal calendar');
    } finally {
      setLoading(false);
    }
  };

  const getMealForDate = (date) => {
    const dateStr = new Date(date).toISOString().split('T')[0];
    return mealSelections.find(
      (m) => new Date(m.date).toISOString().split('T')[0] === dateStr
    );
  };

  const handleDateClick = (date) => {
    const meal = getMealForDate(date);
    setSelectedDate(date);
    setSelectedMeals(
      meal?.meals || {
        breakfast: false,
        lunch: false,
        dinner: false,
      }
    );
  };

  const handleMealToggle = (mealType) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [mealType]: !prev[mealType],
    }));
  };

  const handleSaveMeals = async () => {
    try {
      await mealSelectionService.selectMealsForDay(selectedDate, selectedMeals);
      toast.success('Meals updated successfully');
      fetchMealCalendar();
      setSelectedDate(null);
    } catch (error) {
      console.error('Error saving meals:', error);
      toast.error(error.response?.data?.message || 'Failed to save meals');
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month - 1, i));
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold gradient-text mb-6">
        {monthNames[month - 1]} {year}
      </h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
        </div>
      ) : (
        <>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-secondary-600 dark:text-secondary-400 py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="p-2" />;
              }

              const meal = getMealForDate(date);
              const mealCount = (meal?.meals.breakfast ? 1 : 0) +
                (meal?.meals.lunch ? 1 : 0) +
                (meal?.meals.dinner ? 1 : 0);
              const isSelected = selectedDate && new Date(selectedDate).toDateString() === date.toDateString();

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className={`p-3 rounded-lg font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg'
                      : mealCount > 0
                      ? 'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600'
                  }`}
                >
                  <div className="text-sm">{date.getDate()}</div>
                  {mealCount > 0 && (
                    <div className="text-xs mt-1 opacity-75">{mealCount} meals</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Meal Selection Panel */}
          {selectedDate && (
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-800">
              <h3 className="text-lg font-bold mb-4">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>

              <div className="space-y-3 mb-6">
                {['breakfast', 'lunch', 'dinner'].map((mealType) => (
                  <label
                    key={mealType}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-secondary-700 rounded-lg cursor-pointer hover:shadow-md transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMeals[mealType]}
                      onChange={() => handleMealToggle(mealType)}
                      className="w-5 h-5 rounded accent-purple-600"
                    />
                    <span className="font-semibold capitalize text-secondary-700 dark:text-secondary-300">
                      {mealType}
                    </span>
                    <span className="ml-auto text-sm text-secondary-500">
                      {selectedMeals[mealType] ? '✓ Selected' : 'Not selected'}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveMeals}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Save Meals
                </button>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="flex-1 px-4 py-2 bg-secondary-200 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-lg font-semibold hover:bg-secondary-300 dark:hover:bg-secondary-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MealSelectionCalendar;
