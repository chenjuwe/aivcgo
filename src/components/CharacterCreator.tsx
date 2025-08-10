import { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Minus
} from 'lucide-react';
import { CustomCharacter, PrayerCategory } from '../types';
import { categoryNames } from '../utils/prayerTemplates';
import { 
  characterTemplates, 
  personalityOptions, 
  interestOptions, 
  challengeOptions, 
  occupationOptions, 
  avatarOptions,
  createCharacterFromTemplate 
} from '../utils/characterTemplates';
import { useCustomCharacters } from '../hooks/useCustomCharacters';
import toast from 'react-hot-toast';
import { useNameWorker } from '@/hooks/useNameWorker';

interface CharacterCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  editingCharacter?: CustomCharacter;
}

export function CharacterCreator({ isOpen, onClose, editingCharacter }: CharacterCreatorProps) {
  const { createCharacter, updateCharacter } = useCustomCharacters();
  const [currentStep, setCurrentStep] = useState(1);
  const [, setSelectedTemplate] = useState<string>('');
  const { generate, loading } = useNameWorker();

  const [formData, setFormData] = useState<Partial<CustomCharacter>>({
    name: '',
    description: '',
    avatar: '👤',
    background: '',
    personality: [],
    age: undefined,
    occupation: '',
    location: '',
    interests: [],
    challenges: [],
    preferredCategories: [],
    prayerStyle: 'casual',
    commonNeeds: [],
    isPublic: false
  });

  // 如果是編輯模式，載入現有角色數據
  useEffect(() => {
    if (editingCharacter) {
      setFormData(editingCharacter);
    } else {
      // 重置表單
      setFormData({
        name: '',
        description: '',
        avatar: '👤',
        background: '',
        personality: [],
        age: undefined,
        occupation: '',
        location: '',
        interests: [],
        challenges: [],
        preferredCategories: [],
        prayerStyle: 'casual',
        commonNeeds: [],
        isPublic: false
      });
      setCurrentStep(1);
      setSelectedTemplate('');
    }
  }, [editingCharacter, isOpen]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId) {
      const templateData = createCharacterFromTemplate(templateId, formData);
      setFormData({ ...formData, ...templateData });
    }
    setCurrentStep(2);
  };

  const handleInputChange = (field: keyof CustomCharacter, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field: keyof CustomCharacter, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    if (!currentArray.includes(value)) {
      handleInputChange(field, [...currentArray, value]);
    }
  };

  const handleArrayRemove = (field: keyof CustomCharacter, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    handleInputChange(field, currentArray.filter(item => item !== value));
  };

  const handleSave = () => {
    // 驗證必填欄位
    if (!formData.name?.trim()) {
      toast.error('請輸入角色名稱');
      return;
    }
    if (!formData.description?.trim()) {
      toast.error('請輸入角色描述');
      return;
    }
    if (!formData.personality?.length) {
      toast.error('請選擇至少一個性格特質');
      return;
    }
    if (!formData.preferredCategories?.length) {
      toast.error('請選擇至少一個偏好禱告類型');
      return;
    }

    try {
      if (editingCharacter) {
        updateCharacter(editingCharacter.id, formData);
      } else {
        createCharacter(formData as Omit<CustomCharacter, 'id' | 'createdAt' | 'updatedAt' | 'userId'>);
      }
      onClose();
    } catch (error) {
      toast.error('保存角色失敗');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">選擇角色模板</h3>
              <p className="text-gray-600">選擇一個模板開始創建，或跳過使用空白模板</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {characterTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="text-3xl mb-2">{template.avatar}</div>
                  <div className="font-medium text-gray-800">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.description}</div>
                </button>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => handleTemplateSelect('')}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                跳過，使用空白模板
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
                          <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">基本資訊</h3>
                <p className="text-gray-600">設定角色的基本資訊</p>
              </div>

              <details className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-4">
                <summary className="cursor-pointer text-sm text-purple-700 font-medium">姓名生成設定</summary>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 text-sm">
                  <div>
                    <label className="block text-gray-700 mb-1">性別偏好</label>
                    <select
                      value={(formData as any)._nameGender || 'unisex'}
                      onChange={(e) => handleInputChange('_nameGender' as any, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="unisex">中性</option>
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">允許單字名</label>
                    <select
                      value={(formData as any)._nameSingle || 'no'}
                      onChange={(e) => handleInputChange('_nameSingle' as any, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="no">否（常見雙字名）</option>
                      <option value="yes">是</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">筆畫上限</label>
                    <input
                      type="number"
                      placeholder="如 18"
                      value={(formData as any)._nameMaxStrokes || ''}
                      onChange={(e) => handleInputChange('_nameMaxStrokes' as any, e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">避冷僻字</label>
                    <select
                      value={(formData as any)._nameAvoidRare || 'yes'}
                      onChange={(e) => handleInputChange('_nameAvoidRare' as any, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="yes">是</option>
                      <option value="no">否</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">主題</label>
                    <select
                      value={(formData as any)._nameTheme || ''}
                      onChange={(e) => handleInputChange('_nameTheme' as any, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">無</option>
                      <option value="nature">自然</option>
                      <option value="virtue">品德</option>
                      <option value="bright">光明</option>
                      <option value="family">家庭</option>
                      <option value="study">學業</option>
                      <option value="art">藝術</option>
                      <option value="peace">平安</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Seed（可重現）</label>
                    <input
                      type="text"
                      placeholder="例如 202408"
                      value={(formData as any)._nameSeed || ''}
                      onChange={(e) => handleInputChange('_nameSeed' as any, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </details>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  角色名稱 *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：陳柏宇、林雅庭"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const genderPref = (formData as any)._nameGender as 'male'|'female'|'unisex' | undefined;
                      const allowSingle = ((formData as any)._nameSingle || 'no') === 'yes';
                      const maxStrokes = (formData as any)._nameMaxStrokes as number | undefined;
                      const avoidRare = ((formData as any)._nameAvoidRare || 'yes') === 'yes';
                      const seed = (formData as any)._nameSeed as string | number | undefined;
                      const theme = (formData as any)._nameTheme as any;
                      generate({ 
                        gender: genderPref || 'unisex',
                        allowSingleGiven: allowSingle,
                        maxStrokePerChar: maxStrokes,
                        avoidRareChars: avoidRare,
                        seed,
                        theme,
                        candidateCount: 96,
                      }).then(n => {
                        handleInputChange('name', n.fullName);
                        handleInputChange('_nameReasons' as any, n.meta?.reasons?.join('、') || '');
                      });
                    }}
                    className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md whitespace-nowrap"
                  >
                    隨機姓名
                  </button>
                </div>
                {(formData as any)._nameReasons && (
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2">
                    生成理由：{(formData as any)._nameReasons}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  頭像
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">{formData.avatar}</span>
                  <select
                    value={formData.avatar || '👤'}
                    onChange={(e) => handleInputChange('avatar', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {avatarOptions.map((avatar) => (
                      <option key={avatar} value={avatar}>{avatar}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年齡
                </label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  職業
                </label>
                <select
                  value={formData.occupation || ''}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選擇職業</option>
                  {occupationOptions.map((occupation) => (
                    <option key={occupation} value={occupation}>{occupation}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  居住地
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：台北市、高雄市"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                角色描述 *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="簡單描述這個角色..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                背景故事
              </label>
              <textarea
                value={formData.background || ''}
                onChange={(e) => handleInputChange('background', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="詳細描述角色的背景故事..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">性格特質</h3>
              <p className="text-gray-600">選擇角色的性格特質和興趣</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性格特質 * (已選擇 {formData.personality?.length || 0} 個)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                {personalityOptions.map((trait) => {
                  const isSelected = formData.personality?.includes(trait);
                  return (
                    <button
                      key={trait}
                      onClick={() => {
                        if (isSelected) {
                          handleArrayRemove('personality', trait);
                        } else {
                          handleArrayAdd('personality', trait);
                        }
                      }}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {trait}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                興趣愛好 (已選擇 {formData.interests?.length || 0} 個)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                {interestOptions.map((interest) => {
                  const isSelected = formData.interests?.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => {
                        if (isSelected) {
                          handleArrayRemove('interests', interest);
                        } else {
                          handleArrayAdd('interests', interest);
                        }
                      }}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        isSelected
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                面臨挑戰 (已選擇 {formData.challenges?.length || 0} 個)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                {challengeOptions.map((challenge) => {
                  const isSelected = formData.challenges?.includes(challenge);
                  return (
                    <button
                      key={challenge}
                      onClick={() => {
                        if (isSelected) {
                          handleArrayRemove('challenges', challenge);
                        } else {
                          handleArrayAdd('challenges', challenge);
                        }
                      }}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        isSelected
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {challenge}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">附加：禱告偏好</h3>
              <p className="text-gray-600">（選填）設定角色的禱告風格和偏好</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                禱告風格
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'formal', label: '正式', desc: '莊重恭敬的語調' },
                  { value: 'casual', label: '親切', desc: '溫暖親近的語調' },
                  { value: 'traditional', label: '傳統', desc: '古典莊嚴的語調' }
                ].map((option) => (
                  <label key={option.value} className="flex-1">
                    <input
                      type="radio"
                      value={option.value}
                      checked={formData.prayerStyle === option.value}
                      onChange={(e) => handleInputChange('prayerStyle', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.prayerStyle === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <div className="font-medium text-gray-800">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                偏好主題（附加）* (已選擇 {formData.preferredCategories?.length || 0} 個)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(categoryNames).map(([key, name]) => {
                  const isSelected = formData.preferredCategories?.includes(key as PrayerCategory);
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        if (isSelected) {
                          handleArrayRemove('preferredCategories', key);
                        } else {
                          handleArrayAdd('preferredCategories', key);
                        }
                      }}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                常見禱告需求
              </label>
              <div className="space-y-2">
                {formData.commonNeeds?.map((need, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={need}
                      onChange={(e) => {
                        const newNeeds = [...(formData.commonNeeds || [])];
                        newNeeds[index] = e.target.value;
                        handleInputChange('commonNeeds', newNeeds);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="例如：工作順利、家人健康"
                    />
                    <button
                      onClick={() => {
                        const newNeeds = formData.commonNeeds?.filter((_, i) => i !== index) || [];
                        handleInputChange('commonNeeds', newNeeds);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newNeeds = [...(formData.commonNeeds || []), ''];
                    handleInputChange('commonNeeds', newNeeds);
                  }}
                  className="flex items-center px-3 py-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                                     新增需求（附加）
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic || false}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">公開此角色，讓其他用戶也能使用</span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 頭部 */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <div>
            <h2 className="text-xl font-semibold">
              {editingCharacter ? '編輯角色' : '創建新角色'}
            </h2>
            <p className="text-purple-100 text-sm">
              {editingCharacter ? '修改角色設定' : '創建您的專屬虛擬人物'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 步驟指示器 */}
        {!editingCharacter && (
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">
              步驟 {currentStep} / 4
            </div>
          </div>
        )}

        {/* 內容區域 */}
        <div className="p-6 overflow-y-auto max-h-96">
          {renderStepContent()}
        </div>

        {/* 底部操作 */}
        <div className="border-t p-6">
          <div className="flex justify-between">
            <div>
              {editingCharacter && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  取消
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {!editingCharacter && currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  上一步
                </button>
              )}
              
              {!editingCharacter && currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                >
                  下一步
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingCharacter ? '更新角色' : '創建角色'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
