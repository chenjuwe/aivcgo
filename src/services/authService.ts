import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { UserCloudService } from './cloudStorage';
import { User, UserPreferences } from '../types';

export class AuthService {
  private userService = new UserCloudService();

  // 預設用戶偏好設定
  private getDefaultPreferences(): UserPreferences {
    return {
      defaultCategory: 'gratitude',
      defaultLength: 'medium',
      defaultTone: 'formal',
      enableNotifications: true,
      enableCloudSync: true,
      theme: 'system'
    };
  }

  // 將 Firebase 用戶轉換為應用用戶
  private async convertFirebaseUser(firebaseUser: FirebaseUser): Promise<User> {
    let user = await this.userService.getUser(firebaseUser.uid);
    
    if (!user) {
      // 如果用戶不存在，創建新用戶
      user = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: new Date(),
        preferences: this.getDefaultPreferences()
      };
      
      await this.userService.createOrUpdateUser(user);
    }
    
    return user;
  }

  // 電子郵件註冊
  async signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 更新用戶顯示名稱
      await updateProfile(userCredential.user, { displayName });
      
      // 創建應用用戶資料
      const user = await this.convertFirebaseUser(userCredential.user);
      
      return user;
    } catch (error) {
      console.error('註冊失敗:', error);
      throw error;
    }
  }

  // 電子郵件登入
  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = await this.convertFirebaseUser(userCredential.user);
      
      return user;
    } catch (error) {
      console.error('登入失敗:', error);
      throw error;
    }
  }

  // Google 登入
  async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = await this.convertFirebaseUser(userCredential.user);
      
      return user;
    } catch (error) {
      console.error('Google 登入失敗:', error);
      throw error;
    }
  }

  // 登出
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('登出失敗:', error);
      throw error;
    }
  }

  // 重設密碼
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('重設密碼失敗:', error);
      throw error;
    }
  }

  // 更新用戶資料
  async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, updates);
        
        // 同步更新到 Firestore
        const user = await this.userService.getUser(auth.currentUser.uid);
        if (user) {
          await this.userService.createOrUpdateUser({
            ...user,
            displayName: updates.displayName || user.displayName,
            photoURL: updates.photoURL || user.photoURL
          });
        }
      }
    } catch (error) {
      console.error('更新用戶資料失敗:', error);
      throw error;
    }
  }

  // 更新用戶偏好設定
  async updateUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      if (auth.currentUser) {
        await this.userService.updateUserPreferences(auth.currentUser.uid, preferences);
      }
    } catch (error) {
      console.error('更新用戶偏好失敗:', error);
      throw error;
    }
  }

  // 獲取當前用戶
  async getCurrentUser(): Promise<User | null> {
    try {
      if (auth.currentUser) {
        return await this.convertFirebaseUser(auth.currentUser);
      }
      return null;
    } catch (error) {
      console.error('獲取當前用戶失敗:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
