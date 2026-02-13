const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["general", "urgent", "event", "maintenance"],
      default: "general",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    targetAudience: {
      type: String,
      enum: ["all", "students", "managers"],
      default: "all",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Notice", noticeSchema);
