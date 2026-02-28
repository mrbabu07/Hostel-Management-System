const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { auditLog } = require("../services/audit.service");

// Get all users (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select("-password -refreshToken")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    await auditLog(req.user._id, "users.list", "User", null, {
      filters: { role, search },
    });

    res.json(
      new ApiResponse(200, {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await auditLog(req.user._id, "users.view", "User", user._id);

    res.json(new ApiResponse(200, { user }));
  } catch (error) {
    next(error);
  }
};

// Create new user (Admin only)
exports.createUser = async (req, res, next) => {
  try {
    const { email, rollNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { rollNumber }],
    });

    if (existingUser) {
      throw new ApiError(400, "User with this email or roll number already exists");
    }

    const user = await User.create(req.body);
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    await auditLog(req.user._id, "users.create", "User", user._id, {
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.status(201).json(
      new ApiResponse(201, { user: userResponse }, "User created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const { password, refreshToken, ...updateData } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if email or rollNumber is being changed and already exists
    if (updateData.email || updateData.rollNumber) {
      const existingUser = await User.findOne({
        _id: { $ne: req.params.id },
        $or: [
          { email: updateData.email },
          { rollNumber: updateData.rollNumber },
        ],
      });

      if (existingUser) {
        throw new ApiError(400, "Email or roll number already in use");
      }
    }

    Object.assign(user, updateData);
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    await auditLog(req.user._id, "users.update", "User", user._id, {
      changes: updateData,
    });

    res.json(
      new ApiResponse(200, { user: userResponse }, "User updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      throw new ApiError(400, "You cannot delete your own account");
    }

    await user.deleteOne();

    await auditLog(req.user._id, "users.delete", "User", user._id, {
      name: user.name,
      email: user.email,
    });

    res.json(new ApiResponse(200, null, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
};

// Toggle user status (active/inactive)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.isActive = !user.isActive;
    await user.save();

    await auditLog(req.user._id, "users.toggleStatus", "User", user._id, {
      isActive: user.isActive,
    });

    res.json(
      new ApiResponse(
        200,
        { user: { _id: user._id, isActive: user.isActive } },
        `User ${user.isActive ? "activated" : "deactivated"} successfully`
      )
    );
  } catch (error) {
    next(error);
  }
};

// Get user statistics
exports.getUserStats = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json(
      new ApiResponse(200, {
        stats,
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
      })
    );
  } catch (error) {
    next(error);
  }
};
