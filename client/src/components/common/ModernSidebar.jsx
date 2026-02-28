import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
  Chip,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  Restaurant,
  Receipt,
  Report,
  ChatBubble,
  Notifications,
  AccountCircle,
  ExpandLess,
  ExpandMore,
  CalendarToday,
  CheckCircle,
  People,
  Analytics,
  Settings,
  Inventory,
  Feedback,
  Assessment,
  Home,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 280;

const ModernSidebar = ({ open, onClose, isMobile }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const handleMenuClick = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isActive = (path) => location.pathname === path;

  const studentMenuItems = [
    { text: "Home", icon: <Home />, path: "/home" },
    { text: "Dashboard", icon: <Dashboard />, path: "/student/dashboard" },
    {
      text: "Meals",
      icon: <Restaurant />,
      key: "meals",
      submenu: [
        { text: "View Menu", icon: <Restaurant />, path: "/student/menu" },
        {
          text: "My Selection",
          icon: <CheckCircle />,
          path: "/student/meal-confirm",
        },
        {
          text: "Attendance",
          icon: <CalendarToday />,
          path: "/student/attendance",
        },
      ],
    },
    { text: "Billing", icon: <Receipt />, path: "/student/bill" },
    { text: "Complaints", icon: <Report />, path: "/student/complaints" },
    { text: "Chat", icon: <ChatBubble />, path: "/student/chat" },
    { text: "Notices", icon: <Notifications />, path: "/student/notices" },
    { text: "Feedback", icon: <Feedback />, path: "/student/feedback" },
    { text: "Profile", icon: <AccountCircle />, path: "/student/profile" },
  ];

  const managerMenuItems = [
    { text: "Home", icon: <Home />, path: "/home" },
    { text: "Dashboard", icon: <Dashboard />, path: "/manager/dashboard" },
    { text: "Menu Management", icon: <Restaurant />, path: "/manager/menu" },
    {
      text: "Mark Attendance",
      icon: <CheckCircle />,
      path: "/manager/attendance",
    },
    {
      text: "Attendance Report",
      icon: <Assessment />,
      path: "/manager/attendance-report",
    },
    { text: "Inventory", icon: <Inventory />, path: "/manager/inventory" },
    { text: "Feedback", icon: <Feedback />, path: "/manager/feedback" },
    { text: "Chat", icon: <ChatBubble />, path: "/manager/chat" },
    { text: "Reports", icon: <Analytics />, path: "/manager/reports" },
  ];

  const adminMenuItems = [
    { text: "Home", icon: <Home />, path: "/home" },
    { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
    { text: "User Management", icon: <People />, path: "/admin/users" },
    { text: "Complaints", icon: <Report />, path: "/admin/complaints" },
    { text: "Notices", icon: <Notifications />, path: "/admin/notices" },
    { text: "Billing", icon: <Receipt />, path: "/admin/billing" },
    { text: "Chat", icon: <ChatBubble />, path: "/admin/chat" },
    { text: "Analytics", icon: <Analytics />, path: "/admin/analytics" },
    { text: "Settings", icon: <Settings />, path: "/admin/settings" },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case "student":
        return studentMenuItems;
      case "manager":
        return managerMenuItems;
      case "admin":
        return adminMenuItems;
      default:
        return studentMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const renderMenuItem = (item, index) => {
    if (item.submenu) {
      return (
        <Box key={item.key}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleMenuClick(item.key)}
              sx={{
                borderRadius: 3,
                mx: 1,
                mb: 0.5,
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {openMenus[item.key] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openMenus[item.key]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.submenu.map((subItem, subIndex) => (
                <ListItem key={subIndex} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(subItem.path)}
                    sx={{
                      borderRadius: 3,
                      mx: 1,
                      mb: 0.5,
                      pl: 4,
                      color: "white",
                      backgroundColor: isActive(subItem.path)
                        ? "rgba(255, 255, 255, 0.2)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText primary={subItem.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 3,
              mx: 1,
              mb: 0.5,
              color: "white",
              backgroundColor: isActive(item.path)
                ? "rgba(255, 255, 255, 0.2)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {item.icon}
              </motion.div>
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      </motion.div>
    );
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* User Profile Section */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          mt: 8,
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Avatar
            alt={user?.name}
            src={user?.profileImage}
            sx={{
              width: 80,
              height: 80,
              border: "3px solid white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </motion.div>
        <Box textAlign="center">
          <Typography variant="h6" fontWeight={600}>
            {user?.name}
          </Typography>
          <Chip
            label={user?.role?.toUpperCase()}
            size="small"
            sx={{
              mt: 0.5,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)", my: 2 }} />

      {/* Menu Items */}
      <List sx={{ flex: 1, overflowY: "auto", px: 1 }}>
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          © 2024 Hostel Management
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          border: "none",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default ModernSidebar;
