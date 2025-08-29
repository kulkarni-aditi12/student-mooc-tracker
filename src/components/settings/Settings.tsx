import React, { useState, useEffect } from 'react';
import { Save, User, Palette } from 'lucide-react';
import { getCurrentUser, updateSettings, getStorageData } from '../../utils/storage';
import { useAppContext } from '../../context/AppContext';

export const Settings: React.FC = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [theme, setTheme] = useState('purple');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { refreshData } = useAppContext();

  useEffect(() => {
    const user = getCurrentUser();
    const data = getStorageData();
    
    if (user) {
      setProfile({
        name: data.settings.profile.name || user.username,
        email: data.settings.profile.email || user.email
      });
    }
    setTheme(data.settings.theme);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      updateSettings({
        profile,
        theme
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      refreshData();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const themes = [
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'red', label: 'Red', color: 'bg-red-500' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md border border-purple-100 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
            Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Profile Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-purple-100">
              <div className="bg-purple-100 p-2 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-purple-100">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Theme Preferences</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Choose Theme Color
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themes.map(themeOption => (
                  <button
                    key={themeOption.value}
                    type="button"
                    onClick={() => setTheme(themeOption.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      theme === themeOption.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 ${themeOption.color} rounded-full mx-auto mb-2`} />
                    <span className="text-sm font-medium text-gray-700">{themeOption.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};