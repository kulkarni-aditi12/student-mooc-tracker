import React, { useState, useEffect } from 'react';
import { BookOpen, Settings as SettingsIcon, Home } from 'lucide-react';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { Dashboard } from './components/dashboard/Dashboard';
import { Settings } from './components/settings/Settings';
import { Layout } from './components/layout/Layout';
import { AppProvider } from './context/AppContext';
import { getCurrentUser } from './utils/storage';

type View = 'dashboard' | 'settings';
type AuthMode = 'login' | 'signup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    const user = getCurrentUser();
    setIsAuthenticated(!!user);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleSignup = () => {
    setAuthMode('login');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <AppProvider>
        {authMode === 'login' ? (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthMode('signup')}
          />
        ) : (
          <Signup
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <Layout onLogout={handleLogout}>
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="bg-white rounded-xl shadow-md border border-purple-100 p-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'settings'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <SettingsIcon className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        {currentView === 'dashboard' ? <Dashboard /> : <Settings />}
      </Layout>
    </AppProvider>
  );
}

export default App;