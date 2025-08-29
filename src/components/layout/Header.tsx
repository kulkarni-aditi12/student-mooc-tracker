import React from 'react';
import { LogOut, User, BookOpen } from 'lucide-react';
import { getCurrentUser, logout } from '../../utils/storage';
import { useAppContext } from '../../context/AppContext';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { refreshData } = useAppContext();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    refreshData();
    onLogout();
  };

  return (
    <header className="bg-white shadow-md border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-2 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MOOC Tracker</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-5 w-5 text-purple-600" />
              <span className="hidden sm:block font-medium">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};