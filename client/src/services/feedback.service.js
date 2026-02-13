import api from "./api";

export const feedbackService = {
  submitFeedback: (feedbackData) => api.post("/feedback", feedbackData),
  getFeedbackSummary: (startDate, endDate, mealType) => {
    let url = "/feedback/summary?";
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}&`;
    if (mealType) url += `mealType=${mealType}`;
    return api.get(url);
  },
  getMyFeedback: () => api.get("/feedback/me"),
};
