import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PersonAdd, Edit, ToggleOn, ToggleOff, Delete, Download, Visibility } from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import ModernTable from "../../components/common/ModernTable";
import { usersService } from "../../services/users.service";
import { exportToCSV, exportFromAPI } from "../../utils/exportUtils";

const UsersManage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    rollNumber: "",
    roomNumber: "",
    phone: "",
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersService.getAllUsers();
      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersService.updateUser(editingUser._id, formData);
      } else {
        await usersService.createUser(formData);
      }
      await fetchUsers();
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        role: "student",
        rollNumber: "",
        roomNumber: "",
        phone: "",
      });
    } catch (err) {
      console.error("Error saving user:", err);
      setError(err.response?.data?.message || "Failed to save user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      rollNumber: user.rollNumber || "",
      roomNumber: user.roomNumber || "",
      phone: user.phone || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await usersService.deleteUser(id);
        await fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        setError(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      await usersService.toggleUserStatus(id);
      await fetchUsers();
    } catch (err) {
      console.error("Error toggling status:", err);
      setError(err.response?.data?.message || "Failed to toggle status");
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "student",
      rollNumber: "",
      roomNumber: "",
      phone: "",
    });
    setIsModalOpen(true);
  };

  const handleExportCSV = async () => {
    try {
      await exportFromAPI(
        "http://localhost:5000/api/v1/users/export/csv",
        `users-${new Date().toISOString().split("T")[0]}.csv`
      );
    } catch (error) {
      console.error("Export error:", error);
      setError("Failed to export users");
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "User",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {params.row.name?.charAt(0) || "U"}
          </Avatar>
          <Typography variant="body2" fontWeight={500}>
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "manager" ? "primary" : "default"}
          sx={{ textTransform: "capitalize" }}
        />
      ),
    },
    {
      field: "rollNumber",
      headerName: "Roll Number",
      width: 130,
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 130,
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "roomNumber",
      headerName: "Room",
      width: 100,
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          size="small"
          color={params.value ? "success" : "default"}
          onClick={() => toggleStatus(params.row._id)}
          icon={params.value ? <ToggleOn /> : <ToggleOff />}
          sx={{ cursor: "pointer" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {params.row.role === "student" && (
            <IconButton
              size="small"
              color="info"
              onClick={() => navigate(`/admin/student/${params.row._id}`)}
              title="View Profile"
            >
              <Visibility fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row._id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <ModernLayout>
      <Box>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-purple-500/30">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">User Management 👥</h1>
                <p className="text-purple-100">
                  Manage all users, roles, and permissions ({users.length} users)
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={handleExportCSV}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                  }}
                >
                  Export CSV
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={openCreateModal}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  Add User
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ModernTable columns={columns} rows={users} getRowId={(row) => row._id} />
            </motion.div>
          </>
        )}

        {/* Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  fullWidth
                />
                <TextField
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
                {formData.role === "student" && (
                  <>
                    <TextField
                      label="Roll Number"
                      value={formData.rollNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, rollNumber: e.target.value })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Room Number"
                      value={formData.roomNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, roomNumber: e.target.value })
                      }
                      fullWidth
                    />
                  </>
                )}
                <TextField
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  fullWidth
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {editingUser ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </ModernLayout>
  );
};

export default UsersManage;
