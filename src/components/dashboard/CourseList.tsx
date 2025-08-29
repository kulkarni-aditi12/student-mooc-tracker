import React, { useState } from 'react';
import { Edit, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { Course } from '../../types';
import { ProgressBar } from './ProgressBar';
import { deleteCourse, updateCourse } from '../../utils/storage';
import { useAppContext } from '../../context/AppContext';

interface CourseListProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
}

export const CourseList: React.FC<CourseListProps> = ({ courses, onEditCourse }) => {
  const { refreshData } = useAppContext();
  const [editingProgress, setEditingProgress] = useState<number | null>(null);

  const handleDeleteCourse = (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(courseId);
      refreshData();
    }
  };

  const handleProgressUpdate = (courseId: number, newProgress: number) => {
    updateCourse(courseId, { progress: newProgress });
    setEditingProgress(null);
    refreshData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-purple-100 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Calendar className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Yet</h3>
        <p className="text-gray-600">Start adding your MOOC courses to track your progress</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div key={course.id} className="bg-white rounded-xl shadow-md border border-purple-100 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-1">{course.courseName}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                      {course.platform}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Started {formatDate(course.startDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditCourse(course)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className={`inline-flex items-center space-x-2 text-sm px-3 py-1 rounded-full ${
                  isOverdue(course.deadline)
                    ? 'bg-red-100 text-red-800'
                    : isDeadlineApproaching(course.deadline)
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>Due {formatDate(course.deadline)}</span>
                  {isOverdue(course.deadline) && <span className="font-medium">(Overdue)</span>}
                  {isDeadlineApproaching(course.deadline) && !isOverdue(course.deadline) && (
                    <span className="font-medium">(Soon)</span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <ProgressBar
                  progress={course.progress}
                  editable={editingProgress === course.id}
                  onChange={(newProgress) => handleProgressUpdate(course.id, newProgress)}
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setEditingProgress(editingProgress === course.id ? null : course.id)}
                  className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-lg transition-colors duration-200"
                >
                  {editingProgress === course.id ? 'Save Progress' : 'Update Progress'}
                </button>
                <button className="text-sm text-gray-600 hover:text-purple-600 flex items-center space-x-1 transition-colors duration-200">
                  <ExternalLink className="h-3 w-3" />
                  <span>View Course</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};