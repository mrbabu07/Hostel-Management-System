const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error.middleware");

// Import routes
const authRoutes = require("./routes/auth.routes");
const menuRoutes = require("./routes/menu.routes");
const mealPlanRoutes = require("./routes/mealplan.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const billingRoutes = require("./routes/billing.routes");
const complaintRoutes = require("./routes/complaint.routes");
const noticeRoutes = require("./routes/notice.routes");
const feedbackRoutes = require("./routes/feedback.routes");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/menus", menuRoutes);
app.use("/api/v1/meal-plans", mealPlanRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/billing", billingRoutes);
app.use("/api/v1/complaints", complaintRoutes);
app.use("/api/v1/notices", noticeRoutes);
app.use("/api/v1/feedback", feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
