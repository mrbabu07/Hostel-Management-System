const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, rollNumber, roomNumber, phone } =
    req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "student",
    rollNumber,
    roomNumber,
    phone,
  });

  const token = generateToken(user._id);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          rollNumber: user.rollNumber,
          roomNumber: user.roomNumber,
        },
        token,
      },
      "User registered successfully",
    ),
  );
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isActive) {
    throw new ApiError(401, "Account is deactivated");
  }

  const token = generateToken(user._id);

  res.json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          rollNumber: user.rollNumber,
          roomNumber: user.roomNumber,
        },
        token,
      },
      "Login successful",
    ),
  );
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json(
    new ApiResponse(200, {
      user: req.user,
    }),
  );
});

module.exports = {
  register,
  login,
  getMe,
};
