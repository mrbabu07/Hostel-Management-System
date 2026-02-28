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

// @desc    Export attendance as CSV
// @route   GET /api/v1/attendance/export
// @access  Manager/Admin
const exportAttendanceCSV = asyncHandler(async (req, res) => {
  const { date, mealType, month, year } = req.query;
  const CSVGenerator = require("../utils/csv");

  let query = {};

  if (date) {
    const targetDate = new Date(date);
    query.date = {
      $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
      $lte: new Date(targetDate.setHours(23, 59, 59, 999)),
    };
  } else if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    query.date = { $gte: startDate, $lte: endDate };
  }

  if (mealType) query.mealType = mealType;

  const attendance = await Attendance.find(query)
    .populate("userId", "name rollNumber roomNumber")
    .populate("markedBy", "name")
    .sort({ date: -1 })
    .lean();

  const csv = CSVGenerator.generateAttendanceCSV(attendance);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=attendance-${date || `${month}-${year}`}.csv`,
  );
  res.send(csv);
});

module.exports = {
  markAttendance,
  getAttendanceReport,
  getMyAttendance,
  exportAttendanceCSV,
};

// @desc    Student self-mark attendance
// @route   POST /api/v1/attendance/self-mark
// @access  Private (Student)
const markSelfAttendance = asyncHandler(async (req, res) => {
  const { date, mealType } = req.body;

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  // Check if already marked
  const existing = await Attendance.findOne({
    student: req.user._id,
    date: attendanceDate,
    mealType,
  });

  if (existing) {
    throw new ApiError(400, "Attendance already marked for this meal");
  }

  const attendance = await Attendance.create({
    student: req.user._id,
    date: attendanceDate,
    mealType,
    present: true,
    approved: false,
    markedBy: req.user._id,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      { attendance },
      "Attendance marked. Waiting for manager approval",
    ),
  );
});

// @desc    Approve attendance
// @route   PATCH /api/v1/attendance/:id/approve
// @access  Private (Manager/Admin)
const approveAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    throw new ApiError(404, "Attendance record not found");
  }

  attendance.approved = true;
  attendance.approvedBy = req.user._id;
  attendance.approvedAt = new Date();
  await attendance.save();

  res.json(
    new ApiResponse(200, { attendance }, "Attendance approved successfully"),
  );
});

// @desc    Get pending attendance for approval
// @route   GET /api/v1/attendance/pending
// @access  Private (Manager/Admin)
const getPendingAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.find({ approved: false })
    .populate("student", "name email rollNumber roomNumber")
    .sort("-date");

  res.json(new ApiResponse(200, { attendance, count: attendance.length }));
});

module.exports = {
  markAttendance,
  getAttendanceReport,
  getMyAttendance,
  exportAttendanceCSV,
  markSelfAttendance,
  approveAttendance,
  getPendingAttendance,
};
