import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  Restaurant,
  CheckCircle,
  History,
  Receipt,
  Report,
  Notifications,
  Feedback,
  Chat,
  Person,
  People,
  Settings,
  Analytics,
  Inventory,
  Assignment,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const DrawerSidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "student":
        return [
          {
            text: "Dashboard",
            icon: <Dashboard />,
            path: "/student/dashboard",
          },
          { text: "Menu", icon: <Restaurant />, path: "/student/menu" },
          {
            text: "Confirm Meal",
            icon: <CheckCircle />,
            path: "/student/meal-confirm",
          },
          {
            text: "Attendance",
            icon: <History />,
            path: "/student/attendance",
          },
          { text: "My Bill", icon: <Receipt />, path: "/student/bill" },
          { text: "Complaints", icon: <Report />, path: "/student/complaints" },
          {
            text: "Notices",
            icon: <Notifications />,
            path: "/student/notices",
          },
          { text: "Feedback", icon: <Feedback />, path: "/student/feedback" },
          { text: "Chat", icon: <Chat />, path: "/student/chat" },
          { text: "Profile", icon: <Person />, path: "/student/profile" },
        ];

      case "manager":
        return [
          {
            text: "Dashboard",
            icon: <Dashboard />,
            path: "/manager/dashboard",
          },
          { text: "Menu", icon: <Restaurant />, path: "/manager/menu" },
          {
            text: "Mark Attendance",
            icon: <CheckCircle />,
            path: "/manager/attendance",
          },
          {
            text: "Attendance Report",
            icon: <History />,
            path: "/manager/attendance-report",
          },
          {
            text: "Inventory",
            icon: <Inventory />,
            path: "/manager/inventory",
          },
          { text: "Feedback", icon: <Feedback />, path: "/manager/feedback" },
          { text: "Reports", icon: <Assignment />, path: "/manager/reports" },
          { text: "Chat", icon: <Chat />, path: "/manager/chat" },
        ];

      case "admin":
        return [
          { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
          { text: "Users", icon: <People />, path: "/admin/users" },
          { text: "Complaints", icon: <Report />, path: "/admin/complaints" },
          { text: "Notices", icon: <Notifications />, path: "/admin/notices" },
          { text: "Billing", icon: <Receipt />, path: "/admin/billing" },
          { text: "Analytics", icon: <Analytics />, path: "/admin/analytics" },
          { text: "Chat", icon: <Chat />, path: "/admin/chat" },
          { text: "Settings", icon: <Settings />, path: "/admin/settings" },
        ];

      default:
        return [];
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const menuItems = getMenuItems();

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Navigation
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          {user?.role?.toUpperCase()} PANEL
        </Typography>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, py: 2 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ListItem disablePadding sx={{ px: 2, mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive
                      ? "rgba(102, 126, 234, 0.1)"
                      : "transparent",
                    color: isActive ? "#667eea" : "text.primary",
                    "&:hover": {
                      bgcolor: isActive
                        ? "rgba(102, 126, 234, 0.15)"
                        : "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#667eea" : "text.secondary",
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
        >
          Smart Hostel Management
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
        >
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={isMobile ? "temporary" : "temporary"}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: isMobile ? "100%" : 280,
          boxSizing: "border-box",
          border: "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default DrawerSidebar;
