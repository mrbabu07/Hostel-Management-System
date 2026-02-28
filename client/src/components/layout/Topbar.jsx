import { useAuth } from "../../context/AuthContext";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-surface border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-border-muted lg:hidden"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-semibold text-text-primary">
          Welcome, {user?.name}
        </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-text-secondary">
            <User className="w-5 h-5" />
            <span className="text-sm">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-status-danger hover:bg-status-danger-muted rounded-lg transition-colors"
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
