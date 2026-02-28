import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  Restaurant,
  Notifications,
  Assessment,
  Security,
  CheckCircle,
  Speed,
  People,
  TrendingUp,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import AppShell from "../../components/layout/AppShell";

const HomePublic = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <Restaurant />,
      title: "Smart Menu Management",
      description:
        "Digital menu planning with real-time updates and meal preferences",
      color: "#667eea",
    },
    {
      icon: <CheckCircle />,
      title: "Attendance Tracking",
      description:
        "Automated attendance system for accurate billing and analytics",
      color: "#10b981",
    },
    {
      icon: <Assessment />,
      title: "Analytics Dashboard",
      description:
        "Comprehensive insights and reports for better decision making",
      color: "#f59e0b",
    },
    {
      icon: <Notifications />,
      title: "Real-time Notifications",
      description:
        "Instant updates for notices, complaints, and important announcements",
      color: "#3b82f6",
    },
    {
      icon: <Security />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with role-based access control",
      color: "#ef4444",
    },
    {
      icon: <Speed />,
      title: "Fast & Efficient",
      description: "Lightning-fast performance with modern technology stack",
      color: "#8b5cf6",
    },
  ];

  const stats = [
    { icon: <People />, value: "500+", label: "Active Users" },
    { icon: <Restaurant />, value: "1000+", label: "Meals Served" },
    { icon: <TrendingUp />, value: "98%", label: "Satisfaction" },
    { icon: <CheckCircle />, value: "24/7", label: "Support" },
  ];

  return (
    <AppShell>
      <Box sx={{ minHeight: "calc(100vh - 64px)" }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: { xs: 8, md: 12 },
            px: 3,
            borderRadius: 4,
            mb: 6,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated Background Shapes */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              animation: "float 6s ease-in-out infinite",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -100,
              left: -100,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              animation: "float 8s ease-in-out infinite",
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    gutterBottom
                    sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" } }}
                  >
                    Smart Hostel Management
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ mb: 4, opacity: 0.95, fontWeight: 400 }}
                  >
                    Streamline your hostel operations with our all-in-one
                    management platform
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate("/register")}
                      sx={{
                        bgcolor: "white",
                        color: "#667eea",
                        px: 4,
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "#f0f0f0",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s",
                      }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/login")}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        px: 4,
                        py: 1.5,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "white",
                          bgcolor: "rgba(255,255,255,0.1)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s",
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 400,
                        height: 300,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(10px)",
                        border: "2px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <Typography variant="h1" sx={{ fontSize: "6rem" }}>
                        🏠
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      textAlign: "center",
                      py: 3,
                      background: "white",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      borderRadius: 3,
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#667eea",
                        width: 60,
                        height: 60,
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h4" fontWeight={700} color="#667eea">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Features Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              fontWeight={700}
              textAlign="center"
              gutterBottom
              sx={{ mb: 2 }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Everything you need to manage your hostel efficiently
            </Typography>

            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        p: 3,
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: feature.color,
                          width: 56,
                          height: 56,
                          mb: 2,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* CTA Section */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: 6,
              borderRadius: 4,
              textAlign: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join hundreds of hostels already using our platform
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                bgcolor: "white",
                color: "#667eea",
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#f0f0f0",
                },
              }}
            >
              Create Account
            </Button>
          </Box>

          {/* Footer */}
          <Box
            sx={{ py: 4, textAlign: "center", borderTop: "1px solid #e0e0e0" }}
          >
            <Typography variant="body2" color="text.secondary">
              © 2026 Smart Hostel Management. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </AppShell>
  );
};

export default HomePublic;
