import AppLayout from "../../components/layout/AppLayout";
import { Menu, ClipboardList, BarChart, Star } from "lucide-react";

const ManagerDashboard = () => {
  const stats = [
    { label: "Today's Menus", value: "3", icon: Menu, color: "bg-blue-500" },
    {
      label: "Attendance Marked",
      value: "45",
      icon: ClipboardList,
      color: "bg-green-500",
    },
    { label: "Avg Rating", value: "4.2", icon: Star, color: "bg-yellow-500" },
    {
      label: "Total Students",
      value: "150",
      icon: BarChart,
      color: "bg-purple-500",
    },
  ];

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              href="/manager/menu"
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Manage Menu</h3>
              <p className="text-sm text-gray-600">
                Create and update daily menus
              </p>
            </a>
            <a
              href="/manager/attendance"
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Mark Attendance</h3>
              <p className="text-sm text-gray-600">
                Record student meal attendance
              </p>
            </a>
            <a
              href="/manager/feedback"
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">View Feedback</h3>
              <p className="text-sm text-gray-600">
                Check student feedback and ratings
              </p>
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ManagerDashboard;
