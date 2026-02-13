import api from "./api";

export const mealPlanService = {
  createMealPlan: (planData) => api.post("/meal-plans", planData),
  getMyMealPlans: (month, year) =>
    api.get(`/meal-plans/me?month=${month}&year=${year}`),
  getAllMealPlans: (date) => api.get(`/meal-plans?date=${date}`),
};
