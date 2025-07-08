import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { User, Briefcase, Star, Bookmark, BookOpen } from 'lucide-react';

const UserDashboard = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Profile', href: '/user/profile', icon: User },
    { name: 'All Vacancies', href: '/user/vacancies', icon: Briefcase },
    { name: 'Recommendations', href: '/user/recommendations', icon: Star },
    { name: 'Tracked Vacancies', href: '/user/tracked', icon: Bookmark },
    { name: 'Study Materials', href: '/user/study', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard</h2>
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
          
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
