import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import CreateUserPage from './pages/CreateUserPage';
import EditUserPage from './pages/EditUserPage';
import UserDetailsPage from './pages/UserDetailsPage';
import { Users, UserPlus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex">
        <Toaster position="top-right" />
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:block">
          <div className="p-6">
            <Link to="/" className="block hover:opacity-80 transition-opacity">
              <h1 className="text-xl font-bold text-blue-600">Admin Portal</h1>
              <p className="text-xs text-gray-500 mt-1">Enterprise Management</p>
            </Link>
          </div>
          <nav className="mt-6 px-4 space-y-2">
            <Link to="/" className="flex items-center px-4 py-3 text-gray-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Users className="w-5 h-5 mr-3 text-blue-600" />
              <span className="font-medium">Users Dashboard</span>
            </Link>
            <Link to="/users/new" className="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <UserPlus className="w-5 h-5 mr-3" />
              <span className="font-medium">Create User</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
              <h2 className="text-xl font-semibold text-gray-800">User Management System</h2>
            </Link>
          </header>
          <div className="p-6">
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
