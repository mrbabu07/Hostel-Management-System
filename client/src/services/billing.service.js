import api from "./api";

export const billingService = {
  generateBills: (month, year) =>
    api.post(`/billing/generate?month=${month}&year=${year}`),
  getMyBill: (month, year) =>
    api.get(`/billing/me?month=${month}&year=${year}`),
  getAllBills: (month, year) => {
    let url = "/billing?";
    if (month && year) url += `month=${month}&year=${year}`;
    return api.get(url);
  },
};
