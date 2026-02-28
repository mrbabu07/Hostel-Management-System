const Inventory = require("../models/Inventory.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { auditLog } = require("../services/audit.service");

// Get all inventory items
exports.getAllItems = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.itemName = { $regex: search, $options: "i" };
    }

    const items = await Inventory.find(query).sort({ createdAt: -1 });

    res.json(new ApiResponse(200, { items }));
  } catch (error) {
    next(error);
  }
};

// Get single inventory item
exports.getItemById = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      throw new ApiError(404, "Inventory item not found");
    }

    res.json(new ApiResponse(200, { item }));
  } catch (error) {
    next(error);
  }
};

// Create inventory item
exports.createItem = async (req, res, next) => {
  try {
    const item = await Inventory.create(req.body);

    await auditLog(req.user._id, "inventory.create", "Inventory", item._id, {
      itemName: item.itemName,
      quantity: item.quantity,
    });

    res.status(201).json(
      new ApiResponse(201, { item }, "Inventory item created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Update inventory item
exports.updateItem = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      throw new ApiError(404, "Inventory item not found");
    }

    const oldQuantity = item.quantity;
    Object.assign(item, req.body);
    await item.save();

    await auditLog(req.user._id, "inventory.update", "Inventory", item._id, {
      itemName: item.itemName,
      oldQuantity,
      newQuantity: item.quantity,
    });

    res.json(
      new ApiResponse(200, { item }, "Inventory item updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Delete inventory item
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      throw new ApiError(404, "Inventory item not found");
    }

    await item.deleteOne();

    await auditLog(req.user._id, "inventory.delete", "Inventory", item._id, {
      itemName: item.itemName,
    });

    res.json(new ApiResponse(200, null, "Inventory item deleted successfully"));
  } catch (error) {
    next(error);
  }
};

// Restock item
exports.restockItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      throw new ApiError(400, "Valid quantity is required");
    }

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      throw new ApiError(404, "Inventory item not found");
    }

    const oldQuantity = item.quantity;
    item.quantity += quantity;
    item.lastRestocked = new Date();
    await item.save();

    await auditLog(req.user._id, "inventory.restock", "Inventory", item._id, {
      itemName: item.itemName,
      addedQuantity: quantity,
      oldQuantity,
      newQuantity: item.quantity,
    });

    res.json(
      new ApiResponse(200, { item }, "Inventory item restocked successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res, next) => {
  try {
    const items = await Inventory.find({
      status: { $in: ["low-stock", "out-of-stock"] },
    }).sort({ quantity: 1 });

    res.json(new ApiResponse(200, { items, count: items.length }));
  } catch (error) {
    next(error);
  }
};

// Get inventory statistics
exports.getInventoryStats = async (req, res, next) => {
  try {
    const totalItems = await Inventory.countDocuments();
    const lowStockItems = await Inventory.countDocuments({ status: "low-stock" });
    const outOfStockItems = await Inventory.countDocuments({ status: "out-of-stock" });
    const inStockItems = await Inventory.countDocuments({ status: "in-stock" });

    const categoryStats = await Inventory.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);

    const totalValue = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);

    res.json(
      new ApiResponse(200, {
        totalItems,
        lowStockItems,
        outOfStockItems,
        inStockItems,
        categoryStats,
        totalInventoryValue: totalValue[0]?.total || 0,
      })
    );
  } catch (error) {
    next(error);
  }
};
