const { z } = require("zod");

const menuSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  mealType: z.enum(["breakfast", "lunch", "dinner"]),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        description: z.string().optional(),
      }),
    )
    .min(1, "At least one menu item is required"),
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
  validateMenu: validate(menuSchema),
};
