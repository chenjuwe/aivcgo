// enhanced_character.js - 增強的人物生成系統，包含負面特質和邏輯關聯

import { sample, randomInt, randomBool } from './utils.js';
import { db } from '../data/database.js';
import * as negativeTraits from '../data/enhanced_negative_traits.js';

// === 特質邏輯關聯系統 ===

// MBTI與其他特質的關聯規則
const mbtiTraitCorrelations = {
  'INTJ': {
    negativeTraits: ['完美主義成癮，無法接受不完美', '用冷漠保護自己不受傷害', '對批評和拒絕過度敏感'],
    positiveTraits: ['分析能力', '創新思維', '獨立思考'],
    relationshipStyle: ['在關係中過度獨立', '情感表達困難，顯得冷漠疏離'],
    stressResponse: ['透過工作逃避個人問題', '用完美主義避免失敗']
  },
  'ENFP': {
    negativeTraits: ['容易分心', '情緒起伏大', '害怕承諾，總是逃避責任'],
    positiveTraits: ['創意豐富', '熱情洋溢', '適應力強'],
    relationshipStyle: ['過度討好他人，失去自我', '在群體中感到格格不入'],
    stressResponse: ['用幽默化解所有嚴肅話題', '透過逃避面對困難問題']
  },
  'ISFJ': {
    negativeTraits: ['過度討好他人，失去自我', '缺乏界限感，容易被人利用'],
    positiveTraits: ['有同理心', '責任感強', '細心謹慎'],
    relationshipStyle: ['在關係中過度依賴', '無法表達真實的情感需求'],
    stressResponse: ['透過討好獲得他人認同', '用忙碌掩蓋內心的孤獨']
  },
  'ESTP': {
    negativeTraits: ['衝動決策', '缺乏長期規劃', '在壓力下做出衝動的決定'],
    positiveTraits: ['勇於挑戰', '適應力強', '溝通能力佳'],
    relationshipStyle: ['害怕承諾，總是逃避責任', '在親密關係中有暴力傾向'],
    stressResponse: ['用攻擊性回應所有威脅', '故意讓自己處於危險的情況']
  }
  // 可以繼續添加其他MBTI類型...
};

// 年齡與特質的關聯
const ageTraitCorrelations = {
  young: { // 18-30
    commonIssues: ['學業失敗的陰影一直揮之不去', '對未來充滿恐懼和不安', '經濟困難的童年讓他過度節儉'],
    developmentalChallenges: ['想要獨立但依賴他人', '需要認同卻拒絕妥協'],
    typicalAddictions: ['社群媒體成癮，需要不斷獲得讚美', '遊戲成癮，在虛擬世界中逃避現實']
  },
  middle: { // 31-50
    commonIssues: ['職場霸凌讓他對工作充滿恐懼', '無法維持長期穩定的關係', '在重要時刻總是自我設限'],
    developmentalChallenges: ['追求成功但害怕失敗', '渴望自由卻需要安全感'],
    typicalAddictions: ['工作成癮，用忙碌逃避內心問題', '酒精依賴，用酒精麻痺痛苦']
  },
  senior: { // 51+
    commonIssues: ['對死亡有強烈的恐懼和焦慮', '失去親人的痛苦讓他逃避親密關係'],
    developmentalChallenges: ['想要原諒但無法忘記', '渴望平靜但製造混亂'],
    typicalAddictions: ['藥物依賴，依賴處方藥物維持情緒', '完美主義成癮，無法接受不完美']
  }
};

// 家庭背景與心理創傷的關聯
const familyTraumaCorrelations = {
  '單親家庭': ['父母離婚造成對愛情的不信任', '被拋棄的經歷讓他害怕獨處'],
  '隔代教養': ['童年創傷影響現在的人際關係', '經常感到被誤解和孤立'],
  '重組家庭': ['無法信任他人，總是懷疑動機', '在群體中感到格格不入'],
  '經濟困難': ['經濟困難的童年讓他過度節儉', '破產的經歷讓他對金錢極度焦慮']
};

// === 增強的人物生成函數 ===
export function generateEnhancedCharacter() {
  // 基本資訊生成
  const age = randomInt(18, 65);
  const gender = sample(['男', '女']);
  const maritalStatus = sample(['單身', '已婚', '離婚', '喪偶']);
  
  // 確定年齡階段
  const ageStage = age <= 30 ? 'young' : age <= 50 ? 'middle' : 'senior';
  
  // 生成MBTI類型
  const mbtiTypes = Object.keys(mbtiTraitCorrelations);
  const mbtiType = sample(mbtiTypes);
  const mbtiData = mbtiTraitCorrelations[mbtiType];
  
  // 生成家庭背景
  const familyBackground = sample(db.familyBackgrounds);
  
  // === 基於邏輯關聯生成特質 ===
  
  // 1. 基於MBTI的特質選擇
  const primaryNegativeTrait = sample(mbtiData.negativeTraits);
  const relationshipIssue = sample(mbtiData.relationshipStyle);
  const stressResponse = sample(mbtiData.stressResponse);
  
  // 2. 基於年齡的特質選擇
  const ageRelatedIssue = sample(ageTraitCorrelations[ageStage].commonIssues);
  const developmentalChallenge = sample(ageTraitCorrelations[ageStage].developmentalChallenges);
  const ageRelatedAddiction = sample(ageTraitCorrelations[ageStage].typicalAddictions);
  
  // 3. 基於家庭背景的創傷
  const familyTrauma = familyTraumaCorrelations[familyBackground] 
    ? sample(familyTraumaCorrelations[familyBackground]) 
    : sample(negativeTraits.traumaEffects);
  
  // 4. 隨機選擇其他負面特質（增加複雜性）
  const additionalNegativeEmotion = sample(negativeTraits.deepNegativeEmotions);
  const personalityDarkSide = sample(negativeTraits.personalityDarkSide);
  const hiddenFear = sample(negativeTraits.hiddenFears);
  const negativeBeliefSystem = sample(negativeTraits.negativeBeliefSystems);
  
  // 5. 根據負面特質調整正面特質（製造矛盾）
  const contradictoryPositiveTrait = generateContradictoryTrait(primaryNegativeTrait);
  
  // === 生成完整人物 ===
  const character = {
    // 基本資訊
    id: Date.now(),
    age,
    gender,
    maritalStatus,
    familyBackground,
    
    // MBTI相關
    mbtiType,
    
    // === 增強的負面特質系統 ===
    primaryNegativeTrait,           // 主要負面特質（基於MBTI）
    relationshipIssue,              // 人際關係問題
    stressResponse,                 // 壓力應對方式
    ageRelatedIssue,               // 年齡相關問題
    developmentalChallenge,        // 發展階段挑戰
    addictiveBehavior: ageRelatedAddiction, // 成癮行為
    traumaEffect: familyTrauma,     // 心理創傷影響
    deepNegativeEmotion: additionalNegativeEmotion, // 深層負面情緒
    personalityDarkSide,           // 人格陰暗面
    hiddenFear,                    // 隱藏恐懼
    negativeBeliefSystem,          // 負面信念
    
    // === 矛盾特質 ===
    contradictoryTrait: contradictoryPositiveTrait, // 與負面特質矛盾的正面特質
    internalConflict: sample(negativeTraits.internalConflicts), // 內在矛盾
    
    // === 自毀傾向 ===
    selfDestructiveBehavior: sample(negativeTraits.selfDestructiveBehaviors),
    socialAdaptationIssue: sample(negativeTraits.socialAdaptationIssues),
    negativeCopingMechanism: sample(negativeTraits.negativeCopingMechanisms),
    
    // === 保留原有的正面特質 ===
    strengths: sample(db.strengths),
    hobbies: sample(db.hobbies),
    motto: sample(db.mottos),
    
    // === 其他基本資訊 ===
    name: generateName(gender),
    education: sample(db.educations),
    occupation: sample(db.occupations.all),
    location: sample(['台北市', '新北市', '台中市', '台南市', '高雄市']),
    
    // === 心理健康狀況 ===
    mentalHealthStatus: generateMentalHealthStatus(primaryNegativeTrait, ageRelatedIssue),
    therapyHistory: generateTherapyHistory(),
    copingStrategies: generateCopingStrategies(stressResponse)
  };
  
  return character;
}

// === 輔助函數 ===

// 生成矛盾的正面特質
function generateContradictoryTrait(negativeTrait) {
  const contradictions = {
    '完美主義成癮': '隨遇而安的生活態度',
    '用冷漠保護自己': '內心渴望溫暖連結',
    '過度討好他人': '內心有強烈的個人原則',
    '害怕承諾': '深度渴望穩定關係',
    '衝動決策': '在某些領域極度謹慎',
    '容易分心': '對感興趣的事物專注力驚人'
  };
  
  // 尋找相關關鍵詞
  for (const [key, value] of Object.entries(contradictions)) {
    if (negativeTrait.includes(key)) {
      return value;
    }
  }
  
  return '內心深處有著與表面截然不同的一面';
}

// 生成心理健康狀況
function generateMentalHealthStatus(primaryTrait, ageIssue) {
  const severityLevel = randomInt(1, 5); // 1=輕微, 5=嚴重
  
  const conditions = [
    '輕微焦慮症狀，在特定情況下會加劇',
    '間歇性憂鬱情緒，特別是在壓力期間',
    '社交焦慮，在大型聚會中感到不適',
    '完美主義傾向導致的慢性壓力',
    '創傷後壓力反應，對特定觸發因子敏感',
    '注意力不足，難以長時間專注',
    '情緒調節困難，容易被情緒淹沒',
    '慢性孤獨感，即使在人群中也感到孤立',
    '自尊心低落，經常自我批評',
    '睡眠障礙，經常失眠或噩夢'
  ];
  
  return {
    condition: sample(conditions),
    severity: severityLevel,
    triggers: [primaryTrait, ageIssue],
    impact: severityLevel > 3 ? '嚴重影響日常生活' : '輕微影響生活品質'
  };
}

// 生成治療歷史
function generateTherapyHistory() {
  const hasTherapy = randomBool(0.3); // 30%的人有治療經驗
  
  if (!hasTherapy) {
    return {
      hasExperience: false,
      reason: sample(['不相信心理治療', '經濟考量', '害怕被標籤化', '認為自己可以處理'])
    };
  }
  
  return {
    hasExperience: true,
    type: sample(['個人諮商', '團體治療', '家族治療', '藥物治療']),
    duration: sample(['短期（1-3個月）', '中期（6個月-1年）', '長期（1年以上）']),
    outcome: sample(['有顯著改善', '略有幫助', '效果有限', '中途放棄'])
  };
}

// 生成應對策略
function generateCopingStrategies(stressResponse) {
  const healthyStrategies = [
    '定期運動釋放壓力', '寫日記整理思緒', '冥想和深呼吸',
    '與信任的朋友談話', '從事創意活動', '親近大自然'
  ];
  
  const unhealthyStrategies = [
    '過度工作麻痺自己', '暴飲暴食', '社交媒體成癮',
    '購物療法', '酒精依賴', '逃避現實'
  ];
  
  // 基於壓力反應選擇策略
  const isHealthyCoper = randomBool(0.4); // 40%的人有健康的應對策略
  
  return {
    primary: stressResponse,
    secondary: isHealthyCoper ? sample(healthyStrategies) : sample(unhealthyStrategies),
    effectiveness: randomInt(1, 10)
  };
}

// 生成姓名（簡化版）
function generateName(gender) {
  const surnames = ['陳', '林', '黃', '張', '李', '王', '吳', '劉', '蔡', '楊'];
  const maleNames = ['志明', '建宏', '俊傑', '家豪', '宗翰', '承恩', '宇軒', '子軒'];
  const femaleNames = ['淑芬', '美玲', '雅婷', '怡君', '佩君', '筱雯', '心怡', '宜庭'];
  
  return {
    chinese: sample(surnames) + sample(gender === '男' ? maleNames : femaleNames),
    english: sample(['Alex', 'Chris', 'Jordan', 'Taylor', 'Casey', 'Morgan'])
  };
} 