import { CharacterTemplate } from '../types';

export const characterTemplates: CharacterTemplate[] = [
  {
    id: 'student',
    name: '學生',
    description: '求學階段的年輕人',
    avatar: '🎓',
    basePersonality: ['好奇心強', '充滿活力', '面臨壓力', '渴望成長'],
    suggestedOccupations: ['高中生', '大學生', '研究生', '交換學生', '準備考試者'],
    typicalChallenges: ['學業壓力', '考試焦慮', '未來迷茫', '人際關係', '時間管理'],
    recommendedCategories: ['petition', 'guidance', 'gratitude'],
    defaultStyle: 'casual'
  },
  {
    id: 'working-parent',
    name: '職業父母',
    description: '兼顧工作與家庭的父母',
    avatar: '👨‍👩‍👧‍👦',
    basePersonality: ['責任感重', '愛護家人', '時常疲憊', '堅韌不拔'],
    suggestedOccupations: ['上班族父母', '職業婦女', '單親家長', '創業父母', '教師家長'],
    typicalChallenges: ['工作家庭平衡', '孩子教育', '經濟壓力', '時間不夠', '身心疲憊'],
    recommendedCategories: ['intercession', 'petition', 'gratitude'],
    defaultStyle: 'formal'
  },
  {
    id: 'senior',
    name: '長者',
    description: '人生閱歷豐富的年長者',
    avatar: '👴👵',
    basePersonality: ['智慧豐富', '經驗深厚', '溫和慈祥', '重視傳承'],
    suggestedOccupations: ['退休人士', '祖父母', '志工', '長者導師', '社區長輩'],
    typicalChallenges: ['健康問題', '孤獨感', '世代差異', '身體機能', '傳承焦慮'],
    recommendedCategories: ['praise', 'gratitude', 'intercession'],
    defaultStyle: 'traditional'
  },
  {
    id: 'young-professional',
    name: '職場新人',
    description: '剛踏入職場的年輕專業人士',
    avatar: '💼',
    basePersonality: ['積極進取', '學習能力強', '偶感壓力', '追求成長'],
    suggestedOccupations: ['新鮮人', '實習生', '初級工程師', '業務新手', '職場菜鳥'],
    typicalChallenges: ['職場適應', '人際關係', '工作壓力', '技能不足', '職涯規劃'],
    recommendedCategories: ['guidance', 'petition', 'protection'],
    defaultStyle: 'casual'
  },
  {
    id: 'teenager',
    name: '青少年',
    description: '正值青春期的年輕人',
    avatar: '🧒',
    basePersonality: ['情感豐富', '尋找自我', '充滿夢想', '容易困惑'],
    suggestedOccupations: ['高中生', '國中生', '藝術學生', '運動員', '音樂愛好者'],
    typicalChallenges: ['自我認同', '同儕壓力', '學業壓力', '情感困擾', '未來焦慮'],
    recommendedCategories: ['confession', 'petition', 'guidance'],
    defaultStyle: 'casual'
  },
  {
    id: 'business-leader',
    name: '企業領導',
    description: '承擔領導責任的商業人士',
    avatar: '🤵',
    basePersonality: ['領導能力強', '決策果斷', '承擔責任', '追求成功'],
    suggestedOccupations: ['企業主', '高階主管', '部門經理', '創業家', '團隊領導'],
    typicalChallenges: ['決策壓力', '團隊管理', '商業競爭', '工作壓力', '道德考驗'],
    recommendedCategories: ['guidance', 'confession', 'gratitude'],
    defaultStyle: 'formal'
  },
  {
    id: 'healthcare-worker',
    name: '醫護人員',
    description: '致力於照顧他人健康的專業人士',
    avatar: '👩‍⚕️',
    basePersonality: ['富有同情心', '專業敬業', '承受壓力', '奉獻精神'],
    suggestedOccupations: ['醫師', '護理師', '藥師', '治療師', '醫護志工'],
    typicalChallenges: ['工作壓力', '情感負擔', '生死議題', '工時過長', '職業倦怠'],
    recommendedCategories: ['petition', 'protection', 'intercession'],
    defaultStyle: 'formal'
  },
  {
    id: 'creative-artist',
    name: '創意工作者',
    description: '從事創作和藝術的人士',
    avatar: '🎨',
    basePersonality: ['富有創意', '感性敏銳', '追求美感', '個性獨特'],
    suggestedOccupations: ['藝術家', '設計師', '音樂家', '作家', '創作者'],
    typicalChallenges: ['創作瓶頸', '經濟不穩', '市場認同', '靈感枯竭', '藝術理想'],
    recommendedCategories: ['guidance', 'gratitude', 'petition'],
    defaultStyle: 'casual'
  },
  {
    id: 'service-worker',
    name: '服務業工作者',
    description: '在服務業為他人提供服務的人士',
    avatar: '🛎️',
    basePersonality: ['服務熱忱', '人際能力強', '耐心友善', '工作勤奮'],
    suggestedOccupations: ['餐廳服務員', '銷售員', '客服人員', '導遊', '服務員'],
    typicalChallenges: ['客戶壓力', '工作時間長', '體力負擔', '情緒管理', '薪資待遇'],
    recommendedCategories: ['petition', 'protection', 'gratitude'],
    defaultStyle: 'casual'
  },
  {
    id: 'stay-at-home-parent',
    name: '全職家長',
    description: '專心照顧家庭的父母',
    avatar: '🏠',
    basePersonality: ['家庭第一', '犧牲奉獻', '細心照顧', '默默付出'],
    suggestedOccupations: ['全職媽媽', '全職爸爸', '家庭主婦', '育兒專家', '家庭管理者'],
    typicalChallenges: ['社交孤立', '自我價值', '經濟依賴', '育兒壓力', '個人時間'],
    recommendedCategories: ['intercession', 'gratitude', 'petition'],
    defaultStyle: 'formal'
  }
];

// 預設的性格特質選項
export const personalityOptions = [
  '積極樂觀', '溫和友善', '堅韌不拔', '富有同情心', '責任感強',
  '創意豐富', '理性務實', '感性敏銳', '領導能力強', '團隊合作',
  '好奇心強', '學習能力強', '適應力強', '耐心細心', '勇敢果斷',
  '謙遜低調', '外向活潑', '內向深思', '幽默風趣', '嚴謹認真',
  '寬容包容', '追求完美', '靈活變通', '專注專業', '熱心助人'
];

// 興趣愛好選項
export const interestOptions = [
  '閱讀寫作', '音樂藝術', '運動健身', '旅行探索', '烹飪美食',
  '攝影拍照', '園藝種植', '手工製作', '科技數位', '電影戲劇',
  '學習語言', '志工服務', '寵物照護', '收藏嗜好', '戶外活動',
  '社交聚會', '冥想靈修', '遊戲娛樂', '投資理財', '環保公益'
];

// 挑戰困難選項
export const challengeOptions = [
  '工作壓力', '經濟困難', '健康問題', '人際關係', '時間管理',
  '情緒管理', '自我懷疑', '未來焦慮', '學習困難', '溝通障礙',
  '家庭問題', '職涯發展', '生活平衡', '孤獨感', '決策困難',
  '創意瓶頸', '身體疲勞', '精神壓力', '社交恐懼', '完美主義'
];

// 職業選項
export const occupationOptions = [
  '學生', '教師', '醫師', '護理師', '工程師', '設計師', '程式設計師',
  '銷售員', '經理', '會計師', '律師', '記者', '藝術家', '音樂家',
  '廚師', '司機', '警察', '消防員', '農夫', '商人', '創業家',
  '志工', '退休人士', '家庭主婦', '自由工作者', '顧問', '治療師'
];

// 頭像選項
export const avatarOptions = [
  '👨', '👩', '🧑', '👦', '👧', '👴', '👵', '👨‍💼', '👩‍💼', '👨‍🏫', '👩‍🏫',
  '👨‍⚕️', '👩‍⚕️', '👨‍🔧', '👩‍🔧', '👨‍🍳', '👩‍🍳', '👨‍🎨', '👩‍🎨', '👨‍💻', '👩‍💻',
  '👨‍🚀', '👩‍🚀', '👨‍🚒', '👩‍🚒', '👮‍♂️', '👮‍♀️', '🕵️‍♂️', '🕵️‍♀️', '💂‍♂️', '💂‍♀️',
  '🥷', '👷‍♂️', '👷‍♀️', '🤴', '👸', '👳‍♂️', '👳‍♀️', '👲', '🧕', '🤵', '👰'
];

// 獲取角色模板
export function getCharacterTemplate(templateId: string): CharacterTemplate | undefined {
  return characterTemplates.find(template => template.id === templateId);
}

// 根據模板創建自訂角色的基礎數據
export function createCharacterFromTemplate(templateId: string, customData: Partial<any>): Partial<any> {
  const template = getCharacterTemplate(templateId);
  if (!template) return customData;

  return {
    avatar: template.avatar,
    personality: [...template.basePersonality],
    preferredCategories: [...template.recommendedCategories],
    prayerStyle: template.defaultStyle,
    commonNeeds: [...template.typicalChallenges],
    ...customData
  };
}
