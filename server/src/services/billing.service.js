const mongoose = require("mongoose");
const Bill = require("../models/Bill.model");
const MealSelection = require("../models/MealSelection.model");
const User = require("../models/User.model");
const settingsService = require("./settings.service");
const ApiError = require("../utils/ApiError");

class BillingService {
  /**
   * Calculate meal costs based on individual meal prices
   */
  calculateMealCosts(mealCounts, breakfastPrice, lunchPrice, dinnerPrice) {
    const breakfastTotal = Math.round(mealCounts.breakfastCount * breakfastPrice);
    const lunchTotal = Math.round(mealCounts.lunchCount * lunchPrice);
    const dinnerTotal = Math.round(mealCounts.dinnerCount * dinnerPrice);
    const totalMealCost = breakfastTotal + lunchTotal + dinnerTotal;

    return {
      breakfastTotal,
      lunchTotal,
      dinnerTotal,
      totalMealCost,
      breakfastPrice,
      lunchPrice,
      dinnerPrice,
    };
  }

  /**
   * Fix all bills by recalculating totalMeals from breakdown
   */
  async fixAllBills() {
    try {
      const bills = await Bill.find({});
      let fixedCount = 0;

      for (const bill of bills) {
        if (bill.breakdown) {
          const totalMeals = 
            (bill.breakdown.breakfast?.count || 0) +
            (bill.breakdown.lunch?.count || 0) +
            (bill.breakdown.dinner?.count || 0);

          if (bill.totalMeals !== totalMeals) {
            bill.totalMeals = totalMeals;
            await bill.save();
            fixedCount++;
          }
        }
      }

      console.log(`Fixed ${fixedCount} bills with correct totalMeals`);
      return { fixedCount, message: `Fixed ${fixedCount} bills` };
    } catch (error) {
      console.error("Error fixing bills:", error);
      throw error;
    }
  }

  /**
   * Delete all bills for a specific month
   */
  async deleteBillsForMonth(year, month) {
    try {
      const result = await Bill.deleteMany({ year, month });
      console.log(`Deleted ${result.deletedCount} bills for ${month}/${year}`);
      return result;
    } catch (error) {
      console.error("Error deleting bills for month:", error);
      throw error;
    }
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
      const breakfastPrice = settings?.breakfastPrice || 30;
      const lunchPrice = settings?.lunchPrice || 50;
      const dinnerPrice = settings?.dinnerPrice || 40;

      // Get meal counts for the student
      const mealCounts = await this.getMealCountsForMonth(studentId, year, month);

      // Calculate meal costs using individual prices
      const mealCosts = this.calculateMealCosts(
        mealCounts,
        breakfastPrice,
        lunchPrice,
        dinnerPrice
      );

      // Calculate total bill
      const totalAmount = fixedCost + mealCosts.totalMealCost;

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
              rate: breakfastPrice,
              total: mealCosts.breakfastTotal,
            },
            lunch: {
              count: mealCounts.lunchCount,
              rate: lunchPrice,
              total: mealCosts.lunchTotal,
            },
            dinner: {
              count: mealCounts.dinnerCount,
              rate: dinnerPrice,
              total: mealCosts.dinnerTotal,
            },
          },
          totalAmount,
          fixedCost,
          mealCost: mealCosts.totalMealCost,
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
   * Regenerate bills for all students for a specific month (when settings change)
   */
  async regenerateBillsForMonth(year, month, generatedBy) {
    try {
      // Get all students
      const students = await User.find({ role: "student" }).select("_id");

      if (students.length === 0) {
        return { bills: [], count: 0, message: "No students found" };
      }

      console.log(`Regenerating bills for ${students.length} students for ${month}/${year}`);

      const bills = [];
      const errors = [];

      // Regenerate bill for each student
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
        console.warn(`Errors regenerating bills for ${errors.length} students:`, errors);
      }

      return {
        bills,
        count: bills.length,
        errors: errors.length > 0 ? errors : null,
        message: `Successfully regenerated ${bills.length} bills${errors.length > 0 ? ` (${errors.length} errors)` : ""}`,
      };
    } catch (error) {
      console.error("Error regenerating bills for month:", error);
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
    if (status === "PAID") {
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
    const paidBills = bills.filter((bill) => bill.status === "PAID").length;
    const pendingBills = bills.filter((bill) => bill.status === "DUE").length;

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
