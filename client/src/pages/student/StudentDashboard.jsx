import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { Calendar, DollarSign, MessageSquare, Star } from "lucide-react";

const StudentDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Meal Plans", value: "15", icon: Calendar, color: "bg-blue-500" },
    {
      label: "Pending Bill",
      value: "₹1,200",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      label: "Complaints",
      value: "2",
      icon: MessageSquare,
      color: "bg-yellow-500",
    },
    { label: "Feedback Given", value: "8", icon: Star, color: "bg-purple-500" },
  ];

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

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
              href="/student/meal-confirm"
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Confirm Meals</h3>
              <p className="text-sm text-gray-600">
                Plan your meals for the week
              </p>
            </a>
            <a
              href="/student/menu"
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">View Menu</h3>
              <p className="text-sm text-gray-600">Check today's menu</p>
            </a>
            <a
              href="/student/feedback"
              className="p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold">Give Feedback</h3>
              <p className="text-sm text-gray-600">Rate your meal experience</p>
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;
