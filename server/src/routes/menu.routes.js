const express = require("express");
const {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu.controller");
const { validateMenu } = require("../validations/menu.validation");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", protect, getMenus);
router.post(
  "/",
  protect,
  authorize("manager", "admin"),
  validateMenu,
  createMenu,
);
router.put("/:id", protect, authorize("manager", "admin"), updateMenu);
router.delete("/:id", protect, authorize("manager", "admin"), deleteMenu);

module.exports = router;
