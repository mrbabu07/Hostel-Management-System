import { useState, useEffect } from "react";
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
import { usersService } from "../../services/users.service";
import { billingService } from "../../services/billing.service";
import { complaintsService } from "../../services/complaints.service";
import { attendanceService } from "../../services/attendance.service";

const ModernAdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    monthlyRevenue: 0,
    activeComplaints: 0,
    resolvedComplaints: 0,
    attendanceRate: 0,
    satisfactionRate: 87,
  });
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users (admin only)
      try {
        const usersRes = await usersService.getAllUsers();
        const users = usersRes.data.users || usersRes.data || [];
        setStats(prev => ({ ...prev, totalUsers: users.length }));
        setRecentUsers(users.slice(0, 4).map(u => ({
          name: u.name,
          email: u.email,
          role: u.role,
          status: 'Active',
        })));
      } catch (error) {
        console.log('Users data not available');
      }

      // Fetch billing data
      try {
        const billsRes = await billingService.getAllBills();
        const bills = billsRes.data.bills || [];
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const monthlyBills = bills.filter(b => b.month === currentMonth && b.year === currentYear);
        const revenue = monthlyBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
        setStats(prev => ({ ...prev, monthlyRevenue: revenue }));
      } catch (error) {
        console.log('Billing data not available');
      }

      // Fetch complaints
      try {
        const complaintsRes = await complaintsService.getAllComplaints();
        const complaints = complaintsRes.data || [];
        const active = complaints.filter(c => c.status === 'pending' || c.status === 'in-progress').length;
        const resolved = complaints.filter(c => c.status === 'resolved').length;
        setStats(prev => ({ 
          ...prev, 
          activeComplaints: active,
          resolvedComplaints: resolved 
        }));
      } catch (error) {
        console.log('Complaints data not available');
      }

      // Fetch attendance
      try {
        const attendanceRes = await attendanceService.getAllAttendance();
        const attendance = attendanceRes.data.attendance || [];
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendance.filter(a => 
          a.date.startsWith(today) && a.approved
        );
        const totalStudents = stats.totalUsers || 100;
        const rate = totalStudents > 0 ? Math.round((todayAttendance.length / totalStudents) * 100) : 0;
        setStats(prev => ({ ...prev, attendanceRate: rate }));
      } catch (error) {
        console.log('Attendance data not available');
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Revenue trend data (last 6 months)
  const revenueData = [450000, 480000, 520000, 510000, 540000, stats.monthlyRevenue];
  const revenueLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  // Complaint distribution
  const complaintData = [stats.activeComplaints, 25, 10, 5];
  const complaintLabels = [
    "Food Quality",
    "Room Issues",
    "Maintenance",
    "Other",
  ];

  const recentUsersData = recentUsers.length > 0 ? recentUsers : [
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
          <div className="mb-6 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-purple-500/30">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard 👨‍💼</h1>
            <p className="text-purple-100">
              Welcome back, {user?.name}! Here's your system overview.
            </p>
          </div>
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
                        {recentUsersData.map((user, index) => (
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
