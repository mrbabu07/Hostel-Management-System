import { useAuth } from "../../context/AuthContext";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-5 h-5" />
            <span className="text-sm">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
