import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import {
  Plus,
  Settings,
  Users,
  BookOpen,
  FolderPlus,
  Upload,
  BarChart3,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Post Vacancy', href: '/admin/post-vacancy', icon: Plus },
    { name: 'Manage Vacancies', href: '/admin/manage-vacancies', icon: Settings },
    { name: 'All Users', href: '/admin/users', icon: Users },
    { name: 'Tracked Users', href: '/admin/tracked-users', icon: Eye },
    { name: 'Categories', href: '/admin/categories', icon: FolderPlus },
    { name: 'Study Materials', href: '/admin/study-materials', icon: BookOpen },
    { name: 'Upload Material', href: '/admin/upload-material', icon: Upload },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h2>
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

export default AdminDashboard;
