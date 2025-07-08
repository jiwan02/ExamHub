import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Calendar, Image, AlertCircle, Settings } from 'lucide-react';

const ManageVacancies = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    try {
      const { data } = await adminService.manageVacancies();
      setVacancies(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load vacancies');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <Settings className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Manage Vacancies</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {vacancies.map((vacancy) => (
          <div key={vacancy.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{vacancy.topic}</h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Qualifications:</strong> {vacancy.qualifications}
                </p>
                <p className="text-gray-600">
                  <strong>Age Range:</strong> {vacancy.ageRange}
                </p>
                {vacancy.requiredQualificationStream && (
                  <p className="text-gray-600">
                    <strong>Stream:</strong> {vacancy.requiredQualificationStream}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Posted: {new Date(vacancy.postedDate).toLocaleDateString()}</span>
                </div>
                {vacancy.examDate && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Exam: {new Date(vacancy.examDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Image className="h-4 w-4 mr-2" />
                  <span>{vacancy.imageCount || 0} Images</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <a
                href={vacancy.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                View Application Link →
              </a>

              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit
                </button>
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                  Post Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vacancies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vacancies found</h3>
          <p className="text-gray-600">Start by posting your first vacancy.</p>
        </div>
      )}
    </div>
  );
};

export default ManageVacancies;
