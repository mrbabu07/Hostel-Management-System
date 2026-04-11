import api from "./api";

export const mealSelectionService = {
  // Select meals for a single day
  selectMealsForDay: (date, meals) =>
    api.post("/meals/select", { date, meals }),

  // Bulk select meals for a date range
  selectMealsForDateRange: (startDate, endDate, meals) =>
    api.post("/meals/bulk", { startDate, endDate, meals }),

  // Get meal calendar for a month
  getMealCalendar: (year, month) =>
    api.get(`/meals/my-calendar?year=${year}&month=${month}`),

  // Get meal summary for a month
  getMealSummary: (year, month) =>
    api.get(`/meals/summary?year=${year}&month=${month}`),

  // Admin: Get daily meal counts
  getDailyMealCounts: (date) =>
    api.get(`/meals/daily-counts?date=${date}`),

  // Admin: Get meal selections for date range
  getMealSelectionsForDateRange: (startDate, endDate) =>
    api.get(`/meals/range?startDate=${startDate}&endDate=${endDate}`),
};
