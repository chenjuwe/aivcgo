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
  preferredCategories: PrayerCategory[];
  prayerStyle: 'formal' | 'casual' | 'traditional';
  commonNeeds: string[];
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
