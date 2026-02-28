const { v4: uuidv4 } = require("uuid");

const requestId = (req, res, next) => {
  // Generate unique request ID
  req.id = req.headers["x-request-id"] || uuidv4();

  // Add to response headers
  res.setHeader("X-Request-Id", req.id);

  // Add to request object for logging
  req.startTime = Date.now();

  next();
};

module.exports = requestId;
