const asyncHandler = require("express-async-handler");
const Attendance = require("../models/Attendance.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Mark attendance
// @route   POST /api/v1/attendance/mark
// @access  Private (Manager)
const markAttendance = asyncHandler(async (req, res) => {
  const { studentId, date, mealType, present } = req.body;

  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    throw new ApiError(404, "Student not found");
  }

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  // Check if attendance already exists
  let attendance = await Attendance.findOne({
    student: studentId,
    date: attendanceDate,
    mealType,
  });

  if (attendance) {
    attendance.present = present;
    attendance.markedBy = req.user._id;
    await attendance.save();
  } else {
    attendance = await Attendance.create({
      student: studentId,
      date: attendanceDate,
      mealType,
      present,
      markedBy: req.user._id,
    });
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, { attendance }, "Attendance marked successfully"),
    );
});

// @desc    Get attendance report
// @route   GET /api/v1/attendance/report?date=YYYY-MM-DD&mealType=breakfast
// @access  Private (Manager/Admin)
const getAttendanceReport = asyncHandler(async (req, res) => {
  const { date, mealType } = req.query;

  let query = {};

  if (date) {
    const reportDate = new Date(date);
    reportDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    query.date = { $gte: reportDate, $lte: endDate };
  }

  if (mealType) {
    query.mealType = mealType;
  }

  const attendance = await Attendance.find(query)
    .populate("student", "name email rollNumber roomNumber")
    .populate("markedBy", "name email")
    .sort("-date");

  const summary = {
    total: attendance.length,
    present: attendance.filter((a) => a.present).length,
    absent: attendance.filter((a) => !a.present).length,
  };

  res.json(new ApiResponse(200, { attendance, summary }));
});

// @desc    Get my attendance
// @route   GET /api/v1/attendance/me?month=MM&year=YYYY
// @access  Private (Student)
const getMyAttendance = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  let query = { student: req.user._id };

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    query.date = { $gte: startDate, $lte: endDate };
  }

  const attendance = await Attendance.find(query).sort("-date");

  const summary = {
    total: attendance.length,
    present: attendance.filter((a) => a.present).length,
    absent: attendance.filter((a) => !a.present).length,
  };

  res.json(new ApiResponse(200, { attendance, summary }));
});

module.exports = {
  markAttendance,
  getAttendanceReport,
  getMyAttendance,
};
