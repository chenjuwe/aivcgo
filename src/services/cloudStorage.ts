import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Prayer, SharedPrayer, User, UserPreferences } from '../types';

// 禱告相關服務
export class PrayerCloudService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // 獲取用戶的所有禱告
  async getUserPrayers(): Promise<Prayer[]> {
    try {
      const q = query(
        collection(db, 'prayers'),
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          syncStatus: 'synced' as const
        } as Prayer;
      });
    } catch (error) {
      console.error('獲取禱告失敗:', error);
      throw error;
    }
  }

  // 保存禱告到雲端
  async savePrayer(prayer: Omit<Prayer, 'id' | 'syncStatus'>): Promise<string> {
    try {
      const prayerData = {
        ...prayer,
        userId: this.userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'prayers'), prayerData);
      return docRef.id;
    } catch (error) {
      console.error('保存禱告失敗:', error);
      throw error;
    }
  }

  // 更新禱告
  async updatePrayer(prayerId: string, updates: Partial<Prayer>): Promise<void> {
    try {
      const prayerRef = doc(db, 'prayers', prayerId);
      await updateDoc(prayerRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('更新禱告失敗:', error);
      throw error;
    }
  }

  // 刪除禱告
  async deletePrayer(prayerId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'prayers', prayerId));
    } catch (error) {
      console.error('刪除禱告失敗:', error);
      throw error;
    }
  }

  // 監聽禱告變化
  onPrayersChange(callback: (prayers: Prayer[]) => void): () => void {
    const q = query(
      collection(db, 'prayers'),
      where('userId', '==', this.userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const prayers = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          syncStatus: 'synced' as const
        } as Prayer;
      });
      callback(prayers);
    });
  }

  // 分享禱告
  async sharePrayer(prayerId: string, userName: string): Promise<void> {
    try {
      const sharedPrayerData = {
        prayerId,
        sharedBy: this.userId,
        sharedByName: userName,
        sharedAt: serverTimestamp(),
        likes: 0
      };

      await addDoc(collection(db, 'sharedPrayers'), sharedPrayerData);
      
      // 更新原禱告的分享狀態
      await this.updatePrayer(prayerId, { isShared: true });
    } catch (error) {
      console.error('分享禱告失敗:', error);
      throw error;
    }
  }

  // 獲取公開分享的禱告
  async getSharedPrayers(limitCount = 20): Promise<(SharedPrayer & { prayer: Prayer })[]> {
    try {
      const q = query(
        collection(db, 'sharedPrayers'),
        orderBy('sharedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const sharedPrayers = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const sharedData = docSnap.data();
          const prayerDoc = await getDoc(doc(db, 'prayers', sharedData.prayerId));
          
          if (prayerDoc.exists()) {
            const prayerData = prayerDoc.data();
            return {
              id: docSnap.id,
              ...sharedData,
              sharedAt: sharedData.sharedAt?.toDate() || new Date(),
              prayer: {
                id: prayerDoc.id,
                ...prayerData,
                createdAt: prayerData.createdAt?.toDate() || new Date(),
                updatedAt: prayerData.updatedAt?.toDate() || new Date(),
                syncStatus: 'synced' as const
              } as Prayer
            } as SharedPrayer & { prayer: Prayer };
          }
          return null;
        })
      );

      return sharedPrayers.filter(Boolean) as (SharedPrayer & { prayer: Prayer })[];
    } catch (error) {
      console.error('獲取分享禱告失敗:', error);
      throw error;
    }
  }
}

// 用戶相關服務
export class UserCloudService {
  // 創建或更新用戶資料
  async createOrUpdateUser(user: Omit<User, 'createdAt'>): Promise<void> {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // 更新現有用戶
        await updateDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          preferences: user.preferences
        });
      } else {
        // 創建新用戶
        await updateDoc(userRef, {
          ...user,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('創建或更新用戶失敗:', error);
      throw error;
    }
  }

  // 獲取用戶資料
  async getUser(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as User;
      }
      
      return null;
    } catch (error) {
      console.error('獲取用戶資料失敗:', error);
      throw error;
    }
  }

  // 更新用戶偏好設定
  async updateUserPreferences(uid: string, preferences: UserPreferences): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { preferences });
    } catch (error) {
      console.error('更新用戶偏好失敗:', error);
      throw error;
    }
  }
}
