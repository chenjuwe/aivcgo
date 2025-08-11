// character-enhanced.js - 增強真實感的人物生成系統
import { sample, randomInt, randomBool } from './utils.js';
import { db } from '../data/database.js';
import { generateJobTitle } from '../data/occupations.js';
import { generateFamilyDynamics, generateFamilyMembers, generateSpouse, generateChildren } from './family.js';
import { generateFaithProfile, generateFavoriteVerse, generatePrayerRequest, generateMiracle } from './faith.js';

// === 特質關聯矩陣系統 ===

// 正負特質平衡機制
const traitCorrelationMatrix = {
  // 正面特質 → 相關負面特質（平衡真實性）
  '樂觀開朗': {
    compatibleNegative: ['有時過於樂觀', '忽視現實問題', '缺乏危機意識', '過度樂觀導致準備不足'],
    incompatibleNegative: ['極度悲觀', '憂鬱症傾向', '總是看到壞的一面'],
    probability: 0.7
  },
  '完美主義': {
    compatibleNegative: ['過度挑剔', '難以妥協', '壓力大', '拖延症', '永不滿足'],
    compatiblePositive: ['注重細節', '責任感強', '品質導向'],
    incompatibleNegative: ['隨便應付', '不在乎品質'],
    probability: 0.8
  },
  '外向社交': {
    compatibleNegative: ['有時過於健談', '不善獨處', '需要他人認同', '表面化交往'],
    incompatibleNegative: ['社交恐懼', '極度內向', '害怕人群'],
    probability: 0.6
  },
  '內向安靜': {
    compatibleNegative: ['社交困難', '表達困難', '容易被忽視', '過度敏感'],
    compatiblePositive: ['深度思考', '專注力強', '觀察力敏銳'],
    incompatibleNegative: ['過度健談', '喜歡成為焦點'],
    probability: 0.5
  },
  '責任感強': {
    compatibleNegative: ['壓力過大', '難以拒絕他人', '過度負責', '容易內疚'],
    incompatibleNegative: ['不負責任', '推卸責任', '隨便應付'],
    probability: 0.7
  },
  '創意豐富': {
    compatibleNegative: ['不切實際', '缺乏執行力', '注意力分散', '不喜歡規則'],
    compatiblePositive: ['思維靈活', '適應力強'],
    incompatibleNegative: ['思維僵化', '拒絕變化'],
    probability: 0.6
  }
};

// MBTI與行為模式關聯 (完整16種類型)
const mbtiBeahviorMapping = {
  // === 分析師 (NT) ===
  'INTJ': {
    name: '建築師',
    category: '分析師',
    strengths: ['分析能力', '長期規劃', '獨立思考', '系統化思維'],
    challenges: ['社交困難', '完美主義', '不善表達情感', '過度批判'],
    workStyle: '喜歡獨立工作，重視效率和品質',
    relationshipStyle: '深度但不廣泛的人際關係，重質不重量',
    stressResponse: '內化壓力，尋求獨處和理性分析',
    communicationStyle: '直接但可能顯得冷漠',
    decisionMaking: '基於邏輯和長期考量',
    conflictStyle: '避免情緒化衝突，偏好理性討論'
  },
  'INTP': {
    name: '邏輯學家',
    category: '分析師',
    strengths: ['邏輯思維', '好奇心強', '創新能力', '客觀分析'],
    challenges: ['缺乏執行力', '社交困難', '不善處理細節', '容易分心'],
    workStyle: '需要自由和彈性，重視理論探索',
    relationshipStyle: '少數深度友誼，重視智識交流',
    stressResponse: '退縮到內心世界，進行理性分析',
    communicationStyle: '邏輯清晰但可能過於理論化',
    decisionMaking: '基於邏輯分析和理論框架',
    conflictStyle: '理性辯論，避免情緒化'
  },
  'ENTJ': {
    name: '指揮官',
    category: '分析師',
    strengths: ['領導能力', '戰略思維', '決斷力', '組織能力'],
    challenges: ['過於強勢', '缺乏耐心', '忽視他人感受', '完美主義'],
    workStyle: '追求效率和結果，喜歡領導團隊',
    relationshipStyle: '廣泛的專業網絡，重視能力和成就',
    stressResponse: '增加工作量，尋求控制和解決方案',
    communicationStyle: '直接有力，重視效率',
    decisionMaking: '快速決策，基於邏輯和效益',
    conflictStyle: '直接面對，尋求快速解決'
  },
  'ENTP': {
    name: '辯論家',
    category: '分析師',
    strengths: ['創新思維', '適應力強', '溝通能力', '概念思考'],
    challenges: ['缺乏持續力', '不喜歡例行公事', '容易忽視細節', '過度樂觀'],
    workStyle: '需要變化和挑戰，重視創新和可能性',
    relationshipStyle: '廣泛的社交圈，重視智識刺激',
    stressResponse: '尋求新的挑戰和刺激',
    communicationStyle: '熱情有趣，善於辯論',
    decisionMaking: '基於可能性和創新潛力',
    conflictStyle: '透過辯論和創意解決'
  },

  // === 外交官 (NF) ===
  'INFJ': {
    name: '提倡者',
    category: '外交官',
    strengths: ['洞察力', '同理心', '理想主義', '創造力'],
    challenges: ['過度敏感', '完美主義', '容易倦怠', '難以妥協'],
    workStyle: '重視意義和價值，需要獨立思考時間',
    relationshipStyle: '少數深度關係，重視心靈契合',
    stressResponse: '需要獨處時間進行內省',
    communicationStyle: '深度而有意義的對話',
    decisionMaking: '基於價值觀和對他人的影響',
    conflictStyle: '尋求和諧，但在價值觀上不妥協'
  },
  'INFP': {
    name: '調停者',
    category: '外交官',
    strengths: ['創意思維', '同理心', '適應力', '價值導向'],
    challenges: ['過度理想化', '缺乏組織能力', '容易受傷', '拖延傾向'],
    workStyle: '需要自主性和意義感，重視個人價值',
    relationshipStyle: '深度而真誠的關係，重視理解和接納',
    stressResponse: '退縮到內心世界，尋求價值澄清',
    communicationStyle: '溫和而真誠，重視情感表達',
    decisionMaking: '基於個人價值觀和感受',
    conflictStyle: '避免衝突，尋求和諧解決'
  },
  'ENFJ': {
    name: '主人公',
    category: '外交官',
    strengths: ['領導魅力', '同理心', '溝通能力', '激勵他人'],
    challenges: ['過度關心他人', '忽視自己需求', '容易倦怠', '過於理想化'],
    workStyle: '重視團隊合作和人的發展',
    relationshipStyle: '廣泛而深入的人際關係，重視他人成長',
    stressResponse: '尋求他人支持，透過幫助別人獲得滿足',
    communicationStyle: '溫暖鼓勵，善於激勵',
    decisionMaking: '考慮對他人和群體的影響',
    conflictStyle: '尋求雙贏解決方案'
  },
  'ENFP': {
    name: '競選者',
    category: '外交官',
    strengths: ['創意豐富', '熱情洋溢', '適應力強', '善於激勵他人'],
    challenges: ['容易分心', '情緒起伏大', '害怕承諾', '缺乏持續力'],
    workStyle: '需要變化和自由度，重視人際互動',
    relationshipStyle: '廣泛但可能缺乏深度的社交網絡',
    stressResponse: '尋求他人支持，透過談話紓解',
    communicationStyle: '熱情表達但可能缺乏重點',
    decisionMaking: '基於價值觀和他人影響',
    conflictStyle: '用幽默化解，避免正面衝突'
  },

  // === 守護者 (SJ) ===
  'ISTJ': {
    name: '物流師',
    category: '守護者',
    strengths: ['責任感', '可靠穩定', '組織能力', '細心謹慎'],
    challenges: ['抗拒變化', '過於保守', '缺乏彈性', '不善表達情感'],
    workStyle: '重視秩序和傳統，喜歡明確的指導',
    relationshipStyle: '穩定長久的關係，重視忠誠和責任',
    stressResponse: '加強控制和組織，尋求穩定',
    communicationStyle: '實事求是，重視事實',
    decisionMaking: '基於經驗和既定程序',
    conflictStyle: '避免衝突，堅持原則'
  },
  'ISFJ': {
    name: '守護者',
    category: '守護者',
    strengths: ['有同理心', '責任感強', '細心謹慎', '忠誠可靠'],
    challenges: ['過度討好', '缺乏界限感', '難以說不', '容易被利用'],
    workStyle: '穩定可靠，重視團隊和諧',
    relationshipStyle: '深度關懷但可能過度依賴',
    stressResponse: '內化壓力，透過服務他人尋求價值',
    communicationStyle: '溫和委婉，避免衝突',
    decisionMaking: '考慮他人需求和感受',
    conflictStyle: '迴避或妥協，很少堅持己見'
  },
  'ESTJ': {
    name: '總經理',
    category: '守護者',
    strengths: ['組織能力', '領導力', '實務導向', '決斷力'],
    challenges: ['過於強勢', '不善處理情感', '抗拒變化', '缺乏彈性'],
    workStyle: '重視效率和結果，喜歡管理和組織',
    relationshipStyle: '廣泛的社交網絡，重視地位和成就',
    stressResponse: '增加控制和組織，尋求具體解決方案',
    communicationStyle: '直接明確，重視效率',
    decisionMaking: '基於邏輯和既定標準',
    conflictStyle: '直接處理，堅持立場'
  },
  'ESFJ': {
    name: '執政官',
    category: '守護者',
    strengths: ['人際和諧', '責任感', '組織能力', '關懷他人'],
    challenges: ['過度在意他人看法', '避免衝突', '抗拒變化', '容易受傷'],
    workStyle: '重視團隊和諧和他人福祉',
    relationshipStyle: '廣泛而溫暖的人際關係',
    stressResponse: '尋求他人支持和認同',
    communicationStyle: '溫暖友善，重視和諧',
    decisionMaking: '考慮他人感受和群體和諧',
    conflictStyle: '避免衝突，尋求妥協'
  },

  // === 探險家 (SP) ===
  'ISTP': {
    name: '鑑賞家',
    category: '探險家',
    strengths: ['實務能力', '適應力', '冷靜客觀', '解決問題'],
    challenges: ['不善表達', '缺乏長期規劃', '容易厭倦', '不喜歡承諾'],
    workStyle: '重視實務和技能，需要自由度',
    relationshipStyle: '少數親密關係，重視個人空間',
    stressResponse: '尋求獨處，透過實務活動紓解',
    communicationStyle: '簡潔實用，重視行動',
    decisionMaking: '基於邏輯和實際考量',
    conflictStyle: '冷靜處理，尋求實際解決'
  },
  'ISFP': {
    name: '探險家',
    category: '探險家',
    strengths: ['藝術感受', '同理心', '適應力', '溫和友善'],
    challenges: ['過度敏感', '缺乏組織能力', '避免衝突', '不善自我推銷'],
    workStyle: '重視個人價值和創意表達',
    relationshipStyle: '深度而真誠的關係，重視理解',
    stressResponse: '尋求美好事物，透過藝術表達',
    communicationStyle: '溫和真誠，重視情感',
    decisionMaking: '基於個人價值和感受',
    conflictStyle: '避免衝突，尋求和諧'
  },
  'ESTP': {
    name: '企業家',
    category: '探險家',
    strengths: ['勇於挑戰', '適應力強', '溝通能力佳', '實務導向'],
    challenges: ['衝動決策', '缺乏長期規劃', '不耐煩', '風險意識低'],
    workStyle: '喜歡行動和立即成果，不喜歡長期規劃',
    relationshipStyle: '活潑外向但可能缺乏深度承諾',
    stressResponse: '透過行動和社交活動紓解',
    communicationStyle: '直接坦率，有時可能過於直接',
    decisionMaking: '快速決策，基於當下情況',
    conflictStyle: '直接面對，可能過於激烈'
  },
  'ESFP': {
    name: '娛樂家',
    category: '探險家',
    strengths: ['熱情活潑', '社交能力', '適應力', '樂觀正向'],
    challenges: ['容易分心', '缺乏長期規劃', '過度敏感', '避免衝突'],
    workStyle: '重視人際互動和樂趣',
    relationshipStyle: '廣泛而熱情的社交圈',
    stressResponse: '尋求他人陪伴和娛樂活動',
    communicationStyle: '熱情友善，重視情感交流',
    decisionMaking: '基於感受和他人反應',
    conflictStyle: '避免衝突，尋求和諧'
  }
};

// 年齡階段邏輯框架
const lifeStageFramework = {
  '18-25': {
    name: '探索建立期',
    characteristics: ['身份認同探索', '職業方向不明確', '依賴性較強', '理想主義'],
    typicalExperiences: ['大學生活', '初入職場', '第一次戀愛', '經濟獨立嘗試'],
    developmentalTasks: ['獨立生活', '職業選擇', '人際關係建立', '價值觀形成'],
    constraintsCheck: {
      leadership: 'low', // 領導經驗應該較少
      financialStability: 'developing', // 經濟獨立發展中
      lifeWisdom: 'basic', // 人生智慧基礎階段
      relationshipDepth: 'exploring', // 感情關係探索期
      careerLevel: 'entry' // 職業初階
    },
    commonChallenges: ['方向迷茫', '經濟壓力', '人際適應', '自我認同'],
    typicalGoals: ['找到方向', '經濟獨立', '建立關係', '個人成長']
  },
  '26-35': {
    name: '建立穩定期',
    characteristics: ['職業發展', '建立家庭', '責任感增加', '現實主義增強'],
    typicalExperiences: ['職業晉升', '結婚生子', '購屋置產', '人際網絡擴展'],
    developmentalTasks: ['事業建立', '家庭經營', '財務規劃', '社會責任'],
    constraintsCheck: {
      leadership: 'developing',
      financialStability: 'improving',
      lifeWisdom: 'growing',
      relationshipDepth: 'deepening',
      careerLevel: 'intermediate'
    },
    commonChallenges: ['工作壓力', '家庭平衡', '財務負擔', '時間管理'],
    typicalGoals: ['事業成功', '家庭幸福', '財務穩定', '個人成就']
  },
  '36-50': {
    name: '成熟發展期',
    characteristics: ['事業高峰', '家庭穩定', '社會影響力', '智慧累積'],
    typicalExperiences: ['管理職位', '子女教育', '財富累積', '社會參與'],
    developmentalTasks: ['領導他人', '傳承經驗', '社會貢獻', '人生反思'],
    constraintsCheck: {
      leadership: 'high',
      financialStability: 'stable',
      lifeWisdom: 'mature',
      relationshipDepth: 'deep',
      careerLevel: 'senior'
    },
    commonChallenges: ['中年危機', '健康問題', '代溝問題', '責任重擔'],
    typicalGoals: ['影響他人', '傳承價值', '健康維持', '意義追尋']
  },
  '51-65': {
    name: '智慧傳承期',
    characteristics: ['經驗豐富', '智慧成熟', '影響力大', '開始思考退休'],
    typicalExperiences: ['高階職位', '指導後進', '財務規劃', '健康關注'],
    developmentalTasks: ['智慧傳承', '人生總結', '退休準備', '健康維護'],
    constraintsCheck: {
      leadership: 'expert',
      financialStability: 'established',
      lifeWisdom: 'wise',
      relationshipDepth: 'profound',
      careerLevel: 'executive'
    },
    commonChallenges: ['健康衰退', '世代差異', '退休焦慮', '意義尋找'],
    typicalGoals: ['傳承智慧', '健康長壽', '家族和諧', '心靈平靜']
  }
};

// 職業特質需求矩陣 (擴展版)
const jobPersonalityRequirements = {
  // === 科技類 ===
  '軟體工程師': {
    category: '科技類',
    requiredTraits: ['邏輯思維', '專注力', '學習能力', '解決問題'],
    beneficialTraits: ['獨立工作', '創新思維', '細心謹慎'],
    challengingTraits: ['極度外向', '討厭細節', '無法專注', '不喜歡學習'],
    mbtiSuitability: ['INTJ', 'INTP', 'ISTJ', 'ISTP'],
    workEnvironment: '獨立或小團隊工作',
    stressFactors: ['時間壓力', '技術變化', '複雜問題']
  },
  '資料科學家': {
    category: '科技類',
    requiredTraits: ['邏輯思維', '好奇心', '數據敏感度', '分析能力'],
    beneficialTraits: ['統計知識', '程式能力', '商業理解'],
    challengingTraits: ['不喜歡數字', '缺乏邏輯', '無法專注'],
    mbtiSuitability: ['INTJ', 'INTP', 'ISTJ'],
    workEnvironment: '研究導向環境',
    stressFactors: ['數據複雜性', '商業壓力', '技術更新']
  },
  'UI/UX設計師': {
    category: '科技類',
    requiredTraits: ['創意思維', '同理心', '美感', '溝通能力'],
    beneficialTraits: ['用戶思維', '技術理解', '迭代思維'],
    challengingTraits: ['缺乏創意', '不重視美感', '無法同理'],
    mbtiSuitability: ['INFP', 'ISFP', 'ENFP', 'INFJ'],
    workEnvironment: '跨團隊合作',
    stressFactors: ['需求變更', '技術限制', '用戶反饋']
  },

  // === 商業類 ===
  '業務經理': {
    category: '商業類',
    requiredTraits: ['溝通能力', '說服力', '抗壓性', '人際技巧'],
    beneficialTraits: ['外向社交', '樂觀積極', '競爭意識'],
    challengingTraits: ['極度內向', '社交恐懼', '缺乏自信', '害怕拒絕'],
    mbtiSuitability: ['ENFJ', 'ENFP', 'ESTJ', 'ESTP'],
    workEnvironment: '高度人際互動',
    stressFactors: ['業績壓力', '客戶關係', '市場變化']
  },
  '行銷專員': {
    category: '商業類',
    requiredTraits: ['創意思維', '溝通能力', '市場敏感度', '分析能力'],
    beneficialTraits: ['社群媒體', '內容創作', '數據分析'],
    challengingTraits: ['缺乏創意', '不善溝通', '對市場不敏感'],
    mbtiSuitability: ['ENFP', 'ENTP', 'ESFP', 'ENFJ'],
    workEnvironment: '創意與分析並重',
    stressFactors: ['創意壓力', '成效評估', '市場競爭']
  },
  '財務分析師': {
    category: '商業類',
    requiredTraits: ['邏輯思維', '細心謹慎', '風險意識', '數字敏感'],
    beneficialTraits: ['分析能力', '責任感', '客觀判斷'],
    challengingTraits: ['粗心大意', '不喜歡數字', '風險盲目'],
    mbtiSuitability: ['INTJ', 'ISTJ', 'INTP', 'ESTJ'],
    workEnvironment: '數據分析環境',
    stressFactors: ['準確性要求', '時間壓力', '決策責任']
  },
  '人力資源專員': {
    category: '商業類',
    requiredTraits: ['同理心', '溝通能力', '公平正義', '組織能力'],
    beneficialTraits: ['心理學知識', '法律常識', '談判技巧'],
    challengingTraits: ['缺乏同理心', '不善溝通', '偏見嚴重'],
    mbtiSuitability: ['ENFJ', 'ESFJ', 'INFJ', 'ISFJ'],
    workEnvironment: '人際互動頻繁',
    stressFactors: ['人際衝突', '法律風險', '組織變革']
  },

  // === 教育類 ===
  '教師': {
    category: '教育類',
    requiredTraits: ['耐心', '溝通能力', '責任感', '同理心'],
    beneficialTraits: ['創意思維', '組織能力', '領導力'],
    challengingTraits: ['極度內向', '缺乏耐心', '不善表達'],
    mbtiSuitability: ['ENFJ', 'INFJ', 'ESFJ', 'ISFJ'],
    workEnvironment: '教育環境，與學生互動',
    stressFactors: ['學生管理', '家長期望', '教學壓力']
  },
  '教育行政': {
    category: '教育類',
    requiredTraits: ['組織能力', '溝通協調', '教育理念', '領導力'],
    beneficialTraits: ['政策理解', '資源管理', '團隊合作'],
    challengingTraits: ['缺乏組織能力', '不善協調', '無教育理念'],
    mbtiSuitability: ['ESTJ', 'ENFJ', 'ENTJ', 'ESFJ'],
    workEnvironment: '行政管理環境',
    stressFactors: ['政策壓力', '資源限制', '多方協調']
  },
  '心理諮商師': {
    category: '教育類',
    requiredTraits: ['同理心', '傾聽能力', '情緒穩定', '專業知識'],
    beneficialTraits: ['心理學背景', '溝通技巧', '保密意識'],
    challengingTraits: ['缺乏同理心', '情緒不穩', '無法保密'],
    mbtiSuitability: ['INFJ', 'ENFJ', 'ISFJ', 'INFP'],
    workEnvironment: '一對一諮商環境',
    stressFactors: ['情緒負擔', '案例複雜性', '專業責任']
  },

  // === 醫療類 ===
  '醫師': {
    category: '醫療類',
    requiredTraits: ['責任感', '抗壓性', '同理心', '學習能力'],
    beneficialTraits: ['邏輯思維', '決策能力', '溝通技巧'],
    challengingTraits: ['缺乏責任感', '無法承受壓力', '缺乏同理心'],
    mbtiSuitability: ['INTJ', 'INFJ', 'ISTJ', 'ISFJ'],
    workEnvironment: '高壓醫療環境',
    stressFactors: ['生命責任', '長時間工作', '情緒負擔']
  },
  '護理師': {
    category: '醫療類',
    requiredTraits: ['同理心', '抗壓性', '細心負責', '團隊合作'],
    beneficialTraits: ['醫療知識', '溝通能力', '應變能力'],
    challengingTraits: ['缺乏同理心', '粗心大意', '無法合作'],
    mbtiSuitability: ['ISFJ', 'ESFJ', 'INFJ', 'ENFJ'],
    workEnvironment: '醫療照護環境',
    stressFactors: ['工作負荷', '情緒壓力', '輪班制度']
  },
  '藥師': {
    category: '醫療類',
    requiredTraits: ['專業知識', '細心謹慎', '服務精神', '責任感'],
    beneficialTraits: ['藥學背景', '溝通能力', '記憶力'],
    challengingTraits: ['粗心大意', '缺乏專業知識', '不負責任'],
    mbtiSuitability: ['ISTJ', 'ISFJ', 'INTJ', 'INFJ'],
    workEnvironment: '藥局或醫院',
    stressFactors: ['用藥安全', '專業責任', '法規要求']
  },

  // === 創意類 ===
  '平面設計師': {
    category: '創意類',
    requiredTraits: ['創意思維', '美感', '技術能力', '溝通能力'],
    beneficialTraits: ['藝術背景', '軟體技能', '市場理解'],
    challengingTraits: ['缺乏創意', '不重視美感', '技術能力差'],
    mbtiSuitability: ['ISFP', 'INFP', 'ENFP', 'ESFP'],
    workEnvironment: '創意工作室',
    stressFactors: ['創意壓力', '客戶需求', '技術更新']
  },
  '音樂家': {
    category: '創意類',
    requiredTraits: ['藝術天份', '持續練習', '表演能力', '創意思維'],
    beneficialTraits: ['音樂教育', '情感表達', '舞台經驗'],
    challengingTraits: ['缺乏天份', '不願練習', '舞台恐懼'],
    mbtiSuitability: ['ISFP', 'INFP', 'ESFP', 'ENFP'],
    workEnvironment: '表演或教學',
    stressFactors: ['表演壓力', '收入不穩', '競爭激烈']
  },
  '作家': {
    category: '創意類',
    requiredTraits: ['文字能力', '想像力', '觀察力', '持續力'],
    beneficialTraits: ['閱讀習慣', '生活經驗', '市場敏感'],
    challengingTraits: ['文字能力差', '缺乏想像力', '無法持續'],
    mbtiSuitability: ['INFP', 'INFJ', 'INTP', 'ISFP'],
    workEnvironment: '獨立創作',
    stressFactors: ['創作壓力', '收入不穩', '市場競爭']
  },

  // === 服務類 ===
  '社工師': {
    category: '服務類',
    requiredTraits: ['同理心', '溝通能力', '社會關懷', '抗壓性'],
    beneficialTraits: ['社會工作知識', '資源整合', '倡議能力'],
    challengingTraits: ['缺乏同理心', '不關心社會', '無法承壓'],
    mbtiSuitability: ['ENFJ', 'INFJ', 'ESFJ', 'ISFJ'],
    workEnvironment: '社會服務機構',
    stressFactors: ['案例複雜性', '資源不足', '情緒負擔']
  },
  '餐飲業': {
    category: '服務類',
    requiredTraits: ['服務精神', '抗壓性', '團隊合作', '應變能力'],
    beneficialTraits: ['溝通能力', '體力充沛', '學習意願'],
    challengingTraits: ['不願服務', '無法合作', '應變能力差'],
    mbtiSuitability: ['ESFJ', 'ESFP', 'ISFJ', 'ESTP'],
    workEnvironment: '餐廳或飯店',
    stressFactors: ['工作節奏', '客戶要求', '工時長']
  },
  '零售業': {
    category: '服務類',
    requiredTraits: ['溝通能力', '耐心', '銷售技巧', '服務精神'],
    beneficialTraits: ['產品知識', '市場敏感', '應變能力'],
    challengingTraits: ['不善溝通', '缺乏耐心', '不願服務'],
    mbtiSuitability: ['ESFJ', 'ENFJ', 'ESFP', 'ESTP'],
    workEnvironment: '零售店面',
    stressFactors: ['銷售壓力', '客戶服務', '工時安排']
  }
};

// 家庭環境心理影響模型
const familyInfluenceModel = {
  '單親家庭': {
    positiveInfluences: ['獨立性強', '責任感早熟', '適應力強', '堅韌不拔'],
    negativeInfluences: ['缺乏安全感', '對承諾恐懼', '情感表達困難', '信任問題'],
    compensationMechanisms: ['尋求認同', '過度自立', '保護機制', '早熟行為'],
    probability: {
      independent: 0.8,
      trustIssues: 0.6,
      earlyMaturity: 0.7,
      selfReliant: 0.9
    }
  },
  '大家庭': {
    positiveInfluences: ['協調能力', '分享精神', '社交技巧', '包容性強'],
    negativeInfluences: ['缺乏個人空間', '競爭壓力', '身份模糊', '依賴性強'],
    compensationMechanisms: ['尋求關注', '競爭心理', '群體認同'],
    probability: {
      cooperative: 0.8,
      competitive: 0.6,
      socialSkills: 0.7,
      needAttention: 0.5
    }
  },
  '經濟困難家庭': {
    positiveInfluences: ['節儉習慣', '珍惜資源', '努力上進', '同理心強'],
    negativeInfluences: ['金錢焦慮', '自卑感', '壓力過大', '機會限制'],
    compensationMechanisms: ['努力證明', '金錢執著', '成功渴望'],
    probability: {
      frugal: 0.9,
      moneyAnxiety: 0.7,
      ambitious: 0.8,
      empathetic: 0.6
    }
  }
};

// 信仰深度與行為表現關聯
const faithBehaviorConsistency = {
  '慕道友': {
    typicalBehaviors: ['偶爾參加聚會', '對信仰好奇', '仍有疑問', '觀察學習'],
    spiritualPractices: ['基礎禱告', '聖經初探', '參加佈道會'],
    churchInvolvement: 'minimal',
    witnessing: 'none',
    faithChallenges: ['理性與信仰掙扎', '生活習慣調整', '社交圈改變']
  },
  '初信者': {
    typicalBehaviors: ['穩定參加主日', '開始建立靈修', '學習禱告', '信仰熱忱'],
    spiritualPractices: ['每週讀經', '參加小組', '學習禱告'],
    churchInvolvement: 'basic',
    witnessing: 'hesitant',
    faithChallenges: ['信仰根基建立', '舊習慣改變', '信仰疑問']
  },
  '成長期信徒': {
    typicalBehaviors: ['穩定聚會', '開始服事', '分享見證', '邀請朋友'],
    spiritualPractices: ['每日靈修', '參與事工', '小組帶領'],
    churchInvolvement: 'active',
    witnessing: 'willing',
    faithChallenges: ['服事學習', '屬靈爭戰', '信仰深化']
  },
  '成熟信徒': {
    typicalBehaviors: ['每日靈修', '穩定奉獻', '積極服事', '門徒訓練'],
    spiritualPractices: ['深度查經', '代禱服事', '教導他人'],
    churchInvolvement: 'leadership',
    witnessing: 'confident',
    faithChallenges: ['屬靈成長停滞', '服事倦怠', '教導責任']
  },
  '屬靈長者': {
    typicalBehaviors: ['生命見證', '智慧分享', '屬靈指導', '代禱勇士'],
    spiritualPractices: ['深度默想', '屬靈指導', '代禱服事'],
    churchInvolvement: 'mentoring',
    witnessing: 'lifestyle',
    faithChallenges: ['傳承責任', '身體限制', '世代差異']
  }
};

// === 核心生成函數 ===

// 特質相容性檢查
function checkTraitCompatibility(traits) {
  const incompatiblePairs = [
    ['極度內向', '熱愛社交'],
    ['完美主義', '隨遇而安'],
    ['工作狂', '享受生活'],
    ['極度悲觀', '樂觀開朗'],
    ['社交恐懼', '外向健談'],
    ['不負責任', '責任感強']
  ];
  
  // 檢查是否有不相容的特質組合
  for (let pair of incompatiblePairs) {
    if (traits.includes(pair[0]) && traits.includes(pair[1])) {
      return false; // 發現不相容組合
    }
  }
  return true;
}

// 根據正面特質生成平衡的負面特質
function generateBalancingTraits(positiveTraits) {
  const balancingTraits = [];
  
  for (let trait of positiveTraits) {
    const correlation = traitCorrelationMatrix[trait];
    if (correlation && Math.random() < correlation.probability) {
      const balancingTrait = sample(correlation.compatibleNegative);
      if (balancingTrait) {
        balancingTraits.push(balancingTrait);
      }
    }
  }
  
  return balancingTraits;
}

// 年齡經歷邏輯檢查
function validateAgeExperience(age, experiences, occupation) {
  const ageStage = getAgeStage(age);
  const stageData = lifeStageFramework[ageStage];
  
  if (!stageData) return true;
  
  const constraints = stageData.constraintsCheck;
  
  // 檢查領導經驗
  const hasHighLeadership = experiences.some(exp => 
    exp.includes('總經理') || exp.includes('執行長') || exp.includes('總監')
  );
  
  if (hasHighLeadership && constraints.leadership === 'low') {
    return false; // 年齡太小不太可能有高階管理經驗
  }
  
  // 檢查職業階層
  const jobRequirement = jobPersonalityRequirements[occupation];
  if (jobRequirement) {
    // 根據年齡調整職業期望
    if (age < 30 && occupation.includes('總')) {
      return false; // 30歲以下通常不會是總字輩
    }
  }
  
  return true;
}

// 獲取年齡階段
function getAgeStage(age) {
  if (age <= 25) return '18-25';
  if (age <= 35) return '26-35';
  if (age <= 50) return '36-50';
  return '51-65';
}

// 職業性格匹配度計算
function calculateJobPersonalityMatch(personality, occupation) {
  const jobRequirements = jobPersonalityRequirements[occupation];
  if (!jobRequirements) return 1; // 如果沒有定義要求，默認匹配
  
  let matchScore = 0;
  let totalChecks = 0;
  
  // 計算必需特質匹配度
  for (let trait of jobRequirements.requiredTraits) {
    totalChecks++;
    if (personality.traits && personality.traits.includes(trait)) {
      matchScore += 2;
    }
  }
  
  // 計算有益特質匹配度
  if (jobRequirements.beneficialTraits) {
    for (let trait of jobRequirements.beneficialTraits) {
      totalChecks++;
      if (personality.traits && personality.traits.includes(trait)) {
        matchScore += 1;
      }
    }
  }
  
  // 扣除挑戰性特質分數
  if (jobRequirements.challengingTraits) {
    for (let trait of jobRequirements.challengingTraits) {
      totalChecks++;
      if (personality.traits && personality.traits.includes(trait)) {
        matchScore -= 2;
      }
    }
  }
  
  // 計算匹配百分比
  const maxScore = totalChecks * 2;
  return Math.max(0, matchScore) / maxScore;
}

// 根據家庭背景調整性格特質
function adjustTraitsBasedOnFamily(traits, familyBackground) {
  const familyInfluence = familyInfluenceModel[familyBackground];
  if (!familyInfluence) return traits;
  
  const adjustedTraits = [...traits];
  
  // 根據機率添加家庭影響特質
  for (let [influence, probability] of Object.entries(familyInfluence.probability)) {
    if (Math.random() < probability) {
      const relevantTraits = familyInfluence.positiveInfluences.concat(familyInfluence.negativeInfluences);
      const selectedTrait = sample(relevantTraits);
      if (selectedTrait && !adjustedTraits.includes(selectedTrait)) {
        adjustedTraits.push(selectedTrait);
      }
    }
  }
  
  return adjustedTraits;
}

// 根據信仰階段生成一致的行為
function generateConsistentFaithBehavior(faithLevel) {
  const faithData = faithBehaviorConsistency[faithLevel];
  if (!faithData) {
    // 默認為成長期信徒
    return faithBehaviorConsistency['成長期信徒'];
  }
  
  return {
    dailyPractices: sample(faithData.typicalBehaviors),
    spiritualHabits: sample(faithData.spiritualPractices),
    churchRole: faithData.churchInvolvement,
    witnessStyle: faithData.witnessing,
    currentChallenge: sample(faithData.faithChallenges)
  };
}

// === 主要生成函數 ===

export function generateEnhancedCharacter(constraints = {}) {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      // 1. 生成基本資訊
      const age = constraints.ageRange 
        ? randomInt(constraints.ageRange[0], constraints.ageRange[1])
        : randomInt(18, 65);
      
      const gender = constraints.gender || sample(['男', '女']);
      
      // 2. 根據年齡階段選擇合適的特徵
      const ageStage = getAgeStage(age);
      const stageData = lifeStageFramework[ageStage];
      
      // 3. 生成MBTI類型
      const mbtiType = sample(Object.keys(mbtiBeahviorMapping));
      const mbtiData = mbtiBeahviorMapping[mbtiType];
      
      // 4. 生成職業（考慮MBTI適性）
      let occupation;
      if (constraints.occupationCategories) {
        occupation = sample(constraints.occupationCategories);
      } else {
        // 根據MBTI選擇適合的職業
        const suitableJobs = Object.keys(jobPersonalityRequirements).filter(job => {
          const jobReq = jobPersonalityRequirements[job];
          return jobReq.mbtiSuitability && jobReq.mbtiSuitability.includes(mbtiType);
        });
        
        occupation = suitableJobs.length > 0 
          ? sample(suitableJobs)
          : sample(Object.keys(jobPersonalityRequirements));
      }
      
      // 5. 生成基礎特質
      let traits = [
        sample(mbtiData.strengths),
        sample(mbtiData.challenges)
      ];
      
      // 6. 添加年齡相關特質
      traits.push(sample(stageData.characteristics));
      
      // 7. 生成平衡特質
      const balancingTraits = generateBalancingTraits(traits.filter(t => 
        !mbtiData.challenges.includes(t)
      ));
      traits = traits.concat(balancingTraits);
      
      // 8. 檢查特質相容性
      if (!checkTraitCompatibility(traits)) {
        continue; // 重新生成
      }
      
      // 9. 生成家庭背景並調整特質
      const familyBackground = sample(db.familyBackgrounds || ['一般家庭']);
      traits = adjustTraitsBasedOnFamily(traits, familyBackground);
      
      // 10. 生成信仰相關資訊
      const faithLevel = constraints.faithStage 
        ? sample(constraints.faithStage)
        : sample(Object.keys(faithBehaviorConsistency));
      
      const faithBehavior = generateConsistentFaithBehavior(faithLevel);
      
      // 11. 驗證年齡與經歷的邏輯性
      const experiences = [occupation, faithBehavior.churchRole];
      if (!validateAgeExperience(age, experiences, occupation)) {
        continue; // 重新生成
      }
      
      // 12. 計算職業匹配度
      const jobMatch = calculateJobPersonalityMatch({ traits }, occupation);
      if (jobMatch < 0.3) { // 匹配度太低
        continue; // 重新生成
      }
      
      // 13. 生成完整人物資料
      const character = {
        // 基本資訊
        id: Date.now() + Math.random(),
        age,
        gender,
        familyBackground,
        
        // 心理特質
        mbtiType,
        traits: [...new Set(traits)], // 去重
        workStyle: mbtiData.workStyle,
        relationshipStyle: mbtiData.relationshipStyle,
        stressResponse: mbtiData.stressResponse,
        communicationStyle: mbtiData.communicationStyle,
        decisionMaking: mbtiData.decisionMaking,
        conflictStyle: mbtiData.conflictStyle,
        
        // 職業相關
        occupation,
        jobMatchScore: Math.round(jobMatch * 100),
        
        // 年齡階段相關
        lifeStage: stageData.name,
        developmentalTasks: stageData.developmentalTasks,
        typicalChallenges: sample(stageData.commonChallenges),
        currentGoals: sample(stageData.typicalGoals),
        
        // 信仰相關
        faithLevel,
        faithBehavior,
        
        // 其他基本資訊
        name: generateName(gender),
        education: generateEducation(age),
        maritalStatus: generateMaritalStatus(age),
        
        // 元數據
        generationMethod: 'enhanced',
        logicalConsistency: true,
        matchingScore: jobMatch
      };
      
      return character;
      
    } catch (error) {
      console.warn(`生成嘗試 ${attempts} 失敗:`, error);
      continue;
    }
  }
  
  // 如果多次嘗試都失敗，返回基本版本
  console.warn('增強生成失敗，返回基本版本');
  return generateBasicCharacter(constraints);
}

// 輔助函數
function generateName(gender) {
  const surname = sample(db.surnames || ['陳', '林', '張', '李', '王']);
  const firstName = gender === '男' 
    ? sample(db.maleNames || ['志明', '建國', '家豪'])
    : sample(db.femaleNames || ['淑芬', '美玲', '雅婷']);
  
  const englishName = gender === '男'
    ? sample(db.christianEnglishNames?.male || ['David', 'John', 'Peter'])
    : sample(db.christianEnglishNames?.female || ['Mary', 'Grace', 'Faith']);
    
  const nickname = sample(db.christianNicknames || ['小羊', '恩典寶貝', '主的孩子']);
  
  return {
    chinese: `${surname}${firstName}`,
    english: englishName,
    nickname
  };
}

function generateEducation(age) {
  const ageStage = getAgeStage(age);
  const stageData = lifeStageFramework[ageStage];
  
  // 根據年齡選擇合理的教育程度
  if (age < 22) {
    return sample(['高中職畢業', '大學在學']);
  } else if (age < 30) {
    return sample(['大學畢業', '碩士學位', '大學肄業']);
  } else if (age < 40) {
    return sample(['大學畢業', '碩士學位', '博士學位']);
  } else {
    return sample(['大學畢業', '碩士學位', '博士學位', '專科畢業']);
  }
}

function generateMaritalStatus(age) {
  // 根據年齡生成合理的婚姻狀態
  if (age < 25) {
    return sample(['單身未婚', '穩定交往'], [0.7, 0.3]);
  } else if (age < 35) {
    return sample(['單身未婚', '穩定交往', '已婚多年', '新婚蜜月'], [0.3, 0.2, 0.3, 0.2]);
  } else if (age < 50) {
    return sample(['已婚多年', '婚姻美滿', '離婚未再婚', '單身未婚'], [0.5, 0.3, 0.1, 0.1]);
  } else {
    return sample(['已婚多年', '婚姻美滿', '離婚已再婚', '喪偶未再婚'], [0.4, 0.4, 0.1, 0.1]);
  }
}

function generateBasicCharacter(constraints) {
  // 基本版本的生成邏輯（原有系統的簡化版）
  return {
    id: Date.now(),
    age: randomInt(18, 65),
    gender: sample(['男', '女']),
    name: { chinese: '基本角色', english: 'Basic', nickname: '小羊' },
    traits: ['友善', '努力'],
    generationMethod: 'basic',
    logicalConsistency: false
  };
}

// 加權隨機選擇函數
function sample(array, weights = null) {
  if (!array || array.length === 0) return null;
  
  if (!weights) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < array.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return array[i];
    }
  }
  
  return array[array.length - 1];
}

// 導出主要函數
export { 
  generateEnhancedCharacter as default,
  checkTraitCompatibility,
  calculateJobPersonalityMatch,
  validateAgeExperience,
  traitCorrelationMatrix,
  mbtiBeahviorMapping,
  lifeStageFramework
}; 