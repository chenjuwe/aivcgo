import { PrayerCategory } from '../types';

export interface CharacterProfile {
  id: string;
  name: string;
  description: string;
  avatar: string;
  background: string;
  personality: string[];
  preferredCategories: PrayerCategory[];
  prayerStyle: 'formal' | 'casual' | 'traditional';
  commonNeeds: string[];
  specialTemplates: {
    [key in PrayerCategory]?: {
      opening: string[];
      body: string[];
      closing: string[];
    };
  };
}

export const characterProfiles: CharacterProfile[] = [
  {
    id: 'young-student',
    name: '小明 - 年輕學生',
    description: '一位充滿活力的大學生，正在為學業和未來努力奮鬥',
    avatar: '🎓',
    background: '20歲的大學生，主修資訊工程，熱愛學習新知識，但也面臨課業壓力和未來選擇的焦慮',
    personality: ['積極樂觀', '求知慾強', '有時焦慮', '重視友情'],
    preferredCategories: ['petition', 'guidance', 'gratitude'],
    prayerStyle: 'casual',
    commonNeeds: ['考試順利', '智慧增長', '友誼美好', '未來方向', '壓力釋放'],
    specialTemplates: {
      petition: {
        opening: [
          '親愛的天父，我是小明，今天帶著學生的心來到您面前',
          '全能的神，作為一個年輕人，我需要您的幫助',
          '慈愛的主，我在學習的路上遇到了挑戰'
        ],
        body: [
          '求您賜給我智慧，讓我能夠理解複雜的課程內容',
          '求您幫助我在考試中發揮最佳狀態',
          '求您指引我選擇正確的人生道路',
          '求您讓我與同學們建立真誠的友誼',
          '求您給我勇氣面對未來的不確定性'
        ],
        closing: [
          '相信您會陪伴我走過求學的每一天，阿們',
          '感謝您對年輕人的愛與關懷，阿們'
        ]
      }
    }
  },
  {
    id: 'working-mother',
    name: '美惠 - 職業媽媽',
    description: '一位兼顧事業與家庭的現代女性，充滿愛心但也承受著多重壓力',
    avatar: '👩‍💼',
    background: '35歲的行銷經理，有兩個孩子（8歲和5歲），努力平衡工作與家庭生活',
    personality: ['責任感強', '充滿愛心', '偶爾疲憊', '堅韌不拔'],
    preferredCategories: ['intercession', 'petition', 'gratitude'],
    prayerStyle: 'formal',
    commonNeeds: ['家庭和睦', '工作順利', '孩子健康', '時間管理', '內心平安'],
    specialTemplates: {
      intercession: {
        opening: [
          '慈愛的天父，我是美惠，作為母親和職業女性來到您面前',
          '全能的神，我為我所愛的家人向您代求',
          '憐憫的主，我將我的家庭交託在您手中'
        ],
        body: [
          '求您保護我的孩子們身心靈健康成長',
          '求您賜給我先生工作上的智慧和順利',
          '求您讓我們的家庭充滿愛與和諧',
          '求您幫助我在工作中發揮專業能力',
          '求您賜給我足夠的體力和耐心照顧家人'
        ],
        closing: [
          '將我們全家交託在您慈愛的看顧中，阿們',
          '感謝您賜給我美好的家庭，阿們'
        ]
      }
    }
  },
  {
    id: 'elderly-grandfather',
    name: '志明爺爺 - 退休長者',
    description: '一位慈祥的退休教師，有著豐富的人生閱歷和深厚的信仰根基',
    avatar: '👴',
    background: '68歲的退休國中老師，已信主40多年，有3個兒女和5個孫子，身體偶有小恙但精神矍鑠',
    personality: ['智慧長者', '溫和慈祥', '經驗豐富', '信仰堅定'],
    preferredCategories: ['praise', 'gratitude', 'intercession'],
    prayerStyle: 'traditional',
    commonNeeds: ['身體健康', '家族興旺', '智慧傳承', '平安喜樂', '見證分享'],
    specialTemplates: {
      praise: {
        opening: [
          '永在的上帝，我是您的僕人志明，來到您面前敬拜讚美',
          '全能的主，我要為您在我生命中的作為獻上頌讚',
          '榮耀的神，我以感恩的心來到您面前'
        ],
        body: [
          '您是我一生的牧者，從年輕到如今都看顧著我',
          '您賜給我美滿的家庭和可愛的孫子們',
          '您讓我在教育崗位上服務了一生，影響無數學子',
          '您的恩典夠我用，您的慈愛永不止息',
          '您是我們家族的磐石和避難所'
        ],
        closing: [
          '願我餘生都能榮耀您的聖名，阿們',
          '感謝您賜給我豐盛的人生，阿們'
        ]
      }
    }
  },
  {
    id: 'young-professional',
    name: '建華 - 新鮮人',
    description: '剛踏入職場的社會新鮮人，對未來充滿期待但也感到壓力',
    avatar: '👨‍💻',
    background: '24歲的軟體工程師，剛從大學畢業半年，正在適應職場生活和人際關係',
    personality: ['上進心強', '略顯緊張', '渴望成長', '重視認同'],
    preferredCategories: ['guidance', 'petition', 'protection'],
    prayerStyle: 'casual',
    commonNeeds: ['工作適應', '人際關係', '專業成長', '情緒管理', '未來規劃'],
    specialTemplates: {
      guidance: {
        opening: [
          '智慧的神，我是建華，在人生的新階段需要您的指引',
          '全知的主，我在職場中感到迷茫，請您指教我',
          '慈愛的天父，我需要您的智慧來面對工作挑戰'
        ],
        body: [
          '求您幫助我快速適應職場環境和工作節奏',
          '求您賜給我智慧處理複雜的人際關係',
          '求您讓我在專業技能上不斷進步',
          '求您教導我如何平衡工作與生活',
          '求您為我的職業發展開路'
        ],
        closing: [
          '相信您會引導我走正確的道路，阿們',
          '感謝您在我人生每個階段的帶領，阿們'
        ]
      }
    }
  },
  {
    id: 'teenage-girl',
    name: '小雨 - 青春少女',
    description: '正值青春期的高中女生，敏感細膩，對世界充滿好奇和夢想',
    avatar: '👧',
    background: '16歲的高中二年級學生，喜歡音樂和藝術，有時會為人際關係和自我認同而煩惱',
    personality: ['敏感細膩', '富有創意', '情緒豐富', '渴望理解'],
    preferredCategories: ['confession', 'petition', 'gratitude'],
    prayerStyle: 'casual',
    commonNeeds: ['自我認同', '人際和諧', '情緒穩定', '夢想實現', '家庭理解'],
    specialTemplates: {
      confession: {
        opening: [
          '親愛的天父，我是小雨，帶著青春期的困惑來到您面前',
          '全能的神，我知道我還年輕，有很多不成熟的地方',
          '慈愛的主，我想要誠實地向您承認我的軟弱'
        ],
        body: [
          '求您原諒我有時對父母的不耐煩和頂嘴',
          '求您赦免我對同學的嫉妒和比較心理',
          '求您洗淨我內心的驕傲和自私',
          '求您幫助我學會寬恕和理解別人',
          '求您讓我成為一個更好的人'
        ],
        closing: [
          '謝謝您的寬恕，請繼續塑造我的品格，阿們',
          '願我能在您的愛中健康成長，阿們'
        ]
      }
    }
  },
  {
    id: 'middle-aged-businessman',
    name: '志強 - 中年企業家',
    description: '事業有成但面臨中年危機的企業主，開始思考人生意義和價值',
    avatar: '👨‍💼',
    background: '45歲的公司老闆，事業成功但感到空虛，最近開始思考信仰和人生意義',
    personality: ['成功導向', '內心空虛', '開始反思', '尋求意義'],
    preferredCategories: ['confession', 'guidance', 'gratitude'],
    prayerStyle: 'formal',
    commonNeeds: ['人生意義', '內心平安', '家庭關係', '事業方向', '靈性成長'],
    specialTemplates: {
      confession: {
        opening: [
          '聖潔的神，我是志強，一個在世俗中迷失的人',
          '公義的主，我承認我過去只追求物質成功',
          '慈愛的天父，我現在明白我需要您的救贖'
        ],
        body: [
          '求您赦免我過去只顧賺錢而忽略家人的罪',
          '求您原諒我在商場上的自私和貪婪',
          '求您洗淨我內心的驕傲和虛榮',
          '求您幫助我重新建立正確的價值觀',
          '求您讓我學會用愛來對待員工和客戶'
        ],
        closing: [
          '感謝您的恩典讓我重新認識人生的意義，阿們',
          '願我的事業能榮耀您的名，阿們'
        ]
      }
    }
  }
];

// 根據角色獲取個人化禱告模板
export function getCharacterPrayerTemplate(
  characterId: string, 
  category: PrayerCategory
): { opening: string[]; body: string[]; closing: string[] } | null {
  const character = characterProfiles.find(c => c.id === characterId);
  if (!character || !character.specialTemplates[category]) {
    return null;
  }
  return character.specialTemplates[category]!;
}

// 根據角色生成個人化禱告
export function generateCharacterPrayer(
  characterId: string,
  category: PrayerCategory,
  specificNeeds?: string,
  length: 'short' | 'medium' | 'long' = 'medium'
): string | null {
  const character = characterProfiles.find(c => c.id === characterId);
  if (!character) return null;

  const template = character.specialTemplates[category];
  if (!template) return null;

  // 隨機選擇開頭
  const opening = template.opening[Math.floor(Math.random() * template.opening.length)];
  
  // 根據長度選擇主體內容數量
  const bodyCount = length === 'short' ? 2 : length === 'medium' ? 3 : 4;
  
  const bodyParts = [];
  const availableBody = [...template.body];
  
  for (let i = 0; i < bodyCount && availableBody.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableBody.length);
    bodyParts.push(availableBody.splice(randomIndex, 1)[0]);
  }
  
  // 如果有特殊需求，加入自定義內容
  if (specificNeeds?.trim()) {
    const customRequest = specificNeeds.startsWith('求您') 
      ? specificNeeds 
      : `特別求您${specificNeeds}`;
    bodyParts.push(customRequest);
  }
  
  // 隨機選擇結尾
  const closing = template.closing[Math.floor(Math.random() * template.closing.length)];
  
  // 組合禱告內容
  const prayerParts = [opening, ...bodyParts, closing];
  return prayerParts.join('。\n\n') + '。';
}

// 獲取角色推薦的禱告需求
export function getCharacterRecommendations(characterId: string): string[] {
  const character = characterProfiles.find(c => c.id === characterId);
  return character ? character.commonNeeds : [];
}

// 獲取所有角色列表
export function getAllCharacters(): CharacterProfile[] {
  return characterProfiles;
}
