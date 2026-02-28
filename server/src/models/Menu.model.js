const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },
    items: [
      {
        name: String,
        description: String,
      },
    ],
    imageUrl: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to ensure one menu per meal per day
menuSchema.index({ date: 1, mealType: 1 }, { unique: true });

module.exports = mongoose.model("Menu", menuSchema);
