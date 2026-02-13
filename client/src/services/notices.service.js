import api from "./api";

export const noticesService = {
  createNotice: (noticeData) => api.post("/notices", noticeData),
  getAllNotices: () => api.get("/notices"),
  updateNotice: (id, noticeData) => api.put(`/notices/${id}`, noticeData),
  deleteNotice: (id) => api.delete(`/notices/${id}`),
};
