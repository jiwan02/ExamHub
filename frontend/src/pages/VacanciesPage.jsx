import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import VacancyList from '../components/vacancy/VacancyList';

const VacanciesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <VacancyList />
      </main>
      <Footer />
    </div>
  );
};

export default VacanciesPage;
