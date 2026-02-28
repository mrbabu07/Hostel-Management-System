import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  People,
  Receipt,
  Report,
  TrendingUp,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ModernLayout from "../../components/layout/ModernLayout";
import StatsCard from "../../components/common/StatsCard";
import ModernLineChart from "../../components/charts/ModernLineChart";
import ModernDoughnutChart from "../../components/charts/ModernDoughnutChart";

const ModernAdminDashboard = () => {
  const { user } = useAuth();

  const stats = {
    totalUsers: 275,
    monthlyRevenue: 562500,
    activeComplaints: 12,
    resolvedComplaints: 45,
    attendanceRate: 94,
    satisfactionRate: 87,
  };

  // Revenue trend data (last 6 months)
  const revenueData = [450000, 480000, 520000, 510000, 540000, 562500];
  const revenueLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  // Complaint distribution
  const complaintData = [15, 25, 10, 5];
  const complaintLabels = [
    "Food Quality",
    "Room Issues",
    "Maintenance",
    "Other",
  ];

  const recentUsers = [
    {
      name: "John Doe",
      email: "john@example.com",
      role: "Student",
      status: "Active",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Student",
      status: "Active",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Manager",
      status: "Active",
    },
    {
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "Student",
      status: "Inactive",
    },
  ];

  const systemHealth = [
    { metric: "Server Uptime", value: 99.9, status: "excellent" },
    { metric: "Database Performance", value: 95, status: "good" },
    { metric: "API Response Time", value: 88, status: "good" },
    { metric: "Storage Usage", value: 65, status: "warning" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "success";
      case "good":
        return "info";
      case "warning":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <ModernLayout>
      <Box>
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            sx={{
              mb: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Admin Dashboard 👨‍💼
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Welcome back, {user?.name}! Here's your system overview.
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2}>
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={People}
              color="primary"
              trend="up"
              trendValue="+8%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatsCard
              title="Monthly Revenue"
              value={stats.monthlyRevenue}
              icon={Receipt}
              color="success"
              prefix="₹"
              trend="up"
              trendValue="+4.2%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatsCard
              title="Active Complaints"
              value={stats.activeComplaints}
              icon={Report}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatsCard
              title="Resolved"
              value={stats.resolvedComplaints}
              icon={CheckCircle}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatsCard
              title="Attendance"
              value={stats.attendanceRate}
              icon={TrendingUp}
              color="info"
              suffix="%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatsCard
              title="Satisfaction"
              value={stats.satisfactionRate}
              icon={TrendingUp}
              color="warning"
              suffix="%"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Revenue Chart */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ModernLineChart
                title="Revenue Trend (Last 6 Months)"
                data={revenueData}
                labels={revenueLabels}
                label="Revenue (₹)"
              />
            </motion.div>

            {/* Recent Users Table */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card sx={{ mt: 3 }}>
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
                      Recent Users
                    </Typography>
                    <Button size="small" variant="outlined">
                      View All
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentUsers.map((user, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:hover": {
                                backgroundColor: "action.hover",
                              },
                            }}
                          >
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  {user.name.charAt(0)}
                                </Avatar>
                                <Typography variant="body2" fontWeight={500}>
                                  {user.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Chip
                                label={user.role}
                                size="small"
                                color={
                                  user.role === "Manager"
                                    ? "primary"
                                    : "default"
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.status}
                                size="small"
                                color={
                                  user.status === "Active"
                                    ? "success"
                                    : "default"
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Complaint Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ModernDoughnutChart
                title="Complaint Distribution"
                data={complaintData}
                labels={complaintLabels}
              />
            </motion.div>

            {/* System Health */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    System Health
                  </Typography>
                  {systemHealth.map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {item.metric}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="primary"
                        >
                          {item.value}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.value}
                        color={getStatusColor(item.status)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                        }}
                      />
                    </Box>
                  ))}
                  <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                    View Details
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

export default ModernAdminDashboard;
