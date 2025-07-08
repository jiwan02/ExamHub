import React, { useState, useEffect } from 'react';
import { studyService } from '../../services/studyService';
import { adminService } from '../../services/adminService';
import {
  BookOpen,
  Download,
  Trash2,
  AlertCircle,
  Filter,
} from 'lucide-react';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchTopics(selectedCategory);
    } else {
      setTopics([]);
      setSelectedTopic('');
    }
    fetchMaterials();
  }, [selectedCategory]);

  useEffect(() => {
    fetchMaterials();
  }, [selectedTopic]);

  const fetchCategories = async () => {
    try {
      const { data } = await studyService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load categories');
    }
  };

  const fetchTopics = async (categoryId) => {
    try {
      const { data } = await studyService.getTopics(categoryId);
      setTopics(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load topics');
    }
  };

  const fetchMaterials = async () => {
    try {
      const params = {};
      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedTopic) params.topicId = selectedTopic;

      const { data } = await studyService.getStudyMaterials(params);
      setMaterials(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this study material?')) return;

    try {
      await adminService.deleteStudyMaterial(id);
      setSuccess('Study material deleted successfully!');
      fetchMaterials();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete study material');
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const response = await studyService.downloadStudyMaterial(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to download study material');
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
          <BookOpen className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Study Materials</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {materials.length} Materials
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Materials</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!selectedCategory}
          >
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid gap-6">
        {materials.map((material) => (
          <div
            key={material.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{material.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {material.categoryName}
                  </span>
                  {material.topicName && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {material.topicName}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  Uploaded by: {material.uploadedBy || 'Unknown'} •{' '}
                  {new Date(material.uploadedDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDownload(material.id, material.title)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>

              <button
                onClick={() => handleDelete(material.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {materials.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No study materials found</h3>
          <p className="text-gray-600">
            {selectedCategory || selectedTopic
              ? 'No materials match your current filters.'
              : 'Upload your first study material to get started.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudyMaterials;
