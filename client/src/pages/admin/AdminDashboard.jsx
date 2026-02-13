import AppLayout from "../../components/layout/AppLayout";
import {
  Users,
  MessageSquare,
  Bell,
  DollarSign,
  BarChart,
  Menu,
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Users", value: "150", icon: Users, color: "bg-blue-500" },
    {
      label: "Active Complaints",
      value: "12",
      icon: MessageSquare,
      color: "bg-yellow-500",
    },
    { label: "Notices", value: "8", icon: Bell, color: "bg-green-500" },
    {
      label: "Monthly Revenue",
      value: "₹45,000",
      icon: DollarSign,
      color: "bg-purple-500",
    },
    { label: "Total Menus", value: "90", icon: Menu, color: "bg-pink-500" },
    {
      label: "Avg Attendance",
      value: "85%",
      icon: BarChart,
      color: "bg-indigo-500",
    },
  ];

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-sm text-gray-600">
                Add, edit, or remove users
              </p>
            </a>
            <a
              href="/admin/complaints"
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Handle Complaints</h3>
              <p className="text-sm text-gray-600">
                Review and resolve complaints
              </p>
            </a>
            <a
              href="/admin/notices"
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Manage Notices</h3>
              <p className="text-sm text-gray-600">
                Create and publish notices
              </p>
            </a>
            <a
              href="/admin/billing"
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Billing Management</h3>
              <p className="text-sm text-gray-600">Generate and view bills</p>
            </a>
            <a
              href="/admin/analytics"
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm text-gray-600">View system analytics</p>
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
