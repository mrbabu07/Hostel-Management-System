import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarDaysIcon,
  ClockIcon,
  BellAlertIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { menuService } from '../../services/menu.service';
import { attendanceService } from '../../services/attendance.service';
import { billingService } from '../../services/billing.service';
import { noticesService } from '../../services/notices.service';
import { toISODate } from '../../utils/formatDate';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [liveStats, setLiveStats] = useState({
    studentsPresent: 0,
    mealsServed: 0,
    pendingPayments: 0,
  });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDynamicData();
  }, []);

  const fetchDynamicData = async () => {
    try {
      setLoading(true);
      const today = toISODate(new Date());

      // Fetch today's menu
      const menuRes = await menuService.getMenus(today);
      const menus = menuRes.data.menus || [];
      
      // Transform menu data
      const mealsData = menus.map((menu) => ({
        type: menu.mealType.charAt(0).toUpperCase() + menu.mealType.slice(1),
        time: getMealTime(menu.mealType),
        menu: menu.items.map(item => item.name || item),
        icon: getMealIcon(menu.mealType),
        status: getMealStatus(menu.mealType),
        color: getMealColor(menu.mealType),
      }));
      setTodaysMeals(mealsData);

      // Fetch attendance stats (if user is logged in)
      if (user) {
        try {
          const attendanceRes = await attendanceService.getAllAttendance();
          const todayAttendance = (attendanceRes.data.attendance || []).filter(
            (a) => toISODate(new Date(a.date)) === today && a.approved
          );
          
          // Count unique students
          const uniqueStudents = new Set(todayAttendance.map(a => a.userId?._id || a.userId));
          
          setLiveStats(prev => ({
            ...prev,
            studentsPresent: uniqueStudents.size,
            mealsServed: todayAttendance.length,
          }));
        } catch (error) {
          console.log('Attendance data not available');
        }

        // Fetch billing stats
        try {
          const billsRes = await billingService.getAllBills();
          const pendingBills = (billsRes.data.bills || []).filter(b => b.status === 'pending');
          setLiveStats(prev => ({
            ...prev,
            pendingPayments: pendingBills.length,
          }));
        } catch (error) {
          console.log('Billing data not available');
        }

        // Fetch notices
        try {
          const noticesRes = await noticesService.getAllNotices();
          const recentNotices = (noticesRes.data.notices || [])
            .slice(0, 3)
            .map(notice => ({
              title: notice.title,
              message: notice.content,
              time: getTimeAgo(notice.createdAt),
              priority: notice.priority || 'normal',
            }));
          setNotices(recentNotices);
        } catch (error) {
          console.log('Notices not available');
        }
      }
    } catch (error) {
      console.error('Error fetching dynamic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMealTime = (mealType) => {
    const times = {
      breakfast: '7:00 AM - 9:00 AM',
      lunch: '12:00 PM - 2:00 PM',
      dinner: '7:00 PM - 9:00 PM',
    };
    return times[mealType] || '';
  };

  const getMealIcon = (mealType) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
    };
    return icons[mealType] || '🍽️';
  };

  const getMealStatus = (mealType) => {
    const now = new Date();
    const hour = now.getHours();
    
    const timeRanges = {
      breakfast: { start: 7, end: 9 },
      lunch: { start: 12, end: 14 },
      dinner: { start: 19, end: 21 },
    };
    
    const range = timeRanges[mealType];
    if (hour >= range.start && hour < range.end) {
      return 'Serving Now';
    } else if (hour < range.start) {
      return 'Upcoming';
    } else {
      return 'Completed';
    }
  };

  const getMealColor = (mealType) => {
    const colors = {
      breakfast: 'from-amber-500 to-orange-600',
      lunch: 'from-emerald-500 to-teal-600',
      dinner: 'from-indigo-500 to-purple-600',
    };
    return colors[mealType] || 'from-secondary-500 to-secondary-600';
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const upcomingEvents = [
    {
      title: 'Monthly Bill Payment Due',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Payment',
      icon: CurrencyDollarIcon,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10',
    },
    {
      title: 'Hostel Meeting',
      date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Event',
      icon: UserGroupIcon,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',
    },
    {
      title: 'Menu Change - Special Dinner',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Announcement',
      icon: CalendarDaysIcon,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10',
    },
  ];

  const statsData = [
    { label: 'Students Present', value: liveStats.studentsPresent.toString(), change: 'Today', icon: UserGroupIcon },
    { label: 'Meals Served Today', value: liveStats.mealsServed.toString(), change: 'All meals', icon: CheckCircleIcon },
    { label: 'Pending Payments', value: liveStats.pendingPayments.toString(), change: 'This month', icon: CurrencyDollarIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-violet-50/30 to-purple-50/30 dark:from-secondary-900 dark:via-violet-950/30 dark:to-purple-950/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 dark:bg-secondary-800/60 backdrop-blur-2xl border-b border-secondary-200/50 dark:border-secondary-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-premium animate-pulse-glow">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold gradient-text">
                Hostel MS
              </span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <button
                  onClick={() => navigate(`/${user.role}/dashboard`)}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-premium-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2.5 text-secondary-700 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-2.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-premium-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Live Info */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Current Time & Date */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50/80 dark:bg-purple-500/20 backdrop-blur-lg rounded-full mb-4 border border-purple-200/50 dark:border-purple-500/30 shadow-lg">
              <ClockIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                Live Dashboard
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 dark:text-white mb-2 animate-float">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h1>
            <p className="text-2xl text-secondary-600 dark:text-secondary-400">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card p-6 animate-pulse">
                    <div className="h-12 w-12 bg-secondary-200 dark:bg-secondary-700 rounded-xl mb-4" />
                    <div className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded mb-2" />
                    <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded" />
                  </div>
                ))}
              </>
            ) : (
              statsData.map((stat, index) => (
                <div
                  key={index}
                  className="glass-card p-6 hover-lift hover-glow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-premium animate-gradient">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1.5 bg-success-50/80 dark:bg-success-500/20 backdrop-blur-lg text-success-600 dark:text-success-400 text-xs font-semibold rounded-full border border-success-200/50 dark:border-success-500/30 shadow-sm">
                      Live
                    </span>
                  </div>
                  <p className="text-3xl font-bold gradient-text mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-xs text-secondary-500">{stat.change}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Today's Meals */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-secondary-800/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold gradient-text mb-2">
                Today's Menu
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                Fresh meals prepared daily
              </p>
            </div>
            <CalendarDaysIcon className="w-8 h-8 text-purple-600 animate-float" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl bg-secondary-200 dark:bg-secondary-700 p-6 animate-pulse h-64" />
                ))}
              </>
            ) : todaysMeals.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <div className="text-6xl mb-4 animate-float">🍽️</div>
                <p className="text-secondary-600 dark:text-secondary-400 text-lg">
                  No menu available for today
                </p>
                <p className="text-secondary-500 text-sm mt-2">
                  Check back later or contact the mess manager
                </p>
              </div>
            ) : (
              todaysMeals.map((meal, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${meal.color} p-6 text-white shadow-premium-lg hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-gradient`}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-5xl animate-float">{meal.icon}</span>
                    <span className="px-3 py-1 bg-white/30 backdrop-blur-md rounded-full text-xs font-semibold shadow-lg">
                      {meal.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{meal.type}</h3>
                  <p className="text-sm opacity-90 mb-4">{meal.time}</p>
                  <div className="space-y-1">
                    {meal.menu.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                    {meal.menu.length > 4 && (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
                        <span className="text-sm">+{meal.menu.length - 4} more</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events & Notices */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Events */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <CalendarDaysIcon className="w-7 h-7 text-purple-600" />
                <h2 className="text-2xl font-bold gradient-text">
                  Upcoming Events
                </h2>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="glass-card p-5 hover-lift hover-glow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${event.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <event.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900 dark:text-white mb-1">
                          {event.title}
                        </h3>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {event.date}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-secondary-100/80 dark:bg-secondary-700/80 backdrop-blur-lg text-secondary-700 dark:text-secondary-300 text-xs font-semibold rounded-full shadow-sm">
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notices */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <BellAlertIcon className="w-7 h-7 text-purple-600" />
                <h2 className="text-2xl font-bold gradient-text">
                  Important Notices
                </h2>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="glass-card p-5 animate-pulse">
                        <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded mb-2" />
                        <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded" />
                      </div>
                    ))}
                  </>
                ) : notices.length === 0 ? (
                  <div className="glass-card p-8 text-center">
                    <BellAlertIcon className="w-16 h-16 mx-auto text-secondary-300 dark:text-secondary-600 mb-4 animate-float" />
                    <p className="text-secondary-600 dark:text-secondary-400">
                      No notices available
                    </p>
                  </div>
                ) : (
                  notices.map((notice, index) => (
                    <div
                      key={index}
                      className={`glass-card p-5 border-l-4 ${
                        notice.priority === 'high'
                          ? 'border-rose-500 hover:shadow-rose-500/30'
                          : 'border-purple-500 hover:shadow-purple-500/30'
                      } hover-lift hover:shadow-xl transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-secondary-900 dark:text-white">
                          {notice.title}
                        </h3>
                        {notice.priority === 'high' && (
                          <span className="px-2 py-1 bg-rose-50/80 dark:bg-rose-500/20 backdrop-blur-lg text-rose-600 dark:text-rose-400 text-xs font-semibold rounded border border-rose-200/50 dark:border-rose-500/30 shadow-sm">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                        {notice.message}
                      </p>
                      <p className="text-xs text-secondary-500">{notice.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-3xl p-12 shadow-premium-lg text-center animate-gradient" style={{ backgroundSize: '200% 200%' }}>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="relative z-10">
              <SparklesIcon className="w-16 h-16 text-white mx-auto mb-6 animate-float" />
              <h2 className="text-4xl font-bold text-white mb-4">
                Join Our Hostel Community
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Experience seamless hostel management with real-time updates
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white/90 backdrop-blur-lg text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 hover:bg-white"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-secondary-200/50 dark:border-secondary-700/50 bg-white/40 dark:bg-secondary-800/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-secondary-600 dark:text-secondary-400">
            © 2024 Hostel Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
