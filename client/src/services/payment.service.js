import api from "./api";

export const paymentService = {
  /**
   * Create a payment intent for a bill
   * @param {string} billId - Bill ID
   * @param {number} amount - Amount to pay
   * @returns {Promise} - Payment intent data
   */
  createPaymentIntent: (billId, amount) =>
    api.post("/payments/create-intent", { billId, amount }),

  /**
   * Confirm payment after successful Stripe payment
   * @param {string} billId - Bill ID
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @returns {Promise} - Confirmation data
   */
  confirmPayment: (billId, paymentIntentId) =>
    api.post("/payments/confirm", { billId, paymentIntentId }),

  /**
   * Get payment history for current user
   * @returns {Promise} - Payment history
   */
  getPaymentHistory: () => api.get("/payments/history"),
};
