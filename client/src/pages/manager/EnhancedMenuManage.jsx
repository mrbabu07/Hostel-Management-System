import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CardMedia,
  Alert,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Restaurant,
  Image as ImageIcon,
  Close,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import ModernLoader from "../../components/common/ModernLoader";
import EmptyState from "../../components/common/EmptyState";
import { menuService } from "../../services/menu.service";
import { imageService } from "../../services/image.service";
import toast from "react-hot-toast";
import { toISODate } from "../../utils/formatDate";

const EnhancedMenuManage = () => {
  const [menus, setMenus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    date: toISODate(new Date()),
    mealType: "breakfast",
    items: [{ name: "", description: "" }],
    imageUrl: "",
  });

  useEffect(() => {
    fetchMenus();
  }, [selectedDate]);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await menuService.getMenus(selectedDate);
      setMenus(response.data.menus);
    } catch (error) {
      console.error("Error fetching menus:", error);
      toast.error("Failed to load menus");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (menu = null) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        date: toISODate(new Date(menu.date)),
        mealType: menu.mealType,
        items: menu.items || [{ name: "", description: "" }],
        imageUrl: menu.imageUrl || "",
      });
    } else {
      setEditingMenu(null);
      setFormData({
        date: selectedDate,
        mealType: "breakfast",
        items: [{ name: "", description: "" }],
        imageUrl: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMenu(null);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", description: "" }],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleFetchImage = async () => {
    if (formData.items[0]?.name) {
      toast.loading("Fetching image...");
      const imageUrl = await imageService.fetchMealImage(formData.items[0].name);
      setFormData({ ...formData, imageUrl });
      toast.dismiss();
      toast.success("Image fetched successfully!");
    } else {
      toast.error("Please add at least one item first");
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingMenu) {
        await menuService.updateMenu(editingMenu._id, formData);
        toast.success("Menu updated successfully!");
      } else {
        await menuService.createMenu(formData);
        toast.success("Menu created successfully!");
      }
      handleCloseDialog();
      fetchMenus();
    } catch (error) {
      console.error("Error saving menu:", error);
      toast.error(error.response?.data?.message || "Failed to save menu");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      try {
        await menuService.deleteMenu(id);
        toast.success("Menu deleted successfully!");
        fetchMenus();
      } catch (error) {
        console.error("Error deleting menu:", error);
        toast.error("Failed to delete menu");
      }
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
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    Menu Management 🍽️
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Create and manage daily menus with images
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  Add Menu
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Date Selector */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              type="date"
              label="Select Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </CardContent>
        </Card>

        {/* Menus Grid */}
        {loading ? (
          <ModernLoader />
        ) : menus.length === 0 ? (
          <EmptyState
            icon={Restaurant}
            title="No Menus Found"
            description="Create your first menu for this date"
          />
        ) : (
          <Grid container spacing={3}>
            {menus.map((menu, index) => (
              <Grid item xs={12} md={4} key={menu._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    {/* Image */}
                    {menu.imageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={menu.imageUrl}
                        alt={menu.mealType}
                        sx={{ objectFit: "cover" }}
                      />
                    )}

                    <CardContent>
                      {/* Header */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={menu.mealType.toUpperCase()}
                          sx={{
                            bgcolor: `${getMealColor(menu.mealType)}20`,
                            color: getMealColor(menu.mealType),
                            fontWeight: 600,
                          }}
                        />
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(menu)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(menu._id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Items */}
                      <Box>
                        {menu.items?.map((item, idx) => (
                          <Box key={idx} sx={{ mb: 1 }}>
                            <Typography variant="body1" fontWeight={600}>
                              {item.name}
                            </Typography>
                            {item.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.description}
                              </Typography>
                            )}
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {editingMenu ? "Edit Menu" : "Add New Menu"}
              </Typography>
              <IconButton onClick={handleCloseDialog}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    label="Date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Meal Type</InputLabel>
                    <Select
                      value={formData.mealType}
                      label="Meal Type"
                      onChange={(e) =>
                        setFormData({ ...formData, mealType: e.target.value })
                      }
                    >
                      <MenuItem value="breakfast">Breakfast</MenuItem>
                      <MenuItem value="lunch">Lunch</MenuItem>
                      <MenuItem value="dinner">Dinner</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Image Section */}
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Add items first, then fetch an image automatically!
                  </Alert>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <TextField
                      label="Image URL"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      fullWidth
                      placeholder="Or fetch automatically"
                    />
                    <Button
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      onClick={handleFetchImage}
                      sx={{ minWidth: "150px" }}
                    >
                      Fetch Image
                    </Button>
                  </Box>
                  {formData.imageUrl && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}
                </Grid>

                {/* Items */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Menu Items
                  </Typography>
                  {formData.items.map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            label="Item Name"
                            value={item.name}
                            onChange={(e) =>
                              handleItemChange(index, "name", e.target.value)
                            }
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Description"
                            value={item.description}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(index)}
                            disabled={formData.items.length === 1}
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    startIcon={<Add />}
                    onClick={handleAddItem}
                    variant="outlined"
                  >
                    Add Item
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              {editingMenu ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ModernLayout>
  );
};

export default EnhancedMenuManage;
