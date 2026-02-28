const Attendance = require("../models/Attendance.model");
const Bill = require("../models/Bill.model");
const Feedback = require("../models/Feedback.model");
const Complaint = require("../models/Complaint.model");
const User = require("../models/User.model");
const Menu = require("../models/Menu.model");

class AnalyticsService {
  /**
   * Get overview analytics
   */
  static async getOverview(month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [
      totalStudents,
      totalAttendance,
      totalRevenue,
      avgRating,
      activeComplaints,
      menusCreated,
    ] = await Promise.all([
      User.countDocuments({ role: "student", isActive: true }),
      Attendance.countDocuments({
        date: { $gte: startDate, $lte: endDate },
        present: true,
      }),
      Bill.aggregate([
        {
          $match: {
            month: parseInt(month),
            year: parseInt(year),
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      Feedback.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
          },
        },
      ]),
      Complaint.countDocuments({
        status: { $in: ["pending", "in-progress"] },
      }),
      Menu.countDocuments({
        date: { $gte: startDate, $lte: endDate },
      }),
    ]);

    return {
      totalStudents,
      totalAttendance,
      totalRevenue: totalRevenue[0]?.total || 0,
      avgRating: avgRating[0]?.avgRating || 0,
      activeComplaints,
      menusCreated,
    };
  }

  /**
   * Get attendance trends
   */
  static async getAttendanceTrends(month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const trends = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            mealType: "$mealType",
          },
          present: {
            $sum: { $cond: ["$present", 1, 0] },
          },
          absent: {
            $sum: { $cond: ["$present", 0, 1] },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ]);

    return trends;
  }

  /**
   * Get revenue trends
   */
  static async getRevenueTrends(year) {
    const trends = await Bill.aggregate([
      {
        $match: {
          year: parseInt(year),
        },
      },
      {
        $group: {
          _id: "$month",
          revenue: { $sum: "$totalAmount" },
          billCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return trends;
  }

  /**
   * Get feedback analytics
   */
  static async getFeedbackAnalytics(month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [ratingDistribution, mealTypeRatings, trends] = await Promise.all([
      // Rating distribution
      Feedback.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]),

      // Average rating by meal type
      Feedback.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$mealType",
            avgRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]),

      // Daily trends
      Feedback.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            avgRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),
    ]);

    return {
      ratingDistribution,
      mealTypeRatings,
      trends,
    };
  }

  /**
   * Get complaint analytics
   */
  static async getComplaintAnalytics(month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const [statusDistribution, categoryDistribution, resolutionTime] =
      await Promise.all([
        // Status distribution
        Complaint.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]),

        // Category distribution
        Complaint.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
        ]),

        // Average resolution time
        Complaint.aggregate([
          {
            $match: {
              status: "resolved",
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $project: {
              resolutionTime: {
                $divide: [
                  { $subtract: ["$updatedAt", "$createdAt"] },
                  1000 * 60 * 60 * 24, // Convert to days
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              avgResolutionTime: { $avg: "$resolutionTime" },
            },
          },
        ]),
      ]);

    return {
      statusDistribution,
      categoryDistribution,
      avgResolutionTime: resolutionTime[0]?.avgResolutionTime || 0,
    };
  }

  /**
   * Get meal popularity
   */
  static async getMealPopularity(month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const popularity = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          present: true,
        },
      },
      {
        $group: {
          _id: "$mealType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return popularity;
  }
}

module.exports = AnalyticsService;
