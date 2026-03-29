import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ModernLayout from "../../components/layout/ModernLayout";
import {
  UsersIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { usersService } from "../../services/users.service";
import { billingService } from "../../services/billing.service";
import { complaintsService } from "../../services/complaints.service";
import { attendanceService } from "../../services/attendance.service";

const ModernAdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    monthlyRevenue: 0,
    activeComplaints: 0,
    resolvedComplaints: 0,
    attendanceRate: 0,
    satisfactionRate: 87,
  });
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users (admin only)
      try {
        const usersRes = await usersService.getAllUsers();
        const users = usersRes.data.users || usersRes.data || [];
        setStats(prev => ({ ...prev, totalUsers: users.length }));
        setRecentUsers(users.slice(0, 4).map(u => ({
          name: u.name,
          email: u.email,
          role: u.role,
          status: 'Active',
        })));
      } catch (error) {
        console.log('Users data not available');
      }

      // Fetch billing data
      try {
        const billsRes = await billingService.getAllBills();
        const bills = billsRes.data.bills || [];
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const monthlyBills = bills.filter(b => b.month === currentMonth && b.year === currentYear);
        const revenue = monthlyBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
        setStats(prev => ({ ...prev, monthlyRevenue: revenue }));
      } catch (error) {
        console.log('Billing data not available');
      }

      // Fetch complaints
      try {
        const complaintsRes = await complaintsService.getAllComplaints();
        const complaints = complaintsRes.data || [];
        const active = complaints.filter(c => c.status === 'pending' || c.status === 'in-progress').length;
        const resolved = complaints.filter(c => c.status === 'resolved').length;
        setStats(prev => ({ 
          ...prev, 
          activeComplaints: active,
          resolvedComplaints: resolved 
        }));
      } catch (error) {
        console.log('Complaints data not available');
      }

      // Fetch attendance
      try {
        const attendanceRes = await attendanceService.getAllAttendance();
        const attendance = attendanceRes.data.attendance || [];
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendance.filter(a => 
          a.date.startsWith(today) && a.approved
        );
        const totalStudents = stats.totalUsers || 100;
        const rate = totalStudents > 0 ? Math.round((todayAttendance.length / totalStudents) * 100) : 0;
        setStats(prev => ({ ...prev, attendanceRate: rate }));
      } catch (error) {
        console.log('Attendance data not available');
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: UsersIcon,
      color: "from-blue-500 to-blue-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Monthly Revenue",
      value: `৳${stats.monthlyRevenue.toLocaleString()}`,
      icon: CreditCardIcon,
      color: "from-emerald-500 to-teal-600",
      trend: "+4.2%",
      trendUp: true,
    },
    {
      title: "Active Complaints",
      value: stats.activeComplaints,
      icon: ExclamationTriangleIcon,
      color: "from-rose-500 to-red-600",
      trend: "",
      trendUp: false,
    },
    {
      title: "Resolved",
      value: stats.resolvedComplaints,
      icon: CheckCircleIcon,
      color: "from-emerald-500 to-green-600",
      trend: "",
      trendUp: true,
    },
    {
      title: "Attendance",
      value: `${stats.attendanceRate}%`,
      icon: ChartBarIcon,
      color: "from-violet-500 to-purple-600",
      trend: "",
      trendUp: true,
    },
    {
      title: "Satisfaction",
      value: `${stats.satisfactionRate}%`,
      icon: ArrowTrendingUpIcon,
      color: "from-amber-500 to-orange-600",
      trend: "",
      trendUp: true,
    },
  ];

  const recentUsersData = recentUsers.length > 0 ? recentUsers : [
    {
      name: "John Doe",
      email: "john@example.com",
      role: "Student",
      status: "Active",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Student",
      status: "Active",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Manager",
      status: "Active",
    },
    {
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "Student",
      status: "Inactive",
    },
  ];

  const systemHealth = [
    { metric: "Server Uptime", value: 99.9, status: "excellent" },
    { metric: "Database Performance", value: 95, status: "good" },
    { metric: "API Response Time", value: 88, status: "good" },
    { metric: "Storage Usage", value: 65, status: "warning" },
  ];

  if (loading) {
    return (
      <ModernLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-premium-lg animate-gradient" style={{ backgroundSize: '200% 200%' }}>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard 👨‍💼</h1>
            <p className="text-purple-100 text-lg">
              Welcome back, {user?.name}! Here's your system overview.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="glass-card p-6 hover-lift hover-glow cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-premium mb-4 animate-gradient`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold gradient-text mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">
                {stat.title}
              </p>
              {stat.trend && (
                <p className={`text-xs mt-2 font-semibold ${stat.trendUp ? 'text-success-600' : 'text-danger-600'}`}>
                  {stat.trend}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass-card">
              <div className="p-6 border-b border-secondary-100/50 dark:border-secondary-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold gradient-text">
                    Recent Users
                  </h2>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-all duration-300 hover:scale-105">
                    View All →
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {recentUsersData.map((userData, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/60 dark:bg-secondary-700/60 backdrop-blur-lg border border-secondary-200/50 dark:border-secondary-600/50 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {userData.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-secondary-900 dark:text-white truncate">
                          {userData.name}
                        </p>
                        <p className="text-xs text-secondary-500 truncate">
                          {userData.email}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userData.role === 'Manager' 
                          ? 'bg-blue-50/80 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/30'
                          : 'bg-secondary-100/80 dark:bg-secondary-700/80 text-secondary-600 dark:text-secondary-400 border border-secondary-200/50 dark:border-secondary-600/50'
                      } backdrop-blur-lg shadow-sm`}>
                        {userData.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userData.status === 'Active'
                          ? 'bg-success-50/80 dark:bg-success-500/20 text-success-600 dark:text-success-400 border border-success-200/50 dark:border-success-500/30'
                          : 'bg-secondary-100/80 dark:bg-secondary-700/80 text-secondary-600 dark:text-secondary-400 border border-secondary-200/50 dark:border-secondary-600/50'
                      } backdrop-blur-lg shadow-sm`}>
                        {userData.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* System Health */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold gradient-text mb-6">
                System Health
              </h2>
              <div className="space-y-4">
                {systemHealth.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        {item.metric}
                      </p>
                      <p className="text-sm font-bold text-primary-600">
                        {item.value}%
                      </p>
                    </div>
                    <div className="h-2 bg-secondary-200/50 dark:bg-secondary-700/50 rounded-full overflow-hidden backdrop-blur-lg">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          item.status === 'excellent'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-glow'
                            : item.status === 'good'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            : 'bg-gradient-to-r from-amber-500 to-orange-600'
                        }`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 btn-secondary">
                View Details
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default ModernAdminDashboard;
