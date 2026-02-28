const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const { errorHandler } = require("./middleware/error.middleware");
const requestId = require("./middleware/requestId.middleware");
const loggingMiddleware = require("./middleware/logging.middleware");
const {
  helmetConfig,
  sanitizeData,
  xssProtection,
} = require("./middleware/security.middleware");
const { apiLimiter } = require("./middleware/rateLimit.middleware");

// Import routes
const authRoutes = require("./routes/auth.routes");
const menuRoutes = require("./routes/menu.routes");
const mealPlanRoutes = require("./routes/mealplan.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const billingRoutes = require("./routes/billing.routes");
const complaintRoutes = require("./routes/complaint.routes");
const noticeRoutes = require("./routes/notice.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const settingsRoutes = require("./routes/settings.routes");
const auditRoutes = require("./routes/audit.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const messageRoutes = require("./routes/message.routes");
const paymentRoutes = require("./routes/payment.routes");
const usersRoutes = require("./routes/users.routes");
const inventoryRoutes = require("./routes/inventory.routes");

const app = express();

// CORS - FIRST, before anything else
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Request ID middleware
app.use(requestId);

// Logging middleware
app.use(loggingMiddleware);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware (sanitization only, no helmet)
app.use(sanitizeData);
app.use(xssProtection);

// Rate limiting
app.use("/api", apiLimiter);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/menus", menuRoutes);
app.use("/api/v1/meal-plans", mealPlanRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/billing", billingRoutes);
app.use("/api/v1/complaints", complaintRoutes);
app.use("/api/v1/notices", noticeRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/audit", auditRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/inventory", inventoryRoutes);

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
