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
