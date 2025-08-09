import { useState } from 'react';
import { Users, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { getAllCharacters, CharacterProfile } from '../utils/characterProfiles';
import { categoryNames } from '../utils/prayerTemplates';

interface CharacterGalleryProps {
  onCharacterSelect?: (characterId: string) => void;
}

export function CharacterGallery({ onCharacterSelect }: CharacterGalleryProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterProfile | null>(null);
  const characters = getAllCharacters();

  const handleCharacterClick = (character: CharacterProfile) => {
    setSelectedCharacter(character);
  };

  const handleUseCharacter = (characterId: string) => {
    if (onCharacterSelect) {
      onCharacterSelect(characterId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <Users className="inline mr-2 text-purple-500" />
          禱告角色庫
        </h1>
        <p className="text-gray-600">選擇一個角色，體驗個人化的禱告內容</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 角色列表 */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => handleCharacterClick(character)}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                  selectedCharacter?.id === character.id ? 'ring-2 ring-purple-500 shadow-lg' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-4xl">{character.avatar}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{character.name}</h3>
                      <p className="text-gray-600 text-sm">{character.description}</p>
                    </div>
                  </div>

                  {/* 性格特質 */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {character.personality.slice(0, 3).map((trait, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 偏好禱告類型 */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">偏好禱告類型：</p>
                    <div className="flex flex-wrap gap-1">
                      {character.preferredCategories.slice(0, 3).map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {categoryNames[category]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 使用按鈕 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseCharacter(character.id);
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    使用此角色禱告
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 角色詳情 */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {selectedCharacter ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-6">
                  <span className="text-6xl mb-4 block">{selectedCharacter.avatar}</span>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedCharacter.name}</h2>
                  <p className="text-gray-600">{selectedCharacter.description}</p>
                </div>

                {/* 背景故事 */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">背景故事</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedCharacter.background}</p>
                </div>

                {/* 性格特質 */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">性格特質</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.personality.map((trait, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 禱告偏好 */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">禱告偏好</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">語調風格：</span>
                      <span className="text-sm font-medium text-gray-800">
                        {selectedCharacter.prayerStyle === 'formal' ? '正式' :
                         selectedCharacter.prayerStyle === 'casual' ? '親切' : '傳統'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">偏好類型：</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedCharacter.preferredCategories.map((category, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                          >
                            {categoryNames[category]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 常見需求 */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">常見禱告需求</h3>
                  <div className="space-y-1">
                    {selectedCharacter.commonNeeds.map((need, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <Heart className="h-3 w-3 mr-2 text-red-400" />
                        {need}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 使用按鈕 */}
                <button
                  onClick={() => handleUseCharacter(selectedCharacter.id)}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium rounded-md transition-all duration-300 transform hover:scale-105"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  開始用{selectedCharacter.name}禱告
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">選擇一個角色</h3>
                <p className="text-gray-500 text-sm">
                  點擊左側的角色卡片來查看詳細資訊
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 使用提示 */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border-l-4 border-purple-500">
        <h3 className="font-semibold text-purple-800 mb-3">如何使用角色禱告</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
          <div>
            <h4 className="font-medium mb-2">🎭 角色特色</h4>
            <ul className="space-y-1">
              <li>• 每個角色都有獨特的背景和性格</li>
              <li>• 禱告內容會反映角色的特點</li>
              <li>• 語言風格符合角色身份</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🙏 個人化體驗</h4>
            <ul className="space-y-1">
              <li>• 根據角色生活情境生成禱告</li>
              <li>• 提供角色常見的禱告需求</li>
              <li>• 幫助您從不同角度體驗信仰</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
