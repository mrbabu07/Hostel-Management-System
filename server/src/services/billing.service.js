const Bill = require("../models/Bill.model");
const MealSelection = require("../models/MealSelection.model");
const settingsService = require("./settings.service");
const ApiError = require("../utils/ApiError");

class BillingService {
  /**
   * Calculate per-meal cost based on monthly budget
   */
  async calculatePerMealCost(year, month) {
    const settings = await settingsService.getSettings();
    const monthlyMealBudget = settings?.monthlyMealBudget || 4000; // Default 4000 BDT

    // Get number of days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    const totalMealsInMonth = daysInMonth * 3; // 3 meals per day

    const perMealCost = monthlyMealBudget / totalMealsInMonth;
    return perMealCost;
  }

  /**
   * Get meal counts for a student in a month
   */
  async getMealCountsForMonth(studentId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const mealCounts = await MealSelection.aggregate([
      {
        $match: {
          student: require("mongoose").Types.ObjectId(studentId),
          date: { $gte: startDate, $lte: endDate },
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

    return mealCounts[0] || {
      breakfastCount: 0,
      lunchCount: 0,
      dinnerCount: 0,
      totalMeals: 0,
    };
  }

  /**
   * Generate bill for a student for a month
   */
  async generateBill(studentId, year, month, generatedBy) {
    const settings = await settingsService.getSettings();
    const fixedCost = settings?.fixedHostelFee || 2000; // Default 2000 BDT

    // Get meal counts
    const mealCounts = await this.getMealCountsForMonth(studentId, year, month);

    // Calculate per-meal cost
    const perMealCost = await this.calculatePerMealCost(year, month);

    // Calculate meal costs
    const breakfastTotal = mealCounts.breakfastCount * perMealCost;
    const lunchTotal = mealCounts.lunchCount * perMealCost;
    const dinnerTotal = mealCounts.dinnerCount * perMealCost;
    const totalMealCost = mealCounts.totalMeals * perMealCost;

    // Calculate total bill
    const totalAmount = fixedCost + totalMealCost;

    // Create or update bill
    const bill = await Bill.findOneAndUpdate(
      { student: studentId, month, year },
      {
        student: studentId,
        month,
        year,
        breakdown: {
          breakfast: {
            count: mealCounts.breakfastCount,
            rate: perMealCost,
            total: breakfastTotal,
          },
          lunch: {
            count: mealCounts.lunchCount,
            rate: perMealCost,
            total: lunchTotal,
          },
          dinner: {
            count: mealCounts.dinnerCount,
            rate: perMealCost,
            total: dinnerTotal,
          },
        },
        totalAmount,
        generatedBy,
      },
      { upsert: true, new: true }
    );

    return bill;
  }

  /**
   * Generate bills for all students for a month
   */
  async generateBillsForMonth(year, month, generatedBy) {
    const User = require("../models/User.model");

    // Get all students
    const students = await User.find({ role: "student" });

    const bills = [];
    for (const student of students) {
      const bill = await this.generateBill(student._id, year, month, generatedBy);
      bills.push(bill);
    }

    return bills;
  }

  /**
   * Get bill with fixed cost and meal cost breakdown
   */
  async getBillDetails(billId) {
    const bill = await Bill.findById(billId).populate("student", "name email rollNumber");

    if (!bill) {
      throw new ApiError(404, "Bill not found");
    }

    const settings = await settingsService.getSettings();
    const fixedCost = settings?.fixedHostelFee || 2000;

    return {
      ...bill.toObject(),
      fixedCost,
      mealCost: bill.totalAmount - fixedCost,
    };
  }

  /**
   * Get student's monthly bill summary
   */
  async getStudentBillSummary(studentId, year, month) {
    const bill = await Bill.findOne({ student: studentId, month, year });

    if (!bill) {
      throw new ApiError(404, "Bill not found for this month");
    }

    const settings = await settingsService.getSettings();
    const fixedCost = settings?.fixedHostelFee || 2000;

    return {
      month,
      year,
      fixedCost,
      mealCost: bill.totalAmount - fixedCost,
      totalAmount: bill.totalAmount,
      breakdown: bill.breakdown,
      status: bill.status,
      paidAt: bill.paidAt,
    };
  }
}

module.exports = new BillingService();
