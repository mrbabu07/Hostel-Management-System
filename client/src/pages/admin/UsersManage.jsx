import { useState } from "react";
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
} from "@mui/material";
import { PersonAdd, Edit, ToggleOn, ToggleOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import ModernTable from "../../components/common/ModernTable";

const UsersManage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "student",
      rollNumber: "2024001",
      isActive: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "manager",
      isActive: true,
    },
    {
      id: 3,
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "student",
      rollNumber: "2024002",
      isActive: false,
    },
  ]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)),
      );
    } else {
      setUsers([...users, { id: Date.now(), ...formData, isActive: true }]);
    }
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
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setIsModalOpen(true);
  };

  const toggleStatus = (id) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
    );
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

  const columns = [
    {
      field: "name",
      headerName: "User",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {params.row.name.charAt(0)}
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
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          size="small"
          color={params.value ? "success" : "default"}
          onClick={() => toggleStatus(params.row.id)}
          icon={params.value ? <ToggleOn /> : <ToggleOff />}
          sx={{ cursor: "pointer" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleEdit(params.row)}
        >
          <Edit fontSize="small" />
        </IconButton>
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
                  Manage all users, roles, and permissions
                </p>
              </div>
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
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ModernTable columns={columns} rows={users} />
        </motion.div>

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
