import { useState } from 'react';
import { 
  Heart, 
  Share2, 
  Copy, 
  Trash2, 
  MoreVertical, 
  Calendar,
  Tag,
  Cloud,
  CloudOff,
  AlertCircle,
  Users
} from 'lucide-react';
import { Prayer } from '../types';
import { categoryNames } from '../utils/prayerTemplates';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface PrayerCardProps {
  prayer: Prayer;
  onToggleFavorite: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  showSyncStatus?: boolean;
  compact?: boolean;
}

export function PrayerCard({ 
  prayer, 
  onToggleFavorite, 
  onDelete, 
  onShare,
  showSyncStatus = false,
  compact = false 
}: PrayerCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${categoryNames[prayer.category]} - 智能禱告生成器`,
          text: prayer.content,
          url: window.location.href
        });
      } catch (error) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
    setShowMenu(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prayer.content);
      toast.success('禱告已複製到剪貼板！');
    } catch (error) {
      toast.error('複製失敗');
    }
    setShowMenu(false);
  };

  const handleShareToCommunity = () => {
    if (onShare) {
      onShare(prayer.id);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (onDelete && confirm('確定要刪除這個禱告嗎？此操作無法撤銷。')) {
      onDelete(prayer.id);
    }
    setShowMenu(false);
  };

  const formatDate = (date: Date) => {
    return format(date, 'yyyy年MM月dd日 HH:mm');
  };

  const getSyncStatusIcon = () => {
    switch (prayer.syncStatus) {
      case 'synced':
        return <Cloud className="h-3 w-3 text-green-500" />;
      case 'pending':
        return <CloudOff className="h-3 w-3 text-orange-500" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const shouldTruncate = !isExpanded && prayer.content.length > 200;
  const displayContent = shouldTruncate 
    ? prayer.content.substring(0, 200) + '...' 
    : prayer.content;

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
      compact ? 'p-4' : 'p-6'
    }`}>
      {/* 頭部資訊 */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium ${
              compact ? 'text-xs px-2' : ''
            }`}>
              {categoryNames[prayer.category]}
            </span>
            
            {prayer.isShared && (
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                <Users className="inline h-3 w-3 mr-1" />
                已分享
              </span>
            )}

            {showSyncStatus && getSyncStatusIcon()}
          </div>
          
          <div className="flex items-center text-gray-500 text-sm space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(prayer.createdAt)}
            </div>
            
            {prayer.tags.length > 0 && (
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span className="truncate max-w-32">
                  {prayer.tags.slice(0, 2).join(', ')}
                  {prayer.tags.length > 2 && '...'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* 操作按鈕 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleFavorite(prayer.id)}
            className={`p-2 rounded-full transition-colors ${
              prayer.isFavorite 
                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
            title={prayer.isFavorite ? '取消收藏' : '加入收藏'}
          >
            <Heart className={`h-5 w-5 ${prayer.isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            
            {/* 下拉選單 */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <button
                      onClick={handleShare}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      分享禱告
                    </button>
                    
                    <button
                      onClick={handleCopy}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      複製內容
                    </button>
                    
                    {onShare && (
                      <button
                        onClick={handleShareToCommunity}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        分享到社群
                      </button>
                    )}
                    
                    {onDelete && (
                      <>
                        <hr className="my-1" />
                        <button
                          onClick={handleDelete}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          刪除禱告
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 禱告內容 */}
      <div className={`bg-gray-50 rounded-md ${compact ? 'p-3' : 'p-4'}`}>
        <p className={`text-gray-800 leading-relaxed whitespace-pre-line ${
          compact ? 'text-sm' : ''
        }`}>
          {displayContent}
        </p>
        
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(true)}
            className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            展開全文
          </button>
        )}
        
        {isExpanded && prayer.content.length > 200 && (
          <button
            onClick={() => setIsExpanded(false)}
            className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            收起
          </button>
        )}
      </div>

      {/* 標籤顯示 */}
      {prayer.tags.length > 0 && !compact && (
        <div className="mt-3 flex flex-wrap gap-2">
          {prayer.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 底部統計資訊 */}
      {!compact && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>字數: {prayer.content.length}</span>
              <span>建立: {format(prayer.createdAt, 'MM/dd')}</span>
              {prayer.updatedAt && prayer.updatedAt !== prayer.createdAt && (
                <span>更新: {format(prayer.updatedAt, 'MM/dd')}</span>
              )}
            </div>
            
            {showSyncStatus && (
              <div className="flex items-center space-x-1">
                {getSyncStatusIcon()}
                <span className="text-xs">
                  {prayer.syncStatus === 'synced' && '已同步'}
                  {prayer.syncStatus === 'pending' && '待同步'}
                  {prayer.syncStatus === 'error' && '同步失敗'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
