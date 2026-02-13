export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const toISODate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

export const getCurrentMonth = () => {
  return new Date().getMonth() + 1;
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};
