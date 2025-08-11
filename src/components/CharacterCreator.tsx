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
