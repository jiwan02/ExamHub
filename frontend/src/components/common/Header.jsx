import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, User, LogOut, BookOpen, Briefcase } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <GraduationCap className="h-8 w-8" />
          <h1 className="text-2xl font-bold">ExamHub</h1>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
            <BookOpen className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/vacancies" className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
            <Briefcase className="h-4 w-4" />
            <span>Vacancies</span>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to={user.role === 'Admin' ? '/admin' : '/user'} 
                className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{user.role === 'Admin' ? 'Admin Panel' : 'Dashboard'}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-700 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
