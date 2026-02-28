const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { validateRequest } = require("../middleware/error.middleware");
const { body, param } = require("express-validator");

// Validation rules
const createUserValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["student", "manager", "admin"])
    .withMessage("Invalid role"),
  body("rollNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Roll number cannot be empty"),
  body("roomNumber").optional().trim(),
  body("phone").optional().trim(),
];

const updateUserValidation = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("role")
    .optional()
    .isIn(["student", "manager", "admin"])
    .withMessage("Invalid role"),
  body("rollNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Roll number cannot be empty"),
  body("roomNumber").optional().trim(),
  body("phone").optional().trim(),
];

const idValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

// Routes - All require authentication and admin role
router.get(
  "/",
  protect,
  authorize("admin"),
  usersController.getAllUsers
);

router.get(
  "/stats",
  protect,
  authorize("admin"),
  usersController.getUserStats
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validateRequest,
  usersController.getUserById
);

router.post(
  "/",
  protect,
  authorize("admin"),
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").isIn(["student", "manager", "admin"]).withMessage("Invalid role"),
  validateRequest,
  usersController.createUser
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validateRequest,
  usersController.updateUser
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validateRequest,
  usersController.deleteUser
);

router.patch(
  "/:id/toggle-status",
  protect,
  authorize("admin"),
  param("id").isMongoId().withMessage("Invalid user ID"),
  validateRequest,
  usersController.toggleUserStatus
);

module.exports = router;
