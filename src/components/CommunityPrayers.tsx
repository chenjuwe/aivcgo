import { useState, useEffect } from 'react';
import { Users, Heart, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import { PrayerCloudService } from '../services/cloudStorage';
import { SharedPrayer, Prayer } from '../types';
import { categoryNames } from '../utils/prayerTemplates';

import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export function CommunityPrayers() {
  const { user } = useAuth();
  const [sharedPrayers, setSharedPrayers] = useState<(SharedPrayer & { prayer: Prayer })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cloudService = user ? new PrayerCloudService(user.uid) : null;

  const loadSharedPrayers = async () => {
    if (!cloudService) return;

    try {
      const prayers = await cloudService.getSharedPrayers(20);
      setSharedPrayers(prayers);
    } catch (error) {
      console.error('載入社群禱告失敗:', error);
      toast.error('載入社群禱告失敗');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSharedPrayers();
  };

  useEffect(() => {
    if (user) {
      loadSharedPrayers();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-7xl md:max-w-9xl 3xl:max-w-10xl 4xl:max-w-11xl 5xl:max-w-12xl">
        <div className="text-center py-12">
          <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">社群禱告</h2>
          <p className="text-gray-600 mb-6">與其他信徒分享和交流禱告內容</p>
          <p className="text-gray-500">請先登入以查看社群分享的禱告</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-11xl 4xl:max-w-12xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <Users className="inline mr-2 text-purple-500" />
          社群禱告
        </h1>
        <p className="text-gray-600">與其他信徒分享和交流禱告內容，共同成長</p>
      </div>

      {/* 頭部操作 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">最新分享</h2>
            <p className="text-gray-600 text-sm">探索其他用戶分享的美好禱告</p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-md transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? '載入中...' : '重新載入'}
          </button>
        </div>
      </div>

      {/* 社群禱告列表 */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">載入社群禱告中...</p>
          </div>
        ) : sharedPrayers.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">還沒有分享的禱告</h3>
            <p className="text-gray-600 mb-6">成為第一個分享禱告到社群的用戶吧！</p>
            <p className="text-gray-500 text-sm">
              在禱告生成器中生成禱告後，點擊「分享到社群」即可與其他用戶分享
            </p>
          </div>
        ) : (
          sharedPrayers.map((sharedPrayer) => (
            <div key={sharedPrayer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* 分享者資訊 */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {sharedPrayer.sharedByName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{sharedPrayer.sharedByName}</p>
                      <p className="text-gray-500 text-sm flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        分享於 {format(sharedPrayer.sharedAt, 'yyyy年MM月dd日 HH:mm')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {sharedPrayer.likes} 個讚
                    </div>
                  </div>
                </div>
              </div>

              {/* 禱告內容 */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {categoryNames[sharedPrayer.prayer.category]}
                  </span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {sharedPrayer.prayer.content}
                  </p>
                </div>

                {/* 互動按鈕 */}
                <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                  <button className="flex items-center px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                    <Heart className="h-4 w-4 mr-2" />
                    讚 ({sharedPrayer.likes})
                  </button>
                  
                  <button 
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(sharedPrayer.prayer.content);
                        toast.success('禱告已複製到剪貼板！');
                      } catch (error) {
                        toast.error('複製失敗');
                      }
                    }}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    複製禱告
                  </button>
                  
                  <button 
                    onClick={async () => {
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: `${categoryNames[sharedPrayer.prayer.category]} - 來自 ${sharedPrayer.sharedByName}`,
                            text: sharedPrayer.prayer.content,
                            url: window.location.href
                          });
                        } catch (error) {
                          // 用戶取消或分享失敗
                        }
                      }
                    }}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-md transition-colors"
                  >
                    分享
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 載入更多 */}
      {sharedPrayers.length >= 20 && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors">
            載入更多
          </button>
        </div>
      )}

      {/* 使用提示 */}
      <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-800 mb-3">社群使用提示</h3>
        <ul className="text-purple-700 space-y-2 text-sm">
          <li>• 在禱告生成器中點擊「分享到社群」來分享您的禱告</li>
          <li>• 為其他用戶的禱告點讚，表達您的共鳴和支持</li>
          <li>• 複製喜歡的禱告內容，用於您的個人靈修時間</li>
          <li>• 尊重每個人的信仰表達，保持友善和包容的態度</li>
          <li>• 分享的禱告將幫助更多人在信仰路上得到鼓勵</li>
        </ul>
      </div>
    </div>
  );
}
