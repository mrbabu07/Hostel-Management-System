import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import {
  Restaurant,
  Notifications,
  Receipt,
  Report,
  TrendingUp,
  People,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import { useAuth } from "../../context/AuthContext";
import { menuService } from "../../services/menu.service";
import { noticesService } from "../../services/notices.service";
import { billingService } from "../../services/billing.service";
import { complaintsService } from "../../services/complaints.service";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [todayMenu, setTodayMenu] = useState(null);
  const [notices, setNotices] = useState([]);
  const [bills, setBills] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch today's menu
      const menuRes = await menuService.getTodayMenu();
      setTodayMenu(menuRes.data.menu);

      // Fetch latest notices
      const noticesRes = await noticesService.getAll();
      setNotices(noticesRes.data.notices?.slice(0, 3) || []);

      // Role-specific data
      if (user.role === "student") {
        try {
          const billRes = await billingService.getAllBills();
          setBills(billRes.data.bills?.slice(0, 2) || []);
        } catch (error) {
          console.log("No bills found");
          setBills([]);
        }
      } else if (user.role === "admin" || user.role === "manager") {
        const complaintsRes = await complaintsService.getAll();
        const pending =
          complaintsRes.data.complaints
            ?.filter((c) => c.status === "pending")
            .slice(0, 3) || [];
        setComplaints(pending);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = {
    student: [
      {
        label: "View Menu",
        icon: <Restaurant />,
        path: "/student/menu",
        color: "#667eea",
      },
      {
        label: "Confirm Meals",
        icon: <CheckCircle />,
        path: "/student/meal-confirm",
        color: "#10b981",
      },
      {
        label: "My Bills",
        icon: <Receipt />,
        path: "/student/bill",
        color: "#f59e0b",
      },
      {
        label: "Complaints",
        icon: <Report />,
        path: "/student/complaints",
        color: "#ef4444",
      },
    ],
    manager: [
      {
        label: "Manage Menu",
        icon: <Restaurant />,
        path: "/manager/menu",
        color: "#667eea",
      },
      {
        label: "Mark Attendance",
        icon: <CheckCircle />,
        path: "/manager/attendance",
        color: "#10b981",
      },
      {
        label: "Inventory",
        icon: <TrendingUp />,
        path: "/manager/inventory",
        color: "#f59e0b",
      },
      {
        label: "Reports",
        icon: <Report />,
        path: "/manager/reports",
        color: "#8b5cf6",
      },
    ],
    admin: [
      {
        label: "Manage Users",
        icon: <People />,
        path: "/admin/users",
        color: "#667eea",
      },
      {
        label: "Complaints",
        icon: <Report />,
        path: "/admin/complaints",
        color: "#ef4444",
      },
      {
        label: "Analytics",
        icon: <TrendingUp />,
        path: "/admin/analytics",
        color: "#10b981",
      },
      {
        label: "Settings",
        icon: <CheckCircle />,
        path: "/admin/settings",
        color: "#8b5cf6",
      },
    ],
  };

  const actions = quickActions[user.role] || quickActions.student;

  return (
    <AppShell>
      <Box>
        {/* Welcome Header */}
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
                Welcome back, {user.name}! 👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Here's what's happening today
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {actions.map((action, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        sx={{
                          cursor: "pointer",
                          height: "100%",
                          background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
                          color: "white",
                        }}
                        onClick={() => navigate(action.path)}
                      >
                        <CardContent sx={{ textAlign: "center", py: 3 }}>
                          <Box sx={{ fontSize: 40, mb: 1 }}>{action.icon}</Box>
                          <Typography variant="body1" fontWeight={600}>
                            {action.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* Today's Menu */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Restaurant sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" fontWeight={600}>
                      Today's Menu
                    </Typography>
                  </Box>
                  {todayMenu ? (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {new Date(todayMenu.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Breakfast
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {todayMenu.breakfast?.items
                            ?.map((item) => item.name)
                            .join(", ") || "Not available"}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{ mt: 1 }}
                        >
                          Lunch
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {todayMenu.lunch?.items
                            ?.map((item) => item.name)
                            .join(", ") || "Not available"}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{ mt: 1 }}
                        >
                          Dinner
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {todayMenu.dinner?.items
                            ?.map((item) => item.name)
                            .join(", ") || "Not available"}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => navigate(`/${user.role}/menu`)}
                      >
                        View Full Menu
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No menu available for today
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Latest Notices */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Notifications sx={{ mr: 1, color: "warning.main" }} />
                    <Typography variant="h6" fontWeight={600}>
                      Latest Notices
                    </Typography>
                  </Box>
                  {notices.length > 0 ? (
                    <List>
                      {notices.map((notice) => (
                        <ListItem
                          key={notice._id}
                          sx={{
                            bgcolor: "action.hover",
                            borderRadius: 2,
                            mb: 1,
                          }}
                        >
                          <ListItemText
                            primary={notice.title}
                            secondary={notice.content?.substring(0, 50) + "..."}
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No notices available
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/${user.role}/notices`)}
                  >
                    View All Notices
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Student: Due Bills */}
          {user.role === "student" && (
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Receipt sx={{ mr: 1, color: "error.main" }} />
                      <Typography variant="h6" fontWeight={600}>
                        Recent Bills
                      </Typography>
                    </Box>
                    {bills.length > 0 ? (
                      <List>
                        {bills.map((bill) => (
                          <ListItem
                            key={bill._id}
                            sx={{
                              bgcolor: "action.hover",
                              borderRadius: 2,
                              mb: 1,
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <ListItemText
                              primary={`Month: ${new Date(bill.month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
                              secondary={`Amount: ₹${bill.totalAmount}`}
                            />
                            <Chip
                              label={bill.status}
                              size="small"
                              color={
                                bill.status === "paid" ? "success" : "warning"
                              }
                              sx={{ textTransform: "capitalize" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No bills available
                      </Typography>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate("/student/bill")}
                    >
                      View All Bills
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}

          {/* Admin/Manager: Pending Complaints */}
          {(user.role === "admin" || user.role === "manager") && (
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Warning sx={{ mr: 1, color: "error.main" }} />
                      <Typography variant="h6" fontWeight={600}>
                        Pending Complaints
                      </Typography>
                    </Box>
                    {complaints.length > 0 ? (
                      <List>
                        {complaints.map((complaint) => (
                          <ListItem
                            key={complaint._id}
                            sx={{
                              bgcolor: "action.hover",
                              borderRadius: 2,
                              mb: 1,
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: "error.main" }}>
                                <Report />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={complaint.title}
                              secondary={
                                complaint.description?.substring(0, 40) + "..."
                              }
                              primaryTypographyProps={{ fontWeight: 600 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No pending complaints
                      </Typography>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => navigate(`/${user.role}/complaints`)}
                    >
                      View All Complaints
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}
        </Grid>
      </Box>
    </AppShell>
  );
};

export default Home;
