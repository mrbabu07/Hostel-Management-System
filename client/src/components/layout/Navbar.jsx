import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications,
  Logout,
  Person,
  Home,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const Navbar = ({ onDrawerToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  const handleProfile = () => {
    if (user?.role === "student") navigate("/student/profile");
    else if (user?.role === "manager") navigate("/manager/dashboard");
    else if (user?.role === "admin") navigate("/admin/dashboard");
    handleClose();
  };

  const handleHome = () => {
    navigate("/home");
    handleClose();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "#ef4444";
      case "manager":
        return "#f59e0b";
      case "student":
        return "#667eea";
      default:
        return "#6b7280";
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* Menu Icon - Opens Drawer */}
        {user && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: "flex", alignItems: "center", flexGrow: 1 }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            onClick={() => navigate(user ? "/home" : "/")}
          >
            🏠 Smart Hostel
          </Typography>
        </motion.div>

        {/* Right Side Icons */}
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Home Icon */}
            <Tooltip title="Home">
              <IconButton color="inherit" onClick={handleHome}>
                <Home />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Avatar */}
            <Tooltip title="Profile">
              <IconButton onClick={handleProfileClick} sx={{ p: 0, ml: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: getRoleColor(user?.role),
                    width: 40,
                    height: 40,
                    border: "2px solid white",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(user?.name)}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: getRoleColor(user?.role),
                      color: "white",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      textTransform: "capitalize",
                      fontWeight: 600,
                    }}
                  >
                    {user?.role}
                  </Typography>
                </Box>
              </Box>

              <MenuItem onClick={handleHome}>
                <Home sx={{ mr: 1, fontSize: 20 }} />
                Home
              </MenuItem>

              <MenuItem onClick={handleProfile}>
                <Person sx={{ mr: 1, fontSize: 20 }} />
                Profile
              </MenuItem>

              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                <Logout sx={{ mr: 1, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid white",
                color: "white",
                padding: "8px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              style={{
                background: "white",
                border: "none",
                color: "#667eea",
                padding: "8px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Register
            </motion.button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
