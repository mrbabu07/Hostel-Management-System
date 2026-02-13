const { z } = require("zod");

const mealPlanSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  meals: z.object({
    breakfast: z.boolean().optional(),
    lunch: z.boolean().optional(),
    dinner: z.boolean().optional(),
  }),
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
  validateMealPlan: validate(mealPlanSchema),
};
