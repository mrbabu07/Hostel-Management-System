const Bill = require("../models/Bill.model");
const mealCountingService = require("./mealCounting.service");
const settingsService = require("./settings.service");

class BillingCalculationService {
  /**
   * Generate bill for a single student for a specific month
   * @param {ObjectId} studentId - Student ID
   * @param {Number} year - Year (e.g., 2024)
   * @param {Number} month - Month (1-12)
   * @param {ObjectId} generatedBy - Admin ID who generated the bill
   * @returns {Object} - Created/updated bill
   */
  async generateBillForStudent(studentId, year, month, generatedBy = null) {
    try {
      // Validate inputs
      if (!studentId) {
        throw new Error("Student ID is required");
      }

      if (month < 1 || month > 12) {
        throw new Error("Month must be between 1 and 12");
      }

      console.log(`Generating bill for student ${studentId} for ${month}/${year}`);

      // Get settings for fixed cost and meal budget
      const settings = await settingsService.getSettings();
      const fixedCost = settings?.fixedHostelFee || 2000;
      const monthlyMealBudget = settings?.monthlyMealBudget || 4000;

      // Get meal counts for the student
      const mealCounts = await mealCountingService.calculateStudentMealsForMonth(
        studentId,
        year,
        month
      );

      // Calculate per-meal cost
      const daysInMonth = new Date(year, month, 0).getDate();
      const totalMealsInMonth = daysInMonth * 3; // 3 meals per day
      const perMealCost = monthlyMealBudget / totalMealsInMonth;

      // Calculate meal cost
      const mealCost = mealCounts.totalMeals * perMealCost;

      // Calculate total amount
      const totalAmount = fixedCost + mealCost;

      // Prepare breakdown
      const breakdown = {
        breakfast: {
          count: mealCounts.breakfast,
          rate: perMealCost,
          total: mealCounts.breakfast * perMealCost,
        },
        lunch: {
          count: mealCounts.lunch,
          rate: perMealCost,
          total: mealCounts.lunch * perMealCost,
        },
        dinner: {
          count: mealCounts.dinner,
          rate: perMealCost,
          total: mealCounts.dinner * perMealCost,
        },
      };

      // Create or update bill using upsert
      const bill = await Bill.findOneAndUpdate(
        { student: studentId, month, year },
        {
          student: studentId,
          month,
          year,
          totalMeals: mealCounts.totalMeals,
          mealCost,
          fixedCost,
          totalAmount,
          breakdown,
          generatedBy,
          status: "DUE", // Default status
        },
        {
          upsert: true, // Create if doesn't exist
          new: true, // Return updated document
          runValidators: true,
        }
      );

      console.log(`Bill generated for student ${studentId}: ${totalAmount} BDT`);

      return bill;
    } catch (error) {
      console.error(`Error generating bill for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Get per-meal cost for a specific month
   * @param {Number} year - Year
   * @param {Number} month - Month
   * @param {Number} monthlyMealBudget - Monthly meal budget (default 4000)
   * @returns {Number} - Per-meal cost
   */
  calculatePerMealCost(year, month, monthlyMealBudget = 4000) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const totalMealsInMonth = daysInMonth * 3;
    return monthlyMealBudget / totalMealsInMonth;
  }

  /**
   * Get days in a month
   * @param {Number} year - Year
   * @param {Number} month - Month
   * @returns {Number} - Number of days
   */
  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  /**
   * Calculate billing summary for a student
   * @param {ObjectId} studentId - Student ID
   * @param {Number} year - Year
   * @param {Number} month - Month
   * @returns {Object} - Billing summary
   */
  async getBillingSummary(studentId, year, month) {
    try {
      const bill = await Bill.findOne({ student: studentId, month, year });

      if (!bill) {
        return {
          found: false,
          message: "No bill found for this period",
        };
      }

      return {
        found: true,
        student: bill.student,
        month: bill.month,
        year: bill.year,
        totalMeals: bill.totalMeals,
        mealCost: bill.mealCost,
        fixedCost: bill.fixedCost,
        totalAmount: bill.totalAmount,
        status: bill.status,
        breakdown: bill.breakdown,
        createdAt: bill.createdAt,
        updatedAt: bill.updatedAt,
      };
    } catch (error) {
      console.error(`Error getting billing summary:`, error);
      throw error;
    }
  }
}

module.exports = new BillingCalculationService();
