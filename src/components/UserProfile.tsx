import React, { useState } from 'react';
import { User, Settings, Camera, Save, LogOut, Cloud, CloudOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePrayerStorage } from '../hooks/usePrayerStorage';
import { UserPreferences, PrayerCategory } from '../types';
import { categoryNames } from '../utils/prayerTemplates';

interface UserProfileProps {
  onClose: () => void;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, updateProfile, updatePreferences, signOut, isLoading } = useAuth();
  const { syncStatus, manualSync } = usePrayerStorage();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'sync'>('profile');
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || ''
  });
  
  const [preferences, setPreferences] = useState<UserPreferences>(
    user?.preferences || {
      defaultCategory: 'gratitude',
      defaultLength: 'medium',
      defaultTone: 'formal',
      enableNotifications: true,
      enableCloudSync: true,
      theme: 'system'
    }
  );

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
    } catch (error) {
      console.error('更新資料失敗:', error);
    }
  };

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePreferences(preferences);
    } catch (error) {
      console.error('更新偏好設定失敗:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* 頭部 */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || '用戶頭像'}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.displayName || '用戶'}</h2>
              <p className="text-blue-100">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <Settings className="h-6 w-6" />
          </button>
        </div>

        {/* 標籤頁 */}
        <div className="flex border-b">
          {[
            { id: 'profile', label: '個人資料', icon: User },
            { id: 'preferences', label: '偏好設定', icon: Settings },
            { id: 'sync', label: '同步狀態', icon: Cloud }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center py-4 px-6 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 內容區域 */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* 個人資料標籤 */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  顯示名稱
                </label>
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="輸入您的顯示名稱"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  頭像網址
                </label>
                <div className="flex space-x-3">
                  <input
                    type="url"
                    value={profileData.photoURL}
                    onChange={(e) => setProfileData({...profileData, photoURL: e.target.value})}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="輸入頭像圖片網址"
                  />
                  <button
                    type="button"
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? '更新中...' : '更新資料'}
              </button>
            </form>
          )}

          {/* 偏好設定標籤 */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleUpdatePreferences} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  預設禱告類型
                </label>
                <select
                  value={preferences.defaultCategory}
                  onChange={(e) => setPreferences({...preferences, defaultCategory: e.target.value as PrayerCategory})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(categoryNames).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  預設禱告長度
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: 'short', label: '簡短' },
                    { value: 'medium', label: '中等' },
                    { value: 'long', label: '詳細' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        value={option.value}
                        checked={preferences.defaultLength === option.value}
                        onChange={(e) => setPreferences({...preferences, defaultLength: e.target.value as any})}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  預設禱告語調
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: 'formal', label: '正式' },
                    { value: 'casual', label: '親切' },
                    { value: 'traditional', label: '傳統' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        value={option.value}
                        checked={preferences.defaultTone === option.value}
                        onChange={(e) => setPreferences({...preferences, defaultTone: e.target.value as any})}
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主題設定
                </label>
                <select
                  value={preferences.theme}
                  onChange={(e) => setPreferences({...preferences, theme: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">淺色主題</option>
                  <option value="dark">深色主題</option>
                  <option value="system">跟隨系統</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.enableNotifications}
                    onChange={(e) => setPreferences({...preferences, enableNotifications: e.target.checked})}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">啟用通知</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.enableCloudSync}
                    onChange={(e) => setPreferences({...preferences, enableCloudSync: e.target.checked})}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">啟用雲端同步</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? '更新中...' : '更新偏好設定'}
              </button>
            </form>
          )}

          {/* 同步狀態標籤 */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800">雲端同步狀態</h3>
                  {syncStatus.isOnline ? (
                    <div className="flex items-center text-green-600">
                      <Cloud className="h-4 w-4 mr-1" />
                      在線
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <CloudOff className="h-4 w-4 mr-1" />
                      離線
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>最後同步時間:</span>
                    <span>
                      {syncStatus.lastSyncAt 
                        ? new Intl.DateTimeFormat('zh-TW', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(syncStatus.lastSyncAt)
                        : '尚未同步'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>待上傳項目:</span>
                    <span>{syncStatus.pendingUploads}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>待下載項目:</span>
                    <span>{syncStatus.pendingDownloads}</span>
                  </div>
                </div>

                {syncStatus.syncError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{syncStatus.syncError}</p>
                  </div>
                )}
              </div>

              <button
                onClick={manualSync}
                disabled={!syncStatus.isOnline}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                <Cloud className="h-4 w-4 mr-2" />
                手動同步
              </button>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="border-t p-6">
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            登出
          </button>
        </div>
      </div>
    </div>
  );
}
