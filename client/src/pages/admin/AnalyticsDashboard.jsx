import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";
import { People, TrendingUp, AttachMoney, Star } from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import StatsCard from "../../components/common/StatsCard";
import ModernBarChart from "../../components/charts/ModernBarChart";
import ModernLineChart from "../../components/charts/ModernLineChart";

const AnalyticsDashboard = () => {
  const monthlyData = [
    { month: "Jan", revenue: 42000, attendance: 82 },
    { month: "Feb", revenue: 45000, attendance: 85 },
    { month: "Mar", revenue: 43000, attendance: 80 },
    { month: "Apr", revenue: 47000, attendance: 88 },
    { month: "May", revenue: 46000, attendance: 86 },
    { month: "Jun", revenue: 48000, attendance: 90 },
  ];

  const revenueData = monthlyData.map((d) => d.revenue);
  const attendanceData = monthlyData.map((d) => d.attendance);
  const labels = monthlyData.map((d) => d.month);

  const metrics = [
    { name: "Server Uptime", value: 99.9, color: "success" },
    { name: "Database Performance", value: 95, color: "info" },
    { name: "API Response Time", value: 88, color: "primary" },
    { name: "Storage Usage", value: 65, color: "warning" },
  ];

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
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Analytics Dashboard 📊
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Comprehensive insights and performance metrics
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <StatsCard
                title="Total Students"
                value={150}
                icon={People}
                color="primary"
                trend="up"
                trendValue="+5%"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              <StatsCard
                title="Monthly Revenue"
                value={48000}
                icon={AttachMoney}
                color="success"
                prefix="₹"
                trend="up"
                trendValue="+4%"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <StatsCard
                title="Avg Attendance"
                value={90}
                icon={TrendingUp}
                color="info"
                suffix="%"
                trend="up"
                trendValue="+2%"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
            >
              <StatsCard
                title="Avg Rating"
                value={4.2}
                icon={Star}
                color="warning"
                suffix="/5"
                trend="up"
                trendValue="+0.3"
              />
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Revenue Chart */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ModernBarChart
                title="Monthly Revenue Trend"
                data={revenueData}
                labels={labels}
                label="Revenue (₹)"
              />
            </motion.div>
          </Grid>

          {/* Attendance Chart */}
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <ModernLineChart
                title="Attendance Trend"
                data={attendanceData}
                labels={labels}
                label="Attendance (%)"
              />
            </motion.div>
          </Grid>

          {/* System Metrics */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    System Performance Metrics
                  </Typography>
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    {metrics.map((metric, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {metric.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="primary"
                            >
                              {metric.value}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={metric.value}
                            color={metric.color}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </ModernLayout>
  );
};

export default AnalyticsDashboard;
