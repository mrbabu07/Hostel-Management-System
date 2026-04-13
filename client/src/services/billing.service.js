import api from "./api";

export const billingService = {
  getMyBills: () => api.get("/billing/me"),
  getMyBill: (month, year) =>
    api.get(`/billing/me?month=${month}&year=${year}`),
  getAllBills: (month, year) => {
    let url = "/billing";
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (year) params.append("year", year);
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url);
  },
  generateBills: (month, year) =>
    api.post("/billing/generate", { month, year }),
  seedBills: (month, year) =>
    api.post("/billing/seed", { month, year }),
  deleteAllAndGenerateBills: (month, year) =>
    api.post("/billing/delete-all-and-generate", { month, year }),
  resetAndGenerateBills: (month, year) =>
    api.post("/billing/reset-and-generate", { month, year }),
  regenerateBills: (month, year) =>
    api.post("/billing/regenerate", { month, year }),
  fixAllBills: () =>
    api.post("/billing/fix-all"),
  getBillsWithMissingData: () =>
    api.get("/billing/check/missing-data"),
  updateBillStatus: (billId, status) =>
    api.put(`/billing/${billId}`, { status }),
  getStudentBills: (studentId) =>
    api.get(`/billing/student/${studentId}`),
};
