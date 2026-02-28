import api from "./api";

export const auditService = {
  // Get audit logs with filters
  getAuditLogs: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.action) params.append("action", filters.action);
    if (filters.entityType) params.append("entityType", filters.entityType);
    if (filters.userId) params.append("userId", filters.userId);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const response = await api.get(`/audit?${params.toString()}`);
    return response.data;
  },

  // Export audit logs
  exportAuditLogs: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.action) params.append("action", filters.action);
    if (filters.entityType) params.append("entityType", filters.entityType);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const response = await api.get(`/audit/export?${params.toString()}`, {
      responseType: "blob",
    });
    return response.data;
  },
};
