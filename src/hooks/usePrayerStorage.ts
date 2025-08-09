import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { PrayerCloudService } from '../services/cloudStorage';
import { Prayer, PrayerCategory, CloudSyncStatus } from '../types';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'prayer_history';


export function usePrayerStorage() {
  const [user] = useAuthState(auth);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>({
    isOnline: navigator.onLine,
    lastSyncAt: null,
    pendingUploads: 0,
    pendingDownloads: 0,
    syncError: null
  });
  const [isLoading, setIsLoading] = useState(true);

  const cloudService = user ? new PrayerCloudService(user.uid) : null;

  // 從 localStorage 加載禱告歷史
  const loadLocalPrayers = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedPrayers = JSON.parse(stored).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt || p.createdAt),
          syncStatus: p.syncStatus || 'pending'
        }));
        setPrayers(parsedPrayers);
      }
    } catch (error) {
      console.error('加載本地禱告歷史時出錯:', error);
      toast.error('加載本地資料失敗');
    }
  }, []);

  // 保存到 localStorage
  const saveLocalPrayers = useCallback((newPrayers: Prayer[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrayers));
      setPrayers(newPrayers);
    } catch (error) {
      console.error('保存禱告歷史時出錯:', error);
      toast.error('保存資料失敗');
    }
  }, []);

  // 同步到雲端
  const syncToCloud = useCallback(async () => {
    if (!cloudService || !navigator.onLine) return;

    try {
      setSyncStatus(prev => ({ ...prev, syncError: null }));

      // 上傳待同步的禱告
      const pendingPrayers = prayers.filter(p => p.syncStatus === 'pending' && !p.userId);
      
      for (const prayer of pendingPrayers) {
        try {
          const cloudId = await cloudService.savePrayer({
            ...prayer,
            userId: user!.uid
          });
          
          // 更新本地記錄
          const updatedPrayers = prayers.map(p => 
            p.id === prayer.id 
              ? { ...p, id: cloudId, userId: user!.uid, syncStatus: 'synced' as const }
              : p
          );
          saveLocalPrayers(updatedPrayers);
        } catch (error) {
          console.error('上傳禱告失敗:', error);
          // 標記為錯誤狀態
          const updatedPrayers = prayers.map(p => 
            p.id === prayer.id 
              ? { ...p, syncStatus: 'error' as const }
              : p
          );
          saveLocalPrayers(updatedPrayers);
        }
      }

      setSyncStatus(prev => ({
        ...prev,
        lastSyncAt: new Date(),
        pendingUploads: 0
      }));

      toast.success('同步完成');
    } catch (error) {
      console.error('同步失敗:', error);
      setSyncStatus(prev => ({
        ...prev,
        syncError: '同步失敗，請檢查網路連線'
      }));
      toast.error('同步失敗');
    }
  }, [cloudService, prayers, user, saveLocalPrayers]);

  // 從雲端載入禱告
  const loadFromCloud = useCallback(async () => {
    if (!cloudService) return;

    try {
      setIsLoading(true);
      const cloudPrayers = await cloudService.getUserPrayers();
      
      // 合併本地和雲端資料
      const localPrayers = prayers.filter(p => p.syncStatus === 'pending');
      const mergedPrayers = [...cloudPrayers, ...localPrayers];
      
      // 去重（以 ID 為準）
      const uniquePrayers = mergedPrayers.filter((prayer, index, self) => 
        index === self.findIndex(p => p.id === prayer.id)
      );
      
      saveLocalPrayers(uniquePrayers);
      
      setSyncStatus(prev => ({
        ...prev,
        lastSyncAt: new Date(),
        pendingDownloads: 0
      }));
    } catch (error) {
      console.error('從雲端載入失敗:', error);
      toast.error('載入雲端資料失敗');
    } finally {
      setIsLoading(false);
    }
  }, [cloudService, prayers, saveLocalPrayers]);

  // 監聽網路狀態
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      if (user) {
        syncToCloud();
      }
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user, syncToCloud]);

  // 用戶登入時載入雲端資料
  useEffect(() => {
    if (user) {
      loadFromCloud();
    } else {
      loadLocalPrayers();
      setIsLoading(false);
    }
  }, [user, loadFromCloud, loadLocalPrayers]);

  // 設置雲端資料監聽
  useEffect(() => {
    if (!cloudService) return;

    const unsubscribe = cloudService.onPrayersChange((cloudPrayers) => {
      // 合併本地待同步的禱告
      const localPendingPrayers = prayers.filter(p => p.syncStatus === 'pending');
      const mergedPrayers = [...cloudPrayers, ...localPendingPrayers];
      
      const uniquePrayers = mergedPrayers.filter((prayer, index, self) => 
        index === self.findIndex(p => p.id === prayer.id)
      );
      
      saveLocalPrayers(uniquePrayers);
    });

    return unsubscribe;
  }, [cloudService, prayers, saveLocalPrayers]);

  // 添加新禱告
  const addPrayer = useCallback(async (
    content: string, 
    category: PrayerCategory, 
    tags: string[] = []
  ): Promise<Prayer> => {
    const newPrayer: Prayer = {
      id: Date.now().toString(),
      content,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags,
      isFavorite: false,
      userId: user?.uid,
      syncStatus: user ? 'pending' : 'synced'
    };
    
    const updatedPrayers = [newPrayer, ...prayers];
    saveLocalPrayers(updatedPrayers);
    
    // 如果用戶已登入且在線，立即同步
    if (user && navigator.onLine) {
      try {
        const cloudId = await cloudService!.savePrayer(newPrayer);
        const syncedPrayers = updatedPrayers.map(p => 
          p.id === newPrayer.id 
            ? { ...p, id: cloudId, syncStatus: 'synced' as const }
            : p
        );
        saveLocalPrayers(syncedPrayers);
      } catch (error) {
        console.error('立即同步失敗:', error);
        setSyncStatus(prev => ({ ...prev, pendingUploads: prev.pendingUploads + 1 }));
      }
    }
    
    return newPrayer;
  }, [prayers, user, cloudService, saveLocalPrayers]);

  // 切換收藏狀態
  const toggleFavorite = useCallback(async (id: string) => {
    const updatedPrayers = prayers.map(prayer => {
      if (prayer.id === id) {
        const updated = { 
          ...prayer, 
          isFavorite: !prayer.isFavorite,
          updatedAt: new Date(),
          syncStatus: user ? 'pending' as const : 'synced' as const
        };
        return updated;
      }
      return prayer;
    });
    
    saveLocalPrayers(updatedPrayers);
    
    // 如果用戶已登入，同步到雲端
    if (user && cloudService && navigator.onLine) {
      try {
        const prayer = updatedPrayers.find(p => p.id === id);
        if (prayer) {
          await cloudService.updatePrayer(id, { 
            isFavorite: prayer.isFavorite,
            updatedAt: prayer.updatedAt
          });
          
          const syncedPrayers = updatedPrayers.map(p => 
            p.id === id ? { ...p, syncStatus: 'synced' as const } : p
          );
          saveLocalPrayers(syncedPrayers);
        }
      } catch (error) {
        console.error('同步收藏狀態失敗:', error);
      }
    }
  }, [prayers, user, cloudService, saveLocalPrayers]);

  // 刪除禱告
  const deletePrayer = useCallback(async (id: string) => {
    const updatedPrayers = prayers.filter(prayer => prayer.id !== id);
    saveLocalPrayers(updatedPrayers);
    
    // 如果用戶已登入，從雲端刪除
    if (user && cloudService && navigator.onLine) {
      try {
        await cloudService.deletePrayer(id);
      } catch (error) {
        console.error('從雲端刪除失敗:', error);
        toast.error('刪除失敗，請稍後重試');
      }
    }
  }, [prayers, user, cloudService, saveLocalPrayers]);

  // 分享禱告
  const sharePrayer = useCallback(async (prayerId: string) => {
    if (!user || !cloudService) {
      toast.error('請先登入');
      return;
    }

    try {
      await cloudService.sharePrayer(prayerId, user.displayName || '匿名用戶');
      toast.success('禱告已分享到社群');
    } catch (error) {
      console.error('分享禱告失敗:', error);
      toast.error('分享失敗');
    }
  }, [user, cloudService]);

  // 按分類篩選
  const getPrayersByCategory = useCallback((category: PrayerCategory) => {
    return prayers.filter(prayer => prayer.category === category);
  }, [prayers]);

  // 獲取收藏的禱告
  const getFavoritePrayers = useCallback(() => {
    return prayers.filter(prayer => prayer.isFavorite);
  }, [prayers]);

  // 手動同步
  const manualSync = useCallback(async () => {
    if (!user) {
      toast.error('請先登入');
      return;
    }

    if (!navigator.onLine) {
      toast.error('請檢查網路連線');
      return;
    }

    await syncToCloud();
  }, [user, syncToCloud]);

  return {
    prayers,
    syncStatus,
    isLoading,
    addPrayer,
    toggleFavorite,
    deletePrayer,
    sharePrayer,
    getPrayersByCategory,
    getFavoritePrayers,
    manualSync
  };
}
