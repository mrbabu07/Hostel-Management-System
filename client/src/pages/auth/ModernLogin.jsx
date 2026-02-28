import { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ModernLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🚀 Login form submitted");

    try {
      console.log("📧 Logging in with:", formData.email);
      const response = await login(formData.email, formData.password);
      console.log("✅ Login response received:", response);

      // Response is already unwrapped, check both possible structures
      const userData = response.data?.user || response.user;
      const role = userData?.role;

      console.log("👤 User data:", userData);
      console.log("🎭 Role:", role);

      if (!role) {
        throw new Error("Invalid response from server");
      }

      toast.success(`Welcome back, ${userData.name}!`, {
        duration: 3000,
        icon: "👋",
      });

      console.log("🧭 Navigating to dashboard for role:", role);
      setTimeout(() => {
        if (role === "student") navigate("/student/dashboard");
        else if (role === "manager") navigate("/manager/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
      }, 500);
    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMessage =
        err.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const floatingShapes = [
    { size: 200, top: "10%", left: "10%", delay: 0 },
    { size: 150, top: "70%", right: "15%", delay: 2 },
    { size: 100, bottom: "15%", left: "20%", delay: 4 },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
        p: 2,
      }}
    >
      {/* Animated Background Shapes */}
      {floatingShapes.map((shape, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: shape.size,
            height: shape.size,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            ...shape,
          }}
        />
      ))}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            p: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 6,
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="h3"
                sx={{
                  background:
                    "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 800,
                  mb: 1,
                }}
              >
                H
              </Typography>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue to your dashboard
              </Typography>
            </Box>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link
                href="#"
                underline="hover"
                sx={{ color: "primary.main", fontWeight: 500 }}
              >
                Forgot Password?
              </Link>
            </Box>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                  "&:hover": {
                    boxShadow: "0 12px 32px rgba(102, 126, 234, 0.5)",
                  },
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </motion.div>
          </form>

          {/* Register Link */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                href="/register"
                underline="hover"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>

          {/* Demo Credentials */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "rgba(102, 126, 234, 0.1)",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Admin:</strong> admin@hostel.com / Admin@123
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Manager:</strong> manager@hostel.com / Manager@123
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Student:</strong> student@hostel.com / Student@123
            </Typography>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ModernLogin;
