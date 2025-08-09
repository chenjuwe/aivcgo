import { useState } from 'react';
import { User, ChevronDown, ChevronUp, Sparkles, Plus } from 'lucide-react';
import { CharacterProfile, getAllCharacters, getCharacterRecommendations } from '../utils/characterProfiles';
import { useCustomCharacters } from '../hooks/useCustomCharacters';
import { useAuth } from '../hooks/useAuth';
import { CustomCharacter } from '../types';

interface CharacterSelectorProps {
  selectedCharacterId?: string;
  onCharacterSelect: (characterId: string | undefined) => void;
  onRecommendationSelect?: (recommendation: string) => void;
  onCreateCharacter?: () => void;
}

export function CharacterSelector({ 
  selectedCharacterId, 
  onCharacterSelect, 
  onRecommendationSelect,
  onCreateCharacter
}: CharacterSelectorProps) {
  const { user } = useAuth();
  const { getUserCharacters } = useCustomCharacters();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const defaultCharacters = getAllCharacters();
  const customCharacters = getUserCharacters();
  const allCharacters = [...defaultCharacters, ...customCharacters];
  
  const selectedCharacter = allCharacters.find(c => c.id === selectedCharacterId) || 
                           defaultCharacters.find(c => c.id === selectedCharacterId);
  
  const recommendations = selectedCharacterId ? 
    (getCharacterRecommendations(selectedCharacterId) || 
     customCharacters.find(c => c.id === selectedCharacterId)?.commonNeeds || []) : [];

  const handleCharacterSelect = (character: CharacterProfile | CustomCharacter | null) => {
    onCharacterSelect(character?.id);
    setIsExpanded(false);
  };

  return (
    <div className="space-y-4">
      {/* 角色選擇器 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          選擇禱告角色 (可選)
        </label>
        
        <div className="relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <div className="flex items-center space-x-3">
              {selectedCharacter ? (
                <>
                  <span className="text-2xl">{selectedCharacter.avatar}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{selectedCharacter.name}</div>
                    <div className="text-sm text-gray-500">{selectedCharacter.description}</div>
                  </div>
                </>
              ) : (
                <>
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-500">選擇一個角色來獲得個人化禱告</span>
                </>
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {/* 角色列表 */}
          {isExpanded && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
              {/* 清除選擇選項 */}
              <button
                onClick={() => handleCharacterSelect(null)}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 border-b border-gray-100"
              >
                <User className="h-5 w-5 text-gray-400" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">不選擇角色</div>
                  <div className="text-sm text-gray-500">使用通用禱告模板</div>
                </div>
              </button>

              {/* 預設角色 */}
              {defaultCharacters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => handleCharacterSelect(character)}
                  className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors ${
                    selectedCharacterId === character.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <span className="text-2xl">{character.avatar}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{character.name}</div>
                    <div className="text-sm text-gray-500">{character.description}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {character.personality.slice(0, 3).map((trait, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}

              {/* 自訂角色分隔線 */}
              {user && customCharacters.length > 0 && (
                <div className="px-3 py-2 bg-gray-100 border-t border-gray-200">
                  <div className="text-xs font-medium text-gray-600">我的自訂角色</div>
                </div>
              )}

              {/* 自訂角色 */}
              {user && customCharacters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => handleCharacterSelect(character)}
                  className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors ${
                    selectedCharacterId === character.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                  }`}
                >
                  <span className="text-2xl">{character.avatar}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 flex items-center">
                      {character.name}
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        自訂
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{character.description}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {character.personality.slice(0, 3).map((trait, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}

              {/* 創建新角色按鈕 */}
              {user && onCreateCharacter && (
                <button
                  onClick={() => {
                    onCreateCharacter();
                    setIsExpanded(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-purple-50 transition-colors border-t border-gray-200"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-purple-600">創建新角色</div>
                    <div className="text-sm text-purple-500">設計您的專屬禱告角色</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 選中角色的詳細信息 */}
      {selectedCharacter && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">{selectedCharacter.avatar}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">{selectedCharacter.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{selectedCharacter.background}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">性格特質</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCharacter.personality.map((trait, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-white text-gray-600 text-xs rounded border"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">禱告風格</h4>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {selectedCharacter.prayerStyle === 'formal' ? '正式' : 
                     selectedCharacter.prayerStyle === 'casual' ? '親切' : '傳統'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 推薦禱告需求 */}
      {recommendations.length > 0 && onRecommendationSelect && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
            {selectedCharacter?.name}的常見禱告需求
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendations.map((recommendation, index) => (
              <button
                key={index}
                onClick={() => onRecommendationSelect(recommendation)}
                className="px-3 py-1 bg-white border border-gray-300 hover:bg-blue-50 hover:border-blue-300 text-gray-700 text-sm rounded-full transition-colors"
              >
                {recommendation}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            點擊上方標籤快速填入特殊需求
          </p>
        </div>
      )}
    </div>
  );
}
