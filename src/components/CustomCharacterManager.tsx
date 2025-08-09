import { useState, useRef } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Download, 
  Upload, 
  Search, 
  Eye,
  EyeOff,
  Users,
  Clock
} from 'lucide-react';
import { CustomCharacter, PrayerCategory } from '../types';
import { categoryNames } from '../utils/prayerTemplates';
import { useCustomCharacters } from '../hooks/useCustomCharacters';
import { useAuth } from '../hooks/useAuth';
import { CharacterCreator } from './CharacterCreator';
import { format } from 'date-fns';

export function CustomCharacterManager() {
  const { user } = useAuth();
  const {
    isLoading,
    deleteCharacter,
    duplicateCharacter,
    exportCharacter,
    importCharacter,
    getUserCharacters,
    searchCharacters
  } = useCustomCharacters();

  const [showCreator, setShowCreator] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<CustomCharacter | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<PrayerCategory | 'all'>('all');
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 獲取篩選後的角色列表
  const getFilteredCharacters = () => {
    let filtered = getUserCharacters();

    // 搜尋篩選
    if (searchQuery) {
      filtered = searchCharacters(searchQuery).filter(c => c.userId === user?.uid);
    }

    // 分類篩選
    if (filterCategory !== 'all') {
      filtered = filtered.filter(c => c.preferredCategories.includes(filterCategory));
    }

    // 公開狀態篩選
    if (showPublicOnly) {
      filtered = filtered.filter(c => c.isPublic);
    }

    return filtered;
  };

  const handleEdit = (character: CustomCharacter) => {
    setEditingCharacter(character);
    setShowCreator(true);
  };

  const handleDelete = (character: CustomCharacter) => {
    if (confirm(`確定要刪除角色「${character.name}」嗎？此操作無法撤銷。`)) {
      deleteCharacter(character.id);
    }
  };

  const handleDuplicate = (character: CustomCharacter) => {
    duplicateCharacter(character.id);
  };

  const handleExport = (character: CustomCharacter) => {
    exportCharacter(character.id);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importCharacter(file);
      event.target.value = ''; // 重置文件輸入
    }
  };

  const handleCreatorClose = () => {
    setShowCreator(false);
    setEditingCharacter(undefined);
  };

  // 移除登入要求，允許所有用戶使用自訂角色功能

  const filteredCharacters = getFilteredCharacters();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <Users className="inline mr-2 text-purple-500" />
          自訂角色管理
        </h1>
        <p className="text-gray-600">創建和管理您的專屬禱告角色</p>
        {!user && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg inline-block">
            <p className="text-orange-700 text-sm">
              💡 目前使用本地存儲，登入後可享受雲端同步功能
            </p>
          </div>
        )}
      </div>

      {/* 操作工具欄 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* 搜尋框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋角色..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* 分類篩選 */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as PrayerCategory | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">所有類型</option>
              {Object.entries(categoryNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>

            {/* 公開狀態篩選 */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPublicOnly}
                onChange={(e) => setShowPublicOnly(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">只顯示公開角色</span>
            </label>
          </div>

          <div className="flex space-x-2">
            {/* 匯入按鈕 */}
            <button
              onClick={handleImportClick}
              className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              匯入
            </button>

            {/* 創建按鈕 */}
            <button
              onClick={() => setShowCreator(true)}
              className="flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              創建角色
            </button>
          </div>
        </div>

        {/* 統計資訊 */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              總計：{getUserCharacters().length} 個角色
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              公開：{getUserCharacters().filter(c => c.isPublic).length} 個
            </div>
            <div className="flex items-center">
              <EyeOff className="h-4 w-4 mr-1" />
              私人：{getUserCharacters().filter(c => !c.isPublic).length} 個
            </div>
            {!user && (
              <div className="text-orange-600 text-xs">
                💡 登入後可享受雲端同步功能
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 角色列表 */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">載入角色中...</p>
          </div>
        ) : filteredCharacters.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            {getUserCharacters().length === 0 ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">還沒有自訂角色</h3>
                <p className="text-gray-600 mb-6">創建您的第一個專屬禱告角色</p>
                <button
                  onClick={() => setShowCreator(true)}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
                >
                  開始創建
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">沒有符合條件的角色</h3>
                <p className="text-gray-600">試試調整搜尋或篩選條件</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCharacters.map((character) => (
              <div key={character.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <span className="text-4xl">{character.avatar}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-semibold text-gray-800">{character.name}</h3>
                          {character.isPublic && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              公開
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{character.description}</p>
                        
                        {/* 基本資訊 */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                          {character.age && (
                            <span>年齡：{character.age}歲</span>
                          )}
                          {character.occupation && (
                            <span>職業：{character.occupation}</span>
                          )}
                          {character.location && (
                            <span>地點：{character.location}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(character)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                        title="編輯角色"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(character)}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-md transition-colors"
                        title="複製角色"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExport(character)}
                        className="p-2 text-purple-500 hover:bg-purple-50 rounded-md transition-colors"
                        title="匯出角色"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(character)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="刪除角色"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* 性格特質 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">性格特質</h4>
                    <div className="flex flex-wrap gap-2">
                      {character.personality.slice(0, 6).map((trait, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {character.personality.length > 6 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{character.personality.length - 6} 更多
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 偏好禱告類型 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">偏好禱告類型</h4>
                    <div className="flex flex-wrap gap-2">
                      {character.preferredCategories.map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {categoryNames[category]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 興趣和挑戰 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {character.interests.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">興趣愛好</h4>
                        <div className="flex flex-wrap gap-1">
                          {character.interests.slice(0, 3).map((interest, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                            >
                              {interest}
                            </span>
                          ))}
                          {character.interests.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{character.interests.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {character.challenges.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">面臨挑戰</h4>
                        <div className="flex flex-wrap gap-1">
                          {character.challenges.slice(0, 3).map((challenge, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded"
                            >
                              {challenge}
                            </span>
                          ))}
                          {character.challenges.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{character.challenges.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 底部資訊 */}
                  <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        創建：{format(character.createdAt, 'yyyy/MM/dd')}
                      </div>
                      {character.updatedAt && character.updatedAt !== character.createdAt && (
                        <div className="flex items-center">
                          <Edit className="h-3 w-3 mr-1" />
                          更新：{format(character.updatedAt, 'yyyy/MM/dd')}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span>禱告風格：
                        {character.prayerStyle === 'formal' ? '正式' :
                         character.prayerStyle === 'casual' ? '親切' : '傳統'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 隱藏的文件輸入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 角色創建/編輯模態框 */}
      <CharacterCreator
        isOpen={showCreator}
        onClose={handleCreatorClose}
        editingCharacter={editingCharacter}
      />
    </div>
  );
}
