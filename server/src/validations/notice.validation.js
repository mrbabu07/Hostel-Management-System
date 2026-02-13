const { z } = require("zod");

const createNoticeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  audience: z.enum(["all", "student", "manager"]).optional(),
  isPinned: z.boolean().optional(),
});

const updateNoticeSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  audience: z.enum(["all", "student", "manager"]).optional(),
  isPinned: z.boolean().optional(),
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
  validateCreateNotice: validate(createNoticeSchema),
  validateUpdateNotice: validate(updateNoticeSchema),
};
