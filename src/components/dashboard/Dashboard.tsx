import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, BookOpen, Clock, Target } from 'lucide-react';
import { Course } from '../../types';
import { Calendar } from './Calendar';
import { CourseList } from './CourseList';
import { CourseForm } from '../courses/CourseForm';
import { getUserCourses, getCurrentUser } from '../../utils/storage';
import { useAppContext } from '../../context/AppContext';

export const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const { data } = useAppContext();
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      setCourses(getUserCourses(user.id));
    }
  }, [user, data]);

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const handleCloseCourseForm = () => {
    setShowCourseForm(false);
    setEditingCourse(undefined);
  };

  const averageProgress = courses.length > 0 
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)
    : 0;

  const completedCourses = courses.filter(course => course.progress === 100).length;
  const inProgressCourses = courses.filter(course => course.progress > 0 && course.progress < 100).length;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedCourses}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">{inProgressCourses}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
              <p className="text-3xl font-bold text-purple-600">{averageProgress}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div className="xl:col-span-1">
          <Calendar />
        </div>

        {/* Courses Section */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <button
              onClick={() => setShowCourseForm(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Course</span>
            </button>
          </div>

          <CourseList courses={courses} onEditCourse={handleEditCourse} />
        </div>
      </div>

      {/* Course Form Modal */}
      {showCourseForm && (
        <CourseForm
          course={editingCourse}
          onClose={handleCloseCourseForm}
        />
      )}
    </div>
  );
};