const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { validateRequest } = require("../middleware/error.middleware");
const { body, param } = require("express-validator");

// Routes accessible by manager and admin
router.get(
  "/",
  protect,
  authorize("manager", "admin"),
  inventoryController.getAllItems
);

router.get(
  "/stats",
  protect,
  authorize("manager", "admin"),
  inventoryController.getInventoryStats
);

router.get(
  "/low-stock",
  protect,
  authorize("manager", "admin"),
  inventoryController.getLowStockItems
);

router.get(
  "/:id",
  protect,
  authorize("manager", "admin"),
  param("id").isMongoId().withMessage("Invalid item ID"),
  validateRequest,
  inventoryController.getItemById
);

router.post(
  "/",
  protect,
  authorize("manager", "admin"),
  body("itemName").trim().notEmpty().withMessage("Item name is required"),
  body("category").isIn(["vegetables", "grains", "dairy", "spices", "beverages", "other"]).withMessage("Invalid category"),
  body("quantity").isFloat({ min: 0 }).withMessage("Quantity must be a positive number"),
  body("unit").isIn(["kg", "g", "l", "ml", "pieces", "packets", "bags"]).withMessage("Invalid unit"),
  body("minThreshold").isFloat({ min: 0 }).withMessage("Minimum threshold must be a positive number"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  validateRequest,
  inventoryController.createItem
);

router.put(
  "/:id",
  protect,
  authorize("manager", "admin"),
  param("id").isMongoId().withMessage("Invalid item ID"),
  validateRequest,
  inventoryController.updateItem
);

router.delete(
  "/:id",
  protect,
  authorize("manager", "admin"),
  param("id").isMongoId().withMessage("Invalid item ID"),
  validateRequest,
  inventoryController.deleteItem
);

router.patch(
  "/:id/restock",
  protect,
  authorize("manager", "admin"),
  param("id").isMongoId().withMessage("Invalid item ID"),
  body("quantity").isFloat({ min: 0.01 }).withMessage("Quantity must be greater than 0"),
  validateRequest,
  inventoryController.restockItem
);

module.exports = router;
