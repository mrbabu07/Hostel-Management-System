import api from "./api";

export const noticesService = {
  getAll: () => api.get("/notices"),
  getAllNotices: () => api.get("/notices"),
  createNotice: (noticeData) => api.post("/notices", noticeData),
  updateNotice: (id, noticeData) => api.put(`/notices/${id}`, noticeData),
  deleteNotice: (id) => api.delete(`/notices/${id}`),
};
