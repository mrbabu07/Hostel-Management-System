const express = require("express");
const {
  getAuditLogs,
  getEntityTrail,
} = require("../controllers/audit.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize("admin"));

router.get("/", getAuditLogs);
router.get("/trail/:entityType/:entityId", getEntityTrail);

module.exports = router;
