const mongoose = require("mongoose");
const Bill = require("../models/Bill.model");
const MealSelection = require("../models/MealSelection.model");
const User = require("../models/User.model");
const settingsService = require("./settings.service");
const ApiError = require("../utils/ApiError");

class BillingService {
  /**
   * Calculate per-meal cost based on monthly budget
   */
  calculatePerMealCost(year, month, monthlyMealBudget = 4000) {
    // Get number of days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    const totalMealsInMonth = daysInMonth * 3; // 3 meals per day

    const perMealCost = monthlyMealBudget / totalMealsInMonth;
    return perMealCost;
  }

  /**
   * Get meal counts for a student in a month using aggregation
   */
  async getMealCountsForMonth(studentId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const mealCounts = await MealSelection.aggregate([
      {
        $match: {
          student: new mongoose.Types.ObjectId(studentId),
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
   * Generate bill for a single student for a month
   */
  async generateBillForStudent(studentId, year, month, generatedBy) {
    try {
      // Get settings
      const settings = await settingsService.getSettings();
      const fixedCost = settings?.fixedHostelFee || 2000;
      const monthlyMealBudget = settings?.monthlyMealBudget || 4000;

      // Get meal counts for the student
      const mealCounts = await this.getMealCountsForMonth(studentId, year, month);

      // Calculate per-meal cost
      const perMealCost = this.calculatePerMealCost(year, month, monthlyMealBudget);

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
          totalMeals: mealCounts.totalMeals,
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
          fixedCost,
          mealCost: totalMealCost,
          generatedBy,
        },
        { upsert: true, new: true }
      );

      return bill;
    } catch (error) {
      console.error(`Error generating bill for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Generate bills for all students for a month using optimized aggregation
   */
  async generateBillsForMonth(year, month, generatedBy) {
    try {
      // Get all students
      const students = await User.find({ role: "student" }).select("_id");

      if (students.length === 0) {
        return { bills: [], count: 0, message: "No students found" };
      }

      console.log(`Generating bills for ${students.length} students for ${month}/${year}`);

      const bills = [];
      const errors = [];

      // Generate bill for each student
      for (const student of students) {
        try {
          const bill = await this.generateBillForStudent(student._id, year, month, generatedBy);
          bills.push(bill);
        } catch (error) {
          errors.push({
            studentId: student._id,
            error: error.message,
          });
        }
      }

      if (errors.length > 0) {
        console.warn(`Errors generating bills for ${errors.length} students:`, errors);
      }

      return {
        bills,
        count: bills.length,
        errors: errors.length > 0 ? errors : null,
        message: `Successfully generated ${bills.length} bills${errors.length > 0 ? ` (${errors.length} errors)` : ""}`,
      };
    } catch (error) {
      console.error("Error generating bills for month:", error);
      throw error;
    }
  }

  /**
   * Get bill details with breakdown
   */
  async getBillDetails(billId) {
    const bill = await Bill.findById(billId).populate("student", "name email rollNumber");

    if (!bill) {
      throw new ApiError(404, "Bill not found");
    }

    return bill;
  }

  /**
   * Get student's monthly bill summary
   */
  async getStudentBillSummary(studentId, year, month) {
    const bill = await Bill.findOne({ student: studentId, month, year });

    if (!bill) {
      throw new ApiError(404, "Bill not found for this month");
    }

    return {
      month,
      year,
      fixedCost: bill.fixedCost,
      mealCost: bill.mealCost,
      totalAmount: bill.totalAmount,
      breakdown: bill.breakdown,
      status: bill.status,
      paidAt: bill.paidAt,
    };
  }

  /**
   * Get all bills with filters
   */
  async getAllBills(filters = {}) {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.year) query.year = parseInt(filters.year);
    if (filters.month) query.month = parseInt(filters.month);

    const bills = await Bill.find(query)
      .populate("student", "name email rollNumber")
      .sort({ year: -1, month: -1 });

    return bills;
  }

  /**
   * Get student's all bills
   */
  async getStudentBills(studentId) {
    const bills = await Bill.find({ student: studentId })
      .populate("student", "name email rollNumber")
      .sort({ year: -1, month: -1 });

    return bills;
  }

  /**
   * Update bill status
   */
  async updateBillStatus(billId, status, paymentMethod = null, transactionId = null) {
    const bill = await Bill.findById(billId);

    if (!bill) {
      throw new ApiError(404, "Bill not found");
    }

    bill.status = status;
    if (status === "paid") {
      bill.paidAt = new Date();
      if (paymentMethod) bill.paymentMethod = paymentMethod;
      if (transactionId) bill.transactionId = transactionId;
    }

    await bill.save();
    return bill;
  }

  /**
   * Get billing statistics for a month
   */
  async getBillingStatistics(year, month) {
    const bills = await Bill.find({ year, month });

    if (bills.length === 0) {
      return {
        totalBills: 0,
        totalRevenue: 0,
        paidBills: 0,
        pendingBills: 0,
        averageBill: 0,
      };
    }

    const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const paidBills = bills.filter((bill) => bill.status === "paid").length;
    const pendingBills = bills.filter((bill) => bill.status === "pending").length;

    return {
      totalBills: bills.length,
      totalRevenue,
      paidBills,
      pendingBills,
      averageBill: totalRevenue / bills.length,
    };
  }
}

module.exports = new BillingService();
