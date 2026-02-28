import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Pending,
  Restaurant,
  CalendarToday,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import ModernLoader from "../../components/common/ModernLoader";
import { attendanceService } from "../../services/attendance.service";
import toast from "react-hot-toast";
import { toISODate } from "../../utils/formatDate";

const SelfAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState("");
  const [todayAttendance, setTodayAttendance] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await attendanceService.getMyAttendance();
      setAttendanceRecords(response.data.attendance || []);
      
      // Check today's attendance
      const today = toISODate(new Date());
      const todayRecords = response.data.attendance.filter(
        (record) => toISODate(new Date(record.date)) === today
      );
      
      const todayStatus = {
        breakfast: todayRecords.find((r) => r.mealType === "breakfast"),
        lunch: todayRecords.find((r) => r.mealType === "lunch"),
        dinner: todayRecords.find((r) => r.mealType === "dinner"),
      };
      
      setTodayAttendance(todayStatus);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedMeal) {
      toast.error("Please select a meal type");
      return;
    }

    try {
      await attendanceService.markSelfAttendance({
        date: toISODate(new Date()),
        mealType: selectedMeal,
      });
      
      toast.success("Attendance marked! Waiting for manager approval");
      setDialogOpen(false);
      setSelectedMeal("");
      fetchAttendance();
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  const getStatusChip = (record) => {
    if (!record) {
      return <Chip label="Not Marked" size="small" />;
    }

    if (record.approved) {
      return (
        <Chip
          icon={<CheckCircle />}
          label="Approved"
          color="success"
          size="small"
        />
      );
    }

    return (
      <Chip
        icon={<Pending />}
        label="Pending"
        color="warning"
        size="small"
      />
    );
  };

  const canMarkAttendance = (mealType) => {
    const record = todayAttendance[mealType];
    // Can only mark if not already marked today
    return !record;
  };

  const getMealTime = (mealType) => {
    const times = {
      breakfast: "7:00 AM - 9:00 AM",
      lunch: "12:00 PM - 2:00 PM",
      dinner: "7:00 PM - 9:00 PM",
    };
    return times[mealType];
  };

  const getMealTimeStatus = (mealType) => {
    const now = new Date();
    const hour = now.getHours();
    
    const timeRanges = {
      breakfast: { start: 7, end: 9 },
      lunch: { start: 12, end: 14 },
      dinner: { start: 19, end: 21 },
    };
    
    const range = timeRanges[mealType];
    if (hour >= range.start && hour < range.end) {
      return "active";
    } else if (hour < range.start) {
      return "upcoming";
    } else {
      return "past";
    }
  };

  return (
    <ModernLayout>
      <Box>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-purple-500/30">
            <div className="flex items-center gap-4">
              <CalendarToday sx={{ fontSize: 40 }} />
              <div>
                <h1 className="text-4xl font-bold mb-2">My Attendance 📋</h1>
                <p className="text-purple-100">
                  Mark your daily meal attendance
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Attendance */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Today's Attendance
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Mark your attendance for each meal. You can only mark once per meal per day. Manager will approve it.
            </Alert>
            <Grid container spacing={2}>
              {["breakfast", "lunch", "dinner"].map((mealType) => (
                <Grid item xs={12} md={4} key={mealType}>
                  <Card
                    sx={{
                      border: "2px solid",
                      borderColor: todayAttendance[mealType]?.approved
                        ? "success.main"
                        : "divider",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ textTransform: "capitalize" }}
                          >
                            {mealType}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getMealTime(mealType)}
                          </Typography>
                        </Box>
                        <Restaurant color="primary" />
                      </Box>
                      {getStatusChip(todayAttendance[mealType])}
                      {canMarkAttendance(mealType) ? (
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mt: 2 }}
                          onClick={() => {
                            setSelectedMeal(mealType);
                            setDialogOpen(true);
                          }}
                        >
                          Mark Attendance
                        </Button>
                      ) : (
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                          <Typography variant="caption" color="text.secondary">
                            {todayAttendance[mealType]?.approved
                              ? "Attendance approved ✓"
                              : "Waiting for approval..."}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Attendance History
            </Typography>
            {loading ? (
              <ModernLoader />
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Meal Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Marked At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceRecords.slice(0, 10).map((record) => (
                      <TableRow key={record._id}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {record.mealType}
                        </TableCell>
                        <TableCell>{getStatusChip(record)}</TableCell>
                        <TableCell>
                          {new Date(record.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Mark Attendance Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              Mark Attendance
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                You are marking attendance for{" "}
                <strong>{selectedMeal}</strong> today. Manager will review and
                approve it.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date().toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Meal: {selectedMeal}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleMarkAttendance}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ModernLayout>
  );
};

export default SelfAttendance;
