const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Message = require("../models/Message.model");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user.role})`);

    // Join user's personal room
    socket.join(socket.user._id.toString());

    // Join role-based room
    socket.join(socket.user.role);

    // Send user info
    socket.emit("user-connected", {
      userId: socket.user._id,
      name: socket.user.name,
      role: socket.user.role,
    });

    // Handle sending messages
    socket.on("send-message", async (data) => {
      try {
        const { receiverId, message } = data;

        // Save message to database
        const newMessage = await Message.create({
          sender: socket.user._id,
          receiver: receiverId,
          message,
        });

        // Populate sender info
        await newMessage.populate("sender", "name role");

        // Send to receiver
        io.to(receiverId).emit("receive-message", {
          _id: newMessage._id,
          sender: {
            _id: newMessage.sender._id,
            name: newMessage.sender.name,
            role: newMessage.sender.role,
          },
          message: newMessage.message,
          createdAt: newMessage.createdAt,
        });

        // Send confirmation to sender
        socket.emit("message-sent", {
          _id: newMessage._id,
          receiver: receiverId,
          message: newMessage.message,
          createdAt: newMessage.createdAt,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message-error", { error: "Failed to send message" });
      }
    });

    // Handle typing indicator
    socket.on("typing", (data) => {
      io.to(data.receiverId).emit("user-typing", {
        userId: socket.user._id,
        name: socket.user.name,
      });
    });

    socket.on("stop-typing", (data) => {
      io.to(data.receiverId).emit("user-stop-typing", {
        userId: socket.user._id,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
