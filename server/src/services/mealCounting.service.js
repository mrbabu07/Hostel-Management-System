const mongoose = require("mongoose");
const MealSelection = require("../models/MealSelection.model");

class MealCountingService {
  /**
   * Calculate total meals for a student within a date range
   * @param {ObjectId} studentId - Student ID
   * @param {Date} startDate - Start date (inclusive)
   * @param {Date} endDate - End date (inclusive)
   * @returns {Object} - { breakfast, lunch, dinner, totalMeals }
   */
  async calculateStudentMeals(studentId, startDate, endDate) {
    try {
      // Validate inputs
      if (!studentId) {
        throw new Error("Student ID is required");
      }

      if (!startDate || !endDate) {
        throw new Error("Start date and end date are required");
      }

      // Ensure dates are at start/end of day
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      // Use aggregation for efficient counting
      const mealCounts = await MealSelection.aggregate([
        {
          $match: {
            student: new mongoose.Types.ObjectId(studentId),
            date: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            breakfastCount: {
              $sum: { $cond: ["$meals.breakfast", 1, 0] },
            },
            lunchCount: {
              $sum: { $cond: ["$meals.lunch", 1, 0] },
            },
            dinnerCount: {
              $sum: { $cond: ["$meals.dinner", 1, 0] },
            },
            totalMeals: {
              $sum: {
                $add: [
                  { $cond: ["$meals.breakfast", 1, 0] },
                  { $cond: ["$meals.lunch", 1, 0] },
                  { $cond: ["$meals.dinner", 1, 0] },
                ],
              },
            },
          },
        },
      ]);

      // If no data found, return zeros
      if (mealCounts.length === 0) {
        return {
          breakfast: 0,
          lunch: 0,
          dinner: 0,
          totalMeals: 0,
        };
      }

      // Return the aggregated data
      return {
        breakfast: mealCounts[0].breakfastCount || 0,
        lunch: mealCounts[0].lunchCount || 0,
        dinner: mealCounts[0].dinnerCount || 0,
        totalMeals: mealCounts[0].totalMeals || 0,
      };
    } catch (error) {
      console.error(`Error calculating meals for student ${studentId}:`, error);
      // Return zeros on error instead of throwing
      return {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        totalMeals: 0,
      };
    }
  }

  /**
   * Get meal counts for a specific month
   * @param {ObjectId} studentId - Student ID
   * @param {Number} year - Year (e.g., 2024)
   * @param {Number} month - Month (1-12)
   * @returns {Object} - Meal counts for the month
   */
  async calculateStudentMealsForMonth(studentId, year, month) {
    // Validate month
    if (month < 1 || month > 12) {
      throw new Error("Month must be between 1 and 12");
    }

    // Get first and last day of month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.calculateStudentMeals(studentId, startDate, endDate);
  }
}

module.exports = new MealCountingService();
