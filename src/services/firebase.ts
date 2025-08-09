import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase 配置 - 您需要替換為實際的配置值
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "prayer-generator-app.firebaseapp.com",
  projectId: "prayer-generator-app",
  storageBucket: "prayer-generator-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop",
  measurementId: "G-XXXXXXXXXX"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化服務
export const auth = getAuth(app);
export const db = getFirestore(app);

// 只在瀏覽器環境中初始化 Analytics
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
