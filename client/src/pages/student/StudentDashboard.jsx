import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import {
  Calendar,
  DollarSign,
  MessageSquare,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";

const StudentDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Meal Plans",
      value: "15",
      icon: Calendar,
      color: "blue",
      trend: "up",
      trendValue: "+3 this week",
    },
    {
      title: "Pending Bill",
      value: "₹1,200",
      icon: DollarSign,
      color: "green",
      subtitle: "Due: 30 Dec",
    },
    {
      title: "Active Complaints",
      value: "2",
      icon: MessageSquare,
      color: "yellow",
      subtitle: "1 in progress",
    },
    {
      title: "Avg Rating Given",
      value: "4.2",
      icon: Star,
      color: "purple",
      trend: "up",
      trendValue: "+0.3",
    },
  ];

  const quickActions = [
    {
      title: "Confirm Meals",
      description: "Plan your meals for the week",
      href: "/student/meal-confirm",
      icon: Calendar,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "View Menu",
      description: "Check today's menu",
      href: "/student/menu",
      icon: Clock,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Give Feedback",
      description: "Rate your meal experience",
      href: "/student/feedback",
      icon: Star,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const recentActivity = [
    {
      action: "Meal confirmed",
      detail: "Breakfast, Lunch, Dinner",
      time: "2 hours ago",
    },
    {
      action: "Feedback submitted",
      detail: "Lunch - 4 stars",
      time: "1 day ago",
    },
    {
      action: "Complaint resolved",
      detail: "Food quality issue",
      time: "2 days ago",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-blue-100">
            Here's what's happening with your meals today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 group"
                >
                  <div
                    className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </a>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">{activity.detail}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming Meals */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Today's Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Breakfast", "Lunch", "Dinner"].map((meal, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{meal}</h3>
                <p className="text-sm text-gray-600">View menu to see items</p>
                <a
                  href="/student/menu"
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                >
                  View details →
                </a>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;
