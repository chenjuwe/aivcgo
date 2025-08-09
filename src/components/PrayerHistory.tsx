import { useState, useMemo } from 'react';
import { Clock, Heart, Filter, Search, Download, Upload } from 'lucide-react';
import { PrayerCategory } from '../types';
import { usePrayerStorage } from '../hooks/usePrayerStorage';
import { useAuth } from '../hooks/useAuth';
import { categoryNames } from '../utils/prayerTemplates';
import { PrayerCard } from './PrayerCard';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export function PrayerHistory() {
  const { user } = useAuth();
  const { prayers, toggleFavorite, deletePrayer, sharePrayer, syncStatus } = usePrayerStorage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<PrayerCategory | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'category'>('newest');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // 篩選和搜尋邏輯
  const filteredPrayers = useMemo(() => {
    let filtered = prayers;

    // 文字搜尋
    if (searchTerm) {
      filtered = filtered.filter(prayer =>
        prayer.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prayer.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 分類篩選
    if (filterCategory !== 'all') {
      filtered = filtered.filter(prayer => prayer.category === filterCategory);
    }

    // 收藏篩選
    if (showFavoritesOnly) {
      filtered = filtered.filter(prayer => prayer.isFavorite);
    }

    // 日期範圍篩選
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(prayer => {
        const prayerDate = new Date(prayer.createdAt);
        
        switch (dateRange) {
          case 'today':
            return prayerDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return prayerDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return prayerDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // 排序
    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'category':
        return filtered.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return filtered;
    }
  }, [prayers, searchTerm, filterCategory, showFavoritesOnly, sortBy, dateRange]);

  // 統計資料
  const stats = useMemo(() => {
    const totalPrayers = prayers.length;
    const favoritePrayers = prayers.filter(p => p.isFavorite).length;
    const categoryStats = prayers.reduce((acc, prayer) => {
      acc[prayer.category] = (acc[prayer.category] || 0) + 1;
      return acc;
    }, {} as Record<PrayerCategory, number>);

    return {
      total: totalPrayers,
      favorites: favoritePrayers,
      categories: categoryStats
    };
  }, [prayers]);

  const handleExportPrayers = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        prayers: prayers.map(prayer => ({
          content: prayer.content,
          category: prayer.category,
          createdAt: prayer.createdAt,
          isFavorite: prayer.isFavorite,
          tags: prayer.tags
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prayers_export_${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('禱告記錄已匯出');
    } catch (error) {
      toast.error('匯出失敗');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setShowFavoritesOnly(false);
    setSortBy('newest');
    setDateRange('all');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <Clock className="inline mr-2 text-blue-500" />
          禱告歷史
        </h1>
        <p className="text-gray-600">回顧您過去的禱告內容，見證信仰的成長軌跡</p>
        
        {/* 同步狀態指示 */}
        {user && (
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              {syncStatus.isOnline ? (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  雲端同步已啟用
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  離線模式
                </div>
              )}
            </div>
            
            {syncStatus.pendingUploads > 0 && (
              <div className="flex items-center text-orange-600">
                <Upload className="h-4 w-4 mr-1" />
                {syncStatus.pendingUploads} 項待同步
              </div>
            )}
          </div>
        )}
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">總計禱告</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">收藏禱告</p>
              <p className="text-2xl font-bold">{stats.favorites}</p>
            </div>
            <Heart className="h-8 w-8 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">最常用類型</p>
              <p className="text-lg font-bold">
                {Object.entries(stats.categories).length > 0
                  ? categoryNames[Object.entries(stats.categories).sort(([,a], [,b]) => b - a)[0][0] as PrayerCategory]
                  : '暫無記錄'
                }
              </p>
            </div>
            <Filter className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* 搜尋和篩選控制 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">篩選和搜尋</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleExportPrayers}
              className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-1" />
              匯出
            </button>
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors text-sm"
            >
              清除篩選
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 搜尋框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋禱告內容..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 分類篩選 */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as PrayerCategory | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有類型</option>
            {Object.entries(categoryNames).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>

          {/* 日期範圍 */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有時間</option>
            <option value="today">今天</option>
            <option value="week">最近一週</option>
            <option value="month">最近一個月</option>
          </select>

          {/* 排序方式 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">最新優先</option>
            <option value="oldest">最舊優先</option>
            <option value="category">按類型排序</option>
          </select>
        </div>

        {/* 額外篩選選項 */}
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">只顯示收藏</span>
          </label>
        </div>

        {/* 篩選結果摘要 */}
        <div className="mt-4 text-sm text-gray-600">
          {searchTerm || filterCategory !== 'all' || showFavoritesOnly || dateRange !== 'all' ? (
            <p>找到 {filteredPrayers.length} 個符合條件的禱告</p>
          ) : (
            <p>顯示全部 {prayers.length} 個禱告</p>
          )}
        </div>
      </div>

      {/* 禱告列表 */}
      <div className="space-y-4">
        {filteredPrayers.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {prayers.length === 0 ? (
              <>
                <p className="text-gray-500 text-lg">還沒有禱告記錄</p>
                <p className="text-gray-400">開始生成您的第一個禱告吧！</p>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-lg">沒有符合條件的禱告</p>
                <p className="text-gray-400">試試調整篩選條件</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPrayers.map(prayer => (
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

      {/* 載入更多按鈕（如果需要分頁） */}
      {filteredPrayers.length > 0 && filteredPrayers.length >= 20 && (
        <div className="text-center">
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
            載入更多禱告
          </button>
        </div>
      )}
    </div>
  );
}
