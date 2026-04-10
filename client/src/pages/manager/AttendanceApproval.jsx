import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
} from "@mui/material";
import {
  CheckCircle,
  Pending,
  Person,
  Restaurant,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import ModernLoader from "../../components/common/ModernLoader";
import EmptyState from "../../components/common/EmptyState";
import { attendanceService } from "../../services/attendance.service";
import toast from "react-hot-toast";

const AttendanceApproval = () => {
  const [pendingAttendance, setPendingAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingAttendance();
  }, []);

  const fetchPendingAttendance = async () => {
    setLoading(true);
    try {
      const response = await attendanceService.getPendingAttendance();
      setPendingAttendance(response.data.attendance || []);
    } catch (error) {
      console.error("Error fetching pending attendance:", error);
      toast.error("Failed to load pending attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await attendanceService.approveAttendance(id);
      toast.success("Attendance approved successfully!");
      fetchPendingAttendance();
    } catch (error) {
      console.error("Error approving attendance:", error);
      toast.error("Failed to approve attendance");
    }
  };

  const getMealColor = (mealType) => {
    const colors = {
      breakfast: "#F59E0B",
      lunch: "#10B981",
      dinner: "#8b9cff",
    };
    return colors[mealType] || "#667eea";
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
              <CheckCircle sx={{ fontSize: 40 }} />
              <div>
                <h1 className="text-4xl font-bold mb-2">Attendance Approval ✅</h1>
                <p className="text-purple-100">
                  Review and approve student attendance
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h3" fontWeight={700} color="primary">
                  {pendingAttendance.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Approvals
                </Typography>
              </Box>
              <Pending sx={{ fontSize: 60, color: "warning.main" }} />
            </Box>
          </CardContent>
        </Card>

        {/* Pending Attendance Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Pending Attendance Records
            </Typography>
            {loading ? (
              <ModernLoader />
            ) : pendingAttendance.length === 0 ? (
              <EmptyState
                icon={CheckCircle}
                title="All Caught Up!"
                description="No pending attendance to approve"
              />
            ) : (
              <>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Review and approve student attendance submissions
                </Alert>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Roll Number</TableCell>
                        <TableCell>Room</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Meal Type</TableCell>
                        <TableCell>Marked At</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingAttendance.map((record) => (
                        <TableRow key={record._id}>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Person color="primary" />
                              <Typography fontWeight={600}>
                                {record.student?.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{record.student?.rollNumber}</TableCell>
                          <TableCell>{record.student?.roomNumber}</TableCell>
                          <TableCell>
                            {new Date(record.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={<Restaurant />}
                              label={record.mealType}
                              size="small"
                              sx={{
                                bgcolor: `${getMealColor(record.mealType)}20`,
                                color: getMealColor(record.mealType),
                                fontWeight: 600,
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(record.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprove(record._id)}
                            >
                              Approve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </ModernLayout>
  );
};

export default AttendanceApproval;
