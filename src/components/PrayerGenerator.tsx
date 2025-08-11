import { useState, useEffect } from 'react';
import { Sparkles, Heart, Settings, RefreshCw, Share2, BookOpen, Lightbulb } from 'lucide-react';
import { PrayerCategory, PrayerRequest } from '../types';
import { generatePrayer, categoryNames, categoryDescriptions, getDailyVerse } from '../utils/prayerTemplates';
import { generateCharacterPrayer } from '../utils/characterProfiles';
import { usePrayerStorage } from '../hooks/usePrayerStorage';
import { useAuth } from '../hooks/useAuth';
import { CharacterSelector } from './CharacterSelector';
import { CharacterCreator } from './CharacterCreator';
import toast from 'react-hot-toast';

export function PrayerGenerator() {
  const { user } = useAuth();
  const { addPrayer, sharePrayer } = usePrayerStorage();
  
  const [request, setRequest] = useState<PrayerRequest>({
    category: user?.preferences?.defaultCategory || 'gratitude',
    length: user?.preferences?.defaultLength || 'medium',
    tone: user?.preferences?.defaultTone || 'formal',
    specificNeeds: '',
    characterId: undefined
  });
  
  const [generatedPrayer, setGeneratedPrayer] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dailyVerse] = useState(getDailyVerse());
  const [showCharacterCreator, setShowCharacterCreator] = useState(false);

  // 當用戶偏好改變時更新預設值
  useEffect(() => {
    if (user?.preferences) {
      setRequest(prev => ({
        ...prev,
        category: user.preferences.defaultCategory,
        length: user.preferences.defaultLength,
        tone: user.preferences.defaultTone
      }));
    }
  }, [user?.preferences]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // 模擬生成延遲，增加真實感
    setTimeout(() => {
      let prayer: string;
      
      // 如果選擇了角色，使用角色專用的禱告生成
      if (request.characterId) {
        const characterPrayer = generateCharacterPrayer(
          request.characterId,
          request.category,
          request.specificNeeds,
          request.length
        );
        prayer = characterPrayer || generatePrayer(request);
      } else {
        prayer = generatePrayer(request);
      }
      
      setGeneratedPrayer(prayer);
      setIsGenerating(false);
      
      // 播放成功音效（如果瀏覽器支持）
      if ('speechSynthesis' in window && user?.preferences?.enableNotifications) {
        // 可以在這裡添加音效提示
      }
    }, 1500);
  };

  const handleSave = async () => {
    if (generatedPrayer) {
      try {
        await addPrayer(generatedPrayer, request.category, []);
        toast.success('禱告已保存！');
      } catch (error) {
        toast.error('保存失敗，請稍後重試');
      }
    }
  };

  const handleShare = async () => {
    if (!generatedPrayer) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${categoryNames[request.category]} - 智能禱告生成器`,
          text: generatedPrayer,
          url: window.location.href
        });
      } catch (error) {
        // 用戶取消分享或分享失敗，使用複製到剪貼板
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    if (generatedPrayer) {
      try {
        await navigator.clipboard.writeText(generatedPrayer);
        toast.success('禱告已複製到剪貼板！');
      } catch (error) {
        toast.error('複製失敗');
      }
    }
  };

  const handleShareToCommunity = async () => {
    if (!user) {
      toast.error('請先登入以分享到社群');
      return;
    }

    if (!generatedPrayer) return;

    try {
      // 先保存禱告
      const savedPrayer = await addPrayer(generatedPrayer, request.category, ['社群分享']);
      // 然後分享到社群
      await sharePrayer(savedPrayer.id);
    } catch (error) {
      console.error('分享到社群失敗:', error);
    }
  };

  const handleQuickGenerate = (category: PrayerCategory) => {
    const newRequest = { ...request, category };
    setRequest(newRequest);
    // 自動生成
    setTimeout(() => {
      let prayer: string;
      
      if (newRequest.characterId) {
        const characterPrayer = generateCharacterPrayer(
          newRequest.characterId,
          category,
          newRequest.specificNeeds,
          newRequest.length
        );
        prayer = characterPrayer || generatePrayer(newRequest);
      } else {
        prayer = generatePrayer(newRequest);
      }
      
      setGeneratedPrayer(prayer);
    }, 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl md:max-w-9xl 3xl:max-w-10xl 4xl:max-w-11xl 5xl:max-w-12xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          <Sparkles className="inline mr-2 text-blue-500" />
          禱告生成（附加功能）
        </h1>
        <p className="text-gray-600 text-lg">附加功能：為選定人物生成禱告內容</p>
        
        {/* 每日經文 */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start space-x-3">
            <BookOpen className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div className="text-left">
              <p className="text-gray-700 italic">"{dailyVerse.verse}"</p>
              <p className="text-blue-600 font-medium text-sm mt-1">— {dailyVerse.reference}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 快速選擇按鈕 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          快速生成
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(categoryNames).map(([key, name]) => (
            <button
              key={key}
              onClick={() => handleQuickGenerate(key as PrayerCategory)}
              className={`p-3 rounded-md text-sm font-medium transition-colors ${
                request.category === key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* 詳細設定區域 */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          <Settings className="inline mr-2" />
          詳細設定
        </h2>

        {/* 角色選擇器 */}
        <CharacterSelector
          selectedCharacterId={request.characterId}
          onCharacterSelect={(characterId) => setRequest({...request, characterId})}
          onRecommendationSelect={(recommendation) => 
            setRequest({...request, specificNeeds: recommendation})
          }
          onCreateCharacter={() => setShowCharacterCreator(true)}
        />

        {/* 禱告類型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            禱告類型
          </label>
          <select
            value={request.category}
            onChange={(e) => setRequest({...request, category: e.target.value as PrayerCategory})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(categoryNames).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {categoryDescriptions[request.category]}
          </p>
        </div>

        {/* 禱告長度和語調 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              禱告長度
            </label>
            <div className="space-y-2">
              {[
                { value: 'short', label: '簡短', desc: '2-3句話' },
                { value: 'medium', label: '中等', desc: '3-5句話' },
                { value: 'long', label: '詳細', desc: '5-7句話' }
              ].map((option) => (
                <label key={option.value} className="flex items-center p-2 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value={option.value}
                    checked={request.length === option.value}
                    onChange={(e) => setRequest({...request, length: e.target.value as any})}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              禱告語調
            </label>
            <div className="space-y-2">
              {[
                { value: 'formal', label: '正式', desc: '莊重恭敬的語調' },
                { value: 'casual', label: '親切', desc: '溫暖親近的語調' },
                { value: 'traditional', label: '傳統', desc: '古典莊嚴的語調' }
              ].map((option) => (
                <label key={option.value} className="flex items-center p-2 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value={option.value}
                    checked={request.tone === option.value}
                    onChange={(e) => setRequest({...request, tone: e.target.value as any})}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 特殊需求 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            特殊需求 (可選)
          </label>
          <textarea
            value={request.specificNeeds}
            onChange={(e) => setRequest({...request, specificNeeds: e.target.value})}
            placeholder="例如：為家人的健康、工作順利、考試成功、內心平安等..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <p className="text-sm text-gray-500 mt-1">
            描述您希望在禱告中特別提及的事項
          </p>
        </div>

        {/* 生成按鈕 */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-blue-300 disabled:to-purple-300 text-white font-medium py-4 px-6 rounded-md transition-all duration-300 flex items-center justify-center text-lg"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="animate-spin mr-2 h-6 w-6" />
              正在生成禱告...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-6 w-6" />
              生成禱告
            </>
          )}
        </button>
      </div>

      {/* 生成的禱告 */}
      {generatedPrayer && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Heart className="mr-2 h-5 w-5" />
              您的禱告 - {categoryNames[request.category]}
            </h3>
          </div>
          
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6 border-l-4 border-blue-500">
              <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                {generatedPrayer}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                <Heart className="mr-2 h-4 w-4" />
                保存
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
              >
                <Share2 className="mr-2 h-4 w-4" />
                分享
              </button>

              {user && (
                <button
                  onClick={handleShareToCommunity}
                  className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  分享到社群
                </button>
              )}
              
              <button
                onClick={handleGenerate}
                className="flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                重新生成
              </button>
            </div>

            {/* 禱告統計 */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500 space-y-1">
                <p>字數: {generatedPrayer.length} 字</p>
                <p>預估閱讀時間: {Math.ceil(generatedPrayer.length / 200)} 分鐘</p>
                <p>生成時間: {new Date().toLocaleString('zh-TW')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 使用提示 */}
      {!generatedPrayer && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">使用提示</h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>• 選擇適合您當前需要的禱告類型</li>
            <li>• 在特殊需求中描述具體的禱告事項</li>
            <li>• 可以多次生成直到找到合適的禱告</li>
            <li>• 保存喜愛的禱告以便日後回顧</li>
            <li>• 登入後可享受雲端同步功能</li>
          </ul>
        </div>
      )}

      {/* 角色創建器 */}
      <CharacterCreator
        isOpen={showCharacterCreator}
        onClose={() => setShowCharacterCreator(false)}
      />
    </div>
  );
}
