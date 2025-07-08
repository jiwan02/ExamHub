import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import {
  Plus,
  Calendar,
  Users,
  GraduationCap,
  ExternalLink,
  Upload,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const PostVacancy = () => {
  const [form, setForm] = useState({
    topic: '',
    qualifications: '',
    ageRange: '',
    requiredQualificationStream: '',
    applicationLink: '',
    examDate: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = {
        ...form,
        images: images.length > 0 ? images : undefined,
      };

      await adminService.postVacancy(formData);
      setSuccess('Vacancy posted successfully!');
      setForm({
        topic: '',
        qualifications: '',
        ageRange: '',
        requiredQualificationStream: '',
        applicationLink: '',
        examDate: '',
      });
      setImages([]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to post vacancy');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <Plus className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Post New Vacancy</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Vacancy Topic *
            </label>
            <input
              id="topic"
              type="text"
              required
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter vacancy topic"
            />
          </div>

          <div>
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="h-4 w-4 inline mr-1" />
              Qualifications *
            </label>
            <input
              id="qualifications"
              type="text"
              required
              value={form.qualifications}
              onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Bachelor's Degree"
            />
          </div>

          <div>
            <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 inline mr-1" />
              Age Range *
            </label>
            <input
              id="ageRange"
              type="text"
              required
              value={form.ageRange}
              onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 21-35 years"
            />
          </div>

          <div>
            <label htmlFor="requiredQualificationStream" className="block text-sm font-medium text-gray-700 mb-2">
              Qualification Stream
            </label>
            <input
              id="requiredQualificationStream"
              type="text"
              value={form.requiredQualificationStream}
              onChange={(e) => setForm({ ...form, requiredQualificationStream: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Engineering, Commerce, All"
            />
          </div>

          <div>
            <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Exam Date
            </label>
            <input
              id="examDate"
              type="date"
              value={form.examDate}
              onChange={(e) => setForm({ ...form, examDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="applicationLink" className="block text-sm font-medium text-gray-700 mb-2">
              <ExternalLink className="h-4 w-4 inline mr-1" />
              Application Link *
            </label>
            <input
              id="applicationLink"
              type="url"
              required
              value={form.applicationLink}
              onChange={(e) => setForm({ ...form, applicationLink: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/apply"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="h-4 w-4 inline mr-1" />
              Upload Images (Optional)
            </label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {images.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">{images.length} file(s) selected</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            <span>{loading ? 'Posting...' : 'Post Vacancy'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostVacancy;
