import api from "./api";

export const messageService = {
  // Get conversation with a specific user
  getConversation: (userId) => api.get(`/messages/${userId}`),

  // Get all conversations
  getConversations: () => api.get("/messages/conversations"),

  // Get available users to chat with
  getAvailableUsers: () => api.get("/messages/users"),

  // Mark messages as read
  markAsRead: (userId) => api.patch(`/messages/${userId}/read`),
};
