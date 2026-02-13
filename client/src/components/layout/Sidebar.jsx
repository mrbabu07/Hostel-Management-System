import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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

const Sidebar = () => {
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
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold">Hostel Management</h2>
        <p className="text-sm text-gray-400 capitalize">{user?.role} Portal</p>
      </div>
      <nav className="mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-4 py-3 hover:bg-gray-700 transition-colors ${
                isActive ? "bg-gray-700 border-l-4 border-blue-500" : ""
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
