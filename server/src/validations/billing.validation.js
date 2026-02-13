const { z } = require("zod");

const generateBillSchema = z.object({
  userId: z.string().optional(),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
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
  validateGenerateBill: validate(generateBillSchema),
};
