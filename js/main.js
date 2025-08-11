// js/main.js - 主要應用程式邏輯

import { sample } from './utils.js';
import { generateRandomCharacter, generateCharacterFromTemplate } from './character.js';
import { generatePrayerRequest, generateMiracle } from './faith.js';

// Firebase 導入
import { initializeApp as firebaseInitializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyB_XsEzzx8NVos9lpwrZpgZOQpng2zO8yI",
  authDomain: "vcgowe.firebaseapp.com",
  projectId: "vcgowe",
  storageBucket: "vcgowe.appspot.com",
  messagingSenderId: "20556378969",
  appId: "1:20556378969:web:b614cf4fc5b86e98c59248",
  measurementId: "G-C0931MDFVK"
};

// 初始化 Firebase
const app = firebaseInitializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// 全域變數
let characters = [];
let currentCharacter = null;

let currentUser = null; // 當前登入用戶

// Firebase 認證功能
function handleGoogleLogin() {
  console.log("嘗試Google登入...");
  
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  
  // 設定自定義參數來改善跨域問題
  provider.setCustomParameters({
    'prompt': 'select_account',
    'access_type': 'online'
  });
  
  console.log("嘗試彈出窗口登入");
  
  try {
    // 嘗試彈出視窗登入
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Google登入成功:", user);
        showNotification("登入成功！", 'success');
        currentUser = user;
        updateUIForAuthState(user);
      })
      .catch(error => {
        console.error("登入失敗:", error);
        
        // 處理各種錯誤情況
        if (error.code === 'auth/popup-blocked') {
          showNotification("登入失敗：彈出視窗被瀏覽器阻擋，請允許彈出視窗後重試", 'error');
                      // 提供替代方案
            setTimeout(() => {
              const choice = confirm("是否嘗試重新導向登入？\n\n點擊「確定」使用重新導向登入\n點擊「取消」以訪客模式繼續使用");
              if (choice) {
                handleRedirectLogin();
              } else {
                handleGuestMode();
              }
            }, 2000);
        } else if (error.code === 'auth/network-request-failed') {
          showNotification("登入失敗：網路連線問題，請確認您的網路連線後重試", 'error');
        } else if (error.code === 'auth/cancelled-popup-request') {
          showNotification("登入取消：您關閉了登入窗口", 'warning');
        } else if (error.code === 'auth/popup-closed-by-user') {
          showNotification("登入取消：您關閉了登入窗口", 'warning');
        } else if (error.code === 'auth/unauthorized-domain') {
          showNotification("登入失敗：域名未授權，請聯繫管理員", 'error');
        } else {
          showNotification(`登入失敗：${error.message}`, 'error');
          console.error("詳細錯誤信息:", error);
        }
      });
  } catch (error) {
    console.error("登入過程中發生未預期錯誤:", error);
    showNotification(`登入過程中發生未預期錯誤: ${error.toString()}`, 'error');
  }
}

// 新增：重新導向登入作為備用方案
function handleRedirectLogin() {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      'prompt': 'select_account',
      'access_type': 'online'
    });
    
    // 使用重新導向而非彈出視窗
    signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("重新導向登入失敗:", error);
    showNotification("重新導向登入也失敗了，請稍後再試", 'error');
  }
}

// 新增：訪客模式
function handleGuestMode() {
  console.log("進入訪客模式");
  
  // 創建一個模擬的訪客用戶
  const guestUser = {
    uid: 'guest_' + Date.now(),
    displayName: '訪客用戶',
    email: 'guest@example.com',
    isGuest: true
  };
  
  currentUser = guestUser;
  updateUIForAuthState(guestUser);
  
  showNotification("已進入訪客模式，功能完全可用！", 'success');
  
  // 隱藏歡迎訊息，顯示主要功能
  const welcomeMessage = document.getElementById('welcome-message');
  const container = document.querySelector('.container');
  
  if (welcomeMessage) {
    welcomeMessage.style.display = 'none';
  }
  
  if (container) {
    container.style.display = 'flex';
  }
}

function handleLogout() {
  signOut(auth).then(() => {
    console.log("登出成功");
    showNotification("已成功登出", 'success');
    currentUser = null;
    updateUIForAuthState(null);
  }).catch((error) => {
    console.error("登出失敗:", error);
    showNotification("登出失敗，請重試", 'error');
  });
}

// 新增：訪客登出功能
function handleGuestLogout() {
  console.log("退出訪客模式");
  currentUser = null;
  updateUIForAuthState(null);
  showNotification("已退出訪客模式", 'success');
  
  // 顯示歡迎訊息，隱藏主要功能
  const welcomeMessage = document.getElementById('welcome-message');
  const container = document.querySelector('.container');
  
  if (welcomeMessage) {
    welcomeMessage.style.display = 'block';
  }
  
  if (container) {
    container.style.display = 'none';
  }
}

function updateUIForAuthState(user) {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (user) {
    // 用戶已登入（包括訪客模式）
    if (loginBtn) {
      loginBtn.id = 'logoutBtn';
      loginBtn.textContent = user.isGuest ? '退出訪客模式' : '登出帳號';
      loginBtn.onclick = user.isGuest ? handleGuestLogout : handleLogout;
    } else if (logoutBtn) {
      logoutBtn.textContent = user.isGuest ? '退出訪客模式' : '登出帳號';
      logoutBtn.onclick = user.isGuest ? handleGuestLogout : handleLogout;
    }
    
    // 啟用功能按鈕
    const generateBtn = document.getElementById('generateBtn');
    const generateNegativeBtn = document.getElementById('generateNegativeBtn');
    
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.title = '';
    }
    if (generateNegativeBtn) {
      generateNegativeBtn.disabled = false;
      generateNegativeBtn.title = '';
    }
    
    console.log("用戶已登入:", user.displayName);
  } else {
    // 用戶未登入 - 隱藏人物區域但保留數據
    const welcomeMessage = document.getElementById('welcome-message');
    const container = document.querySelector('.container');
    
    if (container) {
      container.style.display = 'none';
    }
    if (welcomeMessage) {
      welcomeMessage.style.display = 'block';
    }
    
    if (logoutBtn) {
      logoutBtn.id = 'loginBtn';
      logoutBtn.textContent = '登入帳號';
      logoutBtn.onclick = handleGoogleLogin;
    } else if (loginBtn) {
      loginBtn.textContent = '登入帳號';
      loginBtn.onclick = handleGoogleLogin;
    }
    
    // 禁用功能按鈕
    const generateBtn = document.getElementById('generateBtn');
    const generateNegativeBtn = document.getElementById('generateNegativeBtn');
    
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.title = '請先登入';
    }
    if (generateNegativeBtn) {
      generateNegativeBtn.disabled = true;
      generateNegativeBtn.title = '請先登入';
    }
    
    console.log("用戶未登入");
  }
}

// 新增：主題切換功能
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}



function getNestedValue(obj, path) {
  return path.split('.').reduce((o, p) => o && o[p], obj);
}

// 新增：人物標籤功能
function addCharacterTag(characterId, tag) {
  const character = characters.find(c => c.id === characterId);
  if (character) {
    if (!character.tags) character.tags = [];
    if (!character.tags.includes(tag)) {
      character.tags.push(tag);
      saveCharactersToStorage();
      updateCharacterDisplay(character);
    }
  }
}

function removeCharacterTag(characterId, tag) {
  const character = characters.find(c => c.id === characterId);
  if (character && character.tags) {
    character.tags = character.tags.filter(t => t !== tag);
    saveCharactersToStorage();
    updateCharacterDisplay(character);
  }
}

// 新增：人物收藏功能
function toggleCharacterFavorite(characterId) {
  const numericId = Number(characterId);
  const character = characters.find(c => c.id === numericId);
  if (character) {
    character.isFavorite = !character.isFavorite;
    saveCharactersToStorage();
    updateCharacterDisplay(character);
    showNotification(character.isFavorite ? '已加入收藏' : '已取消收藏');
  }
}











// 函數暴露將在文件底部進行

// DOM 載入完成後執行
function initializeWhenReady() {
  if (document.readyState === 'loading') {
    // 如果頁面還在載入，等待 DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    // 如果頁面已載入完成，立即執行
    console.log('DOM 已經準備好，立即初始化');
    initializeApp();
  }
}

// 執行初始化
initializeWhenReady();

// 新增：檢查資料載入狀態
async function checkDataLoading() {
  console.log('檢查資料載入狀態...');
  
  try {
    // 動態導入資料庫模組
    const { db } = await import('../data/database.js');
    
    // 檢查關鍵資料陣列
    const requiredArrays = [
      'surnames', 'givenNameChar1', 'givenNameChar2', 'christianEnglishNames',
      'educations', 'occupations', 'strengths', 'weaknesses', 'hobbies',
      'mottos', 'wishes', 'denominations', 'spiritualGifts'
    ];
    
    const missingArrays = [];
    
    for (const arrayName of requiredArrays) {
      if (!db[arrayName]) {
        missingArrays.push(arrayName);
        console.error(`缺失資料陣列: ${arrayName}`);
      } else if (!Array.isArray(db[arrayName])) {
        missingArrays.push(arrayName);
        console.error(`${arrayName} 不是陣列:`, typeof db[arrayName]);
      } else if (db[arrayName].length === 0) {
        missingArrays.push(arrayName);
        console.error(`${arrayName} 是空陣列`);
      } else {
        console.log(`✓ ${arrayName}: ${db[arrayName].length} 項目`);
      }
    }
    
    if (missingArrays && missingArrays.length > 0) {
      throw new Error(`資料載入不完整，缺失: ${missingArrays.join(', ')}`);
    }
    
    console.log('✓ 所有必要資料已正確載入');
    return true;
    
  } catch (error) {
    console.error('資料載入檢查失敗:', error);
    showNotification('資料載入失敗，請重新整理頁面', 'error');
    return false;
  }
}

// 初始化應用程式
async function initializeApp() {
  console.log('正在初始化應用程式...');
  
  // 檢查資料載入（允許繼續執行即使資料載入失敗）
  try {
    const dataLoaded = await checkDataLoading();
    if (!dataLoaded) {
      console.warn('資料載入不完整，但將繼續初始化基本功能');
      // 不要返回，繼續執行基本功能
    }
  } catch (error) {
    console.warn('資料載入檢查失敗，但將繼續初始化基本功能:', error);
    // 不要返回，繼續執行基本功能
  }
  
  // 確保容器可見（移除登入限制）
  const welcomeMessage = document.getElementById('welcome-message');
  const container = document.querySelector('.container');
  
  if (welcomeMessage) {
    welcomeMessage.style.display = 'block';
  }
  
  if (container) {
    container.style.display = 'flex';
  }
  
  setupEventListeners();
  loadCharactersFromStorage();
  updateCharacterList();
  

  
  // 設置 Firebase 認證監聽器
  onAuthStateChanged(auth, (user) => {
    console.log("認證狀態變更:", user ? user.displayName : "未登入");
    currentUser = user;
    updateUIForAuthState(user);
    
    // 如果用戶重新登入，重新載入並顯示保存的人物
    if (user) {
      loadCharactersFromStorage();
      updateCharacterList();
      if (characters.length > 0) {
        displayAllCharacters();
        // 隱藏歡迎訊息，顯示人物區域
        const welcomeMessage = document.getElementById('welcome-message');
        const container = document.querySelector('.container');
        if (welcomeMessage) {
          welcomeMessage.style.display = 'none';
        }
        if (container) {
          container.style.display = 'flex';
        }
      }
    }
  });
  
  // 檢查重新導向登入結果
  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        const user = result.user;
        console.log("重新導向登入成功:", user);
        showNotification("登入成功！", 'success');
        currentUser = user;
        updateUIForAuthState(user);
      }
    })
    .catch((error) => {
      console.error("重新導向登入錯誤:", error);
      if (error.code !== 'auth/no-redirect-operation') {
        showNotification(`重新導向登入失敗：${error.message}`, 'error');
      }
    });
  
  // 設置登入按鈕事件
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleGoogleLogin);
  }
  
  // 設置訪客模式按鈕事件
  const guestModeBtn = document.getElementById('guestModeBtn');
  if (guestModeBtn) {
    guestModeBtn.addEventListener('click', handleGuestMode);
  }
  

  
  // 確保 DOM 元素已準備好後再重組 header 按鈕
  setTimeout(() => {
    console.log('開始重組 header 按鈕...');
    
    // 重新組織 header 按鈕佈局
    reorganizeHeaderButtons();
    
    // 新增登入橫行（深色模式、登入帳號）
    addLoginRow();
    
    console.log('Header 按鈕重組完成');
  }, 100); // 延遲 100ms 確保 DOM 完全準備好
  

  
  console.log('應用程式初始化完成');
}











function reorganizeHeaderButtons() {
  const headerActions = document.querySelector('.main-actions');
  if (!headerActions) return;
  
  // 如果已經重組過，直接返回
  if (headerActions.querySelector('.main-buttons-row')) {
    console.log('Header 按鈕已經重組過，跳過');
    return;
  }
  
  // 獲取現有元素（不要移除，先保存引用）
  const generateBtn = document.getElementById('generateBtn');
  
  // 創建第一行容器
  const mainButtonsRow = document.createElement('div');
  mainButtonsRow.className = 'main-buttons-row';
  
  // 移動現有按鈕（從原位置移除並添加到新容器）
  if (generateBtn && generateBtn.parentNode) {
    generateBtn.parentNode.removeChild(generateBtn);
    mainButtonsRow.appendChild(generateBtn);
  }
  
  // 創建負面人物按鈕
  const negativeBtn = document.createElement('button');
  negativeBtn.id = 'generateNegativeBtn';
  negativeBtn.textContent = '負面人物';
  negativeBtn.className = 'btn-warning';
  negativeBtn.title = '生成具有複雜心理特質的人物，適用於深度創作和心理研究';
  negativeBtn.onclick = generateNegativeCharacter;
  mainButtonsRow.appendChild(negativeBtn);
  
  // 清空容器並添加第一行
  headerActions.innerHTML = '';
  headerActions.appendChild(mainButtonsRow);
  
  console.log('Header 按鈕重組完成，第一行有', mainButtonsRow.children.length, '個按鈕');
}



function addLoginRow() {
  const headerActions = document.querySelector('.main-actions');
  if (!headerActions) return;
  
  // 如果已經存在第二行，跳過
  if (headerActions.querySelector('.login-row')) {
    console.log('登入行已經添加過，跳過');
    return;
  }
  
  // 創建第二行容器
  const loginRow = document.createElement('div');
  loginRow.className = 'login-row';
  

  
  // 登入按鈕
  const loginBtn = document.createElement('button');
  loginBtn.id = 'loginBtn';
  loginBtn.textContent = '登入帳號';
  loginBtn.onclick = handleGoogleLogin;
  loginRow.appendChild(loginBtn);
  
  // 添加到 header
  headerActions.appendChild(loginRow);
  
  console.log('登入行添加完成，第二行有', loginRow.children.length, '個元素');
}

function addSearchBox() {
  // 這個函數現在被 addLoginRow 取代
  // 保留以避免錯誤，但不執行任何操作
}

// 設定事件監聽器
function setupEventListeners() {
  // 生成人物按鈕 - 修正ID為generateBtn
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerateCharacter);
  }
  
  // 新增：生成負面人物按鈕
  const generateNegativeBtn = document.getElementById('generateNegativeBtn');
  if (generateNegativeBtn) {
    generateNegativeBtn.addEventListener('click', generateNegativeCharacter);
  }
  

  
  // 登入按鈕
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleGoogleLogin);
  }
  

  

  
  // 其他 UI 事件監聽器...
  setupUIEventListeners();
}

// 設定 UI 事件監聽器
function setupUIEventListeners() {
  // 複製到剪貼簿功能
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('clickable-label')) {
      const value = e.target.getAttribute('data-copy-value');
      if (value) {
        copyToClipboard(value);
        showNotification(`已複製: ${value}`);
      }
    }
  });
  
  // 可編輯欄位功能
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('editable-field')) {
      const field = e.target.getAttribute('data-field');
      const value = e.target.value;
      if (currentCharacter && field) {
        updateCharacterField(currentCharacter.id, field, value);
      }
    }
  });
}



// 新增：通知系統
function showNotification(message, type = 'info') {
  // 移除現有通知
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // 創建新通知
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // 顯示通知
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // 自動隱藏通知
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// 新增：下載文本文件函數
function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 新增：複製到剪貼簿函數
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  } else {
    // 降級方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }
}

// 新增：儲存和載入函數
function saveCharactersToStorage() {
  try {
    localStorage.setItem('vcgowe_characters', JSON.stringify(characters));
  } catch (error) {
    console.error('儲存人物資料失敗:', error);
    showNotification('儲存資料失敗', 'error');
  }
}

function loadCharactersFromStorage() {
  try {
    const stored = localStorage.getItem('vcgowe_characters');
    if (stored) {
      characters = JSON.parse(stored);
      console.log('從localStorage載入了', characters.length, '個人物');
      
      // 如果有人物資料，隱藏歡迎訊息並顯示人物區域
      if (characters.length > 0) {
        const welcomeMessage = document.getElementById('welcome-message');
        const container = document.querySelector('.container');
        
        if (welcomeMessage) {
          welcomeMessage.style.display = 'none';
        }
        if (container) {
          container.style.display = 'flex';
        }
        
        // 顯示所有人物
        const lastCharacter = characters[characters.length - 1];
        currentCharacter = lastCharacter;
        displayAllCharacters();
      }
    }
  } catch (error) {
    console.error('載入人物資料失敗:', error);
    characters = [];
  }
}

// 新增：處理生成人物
function handleGenerateCharacter() {
  // 檢查用戶是否已登入（包含訪客模式）
  if (!currentUser) {
    showNotification('請先登入或使用訪客模式', 'warning');
    return;
  }
  
  try {
    console.log('開始生成正面人物...');
    
    const character = generateRandomCharacter();
    
    if (!character) {
      throw new Error('人物生成失敗：返回空值');
    }
    
    // 標記為正面人物
    character.isPositiveCharacter = true;
    character.generationType = '正面人物';
    
    characters.push(character);
    currentCharacter = character;
    
    displayAllCharacters();
    updateCharacterList();
    saveCharactersToStorage();
    
    console.log('正面人物生成成功:', character.name?.chinese);
    showNotification('成功生成正面人物！這個人物具有積極的特質和信仰背景', 'success');
    
    // 隱藏歡迎訊息，顯示人物卡片
    const welcomeMessage = document.getElementById('welcome-message');
    const container = document.querySelector('.container');
    
    if (welcomeMessage) {
      welcomeMessage.style.display = 'none';
    }
    
    if (container) {
      container.style.display = 'flex';
    }
    
  } catch (error) {
    console.error('生成正面人物時發生錯誤:', error);
    console.error('錯誤堆疊:', error.stack);
    
    // 提供更詳細的錯誤訊息
    let errorMessage = '生成正面人物失敗，請重試';
    if (error.message.includes('undefined')) {
      errorMessage = '資料載入不完整，請重新整理頁面後再試';
    } else if (error.message.includes('sample')) {
      errorMessage = '人物特質資料異常，請檢查網路連線';
    }
    
    showNotification(errorMessage, 'error');
  }
}

// 新增：顯示單個人物資訊
function displayCharacter(character) {
  const displayArea = document.getElementById('characterDisplay');
  if (!displayArea) {
    // 如果沒有顯示區域，創建一個
    const container = document.querySelector('.container');
    if (container) {
      container.innerHTML = generateCharacterHTML(character);
      container.style.display = 'flex';
    }
    return;
  }
  
  displayArea.innerHTML = generateCharacterHTML(character);
  displayArea.style.display = 'block';
}

// 新增：顯示所有人物
function displayAllCharacters() {
  const container = document.querySelector('.container');
  if (!container) return;
  
  // 確保 characters 是陣列
  if (!Array.isArray(characters) || characters.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  
  try {
    // 生成所有人物的HTML
    const allCharactersHTML = characters.map(character => generateCharacterHTML(character)).join('');
    container.innerHTML = allCharactersHTML;
    container.style.display = 'flex';
  } catch (error) {
    console.error('顯示所有人物時發生錯誤:', error);
    container.innerHTML = '<div class="error-message">顯示人物時發生錯誤，請重新整理頁面。</div>';
  }
}

// 生成人物 HTML
function generateCharacterHTML(character) {
  const isNegative = character.isNegativeCharacter;
  const isPositive = character.isPositiveCharacter;
  
  let cardClass = 'character-card';
  if (isNegative) {
    cardClass += ' negative-character';
  } else if (isPositive) {
    cardClass += ' positive-character';
  }
  
  let negativeTraitsHTML = '';
  if (isNegative) {
    negativeTraitsHTML = `
      <div class="category-title negative-traits-title">⚠️ 複雜心理特質</div>
      ${character.deepNegativeEmotion ? `
        <div class="info-row">
          <strong>深層情緒</strong>
          <span class="negative-trait">${character.deepNegativeEmotion}</span>
        </div>
      ` : ''}
      ${character.personalityDarkSide ? `
        <div class="info-row">
          <strong>人格陰暗</strong>
          <span class="negative-trait">${character.personalityDarkSide}</span>
        </div>
      ` : ''}
      ${character.addictiveBehavior ? `
        <div class="info-row">
          <strong>成癮傾向</strong>
          <span class="negative-trait">${character.addictiveBehavior}</span>
        </div>
      ` : ''}
      ${character.relationshipIssue ? `
        <div class="info-row">
          <strong>人際問題</strong>
          <span class="negative-trait">${character.relationshipIssue}</span>
        </div>
      ` : ''}
      ${character.psychologicalTrauma ? `
        <div class="info-row">
          <strong>心理創傷</strong>
          <span class="negative-trait">${character.psychologicalTrauma}</span>
        </div>
      ` : ''}
      ${character.mentalHealthCondition ? `
        <div class="info-row">
          <strong>心理狀況</strong>
          <span class="negative-trait">${character.mentalHealthCondition} (${character.mentalHealthSeverity || '中等'}程度)</span>
        </div>
      ` : ''}
      ${character.copingStrategy ? `
        <div class="info-row">
          <strong>應對方式</strong>
          <span class="negative-trait">${character.copingStrategy}</span>
        </div>
      ` : ''}
      ${character.contradictoryTrait ? `
        <div class="info-row">
          <strong>矛盾特質</strong>
          <span class="contradictory-trait">${character.contradictoryTrait}</span>
        </div>
      ` : ''}
    `;
  }
  
  return `
    <div class="${cardClass}" data-character-id="${character.id}">
      ${isNegative ? '<div class="negative-character-badge">⚠️ 複雜人物</div>' : ''}
      ${isPositive ? '<div class="positive-character-badge">✨ 正面人物</div>' : ''}
      <div class="character-header">
      </div>
      
      <div class="character-content">
        <div class="category-title">基本資訊</div>
        <div class="info-row">
          <strong class="clickable-label" data-copy-value="${character.name?.chinese || '未設定'}">中文姓名</strong> 
          <span>${character.name?.chinese || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong class="clickable-label" data-copy-value="${character.name?.english || '未設定'}">英文姓名</strong> 
          <span>${character.name?.english || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong class="clickable-label" data-copy-value="${character.name?.christianNickname || '未設定'}">中文暱稱</strong> 
          <span>${character.name?.christianNickname || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>實際年齡</strong> 
          <span>${character.age}歲</span>
        </div>
        <div class="info-row">
          <strong>生理性別</strong> 
          <span>${character.gender}</span>
        </div>
        <div class="info-row">
          <strong>婚姻狀況</strong> 
          <span>${character.maritalStatus}</span>
        </div>
        
        ${negativeTraitsHTML}
        
        <div class="category-title">學歷與職業</div>
        <div class="info-row">
          <strong>教育程度</strong> 
          <span>${character.education}</span>
        </div>
        <div class="info-row">
          <strong>職業類別</strong> 
          <span>${character.occupation}</span>
        </div>
        ${character.jobTitle ? `
        <div class="info-row">
          <strong>職業職稱</strong> 
          <span class="job-title">${character.jobTitle}</span>
        </div>
        ` : ''}
        ${character.workExperience !== undefined ? `
        <div class="info-row">
          <strong>工作經驗</strong> 
          <span>${character.workExperience}年</span>
        </div>
        ` : ''}
        
        <div class="category-title">性格特質</div>
        <div class="info-row">
          <strong>個人優點</strong> 
          <span class="positive-trait">${character.strengths}</span>
        </div>
        <div class="info-row">
          <strong>個人缺點</strong> 
          <span class="negative-trait">${character.weaknesses}</span>
        </div>
        
        <div class="category-title">信仰資訊</div>
        <div class="info-row">
          <strong>宗教派別</strong> 
          <span>${character.denomination}</span>
        </div>
        <div class="info-row">
          <strong>屬靈恩賜</strong> 
          <span>${character.spiritualGift}</span>
        </div>
        <div class="info-row">
          <strong>人生願望</strong> 
          <span>${character.wish}</span>
        </div>
        
        <div class="category-title">心理與情感層面</div>
        <div class="info-row">
          <strong>情緒狀態</strong> 
          <span>${character.emotionalState || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>情緒管理</strong> 
          <span>${character.emotionManagement || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>壓力反應</strong> 
          <span>${character.stressReaction || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>自信程度</strong> 
          <span>${character.confidenceLevel || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>愛的語言</strong> 
          <span>${character.loveLanguage || '未設定'}</span>
        </div>
        
        <div class="category-title">生活方式與習慣</div>
        <div class="info-row">
          <strong>日常作息</strong> 
          <span>${character.dailyRoutine || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>飲食習慣</strong> 
          <span>${character.dietaryHabit || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>居住環境</strong> 
          <span>${character.livingEnvironment || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>運動習慣</strong> 
          <span>${character.exerciseHabit || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>健康管理</strong> 
          <span>${character.healthManagement || '未設定'}</span>
        </div>
        
        <div class="category-title">經濟與消費觀念</div>
        <div class="info-row">
          <strong>收入範圍</strong> 
          <span>${character.incomeRange || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>理財習慣</strong> 
          <span>${character.financialHabit || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>慈善捐款</strong> 
          <span>${character.charitableDonation || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>金錢態度</strong> 
          <span>${character.moneyAttitudes || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>消費習慣</strong> 
          <span>${character.consumptionHabit || '未設定'}</span>
        </div>
        
        <div class="category-title">職業發展與技能</div>
        <div class="info-row">
          <strong>職業歷程</strong> 
          <span>${character.careerJourney || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>滿意程度</strong> 
          <span>${character.jobSatisfaction || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>領導風格</strong> 
          <span>${character.leadershipStyle || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>工作態度</strong> 
          <span>${character.workAttitudes || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>專業技能</strong> 
          <span>${character.professionalSkills || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>語言技能</strong> 
          <span>${character.languageSkills || '未設定'}</span>
        </div>
        
        <div class="category-title">文化與興趣愛好</div>
        <div class="info-row">
          <strong>文化背景</strong> 
          <span>${character.culturalBackground || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>藝術偏好</strong> 
          <span>${character.artisticPreference || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>學習興趣</strong> 
          <span>${character.learningInterest || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>人生目標</strong> 
          <span>${character.lifeGoal || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>人生觀念</strong> 
          <span>${character.lifeView || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>未來計劃</strong> 
          <span>${character.futurePlan || '未設定'}</span>
        </div>
        
        <div class="category-title">數位生活與社會參與</div>
        <div class="info-row">
          <strong>科技使用</strong> 
          <span>${character.technologyUsage || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>網路行為</strong> 
          <span>${character.internetBehavior || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>社群媒體</strong> 
          <span>${character.socialMedia || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>社交頻率</strong> 
          <span>${character.socialFrequency || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>社區參與</strong> 
          <span>${character.communityInvolvement || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>環保意識</strong> 
          <span>${character.environmentalAwareness || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>政治觀點</strong> 
          <span>${character.politicalView || '未設定'}</span>
        </div>
        
        <div class="category-title">個人特質與經歷</div>
        <div class="info-row">
          <strong>個人故事</strong> 
          <span>${character.story || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>個人秘密</strong> 
          <span>${character.secret || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>生活方式</strong> 
          <span>${character.lifestyle || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>象徵物品</strong> 
          <span>${character.symbolicItem || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>習慣動作</strong> 
          <span>${character.habitAction || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>特殊經歷</strong> 
          <span>${character.specialExperiences || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>人生成就</strong> 
          <span>${character.lifeAchievements || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>人生轉折</strong> 
          <span>${character.lifeTurningPoints || '未設定'}</span>
        </div>
        <div class="info-row">
          <strong>重大事件</strong> 
          <span>${character.significantEvents || '未設定'}</span>
        </div>
        
        <div class="character-actions">
          <button onclick="generatePrayer('${character.id}')" class="btn btn-primary">生成禱告文</button>
          <button onclick="if(confirm('確定要刪除此人物嗎？')) deleteCharacter('${character.id}')" class="btn btn-danger">刪除</button>
        </div>
      </div>
    </div>
  `;
}

// 更新人物清單
function updateCharacterList(filteredCharacters = characters) {
  const listContainer = document.getElementById('characterList');
  if (!listContainer) return;
  
  // 確保 filteredCharacters 是陣列
  if (!Array.isArray(filteredCharacters)) {
    console.error('updateCharacterList 收到非陣列參數:', filteredCharacters);
    listContainer.innerHTML = '<p class="no-characters">資料錯誤，請重新整理頁面</p>';
    return;
  }
  
  if (filteredCharacters.length === 0) {
    listContainer.innerHTML = '<p class="no-characters">未找到符合條件的人物</p>';
    return;
  }
  
  try {
    listContainer.innerHTML = filteredCharacters.map(character => `
      <div class="character-list-item ${currentCharacter?.id === character.id ? 'active' : ''}" 
           onclick="selectCharacter(${character.id})">
        <h4>${character.name?.chinese || '未命名'}</h4>
        <p>${character.age}歲 ${character.gender} - ${character.occupation}</p>
        ${character.isNegativeCharacter ? '<span class="negative-badge">⚠️</span>' : ''}
        ${character.isPositiveCharacter ? '<span class="positive-badge">✨</span>' : ''}
      </div>
    `).join('');
  } catch (error) {
    console.error('更新人物清單時發生錯誤:', error);
    listContainer.innerHTML = '<p class="no-characters">顯示人物清單時發生錯誤</p>';
  }
}

// 選擇人物
function selectCharacter(characterId) {
  const numericId = Number(characterId);
  const character = characters.find(c => c.id === numericId);
  if (character) {
    currentCharacter = character;
    displayCharacter(character);
    updateCharacterList();
  }
}

// 刪除人物
function deleteCharacter(characterId) {
  // 確保ID類型匹配 - 轉換為數字進行比較
  const numericId = Number(characterId);
  const index = characters.findIndex(c => c.id === numericId);
  
  if (index > -1) {
    const wasCurrentCharacter = currentCharacter?.id === numericId;
    characters.splice(index, 1);
    
    if (wasCurrentCharacter) {
      currentCharacter = null;
      // 清除顯示區域
      const displayArea = document.getElementById('characterDisplay');
      const container = document.querySelector('.container');
      
      if (displayArea) {
        displayArea.innerHTML = '';
        displayArea.style.display = 'none';
      } else if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
      }
    }
    
    updateCharacterList();
    saveCharactersToStorage();
    showNotification('人物已刪除');
    
    // 重新顯示剩餘的所有人物
    displayAllCharacters();
    
    // 如果沒有人物了，顯示歡迎訊息
    if (characters.length === 0) {
      const welcomeMessage = document.getElementById('welcome-message');
      if (welcomeMessage) {
        welcomeMessage.style.display = 'block';
      }
    }
  }
}

// 匯出人物
function exportCharacter(characterId) {
  const numericId = Number(characterId);
  const character = characters.find(c => c.id === numericId);
  if (character) {
    const exportData = JSON.stringify(character, null, 2);
    const filename = `${character.name?.chinese || '人物'}_${new Date().toISOString().split('T')[0]}.json`;
    downloadTextFile(exportData, filename);
    showNotification('人物資料已匯出');
  }
}

// 生成匯出文字
function generateExportText(character) {
  let text = `=== 虛擬基督徒人物資料 ===\n\n`;
  
  // 基本資訊
  text += `【基本資訊】\n`;
  text += `中文姓名：${character.name?.chinese || '未設定'}\n`;
  text += `英文姓名：${character.name?.english || '未設定'}\n`;
  text += `中文暱稱：${character.name?.christianNickname || '未設定'}\n`;
  text += `年齡：${character.age}歲\n`;
  text += `性別：${character.gender}\n`;
  text += `婚姻狀態：${character.maritalStatus}\n`;
  text += `居住地點：${character.location || '未設定'}\n`;
  text += `交通工具：${character.transportation || '未設定'}\n`;
  text += `健康狀況：${character.healthCondition || '未設定'}\n`;
  text += `座右銘：${character.motto || '無'}\n`;
  text += `居住環境：${character.livingEnvironment || '未設定'}\n`;
  text += `日常作息：${character.dailyRoutine || '未設定'}\n`;
  text += `飲食習慣：${character.dietaryHabit || '未設定'}\n\n`;
  
  // 家庭關係
  text += `【家庭關係】\n`;
  if (character.spouse) {
    text += `配偶：${character.spouse.surname}${character.spouse.givenName} (${character.spouseAge}歲)\n`;
  }
  if (character.children && character.children.length > 0) {
    text += `子女：${character.children.length}位\n`;
    character.children.forEach(child => {
      text += `  • ${child.name} (${child.age}歲)\n`;
    });
  }
  text += `家庭背景：${character.familyBackground || '未設定'}\n`;
  text += `家庭關係品質：${character.familyRelationshipQuality || '未設定'}\n`;
  text += `溝通方式：${character.familyCommunicationStyle || '未設定'}\n`;
  text += `支持類型：${character.familySupportType || '未設定'}\n`;
  text += `家庭傳統：${character.familyTradition || '未設定'}\n`;
  text += `家庭角色：${character.familyRole || '未設定'}\n`;
  text += `家庭價值觀：${character.familyValue || '未設定'}\n`;
  text += `家庭挑戰：${character.familyChallenge || '未設定'}\n`;
  text += `家庭優勢：${character.familyStrength || '未設定'}\n`;
  text += `家庭活動：${character.familyActivity || '未設定'}\n`;
  text += `家庭觀：${character.familyAttitudes || '無'}\n\n`;
  
  // 學歷與職業
  text += `【學歷與職業】\n`;
  text += `最高學歷：${character.education}\n`;
  text += `最新職業：${character.occupation}\n`;
  text += `經濟狀況：${character.financialStatus || '未設定'}\n`;
  text += `收入水準：${character.incomeRange || '未設定'}\n`;
  text += `金錢觀：${character.moneyAttitudes || '未設定'}\n`;
  text += `工作觀：${character.workAttitudes || '未設定'}\n`;
  text += `專業技能：${character.professionalSkills || '未設定'}\n`;
  text += `語言能力：${character.languageSkills || '未設定'}\n`;
  text += `未來規劃：${character.futurePlan || '未設定'}\n`;
  text += `人生目標：${character.lifeGoal || '未設定'}\n`;
  text += `工作歷程：${character.careerJourney || '未設定'}\n`;
  text += `職業滿意度：${character.jobSatisfaction || '未設定'}\n`;
  text += `領導風格：${character.leadershipStyle || '未設定'}\n\n`;
  
  // 心理與情感
  text += `【心理與情感】\n`;
  text += `情感狀態：${character.emotionalState || '未設定'}\n`;
  text += `情緒管理：${character.emotionManagement || '未設定'}\n`;
  text += `壓力反應：${character.stressReaction || '未設定'}\n`;
  text += `自信程度：${character.confidenceLevel || '未設定'}\n`;
  text += `愛的語言：${character.loveLanguage || '未設定'}\n\n`;
  
  // 角色故事與特質
  text += `【角色故事與特質】\n`;
  text += `背景故事：${character.story || '未設定'}\n`;
  text += `一個秘密：${character.secret || '未設定'}\n`;
  text += `個人優點：${character.strengths || '未設定'}\n`;
  text += `個人缺點：${character.weaknesses || '未設定'}\n`;
  text += `生活習慣：${character.lifestyle || '未設定'}\n`;
  text += `興趣嗜好：${character.hobbies || '未設定'}\n`;
  text += `代表物品：${character.symbolicItem || '未設定'}\n`;
  text += `習慣動作：${character.habitAction || '未設定'}\n`;
  text += `特殊經歷：${character.specialExperiences || '無'}\n`;
  text += `人生成就：${character.lifeAchievements || '無'}\n`;
  text += `人生轉折點：${character.lifeTurningPoints || '無'}\n`;
  text += `重要事件：${character.significantEvents || '無'}\n\n`;
  
  // 經濟與消費
  text += `【經濟與消費】\n`;
  text += `理財習慣：${character.financialHabit || '未設定'}\n`;
  text += `消費習慣：${character.consumptionHabit || '未設定'}\n`;
  text += `慈善奉獻：${character.charitableDonation || '未設定'}\n`;
  text += `社交頻率：${character.socialFrequency || '未設定'}\n\n`;
  
  // 文化與興趣
  text += `【文化與興趣】\n`;
  text += `文化背景：${character.culturalBackground || '未設定'}\n`;
  text += `藝術偏好：${character.artisticPreference || '未設定'}\n`;
  text += `學習興趣：${character.learningInterest || '未設定'}\n`;
  text += `政治觀點：${character.politicalView || '未設定'}\n`;
  text += `生活觀：${character.lifeView || '未設定'}\n\n`;
  
  // 健康與運動
  text += `【健康與運動】\n`;
  text += `健康管理：${character.healthManagement || '未設定'}\n`;
  text += `運動習慣：${character.exerciseHabit || '未設定'}\n\n`;
  
  // 數位生活
  text += `【數位生活】\n`;
  text += `科技使用：${character.technologyUsage || '未設定'}\n`;
  text += `網路行為：${character.internetBehavior || '未設定'}\n`;
  text += `社群媒體：${character.socialMedia || '未設定'}\n\n`;
  
  // 社會參與
  text += `【社會參與】\n`;
  text += `社區參與：${character.communityInvolvement || '未設定'}\n`;
  text += `環保意識：${character.environmentalAwareness || '未設定'}\n\n`;
  
  // 信仰生活
  text += `【信仰生活】\n`;
  text += `喜愛經文：${(character.favoriteVerse || '').replace(/[「」]/g, '')}\n`;
  text += `教會角色：${character.churchRole || '無'}\n`;
  text += `屬靈恩賜：${character.spiritualGift || '無'}\n`;
  text += `信仰成長方式：${character.faithGrowthMethod || '無'}\n`;
  text += `教派：${character.denomination || '無'}\n`;
  text += `讀經習慣：${character.bibleReading || '無'}\n`;
  text += `禱告生活：${character.prayerLife || '無'}\n`;
  text += `教會參與：${character.churchInvolvement || '無'}\n`;
  text += `信仰挑戰：${character.faithChallenge || '無'}\n`;
  if (character.prayerRequest) {
    text += `禱告事項：${character.prayerRequest}\n`;
  }
  if (character.miracle && character.miracle.text) {
    text += `見證分享：${character.miracle.text}\n`;
  }
  
  text += `\n=== 資料生成時間：${new Date().toLocaleString('zh-TW')} ===`;
  
  return text;
}

// 更新人物欄位
function updateCharacterField(id, field, value) {
  const character = characters.find(c => c.id === id);
  if (!character) return;
  
  // 根據欄位類型更新對應的屬性
  switch (field) {
    case 'nickname':
      if (character.name) {
        character.name.christianNickname = value;
      }
      break;
    case 'emailPrefix':
      character.email = `${value}@example.com`;
      break;
    default:
      character[field] = value;
  }
  
  saveCharactersToStorage();
}

// 新增：生成負面人物功能
async function generateNegativeCharacter() {
  // 檢查用戶是否已登入（包含訪客模式）
  if (!currentUser) {
    showNotification('請先登入或使用訪客模式', 'warning');
    return;
  }
  
  try {
    console.log('開始生成負面人物...');
    
    // 顯示載入狀態
    const generateBtn = document.getElementById('generateBtn');
    const negativeBtn = document.getElementById('generateNegativeBtn');
    
    if (generateBtn) generateBtn.disabled = true;
    if (negativeBtn) {
      negativeBtn.disabled = true;
      negativeBtn.innerHTML = '<span class="loading-spinner"></span> 生成中...';
    }

    // 使用特殊約束來生成負面人物
    const negativeConstraints = await createNegativeConstraints();
    const character = await generateNegativeCharacterWithTraits(negativeConstraints);
    
    if (!character) {
      throw new Error('負面人物生成失敗：返回空值');
    }
    
    // 標記為負面人物
    character.isNegativeCharacter = true;
    character.generationType = '負面人物';
    
    characters.push(character);
    currentCharacter = character;
    
    displayAllCharacters();
    updateCharacterList();
    saveCharactersToStorage();
    
    console.log('負面人物生成成功:', character.name?.chinese);
    showNotification('成功生成負面人物！這個人物具有更複雜的心理特質', 'warning');
    
    // 隱藏歡迎訊息，顯示人物卡片
    const welcomeMessage = document.getElementById('welcome-message');
    const container = document.querySelector('.container');
    
    if (welcomeMessage) {
      welcomeMessage.style.display = 'none';
    }
    
    if (container) {
      container.style.display = 'flex';
    }
    
  } catch (error) {
    console.error('生成負面人物時發生錯誤:', error);
    console.error('錯誤堆疊:', error.stack);
    
    // 提供更詳細的錯誤訊息
    let errorMessage = '生成負面人物失敗，請重試';
    if (error.message.includes('undefined')) {
      errorMessage = '資料載入不完整，請重新整理頁面後再試';
    } else if (error.message.includes('sample')) {
      errorMessage = '人物特質資料異常，請檢查網路連線';
    } else if (error.message.includes('import')) {
      errorMessage = '負面特質資料載入失敗，將使用基本特質生成';
    }
    
    showNotification(errorMessage, 'error');
  } finally {
    // 恢復按鈕狀態
    const generateBtn = document.getElementById('generateBtn');
    const negativeBtn = document.getElementById('generateNegativeBtn');
    
    if (generateBtn) generateBtn.disabled = false;
    if (negativeBtn) {
      negativeBtn.disabled = false;
      negativeBtn.innerHTML = '負面人物';
    }
  }
}

// 創建負面人物約束條件
async function createNegativeConstraints() {
  try {
    // 載入負面特質資料
    const negativeTraitsModule = await import('../data/enhanced_negative_traits.js');
    
    return {
      useNegativeTraits: true,
      negativeTraitsData: negativeTraitsModule,
      // 增加負面特質出現機率
      negativeTraitsProbability: 0.8, // 80% 機率出現負面特質
      // 心理健康問題機率
      mentalHealthIssuesProbability: 0.6, // 60% 機率有心理健康問題
      // 創傷經歷機率
      traumaExperienceProbability: 0.7, // 70% 機率有創傷經歷
      // 成癮行為機率
      addictiveBehaviorProbability: 0.4, // 40% 機率有成癮行為
      // 人際關係問題機率
      relationshipIssuesProbability: 0.8, // 80% 機率有人際關係問題
    };
  } catch (error) {
    console.error('載入負面特質資料失敗:', error);
    // 返回預設約束條件
    return {
      useNegativeTraits: false,
      negativeTraitsProbability: 0.3,
      mentalHealthIssuesProbability: 0.2,
      traumaExperienceProbability: 0.3,
      addictiveBehaviorProbability: 0.1,
      relationshipIssuesProbability: 0.4,
    };
  }
}

// 生成具有負面特質的人物
async function generateNegativeCharacterWithTraits(constraints) {
  // 先生成基本人物
  const baseCharacter = generateRandomCharacter();
  
  // 如果有負面特質資料，則增強負面特質
  if (constraints.useNegativeTraits && constraints.negativeTraitsData) {
    const negativeData = constraints.negativeTraitsData;
    
    // 添加深層負面情緒
    if (Math.random() < constraints.negativeTraitsProbability && negativeData.deepNegativeEmotions?.length > 0) {
      baseCharacter.deepNegativeEmotion = sample(negativeData.deepNegativeEmotions);
    }
    
    // 添加人格陰暗面
    if (Math.random() < constraints.negativeTraitsProbability && negativeData.personalityDarkSide?.length > 0) {
      baseCharacter.personalityDarkSide = sample(negativeData.personalityDarkSide);
    }
    
    // 添加成癮行為
    if (Math.random() < constraints.addictiveBehaviorProbability && negativeData.addictiveBehaviors?.length > 0) {
      baseCharacter.addictiveBehavior = sample(negativeData.addictiveBehaviors);
    }
    
    // 添加人際關係問題
    if (Math.random() < constraints.relationshipIssuesProbability && negativeData.relationshipIssues?.length > 0) {
      baseCharacter.relationshipIssue = sample(negativeData.relationshipIssues);
    }
    
    // 添加心理創傷
    if (Math.random() < constraints.traumaExperienceProbability && negativeData.traumaEffects?.length > 0) {
      baseCharacter.psychologicalTrauma = sample(negativeData.traumaEffects);
    }
    
    // 添加心理健康狀況（使用預設值如果資料不存在）
    if (Math.random() < constraints.mentalHealthIssuesProbability) {
      const mentalHealthConditions = negativeData.mentalHealthConditions || [
        '焦慮症', '憂鬱症', '強迫症', '恐慌症', '社交焦慮'
      ];
      baseCharacter.mentalHealthCondition = sample(mentalHealthConditions);
      baseCharacter.mentalHealthSeverity = sample(['輕微', '中等', '嚴重']);
    }
    
    // 添加應對策略
    const copingStrategies = negativeData.unhealthyCopingStrategies || [
      '逃避問題', '過度工作', '情緒壓抑', '自我隔離', '責怪他人'
    ];
    baseCharacter.copingStrategy = sample(copingStrategies);
    
    // 修改原有的正面特質，使其更平衡
    if (baseCharacter.strengths && negativeData.personalityDarkSide?.length > 0) {
      // 有時候用矛盾特質替換
      if (Math.random() < 0.3) {
        baseCharacter.contradictoryTrait = `表面${baseCharacter.strengths}，但內心${sample(negativeData.personalityDarkSide)}`;
      }
    }
  } else {
    // 如果沒有負面特質資料，使用基本的負面特質
    if (Math.random() < constraints.negativeTraitsProbability) {
      baseCharacter.deepNegativeEmotion = sample([
        '經常感到焦慮不安', '內心充滿孤獨感', '對未來感到恐懼', '容易感到沮喪'
      ]);
    }
    
    if (Math.random() < constraints.relationshipIssuesProbability) {
      baseCharacter.relationshipIssue = sample([
        '難以維持長期關係', '溝通困難', '缺乏信任感', '害怕承諾'
      ]);
    }
  }
  
  return baseCharacter;
} 

// 新增：生成禱告文功能
function generatePrayer(characterId) {
  const numericId = Number(characterId);
  const character = characters.find(c => c.id === numericId);
  if (!character) {
    showNotification('找不到指定的人物', 'error');
    return;
  }
  
  // 基於人物特質生成禱告文
  const prayerTemplates = [
    `親愛的天父，感謝您創造了${character.name?.chinese || '這位弟兄/姊妹'}，求您繼續帶領${character.gender === '男' ? '他' : '她'}的生活，在${character.occupation}的工作中榮耀您的名。`,
    `主啊，為${character.name?.chinese || '這位弟兄/姊妹'}禱告，求您加添智慧給${character.gender === '男' ? '他' : '她'}，在${character.age}歲的人生階段中更深認識您。`,
    `慈愛的神，求您祝福${character.name?.chinese || '這位弟兄/姊妹'}的家庭，讓${character.gender === '男' ? '他' : '她'}在${character.maritalStatus}的狀態中經歷您的恩典。`,
    `天父，為${character.name?.chinese || '這位弟兄/姊妹'}的信仰成長禱告，願${character.gender === '男' ? '他' : '她'}在${character.denomination}的教會中被建造。`
  ];
  
  const prayer = sample(prayerTemplates) + ' 奉主耶穌基督的名禱告，阿們。';
  
  // 顯示禱告文
  const modal = document.createElement('div');
  modal.className = 'prayer-modal';
  modal.innerHTML = `
    <div class="prayer-content">
      <div class="prayer-header">
        <h3>為 ${character.name?.chinese || '弟兄/姊妹'} 的禱告文</h3>
        <button class="close-prayer" onclick="this.closest('.prayer-modal').remove()">×</button>
      </div>
      <div class="prayer-body">
        <p>${prayer}</p>
        <div class="prayer-actions">
          <button onclick="copyToClipboard('${prayer}'); showNotification('禱告文已複製')">複製禱告文</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  showNotification('禱告文已生成', 'success');
}

// 暴露函數到全域範圍（在所有函數定義之後）
console.log('🔧 開始暴露函數到全域範圍...');

window.deleteCharacter = deleteCharacter;
window.generatePrayer = generatePrayer;
window.selectCharacter = selectCharacter;
window.generateNegativeCharacter = generateNegativeCharacter;
window.handleGenerateCharacter = handleGenerateCharacter;
window.reorganizeHeaderButtons = reorganizeHeaderButtons;
window.addLoginRow = addLoginRow;
window.handleGoogleLogin = handleGoogleLogin;

console.log('✅ 所有函數已暴露到全域範圍：', {
  deleteCharacter: typeof window.deleteCharacter,
  generatePrayer: typeof window.generatePrayer,
  selectCharacter: typeof window.selectCharacter,
  generateNegativeCharacter: typeof window.generateNegativeCharacter,
  handleGenerateCharacter: typeof window.handleGenerateCharacter,
  reorganizeHeaderButtons: typeof window.reorganizeHeaderButtons,
  addLoginRow: typeof window.addLoginRow,
  handleGoogleLogin: typeof window.handleGoogleLogin
}); 