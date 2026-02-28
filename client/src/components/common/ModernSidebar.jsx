import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  CreditCardIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';

const ModernSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = {
    student: [
      { name: 'Home', href: '/home', icon: HomeIcon },
      { name: 'Dashboard', href: '/student/dashboard', icon: ChartBarIcon },
      { name: 'Menu', href: '/student/menu', icon: CalendarIcon },
      { name: 'Attendance', href: '/student/attendance', icon: UsersIcon },
      { name: 'My Bills', href: '/student/bill', icon: CreditCardIcon },
      { name: 'Chat', href: '/student/chat', icon: ChatBubbleLeftIcon },
      { name: 'Complaints', href: '/student/complaints', icon: BellAlertIcon },
      { name: 'Notices', href: '/student/notices', icon: ClipboardDocumentListIcon },
      { name: 'Profile', href: '/student/profile', icon: Cog6ToothIcon },
    ],
    manager: [
      { name: 'Home', href: '/home', icon: HomeIcon },
      { name: 'Dashboard', href: '/manager/dashboard', icon: ChartBarIcon },
      { name: 'Menu Management', href: '/manager/menu', icon: CalendarIcon },
      { name: 'Attendance Approval', href: '/manager/attendance', icon: UsersIcon },
      { name: 'Chat', href: '/manager/chat', icon: ChatBubbleLeftIcon },
      { name: 'Feedback', href: '/manager/feedback', icon: BellAlertIcon },
      { name: 'Reports', href: '/manager/reports', icon: ClipboardDocumentListIcon },
      { name: 'Inventory', href: '/manager/inventory', icon: Cog6ToothIcon },
    ],
    admin: [
      { name: 'Home', href: '/home', icon: HomeIcon },
      { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
      { name: 'Users Management', href: '/admin/users', icon: UsersIcon },
      { name: 'Billing', href: '/admin/billing', icon: CreditCardIcon },
      { name: 'Chat', href: '/admin/chat', icon: ChatBubbleLeftIcon },
      { name: 'Complaints', href: '/admin/complaints', icon: BellAlertIcon },
      { name: 'Notices', href: '/admin/notices', icon: ClipboardDocumentListIcon },
      { name: 'Analytics', href: '/admin/analytics', icon: CalendarIcon },
      { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
    ],
  };

  const currentNav = navigation[user?.role] || [];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Hostel MS
                </h1>
                <p className="text-xs text-secondary-500 capitalize">{user?.role} Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {currentNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose()}
                  className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-secondary-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? '' : 'group-hover:scale-110'
                    }`}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900/50">
            <div className="flex items-center gap-3 p-3 mb-3 rounded-xl bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/30">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success-500 border-2 border-white dark:border-secondary-800 rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-secondary-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-xl transition-all duration-200 group"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-secondary-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default ModernSidebar;
