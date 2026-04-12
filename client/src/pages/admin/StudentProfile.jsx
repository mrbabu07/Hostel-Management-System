import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Room,
  ArrowBack,
  CheckCircle,
  Pending,
  Edit,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { usersService } from "../../services/users.service";
import { billingService } from "../../services/billing.service";
import toast from "react-hot-toast";

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // Fetch student details
      const studentResponse = await usersService.getUserById(studentId);
      setStudent(studentResponse.data.user);

      // Fetch student bills
      const billsResponse = await billingService.getStudentBills(studentId);
      setBills(billsResponse.data.bills || []);
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBillStatus = (bill) => {
    setSelectedBill(bill);
    setNewStatus(bill.status);
    setUpdateDialog(true);
  };

  const handleSaveStatus = async () => {
    try {
      await billingService.updateBillStatus(selectedBill._id, newStatus);
      toast.success("Bill status updated successfully");
      setUpdateDialog(false);
      fetchStudentData();
    } catch (error) {
      console.error("Error updating bill status:", error);
      toast.error("Failed to update bill status");
    }
  };

  if (loading) {
    return (
      <ModernLayout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </ModernLayout>
    );
  }

  if (!student) {
    return (
      <ModernLayout>
        <Card>
          <CardContent sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Student not found
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate("/admin/users")}
            >
              Back to Users
            </Button>
          </CardContent>
        </Card>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout>
      <Box>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/admin/users")}
              variant="outlined"
            >
              Back
            </Button>
            <div className="flex-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/30">
              <div className="flex items-center gap-4">
                <Person sx={{ fontSize: 40 }} />
                <div>
                  <h1 className="text-3xl font-bold mb-1">{student.name}</h1>
                  <p className="text-purple-100">Student Profile</p>
                </div>
              </div>
            </div>
          </Box>
        </motion.div>

        {/* Student Details */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Personal Information
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Email sx={{ color: "primary.main" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {student.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Phone sx={{ color: "primary.main" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {student.phone || "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Room sx={{ color: "primary.main" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Room
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {student.roomNumber || "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Person sx={{ color: "primary.main" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Roll Number
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {student.rollNumber || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Account Status
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Role
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={student.role}
                        color="primary"
                        variant="outlined"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={student.isActive ? "Active" : "Inactive"}
                        color={student.isActive ? "success" : "error"}
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Joined
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>
                      {new Date(student.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Bills Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Billing History
              </Typography>

              {bills.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                  No bills found
                </Typography>
              ) : (
                <Box>
                  {bills.map((bill, index) => (
                    <motion.div
                      key={bill._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card sx={{ mb: 2, backgroundColor: "rgba(139, 92, 246, 0.05)" }}>
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6" fontWeight={600}>
                              {new Date(2024, bill.month - 1).toLocaleString("default", {
                                month: "long",
                              })}{" "}
                              {bill.year}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                              <Chip
                                icon={
                                  bill.status === "PAID" ? <CheckCircle /> : <Pending />
                                }
                                label={bill.status}
                                color={bill.status === "PAID" ? "success" : "warning"}
                                size="small"
                              />
                              <Button
                                size="small"
                                startIcon={<Edit />}
                                onClick={() => handleUpdateBillStatus(bill)}
                                variant="outlined"
                              >
                                Update
                              </Button>
                            </Box>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                              <Box sx={{ p: 1.5, backgroundColor: "rgba(59, 130, 246, 0.1)", borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Total Meals
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                  {bill.totalMeals || 0}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <Box sx={{ p: 1.5, backgroundColor: "rgba(34, 197, 94, 0.1)", borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Meal Cost
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                  ৳{bill.mealCost || 0}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <Box sx={{ p: 1.5, backgroundColor: "rgba(168, 85, 247, 0.1)", borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Fixed Cost (Hostel)
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                  ৳{bill.fixedCost || 0}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <Box sx={{ p: 1.5, backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Total Payable
                                </Typography>
                                <Typography variant="h6" fontWeight={600} color="error">
                                  ৳{bill.totalAmount || 0}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          {/* Calculation Summary */}
                          <Box sx={{ mt: 2, pt: 2, borderTop: "2px solid rgba(139, 92, 246, 0.2)" }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: "block" }}>
                              Bill Calculation
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, p: 1, backgroundColor: "rgba(0,0,0,0.02)", borderRadius: 0.5 }}>
                              <Typography variant="body2">Meal Cost:</Typography>
                              <Typography variant="body2" fontWeight={600}>৳{bill.mealCost || 0}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, p: 1, backgroundColor: "rgba(0,0,0,0.02)", borderRadius: 0.5 }}>
                              <Typography variant="body2">Fixed Cost:</Typography>
                              <Typography variant="body2" fontWeight={600}>৳{bill.fixedCost || 0}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", p: 1, backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: 0.5, fontWeight: 700 }}>
                              <Typography variant="body2" fontWeight={700}>Total Bill:</Typography>
                              <Typography variant="body2" fontWeight={700} color="error">৳{bill.totalAmount || 0}</Typography>
                            </Box>
                          </Box>

                          {bill.breakdown && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                              <Typography variant="caption" fontWeight={600} color="text.secondary">
                                Meal Breakdown
                              </Typography>
                              <Grid container spacing={1} sx={{ mt: 0.5 }}>
                                {Object.entries(bill.breakdown).map(([mealType, data]) => (
                                  <Grid item xs={12} sm={6} md={4} key={mealType}>
                                    <Box sx={{ p: 1, backgroundColor: "rgba(0,0,0,0.02)", borderRadius: 0.5 }}>
                                      <Typography variant="caption" sx={{ textTransform: "capitalize" }}>
                                        {mealType}: {data.count} meals × ৳{data.rate} = ৳{data.total}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Update Status Dialog */}
        <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Update Bill Status</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedBill && (
              <Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Bill for{" "}
                  {new Date(2024, selectedBill.month - 1).toLocaleString("default", {
                    month: "long",
                  })}{" "}
                  {selectedBill.year}: ৳{selectedBill.totalAmount}
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant={newStatus === "DUE" ? "contained" : "outlined"}
                    color="warning"
                    fullWidth
                    onClick={() => setNewStatus("DUE")}
                  >
                    DUE
                  </Button>
                  <Button
                    variant={newStatus === "PAID" ? "contained" : "outlined"}
                    color="success"
                    fullWidth
                    onClick={() => setNewStatus("PAID")}
                  >
                    PAID
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveStatus} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ModernLayout>
  );
};

export default StudentProfile;
