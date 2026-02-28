import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ModernLayout from '../../components/layout/ModernLayout';
import {
  CalendarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { menuService } from '../../services/menu.service';
import { billingService } from '../../services/billing.service';
import { attendanceService } from '../../services/attendance.service';
import { toISODate } from '../../utils/formatDate';

const ModernStudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    attendanceCount: 0,
    currentBill: 0,
    pendingBills: 0,
    mealsThisMonth: 0,
  });
  const [todayMenu, setTodayMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = toISODate(new Date());
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const [menuRes, billsRes, attendanceRes] = await Promise.all([
        menuService.getMenus(today),
        billingService.getAllBills(),
        attendanceService.getMyAttendance(),
      ]);

      setTodayMenu(menuRes.data.menus || []);
      
      const bills = billsRes.data.bills || [];
      const pendingBills = bills.filter((b) => b.status === 'pending');
      const currentMonthBill = bills.find(
        (b) => b.month === currentMonth + 1 && b.year === currentYear
      );
      
      const attendance = attendanceRes.data.attendance || [];
      const thisMonth = attendance.filter((a) => {
        const date = new Date(a.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const approvedAttendance = thisMonth.filter((a) => a.approved);

      setStats({
        attendanceCount: approvedAttendance.length,
        currentBill: currentMonthBill?.totalAmount || 0,
        pendingBills: pendingBills.length,
        mealsThisMonth: approvedAttendance.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      name: 'Attendance',
      value: stats.attendanceCount,
      change: `${stats.mealsThisMonth} meals`,
      changeType: 'positive',
      icon: CheckCircleIcon,
      color: 'success',
    },
    {
      name: 'Current Bill',
      value: `₹${stats.currentBill}`,
      change: stats.currentBill > 0 ? 'Pay now' : 'No pending bill',
      changeType: stats.currentBill > 0 ? 'warning' : 'neutral',
      icon: BanknotesIcon,
      color: 'warning',
    },
    {
      name: 'Pending Bills',
      value: stats.pendingBills,
      change: stats.pendingBills > 0 ? 'Action required' : 'All clear',
      changeType: stats.pendingBills > 0 ? 'warning' : 'positive',
      icon: CreditCardIcon,
      color: 'danger',
    },
    {
      name: 'Total Meals',
      value: stats.mealsThisMonth,
      change: 'This month',
      changeType: 'neutral',
      icon: CalendarIcon,
      color: 'primary',
    },
  ];

  const getMealIcon = (mealType) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
    };
    return icons[mealType] || '🍽️';
  };

  const getMealColor = (mealType) => {
    const colors = {
      breakfast: 'from-warning-500 to-warning-600',
      lunch: 'from-success-500 to-success-600',
      dinner: 'from-primary-500 to-primary-600',
    };
    return colors[mealType] || 'from-secondary-500 to-secondary-600';
  };

  if (loading) {
    return (
      <ModernLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => (
          <div
            key={stat.name}
            className="card p-6 hover:shadow-card-hover transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                  stat.color === 'success'
                    ? 'from-success-500 to-success-600'
                    : stat.color === 'warning'
                    ? 'from-warning-500 to-warning-600'
                    : stat.color === 'danger'
                    ? 'from-danger-500 to-danger-600'
                    : 'from-primary-500 to-primary-600'
                } flex items-center justify-center text-white shadow-lg`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                {stat.name}
              </p>
              <p
                className={`text-xs mt-2 ${
                  stat.changeType === 'positive'
                    ? 'text-success-600'
                    : stat.changeType === 'warning'
                    ? 'text-warning-600'
                    : 'text-secondary-500'
                }`}
              >
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Menu */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6 border-b border-secondary-100 dark:border-secondary-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Today's Menu
                </h2>
                <button
                  onClick={() => navigate('/student/menu')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
              {todayMenu.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 mx-auto text-secondary-300 dark:text-secondary-600 mb-4" />
                  <p className="text-secondary-600 dark:text-secondary-400">
                    No menu available for today
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {todayMenu.map((menu) => (
                    <div
                      key={menu._id}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br p-6 text-white cursor-pointer hover:scale-105 transition-transform"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${
                          menu.mealType === 'breakfast'
                            ? '#F59E0B, #D97706'
                            : menu.mealType === 'lunch'
                            ? '#10B981, #059669'
                            : '#3B82F6, #2563EB'
                        })`,
                      }}
                    >
                      <div className="text-4xl mb-3">{getMealIcon(menu.mealType)}</div>
                      <h3 className="text-lg font-semibold capitalize mb-2">
                        {menu.mealType}
                      </h3>
                      <p className="text-sm opacity-90">
                        {menu.items?.slice(0, 2).map((item) => item.name || item).join(', ')}
                        {menu.items?.length > 2 && '...'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Pending Payment */}
        <div className="space-y-6">
          {/* Pending Payment */}
          {stats.pendingBills > 0 && (
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-br from-warning-500 to-warning-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <CreditCardIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Pending Payment</p>
                    <p className="text-2xl font-bold">₹{stats.currentBill}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/student/bill')}
                  className="w-full bg-white text-warning-600 py-2.5 rounded-lg font-medium hover:bg-warning-50 transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/student/attendance')}
                className="w-full btn-secondary justify-start"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Mark Attendance
              </button>
              <button
                onClick={() => navigate('/student/menu')}
                className="w-full btn-secondary justify-start"
              >
                <CalendarIcon className="w-5 h-5" />
                View Menu
              </button>
              <button
                onClick={() => navigate('/student/complaints')}
                className="w-full btn-secondary justify-start"
              >
                <ClockIcon className="w-5 h-5" />
                Submit Complaint
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

export default ModernStudentDashboard;
