const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    // Who performed the action
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorRole: {
      type: String,
      enum: ["student", "manager", "admin"],
      required: true,
    },

    // What action was performed
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "STATUS_CHANGE",
        "BILL_GENERATE",
        "ROLE_CHANGE",
        "SETTINGS_UPDATE",
        "PASSWORD_CHANGE",
        "EXPORT",
      ],
    },

    // What entity was affected
    entityType: {
      type: String,
      required: true,
      enum: [
        "User",
        "Menu",
        "MealPlan",
        "Attendance",
        "Bill",
        "Complaint",
        "Notice",
        "Feedback",
        "Settings",
      ],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Before and after snapshots
    before: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    after: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Additional context
    description: {
      type: String,
      required: true,
    },
    ipAddress: String,
    userAgent: String,

    // Metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient querying
auditLogSchema.index({ actorId: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
