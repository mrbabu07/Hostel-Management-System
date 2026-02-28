const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    breakdown: {
      breakfast: {
        count: { type: Number, default: 0 },
        rate: { type: Number, default: 30 },
        total: { type: Number, default: 0 },
      },
      lunch: {
        count: { type: Number, default: 0 },
        rate: { type: Number, default: 50 },
        total: { type: Number, default: 0 },
      },
      dinner: {
        count: { type: Number, default: 0 },
        rate: { type: Number, default: 50 },
        total: { type: Number, default: 0 },
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "cash", "other"],
    },
    transactionId: {
      type: String,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to ensure one bill per student per month
billSchema.index({ student: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Bill", billSchema);
