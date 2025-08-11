// js/character.js - 人物生成核心函數（增強真實感版本）

import { sample, randomInt, randomBool } from './utils.js';
import { db } from '../data/database.js';
import { generateJobTitle } from '../data/occupations.js';
import { generateFamilyDynamics, generateFamilyMembers, generateSpouse, generateChildren } from './family.js';
import { generateFaithProfile, generateFavoriteVerse, generatePrayerRequest, generateMiracle } from './faith.js';
import { 
  generateEnhancedCharacter, 
  checkTraitCompatibility,
  calculateJobPersonalityMatch,
  validateAgeExperience,
  traitCorrelationMatrix,
  mbtiBeahviorMapping,
  lifeStageFramework
} from './character-enhanced.js';

// 新增：人物模板定義
const characterTemplates = {
  youngProfessional: {
    name: '年輕專業人士',
    description: '剛踏入職場的年輕基督徒專業人士',
    constraints: {
      ageRange: [22, 30],
      education: ['大學', '碩士'],
      occupationCategories: ['科技業', '商業', '教育業'],
      maritalStatus: ['單身', '已婚'],
      faithStage: ['成長期基督徒', '初信者']
    }
  },
  familyLeader: {
    name: '家庭領袖',
    description: '有家庭責任的中年基督徒',
    constraints: {
      ageRange: [35, 50],
      maritalStatus: ['已婚'],
      occupationCategories: ['商業', '教育業', '醫療業'],
      faithStage: ['成熟基督徒', '教會領袖'],
      hasChildren: true
    }
  },
  seniorBeliever: {
    name: '資深信徒',
    description: '信仰資深的年長基督徒',
    constraints: {
      ageRange: [55, 70],
      faithStage: ['成熟基督徒', '屬靈長者'],
      denominationPreference: ['長老會', '浸信會', '衛理公會']
    }
  },
  missionary: {
    name: '宣教士',
    description: '全職宣教或短宣經歷的基督徒',
    constraints: {
      ageRange: [25, 45],
      occupationKeywords: ['宣教士', '傳道', '牧師'],
      spiritualGifts: ['傳福音', '宣教', '教導'],
      faithStage: ['成熟基督徒', '教會領袖']
    }
  },
  creativeBelievert: {
    name: '創意信徒',
    description: '在創意領域服事的基督徒',
    constraints: {
      ageRange: [20, 40],
      occupationKeywords: ['設計師', '藝術家', '音樂家', '作家'],
      spiritualGifts: ['音樂', '藝術', '創意'],
      hobbiesKeywords: ['音樂', '藝術', '寫作', '攝影']
    }
  },
  businessLeader: {
    name: '商界領袖',
    description: '在商界有影響力的基督徒',
    constraints: {
      ageRange: [35, 55],
      occupationKeywords: ['總經理', '執行長', '總監', '創業家'],
      educationPreference: ['碩士', '博士'],
      faithStage: ['成熟基督徒']
    }
  }
};

// 新增：根據模板生成人物（增強版）
export function generateCharacterFromTemplate(templateKey, customConstraints = {}) {
  const template = characterTemplates[templateKey];
  if (!template) {
    throw new Error(`未找到模板: ${templateKey}`);
  }
  
  // 合併模板約束和自定義約束
  const constraints = { ...template.constraints, ...customConstraints };
  
  // 優先使用增強版生成
  try {
    const enhancedCharacter = generateEnhancedCharacter(constraints);
    if (enhancedCharacter && enhancedCharacter.logicalConsistency) {
      return enhancedCharacter;
    }
  } catch (error) {
    console.warn('增強版生成失敗，使用原版:', error);
  }
  
  // 回退到原版
  return generateConstrainedCharacter(constraints);
}

// 新增：約束性人物生成（增強版優先）
export function generateConstrainedCharacter(constraints) {
  // 首先嘗試使用增強版生成
  try {
    const enhancedCharacter = generateEnhancedCharacter(constraints);
    if (enhancedCharacter && enhancedCharacter.logicalConsistency) {
      // 增強版成功，添加額外資訊
      const familyInfo = generateFamilyDynamics();
      const faithInfo = generateFaithProfile();
      
      return {
        ...enhancedCharacter,
        family: familyInfo,
        faith: faithInfo,
        generationMethod: 'enhanced-with-extras'
      };
    }
  } catch (error) {
    console.warn('增強版生成失敗，使用原版:', error);
  }
  
  // 回退到原版邏輯
  try {
    // 生成基本資訊時考慮約束
    const basicInfo = generateConstrainedBasicInfo(constraints);
    const name = generateName(basicInfo.gender);
    
    // 生成職業和教育時考慮約束
    const careerEducation = generateConstrainedCareerEducation(basicInfo.age, constraints);
    
    // 生成整合人格特質
    const characterProfile = generateIntegratedCharacterProfile(basicInfo.age, basicInfo.gender);
    
    // 生成家庭資訊時考慮約束
    const familyInfo = generateConstrainedFamilyInfo(basicInfo, constraints);
    
    // 生成信仰資訊時考慮約束
    const faithInfo = generateConstrainedFaithInfo(constraints);
    
    // 生成其他特質
    const additionalTraits = generateAdditionalTraits(basicInfo.age, basicInfo.gender);
    
    const character = {
      id: Date.now() + Math.random(), // 簡單的ID生成
      templateUsed: constraints.templateName || null,
      generatedAt: new Date().toISOString(),
      name,
      ...basicInfo,
      ...careerEducation,
      ...characterProfile,
      ...familyInfo,
      ...faithInfo,
      ...additionalTraits
    };
    
    return character;
    
  } catch (error) {
    console.error('生成約束性人物時發生錯誤:', error);
    // 降級為一般生成
    return generateRandomCharacter();
  }
}

function generateConstrainedBasicInfo(constraints) {
  let age, gender, maritalStatus;
  
  // 年齡約束
  if (constraints.ageRange) {
    age = randomInt(constraints.ageRange[0], constraints.ageRange[1]);
  } else {
    age = randomInt(18, 65);
  }
  
  // 性別約束
  if (constraints.gender) {
    gender = constraints.gender;
  } else {
    gender = sample(['男', '女']);
  }
  
  // 婚姻狀況約束
  if (constraints.maritalStatus) {
    maritalStatus = sample(constraints.maritalStatus);
  } else {
    const maritalStatuses = ['單身', '已婚', '離婚', '喪偶'];
    maritalStatus = sample(maritalStatuses);
  }
  
  return { age, gender, maritalStatus };
}

function generateConstrainedCareerEducation(age, constraints) {
  let education, occupation, jobTitle, workExperience;
  
  // 教育約束
  if (constraints.education) {
    education = sample(constraints.education);
  } else if (constraints.educationPreference) {
    education = sample(constraints.educationPreference);
  } else {
    education = sample(db.educations);
  }
  
  // 職業約束
  if (constraints.occupationKeywords) {
    // 根據關鍵字篩選職業
    const filteredOccupations = db.occupations.all.filter(occ => 
      constraints.occupationKeywords.some(keyword => 
        occ.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    occupation = filteredOccupations.length > 0 ? 
      sample(filteredOccupations) : sample(db.occupations.all);
  } else if (constraints.occupationCategories) {
    // 根據職業類別選擇
    const categoryOccupations = [];
    constraints.occupationCategories.forEach(category => {
      if (db.occupations[category]) {
        categoryOccupations.push(...db.occupations[category]);
      }
    });
    occupation = categoryOccupations.length > 0 ? 
      sample(categoryOccupations) : sample(db.occupations.all);
  } else {
    occupation = sample(db.occupations.all);
  }
  
  // 計算工作經驗年數
  const graduationAge = education.includes('博士') ? 28 : 
                       education.includes('碩士') ? 24 : 
                       education.includes('大學') ? 22 : 20;
  workExperience = Math.max(0, age - graduationAge);
  
  // 生成職稱
  jobTitle = generateJobTitle(occupation, age, workExperience);
  
  const careerStage = age < 25 ? 'early' : age < 40 ? 'mid' : 'senior';
  const workAttitudes = sample(db.workingStyles || ['積極認真', '穩健踏實', '創新進取']);
  const professionalSkills = sample(db.professionalSkills || ['專業技能優秀', '溝通協調良好', '學習能力強']);
  
  return {
    education,
    occupation,
    jobTitle,
    workExperience,
    careerStage,
    workAttitudes,
    professionalSkills
  };
}

function generateConstrainedFamilyInfo(basicInfo, constraints) {
  let familyInfo = {
    familyBackground: sample(db.familyBackgrounds),
    familyRelationshipQuality: sample(db.familyRelationshipQualities),
    familyCommunicationStyle: sample(db.familyCommunicationStyles),
    familySupportType: sample(db.familySupportTypes)
  };
  
  // 如果約束要求有子女
  if (constraints.hasChildren && basicInfo.maritalStatus === '已婚') {
    const children = generateChildren(basicInfo.age, basicInfo.gender);
    familyInfo.children = children;
    
    if (basicInfo.gender === '男' || basicInfo.gender === '女') {
      const spouse = generateSpouse(basicInfo.age, basicInfo.gender);
      familyInfo.spouse = spouse;
    }
  }
  
  return familyInfo;
}

function generateConstrainedFaithInfo(constraints) {
  let faithInfo = {};
  
  // 宗派偏好
  if (constraints.denominationPreference) {
    faithInfo.denomination = sample(constraints.denominationPreference);
  } else {
    faithInfo.denomination = sample(db.denominations);
  }
  
  // 信仰階段約束
  if (constraints.faithStage) {
    faithInfo.faithStage = sample(constraints.faithStage);
  } else {
    faithInfo.faithStage = sample(db.faithStages);
  }
  
  // 屬靈恩賜約束
  if (constraints.spiritualGifts) {
    faithInfo.spiritualGift = sample(constraints.spiritualGifts);
  } else {
    faithInfo.spiritualGift = sample(db.spiritualGifts);
  }
  
  // 生成其他信仰資訊
  faithInfo.churchRole = sample(db.churchRoles);
  faithInfo.favoriteVerse = generateFavoriteVerse();
  
  return faithInfo;
}

function generateAdditionalTraits(age, gender) {
  return {
    strengths: sample(db.positiveTraits),
    weaknesses: sample(db.negativeTraits),
    hobbies: sample(db.hobbies),
    healthCondition: sample(db.healthConditions),
    lifeStage: sample(db.lifeStages),
    personalSecret: sample(db.personalSecrets),
    lifeMotto: sample(db.lifeMottos),
    communicationStyle: sample(db.communicationStyles),
    conflictStyle: sample(db.conflictStyles),
    wish: sample(db.wishes)
  };
}

// 新增：獲取所有可用模板
export function getAvailableTemplates() {
  return Object.entries(characterTemplates).map(([key, template]) => ({
    key,
    name: template.name,
    description: template.description
  }));
}

// 新增：驗證人物是否符合模板約束
export function validateCharacterAgainstTemplate(character, templateKey) {
  const template = characterTemplates[templateKey];
  if (!template) return false;
  
  const constraints = template.constraints;
  const validations = [];
  
  // 檢查年齡範圍
  if (constraints.ageRange) {
    const [minAge, maxAge] = constraints.ageRange;
    const ageValid = character.age >= minAge && character.age <= maxAge;
    validations.push({
      field: '年齡',
      valid: ageValid,
      expected: `${minAge}-${maxAge}歲`,
      actual: `${character.age}歲`
    });
  }
  
  // 檢查教育程度
  if (constraints.education) {
    const educationValid = constraints.education.includes(character.education);
    validations.push({
      field: '教育程度',
      valid: educationValid,
      expected: constraints.education.join(', '),
      actual: character.education
    });
  }
  
  // 檢查婚姻狀況
  if (constraints.maritalStatus) {
    const maritalValid = constraints.maritalStatus.includes(character.maritalStatus);
    validations.push({
      field: '婚姻狀況',
      valid: maritalValid,
      expected: constraints.maritalStatus.join(', '),
      actual: character.maritalStatus
    });
  }
  
  return {
    isValid: validations.every(v => v.valid),
    validations: validations
  };
}

// 生成姓名
export function generateName(gender) {
  try {
    const surname = sample(db.surnames) || { chinese: '陳', pinyin: 'Chen' };
    const char1 = sample(db.givenNameChar1) || { chinese: '志', pinyin: 'Chih' };
    const char2 = sample(db.givenNameChar2) || { chinese: '明', pinyin: 'Ming' };
    
    const chineseName = (surname?.chinese || '陳') + (char1?.chinese || '志') + (char2?.chinese || '明');
    
    const genderKey = gender === '男' ? 'male' : 'female';
    const englishNames = db.christianEnglishNames?.[genderKey] || (gender === '男' ? ['David'] : ['Mary']);
    const englishName = sample(englishNames) || (gender === '男' ? 'David' : 'Mary');
    
    const christianNickname = sample(db.christianNicknames) || '小羊';
    
    return {
      chinese: chineseName,
      english: englishName,
      christianNickname: christianNickname
    };
  } catch (error) {
    console.error('生成姓名時發生錯誤:', error);
    // 返回預設姓名
    return {
      chinese: gender === '男' ? '陳志明' : '陳美麗',
      english: gender === '男' ? 'David' : 'Mary',
      christianNickname: '小羊'
    };
  }
}

// 生成基本資訊
export function generateBasicInfo() {
  const age = randomInt(18, 65);
  const gender = sample(['男', '女']);
  const maritalStatuses = ['單身', '已婚', '離婚', '喪偶'];
  const maritalStatus = sample(maritalStatuses);
  
  return { age, gender, maritalStatus };
}

// 生成職業和教育
export function generateCareerEducation(age) {
  const education = sample(db.educations);
  const occupation = sample(db.occupations.all);
  
  // 根據年齡生成職業發展階段
  const careerStage = age < 25 ? 'early' : age < 40 ? 'mid' : 'senior';
  const workAttitudes = sample(db.workingStyles);
  const professionalSkills = sample(db.professionalSkills);
  
  return {
    education,
    occupation,
    careerStage,
    workAttitudes,
    professionalSkills
  };
}

// 生成整合人格特質
export function generateIntegratedCharacterProfile(age, gender) {
  try {
    // MBTI 類型定義
    const mbtiTypes = {
      'INTJ': { name: '建築師', traits: ['獨立', '創新', '決斷'] },
      'INTP': { name: '思想家', traits: ['邏輯', '好奇', '靈活'] },
      'ENTJ': { name: '指揮官', traits: ['領導', '果斷', '高效'] },
      'ENTP': { name: '辯論家', traits: ['創新', '機智', '外向'] },
      'INFJ': { name: '提倡者', traits: ['理想', '洞察', '決心'] },
      'INFP': { name: '調停者', traits: ['理想', '好奇', '靈活'] },
      'ENFJ': { name: '主人公', traits: ['魅力', '利他', '領導'] },
      'ENFP': { name: '競選者', traits: ['熱情', '創造', '社交'] },
      'ISTJ': { name: '物流師', traits: ['實用', '事實', '可靠'] },
      'ISFJ': { name: '守護者', traits: ['溫暖', '負責', '忠誠'] },
      'ESTJ': { name: '總經理', traits: ['組織', '實用', '邏輯'] },
      'ESFJ': { name: '執政官', traits: ['關懷', '社交', '和諧'] },
      'ISTP': { name: '鑑賞家', traits: ['大膽', '實用', '靈活'] },
      'ISFP': { name: '探險家', traits: ['靈活', '魅力', '藝術'] },
      'ESTP': { name: '企業家', traits: ['精力', '感知', '自發'] },
      'ESFP': { name: '娛樂家', traits: ['熱情', '自發', '社交'] }
    };

    // 五大人格特質
    const bigFiveTraits = {
      openness: randomInt(1, 10),
      conscientiousness: randomInt(1, 10),
      extraversion: randomInt(1, 10),
      agreeableness: randomInt(1, 10),
      neuroticism: randomInt(1, 10)
    };

    // 情緒智商
    const emotionalIntelligence = {
      selfAwareness: randomInt(1, 10),
      selfRegulation: randomInt(1, 10),
      motivation: randomInt(1, 10),
      empathy: randomInt(1, 10),
      socialSkills: randomInt(1, 10)
    };

    // 目標導向
    const goalOrientation = {
      '成就導向': { description: '追求卓越表現', traits: ['競爭', '努力', '目標明確'] },
      '學習導向': { description: '重視知識獲得', traits: ['好奇', '開放', '持續學習'] },
      '關係導向': { description: '重視人際連結', traits: ['合作', '同理', '團隊精神'] },
      '創新導向': { description: '追求創意突破', traits: ['創造', '冒險', '變革'] }
    };

    // 人格發展軌跡
    const personalityDevelopmentTrajectories = {
      '穩定成長型': { description: '性格逐漸成熟穩定', pattern: '持續發展' },
      '波動適應型': { description: '隨環境變化調整', pattern: '彈性適應' },
      '突破轉型': { description: '經歷重大改變', pattern: '階段性轉變' },
      '深化專精型': { description: '在特定領域深化', pattern: '專業發展' }
    };

    // 創意與藝術傾向
    const creativeAndArtisticTendencies = {
      '視覺藝術': { areas: ['繪畫', '攝影', '設計'], expression: '視覺創作' },
      '表演藝術': { areas: ['音樂', '舞蹈', '戲劇'], expression: '表演展現' },
      '文字創作': { areas: ['寫作', '詩歌', '劇本'], expression: '文字表達' },
      '手工藝術': { areas: ['陶藝', '木工', '編織'], expression: '手作創造' },
      '數位藝術': { areas: ['程式', '動畫', '遊戲'], expression: '科技創新' }
    };

    // 選擇 MBTI 類型
    const mbtiType = sample(Object.keys(mbtiTypes));
    const mbtiData = mbtiTypes[mbtiType];

    // 選擇目標導向
    const goalOrientationKey = sample(Object.keys(goalOrientation));
    const goalData = goalOrientation[goalOrientationKey];

    // 選擇發展軌跡
    const developmentKey = sample(Object.keys(personalityDevelopmentTrajectories));
    const developmentData = personalityDevelopmentTrajectories[developmentKey];

    // 選擇創意傾向
    const creativeKey = sample(Object.keys(creativeAndArtisticTendencies));
    const creativeData = creativeAndArtisticTendencies[creativeKey];

    // 生成基本特質 - 添加安全檢查
    const strengths = sample(db.strengths) || sample(db.positiveTraits) || '友善';
    const weaknesses = sample(db.weaknesses) || sample(db.negativeTraits) || '有時急躁';
    const hobbies = sample(db.hobbies) || '閱讀';
    const motto = sample(db.mottos) || sample(db.lifeMottos) || '活在當下';
    const wish = sample(db.wishes) || '希望家人健康平安';

    // 生成社會特質 - 添加安全檢查
    const socialMedia = sample(db.socialMedia) || '偶爾使用';
    const politicalView = sample(db.politicalViews) || '溫和中立';
    const healthStatus = sample(['健康良好', '偶有小病', '需要注意', '正在調養']);
    const financialStatus = sample(['經濟穩定', '小康水準', '需要節儉', '經濟寬裕']);
    const lifeView = sample(db.lifeViews) || '樂觀積極';
    const futurePlan = sample(db.futurePlans) || '穩步發展';
    const socialFrequency = sample(db.socialFrequencies) || '適度社交';
    const consumptionHabit = sample(db.consumptionHabits) || '理性消費';

    return {
      // MBTI 相關
      mbtiType,
      mbtiName: mbtiData.name,
      mbtiTraits: mbtiData.traits,
      
      // 五大人格
      bigFive: bigFiveTraits,
      
      // 情緒智商
      eq: emotionalIntelligence,
      
      // 目標導向
      goalOrientation: goalOrientationKey,
      goalDescription: goalData.description,
      goalTraits: goalData.traits,
      
      // 發展軌跡
      developmentType: developmentKey,
      developmentDescription: developmentData.description,
      developmentPattern: developmentData.pattern,
      
      // 創意傾向
      creativeType: creativeKey,
      creativeAreas: creativeData.areas,
      creativeExpression: creativeData.expression,
      
      // 基本特質
      strengths,
      weaknesses,
      hobbies,
      motto,
      wish,
      
      // 社會特質
      socialMedia,
      politicalView,
      healthStatus,
      financialStatus,
      lifeView,
      futurePlan,
      socialFrequency,
      consumptionHabit,
      
      // 職業相關
      education: sample(db.educations),
      occupation: sample(db.occupations.all),
      workAttitudes: sample(db.workingStyles),
      professionalSkills: sample(db.professionalSkills),
      languageSkills: sample(db.languageSkills),
      moneyAttitudes: sample(db.moneyAttitudes),
      
      // 健康相關
      healthCondition: sample(['健康', '良好', '普通', '需要注意'])
    };
  } catch (error) {
    console.error("生成整合人格特質時發生錯誤:", error);
    // 返回基本的預設值
    return {
      occupation: sample(db.occupations.all),
      education: sample(db.educations),
      personalityType: '內向型',
      socialStyle: '謹慎',
      hobbies: '閱讀',
      mbtiType: 'ISFJ',
      mbtiName: '守護者',
      strengths: '同理心強',
      weaknesses: '偶爾急躁',
      healthCondition: '健康'
    };
  }
}

// 主要人物生成函數
export function generateRandomCharacter() {
  const basicInfo = generateBasicInfo();
  const { age, gender, maritalStatus } = basicInfo;
  
  const name = generateName(gender);
  const email = `${name.english.toLowerCase()}@example.com`;
  
  // 生成整合人格特質
  let integratedProfile;
  try {
    integratedProfile = generateIntegratedCharacterProfile(age, gender);
  } catch (error) {
    console.error("生成整合人格特質時發生錯誤:", error);
    integratedProfile = {
      occupation: sample(db.occupations.all),
      education: sample(db.educations),
      personalityType: '內向型',
      socialStyle: '謹慎',
      hobbies: '閱讀',
      mbtiType: 'ISFJ',
      mbtiName: '守護者'
    };
  }
  
  // 生成家庭相關
  const familyDynamics = generateFamilyDynamics();
  const familyMembers = generateFamilyMembers(age, maritalStatus);
  
  // 生成配偶和子女（如果已婚）
  let spouse = null;
  let spouseAge = null;
  let children = [];
  
  if (maritalStatus === '已婚') {
    spouse = generateSpouse(age, gender);
    spouseAge = spouse.age;
    children = generateChildren(age, maritalStatus);
  }
  
  // 生成信仰相關
  const faithProfile = generateFaithProfile(age, integratedProfile);
  const favoriteVerse = generateFavoriteVerse();
  const prayerRequest = generatePrayerRequest();
  const miracle = generateMiracle();
  
  // 生成生活事件和職業發展
  const lifeEvents = [];
  const careerPath = {};
  
  const character = {
    id: Date.now(),
    
    // 基本資訊
    name: name,
    email: email,
    age: age,
    gender: gender,
    maritalStatus: maritalStatus,
    
    // 家庭資訊
    spouse: spouse,
    spouseAge: spouseAge,
    children: children,
    familyMembers: familyMembers,
    
    // 家庭關係（展開所有屬性）
    ...familyDynamics,
    familyBackground: sample(db.familyBackgrounds),
    familyRole: sample(db.familyRoles),
    familyChallenge: sample(db.familyChallenges),
    familyStrength: sample(db.familyStrengths),
    familyActivity: sample(db.familyActivities),
    familyAttitudes: sample(db.familyAttitudes),
    
    // 職業和教育
    education: integratedProfile.education || sample(db.educations),
    occupation: integratedProfile.occupation || sample(db.occupations.all),
    jobTitle: (() => {
      const occ = integratedProfile.occupation || sample(db.occupations.all);
      const graduationAge = (integratedProfile.education || sample(db.educations)).includes('博士') ? 28 : 
                           (integratedProfile.education || sample(db.educations)).includes('碩士') ? 24 : 
                           (integratedProfile.education || sample(db.educations)).includes('大學') ? 22 : 20;
      const workExp = Math.max(0, age - graduationAge);
      return generateJobTitle(occ, age, workExp);
    })(),
    workExperience: (() => {
      const graduationAge = (integratedProfile.education || sample(db.educations)).includes('博士') ? 28 : 
                           (integratedProfile.education || sample(db.educations)).includes('碩士') ? 24 : 
                           (integratedProfile.education || sample(db.educations)).includes('大學') ? 22 : 20;
      return Math.max(0, age - graduationAge);
    })(),
    location: sample(['台北市', '新北市', '台中市', '台南市', '高雄市', '桃園市', '新竹市', '彰化縣', '南投縣', '雲林縣']),
    transportation: sample(['開車', '騎機車', '搭捷運', '騎腳踏車', '走路', '搭公車']),
    healthCondition: integratedProfile.healthCondition || sample(['健康', '良好', '普通', '需要注意']),
    
    // 生活事件
    lifeEvents: lifeEvents,
    
    // 職業發展
    careerPath: careerPath,
    
    // 其他特質 - 添加安全檢查
    strengths: integratedProfile.strengths || sample(db.strengths) || sample(db.positiveTraits) || '友善',
    weaknesses: integratedProfile.weaknesses || sample(db.weaknesses) || sample(db.negativeTraits) || '有時急躁',
    hobbies: integratedProfile.hobbies || sample(db.hobbies) || '閱讀',
    motto: integratedProfile.motto || sample(db.mottos) || sample(db.lifeMottos) || '活在當下',
    wish: integratedProfile.wish || sample(db.wishes) || '希望家人健康平安',
    socialMedia: integratedProfile.socialMedia || sample(db.socialMedia),
    politicalView: integratedProfile.politicalView || sample(db.politicalViews),
    healthStatus: integratedProfile.healthStatus || sample(['健康良好', '偶有小病', '需要注意', '正在調養']),
    financialStatus: integratedProfile.financialStatus || sample(['經濟穩定', '小康水準', '需要節儉', '經濟寬裕']),
    lifeView: integratedProfile.lifeView || sample(db.lifeViews),
    futurePlan: integratedProfile.futurePlan || sample(db.futurePlans),
    socialFrequency: integratedProfile.socialFrequency || sample(db.socialFrequencies),
    consumptionHabit: integratedProfile.consumptionHabit || sample(db.consumptionHabits),
    
    // 個人故事與特質 - 添加安全檢查
    story: sample(db.backgroundStories) || '有著平凡而溫暖的成長經歷',
    secret: sample(db.personalSecrets) || '有一個不為人知的小願望',
    lifestyle: sample(db.lifestyles) || '規律的生活作息',
    symbolicItem: sample(db.symbolicItems) || '一本珍愛的聖經',
    habitAction: sample(db.habitActions) || '習慣在思考時輕撫下巴',
    specialExperiences: sample(db.specialExperiences) || '曾經參與過教會的短宣活動',
    lifeAchievements: sample(db.lifeAchievements) || '在工作上獲得同事的認可',
    lifeTurningPoints: sample(db.lifeTurningPoints) || '信主的那一刻改變了人生方向',
    significantEvents: sample(db.significantEvents) || '大學畢業是人生重要里程碑',
    
    // 職業相關補充
    moneyAttitudes: sample(db.moneyAttitudes),
    workAttitudes: sample(db.workingStyles),
    professionalSkills: sample(db.professionalSkills),
    languageSkills: sample(db.languageSkills),
    lifeGoal: sample(db.lifeGoals),
    
    // === 新增的心理與情感層面 ===
    emotionalState: sample(db.emotionalStates),
    emotionManagement: sample(db.emotionManagementMethods),
    stressReaction: sample(db.stressReactions),
    confidenceLevel: sample(db.confidenceLevels),
    loveLanguage: sample(db.loveLanguages),
    
    // === 職業發展深度 ===
    careerJourney: sample(db.careerJourneys),
    jobSatisfaction: sample(db.jobSatisfactions),
    leadershipStyle: sample(db.leadershipStyles),
    
    // === 生活細節與習慣 ===
    dailyRoutine: sample(db.dailyRoutines),
    dietaryHabit: sample(db.dietaryHabits),
    livingEnvironment: sample(db.livingEnvironments),
    
    // === 經濟與消費 ===
    incomeRange: sample(db.incomeRanges),
    financialHabit: sample(db.financialHabits),
    charitableDonation: sample(db.charitableDonations),
    
    // === 文化與興趣 ===
    culturalBackground: sample(db.culturalBackgrounds),
    artisticPreference: sample(db.artisticPreferences),
    learningInterest: sample(db.learningInterests),
    
    // === 健康與醫療 ===
    healthManagement: sample(db.healthManagement),
    exerciseHabit: sample(db.exerciseHabits),
    
    // === 數位生活 ===
    technologyUsage: sample(db.technologyUsage),
    internetBehavior: sample(db.internetBehaviors),
    
    // === 社會參與 ===
    communityInvolvement: sample(db.communityInvolvement),
    environmentalAwareness: sample(db.environmentalAwareness),
    
    // 信仰相關
    ...faithProfile,
    favoriteVerse: favoriteVerse,
    prayerRequest: prayerRequest,
    miracle: miracle
  };

  return character;
}

// 新增：增強版人物生成（主要入口）
export function generateRealisticCharacter(options = {}) {
  const {
    useEnhanced = true,
    templateKey = null,
    constraints = {},
    includeExtras = true
  } = options;
  
  if (!useEnhanced) {
    // 強制使用原版
    return templateKey 
      ? generateConstrainedCharacter(characterTemplates[templateKey]?.constraints || {})
      : generateConstrainedCharacter(constraints);
  }
  
  try {
    // 使用增強版生成
    let character;
    
    if (templateKey) {
      character = generateCharacterFromTemplate(templateKey, constraints);
    } else {
      character = generateEnhancedCharacter(constraints);
    }
    
    if (character && character.logicalConsistency && includeExtras) {
      // 添加額外的詳細資訊
      const familyInfo = generateFamilyDynamics();
      const faithInfo = generateFaithProfile();
      
      character.family = familyInfo;
      character.faith = faithInfo;
      character.generationTimestamp = new Date().toISOString();
      
      // 添加真實感評分
      character.realismScore = calculateRealismScore(character);
    }
    
    return character;
    
  } catch (error) {
    console.warn('增強版生成失敗，回退到原版:', error);
    return templateKey 
      ? generateConstrainedCharacter(characterTemplates[templateKey]?.constraints || {})
      : generateConstrainedCharacter(constraints);
  }
}

// 計算真實感評分
function calculateRealismScore(character) {
  let score = 0;
  let maxScore = 0;
  
  // 特質一致性 (30分)
  maxScore += 30;
  if (character.logicalConsistency) {
    score += 30;
  } else if (character.traits && checkTraitCompatibility(character.traits)) {
    score += 20;
  }
  
  // 年齡邏輯性 (25分)
  maxScore += 25;
  if (character.age && character.occupation) {
    if (validateAgeExperience(character.age, [character.occupation], character.occupation)) {
      score += 25;
    } else {
      score += 10;
    }
  }
  
  // 職業匹配度 (20分)
  maxScore += 20;
  if (character.jobMatchScore) {
    score += Math.round(character.jobMatchScore * 0.2);
  }
  
  // 信仰一致性 (15分)
  maxScore += 15;
  if (character.faithLevel && character.faithBehavior) {
    score += 15;
  } else if (character.faith) {
    score += 10;
  }
  
  // 家庭背景影響 (10分)
  maxScore += 10;
  if (character.familyBackground && character.traits) {
    score += 10;
  }
  
  return Math.round((score / maxScore) * 100);
}

export { 
  generateCharacterFromTemplate, 
  generateConstrainedCharacter,
  generateIntegratedCharacterProfile,
  generateRealisticCharacter,
  calculateRealismScore,
  // 導出增強版工具函數
  checkTraitCompatibility,
  calculateJobPersonalityMatch,
  validateAgeExperience
}; 