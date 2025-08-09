import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigation } from './components/Navigation';
import { PrayerGenerator } from './components/PrayerGenerator';
import { PrayerHistory } from './components/PrayerHistory';
import { CommunityPrayers } from './components/CommunityPrayers';
import { CharacterGallery } from './components/CharacterGallery';
import { usePrayerStorage } from './hooks/usePrayerStorage';
import { useAuth } from './hooks/useAuth';
import { PrayerCard } from './components/PrayerCard';

function App() {
  const [currentView, setCurrentView] = useState('generator');
  const { user } = useAuth();
  const { getFavoritePrayers, toggleFavorite, deletePrayer, sharePrayer } = usePrayerStorage();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'generator':
        return <PrayerGenerator />;
      
      case 'characters':
        return <CharacterGallery onCharacterSelect={() => {
          // 切換到生成器頁面並選擇角色
          setCurrentView('generator');
          // 這裡可以通過狀態管理來傳遞角色選擇
        }} />;
      
      case 'history':
        return <PrayerHistory />;
      
      case 'favorites':
        return (
          <div className="max-w-6xl mx-auto p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">我的收藏</h1>
              <p className="text-gray-600">您收藏的珍貴禱告內容</p>
            </div>
            
            <div className="space-y-4">
              {getFavoritePrayers().length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">💝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">還沒有收藏的禱告</h3>
                  <p className="text-gray-600 mb-6">在禱告歷史中點擊愛心來收藏您喜愛的禱告</p>
                  <button
                    onClick={() => setCurrentView('history')}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    瀏覽禱告歷史
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {getFavoritePrayers().map(prayer => (
                    <PrayerCard
                      key={prayer.id}
                      prayer={prayer}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deletePrayer}
                      onShare={user ? sharePrayer : undefined}
                      showSyncStatus={!!user}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'community':
        return <CommunityPrayers />;
      
      default:
        return <PrayerGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 導航欄 */}
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      {/* 主要內容區域 */}
      <main className="pb-8">
        {renderCurrentView()}
      </main>

      {/* 頁腳 */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">關於禱告生成器</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                智能禱告生成器幫助您創造個人化的禱告內容，
                支援多種禱告類型和語調，讓您的靈修時光更加豐富。
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">功能特色</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• 智能禱告內容生成</li>
                <li>• 雲端同步與備份</li>
                <li>• 社群分享功能</li>
                <li>• 個人化設定</li>
                <li>• 禱告歷史管理</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">使用提示</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• 選擇合適的禱告類型</li>
                <li>• 描述具體的禱告需求</li>
                <li>• 保存喜愛的禱告內容</li>
                <li>• 與社群分享美好見證</li>
                <li>• 定期回顧禱告歷程</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 智能禱告生成器. 願神祝福您的每一個禱告時光.
            </p>
          </div>
        </div>
      </footer>

      {/* Toast 通知 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
