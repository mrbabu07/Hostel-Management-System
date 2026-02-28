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
  Stack,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Notifications, Add, Edit, Delete, PushPin } from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import { noticesService } from "../../services/notices.service";
import { formatDateTime } from "../../utils/formatDate";
import EmptyState from "../../components/common/EmptyState";
import ModernLoader from "../../components/common/ModernLoader";

const NoticesManage = () => {
  const [notices, setNotices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "all",
    isPinned: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await noticesService.getAllNotices();
      const noticesData = Array.isArray(response.data) ? response.data : [];
      setNotices(noticesData);
    } catch (error) {
      console.error("Error fetching notices:", error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotice) {
        await noticesService.updateNotice(editingNotice._id, formData);
      } else {
        await noticesService.createNotice(formData);
      }
      setIsModalOpen(false);
      setEditingNotice(null);
      setFormData({ title: "", content: "", audience: "all", isPinned: false });
      fetchNotices();
    } catch (error) {
      console.error("Error saving notice:", error);
      alert("Failed to save notice");
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      audience: notice.audience,
      isPinned: notice.isPinned,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    try {
      await noticesService.deleteNotice(id);
      fetchNotices();
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("Failed to delete notice");
    }
  };

  const openCreateModal = () => {
    setEditingNotice(null);
    setFormData({ title: "", content: "", audience: "all", isPinned: false });
    setIsModalOpen(true);
  };

  const getAudienceColor = (audience) => {
    switch (audience) {
      case "all":
        return "primary";
      case "student":
        return "success";
      case "manager":
        return "warning";
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Notices Management 📢
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Create and manage announcements for users
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={openCreateModal}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  Create Notice
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notices List */}
        {loading ? (
          <ModernLoader />
        ) : notices.length === 0 ? (
          <EmptyState
            icon={Notifications}
            title="No Notices Found"
            description="Create your first notice to get started"
          />
        ) : (
          <Stack spacing={2}>
            {notices.map((notice, index) => (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  sx={{
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography variant="h6" fontWeight={600}>
                            {notice.title}
                          </Typography>
                          {notice.isPinned && (
                            <Chip
                              icon={<PushPin />}
                              label="Pinned"
                              size="small"
                              color="warning"
                            />
                          )}
                          <Chip
                            label={notice.audience}
                            size="small"
                            color={getAudienceColor(notice.audience)}
                            sx={{ textTransform: "capitalize" }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Posted by: {notice.createdBy?.name} |{" "}
                          {formatDateTime(notice.createdAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {notice.content}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(notice)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(notice._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        )}

        {/* Create/Edit Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingNotice(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingNotice ? "Edit Notice" : "Create Notice"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Stack spacing={3}>
                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  fullWidth
                />

                <TextField
                  label="Content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  multiline
                  rows={5}
                  required
                  fullWidth
                />

                <FormControl fullWidth>
                  <InputLabel>Audience</InputLabel>
                  <Select
                    value={formData.audience}
                    label="Audience"
                    onChange={(e) =>
                      setFormData({ ...formData, audience: e.target.value })
                    }
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="student">Students Only</MenuItem>
                    <MenuItem value="manager">Managers Only</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isPinned}
                      onChange={(e) =>
                        setFormData({ ...formData, isPinned: e.target.checked })
                      }
                    />
                  }
                  label="Pin this notice"
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingNotice(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                {editingNotice ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </ModernLayout>
  );
};

export default NoticesManage;
