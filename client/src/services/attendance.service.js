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
  getMyAttendance: (month, year) =>
    api.get(`/attendance/me?month=${month}&year=${year}`),
};
