import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { CustomCharacter, PrayerCategory } from '../types';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'custom_characters';

export function useCustomCharacters() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<CustomCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 從本地存儲載入自訂角色
  const loadLocalCharacters = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedCharacters = JSON.parse(stored).map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        }));
        setCharacters(parsedCharacters);
      }
    } catch (error) {
      console.error('載入自訂角色失敗:', error);
      toast.error('載入角色資料失敗');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 保存到本地存儲
  const saveLocalCharacters = useCallback((newCharacters: CustomCharacter[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCharacters));
      setCharacters(newCharacters);
    } catch (error) {
      console.error('保存自訂角色失敗:', error);
      toast.error('保存角色失敗');
    }
  }, []);

  // 初始化載入
  useEffect(() => {
    loadLocalCharacters();
  }, [loadLocalCharacters]);

  // 創建新角色
  const createCharacter = useCallback((characterData: Omit<CustomCharacter, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const newCharacter: CustomCharacter = {
      ...characterData,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user?.uid || 'anonymous' // 未登入用戶使用 'anonymous'
    };

    const updatedCharacters = [...characters, newCharacter];
    saveLocalCharacters(updatedCharacters);
    toast.success(`角色「${newCharacter.name}」創建成功！`);
    return newCharacter;
  }, [characters, user?.uid, saveLocalCharacters]);

  // 更新角色
  const updateCharacter = useCallback((characterId: string, updates: Partial<CustomCharacter>) => {
    const updatedCharacters = characters.map(character => 
      character.id === characterId 
        ? { ...character, ...updates, updatedAt: new Date() }
        : character
    );
    saveLocalCharacters(updatedCharacters);
    toast.success('角色更新成功！');
  }, [characters, saveLocalCharacters]);

  // 刪除角色
  const deleteCharacter = useCallback((characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    const updatedCharacters = characters.filter(c => c.id !== characterId);
    saveLocalCharacters(updatedCharacters);
    toast.success(`角色「${character?.name}」已刪除`);
  }, [characters, saveLocalCharacters]);

  // 複製角色
  const duplicateCharacter = useCallback((characterId: string) => {
    const originalCharacter = characters.find(c => c.id === characterId);
    if (!originalCharacter) return null;

    const duplicatedCharacter: CustomCharacter = {
      ...originalCharacter,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${originalCharacter.name} (副本)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user?.uid || 'anonymous'
    };

    const updatedCharacters = [...characters, duplicatedCharacter];
    saveLocalCharacters(updatedCharacters);
    toast.success(`角色「${duplicatedCharacter.name}」複製成功！`);
    return duplicatedCharacter;
  }, [characters, user?.uid, saveLocalCharacters]);

  // 匯出角色
  const exportCharacter = useCallback((characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    const exportData = {
      ...character,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `character_${character.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('角色匯出成功！');
  }, [characters]);

  // 匯入角色
  const importCharacter = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        // 驗證匯入的數據格式
        if (!importData.name || !importData.description) {
          throw new Error('無效的角色文件格式');
        }

        const importedCharacter: CustomCharacter = {
          ...importData,
          id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user?.uid || 'anonymous',
          name: `${importData.name} (匯入)`
        };

        const updatedCharacters = [...characters, importedCharacter];
        saveLocalCharacters(updatedCharacters);
        toast.success(`角色「${importedCharacter.name}」匯入成功！`);
      } catch (error) {
        console.error('匯入角色失敗:', error);
        toast.error('匯入角色失敗，請檢查文件格式');
      }
    };
    reader.readAsText(file);
  }, [characters, user?.uid, saveLocalCharacters]);

  // 獲取用戶的角色（如果未登入則返回所有本地角色）
  const getUserCharacters = useCallback(() => {
    if (!user) return characters; // 未登入時返回所有本地角色
    return characters.filter(c => c.userId === user.uid || !c.userId); // 登入時返回用戶角色和未標記用戶的角色
  }, [characters, user]);

  // 獲取公開角色
  const getPublicCharacters = useCallback(() => {
    return characters.filter(c => c.isPublic);
  }, [characters]);

  // 搜尋角色
  const searchCharacters = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return characters.filter(character => 
      character.name.toLowerCase().includes(lowerQuery) ||
      character.description.toLowerCase().includes(lowerQuery) ||
      character.occupation?.toLowerCase().includes(lowerQuery) ||
      character.personality.some(trait => trait.toLowerCase().includes(lowerQuery))
    );
  }, [characters]);

  // 按分類篩選角色
  const filterByCategory = useCallback((category: PrayerCategory) => {
    return characters.filter(character => 
      character.preferredCategories.includes(category)
    );
  }, [characters]);

  return {
    characters,
    isLoading,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    duplicateCharacter,
    exportCharacter,
    importCharacter,
    getUserCharacters,
    getPublicCharacters,
    searchCharacters,
    filterByCategory
  };
}
