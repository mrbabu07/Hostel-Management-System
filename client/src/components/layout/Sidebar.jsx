import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { X } from "lucide-react";
import {
  Home,
  Menu,
  Calendar,
  ClipboardList,
  DollarSign,
  MessageSquare,
  Bell,
  Star,
  Users,
  BarChart,
} from "lucide-react";

const Sidebar = ({ variant = "desktop", onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const studentLinks = [
    { path: "/student", icon: Home, label: "Dashboard" },
    { path: "/student/menu", icon: Menu, label: "Menu" },
    { path: "/student/meal-confirm", icon: Calendar, label: "Meal Plan" },
    { path: "/student/attendance", icon: ClipboardList, label: "Attendance" },
    { path: "/student/bill", icon: DollarSign, label: "My Bill" },
    { path: "/student/complaints", icon: MessageSquare, label: "Complaints" },
    { path: "/student/notices", icon: Bell, label: "Notices" },
    { path: "/student/feedback", icon: Star, label: "Feedback" },
  ];

  const managerLinks = [
    { path: "/manager", icon: Home, label: "Dashboard" },
    { path: "/manager/menu", icon: Menu, label: "Manage Menu" },
    {
      path: "/manager/attendance",
      icon: ClipboardList,
      label: "Mark Attendance",
    },
    { path: "/manager/attendance-report", icon: BarChart, label: "Reports" },
    { path: "/manager/feedback", icon: Star, label: "Feedback Summary" },
  ];

  const adminLinks = [
    { path: "/admin", icon: Home, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Manage Users" },
    { path: "/admin/complaints", icon: MessageSquare, label: "Complaints" },
    { path: "/admin/notices", icon: Bell, label: "Notices" },
    { path: "/admin/billing", icon: DollarSign, label: "Billing" },
    { path: "/admin/analytics", icon: BarChart, label: "Analytics" },
  ];

  const links =
    user?.role === "student"
      ? studentLinks
      : user?.role === "manager"
        ? managerLinks
        : adminLinks;

  return (
    <aside className="flex flex-col w-full h-full min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-500 text-white lg:w-sidebar">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold">Hostel Management</h2>
          <p className="text-sm text-white/80 capitalize">{user?.role} Portal</p>
        </div>
        {variant === "mobile" && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={variant === "mobile" ? onClose : undefined}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive ? "bg-white/20 font-medium" : "hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
