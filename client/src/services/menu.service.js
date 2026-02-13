import api from "./api";

export const menuService = {
  getMenus: (date) => api.get(`/menus?date=${date}`),
  createMenu: (menuData) => api.post("/menus", menuData),
  updateMenu: (id, menuData) => api.put(`/menus/${id}`, menuData),
  deleteMenu: (id) => api.delete(`/menus/${id}`),
};
