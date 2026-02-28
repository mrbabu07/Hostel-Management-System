import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * AppLayout — Centered body structure
 *
 * Desktop: fixed sidebar (280px) + centered main content (max 1200–1400px)
 * Mobile: collapsible sidebar, full-width main content
 *
 * Tailwind: w-sidebar (280px), max-w-content-wide (1400px)
 */
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-app overflow-hidden">
      {/* Sidebar — fixed on lg+, drawer on mobile */}
      <aside className="hidden lg:flex lg:flex-shrink-0 lg:w-sidebar lg:flex-col">
        <Sidebar variant="desktop" />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-sidebar lg:hidden">
            <Sidebar variant="mobile" onClose={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Centered main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-content-wide px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
