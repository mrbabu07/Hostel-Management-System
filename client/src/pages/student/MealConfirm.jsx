import { useState, useEffect } from "react";
import ModernLayout from "../../components/layout/ModernLayout";
import { mealPlanService } from "../../services/mealplan.service";
import { toISODate } from "../../utils/formatDate";
import Button from "../../components/common/Button";

const MealConfirm = () => {
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleMealChange = (mealType) => {
    setMeals({ ...meals, [mealType]: !meals[mealType] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await mealPlanService.createMealPlan({ date: selectedDate, meals });
      setMessage("Meal plan saved successfully!");
    } catch (error) {
      setMessage("Error saving meal plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Confirm Meals</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full"
                min={toISODate(new Date())}
              />
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold">Select Meals</h3>

              {["breakfast", "lunch", "dinner"].map((mealType) => (
                <label
                  key={mealType}
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={meals[mealType]}
                    onChange={() => handleMealChange(mealType)}
                    className="w-5 h-5"
                  />
                  <span className="capitalize font-medium">{mealType}</span>
                </label>
              ))}
            </div>

            {message && (
              <div
                className={`mb-4 p-3 rounded ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {message}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Confirm Meals"}
            </Button>
          </form>
        </div>
      </div>
    </ModernLayout>
  );
};

export default MealConfirm;
