export interface Prayer {
  id: string;
  content: string;
  category: PrayerCategory;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isFavorite: boolean;
  userId?: string; // 雲端用戶ID
  isShared?: boolean; // 是否公開分享
  syncStatus: 'synced' | 'pending' | 'error'; // 同步狀態
}

export type PrayerCategory = 
  | 'gratitude'    // 感恩
  | 'petition'     // 祈求
  | 'confession'   // 懺悔
  | 'praise'       // 讚美
  | 'intercession' // 代禱
  | 'protection'   // 保護
  | 'guidance';    // 引導

export interface PrayerRequest {
  category: PrayerCategory;
  specificNeeds?: string;
  length: 'short' | 'medium' | 'long';
  tone: 'formal' | 'casual' | 'traditional';
  characterId?: string; // 新增角色ID
}

export interface PrayerTemplate {
  category: PrayerCategory;
  templates: {
    opening: string[];
    body: string[];
    closing: string[];
  };
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultCategory: PrayerCategory;
  defaultLength: 'short' | 'medium' | 'long';
  defaultTone: 'formal' | 'casual' | 'traditional';
  enableNotifications: boolean;
  enableCloudSync: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface SharedPrayer {
  id: string;
  prayerId: string;
  sharedBy: string;
  sharedByName: string;
  sharedAt: Date;
  likes: number;
  isLikedByUser?: boolean;
}

export interface CloudSyncStatus {
  isOnline: boolean;
  lastSyncAt: Date | null;
  pendingUploads: number;
  pendingDownloads: number;
  syncError: string | null;
}

export interface CustomCharacter {
  id: string;
  name: string;
  description: string;
  avatar: string;
  background: string;
  personality: string[];
  age?: number;
  occupation?: string;
  location?: string;
  interests: string[];
  challenges: string[];
  preferredCategories?: PrayerCategory[];
  prayerStyle?: 'formal' | 'casual' | 'traditional';
  commonNeeds?: string[];
  customTemplates?: {
    [key in PrayerCategory]?: {
      opening: string[];
      body: string[];
      closing: string[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  isPublic: boolean;
}

export interface CharacterTemplate {
  id: string;
  name: string;
  description: string;
  avatar: string;
  basePersonality: string[];
  suggestedOccupations: string[];
  typicalChallenges: string[];
  recommendedCategories: PrayerCategory[];
  defaultStyle: 'formal' | 'casual' | 'traditional';
}

// 生成因子相關類型定義
export interface CharacterGenerationFactors {
  // 基礎人口統計
  demographics: {
    ageRange: { min: number; max: number };
    gender: string[];
    education: string[];
    maritalStatus: string[];
  };
  
  // 職業經濟
  occupationEconomy: {
    industries: Array<{
      name: string;
      roles: string[];
      id: string;
      code: string;
      codes: {
        NAICS: string[];
        ISIC: string[];
      };
      codesSummary: {
        ISCO: string[];
        SOC: string[];
      };
    }>;
    skillsMap: {
      languages: Array<{
        topic: string;
        level: string;
        rawLevel?: string;
      }>;
      technical: string[];
      soft: string[];
    };
  };
  
  // 人格特質
  personality: {
    dimensions: Array<{
      name: string;
      values: string[];
      weights?: Record<string, number>;
    }>;
    patterns: string[];
    communication: string[];
  };
  
  // 信仰系統（已移除於生成流程，保留類型空位以兼容其他模組）
  faith?: {
    background?: string[];
    practices?: string[];
    growth?: string[];
    community?: string[];
  };
  
  // 生活方式興趣
  lifestyleInterests: {
    hobbies: string[];
    languages: {
      communication: Array<{
        topic: string;
        level: string;
        rawLevel?: string;
      }>;
      cultural: string[];
    };
    activities: string[];
  };
  
  // 數位檔案
  digitalProfile: {
    techAdoption: string[];
    privacySettings: string[];
    digitalLiteracy: string[];
    devices: string[];
  };
  
  // 生成配置
  generationConfig: {
    distributions: Record<string, any>;
    rules: Record<string, any>;
    correlations: Record<string, any>;
  };
  
  // 能量曲線和參與模式
  factors: {
    energyCurve: {
      default: Record<string, number>;
      byIndustry: Record<string, Record<string, number>>;
    };
    participationMode: {
      enum: string[];
      defaultWeights: Record<string, number>;
      byIndustryBias: Record<string, Record<string, number>>;
    };
  };
}

// 擴展的 CustomCharacter 類型
export interface EnhancedCustomCharacter extends CustomCharacter {
  // 生成因子相關
  generationFactors?: Partial<CharacterGenerationFactors>;
  
  // 新增的詳細屬性
  detailedProfile?: {
    // 職業相關
    industry?: string;
    role?: string;
    experience?: number;
    skills?: string[];
    certifications?: string[];
    seniorityLevel?: string;
    
    // 個人特質
    personalityTraits?: Record<string, number>;
    communicationStyle?: string;
    learningStyle?: string;
    participationMode?: string;
    
    // 生活狀況
    familySituation?: string;
    livingArrangement?: string;
    financialStatus?: string;
    
    // 數位偏好
    techComfort?: string;
    privacyConcerns?: string;
    notificationPreferences?: string;
    
    // 時間管理
    scheduleType?: string;
    energyPattern?: string;
    availability?: string[];
  };
  
  // 生成元數據
  generationMeta?: {
    seed?: string;
    factors?: string[];
    version?: string;
    generatedAt?: Date;
  };
}

// 角色生成請求
export interface CharacterGenerationRequest {
  // 基礎偏好
  gender?: string;
  ageRange?: { min: number; max: number };
  occupation?: string;
  industry?: string;
  
  // 經濟狀況（可選）
  incomeRange?: '1~3萬' | '3~7萬' | '7~10萬' | '10~15萬' | '15~20萬' | '20萬+';
  financialHabit?: '節儉型' | '平衡型' | '消費型';
  charityGiving?: '定期奉獻' | '偶爾捐獻' | '特殊奉獻';
  
  // 生成因子權重
  factorWeights?: {
    personality?: number;
    faith?: number;
    lifestyle?: number;
    digital?: number;
    career?: number;
  };
  
  // 特定需求
  specificNeeds?: string[];
  prayerFocus?: string[];
  
  // 生成選項
  seed?: string;
  diversity?: number;
  realism?: number;
  seniorityLevel?: 'intern' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director';
  
  // 排除項目
  excludeTraits?: string[];
  excludeOccupations?: string[];

  // 使用者自由多選偏好（每一個導向）
  selectedOptions?: {
    demographics?: {
      education?: string[];
      maritalStatus?: string[];
    };
    personality?: {
      patterns?: string[];
      communication?: string[];
    };
    faith?: {
      background?: string[];
      practices?: string[];
      growth?: string[];
      community?: string[];
    };
    lifestyle?: {
      hobbies?: string[];
      activities?: string[];
    };
    digital?: {
      devices?: string[];
      techAdoption?: string[];
      privacySettings?: string[];
    };
    career?: {
      // roles?: string[]; // 已移除偏好角色（依所選產業）
    };
    factors?: {
      participationMode?: string[];
      energyPattern?: string[];
    };
  };
}
