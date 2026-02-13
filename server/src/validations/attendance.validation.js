const { z } = require("zod");

const attendanceSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  mealType: z.enum(["breakfast", "lunch", "dinner"]),
  present: z.boolean(),
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
  validateAttendance: validate(attendanceSchema),
};
