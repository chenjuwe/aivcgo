import { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Heart, 
  Users, 
  User, 
  LogIn,
  Menu,
  X,
  Cloud,
  CloudOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePrayerStorage } from '../hooks/usePrayerStorage';
import { AuthModal } from './AuthModal';
import { UserProfile } from './UserProfile';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { user, isAuthenticated } = useAuth();
  const { syncStatus } = usePrayerStorage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const navItems = [
    { id: 'generator', label: '生成禱告', icon: Sparkles },
    { id: 'characters', label: '角色庫', icon: User },
    { id: 'history', label: '禱告歷史', icon: Clock },
    { id: 'favorites', label: '我的收藏', icon: Heart },
    { id: 'community', label: '社群禱告', icon: Users },
  ];

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setShowMobileMenu(false);
  };

  const handleUserClick = () => {
    setShowUserProfile(true);
    setShowMobileMenu(false);
  };

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setShowMobileMenu(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Sparkles className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-xl font-bold text-gray-800">禱告生成器</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentView === item.id
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User Section */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Sync Status */}
              {isAuthenticated && (
                <div className="flex items-center space-x-2">
                  {syncStatus.isOnline ? (
                    <div className="flex items-center text-green-600" title="雲端同步已啟用">
                      <Cloud className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400" title="離線模式">
                      <CloudOff className="h-4 w-4" />
                    </div>
                  )}
                  
                  {syncStatus.pendingUploads > 0 && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      {syncStatus.pendingUploads}
                    </span>
                  )}
                </div>
              )}

              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleUserClick}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || '用戶頭像'}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    <span className="max-w-24 truncate">
                      {user?.displayName || '用戶'}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    登入
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                  >
                    註冊
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      currentView === item.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
              
              <hr className="my-2" />
              
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                    {syncStatus.isOnline ? (
                      <div className="flex items-center text-green-600">
                        <Cloud className="h-4 w-4 mr-2" />
                        雲端同步已啟用
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <CloudOff className="h-4 w-4 mr-2" />
                        離線模式
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleUserClick}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || '用戶頭像'}
                        className="w-5 h-5 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <User className="mr-3 h-5 w-5" />
                    )}
                    {user?.displayName || '用戶設定'}
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <LogIn className="mr-3 h-5 w-5" />
                    登入
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                  >
                    <User className="mr-3 h-5 w-5" />
                    註冊
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      {showUserProfile && (
        <UserProfile onClose={() => setShowUserProfile(false)} />
      )}
    </>
  );
}
