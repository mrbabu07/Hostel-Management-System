import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Stack,
  IconButton,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  AttachMoney,
  Schedule,
  CalendarMonth,
  Restaurant,
  Delete,
  Save,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ModernLayout from "../../components/layout/ModernLayout";

const Settings = () => {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    breakfastPrice: 30,
    lunchPrice: 50,
    dinnerPrice: 40,
    cutoffTime: "20:00",
    cutoffDaysBefore: 1,
    extraCharges: 0,
    discountPercentage: 0,
    taxPercentage: 0,
    messName: "Hostel Mess",
    messAddress: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({ date: "", reason: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  const handleAddHoliday = () => {
    if (newHoliday.date && newHoliday.reason) {
      setHolidays([...holidays, { ...newHoliday, id: Date.now() }]);
      setNewHoliday({ date: "", reason: "" });
    }
  };

  const handleRemoveHoliday = (id) => {
    setHolidays(holidays.filter((h) => h.id !== id));
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
                    System Settings ⚙️
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Configure system-wide settings and preferences
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        <Grid container spacing={3}>
          {/* Meal Pricing */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "success.light",
                        p: 1.5,
                        borderRadius: 2,
                        display: "flex",
                      }}
                    >
                      <AttachMoney sx={{ color: "success.dark" }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Meal Pricing
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Set prices for each meal type
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Breakfast Price (₹)"
                        type="number"
                        name="breakfastPrice"
                        value={formData.breakfastPrice}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Lunch Price (₹)"
                        type="number"
                        name="lunchPrice"
                        value={formData.lunchPrice}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Dinner Price (₹)"
                        type="number"
                        name="dinnerPrice"
                        value={formData.dinnerPrice}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Meal Confirmation */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "info.light",
                        p: 1.5,
                        borderRadius: 2,
                        display: "flex",
                      }}
                    >
                      <Schedule sx={{ color: "info.dark" }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Meal Confirmation
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Configure cutoff time
                      </Typography>
                    </Box>
                  </Box>
                  <Stack spacing={2}>
                    <TextField
                      label="Cutoff Time"
                      type="time"
                      name="cutoffTime"
                      value={formData.cutoffTime}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Days Before"
                      type="number"
                      name="cutoffDaysBefore"
                      value={formData.cutoffDaysBefore}
                      onChange={handleChange}
                      fullWidth
                    />
                    <Typography variant="caption" color="text.secondary">
                      Students must confirm meals {formData.cutoffDaysBefore}{" "}
                      day(s) before by {formData.cutoffTime}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Billing Settings */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "warning.light",
                        p: 1.5,
                        borderRadius: 2,
                        display: "flex",
                      }}
                    >
                      <AttachMoney sx={{ color: "warning.dark" }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Billing Settings
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Extra charges and discounts
                      </Typography>
                    </Box>
                  </Box>
                  <Stack spacing={2}>
                    <TextField
                      label="Extra Charges (₹)"
                      type="number"
                      name="extraCharges"
                      value={formData.extraCharges}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Discount (%)"
                      type="number"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Tax (%)"
                      type="number"
                      name="taxPercentage"
                      value={formData.taxPercentage}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Mess Information */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "primary.light",
                        p: 1.5,
                        borderRadius: 2,
                        display: "flex",
                      }}
                    >
                      <Restaurant sx={{ color: "primary.dark" }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Mess Information
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Basic information about the mess
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Mess Name"
                        name="messName"
                        value={formData.messName}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Contact Email"
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Contact Phone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Address"
                        name="messAddress"
                        value={formData.messAddress}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Holidays */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "error.light",
                        p: 1.5,
                        borderRadius: 2,
                        display: "flex",
                      }}
                    >
                      <CalendarMonth sx={{ color: "error.dark" }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Holidays
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manage no-meal days
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={5}>
                      <TextField
                        label="Date"
                        type="date"
                        value={newHoliday.date}
                        onChange={(e) =>
                          setNewHoliday({ ...newHoliday, date: e.target.value })
                        }
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <TextField
                        label="Reason"
                        value={newHoliday.reason}
                        onChange={(e) =>
                          setNewHoliday({
                            ...newHoliday,
                            reason: e.target.value,
                          })
                        }
                        placeholder="e.g., National Holiday"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button
                        variant="contained"
                        onClick={handleAddHoliday}
                        fullWidth
                        sx={{ height: "56px" }}
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  {holidays.length > 0 ? (
                    <Stack spacing={1}>
                      {holidays.map((holiday) => (
                        <Box
                          key={holiday.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            bgcolor: "grey.50",
                            borderRadius: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {holiday.reason}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(holiday.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveHoliday(holiday.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No holidays configured yet
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </ModernLayout>
  );
};

export default Settings;
