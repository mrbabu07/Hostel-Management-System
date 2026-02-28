const AuditLog = require("../models/AuditLog.model");
const { logger } = require("../utils/logger");

class AuditService {
  /**
   * Create an audit log entry
   */
  static async log({
    actorId,
    actorRole,
    action,
    entityType,
    entityId,
    before = null,
    after = null,
    description,
    ipAddress = null,
    userAgent = null,
    metadata = {},
  }) {
    try {
      const auditLog = await AuditLog.create({
        actorId,
        actorRole,
        action,
        entityType,
        entityId,
        before,
        after,
        description,
        ipAddress,
        userAgent,
        metadata,
      });

      logger.info(
        {
          auditLogId: auditLog._id,
          actorId,
          action,
          entityType,
          entityId,
        },
        "Audit log created",
      );

      return auditLog;
    } catch (error) {
      logger.error({ error: error.message }, "Failed to create audit log");
      // Don't throw - audit logging should not break the main flow
    }
  }

  /**
   * Get audit logs with filters
   */
  static async getLogs({
    actorId,
    entityType,
    entityId,
    action,
    from,
    to,
    page = 1,
    limit = 50,
  }) {
    const query = {};

    if (actorId) query.actorId = actorId;
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    if (action) query.action = action;

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate("actorId", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(query),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get audit trail for a specific entity
   */
  static async getEntityTrail(entityType, entityId) {
    const logs = await AuditLog.find({ entityType, entityId })
      .populate("actorId", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    return logs;
  }
}

module.exports = AuditService;
