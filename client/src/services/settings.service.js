import api from "./api";

export const settingsService = {
  // Get current settings
  getSettings: async () => {
    const response = await api.get("/settings");
    return response.data;
  },

  // Update settings
  updateSettings: async (settingsData) => {
    const response = await api.patch("/settings", settingsData);
    return response.data;
  },

  // Add holiday
  addHoliday: async (holidayData) => {
    const response = await api.post("/settings/holidays", holidayData);
    return response.data;
  },

  // Remove holiday
  removeHoliday: async (holidayId) => {
    const response = await api.delete(`/settings/holidays/${holidayId}`);
    return response.data;
  },
};
