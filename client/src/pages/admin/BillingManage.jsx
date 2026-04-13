import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import {
  Receipt,
  TrendingUp,
  CheckCircle,
  Schedule,
  Visibility,
  Refresh,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import ModernTable from "../../components/common/ModernTable";
import StatsCard from "../../components/common/StatsCard";
import { billingService } from "../../services/billing.service";
import ModernLoader from "../../components/common/ModernLoader";
import EmptyState from "../../components/common/EmptyState";
import toast from "react-hot-toast";

const BillingManage = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBills();
  }, [month, year]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      console.log(`Fetching bills for month: ${month}, year: ${year}`);
      const response = await billingService.getAllBills(month, year);
      console.log("API Response:", response.data);
      const billsData = response.data.bills || [];
      console.log(`Fetched ${billsData.length} bills`);
      setBills(billsData);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error("Failed to fetch bills");
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthNum) => {
    return new Date(2024, monthNum - 1).toLocaleString("default", { month: "long" });
  };

  const calculateTotals = () => {
    const total = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const paid = bills.filter((b) => b.status === "PAID").length;
    const unpaid = bills.length - paid;
    return { total, paid, unpaid };
  };

  const totals = calculateTotals();

  const columns = [
    {
      field: "name",
      headerName: "Student",
      flex: 1,
      renderCell: (params) => params.row.student?.name || "N/A",
    },
    {
      field: "rollNumber",
      headerName: "Roll Number",
      width: 130,
      renderCell: (params) => params.row.student?.rollNumber || "N/A",
    },
    {
      field: "totalMeals",
      headerName: "Meals",
      width: 100,
      renderCell: (params) => params.value || 0,
    },
    {
      field: "mealCost",
      headerName: "Meal Cost",
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          ৳{params.value || 0}
        </Typography>
      ),
    },
    {
      field: "fixedCost",
      headerName: "Fixed Cost",
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          ৳{params.value || 0}
        </Typography>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          ৳{params.value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === "PAID" ? "Paid" : "Due"}
          size="small"
          color={params.value === "PAID" ? "success" : "warning"}
        />
      ),
    },
    {
      field: "paidAt",
      headerName: "Paid Date",
      width: 150,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "-",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <IconButton
          size="small"
          color="info"
          onClick={() => navigate(`/admin/student/${params.row.student._id}`)}
          title="View Student Profile"
        >
          <Visibility fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const rows = bills.map((bill) => ({
    id: bill._id,
    ...bill,
  }));

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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Billing Management 💰
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    View and manage student bills
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={fetchBills}
                    disabled={loading}
                    sx={{
                      color: "white",
                      borderColor: "white",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                    }}
                    startIcon={<Refresh />}
                  >
                    {loading ? "Loading..." : "Refresh"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Month</InputLabel>
                    <Select
                      value={month}
                      label="Month"
                      onChange={(e) => setMonth(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                        <MenuItem key={m} value={m}>
                          {getMonthName(m)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Year</InputLabel>
                    <Select
                      value={year}
                      label="Year"
                      onChange={(e) => setYear(Number(e.target.value))}
                    >
                      {[2024, 2025, 2026].map((y) => (
                        <MenuItem key={y} value={y}>
                          {y}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <StatsCard
                title="Total Revenue"
                value={totals.total}
                icon={TrendingUp}
                color="primary"
                prefix="৳"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
            >
              <StatsCard
                title="Paid Bills"
                value={totals.paid}
                icon={CheckCircle}
                color="success"
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <StatsCard
                title="Unpaid Bills"
                value={totals.unpaid}
                icon={Schedule}
                color="error"
              />
            </motion.div>
          </Grid>
        </Grid>

        {/* Bills Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {loading ? (
            <ModernLoader />
          ) : bills.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No Bills Found"
              description="No bills found for this period."
            />
          ) : (
            <ModernTable columns={columns} rows={rows} />
          )}
        </motion.div>
      </Box>
    </ModernLayout>
  );
};

export default BillingManage;
