import { useState } from 'react';
import { Bars3Icon, BellIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import ModernSidebar from '../common/ModernSidebar';

const ModernLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Modern Sidebar */}
      <ModernSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-all"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-secondary-100 dark:bg-secondary-700 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-secondary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-all"
              >
                {darkMode ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-all">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white dark:ring-secondary-800" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default ModernLayout;
