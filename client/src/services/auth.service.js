import api from "./api";

export const authService = {
  register: (userData) => api.post("/auth/register", userData),
  login: (email, password) => api.post("/auth/login", { email, password }),
  getMe: () => api.get("/auth/me"),
};
