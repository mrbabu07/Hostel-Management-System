/**
 * Design System Sidebar Nav Item
 * Use inside a sidebar with brand gradient background.
 */
import { NavLink } from "react-router-dom";

const DSSidebarItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-white/20 text-white font-medium"
            : "text-white/90 hover:bg-white/10"
        }`
      }
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      <span>{label}</span>
    </NavLink>
  );
};

export default DSSidebarItem;
