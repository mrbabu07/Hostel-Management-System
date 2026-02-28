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
  Chip,
  IconButton,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Add,
  Edit,
  Delete,
  Warning,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";
import ModernTable from "../../components/common/ModernTable";

const Inventory = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Rice",
      quantity: 500,
      unit: "kg",
      minStock: 100,
      status: "good",
    },
    {
      id: 2,
      name: "Dal",
      quantity: 200,
      unit: "kg",
      minStock: 50,
      status: "good",
    },
    {
      id: 3,
      name: "Oil",
      quantity: 30,
      unit: "liters",
      minStock: 50,
      status: "low",
    },
    {
      id: 4,
      name: "Sugar",
      quantity: 80,
      unit: "kg",
      minStock: 30,
      status: "good",
    },
    {
      id: 5,
      name: "Salt",
      quantity: 15,
      unit: "kg",
      minStock: 20,
      status: "low",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "kg",
    minStock: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now(),
      quantity: Number(formData.quantity),
      minStock: Number(formData.minStock),
      status:
        Number(formData.quantity) < Number(formData.minStock) ? "low" : "good",
    };

    if (editingItem) {
      setItems(
        items.map((item) => (item.id === editingItem.id ? newItem : item)),
      );
    } else {
      setItems([...items, newItem]);
    }

    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: "", quantity: "", unit: "kg", minStock: "" });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ name: "", quantity: "", unit: "kg", minStock: "" });
    setIsModalOpen(true);
  };

  const columns = [
    { field: "name", headerName: "Item Name", flex: 1 },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 150,
      renderCell: (params) => `${params.value} ${params.row.unit}`,
    },
    {
      field: "minStock",
      headerName: "Min Stock",
      width: 150,
      renderCell: (params) => `${params.value} ${params.row.unit}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === "low" ? "Low Stock" : "Good"}
          size="small"
          color={params.value === "low" ? "error" : "success"}
          icon={params.value === "low" ? <Warning /> : undefined}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
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
            onClick={() => handleDelete(params.row.id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const lowStockCount = items.filter((item) => item.status === "low").length;

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
                    Inventory Management 📦
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Track and manage mess inventory
                    {lowStockCount > 0 && (
                      <Chip
                        label={`${lowStockCount} Low Stock Items`}
                        size="small"
                        color="error"
                        sx={{ ml: 2 }}
                      />
                    )}
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
                  Add Item
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Inventory Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ModernTable columns={columns} rows={items} />
        </motion.div>

        {/* Add/Edit Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Item Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  fullWidth
                />
                <TextField
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                  fullWidth
                />
                <TextField
                  label="Unit"
                  select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  SelectProps={{ native: true }}
                  fullWidth
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="liters">Liters</option>
                  <option value="pieces">Pieces</option>
                  <option value="packets">Packets</option>
                </TextField>
                <TextField
                  label="Minimum Stock Level"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData({ ...formData, minStock: e.target.value })
                  }
                  required
                  fullWidth
                  helperText="Alert when stock falls below this level"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingItem ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </ModernLayout>
  );
};

export default Inventory;
