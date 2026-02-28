const asyncHandler = require("express-async-handler");
const AuditService = require("../services/audit.service");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Get audit logs
// @route   GET /api/v1/audit
// @access  Admin
const getAuditLogs = asyncHandler(async (req, res) => {
  const {
    actorId,
    entityType,
    entityId,
    action,
    from,
    to,
    page = 1,
    limit = 50,
  } = req.query;

  const result = await AuditService.getLogs({
    actorId,
    entityType,
    entityId,
    action,
    from,
    to,
    page: parseInt(page),
    limit: parseInt(limit),
  });

  res.json(new ApiResponse(200, result, "Audit logs retrieved successfully"));
});

// @desc    Get audit trail for specific entity
// @route   GET /api/v1/audit/trail/:entityType/:entityId
// @access  Admin
const getEntityTrail = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;

  const trail = await AuditService.getEntityTrail(entityType, entityId);

  res.json(
    new ApiResponse(200, trail, "Entity audit trail retrieved successfully"),
  );
});

module.exports = {
  getAuditLogs,
  getEntityTrail,
};
