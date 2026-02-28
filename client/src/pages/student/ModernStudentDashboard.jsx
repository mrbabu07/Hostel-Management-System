import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CardMedia,
  Skeleton,
} from "@mui/material";
import {
  Restaurant,
  Receipt,
  Report,
  CalendarToday,
  TrendingUp,
  ChatBubble,
  CheckCircle,
  AccessTime,
  Payment,
  EventAvailable,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ModernLayout from "../../components/layout/ModernLayout";
import StatsCard from "../../components/common/StatsCard";
import { menuService } from "../../services/menu.service";
import { billingService } from "../../services/billing.service";
import { attendanceService } from "../../services/attendance.service";
import { imageService } from "../../services/image.service";
import { toISODate } from "../../utils/formatDate";
import toast from "react-hot-toast";

const ModernStudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    mealsThisMonth: 0,
    currentBill: 0,
    pendingBills: 0,
    attendanceCount: 0,
  });
  const [todayMenu, setTodayMenu] = useState([]);
  const [mealImages, setMealImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch today's menu
      const menuResponse = await menuService.getMenus(toISODate(new Date()));
      const menus = menuResponse.data.menus || [];
      setTodayMenu(menus);

      // Fetch images for menus
      menus.forEach(async (menu) => {
        if (menu.imageUrl) {
          setMealImages((prev) => ({ ...prev, [menu._id]: menu.imageUrl }));
        } else if (menu.items && menu.items.length > 0) {
          const imageUrl = await imageService.fetchMealImage(menu.items[0].name);
          setMealImages((prev) => ({ ...prev, [menu._id]: imageUrl }));
        }
      });

      // Fetch bills
      const billsResponse = await billingService.getAllBills();
      const bills = billsResponse.data.bills || [];
      const pendingBills = bills.filter((b) => b.status === "pending");
      const currentBill = pendingBills[0]?.totalAmount || 0;

      // Fetch attendance
      const attendanceResponse = await attendanceService.getMyAttendance();
      const attendance = attendanceResponse.data.attendance || [];
      const thisMonth = attendance.filter((a) => {
        const date = new Date(a.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      });

      setStats({
        mealsThisMonth: thisMonth.length,
        currentBill: currentBill,
        pendingBills: pendingBills.length,
        attendanceCount: thisMonth.filter((a) => a.approved).length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Mark Attendance",
      icon: <EventAvailable />,
      color: "success",
      path: "/student/attendance",
    },
    {
      title: "Pay Bills",
      icon: <Payment />,
      color: "warning",
      path: "/student/bill",
    },
    {
      title: "View Menu",
      icon: <Restaurant />,
      color: "primary",
      path: "/student/menu",
    },
    {
      title: "Submit Complaint",
      icon: <Report />,
      color: "error",
      path: "/student/complaints",
    },
  ];

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
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
                Welcome back, {user?.name}! 👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Attendance This Month"
              value={stats.attendanceCount}
              icon={CheckCircle}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Current Bill"
              value={stats.currentBill}
              icon={Receipt}
              color="warning"
              prefix="₹"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Pending Bills"
              value={stats.pendingBills}
              icon={Payment}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Meals"
              value={stats.mealsThisMonth}
              icon={Restaurant}
              color="primary"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Today's Menu */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Today's Menu
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate("/student/menu")}
                    >
                      View Full Menu
                    </Button>
                  </Box>
                  {loading ? (
                    <Grid container spacing={2}>
                      {[1, 2, 3].map((i) => (
                        <Grid item xs={12} sm={4} key={i}>
                          <Skeleton variant="rectangular" height={150} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : todayMenu.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Restaurant sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                      <Typography color="text.secondary">
                        No menu available for today
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {todayMenu.map((menu) => (
                        <Grid item xs={12} sm={4} key={menu._id}>
                          <Card
                            sx={{
                              cursor: "pointer",
                              transition: "all 0.3s",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 4,
                              },
                            }}
                            onClick={() => navigate("/student/menu")}
                          >
                            {mealImages[menu._id] && (
                              <CardMedia
                                component="img"
                                height="120"
                                image={mealImages[menu._id]}
                                alt={menu.mealType}
                                sx={{ objectFit: "cover" }}
                              />
                            )}
                            <CardContent>
                              <Chip
                                label={menu.mealType}
                                size="small"
                                sx={{
                                  bgcolor: `${getMealColor(menu.mealType)}20`,
                                  color: getMealColor(menu.mealType),
                                  fontWeight: 600,
                                  textTransform: "capitalize",
                                  mb: 1,
                                }}
                              />
                              <Typography variant="body2">
                                {menu.items?.slice(0, 2).map((item) => item.name || item).join(", ")}
                                {menu.items?.length > 2 && "..."}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={2}>
                    {quickActions.map((action, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={action.icon}
                            color={action.color}
                            onClick={() => navigate(action.path)}
                            sx={{
                              py: 1.5,
                              justifyContent: "flex-start",
                              borderRadius: 2,
                            }}
                          >
                            {action.title}
                          </Button>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Pending Bills & Info */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Pending Bills Card */}
              {stats.pendingBills > 0 && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: "warning.main" }}>
                        <Payment />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          Pending Payment
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stats.pendingBills} bill(s) pending
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "warning.lighter",
                        borderRadius: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="h4" fontWeight={700} color="warning.main">
                        ₹{stats.currentBill}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Current month bill
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      color="warning"
                      startIcon={<Payment />}
                      onClick={() => navigate("/student/bill")}
                    >
                      Pay Now
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Attendance Card */}
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: "success.main" }}>
                      <CheckCircle />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Attendance
                        </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This month
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "success.lighter",
                      borderRadius: 2,
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4" fontWeight={700} color="success.main">
                      {stats.attendanceCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Approved meals
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<EventAvailable />}
                    onClick={() => navigate("/student/attendance")}
                  >
                    Mark Attendance
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </ModernLayout>
  );
};

export default ModernStudentDashboard;
