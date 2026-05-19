import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  User
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import { motion, AnimatePresence } from 'framer-motion';

const AppLayout = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 fixed inset-y-0 z-20">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <CheckSquare size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">Taskify</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
              <User size={16} className="text-slate-600 dark:text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:ml-64 relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white ml-2 md:ml-0 md:hidden">Taskify</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-800 shadow-xl z-50 flex flex-col md:hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <CheckSquare size={20} className="text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">Taskify</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                    <User size={16} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
