// js/faith.js - 信仰相關函數

import { sample } from './utils.js';
import { 
  faithLevels, conversionPaths, faithStyles, churchRoles, spiritualGifts,
  faithGrowthMethods, faithLegacies, denominations, bibleReadingHabits,
  prayerLifeStyles, churchInvolvements, faithChallenges, popularVerses,
  faithJourneys, faithStyleTraits, faithInfluences
} from '../data/faith.js';

// 生成信仰特質
export function generateFaithProfile(age, personality) {
  const faithLevel = sample(faithLevels);
  const conversionPath = sample(conversionPaths);
  const faithStyle = sample(faithStyles);
  
  // 根據信仰層級生成對應的特質
  const faithProfiles = {
    '初信者': {
      churchRole: '會友',
      spiritualGift: sample(['服事', '憐憫', '信心']),
      faithGrowthMethod: '讀經禱告',
      faithLegacy: '家庭見證',
      denomination: sample(denominations),
      bibleReading: '每日靈修',
      prayerLife: '定時禱告',
      churchInvolvement: '主日崇拜',
      faithChallenge: '懷疑與困惑'
    },
    '穩定信徒': {
      churchRole: sample(['會友', '小組長']),
      spiritualGift: sample(['教導', '服事', '憐憫', '智慧']),
      faithGrowthMethod: '小組查經',
      faithLegacy: '生命影響',
      denomination: sample(denominations),
      bibleReading: '主題查經',
      prayerLife: '隨時禱告',
      churchInvolvement: '小組聚會',
      faithChallenge: '生活忙碌'
    },
    '成熟信徒': {
      churchRole: sample(['小組長', '執事']),
      spiritualGift: sample(['教導', '治理', '牧養', '智慧', '知識']),
      faithGrowthMethod: '靈修默想',
      faithLegacy: '培育門徒',
      denomination: sample(denominations),
      bibleReading: '逐卷研讀',
      prayerLife: '代禱服事',
      churchInvolvement: '事工服事',
      faithChallenge: '人際衝突'
    },
    '領袖': {
      churchRole: sample(['長老', '牧者', '傳道人']),
      spiritualGift: sample(['預言', '醫治', '方言', '教導', '治理', '使徒', '牧養', '領導']),
      faithGrowthMethod: '建立教會',
      faithLegacy: '建立信仰群體',
      denomination: sample(denominations),
      bibleReading: '教導聖經與神學',
      prayerLife: '深度禱告與代禱',
      churchInvolvement: '教會領導與異象',
      faithChallenge: '培育下一代領袖'
    }
  };
  
  const profile = faithProfiles[faithLevel];
  
  // 添加信仰歷程與風格
  profile.conversionPath = conversionPath;
  profile.conversionStory = faithJourneys[conversionPath];
  profile.faithStyle = faithStyle;
  profile.faithStyleTraits = faithStyleTraits[faithStyle];
  profile.lifeInfluences = sample(faithInfluences[faithLevel]);
  
  return profile;
}

// 生成喜愛經文
export function generateFavoriteVerse() {
  return sample(popularVerses);
}

// 生成禱告請求
export function generatePrayerRequest(character) {
  const prayerTypes = [
    '為家人健康平安禱告',
    '為工作順利禱告',
    '為教會復興禱告',
    '為國家社會禱告',
    '為宣教事工禱告',
    '為個人靈命成長禱告',
    '為未信主的朋友禱告',
    '為世界和平禱告',
    '為生病的弟兄姊妹禱告',
    '為青年人的信仰禱告'
  ];
  
  return sample(prayerTypes);
}

// 生成神蹟見證
export function generateMiracle(character) {
  const miracleTypes = [
    {
      type: '醫治',
      text: '在一次嚴重的疾病中，透過弟兄姊妹的代禱，經歷了神奇妙的醫治，讓我更加相信神的大能。',
      isRead: false
    },
    {
      type: '供應',
      text: '在經濟最困難的時候，神透過意想不到的方式供應我們家的需要，讓我們深深體會到神的信實。',
      isRead: false
    },
    {
      type: '引導',
      text: '在人生重要的抉擇時刻，透過禱告和等候，神清楚地指引我走當走的路。',
      isRead: false
    },
    {
      type: '保護',
      text: '在一次意外中，神奇妙地保護我們全家平安，讓我們見證了神的看顧。',
      isRead: false
    },
    {
      type: '平安',
      text: '在內心最焦慮不安的時候，神賜下出人意外的平安，讓我能夠安然度過難關。',
      isRead: false
    },
    {
      type: '關係',
      text: '透過神的愛，修復了多年來破裂的家庭關係，讓我們重新和好。',
      isRead: false
    }
  ];
  
  return sample(miracleTypes);
} 