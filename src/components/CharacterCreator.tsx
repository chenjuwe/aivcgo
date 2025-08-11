import { useState, useEffect, useMemo } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Minus,
  Sparkles,
  User,
  Briefcase,
  Heart,
  Globe,
  Smartphone,
  Settings,
  Target,
  Zap,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Star,
  Palette,
  BookOpen,
  Shield,
  Activity,
  Calendar,
  MapPin,
  GraduationCap,
  Home,
  Wifi,
  Lock,
  Smartphone as Phone,
  Brain,
  Cpu,
  Database,
  Network,
  Zap as Lightning
} from 'lucide-react';
import { CustomCharacter, PrayerCategory, CharacterGenerationRequest, EnhancedCustomCharacter } from '../types';
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
import { 
  generateCharacterProfile, 
  generateMultipleCharacters, 
  GENERATION_FACTORS 
} from '../utils/characterGenerator';

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

  // 生成因子相關狀態
  const [useGenerationFactors, setUseGenerationFactors] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(true);
  const [showFactorDetails, setShowFactorDetails] = useState(true);
  const [showFactorAnalysis, setShowFactorAnalysis] = useState(false);
  const [generationRequest, setGenerationRequest] = useState<CharacterGenerationRequest>({
    gender: undefined,
    ageRange: { min: 18, max: 80 },
    occupation: undefined,
    industry: undefined,
    factorWeights: {
      personality: 0.7,
      faith: 0.8,
      lifestyle: 0.6,
      digital: 0.5,
      career: 0.9
    },
    specificNeeds: [],
    prayerFocus: [],
    seed: '',
    diversity: 0.5,
    realism: 0.8,
    excludeTraits: [],
    excludeOccupations: []
  });

  // 詳細因子設定狀態
  const [detailedFactors, setDetailedFactors] = useState({
    education: '',
    maritalStatus: '',
    techAdoption: '',
    privacySettings: '',
    energyPattern: '',
    participationMode: '',
    communicationStyle: '',
    learningStyle: '',
    industryRole: '',
    skillLevel: '',
    faithPractice: '',
    communityRole: '',
    digitalDevice: '',
    culturalBackground: ''
  });

  // 新增批量生成相關狀態
  const [batchGeneratedCharacters, setBatchGeneratedCharacters] = useState<EnhancedCustomCharacter[]>([]);
  const [showBatchSelection, setShowBatchSelection] = useState(false);
  const [selectedBatchCharacter, setSelectedBatchCharacter] = useState<EnhancedCustomCharacter | null>(null);

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
      setUseGenerationFactors(false);
      setShowAdvancedSettings(false);
      setShowFactorDetails(false);
      setBatchGeneratedCharacters([]);
      setShowBatchSelection(false);
      setSelectedBatchCharacter(null);
      setGenerationRequest({
        gender: undefined,
        ageRange: { min: 18, max: 80 },
        occupation: undefined,
        industry: undefined,
        factorWeights: {
          personality: 0.7,
          faith: 0.8,
          lifestyle: 0.6,
          digital: 0.5,
          career: 0.9
        },
        specificNeeds: [],
        prayerFocus: [],
        seed: '',
        diversity: 0.5,
        realism: 0.8,
        excludeTraits: [],
        excludeOccupations: []
      });
      setDetailedFactors({
        education: '',
        maritalStatus: '',
        techAdoption: '',
        privacySettings: '',
        energyPattern: '',
        participationMode: '',
        communicationStyle: '',
        learningStyle: '',
        industryRole: '',
        skillLevel: '',
        faithPractice: '',
        communityRole: '',
        digitalDevice: '',
        culturalBackground: ''
      });
    }
  }, [editingCharacter, isOpen]);

  // 即時預覽：基於目前的選擇與因子生成預覽角色（不儲存）
  const previewCharacter = useMemo(() => {
    try {
      const enhancedRequest = {
        ...generationRequest,
        specificNeeds: [
          ...(generationRequest.specificNeeds || []),
          ...Object.entries(detailedFactors)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}: ${value}`)
        ]
      };
      return generateCharacterProfile(enhancedRequest);
    } catch {
      return null;
    }
  }, [generationRequest, detailedFactors]);

  // 處理生成因子生成
  const handleGenerateWithFactors = () => {
    try {
      // 合併詳細因子設定到生成請求
      const enhancedRequest = {
        ...generationRequest,
        specificNeeds: [
          ...generationRequest.specificNeeds || [],
          ...Object.entries(detailedFactors)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}: ${value}`)
        ]
      };
      
      const generatedCharacter = generateCharacterProfile(enhancedRequest);
      
      // 將生成的資料填入表單，包括詳細配置
      setFormData({
        ...formData,
        name: generatedCharacter.name,
        description: generatedCharacter.description,
        avatar: generatedCharacter.avatar,
        background: generatedCharacter.background,
        personality: generatedCharacter.personality,
        age: generatedCharacter.age,
        occupation: generatedCharacter.occupation,
        location: generatedCharacter.location,
        interests: generatedCharacter.interests,
        challenges: generatedCharacter.challenges,
        preferredCategories: generatedCharacter.preferredCategories,
        prayerStyle: generatedCharacter.prayerStyle,
        commonNeeds: generatedCharacter.commonNeeds
      });
      
      // 顯示生成成功訊息，包含因子分析
      toast.success(`角色生成成功！使用了 ${Object.keys(enhancedRequest.factorWeights || {}).length} 個生成因子`);
      setCurrentStep(2);
    } catch (error) {
      toast.error('角色生成失敗，請檢查設定');
      console.error('Generation error:', error);
    }
  };

  // 批量生成角色
  const handleBatchGenerate = () => {
    try {
      // 合併詳細因子設定到生成請求
      const enhancedRequest = {
        ...generationRequest,
        specificNeeds: [
          ...generationRequest.specificNeeds || [],
          ...Object.entries(detailedFactors)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}: ${key}`)
        ]
      };
      
      const characters = generateMultipleCharacters(enhancedRequest, 5);
      setBatchGeneratedCharacters(characters);
      setShowBatchSelection(true);
      
      // 顯示生成統計資訊
      const activeFactors = Object.entries(enhancedRequest.factorWeights || {})
        .filter(([_, weight]) => weight > 0.5).length;
      toast.success(`成功生成 ${characters.length} 個角色，使用了 ${activeFactors} 個高權重因子`);
    } catch (error) {
      toast.error('批量生成失敗，請檢查因子設定');
      console.error('Batch generation error:', error);
    }
  };

  // 選擇批量生成的角色
  const handleSelectBatchCharacter = (character: EnhancedCustomCharacter) => {
    setSelectedBatchCharacter(character);
    setFormData({
      ...formData,
      name: character.name,
      description: character.description,
      avatar: character.avatar,
      background: character.background,
      personality: character.personality,
      age: character.age,
      occupation: character.occupation,
      location: character.location,
      interests: character.interests,
      challenges: character.challenges,
      preferredCategories: character.preferredCategories,
      prayerStyle: character.prayerStyle,
      commonNeeds: character.commonNeeds
    });
    setShowBatchSelection(false);
    setCurrentStep(2);
    toast.success('已選擇角色，可以繼續編輯');
  };

  // 重新生成批量角色
  const handleRegenerateBatch = () => {
    handleBatchGenerate();
  };

  // 更新因子權重
  const updateFactorWeight = (factor: keyof CharacterGenerationRequest['factorWeights'], value: number) => {
    setGenerationRequest(prev => ({
      ...prev,
      factorWeights: {
        ...prev.factorWeights!,
        [factor]: value
      }
    }));
  };

  // 添加排除項目
  const addExcludeItem = (type: 'traits' | 'occupations', value: string) => {
    if (type === 'traits') {
      setGenerationRequest(prev => ({
        ...prev,
        excludeTraits: [...(prev.excludeTraits || []), value]
      }));
    } else {
      setGenerationRequest(prev => ({
        ...prev,
        excludeOccupations: [...(prev.excludeOccupations || []), value]
      }));
    }
  };

  // 移除排除項目
  const removeExcludeItem = (type: 'traits' | 'occupations', value: string) => {
    if (type === 'traits') {
      setGenerationRequest(prev => ({
        ...prev,
        excludeTraits: prev.excludeTraits?.filter(item => item !== value) || []
      }));
    } else {
      setGenerationRequest(prev => ({
        ...prev,
        excludeOccupations: prev.excludeOccupations?.filter(item => item !== value) || []
      }));
    }
  };

  // 快速設定生成因子
  const applyQuickPreset = (preset: 'balanced' | 'faith-focused' | 'career-focused' | 'lifestyle-focused' | 'tech-focused' | 'traditional' | 'youth-focused' | 'senior-focused' | 'creative-focused' | 'analytical-focused' | 'family-focused' | 'education-focused' | 'health-focused' | 'social-focused' | 'artistic-focused' | 'business-focused' | 'spiritual-focused' | 'adventure-focused' | 'wisdom-focused' | 'community-focused') => {
    const presets = {
      balanced: { personality: 0.7, faith: 0.7, lifestyle: 0.7, digital: 0.5, career: 0.7 },
      'faith-focused': { personality: 0.6, faith: 0.9, lifestyle: 0.8, digital: 0.3, career: 0.5 },
      'career-focused': { personality: 0.8, faith: 0.5, lifestyle: 0.6, digital: 0.8, career: 0.9 },
      'lifestyle-focused': { personality: 0.8, faith: 0.6, lifestyle: 0.9, digital: 0.7, career: 0.6 },
      'tech-focused': { personality: 0.7, faith: 0.4, lifestyle: 0.5, digital: 0.9, career: 0.8 },
      'traditional': { personality: 0.6, faith: 0.8, lifestyle: 0.7, digital: 0.2, career: 0.6 },
      'youth-focused': { personality: 0.9, faith: 0.4, lifestyle: 0.8, digital: 0.9, career: 0.6 },
      'senior-focused': { personality: 0.5, faith: 0.8, lifestyle: 0.6, digital: 0.3, career: 0.7 },
      'creative-focused': { personality: 0.9, faith: 0.6, lifestyle: 0.8, digital: 0.7, career: 0.5 },
      'analytical-focused': { personality: 0.6, faith: 0.5, lifestyle: 0.4, digital: 0.8, career: 0.9 },
      'family-focused': { personality: 0.8, faith: 0.7, lifestyle: 0.9, digital: 0.4, career: 0.6 },
      'education-focused': { personality: 0.7, faith: 0.6, lifestyle: 0.6, digital: 0.6, career: 0.8 },
      'health-focused': { personality: 0.7, faith: 0.6, lifestyle: 0.9, digital: 0.5, career: 0.5 },
      'social-focused': { personality: 0.9, faith: 0.6, lifestyle: 0.8, digital: 0.7, career: 0.6 },
      'artistic-focused': { personality: 0.9, faith: 0.5, lifestyle: 0.8, digital: 0.6, career: 0.4 },
      'business-focused': { personality: 0.8, faith: 0.5, lifestyle: 0.7, digital: 0.8, career: 0.9 },
      'spiritual-focused': { personality: 0.6, faith: 0.9, lifestyle: 0.7, digital: 0.2, career: 0.4 },
      'adventure-focused': { personality: 0.9, faith: 0.5, lifestyle: 0.9, digital: 0.6, career: 0.5 },
      'wisdom-focused': { personality: 0.8, faith: 0.7, lifestyle: 0.6, digital: 0.4, career: 0.7 },
      'community-focused': { personality: 0.8, faith: 0.7, lifestyle: 0.8, digital: 0.5, career: 0.6 }
    };
    
    setGenerationRequest(prev => ({
      ...prev,
      factorWeights: presets[preset]
    }));
    
    const presetNames = {
      balanced: '平衡',
      'faith-focused': '信仰導向',
      'career-focused': '職涯導向',
      'lifestyle-focused': '生活導向',
      'tech-focused': '科技導向',
      'traditional': '傳統導向',
      'youth-focused': '青年導向',
      'senior-focused': '年長導向',
      'creative-focused': '創意導向',
      'analytical-focused': '分析導向',
      'family-focused': '家庭導向',
      'education-focused': '教育導向',
      'health-focused': '健康導向',
      'social-focused': '社交導向',
      'artistic-focused': '藝術導向',
      'business-focused': '商業導向',
      'spiritual-focused': '靈性導向',
      'adventure-focused': '冒險導向',
      'wisdom-focused': '智慧導向',
      'community-focused': '社群導向'
    };
    
    toast.success(`已套用 ${presetNames[preset]} 設定`);
  };

  // 更新詳細因子設定
  const updateDetailedFactor = (key: keyof typeof detailedFactors, value: string) => {
    setDetailedFactors(prev => ({
      ...prev,
      [key]: value
    }));
  };

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

  // 渲染批量生成選擇介面
  const renderBatchSelection = () => {
    if (!showBatchSelection || batchGeneratedCharacters.length === 0) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-purple-500 to-blue-600 text-white">
            <div>
              <h2 className="text-xl font-semibold">選擇您喜歡的角色</h2>
              <p className="text-purple-100 text-sm">從生成的 5 個角色中選擇一個，或重新生成</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRegenerateBatch}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} />
                重新生成
              </button>
              <button
                onClick={() => setShowBatchSelection(false)}
                className="text-white hover:text-purple-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batchGeneratedCharacters.map((character, index) => (
                <div
                  key={character.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedBatchCharacter?.id === character.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleSelectBatchCharacter(character)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">{character.avatar}</div>
                    <div className="text-xs text-gray-500">#{index + 1}</div>
                  </div>
                  
                  <h3 className="font-medium text-gray-800 mb-2">{character.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{character.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-gray-600">{character.age}歲</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Briefcase size={12} className="text-gray-400" />
                      <span className="text-gray-600">{character.occupation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Heart size={12} className="text-gray-400" />
                      <span className="text-gray-600">{character.personality.slice(0, 2).join('、')}</span>
                    </div>
                  </div>
                  
                  {selectedBatchCharacter?.id === character.id && (
                    <div className="mt-3 flex items-center gap-2 text-blue-600">
                      <CheckCircle size={16} />
                      <span className="text-sm font-medium">已選擇</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t p-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                選擇角色後將自動進入編輯模式
              </div>
              <button
                onClick={() => setShowBatchSelection(false)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">選擇角色創建方式</h3>
              <p className="text-gray-600">選擇一個模板開始創建，使用生成因子，或跳過使用空白模板</p>
            </div>

            {/* 生成因子選項 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-blue-600" size={24} />
                <h4 className="text-lg font-semibold text-blue-800">AI 智能生成因子</h4>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => setShowFactorDetails(!showFactorDetails)}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors"
                  >
                    <Palette size={16} />
                    {showFactorDetails ? '隱藏' : '顯示'}因子詳情
                  </button>
                  <button
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                  >
                    <Settings size={16} />
                    {showAdvancedSettings ? '隱藏' : '顯示'}進階設定
                  </button>
                </div>
              </div>
              <p className="text-blue-700 mb-4">
                使用先進的生成因子系統，基於人口統計、職業經濟、人格特質、信仰系統等維度，智能生成符合現實的角色設定。
              </p>
              
              {/* 快速設定按鈕 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-blue-700 mb-2">快速設定</label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => applyQuickPreset('balanced')}
                    className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                  >
                    平衡設定
                  </button>
                  <button
                    onClick={() => applyQuickPreset('faith-focused')}
                    className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
                  >
                    信仰導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('career-focused')}
                    className="px-3 py-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors"
                  >
                    職涯導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('lifestyle-focused')}
                    className="px-3 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-md transition-colors"
                  >
                    生活導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('tech-focused')}
                    className="px-3 py-1 text-xs bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md transition-colors"
                  >
                    科技導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('traditional')}
                    className="px-3 py-1 text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-md transition-colors"
                  >
                    傳統導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('youth-focused')}
                    className="px-3 py-1 text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-md transition-colors"
                  >
                    青年導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('senior-focused')}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    年長導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('creative-focused')}
                    className="px-3 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-md transition-colors"
                  >
                    創意導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('analytical-focused')}
                    className="px-3 py-1 text-xs bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-md transition-colors"
                  >
                    分析導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('family-focused')}
                    className="px-3 py-1 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-md transition-colors"
                  >
                    家庭導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('education-focused')}
                    className="px-3 py-1 text-xs bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-md transition-colors"
                  >
                    教育導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('health-focused')}
                    className="px-3 py-1 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-md transition-colors"
                  >
                    健康導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('social-focused')}
                    className="px-3 py-1 text-xs bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-md transition-colors"
                  >
                    社交導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('artistic-focused')}
                    className="px-3 py-1 text-xs bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 rounded-md transition-colors"
                  >
                    藝術導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('business-focused')}
                    className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    商業導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('spiritual-focused')}
                    className="px-3 py-1 text-xs bg-lime-100 hover:bg-lime-200 text-lime-700 rounded-md transition-colors"
                  >
                    靈性導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('adventure-focused')}
                    className="px-3 py-1 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-md transition-colors"
                  >
                    冒險導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('wisdom-focused')}
                    className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                  >
                    智慧導向
                  </button>
                  <button
                    onClick={() => applyQuickPreset('community-focused')}
                    className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
                  >
                    社群導向
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">性別</label>
                  <select
                    value={generationRequest.gender || ''}
                    onChange={(e) => setGenerationRequest(prev => ({ 
                      ...prev, 
                      gender: e.target.value || undefined 
                    }))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                  >
                    <option value="">隨機</option>
                    {GENERATION_FACTORS.demographics.gender.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">年齡範圍</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="最小"
                      value={generationRequest.ageRange?.min || ''}
                      onChange={(e) => setGenerationRequest(prev => ({ 
                        ...prev, 
                        ageRange: { 
                          ...prev.ageRange!, 
                          min: parseInt(e.target.value) || 18 
                        } 
                      }))}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                    />
                    <span className="text-blue-600 self-center">-</span>
                    <input
                      type="number"
                      placeholder="最大"
                      value={generationRequest.ageRange?.max || ''}
                      onChange={(e) => setGenerationRequest(prev => ({ 
                        ...prev, 
                        ageRange: { 
                          ...prev.ageRange!, 
                          max: parseInt(e.target.value) || 80 
                        } 
                      }))}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                    />
                  </div>
                </div>
                
                {/* 家庭關係 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">家庭關係</label>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {/* 配偶資訊（詳細） */}
                    <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">配偶姓名</label>
                        <input
                          type="text"
                          placeholder="輸入姓名"
                          value={generationRequest.familyRelations?.spouseDetails?.name || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), name: e.target.value || undefined } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">年齡</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.age?.toString() || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), age: e.target.value ? parseInt(e.target.value) : undefined } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {Array.from({length: 63}, (_,i)=>i+18).map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">職業背景</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.occupationBackground || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), occupationBackground: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {GENERATION_FACTORS.occupationEconomy.industries.flatMap(i=>i.roles).slice(0,80).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">信仰狀況</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.faithStatus || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), faithStatus: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {['無','慕道友','初信者','穩定信徒','成熟信徒'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">教育程度</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.educationLevel || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), educationLevel: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {GENERATION_FACTORS.demographics.education.map(ed => <option key={ed} value={ed}>{ed}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">家庭背景</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.familyBackground || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), familyBackground: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {['基督徒家庭','傳統家庭','單親家庭','其他'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">性格特質</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.personalityTrait || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), personalityTrait: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {GENERATION_FACTORS.personality.patterns.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">興趣愛好</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.interests || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), interests: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {GENERATION_FACTORS.lifestyleInterests.hobbies.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">健康狀況</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.healthStatus || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), healthStatus: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {['健康','過敏','慢性疲勞','睡眠障礙','一般小病','其他'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">經濟狀況</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.economicStatus || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), economicStatus: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {['寬裕','穩定','壓力中','困難'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">社交圈</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.socialCircle || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), socialCircle: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {['家庭為主','教會為主','職場為主','廣泛社交','低社交'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">價值觀念</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.values || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), values: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {['家庭至上','事業為重','信仰優先','自由獨立','社會關懷'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">人生成就/目標</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.lifeGoals || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), lifeGoals: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {['事業成功','家庭幸福','財務自由','社會貢獻','自我實現'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">相處模式</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.relationshipMode || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), relationshipMode: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {['黏膩依賴','獨立自主','相互補型','平等合作'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">溝通方式</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.communicationStyle || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), communicationStyle: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {['直接坦率','婉轉含蓄','理性討論','情緒表達'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">衝突處理</label>
                        <select
                          value={generationRequest.familyRelations?.spouseDetails?.conflictResolution || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), spouseDetails: { ...(prev.familyRelations?.spouseDetails||{}), conflictResolution: (e.target.value || undefined) as any } }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        >
                          <option value="">未指定</option>
                          {['直接溝通','冷戰處理','妥協讓步','尋求仲裁'].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* 婚姻狀態 */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">婚姻狀態</label>
                      <select
                        value={generationRequest.familyRelations?.marriageStage || ''}
                        onChange={(e) => setGenerationRequest(prev => ({
                          ...prev,
                          familyRelations: { ...(prev.familyRelations||{}), marriageStage: (e.target.value || undefined) as any }
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">未指定</option>
                        {['新婚蜜月期','穩定婚姻期','婚姻困難期','分居冷靜期','感情修復期','婚姻倦怠期','重燃愛火期','和諧相處期','互相扶持期','黃昏戀情','第二春','老夫老妻','金婚銀婚','鑽石婚','白金婚'].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    {/* 相識方式 */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">相識方式</label>
                      <select
                        value={generationRequest.familyRelations?.meetingMethod || ''}
                        onChange={(e) => setGenerationRequest(prev => ({
                          ...prev,
                          familyRelations: { ...(prev.familyRelations||{}), meetingMethod: (e.target.value || undefined) as any }
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">未指定</option>
                        {['教會認識','朋友介紹','職場戀情','網路交友','相親安排','同學同窗','鄰居鄰里','旅行邂逅','興趣社團','志工活動','運動健身','咖啡廳偶遇','圖書館相遇','醫院相識','意外相撞'].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    {/* 子女數量 */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">子女數量</label>
                      <select
                        value={generationRequest.familyRelations?.childrenCount || ''}
                        onChange={(e) => setGenerationRequest(prev => ({
                          ...prev,
                          familyRelations: { ...(prev.familyRelations||{}), childrenCount: (e.target.value || undefined) as any }
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">未指定</option>
                        {['不生族','0','1','2','3','4','5','6','7'].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    {/* 年齡分布（多選） */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">年齡分布</label>
                      <div className="flex flex-wrap gap-2">
                        {['嬰幼兒','學齡前','小學','中學','成年'].map(it => {
                          const selected = (generationRequest.familyRelations?.childrenAgeDistribution || []).includes(it as any);
                          return (
                            <button key={it} type="button" onClick={() => setGenerationRequest(prev => {
                              const cur = new Set(prev.familyRelations?.childrenAgeDistribution || []);
                              selected ? cur.delete(it as any) : cur.add(it as any);
                              return { ...prev, familyRelations: { ...(prev.familyRelations||{}), childrenAgeDistribution: Array.from(cur) as any } };
                            })} className={`px-2 py-1 text-xs rounded border ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300'}`}>
                              {it}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 教養風格 */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">教養風格</label>
                      <select
                        value={generationRequest.familyRelations?.parentingStyle || ''}
                        onChange={(e) => setGenerationRequest(prev => ({
                          ...prev,
                          familyRelations: { ...(prev.familyRelations||{}), parentingStyle: (e.target.value || undefined) as any }
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">未指定</option>
                        {['民主型','權威型','放任型','溺愛型'].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    {/* 父母狀況 */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">父母狀況</label>
                      <select
                        value={generationRequest.familyRelations?.parentsStatus || ''}
                        onChange={(e) => setGenerationRequest(prev => ({
                          ...prev,
                          familyRelations: { ...(prev.familyRelations||{}), parentsStatus: (e.target.value || undefined) as any }
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">未指定</option>
                        {['健在','過世','離婚','分居'].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    {/* 家庭背景 */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">家庭背景</label>
                      <select
                        value={generationRequest.familyRelations?.familyBackground || ''}
                        onChange={(e) => setGenerationRequest(prev => ({
                          ...prev,
                          familyRelations: { ...(prev.familyRelations||{}), familyBackground: (e.target.value || undefined) as any }
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">未指定</option>
                        {['基督徒家庭','傳統家庭','單親家庭'].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    {/* 兄弟姊妹：排行/親密度 */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">兄弟姊妹（排行/親密度）</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="排行（例：老大/第二）"
                          value={generationRequest.familyRelations?.siblingsRank || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), siblingsRank: e.target.value || undefined }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        />
                        <input
                          type="text"
                          placeholder="關係親密度（例：很親/普通/疏遠）"
                          value={generationRequest.familyRelations?.siblingsCloseness || ''}
                          onChange={(e) => setGenerationRequest(prev => ({
                            ...prev,
                            familyRelations: { ...(prev.familyRelations||{}), siblingsCloseness: e.target.value || undefined }
                          }))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 生理特徵與外貌 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">生理特徵與外貌</label>
                  <div className="space-y-4">
                    {/* 體型特徵 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">體型特徵</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        {/* 身高體重 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">身高體重</label>
                          <select
                            value={(generationRequest.physicalAppearance?.heightWeight || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), heightWeight: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['嬌小玲瓏','標準勻稱','高挑修長','豐滿圓潤','纖細瘦弱','壯碩健壯','中等身材','袖珍可愛','高大威猛','微胖可愛','骨感清瘦','結實精壯'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 體型分類 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">體型分類</label>
                          <select
                            value={(generationRequest.physicalAppearance?.bodyType || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), bodyType: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['瘦弱型','標準型','肌肉型','豐腴型','運動型','苗條型','健美型','圓潤型','精實型','柔軟型','緊實型','勻稱型'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 身體比例 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">身體比例</label>
                          <select
                            value={(generationRequest.physicalAppearance?.bodyProportion || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), bodyProportion: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['長腿型','短腿型','寬肩型','窄肩型','腰細型','臀豐型','胸豐型','手長型','脖長型','頭小型','五官精緻','體態優雅'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 外貌特色 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">外貌特色</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        {/* 髮型髮色 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">髮型髮色</label>
                          <select
                            value={(generationRequest.physicalAppearance?.hairStyleColor || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), hairStyleColor: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['烏黑亮麗','栗色溫暖','染髮時尚','自然捲髮','柔順直髮','俏麗短髮','飄逸長髮','波浪捲髮','蓬鬆捲髮','銀白髮色','挑染髮色','漸層髮色','厚重瀏海','空氣瀏海','側分髮型'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 眼睛特徵 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">眼睛特徵</label>
                          <select
                            value={(generationRequest.physicalAppearance?.eyeFeatures || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), eyeFeatures: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['大眼有神','小眼精緻','單眼皮清秀','雙眼皮深邃','丹鳳眼魅惑','杏眼溫柔','桃花眼迷人','眼神銳利','眼神溫和','深邃眼眸','明亮眼神','憂鬱眼神','瞇瞇眼可愛','眼角上揚','長睫毛'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 膚色膚質 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">膚色膚質</label>
                          <select
                            value={(generationRequest.physicalAppearance?.skinTexture || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), skinTexture: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['雪白無瑕','健康小麥色','古銅膚色','粉嫩膚質','光滑細膩','敏感紅潤','乾燥粗糙','油光滿面','混合膚質','暗沉蠟黃','紅潤光澤','蒼白無血色','曬傷膚色','嬰兒般肌膚','成熟膚質'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 特殊標記 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">特殊標記</label>
                          <select
                            value={(generationRequest.physicalAppearance?.specialMarks || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), specialMarks: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['可愛胎記','歲月疤痕','藝術刺青','性感痣點','迷人酒窩','深深梨渦','眉間痣','唇下痣','頸部胎記','手臂疤痕','背部刺青','耳洞穿孔','鼻環裝飾','特殊胎記','戰傷疤痕'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 穿衣風格 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">穿衣風格</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        {/* 服裝類型 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">服裝類型</label>
                          <select
                            value={(generationRequest.physicalAppearance?.clothingType || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), clothingType: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['正式商務裝','休閒舒適風','潮流時尚款','保守傳統式','學院風格','街頭嘻哈','田園清新','復古懷舊','極簡主義','浪漫甜美','朋克搖滾','嬉皮風格','民族風情','工業風格','未來科技風'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 風格偏好 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">風格偏好</label>
                          <select
                            value={(generationRequest.physicalAppearance?.stylePreference || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), stylePreference: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['藝術創意型','運動休閒風','文青書卷氣','華麗優雅風','個性叛逆風','知性優雅','可愛甜美','成熟穩重','前衛先鋒','古典韻味','異國情調','簡約現代','奢華貴氣','自然率性','潮流先鋒'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 配件習慣 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">配件習慣</label>
                          <select
                            value={(generationRequest.physicalAppearance?.accessoriesHabits || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), accessoriesHabits: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['手錶收藏','珠寶首飾','時尚眼鏡','帽子控','圍巾愛好','包包控','鞋子迷','髮飾控','太陽眼鏡','領帶領結','胸針別針','手環腳鍊','戒指控','耳環穿搭','配飾達人'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 身體習慣 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">身體習慣</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        {/* 慣用特徵 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">慣用特徵</label>
                          <select
                            value={(generationRequest.physicalAppearance?.handedness || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), handedness: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['左撇子靈活','右撇子標準','雙手並用','左腦右手','右腦左手','混合慣用','使用輔助','適應性強','天生左利','後天改變','靈活切換','單手偏好'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 姿態特色 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">姿態特色</label>
                          <select
                            value={(generationRequest.physicalAppearance?.posture || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), posture: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['走路快速','走路優雅','駝背習慣','挺胸抬頭','步態輕盈','大步流星','小步謹慎','搖擺走路','軍人姿態','模特步伐','拖沓步伐','彈跳步伐','沉穩踏實','輕浮浮躁','威嚴氣勢'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 手勢習慣 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">手勢習慣</label>
                          <select
                            value={(generationRequest.physicalAppearance?.gestures || [])[0] || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              physicalAppearance: { ...(prev.physicalAppearance||{}), gestures: e.target.value ? [e.target.value] : [] }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['說話比手勢','思考摸下巴','緊張咬指甲','習慣性轉筆','摸頭髮','搓手掌','敲桌面','摸鼻子','撫摸下唇','雙手交握','手指敲擊','摸耳朵','撫胸口','手放口袋','摸眼鏡'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 情感與愛情觀 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">情感與愛情觀</label>
                  <div className="space-y-4">
                    {/* 生活方式與興趣（新增區塊會插在情感與愛情觀之後，這裡僅為定位標記） */}
                    {/* 戀愛模式 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">戀愛模式</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        {/* 愛情類型 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">愛情類型</label>
                          <select
                            value={generationRequest.loveAndRomance?.loveType || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), loveType: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['慢熱升溫型','一見鍾情型','理性分析型','感性衝動型','友情轉愛情','日久生情型','激情燃燒型','細水長流型','靈魂伴侶型','肉體吸引型','精神戀愛型','依賴共生型','獨立平等型','師生型','異地戀型'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 戀愛風格 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">戀愛風格</label>
                          <select
                            value={generationRequest.loveAndRomance?.loveStyle || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), loveStyle: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['浪漫主義者','現實主義者','佔有慾強型','給予自由型','黏膩型戀人','獨立型戀人','控制型戀人','放任型戀人','傳統保守型','開放前衛型','完美主義型','隨遇而安型','競爭型戀人','合作型戀人','治癒型戀人'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 表達方式 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">表達方式</label>
                          <select
                            value={generationRequest.loveAndRomance?.expression || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), expression: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['直接坦白表達','含蓄暗示情意','行動證明愛意','語言甜蜜表達','書信文字傳情','禮物表達心意','時間陪伴表達','身體接觸表達','眼神傳遞愛意','默默守護表達','創意浪漫表達','實際行動表達','情歌表達','詩詞表達','科技表達'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 感情經歷 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">感情經歷</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        {/* 戀愛經驗 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">戀愛經驗</label>
                          <select
                            value={generationRequest.loveAndRomance?.experience || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), experience: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['初戀青澀情結','豐富戀愛經驗','感情完全空白','嚴重創傷經歷','暗戀無數次','網戀經驗','異國戀經驗','辦公室戀情','學生時代戀愛','成年後初戀','閃婚經驗','長跑多年','同性戀經驗','雙性戀經驗','複雜三角戀'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 分手原因 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">分手原因</label>
                          <select
                            value={generationRequest.loveAndRomance?.breakupReason || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), breakupReason: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['價值觀差異','遠距離問題','家庭反對','性格不合','第三者介入','經濟壓力','工作忙碌','溝通不良','信任破裂','個人成長','興趣不同','生活習慣','宗教信仰','未來規劃','性格成熟度'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 情傷復原 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">情傷復原</label>
                          <select
                            value={generationRequest.loveAndRomance?.healingStyle || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), healingStyle: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['快速復原型','需要時間型','容易受傷型','理性面對型','沉浸痛苦型','報復心理型','逃避現實型','重新開始型','永不忘記型','成長轉化型','麻痺自己型','尋求治療型','朋友支持型','工作轉移型','時間治癒型'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 擇偶條件 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">擇偶條件</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        {/* 外在條件 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">外在條件</label>
                          <select
                            value={generationRequest.loveAndRomance?.externalCriteria || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), externalCriteria: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['外貌協會重視','身高要求嚴格','年齡偏好明確','經濟考量實際','體重要求','身材比例','穿著品味','社會地位','家庭背景','教育程度','職業聲望','收入水準','房車條件','外語能力','才藝技能'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 內在要求 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">內在要求</label>
                          <select
                            value={generationRequest.loveAndRomance?.innerCriteria || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), innerCriteria: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['性格相容度','價值觀一致','信仰共同點','智慧水準','幽默感','責任感','上進心','孝順程度','情商高低','溝通能力','包容度','穩定性','可靠度','誠實度','溫柔體貼'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 特殊偏好 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">特殊偏好</label>
                          <select
                            value={generationRequest.loveAndRomance?.specialPreference || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), specialPreference: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['同齡交往','姐弟戀情','師生戀慕','異國戀情','職場戀愛','青梅竹馬','網友見面','相親介紹','朋友介紹','偶遇邂逅','重逢舊愛','一夜情轉戀','鄰居戀情','旅行邂逅','運動夥伴'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 關係維持 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">關係維持</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        {/* 相處模式 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">相處模式</label>
                          <select
                            value={generationRequest.loveAndRomance?.relationshipMode || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), relationshipMode: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['黏膩依賴型','獨立自主型','相互補型','良性競爭型','平等合作型','主導控制型','被動配合型','朋友戀人型','激情浪漫型','平淡溫馨型','衝突不斷型','和諧穩定型','刺激冒險型','安全舒適型','成長促進型'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 衝突處理 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">衝突處理</label>
                          <select
                            value={generationRequest.loveAndRomance?.conflictStyle || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), conflictStyle: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['直接溝通型','冷戰處理型','尋求仲裁型','逃避問題型','情緒爆發型','理性討論型','妥協讓步型','堅持己見型','尋求共識型','暫時分離型','第三方調解型','寫信溝通型','時間淡化型','道歉和解型','分手威脅型'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        {/* 未來規劃 */}
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">未來規劃</label>
                          <select
                            value={generationRequest.loveAndRomance?.futurePlan || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              loveAndRomance: { ...(prev.loveAndRomance||{}), futurePlan: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['婚姻導向型','享受過程型','恐婚傾向型','開放關係型','試婚同居型','遠距維持型','事業優先型','家庭第一型','子女計畫型','環遊世界型','創業合夥型','學習成長型','退休規劃型','財務規劃型','健康養生型'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 生活方式與興趣 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">生活方式與興趣</label>
                  <div className="space-y-4">
                    {/* 日常生活習慣 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">日常生活習慣</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">作息習慣</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.dailyRhythm || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), dailyRhythm: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['早上6點起床','晚上11點睡覺','午休習慣','夜貓子作息','規律三餐'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">飲食習慣</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.eatingHabit || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), eatingHabit: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['素食主義','地中海飲食','低碳飲食','間歇性斷食','愛吃甜食','有機食品'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">運動習慣</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.exerciseHabit || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), exerciseHabit: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['每日散步','跑步健身','游泳運動','瑜伽練習','重量訓練','不愛運動'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">居住環境</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.livingEnvironment || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), livingEnvironment: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['市中心公寓','郊區透天','租屋族','與家人同住','獨居生活','極簡風格'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 興趣愛好與技能 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">興趣愛好與技能</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">藝術類</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.artInterest || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), artInterest: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['古典音樂','流行音樂','繪畫藝術','攝影技術','書法','手工藝','數位藝術'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">運動類</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.sportsInterest || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), sportsInterest: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['游泳','慢跑','登山健行','球類運動','瑜伽','騎腳踏車','跳舞','武術'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">學習類</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.learningInterest || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), learningInterest: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['程式設計','數據分析','語言學習','投資理財','心理學','歷史研究'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">社交類</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.socialInterest || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), socialInterest: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['聚餐','旅遊','志工服務','社團活動','讀書會','才藝班'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 語言能力 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">語言能力</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">本土語言</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.nativeLanguage || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), nativeLanguage: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['中文母語','台語流利','客家話母語','原住民語學習中'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">外語能力</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.foreignLanguage || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), foreignLanguage: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['英文流利','日文中級','韓文初級','多語言天才','商業英文優秀'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">溝通特色</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.communicationFeature || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), communicationFeature: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['國際溝通無障礙','專業英文優秀','本土語言熟練'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 數位科技使用 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">數位科技使用</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">科技產品</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.techProducts || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), techProducts: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['智慧型手機重度使用','平板電腦愛好','智慧手錶健康','VR虛擬實境'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">網路行為</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.onlineBehavior || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), onlineBehavior: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['資訊搜尋','社交互動','娛樂消費','學習進修','購物比價','創作分享'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">社群媒體</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.socialMedia || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), socialMedia: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['Facebook重度使用','Instagram愛好者','YouTube訂閱狂','TikTok創作者'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">數位素養</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.digitalLiteracy || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), digitalLiteracy: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['隱私保護','資安意識','假訊息辨識','網路禮儀'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 社會參與 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">社會參與</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">社區參與</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.communityParticipation || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), communityParticipation: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['社區委員會','鄰里活動','環境清潔','治安巡守','文化活動'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">環保意識</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.environmentalAwareness || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), environmentalAwareness: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['垃圾分類','資源回收','減塑生活','節能省電','綠色交通'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">志工服務</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.volunteerService || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), volunteerService: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['教育支援','長者關懷','兒童照護','寵物救助','災難救助'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 健康狀況 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">健康狀況</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">一般健康</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.generalHealth || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), generalHealth: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['健康','過敏','慢性疲勞','偏頭痛','睡眠障礙'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">慢性疾病</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.chronicDisease || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), chronicDisease: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['高血壓','糖尿病','心臟病','氣喘','關節炎','甲狀腺異常'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">精神健康</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.mentalHealth || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), mentalHealth: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['憂鬱症','焦慮症','躁鬱症','強迫症','PTSD','ADHD'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">嚴重疾病</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.severeDisease || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), severeDisease: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['癌症康復中','中風後遺症','帕金森氏症','多發性硬化症'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">成癮問題</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.addictionIssue || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), addictionIssue: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['藥物成癮','酒精成癮','菸癮','網路成癮'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">特殊狀況</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.specialCondition || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), specialCondition: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['視力聽力受損','色盲','妥瑞氏症','自閉症類群障礙'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 交通工具 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">交通工具</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">大眾運輸</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.publicTransport || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), publicTransport: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['捷運','公車','自行車','步行'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">機車類</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.scooterType || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), scooterType: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['Gogoro','光陽GP125'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">汽車類</label>
                          <select
                            value={generationRequest.lifestyleAndInterests?.carType || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifestyleAndInterests: { ...(prev.lifestyleAndInterests||{}), carType: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['Toyota Altis','Honda CR-V','Mercedes-Benz','BMW','Porsche','Tesla'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 心理與情感 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">心理與情感</label>
                  <div className="space-y-4">
                    {/* 情緒狀態 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">情緒狀態</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">正面情緒</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.positiveEmotion || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), positiveEmotion: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['樂觀開朗','穩定平和','熱情洋溢','充滿希望','積極正向','溫和親切','活潑開朗','沉著冷靜','溫暖體貼','自信從容','幽默風趣','純真善良','堅韌不拔','富有同情心','充滿活力'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">負面情緒</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.negativeEmotion || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), negativeEmotion: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['容易焦慮','情緒起伏大','憂鬱傾向','容易沮喪','多愁善感','急躁易怒','悲觀消極','情緒化','易受挫折','內心脆弱','情緒壓抑','過度敏感','情緒不穩','容易絕望','心情陰鬱'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">情緒特質</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.emotionTrait || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), emotionTrait: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['敏感細膩','冷靜理性','內心堅強','情緒穩定','內向安靜','外向健談','情感豐富','理智務實','感性浪漫','情緒複雜','直覺敏銳','邏輯清晰','富有想像力','現實主義','理想主義'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 情緒管理方式 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">情緒管理方式</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">身心調節</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.regulationBodyMind || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), regulationBodyMind: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['深呼吸冥想','運動發洩','音樂療癒','獨處思考','專業諮商'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">社交支持</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.socialSupport || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), socialSupport: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['找朋友聊天','宗教信仰','家人支持'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">創意表達</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.creativeExpression || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), creativeExpression: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['寫日記抒發','藝術創作','料理烹飪','園藝活動'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">轉移注意</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.attentionShift || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), attentionShift: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['閱讀','購物療法','旅行放鬆','寵物陪伴'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 壓力反應 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">壓力反應</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">生理反應</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.stressPhysiological || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), stressPhysiological: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['失眠多夢','食慾不振','暴飲暴食','頭痛頭暈','肌肉緊張'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">心理反應</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.stressPsychological || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), stressPsychological: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['容易發怒','注意力不集中','記憶力下降','情緒低落','焦慮不安'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">行為反應</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.stressBehavioral || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), stressBehavioral: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['社交退縮','過度工作','拖延逃避','強迫行為'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 自信程度 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">自信程度</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">高自信</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.selfConfidenceHigh || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), selfConfidenceHigh: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['非常自信','過度自信','盲目自信','表面自信','領袖氣質','自信滿滿','氣場強大','天生自信','魅力自信','霸氣自信'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">中等自信</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.selfConfidenceMedium || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), selfConfidenceMedium: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['適度自信','情境性自信','謙虛自信','理性自信','平衡自信','穩定自信','內斂自信','成熟自信','溫和自信','實事求是'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">低自信</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.selfConfidenceLow || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), selfConfidenceLow: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['缺乏自信','自我懷疑','需要鼓勵','容易動搖','自卑敏感','畏畏縮縮','膽小怯懦','依賴他人','害怕表現','逃避挑戰'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 愛的語言 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">愛的語言</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">肯定言語</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.loveLanguageWords || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), loveLanguageWords: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['讚美鼓勵','言語支持','口語表達愛意','正面評價','感謝表達','欣賞認同','言語安慰','口頭承諾','甜言蜜語','激勵話語'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">精心時刻</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.loveLanguageTime || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), loveLanguageTime: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['專注陪伴','深度對話','高品質時光','全心投入','共同活動','獨處時光','傾聽理解','心靈交流','共同經歷','陪伴支持'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">接受禮物</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.loveLanguageGifts || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), loveLanguageGifts: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['禮物表達','紀念意義','心意體現','驚喜禮物','實用禮品','手作禮物','昂貴禮物','簡單心意','節日禮物','收藏品'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">服務行動</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.loveLanguageService || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), loveLanguageService: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['實際幫助','具體行動','主動服務','分擔家務','解決問題','照顧需求','默默付出','實用支援','貼心服務','行動證明'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">身體接觸</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.loveLanguageTouch || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), loveLanguageTouch: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['擁抱安慰','牽手表達','親密接觸','溫暖觸碰','肢體語言','撫摸安撫','親吻示愛','身體親近','觸覺表達','物理連結'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 個人特色 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">個人特色</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">背景故事</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.backgroundStory || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), backgroundStory: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['夢想開咖啡廳','學習樂器','搖滾樂迷','環遊世界計畫'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">個人秘密</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.personalSecret || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), personalSecret: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['暗戀同事','童年願望','創業失敗經歷','珍貴回憶'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">習慣動作</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.habitualAction || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), habitualAction: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['思考時轉筆','緊張咬指甲','說話比手勢','聽音樂打拍子'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">代表物品</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.representativeItem || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), representativeItem: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['特別的書','家人項鍊','音樂盒','舊照片','手寫信件'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">特殊經歷</label>
                          <select
                            value={generationRequest.psychologyAndEmotion?.specialExperience || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              psychologyAndEmotion: { ...(prev.psychologyAndEmotion||{}), specialExperience: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['國際志工','背包旅行','救災活動','街頭表演','環保抗議'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 人格特質系統 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">人格特質系統</label>
                  <div className="space-y-4">
                    {/* 正面特質 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">正面特質</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">品格特質</label>
                          <select
                            value={generationRequest.personalitySystem?.strengthCharacter || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), strengthCharacter: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['誠實','善良','耐心','謙遜','勇敢','有同理心','責任感強'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">社交特質</label>
                          <select
                            value={generationRequest.personalitySystem?.strengthSocial || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), strengthSocial: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['友善','幽默','領導力','同理心','溝通能力佳','善於傾聽'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">工作特質</label>
                          <select
                            value={generationRequest.personalitySystem?.strengthWork || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), strengthWork: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['勤奮','創新','負責任','團隊合作','學習能力強','解決問題'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">靈性特質</label>
                          <select
                            value={generationRequest.personalitySystem?.strengthSpiritual || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), strengthSpiritual: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['信心','盼望','愛心','智慧','樂觀積極','堅持不懈'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 負面特質 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">負面特質</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">性格缺陷</label>
                          <select
                            value={generationRequest.personalitySystem?.weaknessCharacter || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), weaknessCharacter: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['急躁','固執','自私','驕傲','過於完美主義','優柔寡斷'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">情緒問題</label>
                          <select
                            value={generationRequest.personalitySystem?.weaknessEmotion || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), weaknessEmotion: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['焦慮','憂鬱','易怒','敏感','容易情緒化','社交恐懼'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">行為問題</label>
                          <select
                            value={generationRequest.personalitySystem?.weaknessBehavior || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), weaknessBehavior: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['拖延','完美主義','控制慾','容易分心','工作狂傾向'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">人際問題</label>
                          <select
                            value={generationRequest.personalitySystem?.weaknessInterpersonal || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), weaknessInterpersonal: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['內向','不信任','溝通困難','過度依賴他人','缺乏自信'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 人生觀與價值觀 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">人生觀與價值觀</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">生活觀</label>
                          <select
                            value={generationRequest.personalitySystem?.worldviewLife || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), worldviewLife: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['享受當下','未來導向','家庭至上','事業為重','平衡發展'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">金錢觀</label>
                          <select
                            value={generationRequest.personalitySystem?.worldviewMoney || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), worldviewMoney: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['節儉儲蓄','理性投資','及時行樂','金錢是工具不是目標'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">工作觀</label>
                          <select
                            value={generationRequest.personalitySystem?.worldviewWork || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), worldviewWork: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['實現自我價值','謀生手段','工作生活平衡','服務他人'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">政治觀</label>
                          <select
                            value={generationRequest.personalitySystem?.worldviewPolitics || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), worldviewPolitics: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['中立不表態','關心社會議題','支持環保','重視教育改革'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 人生目標與規劃 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">人生目標與規劃</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">短期目標</label>
                          <select
                            value={generationRequest.personalitySystem?.goalsShortTerm || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), goalsShortTerm: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['買房置產','學習新技能','轉換職業','投資理財'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">長期目標</label>
                          <select
                            value={generationRequest.personalitySystem?.goalsLongTerm || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), goalsLongTerm: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['事業成功','家庭幸福','財務自由','環遊世界','社會貢獻'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">人生成就</label>
                          <select
                            value={generationRequest.personalitySystem?.goalsAchievement || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), goalsAchievement: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['專業證照','馬拉松完賽','學會外語','創業成功','出版作品'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">座右銘</label>
                          <select
                            value={generationRequest.personalitySystem?.motto || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              personalitySystem: { ...(prev.personalitySystem||{}), motto: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['活在當下','永不放棄','知足常樂','助人為樂','相信自己'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 深層負面特質 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">深層負面特質（負面人物專用）</div>
                      <div className="space-y-4">
                        {/* 深層負面情緒 + 人格陰暗面 */}
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">深層負面情緒</label>
                            <select
                              value={generationRequest.personalitySystem?.deepNegativeEmotion || ''}
                              onChange={(e) => setGenerationRequest(prev => ({
                                ...prev,
                                personalitySystem: { ...(prev.personalitySystem||{}), deepNegativeEmotion: (e.target.value || undefined) as any }
                              }))}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                            >
                              <option value="">未指定</option>
                              {['長期低落','被遺棄感','對未來恐懼','內心憤怒','深度自卑','嫉妒怨恨','恐懼親密','自我懷疑','絕望缺乏動力','內心空虛'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">人格陰暗面</label>
                            <select
                              value={generationRequest.personalitySystem?.darkPersonality || ''}
                              onChange={(e) => setGenerationRequest(prev => ({
                                ...prev,
                                personalitySystem: { ...(prev.personalitySystem||{}), darkPersonality: (e.target.value || undefined) as any }
                              }))}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                            >
                              <option value="">未指定</option>
                              {['表面和善私下說壞話','操控他人','經常撒謊','對弱者冷漠','自戀受害者心態','報復記仇','缺乏同理心','情緒勒索'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* 成癮行為、 人際關係問題、 心理創傷影響 */}
                                                 <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                           <div>
                             <label className="block text-xs text-blue-600 mb-1">成癮行為</label>
                            <select
                              value={generationRequest.personalitySystem?.addictionBehavior || ''}
                              onChange={(e) => setGenerationRequest(prev => ({
                                ...prev,
                                personalitySystem: { ...(prev.personalitySystem||{}), addictionBehavior: (e.target.value || undefined) as any }
                              }))}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                            >
                              <option value="">未指定</option>
                              {['網路成癮','社群媒體成癮','遊戲成癮','酒精依賴','藥物依賴','尼古丁依賴','咖啡因依賴','購物成癮','工作成癮','賭博傾向','運動成癮','完美主義成癮'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">人際關係問題</label>
                            <select
                              value={generationRequest.personalitySystem?.relationshipProblems || ''}
                              onChange={(e) => setGenerationRequest(prev => ({
                                ...prev,
                                personalitySystem: { ...(prev.personalitySystem||{}), relationshipProblems: (e.target.value || undefined) as any }
                              }))}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                            >
                              <option value="">未指定</option>
                              {['無法維持長期關係','吸引不適合伴侶','過度依賴/獨立','無法表達情感','與家人衝突','職場關係緊張','缺乏界限'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">心理創傷影響</label>
                            <select
                              value={generationRequest.personalitySystem?.traumaImpact || ''}
                              onChange={(e) => setGenerationRequest(prev => ({
                                ...prev,
                                personalitySystem: { ...(prev.personalitySystem||{}), traumaImpact: (e.target.value || undefined) as any }
                              }))}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                            >
                              <option value="">未指定</option>
                              {['霸凌經歷','父母離婚','被拋棄經歷','家暴陰影','職場霸凌','意外事故','被詐騙經歷','重大疾病','破產經歷'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* 自毀行為、 社會適應困難、 內在矛盾 */}
                                                 <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                           <div>
                             <label className="block text-xs text-blue-600 mb-1">自毀行為</label>
                            <select
                              value={generationRequest.personalitySystem?.selfDestructiveBehavior || ''}
                              onChange={(e) => setGenerationRequest(prev => ({
                                ...prev,
                                personalitySystem: { ...(prev.personalitySystem||{}), selfDestructiveBehavior: (e.target.value || undefined) as any }
                              }))}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                            >
                              <option value="">未指定</option>
                              {['破壞關係','自我設限','拖延重要事情','選擇有害伴侶','用酒精逃避','拒絕幫助','故意製造衝突','放棄機會'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">社會適應困難</label>
                            <select
                              value={generationRequest.personalitySystem?.socialAdaptationDifficulty || ''}
                              onChange={(e) => setGenerationRequest(prev => ({
                                ...prev,
                                personalitySystem: { ...(prev.personalitySystem||{}), socialAdaptationDifficulty: (e.target.value || undefined) as any }
                              }))}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                            >
                              <option value="">未指定</option>
                              {['無法適應潛規則','對權威反抗','無法團隊合作','社交極度不自在','在群體邊緣化','對變化抗拒'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">內在矛盾</label>
                            <select
                              value={generationRequest.personalitySystem?.innerConflict || ''}
                              onChange={(e) => setGenerationRequest(prev => ({
                                ...prev,
                                personalitySystem: { ...(prev.personalitySystem||{}), innerConflict: (e.target.value || undefined) as any }
                              }))}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                            >
                              <option value="">未指定</option>
                              {['渴望親密卻害怕受傷','想要成功但害怕失敗','想要改變但抗拒行動','需要幫助但拒絕求助'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* 負面應對機制、 隱藏恐懼、 負面信念系統 */}
                                                 <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                           <div>
                             <label className="block text-xs text-blue-600 mb-1">負面應對機制</label>
                            <select
                              value={generationRequest.personalitySystem?.negativeCopingMechanism || ''}
                              onChange={(e) => setGenerationRequest(prev => ({
                                ...prev,
                                personalitySystem: { ...(prev.personalitySystem||{}), negativeCopingMechanism: (e.target.value || undefined) as any }
                              }))}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                            >
                              <option value="">未指定</option>
                              {['用憤怒掩蓋脆弱','用幽默化解嚴肅','用冷漠保護自己','透過工作逃避','用忙碌掩蓋孤獨','透過討好獲得認同'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">隱藏恐懼</label>
                            <select
                              value={generationRequest.personalitySystem?.hiddenFear || ''}
                              onChange={(e) => setGenerationRequest(prev => ({
                                ...prev,
                                personalitySystem: { ...(prev.personalitySystem||{}), hiddenFear: (e.target.value || undefined) as any }
                              }))}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                            >
                              <option value="">未指定</option>
                              {['害怕被發現真實自己','恐懼死亡無意義','害怕孤獨終老','害怕被拋棄','恐惧親密傷害','害怕愛人離開'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">負面信念系統</label>
                            <select
                              value={generationRequest.personalitySystem?.negativeBeliefSystem || ''}
                              onChange={(e) => setGenerationRequest(prev => ({
                                ...prev,
                                personalitySystem: { ...(prev.personalitySystem||{}), negativeBeliefSystem: (e.target.value || undefined) as any }
                              }))}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                            >
                              <option value="">未指定</option>
                              {['相信世界不公平','認為充滿危險威脅','相信努力沒意義','認為注定失敗','不值得好事物','永遠不夠好','孤獨是宿命'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 認知與學習風格 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">認知與學習風格</label>
                  <div className="space-y-4">
                    {/* 思維模式 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">思維模式</div>
                                             <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">思考類型</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.thinkingType || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), thinkingType: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['邏輯思維','直覺思維','創意思維','批判思維'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">分析方式</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.analysisStyle || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), analysisStyle: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['系統性分析','跳躍性思考','細節導向','大局觀'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">問題解決</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.problemSolving || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), problemSolving: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['理性分析','經驗依賴','創新嘗試','團隊討論'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 學習風格 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">學習風格</div>
                                             <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">學習偏好</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.learningPreference || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), learningPreference: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['視覺型學習','聽覺型學習','動覺型學習','讀寫型學習'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">學習節奏</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.learningPace || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), learningPace: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['快速學習','慢工細活','間歇性學習','持續性學習'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">學習動機</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.learningMotivation || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), learningMotivation: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['興趣驅動','目標導向','競爭激勵','自我實現'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 記憶特點 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">記憶特點</div>
                                             <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">記憶類型</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.memoryType || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), memoryType: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['記憶力超強','選擇性記憶','情感記憶深刻','容易健忘'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">記憶方式</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.memoryMethod || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), memoryMethod: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['視覺記憶','聽覺記憶','動作記憶','聯想記憶'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">遺忘模式</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.forgettingPattern || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), forgettingPattern: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['快速遺忘','長期記憶','創傷記憶','美化記憶'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 決策風格 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">決策風格</div>
                                             <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">決策速度</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.decisionSpeed || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), decisionSpeed: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['衝動決策','謹慎分析','猶豫不決','拖延決策'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">決策依據</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.decisionBasis || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), decisionBasis: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['理性分析','直覺感受','他人意見','經驗法則'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">風險態度</label>
                          <select
                            value={generationRequest.cognitiveAndLearning?.riskAttitude || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              cognitiveAndLearning: { ...(prev.cognitiveAndLearning||{}), riskAttitude: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['冒險精神','風險規避','計算風險','風險盲目'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 情緒智商與社交能力 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">情緒智商與社交能力</label>
                  <div className="space-y-4">
                    {/* 情商表現 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">情商表現</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">同理能力</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.empathyAbility || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), empathyAbility: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['同理心超強','情緒共感','理解困難','冷漠疏離'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">情緒覺察</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.emotionAwareness || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), emotionAwareness: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['敏感細膩','情緒遲鈍','自我覺察強','投射他人'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">情緒調節</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.emotionRegulation || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), emotionRegulation: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['情緒穩定','情緒起伏','壓抑情緒','情緒爆發'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 社交技巧 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">社交技巧</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">溝通能力</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.communicationSkill || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), communicationSkill: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['幽默風趣','談吐優雅','言語犀利','木訥寡言'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">傾聽技巧</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.listeningSkill || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), listeningSkill: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['專注傾聽','選擇性傾聽','急於表達','心不在焉'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">衝突處理</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.conflictHandling || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), conflictHandling: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['化解高手','迴避衝突','激化矛盾','理性調解'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 人際邊界 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">人際邊界</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">界限設定</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.boundarySetting || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), boundarySetting: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['清楚界限','模糊邊界','過度保護','容易被利用'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">人際距離</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.interpersonalDistance || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), interpersonalDistance: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['親密無間','保持距離','選擇性親近','防禦心強'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">信任建立</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.trustBuilding || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), trustBuilding: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['容易信任','謹慎信任','信任困難','盲目信任'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 領導特質 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">領導特質</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">領導風格</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.leadershipStyle || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), leadershipStyle: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['天生領袖','民主領導','威權領導','服務型領導'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">團隊角色</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.teamRole || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), teamRole: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['領導者','協調者','執行者','創意發想','跟隨者'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">影響力</label>
                          <select
                            value={generationRequest.emotionalSocialSkills?.influenceType || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              emotionalSocialSkills: { ...(prev.emotionalSocialSkills||{}), influenceType: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['魅力影響','專業權威','人際影響','職位權力'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 價值觀與道德觀 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">價值觀與道德觀</label>
                  <div className="space-y-4">
                    {/* 道德標準 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">道德標準</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">道德要求</label>
                          <select
                            value={generationRequest.valuesMorality?.moralDemand || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), moralDemand: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['嚴格自律','寬鬆標準','雙重標準','情境道德'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">原則堅持</label>
                          <select
                            value={generationRequest.valuesMorality?.principleAdherence || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), principleAdherence: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['原則性強','彈性調整','見風轉舵','無明確原則'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">道德判斷</label>
                          <select
                            value={generationRequest.valuesMorality?.moralJudgment || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), moralJudgment: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['黑白分明','灰色地帶','相對主義','絕對主義'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 正義感 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">正義感</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">正義表現</label>
                          <select
                            value={generationRequest.valuesMorality?.justiceExpression || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), justiceExpression: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['強烈正義感','明哲保身','同情弱者','崇拜強者'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">公平觀念</label>
                          <select
                            value={generationRequest.valuesMorality?.fairnessView || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), fairnessView: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['絕對公平','程序公正','結果公平','關係公平'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">社會責任</label>
                          <select
                            value={generationRequest.valuesMorality?.socialResponsibility || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), socialResponsibility: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['社會參與','個人主義','集體利益','自我保護'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 利他傾向 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">利他傾向</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">奉獻精神</label>
                          <select
                            value={generationRequest.valuesMorality?.dedicationSpirit || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), dedicationSpirit: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['無私奉獻','互惠互利','自我優先','機會主義'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">助人動機</label>
                          <select
                            value={generationRequest.valuesMorality?.helpingMotivation || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), helpingMotivation: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['純粹善意','互相幫助','獲得認同','道德義務'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">犧牲意願</label>
                          <select
                            value={generationRequest.valuesMorality?.sacrificeWillingness || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), sacrificeWillingness: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['自我犧牲','適度付出','保護自己','利己主義'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 誠信程度 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">誠信程度</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">誠實度</label>
                          <select
                            value={generationRequest.valuesMorality?.honestyLevel || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), honestyLevel: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['絕對誠實','善意謊言','策略隱瞞','習慣撒謊'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">承諾履行</label>
                          <select
                            value={generationRequest.valuesMorality?.commitmentFulfillment || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), commitmentFulfillment: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['言出必行','盡力而為','選擇性履行','輕易承諾'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">透明度</label>
                          <select
                            value={generationRequest.valuesMorality?.transparencyLevel || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              valuesMorality: { ...(prev.valuesMorality||{}), transparencyLevel: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['開放透明','選擇性公開','保護隱私','神秘主義'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 人生哲學與靈性觀 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">人生哲學與靈性觀</label>
                  <div className="space-y-4">
                    {/* 存在意義 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">存在意義</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">人生目標</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.lifeGoal || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), lifeGoal: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['追求成就','享受過程','服務他人','自我實現'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">生命價值</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.lifeValue || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), lifeValue: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['事業成功','家庭幸福','個人成長','社會貢獻'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">意義來源</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.meaningSource || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), meaningSource: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['宗教信仰','人際關係','個人成就','自然和諧'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 時間觀念 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">時間觀念</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">時間態度</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.timeAttitude || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), timeAttitude: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['活在當下','未來導向','懷念過去','時間焦慮'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">時間管理</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.timeManagement || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), timeManagement: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['精確計畫','彈性安排','隨性而為','時間混亂'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">節奏偏好</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.pacePreference || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), pacePreference: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['快節奏','慢節奏','張弛有度','節奏不定'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 命運觀 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">命運觀</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">命運信念</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.fateBelief || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), fateBelief: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['命中注定','人定勝天','隨遇而安','悲觀宿命'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">控制感</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.senseOfControl || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), senseOfControl: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['掌控人生','順其自然','外在歸因','內在歸因'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">變化態度</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.changeAttitude || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), changeAttitude: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['擁抱變化','抗拒改變','適應變化','恐懼變化'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 死亡觀 */}
                    <div>
                                             <div className="text-sm font-medium text-blue-700 mb-2">死亡觀</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">死亡態度</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.deathAttitude || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), deathAttitude: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['恐懼死亡','接受死亡','好奇死後','否認死亡'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">生死觀</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.lifeDeathView || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), lifeDeathView: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['珍惜生命','及時行樂','死後世界','輪迴轉世'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">遺產觀念</label>
                          <select
                            value={generationRequest.lifePhilosophyAndSpirituality?.legacyConcept || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              lifePhilosophyAndSpirituality: { ...(prev.lifePhilosophyAndSpirituality||{}), legacyConcept: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['物質遺產','精神遺產','無遺產觀','負面遺產'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 行為習慣與個人怪癖 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">行為習慣與個人怪癖</label>
                  <div className="space-y-4">
                    {/* 日常儀式 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">日常儀式</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">晨間例行</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.morningRoutine || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), morningRoutine: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['晨間運動','咖啡儀式','新聞閱讀','冥想靜心'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">工作儀式</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.workRitual || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), workRitual: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['工作前準備','休息習慣','專注技巧','收尾習慣'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">睡前習慣</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.bedtimeHabit || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), bedtimeHabit: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['閱讀入睡','音樂放鬆','護膚保養','祈禱感恩'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">減壓方式</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.stressRelief || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), stressRelief: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['散步思考','音樂療癒','運動發洩','創作表達'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 個人怪癖 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">個人怪癖</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">收集癖好</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.collectingHobby || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), collectingHobby: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['書籍收集','音樂收集','文具控','模型愛好'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">強迫行為</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.compulsiveBehavior || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), compulsiveBehavior: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['完美主義','重複檢查','對稱強迫','清潔強迫'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">迷信行為</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.superstitiousBehavior || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), superstitiousBehavior: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['數字迷信','顏色禁忌','風水信念','占卜依賴'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">特殊嗜好</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.specialHobby || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), specialHobby: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['極限運動','古董收藏','手作DIY','遊戲沉迷'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 說話特色 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">說話特色</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">語言習慣</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.languageHabit || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), languageHabit: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['口頭禪','語速特徵','音量控制','語調變化'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">表達風格</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.expressionStyle || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), expressionStyle: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['直接坦率','婉轉含蓄','幽默風趣','嚴肅正經'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">方言使用</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.dialectUsage || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), dialectUsage: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['國語標準','台語流利','英語穿插','方言混合'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">溝通模式</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.communicationMode || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), communicationMode: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['多話健談','沉默寡言','選擇性發言','情緒表達'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 非語言行為 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">非語言行為</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">眼神特徵</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.eyeContact || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), eyeContact: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['直視交流','迴避眼神','銳利眼神','溫柔眼神'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">個人空間</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.personalSpace || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), personalSpace: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['親近距離','保持距離','空間敏感','空間侵犯'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">觸碰習慣</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.touchHabit || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), touchHabit: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['喜歡擁抱','避免接觸','握手習慣','肢體語言豐富'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">姿態語言</label>
                          <select
                            value={generationRequest.behaviorHabitsAndQuirks?.postureLanguage || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              behaviorHabitsAndQuirks: { ...(prev.behaviorHabitsAndQuirks||{}), postureLanguage: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['自信姿態','謙遜姿態','緊張姿態','放鬆姿態'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 文化適應與國際觀 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">文化適應與國際觀</label>
                  <div className="space-y-4">
                    {/* 文化開放度 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">文化開放度</div>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">多元包容</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.diversityInclusion || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), diversityInclusion: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['文化好奇','開放接納','主動學習','尊重差異'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">文化固執</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.culturalRigidity || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), culturalRigidity: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['傳統堅持','變化抗拒','本土優先','外來排斥'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">選擇接受</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.selectiveAcceptance || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), selectiveAcceptance: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['挑選接納','實用主義','條件開放','部分認同'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">文化衝突</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.culturalConflict || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), culturalConflict: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['價值衝突','認同困惑','適應困難','排斥反應'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 國際視野 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">國際視野</div>
                                             <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">全球思維</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.globalThinking || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), globalThinking: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['國際視野','跨文化理解','全球公民意識','普世價值'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">本土主義</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.localism || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), localism: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['在地優先','文化保護','傳統維護','本土認同'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">文化相對</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.culturalRelativism || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), culturalRelativism: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['尊重差異','情境理解','多元觀點','包容並蓄'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">民族中心</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.ethnocentrism || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), ethnocentrism: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['本族優越','文化偏見','刻板印象','排外傾向'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 語言態度 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">語言態度</div>
                                             <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">語言天賦</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.languageTalent || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), languageTalent: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['語言學習快','發音準確','語感敏銳','多語轉換'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">語言障礙</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.languageBarrier || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), languageBarrier: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['學習困難','發音問題','表達障礙','理解困難'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">方言偏好</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.dialectPreference || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), dialectPreference: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['母語驕傲','方言堅持','標準語偏好','語言純化'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">外語學習</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.foreignLanguageLearning || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), foreignLanguageLearning: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['積極學習','被動學習','功利學習','恐懼抗拒'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 旅行偏好 */}
                    <div>
                      <div className="text-sm font-medium text-blue-700 mb-2">旅行偏好</div>
                                             <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">冒險旅行</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.adventureTravel || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), adventureTravel: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['探索未知','挑戰極限','深度體驗','文化沉浸'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">舒適旅遊</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.comfortTravel || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), comfortTravel: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['奢華享受','輕鬆休閒','服務品質','安全保障'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">文化探索</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.culturalExploration || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), culturalExploration: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['歷史古蹟','博物館','當地文化','人文交流'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-blue-600 mb-1">自然親近</label>
                          <select
                            value={generationRequest.culturalAdaptationAndGlobalView?.natureProximity || ''}
                            onChange={(e) => setGenerationRequest(prev => ({
                              ...prev,
                              culturalAdaptationAndGlobalView: { ...(prev.culturalAdaptationAndGlobalView||{}), natureProximity: (e.target.value || undefined) as any }
                            }))}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                          >
                            <option value="">未指定</option>
                            {['山川美景','生態旅遊','戶外活動','環境保護'].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                                 </div>

                 {/* 消費心理與物質觀 */}
                 <div className="md:col-span-2">
                   <label className="block text-sm font-semibold text-blue-800 mb-2">消費心理與物質觀</label>
                   <div className="space-y-4">
                     {/* 購物動機 */}
                     <div>
                       <div className="text-sm font-medium text-blue-700 mb-2">購物動機</div>
                                               <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">需求導向</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.shoppingNeeds || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), shoppingNeeds: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['實用主義','理性消費','功能優先','必需品購買'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">情緒購物</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.shoppingEmotion || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), shoppingEmotion: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['壓力購物','心情購物','衝動消費','情感慰藉'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">社交炫耀</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.shoppingSocial || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), shoppingSocial: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['地位象徵','品牌展示','社會認同','身份標識'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">收藏興趣</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.shoppingCollection || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), shoppingCollection: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['興趣收集','投資收藏','完整性追求','專業收藏'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                       </div>
                     </div>

                     {/* 品牌態度 */}
                     <div>
                       <div className="text-sm font-medium text-blue-700 mb-2">品牌態度</div>
                                               <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">品牌忠誠</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.brandLoyalty || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), brandLoyalty: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['品牌迷戀','忠誠消費','品牌信任','重複購買'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">性價比</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.valueForMoney || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), valueForMoney: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['理性比較','價值評估','實用導向','經濟考量'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">本土品牌</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.localBrand || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), localBrand: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['本土支持','文化認同','品質信任','情感連結'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">反商業</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.antiCommercial || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), antiCommercial: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['反品牌','反消費','簡約生活','非物質主義'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                       </div>
                     </div>

                     {/* 物質慾望 */}
                     <div>
                       <div className="text-sm font-medium text-blue-700 mb-2">物質慾望</div>
                                               <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">極簡主義</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.minimalism || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), minimalism: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['斷捨離','必需品','質量重於數量','精神富足'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">物質享受</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.materialEnjoyment || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), materialEnjoyment: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['品質生活','奢華品味','生活品質','物質滿足'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">奢侈品愛</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.luxuryLove || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), luxuryLove: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['頂級品牌','限量收藏','身份地位','品味象徵'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">環保消費</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.ecoConsumption || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), ecoConsumption: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['永續消費','環保意識','二手購買','循環經濟'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                       </div>
                     </div>

                     {/* 金錢安全感 */}
                     <div>
                       <div className="text-sm font-medium text-blue-700 mb-2">金錢安全感</div>
                                               <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">儲蓄傾向</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.savingTendency || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), savingTendency: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['未雨綢繆','安全第一','風險規避','長期規劃'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">月光族</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.monthToMonth || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), monthToMonth: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['即時享樂','花光薪水','無儲蓄習慣','金錢焦慮'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">投資冒險</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.investmentRisk || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), investmentRisk: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['高風險投資','積極理財','財富增值','投機心理'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">金錢恐懼</label>
                           <select
                             value={generationRequest.consumptionPsychologyAndMaterialView?.moneyFear || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               consumptionPsychologyAndMaterialView: { ...(prev.consumptionPsychologyAndMaterialView||{}), moneyFear: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['貧窮恐懼','金錢焦慮','過度節儉','安全感不足'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                       </div>
                     </div>
                   </div>
                                  </div>

                 {/* 適應能力與心理彈性 */}
                 <div className="md:col-span-2">
                   <label className="block text-sm font-semibold text-blue-800 mb-2">適應能力與心理彈性</label>
                   <div className="space-y-4">
                     {/* 變化適應 */}
                     <div>
                       <div className="text-sm font-medium text-blue-700 mb-2">變化適應</div>
                                               <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">擁抱變化</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.embraceChange || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), embraceChange: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['變化興奮','新鮮感','適應快速','靈活調整'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">抗拒改變</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.resistChange || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), resistChange: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['穩定偏好','變化恐懼','習慣依賴','保守堅持'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">適應能力強</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.strongAdaptability || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), strongAdaptability: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['環境適應','角色轉換','學習能力','復原力強'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">變化焦慮</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.changeAnxiety || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), changeAnxiety: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['不確定恐懼','控制需求','變化壓力','適應困難'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                       </div>
                     </div>

                     {/* 壓力耐受 */}
                     <div>
                       <div className="text-sm font-medium text-blue-700 mb-2">壓力耐受</div>
                                               <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">高壓承受</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.highPressureTolerance || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), highPressureTolerance: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['壓力免疫','挑戰接受','冷靜應對','壓力轉化'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">壓力敏感</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.stressSensitive || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), stressSensitive: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['壓力易感','焦慮反應','身心症狀','壓力放大'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">壓力轉化</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.stressTransformation || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), stressTransformation: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['壓力動力','成長機會','創意催化','能量轉換'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">壓力逃避</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.stressAvoidance || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), stressAvoidance: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['逃避面對','否認壓力','轉移注意','消極應對'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                       </div>
                     </div>

                     {/* 創新程度 */}
                     <div>
                       <div className="text-sm font-medium text-blue-700 mb-2">創新程度</div>
                                               <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">創新先驅</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.innovationPioneer || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), innovationPioneer: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['創新領導','早期採用','突破傳統','變革推動'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">穩健跟隨</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.steadyFollower || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), steadyFollower: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['觀察學習','穩定跟進','風險評估','謹慎創新'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">保守傳統</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.conservativeTraditional || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), conservativeTraditional: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['傳統堅持','變化抗拒','經驗依賴','穩定優先'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">創新恐懼</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.innovationFear || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), innovationFear: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['新事物恐懼','失敗恐懼','安全依賴','變化排斥'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                       </div>
                     </div>

                     {/* 學習彈性 */}
                     <div>
                       <div className="text-sm font-medium text-blue-700 mb-2">學習彈性</div>
                                               <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                          <div>
                            <label className="block text-xs text-blue-600 mb-1">終身學習</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.lifelongLearning || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), lifelongLearning: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['持續成長','知識渴望','自我更新','適應變化'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">固化思維</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.fixedMindset || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), fixedMindset: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['思維僵化','學習抗拒','經驗固著','改變困難'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">選擇學習</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.selectiveLearning || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), selectiveLearning: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['興趣導向','實用學習','選擇性接受','目標明確'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">學習抗拒</label>
                           <select
                             value={generationRequest.adaptationAndPsychFlex?.learningResistance || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               adaptationAndPsychFlex: { ...(prev.adaptationAndPsychFlex||{}), learningResistance: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['學習恐懼','能力懷疑','舒適圈依賴','挑戰逃避'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                       </div>
                     </div>
                   </div>
                                  </div>

                 {/* 特殊經歷與成就 */}
                 <div className="md:col-span-2">
                   <label className="block text-sm font-semibold text-blue-800 mb-2">特殊經歷與成就</label>
                   <div className="space-y-4">
                     {/* 人生成就 */}
                     <div>
                       <div className="text-sm font-medium text-blue-700 mb-2">人生成就</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">學業成就</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.academicAchievement || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), academicAchievement: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['學術獎項','研究發表','升學成功'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">職業成就</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.careerAchievement || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), careerAchievement: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['升職加薪','創業成功','專業認證'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">服務成就</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.serviceAchievement || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), serviceAchievement: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['志工經歷','社會貢獻','慈善活動'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">個人成就</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.personalAchievement || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), personalAchievement: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['技能習得','興趣專精','個人突破'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                       </div>
                     </div>

                     {/* 特殊經歷 */}
                     <div>
                       <div className="text-sm font-medium text-blue-700 mb-2">特殊經歷</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">旅行經歷</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.travelExperience || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), travelExperience: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['國際志工','背包旅行','文化交流'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">挑戰經歷</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.challengeExperience || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), challengeExperience: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['馬拉松比賽','登山探險','極限運動'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">服務經歷</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.serviceExperience || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), serviceExperience: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['偏鄉教學','災難救助','環保活動'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">創意經歷</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.creativeExperience || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), creativeExperience: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['街頭表演','藝術創作','媒體參與'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                       </div>
                     </div>

                     {/* 背景故事 */}
                     <div>
                       <div className="text-sm font-medium text-blue-700 mb-2">背景故事</div>
                       <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">夢想故事</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.dreamStory || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), dreamStory: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['開咖啡廳','環遊世界','學習樂器'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">興趣故事</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.interestStory || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), interestStory: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['搖滾樂迷','天文愛好','桌遊收藏'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">學習故事</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.learningStory || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), learningStory: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['多語能力','釀酒技術','古董修復'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-blue-600 mb-1">收藏故事</label>
                           <select
                             value={generationRequest.specialExperienceAndAchievements?.collectionStory || ''}
                             onChange={(e) => setGenerationRequest(prev => ({
                               ...prev,
                               specialExperienceAndAchievements: { ...(prev.specialExperienceAndAchievements||{}), collectionStory: (e.target.value || undefined) as any }
                             }))}
                             className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                           >
                             <option value="">未指定</option>
                             {['攝影作品','動漫文化','登山裝備'].map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-semibold text-blue-800 mb-2">工作</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">產業</label>
                      <select
                        value={generationRequest.industry || ''}
                        onChange={(e) => setGenerationRequest(prev => ({ 
                          ...prev,
                          industry: e.target.value || undefined,
                          occupation: (() => {
                            const ind = e.target.value || undefined;
                            const roles = GENERATION_FACTORS.occupationEconomy.industries.find(i => i.name === ind)?.roles || [];
                            return roles.includes(prev.occupation || '') ? prev.occupation : undefined;
                          })()
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">隨機</option>
                        {GENERATION_FACTORS.occupationEconomy.industries.map(industry => (
                          <option key={industry.id} value={industry.name}>{industry.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">職稱</label>
                      <select
                        value={generationRequest.occupation || ''}
                        onChange={(e) => setGenerationRequest(prev => ({
                          ...prev,
                          occupation: e.target.value || undefined
                        }))}
                        disabled={!generationRequest.industry}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">{generationRequest.industry ? '選擇職稱（可選）' : '請先選擇產業'}</option>
                        {(GENERATION_FACTORS.occupationEconomy.industries.find(i => i.name === generationRequest.industry)?.roles || []).map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">職稱層級</label>
                      <select
                        value={generationRequest.seniorityLevel || ''}
                        onChange={(e) => setGenerationRequest(prev => ({
                          ...prev,
                          seniorityLevel: (e.target.value || undefined) as any
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">隨機</option>
                        <option value="intern">實習/見習</option>
                        <option value="junior">初階</option>
                        <option value="mid">中階</option>
                        <option value="senior">資深</option>
                        <option value="lead">主管/技術帶領</option>
                        <option value="manager">經理/管理職</option>
                        <option value="director">總監/高階</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 經濟狀況 */}
                <div>
                  <label className="block text-sm font-semibold text-blue-800 mb-2">經濟狀況</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">收入範圍</label>
                      <select
                        value={generationRequest.incomeRange || ''}
                        onChange={(e) => setGenerationRequest(prev => ({
                          ...prev,
                          incomeRange: (e.target.value || undefined) as any
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">未指定</option>
                        <option value="1~3萬">1~3萬</option>
                        <option value="3~7萬">3~7萬</option>
                        <option value="7~10萬">7~10萬</option>
                        <option value="10~15萬">10~15萬</option>
                        <option value="15~20萬">15~20萬</option>
                        <option value="20萬+">20萬+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">財務習慣</label>
                      <select
                        value={generationRequest.financialHabit || ''}
                        onChange={(e) => setGenerationRequest(prev => ({
                          ...prev,
                          financialHabit: (e.target.value || undefined) as any
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">未指定</option>
                        <option value="節儉型">節儉型</option>
                        <option value="平衡型">平衡型</option>
                        <option value="消費型">消費型</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">慈善捐獻</label>
                      <select
                        value={generationRequest.charityGiving || ''}
                        onChange={(e) => setGenerationRequest(prev => ({
                          ...prev,
                          charityGiving: (e.target.value || undefined) as any
                        }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">未指定</option>
                        <option value="定期奉獻">定期奉獻</option>
                        <option value="偶爾捐獻">偶爾捐獻</option>
                        <option value="特殊奉獻">特殊奉獻</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Seed（可重現）</label>
                  <input
                    type="text"
                    placeholder="例如：202408"
                    value={generationRequest.seed || ''}
                    onChange={(e) => setGenerationRequest(prev => ({ 
                      ...prev, 
                      seed: e.target.value || undefined 
                    }))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                  />
                </div>
              </div>

              {/* 因子詳情設定 */}
              {showFactorDetails && (
                <div className="border-t border-blue-200 pt-4 mt-4 space-y-4">
                  <h5 className="font-medium text-blue-800 flex items-center gap-2">
                    <BookOpen size={16} />
                    詳細因子設定
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">教育程度</label>
                      <select
                        value={detailedFactors.education}
                        onChange={(e) => updateDetailedFactor('education', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">隨機</option>
                        {GENERATION_FACTORS.demographics.education.map(edu => (
                          <option key={edu} value={edu}>{edu}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">婚姻狀況</label>
                      <select
                        value={detailedFactors.maritalStatus}
                        onChange={(e) => updateDetailedFactor('maritalStatus', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">隨機</option>
                        {GENERATION_FACTORS.demographics.maritalStatus.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">科技採用度</label>
                      <select
                        value={detailedFactors.techAdoption}
                        onChange={(e) => updateDetailedFactor('techAdoption', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">隨機</option>
                        {GENERATION_FACTORS.digitalProfile.techAdoption.map(tech => (
                          <option key={tech} value={tech}>{tech}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">隱私設定</label>
                      <select
                        value={detailedFactors.privacySettings}
                        onChange={(e) => updateDetailedFactor('privacySettings', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">隨機</option>
                        {GENERATION_FACTORS.digitalProfile.privacySettings.map(privacy => (
                          <option key={privacy} value={privacy}>{privacy}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">能量模式</label>
                      <select
                        value={detailedFactors.energyPattern}
                        onChange={(e) => updateDetailedFactor('energyPattern', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">隨機</option>
                        <option value="morning">晨型人</option>
                        <option value="afternoon">午型人</option>
                        <option value="evening">夜型人</option>
                        <option value="balanced">平衡型</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">參與模式</label>
                      <select
                        value={detailedFactors.participationMode}
                        onChange={(e) => updateDetailedFactor('participationMode', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white"
                      >
                        <option value="">隨機</option>
                        {GENERATION_FACTORS.factors.participationMode.enum.map(mode => (
                          <option key={mode} value={mode}>{mode}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 導向自由多選 */}
                  <div className="border-t border-blue-200 pt-4 mt-2 space-y-4">
                    <h6 className="text-blue-700 font-medium">導向自由選擇（多選）</h6>

                    {/* 人格導向 */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">人格模式</label>
                      <div className="flex flex-wrap gap-2">
                        {GENERATION_FACTORS.personality.patterns.map(p => {
                          const selected = generationRequest.selectedOptions?.personality?.patterns?.includes(p);
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setGenerationRequest(prev => {
                                const cur = new Set(prev.selectedOptions?.personality?.patterns || []);
                                selected ? cur.delete(p) : cur.add(p);
                                return {
                                  ...prev,
                                  selectedOptions: {
                                    ...prev.selectedOptions,
                                    personality: {
                                      ...prev.selectedOptions?.personality,
                                      patterns: Array.from(cur)
                                    }
                                  }
                                };
                              })}
                              className={`px-2 py-1 text-xs rounded border ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300'}`}
                            >{p}</button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 生活導向 */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">興趣嗜好</label>
                      <div className="flex flex-wrap gap-2">
                        {GENERATION_FACTORS.lifestyleInterests.hobbies.map(h => {
                          const selected = generationRequest.selectedOptions?.lifestyle?.hobbies?.includes(h);
                          return (
                            <button key={h} type="button" onClick={() => setGenerationRequest(prev => {
                              const cur = new Set(prev.selectedOptions?.lifestyle?.hobbies || []);
                              selected ? cur.delete(h) : cur.add(h);
                              return { ...prev, selectedOptions: { ...prev.selectedOptions, lifestyle: { ...prev.selectedOptions?.lifestyle, hobbies: Array.from(cur) } } };
                            })} className={`px-2 py-1 text-xs rounded border ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300'}`}>{h}</button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 數位導向 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">科技採用度</label>
                        <div className="flex flex-wrap gap-2">
                          {GENERATION_FACTORS.digitalProfile.techAdoption.map(t => {
                            const selected = generationRequest.selectedOptions?.digital?.techAdoption?.includes(t);
                            return (
                              <button key={t} type="button" onClick={() => setGenerationRequest(prev => {
                                const cur = new Set(prev.selectedOptions?.digital?.techAdoption || []);
                                selected ? cur.delete(t) : cur.add(t);
                                return { ...prev, selectedOptions: { ...prev.selectedOptions, digital: { ...prev.selectedOptions?.digital, techAdoption: Array.from(cur) } } };
                              })} className={`px-2 py-1 text-xs rounded border ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300'}`}>{t}</button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">隱私設定</label>
                        <div className="flex flex-wrap gap-2">
                          {GENERATION_FACTORS.digitalProfile.privacySettings.map(p => {
                            const selected = generationRequest.selectedOptions?.digital?.privacySettings?.includes(p);
                            return (
                              <button key={p} type="button" onClick={() => setGenerationRequest(prev => {
                                const cur = new Set(prev.selectedOptions?.digital?.privacySettings || []);
                                selected ? cur.delete(p) : cur.add(p);
                                return { ...prev, selectedOptions: { ...prev.selectedOptions, digital: { ...prev.selectedOptions?.digital, privacySettings: Array.from(cur) } } };
                              })} className={`px-2 py-1 text-xs rounded border ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300'}`}>{p}</button>
                            );
                          })}
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              )}

              {/* 進階設定 */}
              {showAdvancedSettings && (
                <div className="border-t border-blue-200 pt-4 mt-4 space-y-4">
                  <h5 className="font-medium text-blue-800 flex items-center gap-2">
                    <Target size={16} />
                    因子權重調整
                  </h5>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(generationRequest.factorWeights || {}).map(([factor, weight]) => (
                      <div key={factor}>
                        <label className="block text-xs text-blue-700 mb-1 capitalize">
                          {factor === 'personality' ? '人格特質' :
                           factor === 'faith' ? '信仰系統' :
                           factor === 'lifestyle' ? '生活方式' :
                           factor === 'digital' ? '數位檔案' :
                           factor === 'career' ? '職業發展' : factor}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={weight}
                          onChange={(e) => updateFactorWeight(factor as keyof CharacterGenerationRequest['factorWeights'], parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-xs text-blue-600 text-center">{Math.round(weight * 100)}%</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">多樣性</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={generationRequest.diversity || 0.5}
                        onChange={(e) => setGenerationRequest(prev => ({ 
                          ...prev, 
                          diversity: parseFloat(e.target.value) 
                        }))}
                        className="w-full"
                      />
                      <div className="text-xs text-blue-600 text-center">
                        {Math.round((generationRequest.diversity || 0.5) * 100)}% 
                        {generationRequest.diversity === 0 ? ' (高度一致)' : 
                         generationRequest.diversity === 1 ? ' (高度多樣)' : ''}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">現實性</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={generationRequest.realism || 0.8}
                        onChange={(e) => setGenerationRequest(prev => ({ 
                          ...prev, 
                          realism: parseFloat(e.target.value) 
                        }))}
                        className="w-full"
                      />
                      <div className="text-xs text-blue-600 text-center">
                        {Math.round((generationRequest.realism || 0.8) * 100)}%
                        {generationRequest.realism === 0 ? ' (創意性)' : 
                         generationRequest.realism === 1 ? ' (高度現實)' : ''}
                      </div>
                    </div>
                  </div>

                  {/* 排除項目設定 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">排除性格特質</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="輸入要排除的特質"
                          className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              addExcludeItem('traits', e.currentTarget.value.trim());
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {generationRequest.excludeTraits?.map((trait, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                          >
                            {trait}
                            <button
                              onClick={() => removeExcludeItem('traits', trait)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">排除職業</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="輸入要排除的職業"
                          className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              addExcludeItem('occupations', e.currentTarget.value.trim());
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {generationRequest.excludeOccupations?.map((occupation, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                          >
                            {occupation}
                            <button
                              onClick={() => removeExcludeItem('occupations', occupation)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 禱告焦點設定 */}
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">禱告焦點偏好</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(categoryNames).map(([key, name]) => {
                        const isSelected = generationRequest.prayerFocus?.includes(key as PrayerCategory);
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              const currentFocus = generationRequest.prayerFocus || [];
                              if (isSelected) {
                                setGenerationRequest(prev => ({
                                  ...prev,
                                  prayerFocus: currentFocus.filter(cat => cat !== key)
                                }));
                              } else {
                                setGenerationRequest(prev => ({
                                  ...prev,
                                  prayerFocus: [...currentFocus, key as PrayerCategory]
                                }));
                              }
                            }}
                            className={`px-3 py-2 text-sm rounded-md transition-colors ${
                              isSelected
                                ? 'bg-purple-500 text-white'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateWithFactors}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
                >
                  <Sparkles className="inline mr-2" size={20} />
                  智能生成角色
                </button>
                <button
                  onClick={handleBatchGenerate}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors font-medium"
                >
                  <Zap className="inline mr-2" size={20} />
                  批量生成 (5個)
                </button>
              </div>
            </div>

            {/* 傳統模板選項 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-green-600" size={24} />
                <h4 className="text-lg font-semibold text-green-800">傳統角色模板</h4>
              </div>
              <p className="text-green-700 mb-4">
                選擇預設的角色模板，快速開始創建具有特定背景和特質的角色。
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {characterTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="p-4 border border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left bg-white"
                  >
                    <div className="text-3xl mb-2">{template.avatar}</div>
                    <div className="font-medium text-gray-800">{template.name}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => handleTemplateSelect('')}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors font-medium"
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
                      const seed = String((formData as any)._nameSeed ?? '').trim() || undefined;
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
                        const picked = Array.isArray(n) ? n[0] : n;
                        if (!picked) return;
                        handleInputChange('name', (picked as any).name || '');
                        handleInputChange('_nameReasons' as any, ((picked as any).reasons) || '');
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
    <div className="w-full">
      <div className="bg-white rounded-lg shadow border w-full overflow-hidden">
        {/* 頭部 */}
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <div>
            <h2 className="text-xl font-semibold">
              {editingCharacter ? '編輯角色' : '創建新角色'}
            </h2>
            <p className="text-purple-100 text-sm">
              {editingCharacter ? '修改角色設定' : '創建您的專屬虛擬人物'}
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:text-purple-200 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 內容區域（左：選項；右：即時預覽） */}
        <div className="p-4">
          {/* 快速預設工具列 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              'balanced',
              'career-focused',
              'tech-focused',
              'lifestyle-focused',
              'spiritual-focused',
              'youth-focused'
            ].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => applyQuickPreset(p as any)}
                className="px-3 py-1.5 text-sm rounded-full border border-blue-300 text-blue-700 hover:bg-blue-50"
                title="套用快速預設"
              >
                {p === 'balanced' ? '平衡' :
                 p === 'career-focused' ? '職涯導向' :
                 p === 'tech-focused' ? '科技導向' :
                 p === 'lifestyle-focused' ? '生活導向' :
                 p === 'spiritual-focused' ? '靈性導向' :
                 p === 'youth-focused' ? '青年導向' : p}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {renderStepContent()}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4 border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">即時預覽</h4>
                  <span className="text-xs text-gray-500">不影響已儲存資料</span>
                </div>

                {previewCharacter ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{previewCharacter.avatar}</div>
                      <div>
                        <div className="text-sm text-gray-500">預覽名稱</div>
                        <div className="font-medium text-gray-900">{previewCharacter.name}</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 line-clamp-5">
                      {previewCharacter.description}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded">產業：{previewCharacter.detailedProfile?.industry}</div>
                      <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded">角色：{previewCharacter.detailedProfile?.role}</div>
                      <div className="bg-gray-50 text-gray-700 px-2 py-1 rounded">年齡：{previewCharacter.age ?? '-'}</div>
                      <div className="bg-gray-50 text-gray-700 px-2 py-1 rounded">地點：{previewCharacter.location ?? '-'}</div>
                      <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded">溝通：{previewCharacter.detailedProfile?.communicationStyle}</div>
                      <div className="bg-amber-50 text-amber-700 px-2 py-1 rounded">能量：{previewCharacter.detailedProfile?.energyPattern}</div>
                      <div className="bg-teal-50 text-teal-700 px-2 py-1 rounded col-span-2">參與：{previewCharacter.detailedProfile?.participationMode}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">個性特質</div>
                      <div className="flex flex-wrap gap-1">
                        {(previewCharacter.personality || []).slice(0, 6).map((t, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-500 mb-1">興趣</div>
                      <div className="flex flex-wrap gap-1">
                        {(previewCharacter.interests || []).slice(0, 6).map((t, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      使用選項：{
                        (() => {
                          const sel = generationRequest.selectedOptions || {} as any;
                          const totals = [
                            ...(sel.demographics?.education || []),
                            ...(sel.demographics?.maritalStatus || []),
                            ...(sel.personality?.patterns || []),
                            ...(sel.personality?.communication || []),
                            ...(sel.faith?.background || []),
                            ...(sel.faith?.practices || []),
                            ...(sel.faith?.growth || []),
                            ...(sel.faith?.community || []),
                            ...(sel.lifestyle?.hobbies || []),
                            ...(sel.lifestyle?.activities || []),
                            ...(sel.digital?.devices || []),
                            ...(sel.digital?.techAdoption || []),
                            ...(sel.digital?.privacySettings || []),
                            ...(sel.career?.roles || []),
                            ...(sel.factors?.participationMode || []),
                            ...(sel.factors?.energyPattern || [])
                          ].length;
                          return totals;
                        })()
                      } 項
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">調整左側條件，即可即時預覽</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="border-t p-4 sticky bottom-0 bg-white z-10">
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
              <button
                onClick={handleSave}
                className="flex items-center px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingCharacter ? '更新角色' : '創建角色'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showBatchSelection && renderBatchSelection()}
    </div>
  );
}
