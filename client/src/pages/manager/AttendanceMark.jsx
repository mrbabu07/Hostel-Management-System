import { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { attendanceService } from "../../services/attendance.service";
import { toISODate } from "../../utils/formatDate";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const AttendanceMark = () => {
  const [date, setDate] = useState(toISODate(new Date()));
  const [mealType, setMealType] = useState("breakfast");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  const handleMarkAttendance = async () => {
    try {
      setLoading(true);
      const attendanceData = Object.entries(attendance).map(
        ([userId, present]) => ({
          userId,
          date,
          mealType,
          present,
        }),
      );

      await attendanceService.markAttendance({ attendances: attendanceData });
      alert("Attendance marked successfully");
      setAttendance({});
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert(error.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (userId) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Mark Attendance</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Click on student names to mark them as present. Students not
              marked will be considered absent.
            </p>
          </div>

          <div className="space-y-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => {
              const userId = `student${i}`;
              return (
                <div
                  key={userId}
                  onClick={() => toggleAttendance(userId)}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    attendance[userId]
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Student {i}</p>
                      <p className="text-sm text-gray-600">Roll: 2024{i}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        attendance[userId]
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {attendance[userId] && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            onClick={handleMarkAttendance}
            disabled={loading || Object.keys(attendance).length === 0}
            className="w-full"
          >
            {loading ? "Saving..." : "Mark Attendance"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default AttendanceMark;
