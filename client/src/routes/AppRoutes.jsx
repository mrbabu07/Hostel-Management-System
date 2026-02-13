import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Student Pages
import StudentDashboard from "../pages/student/StudentDashboard";
import MenuView from "../pages/student/MenuView";
import MealConfirm from "../pages/student/MealConfirm";
import AttendanceHistory from "../pages/student/AttendanceHistory";
import MyBill from "../pages/student/MyBill";
import Complaints from "../pages/student/Complaints";
import Notices from "../pages/student/Notices";
import Feedback from "../pages/student/Feedback";

// Manager Pages
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import MenuManage from "../pages/manager/MenuManage";
import AttendanceMark from "../pages/manager/AttendanceMark";
import AttendanceReport from "../pages/manager/AttendanceReport";
import FeedbackSummary from "../pages/manager/FeedbackSummary";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersManage from "../pages/admin/UsersManage";
import ComplaintsManage from "../pages/admin/ComplaintsManage";
import NoticesManage from "../pages/admin/NoticesManage";
import BillingManage from "../pages/admin/BillingManage";
import AnalyticsDashboard from "../pages/admin/AnalyticsDashboard";

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/menu"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <MenuView />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/meal-confirm"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <MealConfirm />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <AttendanceHistory />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/bill"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <MyBill />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/complaints"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <Complaints />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/notices"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <Notices />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/feedback"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <Feedback />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/menu"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["manager"]}>
              <MenuManage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/attendance"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["manager"]}>
              <AttendanceMark />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/attendance-report"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["manager"]}>
              <AttendanceReport />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/feedback"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["manager"]}>
              <FeedbackSummary />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <UsersManage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <ComplaintsManage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notices"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <NoticesManage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/billing"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <BillingManage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <AnalyticsDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
