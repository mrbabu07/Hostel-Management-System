import { useState, useEffect } from "react";
import ModernLayout from "../../components/layout/ModernLayout";
import { attendanceService } from "../../services/attendance.service";
import { toISODate, formatDate } from "../../utils/formatDate";
import Input from "../../components/common/Input";

const AttendanceReport = () => {
  const [date, setDate] = useState(toISODate(new Date()));
  const [mealType, setMealType] = useState("");
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [date, mealType]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getAttendanceReport(
        date,
        mealType,
      );
      const reportData = Array.isArray(response.data) ? response.data : [];
      setReport(reportData);
    } catch (error) {
      console.error("Error fetching report:", error);
      setReport([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = report.length;
    const present = report.filter((r) => r.present).length;
    const absent = total - present;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { total, present, absent, percentage };
  };

  const stats = calculateStats();

  return (
    <ModernLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Attendance Report</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium mb-2">
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.present}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Attendance %</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.percentage}%
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : report.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No attendance records found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Roll Number</th>
                    <th className="px-4 py-3 text-left">Meal Type</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {report.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {record.userId?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {record.userId?.rollNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {record.mealType}
                      </td>
                      <td className="px-4 py-3">{formatDate(record.date)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            record.present
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.present ? "Present" : "Absent"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ModernLayout>
  );
};

export default AttendanceReport;
