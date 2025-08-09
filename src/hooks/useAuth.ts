import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { authService } from '../services/authService';
import { User, UserPreferences } from '../types';
import toast from 'react-hot-toast';

export function useAuth() {
  const [firebaseUser, loading, error] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 當 Firebase 用戶狀態改變時，獲取完整的用戶資料
  useEffect(() => {
    const loadUser = async () => {
      if (firebaseUser) {
        try {
          const appUser = await authService.getCurrentUser();
          setUser(appUser);
        } catch (error) {
          console.error('載入用戶資料失敗:', error);
          toast.error('載入用戶資料失敗');
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    if (!loading) {
      loadUser();
    }
  }, [firebaseUser, loading]);

  // 註冊
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setIsLoading(true);
      const newUser = await authService.signUpWithEmail(email, password, displayName);
      setUser(newUser);
      toast.success('註冊成功！歡迎使用禱告生成器');
      return newUser;
    } catch (error: any) {
      console.error('註冊失敗:', error);
      
      // 處理常見錯誤
      let errorMessage = '註冊失敗';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = '此電子郵件已被使用';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = '密碼強度不足，請使用至少6個字符';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '電子郵件格式無效';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登入
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const user = await authService.signInWithEmail(email, password);
      setUser(user);
      toast.success('登入成功！');
      return user;
    } catch (error: any) {
      console.error('登入失敗:', error);
      
      let errorMessage = '登入失敗';
      if (error.code === 'auth/user-not-found') {
        errorMessage = '用戶不存在';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = '密碼錯誤';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '電子郵件格式無效';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = '登入嘗試次數過多，請稍後再試';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Google 登入
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const user = await authService.signInWithGoogle();
      setUser(user);
      toast.success('Google 登入成功！');
      return user;
    } catch (error: any) {
      console.error('Google 登入失敗:', error);
      
      let errorMessage = 'Google 登入失敗';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = '登入已取消';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = '彈出視窗被阻擋，請允許彈出視窗';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出
  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      toast.success('已登出');
    } catch (error) {
      console.error('登出失敗:', error);
      toast.error('登出失敗');
    }
  };

  // 重設密碼
  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
      toast.success('密碼重設郵件已發送，請檢查您的信箱');
    } catch (error: any) {
      console.error('重設密碼失敗:', error);
      
      let errorMessage = '重設密碼失敗';
      if (error.code === 'auth/user-not-found') {
        errorMessage = '此電子郵件未註冊';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '電子郵件格式無效';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // 更新用戶資料
  const updateProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    try {
      setIsLoading(true);
      await authService.updateUserProfile(updates);
      
      // 更新本地用戶狀態
      if (user) {
        const updatedUser = {
          ...user,
          displayName: updates.displayName || user.displayName,
          photoURL: updates.photoURL || user.photoURL
        };
        setUser(updatedUser);
      }
      
      toast.success('用戶資料已更新');
    } catch (error) {
      console.error('更新用戶資料失敗:', error);
      toast.error('更新用戶資料失敗');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 更新用戶偏好設定
  const updatePreferences = async (preferences: UserPreferences) => {
    try {
      setIsLoading(true);
      await authService.updateUserPreferences(preferences);
      
      // 更新本地用戶狀態
      if (user) {
        const updatedUser = { ...user, preferences };
        setUser(updatedUser);
      }
      
      toast.success('偏好設定已更新');
    } catch (error) {
      console.error('更新偏好設定失敗:', error);
      toast.error('更新偏好設定失敗');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading: isLoading || loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    updatePreferences,
    isAuthenticated: !!user
  };
}
