import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Stack,
} from "@mui/material";
import { Report, FilterList } from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { complaintsService } from "../../services/complaints.service";
import { formatDateTime } from "../../utils/formatDate";
import EmptyState from "../../components/common/EmptyState";
import ModernLoader from "../../components/common/ModernLoader";

const ComplaintsManage = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintsService.getAllComplaints(
        statusFilter,
        categoryFilter,
      );
      const complaintsData = Array.isArray(response.data) ? response.data : [];
      setComplaints(complaintsData);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await complaintsService.updateComplaintStatus(selectedComplaint._id, {
        status,
        adminNote,
      });
      setIsModalOpen(false);
      setSelectedComplaint(null);
      setAdminNote("");
      fetchComplaints();
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert("Failed to update complaint");
    }
  };

  const openComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setAdminNote(complaint.adminNote || "");
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in-progress":
        return "info";
      case "resolved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
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
          <Card
            sx={{
              mb: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Complaints Management 📋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Review and manage student complaints
              </Typography>
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
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                      startAdornment={<FilterList sx={{ mr: 1 }} />}
                    >
                      <MenuItem value="">All Status</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      label="Category"
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      startAdornment={<FilterList sx={{ mr: 1 }} />}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      <MenuItem value="food-quality">Food Quality</MenuItem>
                      <MenuItem value="service">Service</MenuItem>
                      <MenuItem value="hygiene">Hygiene</MenuItem>
                      <MenuItem value="billing">Billing</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Complaints List */}
        {loading ? (
          <ModernLoader />
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={Report}
            title="No Complaints Found"
            description="There are no complaints matching your filters"
          />
        ) : (
          <Stack spacing={2}>
            {complaints.map((complaint, index) => (
              <motion.div
                key={complaint._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => openComplaint(complaint)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {complaint.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          By: {complaint.userId?.name} |{" "}
                          {formatDateTime(complaint.createdAt)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {complaint.description}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                        <Chip
                          label={complaint.status}
                          size="small"
                          color={getStatusColor(complaint.status)}
                          sx={{ textTransform: "capitalize" }}
                        />
                        <Chip
                          label={complaint.category}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: "capitalize" }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        )}

        {/* Complaint Details Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedComplaint(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Complaint Details</DialogTitle>
          {selectedComplaint && (
            <>
              <DialogContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {selectedComplaint.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category:{" "}
                      <Chip
                        label={selectedComplaint.category}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted by: {selectedComplaint.userId?.name} (
                      {selectedComplaint.userId?.email})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {formatDateTime(selectedComplaint.createdAt)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Description
                    </Typography>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2">
                          {selectedComplaint.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>

                  <TextField
                    label="Admin Note"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Add notes for this complaint..."
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => handleUpdateStatus("in-progress")}
                  variant="outlined"
                  color="info"
                >
                  In Progress
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("resolved")}
                  variant="contained"
                  color="success"
                >
                  Resolve
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("rejected")}
                  variant="outlined"
                  color="error"
                >
                  Reject
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </ModernLayout>
  );
};

export default ComplaintsManage;
