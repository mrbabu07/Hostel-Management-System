import api from "./api";

export const inventoryService = {
  getAllItems: (params) => api.get("/inventory", { params }),
  getItemById: (id) => api.get(`/inventory/${id}`),
  createItem: (data) => api.post("/inventory", data),
  updateItem: (id, data) => api.put(`/inventory/${id}`, data),
  deleteItem: (id) => api.delete(`/inventory/${id}`),
  restockItem: (id, quantity) => api.patch(`/inventory/${id}/restock`, { quantity }),
  getLowStockItems: () => api.get("/inventory/low-stock"),
  getInventoryStats: () => api.get("/inventory/stats"),
};
