const { z } = require("zod");

const complaintSchema = z.object({
  category: z.enum(["food", "room", "maintenance", "other"]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(["pending", "in-progress", "resolved"]),
  adminNotes: z.string().optional(),
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }
};

module.exports = {
  validateComplaint: validate(complaintSchema),
  validateComplaintStatus: validate(updateStatusSchema),
};
