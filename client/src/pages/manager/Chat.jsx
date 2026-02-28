import { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Send, ChatBubble, Circle } from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { messageService } from "../../services/message.service";

const Chat = () => {
  const { user } = useAuth();
  const { socket, online } = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch available users
  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  // Load conversation when user is selected
  useEffect(() => {
    if (selectedUser) {
      loadConversation(selectedUser._id);
    }
  }, [selectedUser]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", (data) => {
      if (selectedUser && data.sender._id === selectedUser._id) {
        setMessages((prev) => [
          ...prev,
          {
            _id: data._id,
            sender: data.sender,
            message: data.message,
            createdAt: data.createdAt,
            isOwn: false,
          },
        ]);
        scrollToBottom();
        // Mark as read
        messageService.markAsRead(selectedUser._id);
      }
    });

    socket.on("message-sent", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: data._id,
          sender: user,
          message: data.message,
          createdAt: data.createdAt,
          isOwn: true,
        },
      ]);
      scrollToBottom();
    });

    socket.on("user-typing", (data) => {
      if (selectedUser && data.userId === selectedUser._id) {
        setTyping(true);
      }
    });

    socket.on("user-stop-typing", (data) => {
      if (selectedUser && data.userId === selectedUser._id) {
        setTyping(false);
      }
    });

    return () => {
      socket.off("receive-message");
      socket.off("message-sent");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [socket, selectedUser, user]);

  const fetchAvailableUsers = async () => {
    try {
      const response = await messageService.getAvailableUsers();
      setAvailableUsers(response.data.users || []);
      if (response.data.users && response.data.users.length > 0) {
        setSelectedUser(response.data.users[0]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const loadConversation = async (userId) => {
    try {
      setLoading(true);
      const response = await messageService.getConversation(userId);
      const msgs = (response.data.messages || []).map((msg) => ({
        ...msg,
        isOwn: msg.sender._id === user._id,
      }));
      setMessages(msgs);
      scrollToBottom();
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (message.trim() && socket && selectedUser) {
      socket.emit("send-message", {
        receiverId: selectedUser._id,
        message: message.trim(),
      });
      setMessage("");
      handleStopTyping();
    }
  };

  const handleTyping = () => {
    if (socket && selectedUser) {
      socket.emit("typing", { receiverId: selectedUser._id });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        handleStopTyping();
      }, 3000);
    }
  };

  const handleStopTyping = () => {
    if (socket && selectedUser) {
      socket.emit("stop-typing", { receiverId: selectedUser._id });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <ModernLayout>
      <Box>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            sx={{
              mb: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ChatBubble sx={{ fontSize: 40 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={700}>
                    Chat 💬
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Communicate with students
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Circle
                    sx={{
                      fontSize: 12,
                      color: online ? "#4ade80" : "#ef4444",
                    }}
                  />
                  <Typography variant="body2">
                    {online ? "Online" : "Offline"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Box sx={{ display: "flex", gap: 2, height: "calc(100vh - 300px)" }}>
            {/* Users List */}
            <Card sx={{ width: 300, overflowY: "auto" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Students
                </Typography>
                <List>
                  {availableUsers.map((availUser) => (
                    <ListItem
                      key={availUser._id}
                      onClick={() => setSelectedUser(availUser)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        cursor: "pointer",
                        bgcolor:
                          selectedUser?._id === availUser._id
                            ? "primary.light"
                            : "transparent",
                        "&:hover": {
                          bgcolor:
                            selectedUser?._id === availUser._id
                              ? "primary.light"
                              : "action.hover",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>{availUser.name.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={availUser.name}
                        secondary={availUser.role}
                        secondaryTypographyProps={{
                          sx: { textTransform: "capitalize" },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar>{selectedUser.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {selectedUser.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {selectedUser.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Messages */}
                  <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
                    {loading ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : (
                      <List>
                        {messages.map((msg, index) => (
                          <motion.div
                            key={msg._id || index}
                            initial={{ opacity: 0, x: msg.isOwn ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <ListItem
                              sx={{
                                flexDirection: msg.isOwn
                                  ? "row-reverse"
                                  : "row",
                                alignItems: "flex-start",
                                mb: 2,
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    bgcolor: msg.isOwn
                                      ? "primary.main"
                                      : "secondary.main",
                                    ml: msg.isOwn ? 1 : 0,
                                    mr: msg.isOwn ? 0 : 1,
                                  }}
                                >
                                  {msg.sender.name.charAt(0)}
                                </Avatar>
                              </ListItemAvatar>
                              <Paper
                                elevation={1}
                                sx={{
                                  p: 2,
                                  maxWidth: "70%",
                                  bgcolor: msg.isOwn
                                    ? "primary.light"
                                    : "grey.100",
                                  color: msg.isOwn ? "white" : "text.primary",
                                }}
                              >
                                <Typography variant="body1">
                                  {msg.message}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "block",
                                    mt: 0.5,
                                    opacity: 0.7,
                                  }}
                                >
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </Typography>
                              </Paper>
                            </ListItem>
                          </motion.div>
                        ))}
                        {typing && (
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: "secondary.main" }}>
                                {selectedUser.name.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <Paper
                              elevation={1}
                              sx={{ p: 2, bgcolor: "grey.100" }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                typing...
                              </Typography>
                            </Paper>
                          </ListItem>
                        )}
                        <div ref={messagesEndRef} />
                      </List>
                    )}
                  </Box>

                  <Divider />

                  {/* Message Input */}
                  <Box sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={3}
                      placeholder={
                        online
                          ? "Type your message..."
                          : "Connecting to chat..."
                      }
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (online) handleTyping();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (online) handleSend();
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              color="primary"
                              onClick={handleSend}
                              disabled={!message.trim() || !online}
                            >
                              <Send />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {!online && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        Waiting for connection... Make sure the server is
                        running.
                      </Typography>
                    )}
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Select a student to start chatting
                  </Typography>
                </Box>
              )}
            </Card>
          </Box>
        </motion.div>
      </Box>
    </ModernLayout>
  );
};

export default Chat;
