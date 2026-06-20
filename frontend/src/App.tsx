import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import CreateUserPage from './pages/CreateUserPage';
import EditUserPage from './pages/EditUserPage';
import UserDetailsPage from './pages/UserDetailsPage';
import { Users, UserPlus, Sun, Moon, Menu, X } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-pink-50 flex dark:bg-gray-900 transition-colors duration-300">
        <Toaster position="top-right" />
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-pink-100 shadow-sm dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 transform md:relative md:translate-x-0 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex justify-between items-center">
            <Link to="/" className="block hover:opacity-80 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
              <h1 className="text-xl font-bold text-pink-600 dark:text-pink-400">Admin Portal</h1>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Enterprise Management</p>
            </Link>
            <button className="md:hidden text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="mt-2 px-4 space-y-2 flex-1 overflow-y-auto">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center px-4 py-3 text-gray-700 bg-pink-50 rounded-lg hover:bg-pink-100 transition-all duration-300 hover:translate-x-2 hover:shadow-md dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              <Users className="w-5 h-5 mr-3 text-pink-600 dark:text-pink-400 transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
              <span className="font-medium">Users Dashboard</span>
            </Link>
            <Link to="/users/new" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-pink-50 transition-all duration-300 hover:translate-x-2 hover:shadow-md hover:text-pink-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-pink-400">
              <UserPlus className="w-5 h-5 mr-3 transform group-hover:text-pink-600 dark:group-hover:text-pink-400 group-hover:scale-125 group-hover:-rotate-6 transition-all duration-300" />
              <span className="font-medium">Create User</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="bg-white border-b border-pink-100 p-4 shadow-sm flex justify-between items-center dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300 shrink-0">
            <div className="flex items-center">
              <button 
                className="p-2 mr-3 text-gray-600 hover:text-pink-600 md:hidden dark:text-gray-300 dark:hover:text-pink-400 focus:outline-none" 
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[180px] sm:max-w-none">User Management</h2>
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setIsDarkMode(prev => !prev)}
              className="p-2 text-gray-500 hover:text-gray-700 bg-pink-100/50 hover:bg-gray-200 rounded-lg transition-all duration-300 active:scale-95 dark:text-gray-400 dark:hover:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </header>
          <div className="p-4 md:p-6 overflow-y-auto flex-1">
            <Routes>
              <Route path="/" element={<UsersPage />} />
              <Route path="/users/new" element={<CreateUserPage />} />
              <Route path="/users/:id" element={<UserDetailsPage />} />
              <Route path="/users/:id/edit" element={<EditUserPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
