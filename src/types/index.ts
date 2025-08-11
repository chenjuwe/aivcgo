export interface Prayer {
  id: string;
  content: string;
  category: PrayerCategory;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isFavorite: boolean;
  userId?: string; // 雲端用戶ID
  isShared?: boolean; // 是否公開分享
  syncStatus: 'synced' | 'pending' | 'error'; // 同步狀態
}

export type PrayerCategory = 
  | 'gratitude'    // 感恩
  | 'petition'     // 祈求
  | 'confession'   // 懺悔
  | 'praise'       // 讚美
  | 'intercession' // 代禱
  | 'protection'   // 保護
  | 'guidance';    // 引導

export interface PrayerRequest {
  category: PrayerCategory;
  specificNeeds?: string;
  length: 'short' | 'medium' | 'long';
  tone: 'formal' | 'casual' | 'traditional';
  characterId?: string; // 新增角色ID
}

export interface PrayerTemplate {
  category: PrayerCategory;
  templates: {
    opening: string[];
    body: string[];
    closing: string[];
  };
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultCategory: PrayerCategory;
  defaultLength: 'short' | 'medium' | 'long';
  defaultTone: 'formal' | 'casual' | 'traditional';
  enableNotifications: boolean;
  enableCloudSync: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface SharedPrayer {
  id: string;
  prayerId: string;
  sharedBy: string;
  sharedByName: string;
  sharedAt: Date;
  likes: number;
  isLikedByUser?: boolean;
}

export interface CloudSyncStatus {
  isOnline: boolean;
  lastSyncAt: Date | null;
  pendingUploads: number;
  pendingDownloads: number;
  syncError: string | null;
}

export interface CustomCharacter {
  id: string;
  name: string;
  description: string;
  avatar: string;
  background: string;
  personality: string[];
  age?: number;
  occupation?: string;
  location?: string;
  interests: string[];
  challenges: string[];
  preferredCategories?: PrayerCategory[];
  prayerStyle?: 'formal' | 'casual' | 'traditional';
  commonNeeds?: string[];
  customTemplates?: {
    [key in PrayerCategory]?: {
      opening: string[];
      body: string[];
      closing: string[];
    };
  };
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  isPublic: boolean;
}

export interface CharacterTemplate {
  id: string;
  name: string;
  description: string;
  avatar: string;
  basePersonality: string[];
  suggestedOccupations: string[];
  typicalChallenges: string[];
  recommendedCategories: PrayerCategory[];
  defaultStyle: 'formal' | 'casual' | 'traditional';
}

// 生成因子相關類型定義
export interface CharacterGenerationFactors {
  // 基礎人口統計
  demographics: {
    ageRange: { min: number; max: number };
    gender: string[];
    education: string[];
    maritalStatus: string[];
  };
  
  // 職業經濟
  occupationEconomy: {
    industries: Array<{
      name: string;
      roles: string[];
      id: string;
      code: string;
      codes: {
        NAICS: string[];
        ISIC: string[];
      };
      codesSummary: {
        ISCO: string[];
        SOC: string[];
      };
    }>;
    skillsMap: {
      languages: Array<{
        topic: string;
        level: string;
        rawLevel?: string;
      }>;
      technical: string[];
      soft: string[];
    };
  };
  
  // 人格特質
  personality: {
    dimensions: Array<{
      name: string;
      values: string[];
      weights?: Record<string, number>;
    }>;
    patterns: string[];
    communication: string[];
  };
  
  // 信仰系統（已移除於生成流程，保留類型空位以兼容其他模組）
  faith?: {
    background?: string[];
    practices?: string[];
    growth?: string[];
    community?: string[];
  };
  
  // 生活方式興趣
  lifestyleInterests: {
    hobbies: string[];
    languages: {
      communication: Array<{
        topic: string;
        level: string;
        rawLevel?: string;
      }>;
      cultural: string[];
    };
    activities: string[];
  };
  
  // 數位檔案
  digitalProfile: {
    techAdoption: string[];
    privacySettings: string[];
    digitalLiteracy: string[];
    devices: string[];
  };
  
  // 生成配置
  generationConfig: {
    distributions: Record<string, any>;
    rules: Record<string, any>;
    correlations: Record<string, any>;
  };
  
  // 能量曲線和參與模式
  factors: {
    energyCurve: {
      default: Record<string, number>;
      byIndustry: Record<string, Record<string, number>>;
    };
    participationMode: {
      enum: string[];
      defaultWeights: Record<string, number>;
      byIndustryBias: Record<string, Record<string, number>>;
    };
  };
}

// 擴展的 CustomCharacter 類型
export interface EnhancedCustomCharacter extends CustomCharacter {
  // 生成因子相關
  generationFactors?: Partial<CharacterGenerationFactors>;
  
  // 新增的詳細屬性
  detailedProfile?: {
    // 職業相關
    industry?: string;
    role?: string;
    experience?: number;
    skills?: string[];
    certifications?: string[];
    seniorityLevel?: string;
    
    // 個人特質
    personalityTraits?: Record<string, number>;
    communicationStyle?: string;
    learningStyle?: string;
    participationMode?: string;
    
    // 生活狀況
    familySituation?: string;
    livingArrangement?: string;
    financialStatus?: string;
    
    // 數位偏好
    techComfort?: string;
    privacyConcerns?: string;
    notificationPreferences?: string;
    
    // 時間管理
    scheduleType?: string;
    energyPattern?: string;
    availability?: string[];
  };
  
  // 生成元數據
  generationMeta?: {
    seed?: string;
    factors?: string[];
    version?: string;
    generatedAt?: Date;
  };
}

// 角色生成請求
export interface CharacterGenerationRequest {
  // 基礎偏好
  gender?: string;
  ageRange?: { min: number; max: number };
  occupation?: string;
  industry?: string;
  
  // 經濟狀況（可選）
  incomeRange?: '1~3萬' | '3~7萬' | '7~10萬' | '10~15萬' | '15~20萬' | '20萬+';
  financialHabit?: '節儉型' | '平衡型' | '消費型';
  charityGiving?: '定期奉獻' | '偶爾捐獻' | '特殊奉獻';

  // 家庭關係（可選）
  familyRelations?: {
    // 配偶簡項（多選標籤）
    spouseInfo?: (
      | '姓名年齡'
      | '職業背景'
      | '信仰狀況'
      | '教育程度'
      | '家庭背景'
      | '性格特質'
      | '興趣愛好'
      | '健康狀況'
      | '經濟狀況'
      | '社交圈'
      | '價值觀念'
      | '人生目標'
      | '相處模式'
      | '溝通方式'
      | '衝突處理'
    )[];

    // 配偶詳細資訊（輸入/下拉）
    spouseDetails?: {
      name?: string;
      age?: number;
      occupationBackground?: string;
      faithStatus?: '無' | '慕道友' | '初信者' | '穩定信徒' | '成熟信徒';
      educationLevel?: string; // 從 demographics.education 擇一
      familyBackground?: '基督徒家庭' | '傳統家庭' | '單親家庭' | '其他';
      personalityTrait?: string; // 從 personality.patterns 擇一
      interests?: string; // 從 lifestyle.hobbies 擇一
      healthStatus?: '健康' | '過敏' | '慢性疲勞' | '睡眠障礙' | '一般小病' | '其他';
      economicStatus?: '寬裕' | '穩定' | '壓力中' | '困難';
      socialCircle?: '家庭為主' | '教會為主' | '職場為主' | '廣泛社交' | '低社交';
      values?: '家庭至上' | '事業為重' | '信仰優先' | '自由獨立' | '社會關懷';
      lifeGoals?: '事業成功' | '家庭幸福' | '財務自由' | '社會貢獻' | '自我實現';
      relationshipMode?: '黏膩依賴' | '獨立自主' | '相互補型' | '平等合作';
      communicationStyle?: '直接坦率' | '婉轉含蓄' | '理性討論' | '情緒表達';
      conflictResolution?: '直接溝通' | '冷戰處理' | '妥協讓步' | '尋求仲裁';
    };

    marriageStage?:
      | '新婚蜜月期'
      | '穩定婚姻期'
      | '婚姻困難期'
      | '分居冷靜期'
      | '感情修復期'
      | '婚姻倦怠期'
      | '重燃愛火期'
      | '和諧相處期'
      | '互相扶持期'
      | '黃昏戀情'
      | '第二春'
      | '老夫老妻'
      | '金婚銀婚'
      | '鑽石婚'
      | '白金婚';
    meetingMethod?:
      | '教會認識'
      | '朋友介紹'
      | '職場戀情'
      | '網路交友'
      | '相親安排'
      | '同學同窗'
      | '鄰居鄰里'
      | '旅行邂逅'
      | '興趣社團'
      | '志工活動'
      | '運動健身'
      | '咖啡廳偶遇'
      | '圖書館相遇'
      | '醫院相識'
      | '意外相撞';
    childrenCount?: '不生族' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';
    childrenAgeDistribution?: Array<'嬰幼兒' | '學齡前' | '小學' | '中學' | '成年'>;
    parentingStyle?: '民主型' | '權威型' | '放任型' | '溺愛型';
    parentsStatus?: '健在' | '過世' | '離婚' | '分居';
    familyBackground?: '基督徒家庭' | '傳統家庭' | '單親家庭';
    siblingsRank?: string; // 排行（文字描述）
    siblingsCloseness?: string; // 關係親密度（文字或等級）
  };

  // 生理特徵與外貌（可選）
    physicalAppearance?: {
     // 體型特徵
     heightWeight?: string[]; // 身高體重
     bodyType?: string[];     // 體型分類
     bodyProportion?: string[]; // 身體比例
     // 擴充體型子項
     composition?: string[]; // 體脂/肌肉比例
     frameSize?: string[]; // 骨架大小
     bodyContour?: string[]; // 體型輪廓
     alignmentIssues?: string[]; // 姿勢/對齊（圓肩、頸前傾等）
     flexibility?: string[]; // 柔軟度
     athleticTendency?: string[]; // 運動能力傾向
     metabolismType?: string[]; // 代謝傾向
     dominantMuscleGroup?: string[]; // 肌群發達部位
     limbProportion?: string[]; // 四肢比例
     shoulderHipRatio?: string[]; // 肩臀比例
     gait?: string[]; // 步態
     gripStrength?: string[]; // 握力/力量等級
     breathingPattern?: string[]; // 呼吸型態
     thermoregulation?: string[]; // 體溫/流汗傾向
     weightTrend?: string[]; // 體重趨勢（半年）
     bmiBand?: string[]; // BMI 區間
     bodyFatBand?: string[]; // 體脂率區間
     // 外貌特色
     hairStyleColor?: string[];
     eyeFeatures?: string[];
     skinTexture?: string[];
     specialMarks?: string[];
     faceShape?: string[];
     eyebrowStyle?: string[];
     eyeShape?: string[];
     eyelash?: string[];
     eyewear?: string[];
     noseType?: string[];
     lipShape?: string[];
     beardStyle?: string[];
     hairVolume?: string[];
     hairTexture?: string[];
     skinUndertone?: string[];
     skinFeatures?: string[];
     facialFeatures?: string[];
     earAccessories?: string[];
     teethFeature?: string[];
     fragrance?: string[];
     tattooStyle?: string[];
     tattooPlacement?: string[];
     scarBirthmarkPlacement?: string[];
     nailStyle?: string[];
     makeupStyle?: string[];
     // 穿衣風格
     clothingType?: string[];
     stylePreference?: string[];
     accessoriesHabits?: string[];
     colorTone?: string[];
     patternPreference?: string[];
     fitCut?: string[];
     layering?: string[];
     material?: string[];
     seasonStyle?: string[];
     formality?: string[];
     shoeStyle?: string[];
     hatStyle?: string[];
     bagPreference?: string[];
     accessoryStyle?: string[];
     sustainability?: string[];
     brandOrientation?: string[];
     budgetLevel?: string[];
     signatureItem?: string[];
     styleIdentity?: string[];
     matchingHabit?: string[];
     accessoryApproach?: string[];
     // 身體習慣
     handedness?: string[];
     posture?: string[];
     gestures?: string[];
     sleepPattern?: string[];
     sleepPosition?: string[];
     wakeHabit?: string[];
     hydrationLevel?: string[];
     caffeineIntake?: string[];
     alcoholUse?: string[];
     smokingHabit?: string[];
     eatingRhythm?: string[];
     foodRestrictions?: string[];
     screenHabit?: string[];
     devicePosture?: string[];
     sittingStandingHabit?: string[];
     commuteMode?: string[];
     walkingPace?: string[];
     relaxationHabit?: string[];
     supplements?: string[];
     skincareSun?: string[];
     breathingHabit?: string[];
     postureAids?: string[];
     wearableDevices?: string[];
     waterBalance?: string[];
     speechHabit?: string[];
   };
  
  // 情感與愛情觀（可選）
  loveAndRomance?: {
    // 戀愛模式
    loveType?: '慢熱升溫型' | '一見鍾情型' | '理性分析型' | '感性衝動型' | '友情轉愛情' | '日久生情型' | '激情燃燒型' | '細水長流型' | '靈魂伴侶型' | '肉體吸引型' | '精神戀愛型' | '依賴共生型' | '獨立平等型' | '師生型' | '異地戀型';
    loveStyle?: '浪漫主義者' | '現實主義者' | '佔有慾強型' | '給予自由型' | '黏膩型戀人' | '獨立型戀人' | '控制型戀人' | '放任型戀人' | '傳統保守型' | '開放前衛型' | '完美主義型' | '隨遇而安型' | '競爭型戀人' | '合作型戀人' | '治癒型戀人';
    expression?: '直接坦白表達' | '含蓄暗示情意' | '行動證明愛意' | '語言甜蜜表達' | '書信文字傳情' | '禮物表達心意' | '時間陪伴表達' | '身體接觸表達' | '眼神傳遞愛意' | '默默守護表達' | '創意浪漫表達' | '實際行動表達' | '情歌表達' | '詩詞表達' | '科技表達';

    // 感情經歷
    experience?: '初戀青澀情結' | '豐富戀愛經驗' | '感情完全空白' | '嚴重創傷經歷' | '暗戀無數次' | '網戀經驗' | '異國戀經驗' | '辦公室戀情' | '學生時代戀愛' | '成年後初戀' | '閃婚經驗' | '長跑多年' | '同性戀經驗' | '雙性戀經驗' | '複雜三角戀';
    breakupReason?: '價值觀差異' | '遠距離問題' | '家庭反對' | '性格不合' | '第三者介入' | '經濟壓力' | '工作忙碌' | '溝通不良' | '信任破裂' | '個人成長' | '興趣不同' | '生活習慣' | '宗教信仰' | '未來規劃' | '性格成熟度';
    healingStyle?: '快速復原型' | '需要時間型' | '容易受傷型' | '理性面對型' | '沉浸痛苦型' | '報復心理型' | '逃避現實型' | '重新開始型' | '永不忘記型' | '成長轉化型' | '麻痺自己型' | '尋求治療型' | '朋友支持型' | '工作轉移型' | '時間治癒型';

    // 擇偶條件
    externalCriteria?: '外貌協會重視' | '身高要求嚴格' | '年齡偏好明確' | '經濟考量實際' | '體重要求' | '身材比例' | '穿著品味' | '社會地位' | '家庭背景' | '教育程度' | '職業聲望' | '收入水準' | '房車條件' | '外語能力' | '才藝技能';
    innerCriteria?: '性格相容度' | '價值觀一致' | '信仰共同點' | '智慧水準' | '幽默感' | '責任感' | '上進心' | '孝順程度' | '情商高低' | '溝通能力' | '包容度' | '穩定性' | '可靠度' | '誠實度' | '溫柔體貼';
    specialPreference?: '同齡交往' | '姐弟戀情' | '師生戀慕' | '異國戀情' | '職場戀愛' | '青梅竹馬' | '網友見面' | '相親介紹' | '朋友介紹' | '偶遇邂逅' | '重逢舊愛' | '一夜情轉戀' | '鄰居戀情' | '旅行邂逅' | '運動夥伴';

    // 關係維持
    relationshipMode?: '黏膩依賴型' | '獨立自主型' | '相互補型' | '良性競爭型' | '平等合作型' | '主導控制型' | '被動配合型' | '朋友戀人型' | '激情浪漫型' | '平淡溫馨型' | '衝突不斷型' | '和諧穩定型' | '刺激冒險型' | '安全舒適型' | '成長促進型';
    conflictStyle?: '直接溝通型' | '冷戰處理型' | '尋求仲裁型' | '逃避問題型' | '情緒爆發型' | '理性討論型' | '妥協讓步型' | '堅持己見型' | '尋求共識型' | '暫時分離型' | '第三方調解型' | '寫信溝通型' | '時間淡化型' | '道歉和解型' | '分手威脅型';
    futurePlan?: '婚姻導向型' | '享受過程型' | '恐婚傾向型' | '開放關係型' | '試婚同居型' | '遠距維持型' | '事業優先型' | '家庭第一型' | '子女計畫型' | '環遊世界型' | '創業合夥型' | '學習成長型' | '退休規劃型' | '財務規劃型' | '健康養生型';

    // 進階新增子項
    attachmentStyle?: '安全型' | '焦慮型' | '逃避型' | '矛盾混亂型';
    relationshipPace?: '快速確認' | '穩健推進' | '慢熱觀望' | '保持曖昧';
    commitmentExclusivity?: '早期排他' | '確認後排他' | '開放式關係' | '尚未設定';
    relationshipDefinition?: '自然默契' | '正式告白' | '共同討論' | '儀式化約定';

    communicationFrequency?: '高頻即時' | '每日聯繫' | '週幾次' | '需要空間';
    communicationPreference?: '文字訊息' | '語音通話' | '視訊' | '面對面';
    conflictRepairTiming?: '立即處理' | '冷靜後再談' | '第三方協助' | '書面整理';
    apologyStyle?: '承擔責任' | '彌補行動' | '情感共鳴' | '承諾改變' | '論理澄清';
    jealousySensitivity?: '低' | '中' | '高' | '條件式';
    trustBuilding?: '預設信任' | '驗證後信任' | '積分累積' | '情境信任';

    privacyBoundary?: '手機全開放' | '局部分享' | '私領域保留' | '嚴格保護';
    socialPublicity?: '高調放閃' | '適度分享' | '低調' | '不公開';

    dateStyle?: '儀式感' | '生活系' | '探索冒險' | '文藝靜態' | '運動戶外';
    dateFrequency?: '每天' | '每週多次' | '每週一次' | '雙週一次' | '視情況';
    togetherTimeRatio?: '高度共處' | '平衡共處與獨處' | '高度獨處需求';
    publicIntimacy?: '高' | '中' | '低' | '視場合';
    weekendPreference?: '宅家共處' | '戶外出遊' | '社交聚會' | '分頭安排';

    cohabitationView?: '傾向同居' | '觀察後同居' | '婚後同居' | '不同居';
    houseworkDivision?: '明確分工' | '擅長者負責' | '平均輪替' | '外包';
    moneyArrangement?: 'AA' | '比例分擔' | '一人負擔' | '共同基金';
    giftBudget?: '小而精' | '儀式感為主' | '實用至上' | '高價紀念';

    familyBoundaryWithOrigin?: '密切融合' | '適度往來' | '清晰邊界' | '低頻互動';
    meetParentsAttitude?: '盡早' | '穩定後' | '結婚前' | '視情況';
    exBoundary?: '斷聯' | '基本禮貌' | '保持朋友' | '仍有互動';

    longDistanceTolerance?: '低' | '中' | '高';
    longDistanceMeetCycle?: '每週' | '每月' | '雙月' | '季度';

    marriageView?: '必經之路' | '視緣分' | '可有可無' | '不婚主義';
    fertilityView?: '想要' | '視情況' | '保持開放' | '不要';
    parentingDivisionView?: '平等共擔' | '傾向一方主負' | '家庭支援導向' | '外包導向';

    intimacyBoundary?: '明確界線' | '彈性調整' | '需事先討論' | '視情況';
    sexualOpenness?: '保守' | '適中' | '開放';
    sexualFrequencyExpectation?: '低' | '中' | '高';

    securityTriggers?: '失聯' | '訊息冷淡' | '隱瞞' | '批評' | '與異性互動';
    ritualImportance?: '高' | '中' | '低';
    sharedRituals?: '例行約會日' | '旅行儀式' | '紀念日策劃' | '家庭聚餐';
    petViewRelationship?: '同養意願高' | '視時機' | '僅個人飼養' | '不考慮';
    timeExpectation?: '高共處' | '平衡' | '高自由度';
  };

  // 生活方式與興趣（可選）
  lifestyleAndInterests?: {
    // 日常生活習慣
    dailyRhythm?: '早上6點起床' | '晚上11點睡覺' | '午休習慣' | '夜貓子作息' | '規律三餐';
    eatingHabit?: '素食主義' | '地中海飲食' | '低碳飲食' | '間歇性斷食' | '愛吃甜食' | '有機食品';
    exerciseHabit?: '每日散步' | '跑步健身' | '游泳運動' | '瑜伽練習' | '重量訓練' | '不愛運動';
    livingEnvironment?: '市中心公寓' | '郊區透天' | '租屋族' | '與家人同住' | '獨居生活' | '極簡風格';

    wakeUpRoutine?: '早起拉伸' | '冥想' | '閱讀' | '手沖咖啡' | '晨跑' | '靜默時光';
    nightRoutine?: '熱水澡' | '輕閱讀' | '手帳/反思' | '藍光阻隔' | '冥想' | '音樂助眠';
    mealPattern?: '三餐固定' | '兩餐制' | '少量多餐' | '宵夜習慣';
    cookingFrequency?: '每日開伙' | '偶爾開伙' | '週末開伙' | '多半外食';
    snackHabit?: '幾乎不吃' | '下午茶固定' | '晚間小點' | '隨手零食';
    sugarIntake?: '無糖' | '低糖' | '中等' | '偏高';
    hydrationHabit?: '水壺隨身' | '定時提醒' | '渴了才喝' | '常忘記';
    homeTidiness?: '極簡整潔' | '規律整理' | '物品偏多' | '隨性雜亂';
    cleaningSchedule?: '每日打掃' | '每週整理' | '隔週整理' | '視需要';
    laundryRoutine?: '每日小洗' | '每週集中' | '外送洗衣' | '與室友分工';
    groceryStyle?: '每日採買' | '每週採買' | '線上下單' | '大賣場補貨';
    workMode?: '在辦公室' | '混合' | '完全遠端' | '彈性工時';
    timeManagement?: '行事曆控' | '待辦清單控' | '番茄鐘' | '當日隨心';
    budgetingRoutine?: '每日記帳' | '每週記帳' | '不記帳' | '自動分帳';
    ecoHabit?: '自備餐具杯' | '隨手關燈節電' | '節水' | '垃圾分類嚴格';
    socialRhythm?: '每日小聚' | '每週聚會' | '獨處為主' | '家庭時光';
    mediaConsumption?: '每日閱讀' | '每日播客' | '每日影集' | '週末追劇';
    hobbySlot?: '早晨練習' | '午休時段' | '下班後' | '週末固定';
    petCareRoutine?: '早晚散步' | '定時餵食' | '定期梳毛' | '無';
    plantCareRoutine?: '每日澆水' | '週期澆水' | '噴霧保養' | '低維護';
    wardrobePrep?: '前晚備衣' | '早晨即興' | '膠囊衣櫥' | '依行程調整';
    travelPrepStyle?: '極簡打包' | '清單規劃' | '臨時打包' | '模組化收納';

    // 興趣愛好與技能
    artInterest?: '古典音樂' | '流行音樂' | '繪畫藝術' | '攝影技術' | '書法' | '手工藝' | '數位藝術';
    sportsInterest?: '游泳' | '慢跑' | '登山健行' | '球類運動' | '瑜伽' | '騎腳踏車' | '跳舞' | '武術';
    learningInterest?: '程式設計' | '數據分析' | '語言學習' | '投資理財' | '心理學' | '歷史研究';
    socialInterest?: '聚餐' | '旅遊' | '志工服務' | '社團活動' | '讀書會' | '才藝班';

    // 興趣技能擴充
    musicInstrument?: '吉他' | '鋼琴' | '小提琴' | '鼓組' | '薩克斯風' | '唱歌/合唱';
    culinarySkill?: '家常菜' | '異國料理' | '甜點烘焙' | '咖啡手沖' | '調酒';
    craftSkill?: '編織' | '木工' | '金工' | '陶藝' | '皮革' | '手作香氛';
    photographyStyle?: '人像' | '風景' | '街拍' | '旅拍' | '微距' | '影像後製';
    readingGenre?: '文學' | '推理' | '商管' | '心理' | '科幻' | '歷史' | '漫畫/輕小說';
    writingStyle?: '散文' | '小說' | '詩歌' | '影評' | '影像腳本' | '文案';
    performingArts?: '戲劇' | '舞蹈' | '即興' | '魔術' | '相聲/單口喜劇';
    creativeSoftware?: 'PS' | 'AI' | 'Figma' | 'Blender' | 'After Effects';
    codingStack?: '前端' | '後端' | '資料分析' | '手機開發' | '遊戲開發' | 'AI/ML';
    boardgamePreference?: '德式策略' | '派對' | '合作類' | '卡牌對戰' | '團隊推理';
    gamingGenre?: 'RPG' | 'FPS' | 'MOBA' | '模擬經營' | '音樂節奏' | '獨立遊戲';
    sportsDiscipline?: '重訓' | 'HIIT' | '皮拉提斯' | '攀岩' | '跑步' | '自行車' | '球類專項';
    outdoorHobby?: '露營' | '登山' | '溯溪' | '潛水' | '攝鳥' | '攝星';
    travelStyle?: '背包客' | '美食旅遊' | '文化深度' | '奢華度假' | '自駕' | '攝影行程';
    gardeningStyle?: '多肉' | '香草' | '花卉' | '蔬果' | '水培' | '造景';
    petTraining?: '服從訓練' | '敏捷訓練' | '社會化' | '護理保養';
    volunteeringFocus?: '教育' | '環保' | '動保' | '長者' | '兒少' | '社區';
    investingStyle?: '指數被動' | '價值投資' | '成長動能' | '固收' | '加密資產';
    publicSpeaking?: '演講' | '主持' | '朗讀' | '辯論' | '直播/Podcast';
    leadershipRole?: '社團幹部' | '專案統籌' | '跨域協作' | '指導/Mentor';
    diyMaker?: '3D列印' | 'Arduino/Raspberry Pi' | '居家修繕' | '車輛改裝';
    collectingHobby?: '公仔模型' | '球鞋' | '黑膠/CD' | '書籍' | '香水' | '咖啡器具';
    learningMode?: '線上課程' | '實體工作坊' | '自學計畫' | '社群共學';
    engagementFrequency?: '每日' | '每週' | '每月' | '季節性';
    proficiencyLevel?: '入門' | '進階' | '熟練' | '專精';

    // 語言能力
    nativeLanguage?: '中文母語' | '台語流利' | '客家話母語' | '原住民語學習中';
    foreignLanguage?: '英文流利' | '日文中級' | '韓文初級' | '多語言天才' | '商業英文優秀';
    communicationFeature?: '國際溝通無障礙' | '專業英文優秀' | '本土語言熟練';

    // 數位科技使用
    techProducts?: '智慧型手機重度使用' | '平板電腦愛好' | '智慧手錶健康' | 'VR虛擬實境';
    onlineBehavior?: '資訊搜尋' | '社交互動' | '娛樂消費' | '學習進修' | '購物比價' | '創作分享';
    socialMedia?: 'Facebook重度使用' | 'Instagram愛好者' | 'YouTube訂閱狂' | 'TikTok創作者';
    digitalLiteracy?: '隱私保護' | '資安意識' | '假訊息辨識' | '網路禮儀';

    // 社會參與
    communityParticipation?: '社區委員會' | '鄰里活動' | '環境清潔' | '治安巡守' | '文化活動';
    environmentalAwareness?: '垃圾分類' | '資源回收' | '減塑生活' | '節能省電' | '綠色交通';
    volunteerService?: '教育支援' | '長者關懷' | '兒童照護' | '寵物救助' | '災難救助';

    // 健康狀況
    generalHealth?: '健康' | '過敏' | '慢性疲勞' | '偏頭痛' | '睡眠障礙';
    chronicDisease?: '高血壓' | '糖尿病' | '心臟病' | '氣喘' | '關節炎' | '甲狀腺異常';
    mentalHealth?: '憂鬱症' | '焦慮症' | '躁鬱症' | '強迫症' | 'PTSD' | 'ADHD';
    severeDisease?: '癌症康復中' | '中風後遺症' | '帕金森氏症' | '多發性硬化症';
    addictionIssue?: '藥物成癮' | '酒精成癮' | '菸癮' | '網路成癮';
    specialCondition?: '視力聽力受損' | '色盲' | '妥瑞氏症' | '自閉症類群障礙';

    // 交通工具
    publicTransport?: '捷運' | '公車' | '自行車' | '步行';
    scooterType?: 'Gogoro' | '光陽GP125';
    carType?: 'Toyota Altis' | 'Honda CR-V' | 'Mercedes-Benz' | 'BMW' | 'Porsche' | 'Tesla';

    commutePrimaryMode?: '捷運' | '公車' | '火車/高鐵' | '自行車' | '機車' | '汽車自駕' | '步行' | '共乘/計程車' | '公司接駁';
    multiModalHabit?: '只單一' | '雙模轉乘' | '三模以上' | '視情況';
    commuteDistance?: '<5km' | '5-15km' | '15-40km' | '>40km';
    commuteTimeBand?: '早高峰' | '晚高峰' | '離峰' | '彈性';
    drivingStyle?: '穩健' | '節能' | '靈活積極' | '謹慎保守';
    carSegment?: 'Hatchback' | 'Sedan' | 'SUV' | 'MPV/7人座' | 'Wagon' | 'Coupe/敞篷' | 'Pickup';
    carPowertrain?: '汽油' | '柴油' | '油電HEV' | '插電PHEV' | '純電BEV';
    carTransmission?: '自排' | '手排' | '手自排';
    carUseScenario?: '都市代步' | '跨縣市通勤' | '露營長途' | '商務應酬' | '家庭接送';
    evChargingHabit?: '家用慢充' | '公司/社區充電' | '超充為主' | '公共慢充' | '不適用';
    carBrandOrientation?: '日系' | '德系' | '美系' | '韓系' | '中國/新創' | '無特定';
    motorcycleType?: '速克達125/150' | '大羊' | '檔車' | '都會輕檔' | '電動機車';
    microMobility?: '電輔自行車' | '共享單車' | '電動滑板車' | '直排輪/滑板';
    taxiRideshare?: '多使用' | '偶爾' | '幾乎不用' | 'Uber' | '計程車';
    railPreference?: '高鐵常用' | '台鐵常用' | '城際巴士常用' | '視行程';
    publicPass?: '定期票' | '季票' | '學生票' | '商務票' | '無';
    navigationApp?: 'Google Maps' | 'Apple Maps' | 'Waze' | '車機原生';
    parkingPreference?: '路邊' | '立體停車場' | '月租車位' | '共用車位';
    safetyPriority?: '高' | '中' | '低';
    maintenanceHabit?: '原廠定保' | '技師保養' | '自行保養' | '隨用隨修';
    insuranceCoverage?: '強制+第三責任' | '乙式' | '甲式全險' | '依需求';
    carpoolHabit?: '常共乘' | '偶爾共乘' | '不共乘';
    ecoTransportCommitment?: '優先公共運輸' | '每月無車日' | '減碳里程目標' | '無特別';
    airTravelFrequency?: '每月' | '每季' | '每年' | '罕見';
  };

  // 心理與情感（可選）
  psychologyAndEmotion?: {
    // 情緒狀態
    positiveEmotion?: '樂觀開朗' | '穩定平和' | '熱情洋溢' | '充滿希望' | '積極正向' | '溫和親切' | '活潑開朗' | '沉著冷靜' | '溫暖體貼' | '自信從容' | '幽默風趣' | '純真善良' | '堅韌不拔' | '富有同情心' | '充滿活力';
    negativeEmotion?: '容易焦慮' | '情緒起伏大' | '憂鬱傾向' | '容易沮喪' | '多愁善感' | '急躁易怒' | '悲觀消極' | '情緒化' | '易受挫折' | '內心脆弱' | '情緒壓抑' | '過度敏感' | '情緒不穩' | '容易絕望' | '心情陰鬱';
    emotionTrait?: '敏感細膩' | '冷靜理性' | '內心堅強' | '情緒穩定' | '內向安靜' | '外向健談' | '情感豐富' | '理智務實' | '感性浪漫' | '情緒複雜' | '直覺敏銳' | '邏輯清晰' | '富有想像力' | '現實主義' | '理想主義';

    // 情緒補充與量表
    emotionEnergy?: '低' | '中' | '高' | '起伏不定';
    emotionStability?: '穩定' | '中等' | '易波動';
    stressTolerance?: '低' | '中' | '高';
    emotionAwareness?: '低' | '中' | '高' | '元認知強';
    expressionIntensity?: '內斂' | '適中' | '強烈';
    expressionChannel?: '言語' | '肢體' | '創作' | '行動' | '沉默';
    resilienceRecovery?: '快速' | '中等' | '較慢';
    diurnalMoodPattern?: '晨間佳' | '夜間佳' | '午後低潮' | '無明顯';
    socialAffect?: '社交亢奮' | '社交耗竭' | '視場合' | '穩定';
    emotionTriggers?: '批評' | '時間壓力' | '噪音' | '混亂' | '衝突' | '社交';
    warningSigns?: '心跳加速' | '肩頸緊繃' | '胃部不適' | '手心出汗' | '呼吸急促';
    sensitiveTopics?: '家庭' | '工作' | '金錢' | '關係' | '評價' | '自我價值';
    safetyAnchors?: '規律' | '關係支持' | '掌控感' | '價值/信念' | '穩定環境';
    affectionNeed?: '低' | '中' | '高';
    affectiveBias?: '災難化' | '過度概化' | '讀心' | '貼標籤' | '非黑即白';
    flowProneness?: '容易進入' | '偶爾' | '少見';

    positiveEmotionPlus?: '滿足' | '平靜' | '感恩' | '敬畏' | '投入' | '安適' | '踏實' | '專注' | '輕鬆' | '自在';
    negativeEmotionPlus?: '羞愧' | '罪惡感' | '緊繃' | '擔憂' | '恐懼' | '孤獨' | '無力' | '倦怠' | '厭世';

    // 情緒管理方式
    regulationBodyMind?: '深呼吸冥想' | '運動發洩' | '音樂療癒' | '獨處思考' | '專業諮商';
    socialSupport?: '找朋友聊天' | '宗教信仰' | '家人支持';
    creativeExpression?: '寫日記抒發' | '藝術創作' | '料理烹飪' | '園藝活動';
    attentionShift?: '閱讀' | '購物療法' | '旅行放鬆' | '寵物陪伴';

    // 壓力反應
    stressPhysiological?: '失眠多夢' | '食慾不振' | '暴飲暴食' | '頭痛頭暈' | '肌肉緊張';
    stressPsychological?: '容易發怒' | '注意力不集中' | '記憶力下降' | '情緒低落' | '焦慮不安';
    stressBehavioral?: '社交退縮' | '過度工作' | '拖延逃避' | '強迫行為';

    // 自信程度
    selfConfidenceHigh?: '非常自信' | '過度自信' | '盲目自信' | '表面自信' | '領袖氣質' | '自信滿滿' | '氣場強大' | '天生自信' | '魅力自信' | '霸氣自信';
    selfConfidenceMedium?: '適度自信' | '情境性自信' | '謙虛自信' | '理性自信' | '平衡自信' | '穩定自信' | '內斂自信' | '成熟自信' | '溫和自信' | '實事求是';
    selfConfidenceLow?: '缺乏自信' | '自我懷疑' | '需要鼓勵' | '容易動搖' | '自卑敏感' | '畏畏縮縮' | '膽小怯懦' | '依賴他人' | '害怕表現' | '逃避挑戰';

    // 愛的語言
    loveLanguageWords?: '讚美鼓勵' | '言語支持' | '口語表達愛意' | '正面評價' | '感謝表達' | '欣賞認同' | '言語安慰' | '口頭承諾' | '甜言蜜語' | '激勵話語';
    loveLanguageTime?: '專注陪伴' | '深度對話' | '高品質時光' | '全心投入' | '共同活動' | '獨處時光' | '傾聽理解' | '心靈交流' | '共同經歷' | '陪伴支持';
    loveLanguageGifts?: '禮物表達' | '紀念意義' | '心意體現' | '驚喜禮物' | '實用禮品' | '手作禮物' | '昂貴禮物' | '簡單心意' | '節日禮物' | '收藏品';
    loveLanguageService?: '實際幫助' | '具體行動' | '主動服務' | '分擔家務' | '解決問題' | '照顧需求' | '默默付出' | '實用支援' | '貼心服務' | '行動證明';
    loveLanguageTouch?: '擁抱安慰' | '牽手表達' | '親密接觸' | '溫暖觸碰' | '肢體語言' | '撫摸安撫' | '親吻示愛' | '身體親近' | '觸覺表達' | '物理連結';

    // 個人特色
    backgroundStory?: '夢想開咖啡廳' | '學習樂器' | '搖滾樂迷' | '環遊世界計畫';
    personalSecret?: '暗戀同事' | '童年願望' | '創業失敗經歷' | '珍貴回憶';
    habitualAction?: '思考時轉筆' | '緊張咬指甲' | '說話比手勢' | '聽音樂打拍子';
    representativeItem?: '特別的書' | '家人項鍊' | '音樂盒' | '舊照片' | '手寫信件';
    specialExperience?: '國際志工' | '背包旅行' | '救災活動' | '街頭表演' | '環保抗議';
  };

  // 人格特質系統（可選）
  personalitySystem?: {
    // 正面特質
    strengthCharacter?: '誠實' | '善良' | '耐心' | '謙遜' | '勇敢' | '有同理心' | '責任感強';
    strengthSocial?: '友善' | '幽默' | '領導力' | '同理心' | '溝通能力佳' | '善於傾聽';
    strengthWork?: '勤奮' | '創新' | '負責任' | '團隊合作' | '學習能力強' | '解決問題';
    strengthSpiritual?: '信心' | '盼望' | '愛心' | '智慧' | '樂觀積極' | '堅持不懈';

    // 負面特質
    weaknessCharacter?: '急躁' | '固執' | '自私' | '驕傲' | '過於完美主義' | '優柔寡斷';
    weaknessEmotion?: '焦慮' | '憂鬱' | '易怒' | '敏感' | '容易情緒化' | '社交恐懼';
    weaknessBehavior?: '拖延' | '完美主義' | '控制慾' | '容易分心' | '工作狂傾向';
    weaknessInterpersonal?: '內向' | '不信任' | '溝通困難' | '過度依賴他人' | '缺乏自信';

    // 人生觀與價值觀
    worldviewLife?: '享受當下' | '未來導向' | '家庭至上' | '事業為重' | '平衡發展';
    worldviewMoney?: '節儉儲蓄' | '理性投資' | '及時行樂' | '金錢是工具不是目標';
    worldviewWork?: '實現自我價值' | '謀生手段' | '工作生活平衡' | '服務他人';
    worldviewPolitics?: '中立不表態' | '關心社會議題' | '支持環保' | '重視教育改革';

    // 人生目標與規劃
    goalsShortTerm?: '買房置產' | '學習新技能' | '轉換職業' | '投資理財';
    goalsLongTerm?: '事業成功' | '家庭幸福' | '財務自由' | '環遊世界' | '社會貢獻';
    goalsAchievement?: '專業證照' | '馬拉松完賽' | '學會外語' | '創業成功' | '出版作品';
    motto?: '活在當下' | '永不放棄' | '知足常樂' | '助人為樂' | '相信自己';

    // 深層負面特質（負面人物專用）
    deepNegativeEmotion?: '長期低落' | '被遺棄感' | '對未來恐懼' | '內心憤怒' | '深度自卑' | '嫉妒怨恨' | '恐懼親密' | '自我懷疑' | '絕望缺乏動力' | '內心空虛';
    darkPersonality?: '表面和善私下說壞話' | '操控他人' | '經常撒謊' | '對弱者冷漠' | '自戀受害者心態' | '報復記仇' | '缺乏同理心' | '情緒勒索';
    addictionBehavior?: '網路成癮' | '社群媒體成癮' | '遊戲成癮' | '酒精依賴' | '藥物依賴' | '尼古丁依賴' | '咖啡因依賴' | '購物成癮' | '工作成癮' | '賭博傾向' | '運動成癮' | '完美主義成癮';
    relationshipProblems?: '無法維持長期關係' | '吸引不適合伴侶' | '過度依賴/獨立' | '無法表達情感' | '與家人衝突' | '職場關係緊張' | '缺乏界限';
    traumaImpact?: '霸凌經歷' | '父母離婚' | '被拋棄經歷' | '家暴陰影' | '職場霸凌' | '意外事故' | '被詐騙經歷' | '重大疾病' | '破產經歷';
    selfDestructiveBehavior?: '破壞關係' | '自我設限' | '拖延重要事情' | '選擇有害伴侶' | '用酒精逃避' | '拒絕幫助' | '故意製造衝突' | '放棄機會';
    socialAdaptationDifficulty?: '無法適應潛規則' | '對權威反抗' | '無法團隊合作' | '社交極度不自在' | '在群體邊緣化' | '對變化抗拒';
    innerConflict?: '渴望親密卻害怕受傷' | '想要成功但害怕失敗' | '想要改變但抗拒行動' | '需要幫助但拒絕求助';
    negativeCopingMechanism?: '用憤怒掩蓋脆弱' | '用幽默化解嚴肅' | '用冷漠保護自己' | '透過工作逃避' | '用忙碌掩蓋孤獨' | '透過討好獲得認同';
    hiddenFear?: '害怕被發現真實自己' | '恐懼死亡無意義' | '害怕孤獨終老' | '害怕被拋棄' | '恐惧親密傷害' | '害怕愛人離開';
    negativeBeliefSystem?: '相信世界不公平' | '認為充滿危險威脅' | '相信努力沒意義' | '認為注定失敗' | '不值得好事物' | '永遠不夠好' | '孤獨是宿命';
  };

  // 認知與學習風格（可選）
  cognitiveAndLearning?: {
    // 思維模式
    thinkingType?: '邏輯思維' | '直覺思維' | '創意思維' | '批判思維';
    analysisStyle?: '系統性分析' | '跳躍性思考' | '細節導向' | '大局觀';
    problemSolving?: '理性分析' | '經驗依賴' | '創新嘗試' | '團隊討論';

    // 學習風格
    learningPreference?: '視覺型學習' | '聽覺型學習' | '動覺型學習' | '讀寫型學習';
    learningPace?: '快速學習' | '慢工細活' | '間歇性學習' | '持續性學習';
    learningMotivation?: '興趣驅動' | '目標導向' | '競爭激勵' | '自我實現';

    // 記憶特點
    memoryType?: '記憶力超強' | '選擇性記憶' | '情感記憶深刻' | '容易健忘';
    memoryMethod?: '視覺記憶' | '聽覺記憶' | '動作記憶' | '聯想記憶';
    forgettingPattern?: '快速遺忘' | '長期記憶' | '創傷記憶' | '美化記憶';

    // 決策風格
    decisionSpeed?: '衝動決策' | '謹慎分析' | '猶豫不決' | '拖延決策';
    decisionBasis?: '理性分析' | '直覺感受' | '他人意見' | '經驗法則';
    riskAttitude?: '冒險精神' | '風險規避' | '計算風險' | '風險盲目';
  };

  // 情緒智商與社交能力（可選）
  emotionalSocialSkills?: {
    // 情商表現
    empathyAbility?: '同理心超強' | '情緒共感' | '理解困難' | '冷漠疏離';
    emotionAwareness?: '敏感細膩' | '情緒遲鈍' | '自我覺察強' | '投射他人';
    emotionRegulation?: '情緒穩定' | '情緒起伏' | '壓抑情緒' | '情緒爆發';

    // 社交技巧
    communicationSkill?: '幽默風趣' | '談吐優雅' | '言語犀利' | '木訥寡言';
    listeningSkill?: '專注傾聽' | '選擇性傾聽' | '急於表達' | '心不在焉';
    conflictHandling?: '化解高手' | '迴避衝突' | '激化矛盾' | '理性調解';

    // 人際邊界
    boundarySetting?: '清楚界限' | '模糊邊界' | '過度保護' | '容易被利用';
    interpersonalDistance?: '親密無間' | '保持距離' | '選擇性親近' | '防禦心強';
    trustBuilding?: '容易信任' | '謹慎信任' | '信任困難' | '盲目信任';

    // 領導特質
    leadershipStyle?: '天生領袖' | '民主領導' | '威權領導' | '服務型領導';
    teamRole?: '領導者' | '協調者' | '執行者' | '創意發想' | '跟隨者';
    influenceType?: '魅力影響' | '專業權威' | '人際影響' | '職位權力';
  };

  // 價值觀與道德觀（可選）
  valuesMorality?: {
    // 道德標準
    moralDemand?: '嚴格自律' | '寬鬆標準' | '雙重標準' | '情境道德';
    principleAdherence?: '原則性強' | '彈性調整' | '見風轉舵' | '無明確原則';
    moralJudgment?: '黑白分明' | '灰色地帶' | '相對主義' | '絕對主義';

    // 正義感
    justiceExpression?: '強烈正義感' | '明哲保身' | '同情弱者' | '崇拜強者';
    fairnessView?: '絕對公平' | '程序公正' | '結果公平' | '關係公平';
    socialResponsibility?: '社會參與' | '個人主義' | '集體利益' | '自我保護';

    // 利他傾向
    dedicationSpirit?: '無私奉獻' | '互惠互利' | '自我優先' | '機會主義';
    helpingMotivation?: '純粹善意' | '互相幫助' | '獲得認同' | '道德義務';
    sacrificeWillingness?: '自我犧牲' | '適度付出' | '保護自己' | '利己主義';

    // 誠信程度
    honestyLevel?: '絕對誠實' | '善意謊言' | '策略隱瞞' | '習慣撒謊';
    commitmentFulfillment?: '言出必行' | '盡力而為' | '選擇性履行' | '輕易承諾';
    transparencyLevel?: '開放透明' | '選擇性公開' | '保護隱私' | '神秘主義';
  };

  // 人生哲學與靈性觀（可選）
  lifePhilosophyAndSpirituality?: {
    // 存在意義
    lifeGoal?: '追求成就' | '享受過程' | '服務他人' | '自我實現';
    lifeValue?: '事業成功' | '家庭幸福' | '個人成長' | '社會貢獻';
    meaningSource?: '宗教信仰' | '人際關係' | '個人成就' | '自然和諧';

    // 時間觀念
    timeAttitude?: '活在當下' | '未來導向' | '懷念過去' | '時間焦慮';
    timeManagement?: '精確計畫' | '彈性安排' | '隨性而為' | '時間混亂';
    pacePreference?: '快節奏' | '慢節奏' | '張弛有度' | '節奏不定';

    // 命運觀
    fateBelief?: '命中注定' | '人定勝天' | '隨遇而安' | '悲觀宿命';
    senseOfControl?: '掌控人生' | '順其自然' | '外在歸因' | '內在歸因';
    changeAttitude?: '擁抱變化' | '抗拒改變' | '適應變化' | '恐懼變化';

    // 死亡觀
    deathAttitude?: '恐懼死亡' | '接受死亡' | '好奇死後' | '否認死亡';
    lifeDeathView?: '珍惜生命' | '及時行樂' | '死後世界' | '輪迴轉世';
    legacyConcept?: '物質遺產' | '精神遺產' | '無遺產觀' | '負面遺產';
  };

  // 行為習慣與個人怪癖（可選）
  behaviorHabitsAndQuirks?: {
    // 日常儀式
    morningRoutine?: '晨間運動' | '咖啡儀式' | '新聞閱讀' | '冥想靜心';
    workRitual?: '工作前準備' | '休息習慣' | '專注技巧' | '收尾習慣';
    bedtimeHabit?: '閱讀入睡' | '音樂放鬆' | '護膚保養' | '祈禱感恩';
    stressRelief?: '散步思考' | '音樂療癒' | '運動發洩' | '創作表達';

    // 個人怪癖
    collectingHobby?: '書籍收集' | '音樂收集' | '文具控' | '模型愛好';
    compulsiveBehavior?: '完美主義' | '重複檢查' | '對稱強迫' | '清潔強迫';
    superstitiousBehavior?: '數字迷信' | '顏色禁忌' | '風水信念' | '占卜依賴';
    specialHobby?: '極限運動' | '古董收藏' | '手作DIY' | '遊戲沉迷';

    // 說話特色
    languageHabit?: '口頭禪' | '語速特徵' | '音量控制' | '語調變化';
    expressionStyle?: '直接坦率' | '婉轉含蓄' | '幽默風趣' | '嚴肅正經';
    dialectUsage?: '國語標準' | '台語流利' | '英語穿插' | '方言混合';
    communicationMode?: '多話健談' | '沉默寡言' | '選擇性發言' | '情緒表達';

    // 非語言行為
    eyeContact?: '直視交流' | '迴避眼神' | '銳利眼神' | '溫柔眼神';
    personalSpace?: '親近距離' | '保持距離' | '空間敏感' | '空間侵犯';
    touchHabit?: '喜歡擁抱' | '避免接觸' | '握手習慣' | '肢體語言豐富';
    postureLanguage?: '自信姿態' | '謙遜姿態' | '緊張姿態' | '放鬆姿態';
  };

  // 文化適應與國際觀（可選）
  culturalAdaptationAndGlobalView?: {
    // 文化開放度
    diversityInclusion?: '文化好奇' | '開放接納' | '主動學習' | '尊重差異';
    culturalRigidity?: '傳統堅持' | '變化抗拒' | '本土優先' | '外來排斥';
    selectiveAcceptance?: '挑選接納' | '實用主義' | '條件開放' | '部分認同';
    culturalConflict?: '價值衝突' | '認同困惑' | '適應困難' | '排斥反應';

    // 國際視野
    globalThinking?: '國際視野' | '跨文化理解' | '全球公民意識' | '普世價值';
    localism?: '在地優先' | '文化保護' | '傳統維護' | '本土認同';
    culturalRelativism?: '尊重差異' | '情境理解' | '多元觀點' | '包容並蓄';
    ethnocentrism?: '本族優越' | '文化偏見' | '刻板印象' | '排外傾向';

    // 語言態度
    languageTalent?: '語言學習快' | '發音準確' | '語感敏銳' | '多語轉換';
    languageBarrier?: '學習困難' | '發音問題' | '表達障礙' | '理解困難';
    dialectPreference?: '母語驕傲' | '方言堅持' | '標準語偏好' | '語言純化';
    foreignLanguageLearning?: '積極學習' | '被動學習' | '功利學習' | '恐懼抗拒';

    // 旅行偏好
    adventureTravel?: '探索未知' | '挑戰極限' | '深度體驗' | '文化沉浸';
    comfortTravel?: '奢華享受' | '輕鬆休閒' | '服務品質' | '安全保障';
    culturalExploration?: '歷史古蹟' | '博物館' | '當地文化' | '人文交流';
    natureProximity?: '山川美景' | '生態旅遊' | '戶外活動' | '環境保護';
  };

  // 消費心理與物質觀（可選）
  consumptionPsychologyAndMaterialView?: {
    // 購物動機
    shoppingNeeds?: '實用主義' | '理性消費' | '功能優先' | '必需品購買';
    shoppingEmotion?: '壓力購物' | '心情購物' | '衝動消費' | '情感慰藉';
    shoppingSocial?: '地位象徵' | '品牌展示' | '社會認同' | '身份標識';
    shoppingCollection?: '興趣收集' | '投資收藏' | '完整性追求' | '專業收藏';

    // 品牌態度
    brandLoyalty?: '品牌迷戀' | '忠誠消費' | '品牌信任' | '重複購買';
    valueForMoney?: '理性比較' | '價值評估' | '實用導向' | '經濟考量';
    localBrand?: '本土支持' | '文化認同' | '品質信任' | '情感連結';
    antiCommercial?: '反品牌' | '反消費' | '簡約生活' | '非物質主義';

    // 物質慾望
    minimalism?: '斷捨離' | '必需品' | '質量重於數量' | '精神富足';
    materialEnjoyment?: '品質生活' | '奢華品味' | '生活品質' | '物質滿足';
    luxuryLove?: '頂級品牌' | '限量收藏' | '身份地位' | '品味象徵';
    ecoConsumption?: '永續消費' | '環保意識' | '二手購買' | '循環經濟';

    // 金錢安全感
    savingTendency?: '未雨綢繆' | '安全第一' | '風險規避' | '長期規劃';
    monthToMonth?: '即時享樂' | '花光薪水' | '無儲蓄習慣' | '金錢焦慮';
    investmentRisk?: '高風險投資' | '積極理財' | '財富增值' | '投機心理';
    moneyFear?: '貧窮恐懼' | '金錢焦慮' | '過度節儉' | '安全感不足';
  };

  // 適應能力與心理彈性（可選）
  adaptationAndPsychFlex?: {
    // 變化適應
    embraceChange?: '變化興奮' | '新鮮感' | '適應快速' | '靈活調整';
    resistChange?: '穩定偏好' | '變化恐懼' | '習慣依賴' | '保守堅持';
    strongAdaptability?: '環境適應' | '角色轉換' | '學習能力' | '復原力強';
    changeAnxiety?: '不確定恐懼' | '控制需求' | '變化壓力' | '適應困難';

    // 壓力耐受
    highPressureTolerance?: '壓力免疫' | '挑戰接受' | '冷靜應對' | '壓力轉化';
    stressSensitive?: '壓力易感' | '焦慮反應' | '身心症狀' | '壓力放大';
    stressTransformation?: '壓力動力' | '成長機會' | '創意催化' | '能量轉換';
    stressAvoidance?: '逃避面對' | '否認壓力' | '轉移注意' | '消極應對';

    // 創新程度
    innovationPioneer?: '創新領導' | '早期採用' | '突破傳統' | '變革推動';
    steadyFollower?: '觀察學習' | '穩定跟進' | '風險評估' | '謹慎創新';
    conservativeTraditional?: '傳統堅持' | '變化抗拒' | '經驗依賴' | '穩定優先';
    innovationFear?: '新事物恐懼' | '失敗恐懼' | '安全依賴' | '變化排斥';

    // 學習彈性
    lifelongLearning?: '持續成長' | '知識渴望' | '自我更新' | '適應變化';
    fixedMindset?: '思維僵化' | '學習抗拒' | '經驗固著' | '改變困難';
    selectiveLearning?: '興趣導向' | '實用學習' | '選擇性接受' | '目標明確';
    learningResistance?: '學習恐懼' | '能力懷疑' | '舒適圈依賴' | '挑戰逃避';
  };

  // 特殊經歷與成就（可選）
  specialExperienceAndAchievements?: {
    // 人生成就
    academicAchievement?: '學術獎項' | '研究發表' | '升學成功';
    careerAchievement?: '升職加薪' | '創業成功' | '專業認證';
    serviceAchievement?: '志工經歷' | '社會貢獻' | '慈善活動';
    personalAchievement?: '技能習得' | '興趣專精' | '個人突破';

    // 特殊經歷
    travelExperience?: '國際志工' | '背包旅行' | '文化交流';
    challengeExperience?: '馬拉松比賽' | '登山探險' | '極限運動';
    serviceExperience?: '偏鄉教學' | '災難救助' | '環保活動';
    creativeExperience?: '街頭表演' | '藝術創作' | '媒體參與';

    // 背景故事
    dreamStory?: '開咖啡廳' | '環遊世界' | '學習樂器';
    interestStory?: '搖滾樂迷' | '天文愛好' | '桌遊收藏';
    learningStory?: '多語能力' | '釀酒技術' | '古董修復';
    collectionStory?: '攝影作品' | '動漫文化' | '登山裝備';
  };

  // 生成因子權重
  factorWeights?: {
    personality?: number;
    faith?: number;
    lifestyle?: number;
    digital?: number;
    career?: number;
  };
  
  // 特定需求
  specificNeeds?: string[];
  prayerFocus?: string[];
  
  // 生成選項
  seed?: string;
  diversity?: number;
  realism?: number;
  seniorityLevel?: 'intern' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director';
  
  // 排除項目
  excludeTraits?: string[];
  excludeOccupations?: string[];

  // 使用者自由多選偏好（每一個導向）
  selectedOptions?: {
    demographics?: {
      education?: string[];
      maritalStatus?: string[];
    };
    personality?: {
      patterns?: string[];
      communication?: string[];
    };
    faith?: {
      background?: string[];
      practices?: string[];
      growth?: string[];
      community?: string[];
    };
    lifestyle?: {
      hobbies?: string[];
      activities?: string[];
    };
    digital?: {
      devices?: string[];
      techAdoption?: string[];
      privacySettings?: string[];
    };
    career?: {
      // roles?: string[]; // 已移除偏好角色（依所選產業）
    };
    factors?: {
      participationMode?: string[];
      energyPattern?: string[];
    };
  };
}
