const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    // Meal Pricing
    breakfastPrice: {
      type: Number,
      default: 30,
      min: 0,
    },
    lunchPrice: {
      type: Number,
      default: 50,
      min: 0,
    },
    dinnerPrice: {
      type: Number,
      default: 40,
      min: 0,
    },

    // Meal Confirmation Settings
    cutoffTime: {
      type: String,
      default: "20:00", // 8 PM
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    cutoffDaysBefore: {
      type: Number,
      default: 1, // 1 day before
      min: 0,
    },

    // Billing Settings
    extraCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    taxPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Holidays (no meal days)
    holidays: [
      {
        date: {
          type: Date,
          required: true,
        },
        reason: {
          type: String,
          required: true,
        },
      },
    ],

    // System Settings
    messName: {
      type: String,
      default: "Hostel Mess",
    },
    messAddress: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    contactPhone: {
      type: String,
      default: "",
    },

    // Notification Settings
    enableEmailNotifications: {
      type: Boolean,
      default: false,
    },
    enableSMSNotifications: {
      type: Boolean,
      default: false,
    },

    // Last updated by
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("Settings", settingsSchema);
