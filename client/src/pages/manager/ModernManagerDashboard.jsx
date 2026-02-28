import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Restaurant,
  People,
  Inventory,
  TrendingUp,
  Warning,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ModernLayout from "../../components/layout/ModernLayout";
import StatsCard from "../../components/common/StatsCard";
import ModernLineChart from "../../components/charts/ModernLineChart";
import ModernBarChart from "../../components/charts/ModernBarChart";

const ModernManagerDashboard = () => {
  const { user } = useAuth();

  const stats = {
    totalStudents: 250,
    todayAttendance: 235,
    lowStockItems: 5,
    avgRating: 4.2,
  };

  // Attendance trend data (last 7 days)
  const attendanceData = [220, 225, 218, 230, 228, 235, 235];
  const attendanceLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Meal consumption data
  const mealData = [180, 220, 200];
  const mealLabels = ["Breakfast", "Lunch", "Dinner"];

  const lowStockItems = [
    { name: "Rice", quantity: "5 kg", status: "critical" },
    { name: "Dal", quantity: "8 kg", status: "low" },
    { name: "Oil", quantity: "3 L", status: "critical" },
    { name: "Sugar", quantity: "10 kg", status: "low" },
    { name: "Tea Powder", quantity: "2 kg", status: "critical" },
  ];

  const recentFeedback = [
    {
      student: "John Doe",
      rating: 5,
      comment: "Excellent food quality!",
      time: "2h ago",
    },
    {
      student: "Jane Smith",
      rating: 4,
      comment: "Good taste, needs more variety",
      time: "5h ago",
    },
    {
      student: "Mike Johnson",
      rating: 3,
      comment: "Average, could be better",
      time: "1d ago",
    },
  ];

  return (
    <ModernLayout>
      <Box>
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-purple-500/30">
            <h1 className="text-4xl font-bold mb-2">Manager Dashboard 👨‍🍳</h1>
            <p className="text-purple-100">
              Welcome back, {user?.name}! Here's your mess overview for today.
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Students"
              value={stats.totalStudents}
              icon={People}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Today's Attendance"
              value={stats.todayAttendance}
              icon={CheckCircle}
              color="success"
              trend="up"
              trendValue="+3%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Low Stock Items"
              value={stats.lowStockItems}
              icon={Warning}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Avg Rating"
              value={stats.avgRating}
              icon={TrendingUp}
              color="warning"
              decimals={1}
              suffix="/5"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Attendance Trend Chart */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ModernLineChart
                title="Attendance Trend (Last 7 Days)"
                data={attendanceData}
                labels={attendanceLabels}
                label="Students Present"
              />
            </motion.div>

            {/* Meal Consumption Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Box sx={{ mt: 3 }}>
                <ModernBarChart
                  title="Today's Meal Consumption"
                  data={mealData}
                  labels={mealLabels}
                  label="Students"
                />
              </Box>
            </motion.div>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Low Stock Alert */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Low Stock Alert
                    </Typography>
                    <Chip
                      label={stats.lowStockItems}
                      color="error"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <List>
                    {lowStockItems.map((item, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          backgroundColor:
                            item.status === "critical"
                              ? "rgba(239, 68, 68, 0.1)"
                              : "rgba(245, 158, 11, 0.1)",
                        }}
                      >
                        <ListItemText
                          primary={item.name}
                          secondary={item.quantity}
                        />
                        <Chip
                          label={item.status}
                          size="small"
                          color={
                            item.status === "critical" ? "error" : "warning"
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Button fullWidth variant="contained" sx={{ mt: 2 }}>
                    Manage Inventory
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Feedback */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Recent Feedback
                  </Typography>
                  <List>
                    {recentFeedback.map((feedback, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          flexDirection: "column",
                          alignItems: "flex-start",
                          borderRadius: 2,
                          mb: 1,
                          backgroundColor: "action.hover",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            {feedback.student}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            {[...Array(5)].map((_, i) => (
                              <Typography
                                key={i}
                                sx={{
                                  color:
                                    i < feedback.rating ? "#F59E0B" : "#E5E7EB",
                                  fontSize: "1rem",
                                }}
                              >
                                ★
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {feedback.comment}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {feedback.time}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                  <Button fullWidth variant="text" sx={{ mt: 1 }}>
                    View All Feedback
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </ModernLayout>
  );
};

export default ModernManagerDashboard;
