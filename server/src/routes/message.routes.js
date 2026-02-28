const express = require("express");
const {
  getConversation,
  getConversations,
  getAvailableUsers,
  markAsRead,
} = require("../controllers/message.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get("/conversations", getConversations);
router.get("/users", getAvailableUsers);
router.get("/:userId", getConversation);
router.patch("/:userId/read", markAsRead);

module.exports = router;
