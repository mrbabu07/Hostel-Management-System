import api from "./api";

export const complaintsService = {
  getAll: () => api.get("/complaints"),
  getAllComplaints: (status, category) => {
    let url = "/complaints?";
    if (status) url += `status=${status}&`;
    if (category) url += `category=${category}`;
    return api.get(url);
  },
  getMyComplaints: () => api.get("/complaints/me"),
  createComplaint: (complaintData) => api.post("/complaints", complaintData),
  updateComplaintStatus: (id, statusData) =>
    api.patch(`/complaints/${id}/status`, statusData),
};
