import api from "./api";

export const billingService = {
  getMyBills: () => api.get("/billing/me"),
  getMyBill: (month, year) =>
    api.get(`/billing/me?month=${month}&year=${year}`),
  getAllBills: (month, year) => {
    let url = "/billing?";
    if (month && year) url += `month=${month}&year=${year}`;
    return api.get(url);
  },
  generateBills: (month, year) =>
    api.post("/billing/generate", { month, year }),
  deleteAllAndGenerateBills: (month, year) =>
    api.post("/billing/delete-all-and-generate", { month, year }),
  resetAndGenerateBills: (month, year) =>
    api.post("/billing/reset-and-generate", { month, year }),
  regenerateBills: (month, year) =>
    api.post("/billing/regenerate", { month, year }),
  fixAllBills: () =>
    api.post("/billing/fix-all"),
  updateBillStatus: (billId, status) =>
    api.put(`/billing/${billId}`, { status }),
  getStudentBills: (studentId) =>
    api.get(`/billing/student/${studentId}`),
};
