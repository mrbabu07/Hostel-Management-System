import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { attendanceService } from "../../services/attendance.service";
import {
  getCurrentMonth,
  getCurrentYear,
  formatDate,
} from "../../utils/formatDate";

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(getCurrentYear());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await attendanceService.getMyAttendance(month, year);
      setAttendance(response.data.attendance);
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Attendance History</h1>

        <div className="mb-6 flex gap-4">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {summary && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600">Total</p>
              <p className="text-2xl font-bold">{summary.total}</p>
            </div>
            <div className="bg-green-100 rounded-lg shadow p-4">
              <p className="text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">
                {summary.present}
              </p>
            </div>
            <div className="bg-red-100 rounded-lg shadow p-4">
              <p className="text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">
                {summary.absent}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Meal Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td className="px-6 py-4">{formatDate(record.date)}</td>
                  <td className="px-6 py-4 capitalize">{record.mealType}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${record.present ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {record.present ? "Present" : "Absent"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default AttendanceHistory;
