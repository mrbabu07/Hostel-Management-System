const ApiError = require("../utils/ApiError");
const { validationResult } = require("express-validator");

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors.array(),
    });
  }
  next();
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field} already exists`;
    error = new ApiError(400, message);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, "Validation Error", message);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired");
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    errors: error.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { errorHandler, validateRequest };
