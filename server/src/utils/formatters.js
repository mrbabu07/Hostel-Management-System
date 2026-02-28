/**
 * Format date to readable string
 */
const formatDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format date and time
 */
const formatDateTime = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format currency
 */
const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

module.exports = {
  formatDate,
  formatDateTime,
  formatCurrency,
};
