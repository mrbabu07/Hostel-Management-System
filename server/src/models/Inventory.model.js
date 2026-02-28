const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["vegetables", "grains", "dairy", "spices", "beverages", "other"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: ["kg", "g", "l", "ml", "pieces", "packets", "bags"],
    },
    minThreshold: {
      type: Number,
      required: [true, "Minimum threshold is required"],
      min: [0, "Threshold cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    supplier: {
      type: String,
      trim: true,
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["in-stock", "low-stock", "out-of-stock"],
      default: function () {
        if (this.quantity === 0) return "out-of-stock";
        if (this.quantity <= this.minThreshold) return "low-stock";
        return "in-stock";
      },
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Update status before saving
inventorySchema.pre("save", function (next) {
  if (this.quantity === 0) {
    this.status = "out-of-stock";
  } else if (this.quantity <= this.minThreshold) {
    this.status = "low-stock";
  } else {
    this.status = "in-stock";
  }
  next();
});

// Index for faster queries
inventorySchema.index({ itemName: 1, category: 1 });
inventorySchema.index({ status: 1 });

module.exports = mongoose.model("Inventory", inventorySchema);
