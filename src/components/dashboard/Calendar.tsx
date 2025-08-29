import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getUserDeadlines, addDeadline } from '../../utils/storage';
import { getCurrentUser } from '../../utils/storage';
import { useAppContext } from '../../context/AppContext';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddDeadline, setShowAddDeadline] = useState(false);
  const [deadlineTitle, setDeadlineTitle] = useState('');
  const { refreshData } = useAppContext();

  const user = getCurrentUser();
  const deadlines = user ? getUserDeadlines(user.id) : [];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const hasDeadline = (day: number) => {
    const date = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    return deadlines.some(deadline => deadline.date === date);
  };

  const handleAddDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !deadlineTitle.trim() || !user) return;

    addDeadline({
      userId: user.id,
      title: deadlineTitle.trim(),
      date: formatDate(selectedDate)
    });

    setDeadlineTitle('');
    setShowAddDeadline(false);
    setSelectedDate(null);
    refreshData();
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = formatDate(date) === formatDate(new Date());
      const hasDeadlineToday = hasDeadline(day);

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-10 w-10 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
            isToday
              ? 'bg-purple-600 text-white shadow-lg'
              : hasDeadlineToday
              ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
              : 'text-gray-700 hover:bg-purple-50'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Calendar & Deadlines</h3>
        <button
          onClick={() => setShowAddDeadline(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-purple-50 rounded-lg transition-colors duration-200"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h4 className="text-xl font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-purple-50 rounded-lg transition-colors duration-200"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderCalendarDays()}
      </div>

      {deadlines.length > 0 && (
        <div className="border-t border-purple-100 pt-4">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Upcoming Deadlines</h5>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {deadlines
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map(deadline => (
                <div key={deadline.id} className="flex items-center justify-between text-sm bg-purple-50 p-2 rounded-lg">
                  <span className="text-gray-700">{deadline.title}</span>
                  <span className="text-purple-600 font-medium">
                    {new Date(deadline.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {showAddDeadline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Deadline</h4>
            <form onSubmit={handleAddDeadline} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={deadlineTitle}
                  onChange={(e) => setDeadlineTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Deadline title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate ? formatDate(selectedDate) : ''}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Add Deadline
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDeadline(false);
                    setSelectedDate(null);
                    setDeadlineTitle('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};