import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Assessment,
  Download,
  TrendingUp,
  People,
  AttachMoney,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import StatsCard from "../../components/common/StatsCard";
import ModernLineChart from "../../components/charts/ModernLineChart";
import ModernBarChart from "../../components/charts/ModernBarChart";

const Reports = () => {
  const [reportType, setReportType] = useState("attendance");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const attendanceData = [85, 88, 82, 90, 87, 92, 89];
  const revenueData = [45000, 48000, 46000, 50000, 49000, 52000, 51000];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleGenerateReport = () => {
    alert(`Generating ${reportType} report from ${startDate} to ${endDate}`);
  };

  const handleDownloadReport = (format) => {
    alert(`Downloading report as ${format.toUpperCase()}`);
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
                <Assessment sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    Reports & Analytics 📊
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Generate and download comprehensive reports
                  </Typography>
                </Box>
              </Box>
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
                title="Avg Attendance"
                value={88}
                icon={People}
                color="primary"
                suffix="%"
                trend="up"
                trendValue="+3%"
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
                title="Weekly Revenue"
                value={51000}
                icon={AttachMoney}
                color="success"
                prefix="₹"
                trend="up"
                trendValue="+2%"
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
                title="Total Students"
                value={150}
                icon={People}
                color="info"
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
                title="Satisfaction"
                value={4.2}
                icon={TrendingUp}
                color="warning"
                suffix="/5"
              />
            </motion.div>
          </Grid>
        </Grid>

        {/* Report Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Generate Report
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Report Type</InputLabel>
                    <Select
                      value={reportType}
                      label="Report Type"
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <MenuItem value="attendance">Attendance Report</MenuItem>
                      <MenuItem value="revenue">Revenue Report</MenuItem>
                      <MenuItem value="feedback">Feedback Report</MenuItem>
                      <MenuItem value="inventory">Inventory Report</MenuItem>
                      <MenuItem value="complaints">Complaints Report</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ height: "56px" }}
                    onClick={handleGenerateReport}
                  >
                    Generate Report
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleDownloadReport("pdf")}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleDownloadReport("excel")}
                >
                  Download Excel
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleDownloadReport("csv")}
                >
                  Download CSV
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ModernLineChart
                title="Weekly Attendance Trend"
                data={attendanceData}
                labels={labels}
                label="Attendance (%)"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <ModernBarChart
                title="Weekly Revenue"
                data={revenueData}
                labels={labels}
                label="Revenue (₹)"
              />
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </ModernLayout>
  );
};

export default Reports;
