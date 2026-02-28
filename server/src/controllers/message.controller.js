const asyncHandler = require("express-async-handler");
const Message = require("../models/Message.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Get conversation with a user
// @route   GET /api/v1/messages/:userId
// @access  Private
const getConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId },
    ],
  })
    .populate("sender", "name role")
    .populate("receiver", "name role")
    .sort("createdAt")
    .limit(100);

  // Mark messages as read
  await Message.updateMany(
    { sender: userId, receiver: currentUserId, read: false },
    { read: true, readAt: new Date() },
  );

  res.json(new ApiResponse(200, { messages }));
});

// @desc    Get all conversations (list of users you've chatted with)
// @route   GET /api/v1/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  // Get unique users the current user has chatted with
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: currentUserId }, { receiver: currentUserId }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$sender", currentUserId] }, "$receiver", "$sender"],
        },
        lastMessage: { $first: "$message" },
        lastMessageTime: { $first: "$createdAt" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiver", currentUserId] },
                  { $eq: ["$read", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  // Populate user details
  const conversations = await User.populate(messages, {
    path: "_id",
    select: "name email role",
  });

  res.json(new ApiResponse(200, { conversations }));
});

// @desc    Get available users to chat with
// @route   GET /api/v1/messages/users
// @access  Private
const getAvailableUsers = asyncHandler(async (req, res) => {
  const currentUser = req.user;
  let query = {};

  // Students can only chat with managers and admins
  if (currentUser.role === "student") {
    query.role = { $in: ["manager", "admin"] };
  }
  // Managers can chat with students and admins
  else if (currentUser.role === "manager") {
    query.role = { $in: ["student", "admin"] };
  }
  // Admins can chat with everyone
  else if (currentUser.role === "admin") {
    query._id = { $ne: currentUser._id };
  }

  const users = await User.find(query).select("name email role");

  res.json(new ApiResponse(200, { users }));
});

// @desc    Mark messages as read
// @route   PATCH /api/v1/messages/:userId/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  await Message.updateMany(
    { sender: userId, receiver: currentUserId, read: false },
    { read: true, readAt: new Date() },
  );

  res.json(new ApiResponse(200, {}, "Messages marked as read"));
});

module.exports = {
  getConversation,
  getConversations,
  getAvailableUsers,
  markAsRead,
};
