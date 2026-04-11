const mongoose = require("mongoose");
const MealSelection = require("../models/MealSelection.model");
const ApiError = require("../utils/ApiError");

class MealSelectionService {
  /**
   * Select meals for a single day
   */
  async selectMealsForDay(studentId, date, meals) {
    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);

    const mealSelection = await MealSelection.findOneAndUpdate(
      { student: studentId, date: mealDate },
      {
        student: studentId,
        date: mealDate,
        meals: {
          breakfast: meals.breakfast || false,
          lunch: meals.lunch || false,
          dinner: meals.dinner || false,
        },
      },
      { upsert: true, new: true }
    );

    return mealSelection;
  }

  /**
   * Bulk select meals for a date range
   */
  async selectMealsForDateRange(studentId, startDate, endDate, meals) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Generate all dates in range
    const dates = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Prepare bulk operations
    const bulkOps = dates.map((date) => ({
      updateOne: {
        filter: { student: studentId, date },
        update: {
          $set: {
            student: studentId,
            date,
            meals: {
              breakfast: meals.breakfast || false,
              lunch: meals.lunch || false,
              dinner: meals.dinner || false,
            },
          },
        },
        upsert: true,
      },
    }));

    // Execute bulk operations
    const result = await MealSelection.bulkWrite(bulkOps);
    return result;
  }

  /**
   * Get meal calendar for a student (month view)
   */
  async getMealCalendar(studentId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const mealSelections = await MealSelection.find({
      student: studentId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    return mealSelections;
  }

  /**
   * Get meal summary for a student (monthly count)
   */
  async getMealSummary(studentId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const summary = await MealSelection.aggregate([
      {
        $match: {
          student: mongoose.Types.ObjectId(studentId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalBreakfast: {
            $sum: { $cond: ["$meals.breakfast", 1, 0] },
          },
          totalLunch: {
            $sum: { $cond: ["$meals.lunch", 1, 0] },
          },
          totalDinner: {
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

    return summary[0] || {
      totalBreakfast: 0,
      totalLunch: 0,
      totalDinner: 0,
      totalMeals: 0,
    };
  }

  /**
   * Get daily meal counts (admin view)
   */
  async getDailyMealCounts(date) {
    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);

    const endDate = new Date(mealDate);
    endDate.setHours(23, 59, 59, 999);

    const counts = await MealSelection.aggregate([
      {
        $match: {
          date: { $gte: mealDate, $lte: endDate },
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
          totalCount: { $sum: 1 },
        },
      },
    ]);

    return counts[0] || {
      breakfastCount: 0,
      lunchCount: 0,
      dinnerCount: 0,
      totalCount: 0,
    };
  }

  /**
   * Get meal selections for a date range (admin view)
   */
  async getMealSelectionsForDateRange(startDate, endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const selections = await MealSelection.find({
      date: { $gte: start, $lte: end },
    })
      .populate("student", "name email rollNumber")
      .sort({ date: 1, "student.name": 1 });

    return selections;
  }

  /**
   * Check if student can modify meals (before cutoff time)
   */
  async canModifyMeals(cutoffHour, cutoffMinute) {
    const now = new Date();
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffHour, cutoffMinute, 0, 0);

    return now < cutoffTime;
  }

  /**
   * Get next day's meal selection
   */
  async getNextDayMeals(studentId) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfDay = new Date(tomorrow);
    endOfDay.setHours(23, 59, 59, 999);

    const mealSelection = await MealSelection.findOne({
      student: studentId,
      date: { $gte: tomorrow, $lte: endOfDay },
    });

    return mealSelection;
  }
}

module.exports = new MealSelectionService();
