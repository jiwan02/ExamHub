import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Briefcase, BookOpen, Target, Users, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Latest Vacancies",
      description: "Stay updated with the newest job opportunities and government exam notifications.",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Study Materials",
      description: "Access comprehensive study materials organized by categories and topics.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Personalized Recommendations",
      description: "Get vacancy recommendations tailored to your profile and qualifications.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Track Applications",
      description: "Keep track of your application status and never miss important updates.",
    },
  ];

  const stats = [
    { label: "Active Vacancies", value: "1,200+", icon: <Briefcase className="h-5 w-5" /> },
    { label: "Study Materials", value: "500+", icon: <BookOpen className="h-5 w-5" /> },
    { label: "Registered Users", value: "10,000+", icon: <Users className="h-5 w-5" /> },
    { label: "Success Rate", value: "85%", icon: <TrendingUp className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Gateway to
              <span className="text-blue-200"> Success</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Discover the latest exam opportunities, access premium study materials, 
              and track your career journey with ExamHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/vacancies"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Browse Vacancies
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition-colors border-2 border-blue-400"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <div className="text-blue-600">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From the latest vacancy notifications to comprehensive study materials, 
              we provide all the tools you need for your exam preparation journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6">
                  <div className="text-blue-600">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of successful candidates who trust ExamHub for their career advancement.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
