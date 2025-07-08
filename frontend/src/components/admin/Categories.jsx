import React, { useState, useEffect } from 'react';
import { studyService } from '../../services/studyService';
import { adminService } from '../../services/adminService';
import { FolderPlus, Folder, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState({});
  const [newCategory, setNewCategory] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await studyService.getCategories();
      setCategories(data);

      const topicsData = {};
      for (const category of data) {
        try {
          const topicsResponse = await studyService.getTopics(category.id);
          topicsData[category.id] = topicsResponse.data;
        } catch (err) {
          topicsData[category.id] = [];
        }
      }
      setTopics(topicsData);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await adminService.createCategory({ name: newCategory });
      setSuccess('Category created successfully!');
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create category');
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!newTopic.trim() || !selectedCategoryId) return;

    try {
      await adminService.createTopic({
        name: newTopic,
        categoryId: selectedCategoryId,
      });
      setSuccess('Topic created successfully!');
      setNewTopic('');
      setSelectedCategoryId('');
      fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create topic');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      !confirm(
        'Are you sure you want to delete this category? This will also delete all associated topics and study materials.'
      )
    ) {
      return;
    }

    try {
      await adminService.deleteCategory(id);
      setSuccess('Category deleted successfully!');
      fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleDeleteTopic = async (id) => {
    if (
      !confirm(
        'Are you sure you want to delete this topic? This will also delete all associated study materials.'
      )
    ) {
      return;
    }

    try {
      await adminService.deleteTopic(id);
      setSuccess('Topic deleted successfully!');
      fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete topic');
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
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <FolderPlus className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Manage Categories & Topics</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h3>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Category</span>
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Topic</h3>
          <form onSubmit={handleCreateTopic} className="space-y-4">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Enter topic name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Topic</span>
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Existing Categories & Topics</h3>

        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Folder className="h-6 w-6 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {topics[category.id]?.length || 0} topics
                </span>
              </div>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            {topics[category.id] && topics[category.id].length > 0 && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topics[category.id].map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-900 font-medium">{topic.name}</span>
                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <FolderPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">Create your first category to get started.</p>
        </div>
      )}
    </div>
  );
};

export default Categories;
