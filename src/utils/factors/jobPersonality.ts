export type JobPersonalityRequirement = {
  category: string;
  requiredTraits: string[];
  beneficialTraits: string[];
  challengingTraits: string[];
  mbtiSuitability: string[];
  workEnvironment?: string;
  stressFactors: string[];
};

// 摘要自舊版 js/character-enhanced.js 的職業因子，並補充與當前角色池對齊的鍵名
export const JOB_PERSONALITY_REQUIREMENTS: Record<string, JobPersonalityRequirement> = {
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
  'UI/UX 設計師': {
    category: '科技類',
    requiredTraits: ['創意思維', '同理心', '美感', '溝通能力'],
    beneficialTraits: ['用戶思維', '技術理解', '迭代思維'],
    challengingTraits: ['缺乏創意', '不重視美感', '無法同理'],
    mbtiSuitability: ['INFP', 'ISFP', 'ENFP', 'INFJ'],
    workEnvironment: '跨團隊合作',
    stressFactors: ['需求變更', '技術限制', '用戶反饋']
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
  '業務經理': {
    category: '商業類',
    requiredTraits: ['溝通能力', '說服力', '抗壓性', '人際技巧'],
    beneficialTraits: ['外向社交', '樂觀積極', '競爭意識'],
    challengingTraits: ['極度內向', '社交恐懼', '缺乏自信', '害怕拒絕'],
    mbtiSuitability: ['ENFJ', 'ENFP', 'ESTJ', 'ESTP'],
    workEnvironment: '高度人際互動',
    stressFactors: ['業績壓力', '客戶關係', '市場變化']
  },
  '財務分析師': {
    category: '商業類',
    requiredTraits: ['邏輯思維', '細心謹慎', '風險意識', '數字敏感'],
    beneficialTraits: ['分析能力', '責任感', '客觀判斷'],
    challengingTraits: ['粗心大意', '不喜歡數字', '風險盲目'],
    mbtiSuitability: ['INTJ', 'ISTJ', 'INTP', 'ESTJ'],
    workEnvironment: '數據分析環境',
    stressFactors: ['準確性要求', '時間壓力', '決策責任']
  }
};

// 角色名稱映射到職業需求鍵（將常見的細分職稱映射為較廣義的鍵）
const ROLE_TO_REQ_KEY: Array<[RegExp, string]> = [
  [/^(前端工程師|後端工程師|全端工程師|行動裝置工程師|DevOps|站點可靠性工程師|雲端|資安|嵌入式|測試)/, '軟體工程師'],
  [/^資料科學家/, '資料科學家'],
  [/^UI\/UX\s*設計師/, 'UI/UX 設計師'],
  [/^(行銷|公關|活動企劃)/, '行銷專員'],
  [/^(業務|銷售)/, '業務經理'],
  [/^(財務|投資|風險|分析)/, '財務分析師']
];

export function resolveJobRequirementKey(role: string): string | null {
  for (const [pattern, key] of ROLE_TO_REQ_KEY) {
    if (pattern.test(role)) return key;
  }
  // 直接匹配同名鍵
  if (JOB_PERSONALITY_REQUIREMENTS[role]) return role;
  return null;
}

export function getJobRequirement(role: string): JobPersonalityRequirement | null {
  const key = resolveJobRequirementKey(role);
  return key ? JOB_PERSONALITY_REQUIREMENTS[key] : null;
} 