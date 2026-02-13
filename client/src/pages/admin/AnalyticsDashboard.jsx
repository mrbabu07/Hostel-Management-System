import AppLayout from "../../components/layout/AppLayout";
import { BarChart, TrendingUp, Users, DollarSign } from "lucide-react";

const AnalyticsDashboard = () => {
  const monthlyData = [
    { month: "Jan", revenue: 42000, attendance: 82 },
    { month: "Feb", revenue: 45000, attendance: 85 },
    { month: "Mar", revenue: 43000, attendance: 80 },
    { month: "Apr", revenue: 47000, attendance: 88 },
    { month: "May", revenue: 46000, attendance: 86 },
    { month: "Jun", revenue: 48000, attendance: 90 },
  ];

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-2xl font-bold mt-2">150</p>
                <p className="text-sm text-green-600 mt-1">
                  +5% from last month
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold mt-2">₹48,000</p>
                <p className="text-sm text-green-600 mt-1">
                  +4% from last month
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Attendance</p>
                <p className="text-2xl font-bold mt-2">90%</p>
                <p className="text-sm text-green-600 mt-1">
                  +2% from last month
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold mt-2">4.2/5</p>
                <p className="text-sm text-green-600 mt-1">
                  +0.3 from last month
                </p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg">
                <BarChart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Revenue Trend
            </h2>
            <div className="space-y-3">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex items-center gap-3">
                  <span className="w-12 text-sm font-medium">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div
                      className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(data.revenue / 50000) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        ₹{data.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Attendance Trend</h2>
            <div className="space-y-3">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex items-center gap-3">
                  <span className="w-12 text-sm font-medium">{data.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6">
                    <div
                      className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${data.attendance}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {data.attendance}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AnalyticsDashboard;
