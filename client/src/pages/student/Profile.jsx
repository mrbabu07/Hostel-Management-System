import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import {
  AccountCircle,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    phone: "9876543210",
    rollNumber: "2024001",
    roomNumber: "A-101",
    address: "123 Main Street, City",
    emergencyContact: "9876543211",
    bloodGroup: "O+",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // API call to save profile
    setIsEditing(false);
    alert("Profile updated successfully!");
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
                <AccountCircle sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    My Profile 👤
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Manage your personal information
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        <Grid container spacing={3}>
          {/* Profile Picture Card */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Avatar
                      sx={{
                        width: 150,
                        height: 150,
                        fontSize: 60,
                        bgcolor: "primary.main",
                        mb: 2,
                      }}
                    >
                      {formData.name.charAt(0)}
                    </Avatar>
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 0,
                        bgcolor: "white",
                        boxShadow: 2,
                        "&:hover": { bgcolor: "grey.100" },
                      }}
                      size="small"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {formData.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {formData.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      px: 2,
                      py: 1,
                      bgcolor: "primary.light",
                      color: "primary.dark",
                      borderRadius: 2,
                      display: "inline-block",
                    }}
                  >
                    Roll: {formData.rollNumber}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Profile Details Card */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Personal Information
                    </Typography>
                    {!isEditing ? (
                      <Button
                        startIcon={<Edit />}
                        variant="outlined"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          startIcon={<Save />}
                          variant="contained"
                          onClick={handleSave}
                        >
                          Save
                        </Button>
                        <Button
                          startIcon={<Cancel />}
                          variant="outlined"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Roll Number"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Room Number"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Blood Group"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        multiline
                        rows={2}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Emergency Contact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth
                      />
                    </Grid>
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

export default Profile;
