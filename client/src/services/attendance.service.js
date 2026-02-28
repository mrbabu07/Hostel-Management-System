import api from "./api";

export const attendanceService = {
  markAttendance: (attendanceData) =>
    api.post("/attendance/mark", attendanceData),
  getAttendanceReport: (date, mealType) => {
    let url = "/attendance/report?";
    if (date) url += `date=${date}&`;
    if (mealType) url += `mealType=${mealType}`;
    return api.get(url);
  },
  getMyAttendance: (month, year) => {
    let url = "/attendance/me";
    if (month && year) url += `?month=${month}&year=${year}`;
    return api.get(url);
  },
  // Student self-marking
  markSelfAttendance: (data) => api.post("/attendance/self-mark", data),
  // Manager approval
  approveAttendance: (id) => api.patch(`/attendance/${id}/approve`),
  getPendingAttendance: () => api.get("/attendance/pending"),
  exportAttendanceCSV: (month, year) =>
    api.get(`/attendance/export?month=${month}&year=${year}`, {
      responseType: "blob",
    }),
};
