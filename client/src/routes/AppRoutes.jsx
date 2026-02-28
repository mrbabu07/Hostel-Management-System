import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import ModernLoader from "../components/common/ModernLoader";

// Public Pages
import HomePublic from "../pages/public/HomePublic";

// Shared Pages
import Home from "../pages/shared/Home";

// Auth Pages
import ModernLogin from "../pages/auth/ModernLogin";
import ModernRegister from "../pages/auth/ModernRegister";

// Student Pages
import ModernStudentDashboard from "../pages/student/ModernStudentDashboard";
import MenuView from "../pages/student/MenuView";
import MealConfirm from "../pages/student/MealConfirm";
import AttendanceHistory from "../pages/student/AttendanceHistory";
import SelfAttendance from "../pages/student/SelfAttendance";
import ModernMyBill from "../pages/student/ModernMyBill";
import Complaints from "../pages/student/Complaints";
import Notices from "../pages/student/Notices";
import Feedback from "../pages/student/Feedback";
import StudentChat from "../pages/student/Chat";
import Profile from "../pages/student/Profile";

// Manager Pages
import ModernManagerDashboard from "../pages/manager/ModernManagerDashboard";
import MenuManage from "../pages/manager/MenuManage";
import EnhancedMenuManage from "../pages/manager/EnhancedMenuManage";
import AttendanceMark from "../pages/manager/AttendanceMark";
import AttendanceReport from "../pages/manager/AttendanceReport";
import AttendanceApproval from "../pages/manager/AttendanceApproval";
import FeedbackSummary from "../pages/manager/FeedbackSummary";
import Inventory from "../pages/manager/Inventory";
import ManagerChat from "../pages/manager/Chat";
import Reports from "../pages/manager/Reports";

// Admin Pages
import ModernAdminDashboard from "../pages/admin/ModernAdminDashboard";
import UsersManage from "../pages/admin/UsersManage";
import ComplaintsManage from "../pages/admin/ComplaintsManage";
import NoticesManage from "../pages/admin/NoticesManage";
import BillingManage from "../pages/admin/BillingManage";
import AnalyticsDashboard from "../pages/admin/AnalyticsDashboard";
import Settings from "../pages/admin/Settings";
import AdminChat from "../pages/admin/Chat";

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <ModernLoader fullScreen text="Loading application..." />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePublic />} />
      <Route path="/login" element={<ModernLogin />} />
      <Route path="/register" element={<ModernRegister />} />

      {/* Shared Protected Route */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <ModernStudentDashboard />
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
              <SelfAttendance />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance-history"
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
              <ModernMyBill />
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
        path="/student/chat"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <StudentChat />
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
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["student"]}>
              <Profile />
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
              <ModernManagerDashboard />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/menu"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["manager"]}>
              <EnhancedMenuManage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/attendance"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["manager"]}>
              <AttendanceApproval />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/attendance-mark"
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
        path="/manager/inventory"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["manager"]}>
              <Inventory />
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
      <Route
        path="/manager/chat"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["manager"]}>
              <ManagerChat />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/reports"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["manager"]}>
              <Reports />
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
              <ModernAdminDashboard />
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
        path="/admin/chat"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <AdminChat />
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
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["admin"]}>
              <Settings />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Default Redirects */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
