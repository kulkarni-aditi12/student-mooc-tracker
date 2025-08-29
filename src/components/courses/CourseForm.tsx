import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Course } from '../../types';
import { addCourse, updateCourse, getCurrentUser } from '../../utils/storage';
import { useAppContext } from '../../context/AppContext';

interface CourseFormProps {
  course?: Course;
  onClose: () => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({ course, onClose }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    platform: '',
    startDate: '',
    deadline: '',
    progress: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { refreshData } = useAppContext();
  const user = getCurrentUser();

  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.courseName,
        platform: course.platform,
        startDate: course.startDate,
        deadline: course.deadline,
        progress: course.progress
      });
    }
  }, [course]);

  const platforms = [
    'Coursera', 'Udemy', 'edX', 'Udacity', 'Khan Academy', 
    'Pluralsight', 'LinkedIn Learning', 'Skillshare', 'FutureLearn', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      if (course) {
        updateCourse(course.id, formData);
      } else {
        addCourse({
          ...formData,
          userId: user.id
        });
      }
      
      refreshData();
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {course ? 'Edit Course' : 'Add New Course'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
              Course Name
            </label>
            <input
              id="courseName"
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
              placeholder="Enter course name"
              required
            />
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
              required
            >
              <option value="">Select platform</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-2">
              Progress: {formData.progress}%
            </label>
            <input
              id="progress"
              type="range"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${formData.progress}%, rgb(229, 231, 235) ${formData.progress}%, rgb(229, 231, 235) 100%)`
              }}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : course ? 'Update Course' : 'Add Course'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};