import { 
  CharacterGenerationFactors, 
  CharacterGenerationRequest, 
  EnhancedCustomCharacter
} from '../types';
import bundle from './data/character_profile_bundle_v2.6.16f2.json';
import { getJobRequirement } from './factors/jobPersonality';

// 預設生成因子（作為外部 JSON 轉換失敗或缺欄位時的後備）
const DEFAULT_GENERATION_FACTORS: CharacterGenerationFactors = {
  demographics: {
    ageRange: { min: 18, max: 80 },
    gender: ['男性', '女性', '非二元', '跨性別男性', '跨性別女性', '雙性/間性', '不便透露', '其他'],
    education: [
      '國小畢業', '國中畢業', '高中畢業', '高職畢業', '五專畢業', '專科畢業',
      '二技畢業', '大學肄業', '大學畢業', '在職專班', '碩士肄業', '碩士學位',
      '博士肄業', '博士學位', '博士後研究', '軍警院校', '技職體系（乙丙級證）',
      '自學成才（MOOC/證書）', '海外交換/雙聯學位', '夜間部/進修學校'
    ],
    maritalStatus: [
      '單身未婚', '穩定交往', '訂婚準備', '新婚蜜月', '已婚多年', '婚姻美滿',
      '婚姻平淡', '婚姻困難', '分居中', '分居未離婚', '離婚未再婚', '離婚已再婚',
      '喪偶未再婚', '喪偶已再婚', '同居關係', '事實婚', '開放關係', '遠距關係',
      '靈性伴侶', '暫不定義關係'
    ]
  },
  
  occupationEconomy: {
    industries: [
      {
        name: '科技業',
        roles: [
          '前端工程師', '後端工程師', '全端工程師', '行動裝置工程師', '資料工程師',
          '資料科學家', 'AI/機器學習工程師', '演算法工程師', 'DevOps/站點可靠性工程師',
          '雲端架構師', '資安工程師', '系統管理員', '產品經理（PM）', '技術產品經理（TPM）',
          'UI/UX 設計師', '測試/自動化測試工程師', '嵌入式韌體工程師', '資料視覺化工程師',
          '區塊鏈開發者', 'IT 技術支援（Helpdesk）'
        ],
        id: 'IND-001',
        code: 'CUST-TECH',
        codes: { NAICS: ['51', '54', '334'], ISIC: ['J', 'M 62-63', 'C 26'] },
        codesSummary: {
          ISCO: ['2120', '2141', '2421', '2512', '2522', '2523', '2529', '3512'],
          SOC: ['13-1111', '15-1212', '15-1232', '15-1241', '15-1244', '15-1252', '15-1257', '15-2051', '17-2112']
        }
      },
      {
        name: '醫療業',
        roles: [
          '內科醫師', '外科醫師', '家庭醫學科醫師', '牙醫師', '中醫師', '護理師/護理長',
          '藥師/藥劑師', '物理治療師', '職能治療師', '臨床心理師', '諮商心理師', '營養師',
          '放射師', '醫學檢驗師', '呼吸治療師', '公共衛生專員', '醫療個案管理師',
          '醫療資訊管理師', '醫療管理/院務行政', '獸醫師'
        ],
        id: 'IND-002',
        code: 'CUST-HEALTH',
        codes: { NAICS: ['62'], ISIC: ['Q 86-88'] },
        codesSummary: {
          ISCO: ['1342', '2211', '2212', '2221', '2230', '2250', '2261', '2262', '2263', '2264', '2265', '2269', '2634', '3211', '3212', '3252', '3259', '3412'],
          SOC: ['11-9111', '19-1041', '19-3033', '21-1093', '29-1021', '29-1031', '29-1051', '29-1122', '29-1123', '29-1126', '29-1131']
        }
      },
      {
        name: '教育業',
        roles: [
          '幼兒園教師', '國小教師', '國中教師', '高中教師', '大學教授', '技職教師',
          '特殊教育教師', '語言教師', '音樂教師', '美術教師', '體育教師', '輔導教師',
          '圖書館員', '教育行政', '教育研究員', '課程設計師', '教育科技專員'
        ],
        id: 'IND-003',
        code: 'CUST-EDU',
        codes: { NAICS: ['61'], ISIC: ['P 85'] },
        codesSummary: {
          ISCO: ['2340', '2350', '2351', '2352', '2353', '2354', '2355', '2356', '2359', '2631', '2632', '2633', '2634', '2635', '2636'],
          SOC: ['25-1000', '25-2000', '25-3000', '25-4000', '25-9000']
        }
      },
      {
        name: '服務業',
        roles: [
          '客服專員', '銷售代表', '業務經理', '行銷專員', '公關專員', '活動企劃',
          '旅遊顧問', '餐飲服務', '零售店員', '美容師', '健身教練', '諮詢顧問'
        ],
        id: 'IND-004',
        code: 'CUST-SERVICE',
        codes: { NAICS: ['44-45', '71-72', '81'], ISIC: ['G', 'I', 'N', 'R', 'S'] },
        codesSummary: {
          ISCO: ['3320', '3330', '3340', '3350', '3360', '3370', '3380', '3390', '3410', '3420', '3430', '3440', '3450', '3460', '3470', '3480', '3490'],
          SOC: ['35-0000', '39-0000', '41-0000', '43-0000', '47-0000', '49-0000', '51-0000', '53-0000']
        }
      }
    ],
    skillsMap: {
      languages: [
        { topic: '中文', level: 'C2', rawLevel: '母語' },
        { topic: '英文', level: 'B2', rawLevel: '流利' },
        { topic: '日文', level: 'B1', rawLevel: '中級' },
        { topic: '韓文', level: 'A2', rawLevel: '基礎' }
      ],
      technical: ['程式設計', '資料分析', '專案管理', '設計軟體', '辦公軟體'],
      soft: ['溝通協調', '團隊合作', '問題解決', '時間管理', '領導能力']
    }
  },
  
  personality: {
    dimensions: [
      {
        name: '外向性',
        values: ['內向', '偏內向', '中性', '偏外向', '外向'],
        weights: { '內向': 0.15, '偏內向': 0.25, '中性': 0.3, '偏外向': 0.2, '外向': 0.1 }
      },
      {
        name: '開放性',
        values: ['保守', '偏保守', '中性', '偏開放', '開放'],
        weights: { '保守': 0.1, '偏保守': 0.2, '中性': 0.4, '偏開放': 0.2, '開放': 0.1 }
      },
      {
        name: '盡責性',
        values: ['隨性', '偏隨性', '中性', '偏盡責', '盡責'],
        weights: { '隨性': 0.1, '偏隨性': 0.2, '中性': 0.3, '偏盡責': 0.3, '盡責': 0.1 }
      }
    ],
    patterns: ['完美主義', '樂觀主義', '悲觀主義', '現實主義', '理想主義'],
    communication: ['直接', '委婉', '幽默', '嚴肅', '鼓勵性', '分析性']
  },
  
  faith: {
    background: ['基督教', '天主教', '東正教', '新教', '無特定信仰', '其他宗教'],
    practices: ['每日禱告', '週日禮拜', '讀經', '小組聚會', '服事', '奉獻'],
    growth: ['初信', '成長中', '成熟', '領袖', '導師'],
    community: ['教會成員', '小組長', '執事', '長老', '牧師', '傳道']
  },
  
  lifestyleInterests: {
    hobbies: ['閱讀', '運動', '音樂', '旅行', '烹飪', '手工藝', '攝影', '園藝'],
    languages: {
      communication: [
        { topic: '中文', level: 'C2', rawLevel: '母語' },
        { topic: '英文', level: 'B2', rawLevel: '流利' }
      ],
      cultural: ['中華文化', '西方文化', '日本文化', '韓國文化']
    },
    activities: ['戶外活動', '室內活動', '社交活動', '獨處活動', '學習活動']
  },
  
  digitalProfile: {
    techAdoption: ['早期採用者', '早期多數', '晚期多數', '落後者'],
    privacySettings: ['高度重視', '一般重視', '不太重視', '無所謂'],
    digitalLiteracy: ['專家級', '進階', '中級', '基礎', '初學者'],
    devices: ['智慧型手機', '平板電腦', '筆記型電腦', '桌上型電腦', '智慧手錶']
  },
  
  generationConfig: {
    distributions: {},
    rules: {},
    correlations: {}
  },
  
  factors: {
    energyCurve: {
      default: { morning: 0.35, afternoon: 0.45, evening: 0.2 },
      byIndustry: {
        '科技業': { morning: 0.3, afternoon: 0.45, evening: 0.25 },
        '醫療業': { morning: 0.45, afternoon: 0.4, evening: 0.15 },
        '服務業': { morning: 0.25, afternoon: 0.45, evening: 0.3 },
        '教育業': { morning: 0.4, afternoon: 0.45, evening: 0.15 }
      }
    },
    participationMode: {
      enum: ['lurker', 'reactor', 'commenter', 'contributor', 'organizer'],
      defaultWeights: { lurker: 0.35, reactor: 0.25, commenter: 0.2, contributor: 0.15, organizer: 0.05 },
      byIndustryBias: {
        '科技業': { contributor: 0.05, organizer: 0.02 },
        '教育業': { commenter: 0.06, contributor: 0.04 }
      }
    }
  }
};

// 從外部 JSON bundle 建立實際使用的 GENERATION_FACTORS，缺欄位時用預設補齊
function mapBundleToGenerationFactors(json: any): CharacterGenerationFactors | null {
  try {
    const demographics = json?.basicInfo?.demographics;
    const industries = json?.occupationEconomy?.industries as CharacterGenerationFactors['occupationEconomy']['industries'] | undefined;
    const skillsMapRaw = json?.occupationEconomy?.skillsMap;
    const personalityCommunication = json?.personality?.interpersonal?.communicationStyle as string[] | undefined;
    const factors = json?.factors;

    const mapped: CharacterGenerationFactors = {
      demographics: {
        ageRange: demographics?.ageRange ?? DEFAULT_GENERATION_FACTORS.demographics.ageRange,
        gender: demographics?.gender ?? DEFAULT_GENERATION_FACTORS.demographics.gender,
        education: demographics?.education ?? DEFAULT_GENERATION_FACTORS.demographics.education,
        maritalStatus: demographics?.maritalStatus ?? DEFAULT_GENERATION_FACTORS.demographics.maritalStatus,
      },
      occupationEconomy: {
        industries: industries && industries.length ? industries : DEFAULT_GENERATION_FACTORS.occupationEconomy.industries,
        skillsMap: {
          languages: (skillsMapRaw?.languages ?? DEFAULT_GENERATION_FACTORS.occupationEconomy.skillsMap.languages).map((l: any) => ({
            topic: l.topic ?? l.name ?? '未知',
            level: l.level ?? 'B2',
            rawLevel: l.rawLevel,
          })),
          technical: skillsMapRaw?.hardSkills ?? DEFAULT_GENERATION_FACTORS.occupationEconomy.skillsMap.technical,
          soft: skillsMapRaw?.softSkills ?? DEFAULT_GENERATION_FACTORS.occupationEconomy.skillsMap.soft,
        }
      },
      personality: {
        dimensions: DEFAULT_GENERATION_FACTORS.personality.dimensions, // 若需要可根據 bigFive 轉換，先用預設
        patterns: DEFAULT_GENERATION_FACTORS.personality.patterns,
        communication: personalityCommunication ?? DEFAULT_GENERATION_FACTORS.personality.communication,
      },
      faith: DEFAULT_GENERATION_FACTORS.faith, // JSON 結構差異較大，先沿用預設集合
      lifestyleInterests: DEFAULT_GENERATION_FACTORS.lifestyleInterests, // 可日後映射 JSON 內對應欄位
      digitalProfile: DEFAULT_GENERATION_FACTORS.digitalProfile, // 可日後映射 JSON 內對應欄位
      generationConfig: {
        distributions: json?.distributions ?? {},
        rules: json?.rules ?? {},
        correlations: json?.correlations ?? {},
      },
      factors: {
        energyCurve: {
          default: factors?.energyCurve?.default ?? DEFAULT_GENERATION_FACTORS.factors.energyCurve.default,
          byIndustry: factors?.energyCurve?.byIndustry ?? DEFAULT_GENERATION_FACTORS.factors.energyCurve.byIndustry,
        },
        participationMode: {
          enum: factors?.participationMode?.enum ?? DEFAULT_GENERATION_FACTORS.factors.participationMode.enum,
          defaultWeights: factors?.participationMode?.defaultWeights ?? DEFAULT_GENERATION_FACTORS.factors.participationMode.defaultWeights,
          byIndustryBias: factors?.participationMode?.byIndustryBias ?? DEFAULT_GENERATION_FACTORS.factors.participationMode.byIndustryBias,
        }
      }
    };

    return mapped;
  } catch {
    return null;
  }
}

const GENERATION_FACTORS: CharacterGenerationFactors = mapBundleToGenerationFactors(bundle as any) ?? DEFAULT_GENERATION_FACTORS;

// 實用函式
function createRng(seed?: string | number) {
  if (seed === undefined || seed === null || seed === '') {
    return Math.random;
  }
  let s = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) >>> 0;
  return function rng() {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleWeighted<T extends { weight?: number }>(arr: T[], rnd: () => number): T {
  if (!arr.length) throw new Error('sampleWeighted: empty array');
  let total = 0;
  for (const it of arr) total += (it.weight ?? 1);
  let r = rnd() * (total || 1);
  for (const it of arr) {
    r -= (it.weight ?? 1);
    if (r <= 0) return it;
  }
  return arr[arr.length - 1];
}

function sampleFromArray<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

// 主要生成函式
export function generateCharacterProfile(request: CharacterGenerationRequest): EnhancedCustomCharacter {
  const rng = createRng(request.seed);
  
  // 生成基礎人口統計
  const gender = request.gender || sampleFromArray(GENERATION_FACTORS.demographics.gender, rng);
  const age = request.ageRange 
    ? Math.floor(rng() * (request.ageRange.max - request.ageRange.min + 1)) + request.ageRange.min
    : Math.floor(rng() * (GENERATION_FACTORS.demographics.ageRange.max - GENERATION_FACTORS.demographics.ageRange.min + 1)) + GENERATION_FACTORS.demographics.ageRange.min;
  
  const education = (() => {
    const pool = (request.selectedOptions?.demographics?.education?.length
      ? request.selectedOptions?.demographics?.education
      : GENERATION_FACTORS.demographics.education) as string[];
    return sampleFromArray(pool, rng);
  })();
  const maritalStatus = (() => {
    const pool = (request.selectedOptions?.demographics?.maritalStatus?.length
      ? request.selectedOptions?.demographics?.maritalStatus
      : GENERATION_FACTORS.demographics.maritalStatus) as string[];
    return sampleFromArray(pool, rng);
  })();
  
  // 生成職業相關
  const industries = GENERATION_FACTORS.occupationEconomy.industries;
  const industryObj = ((): CharacterGenerationFactors['occupationEconomy']['industries'][number] => {
    if (typeof request.industry === 'string') {
      const found = industries.find((it) => it.name === request.industry) as CharacterGenerationFactors['occupationEconomy']['industries'][number] | undefined;
      if (found) return found;
    }
    return sampleFromArray<CharacterGenerationFactors['occupationEconomy']['industries'][number]>(industries, rng);
  })();
  const role = (() => {
    // 已移除偏好角色（依所選產業）多選機制
    // 其次使用單一 occupation 指定
    if (request.occupation && industryObj.roles.includes(request.occupation as string)) {
      return request.occupation as string;
    }
    return sampleFromArray(industryObj.roles, rng);
  })();
  
  // 生成人格特質
  const personalityTraits: Record<string, number> = {};
  const personality: string[] = [];
  
  GENERATION_FACTORS.personality.dimensions.forEach(dim => {
    const value = sampleWeighted(dim.values.map(v => ({ value: v, weight: dim.weights?.[v] || 1 })), rng);
    personality.push(`${dim.name}: ${value.value}`);
    personalityTraits[dim.name] = dim.values.indexOf(value.value) / (dim.values.length - 1);
  });
  
  // 添加額外的人格模式
  const patternPool = (request.selectedOptions?.personality?.patterns?.length
    ? request.selectedOptions?.personality?.patterns
    : GENERATION_FACTORS.personality.patterns) as string[];
  const additionalPatterns = sampleFromArray(patternPool, rng);
  personality.push(additionalPatterns);
  // 溝通風格可由多選覆蓋
  const communicationStyle = sampleFromArray(
    (request.selectedOptions?.personality?.communication?.length
      ? request.selectedOptions?.personality?.communication
      : GENERATION_FACTORS.personality.communication) as string[],
    rng
  );
  
  // 信仰相關：已移除（避免產生基督教元素）
  
  // 生成生活方式興趣
  const hobbies: string[] = [];
  const numHobbies = Math.floor(rng() * 3) + 2; // 2-4個興趣
  for (let i = 0; i < numHobbies; i++) {
    const hobby = sampleFromArray(
      (request.selectedOptions?.lifestyle?.hobbies?.length ? request.selectedOptions?.lifestyle?.hobbies : GENERATION_FACTORS.lifestyleInterests.hobbies) as string[],
      rng
    );
    if (!hobbies.includes(hobby)) hobbies.push(hobby);
  }
  const activities = sampleFromArray(
    (request.selectedOptions?.lifestyle?.activities?.length ? request.selectedOptions?.lifestyle?.activities : GENERATION_FACTORS.lifestyleInterests.activities) as string[],
    rng
  );
  
  // 生成數位檔案
  const techAdoption = sampleFromArray(
    (request.selectedOptions?.digital?.techAdoption?.length ? request.selectedOptions?.digital?.techAdoption : GENERATION_FACTORS.digitalProfile.techAdoption) as string[],
    rng
  );
  const privacySettings = sampleFromArray(
    (request.selectedOptions?.digital?.privacySettings?.length ? request.selectedOptions?.digital?.privacySettings : GENERATION_FACTORS.digitalProfile.privacySettings) as string[],
    rng
  );
  const device = sampleFromArray(
    (request.selectedOptions?.digital?.devices?.length ? request.selectedOptions?.digital?.devices : GENERATION_FACTORS.digitalProfile.devices) as string[],
    rng
  );
  const digitalLiteracyLevel = sampleFromArray(
    (request.selectedOptions?.digital?.digitalLiteracy?.length ? request.selectedOptions?.digital?.digitalLiteracy : GENERATION_FACTORS.digitalProfile.digitalLiteracy) as string[],
    rng
  );
  // 生活語言偏好
  const commLang: { topic: string; level: string } = sampleFromArray(
    (GENERATION_FACTORS.lifestyleInterests.languages.communication as any) as Array<{ topic: string; level: string }>,
    rng
  ) as any;
  const culturalPref = sampleFromArray(
    (GENERATION_FACTORS.lifestyleInterests.languages.cultural as string[]),
    rng
  );
  
  // 生成能量曲線
  const energyCurveBase = GENERATION_FACTORS.factors.energyCurve.byIndustry[industryObj.name] || 
                          GENERATION_FACTORS.factors.energyCurve.default;
  // 若使用者指定 energyPattern，從該分布中選擇首個匹配（或 fallback 最大值）
  const energyPattern = (() => {
    const pref = request.selectedOptions?.factors?.energyPattern;
    if (pref && pref.length) {
      const first = pref.find(k => k in energyCurveBase);
      if (first) return first;
    }
    return Object.entries(energyCurveBase).sort((a,b) => b[1]-a[1])[0][0];
  })();
  
  // 參與模式：支援多選偏好，否則按預設權重
  const participationMode = (() => {
    const pref = request.selectedOptions?.factors?.participationMode;
    if (pref && pref.length) return sampleFromArray(pref as string[], rng);
    const weighted = GENERATION_FACTORS.factors.participationMode.enum.map(mode => ({
      mode,
      weight: GENERATION_FACTORS.factors.participationMode.defaultWeights[mode] || 1
    }));
    return sampleWeighted(weighted, rng).mode as string;
  })();
  
  // 信仰實踐程度：已移除
  
  // 構建角色描述（含體型特徵摘要）
  const pa = (request as any).physicalAppearance as any;
  const first = (v?: string[]) => (Array.isArray(v) && v.length ? v[0] : undefined);
  const physicalParts: string[] = [];
  if (first(pa?.heightWeight)) physicalParts.push(`身材${first(pa?.heightWeight)}`);
  if (first(pa?.bodyType)) physicalParts.push(`體型${first(pa?.bodyType)}`);
  if (first(pa?.bodyContour)) physicalParts.push(`輪廓${first(pa?.bodyContour)}`);
  if (first(pa?.alignmentIssues)) physicalParts.push(`姿勢${first(pa?.alignmentIssues)}`);
  if (first(pa?.limbProportion)) physicalParts.push(`四肢比例${first(pa?.limbProportion)}`);
  if (first(pa?.shoulderHipRatio)) physicalParts.push(`肩臀比例${first(pa?.shoulderHipRatio)}`);
  if (first(pa?.composition)) physicalParts.push(`組成${first(pa?.composition)}`);
  if (first(pa?.bmiBand)) physicalParts.push(`BMI${first(pa?.bmiBand)}`);
  if (first(pa?.bodyFatBand)) physicalParts.push(`體脂${first(pa?.bodyFatBand)}`);
  if (first(pa?.gait)) physicalParts.push(`步態${first(pa?.gait)}`);
  if (first(pa?.flexibility)) physicalParts.push(`柔軟度${first(pa?.flexibility)}`);
  if (first(pa?.athleticTendency)) physicalParts.push(`運動傾向${first(pa?.athleticTendency)}`);
  if (first(pa?.metabolismType)) physicalParts.push(`代謝${first(pa?.metabolismType)}`);
  if (first(pa?.dominantMuscleGroup)) physicalParts.push(`肌群${first(pa?.dominantMuscleGroup)}`);
  // 外貌特色補充
  if (first(pa?.hairStyleColor)) physicalParts.push(`髮型${first(pa?.hairStyleColor)}`);
  if (first(pa?.eyeFeatures)) physicalParts.push(`眼眸${first(pa?.eyeFeatures)}`);
  if (first(pa?.skinTexture)) physicalParts.push(`膚質${first(pa?.skinTexture)}`);
  if (first(pa?.faceShape)) physicalParts.push(`臉型${first(pa?.faceShape)}`);
  if (first(pa?.eyebrowStyle)) physicalParts.push(`眉型${first(pa?.eyebrowStyle)}`);
  if (first(pa?.eyeShape)) physicalParts.push(`眼型${first(pa?.eyeShape)}`);
  if (first(pa?.eyelash)) physicalParts.push(`睫毛${first(pa?.eyelash)}`);
  if (first(pa?.eyewear)) physicalParts.push(`眼鏡/隱眼${first(pa?.eyewear)}`);
  if (first(pa?.noseType)) physicalParts.push(`鼻型${first(pa?.noseType)}`);
  if (first(pa?.lipShape)) physicalParts.push(`唇形${first(pa?.lipShape)}`);
  if (first(pa?.beardStyle)) physicalParts.push(`鬍型${first(pa?.beardStyle)}`);
  if (first(pa?.hairVolume)) physicalParts.push(`髮量/髮際線${first(pa?.hairVolume)}`);
  if (first(pa?.hairTexture)) physicalParts.push(`髮質${first(pa?.hairTexture)}`);
  if (first(pa?.skinUndertone)) physicalParts.push(`膚色底調${first(pa?.skinUndertone)}`);
  if (first(pa?.skinFeatures)) physicalParts.push(`皮膚特徵${first(pa?.skinFeatures)}`);
  if (first(pa?.facialFeatures)) physicalParts.push(`臉部特徵${first(pa?.facialFeatures)}`);
  if (first(pa?.earAccessories)) physicalParts.push(`耳部配飾${first(pa?.earAccessories)}`);
  if (first(pa?.teethFeature)) physicalParts.push(`牙齒${first(pa?.teethFeature)}`);
  if (first(pa?.fragrance)) physicalParts.push(`香氛${first(pa?.fragrance)}`);
  if (first(pa?.tattooStyle)) physicalParts.push(`紋身${first(pa?.tattooStyle)}`);
  if (first(pa?.tattooPlacement)) physicalParts.push(`紋身部位${first(pa?.tattooPlacement)}`);
  if (first(pa?.scarBirthmarkPlacement)) physicalParts.push(`疤痕/胎記${first(pa?.scarBirthmarkPlacement)}`);
  if (first(pa?.nailStyle)) physicalParts.push(`指甲${first(pa?.nailStyle)}`);
  if (first(pa?.makeupStyle)) physicalParts.push(`妝感${first(pa?.makeupStyle)}`);
    const physicalSummary = physicalParts.length ? ` 體型與外貌：${physicalParts.slice(0, 8).join('、')}。` : '';
 
   // 穿衣風格摘要
   const ap = pa as any;
   const styleParts: string[] = [];
   const pushFirst = (label: string, v?: string[]) => { const x = first(v); if (x) styleParts.push(`${label}${x}`); };
   pushFirst('服裝', ap?.clothingType);
   pushFirst('風格', ap?.stylePreference);
   pushFirst('色彩', ap?.colorTone);
   pushFirst('圖樣', ap?.patternPreference);
   pushFirst('剪裁', ap?.fitCut);
   pushFirst('層次', ap?.layering);
   pushFirst('材質', ap?.material);
   pushFirst('季節', ap?.seasonStyle);
   pushFirst('正式度', ap?.formality);
   pushFirst('鞋履', ap?.shoeStyle);
   pushFirst('帽款', ap?.hatStyle);
   pushFirst('包款', ap?.bagPreference);
   pushFirst('飾品', ap?.accessoryStyle);
   pushFirst('永續', ap?.sustainability);
   pushFirst('品牌', ap?.brandOrientation);
   pushFirst('預算', ap?.budgetLevel);
   pushFirst('標誌單品', ap?.signatureItem);
   pushFirst('定位', ap?.styleIdentity);
   pushFirst('搭配', ap?.matchingHabit);
   pushFirst('配件取向', ap?.accessoryApproach);
   const clothesSummary = styleParts.length ? ` 穿衣風格：${styleParts.slice(0, 6).join('、')}。` : '';
 
  // 身體習慣摘要（共用 pushFirst）
  const bh = (request as any).physicalAppearance as any;
  const habitParts: string[] = [];
  pushFirst('睡眠', bh?.sleepPattern);
  pushFirst('睡姿', bh?.sleepPosition);
  pushFirst('起床', bh?.wakeHabit);
  pushFirst('飲水', bh?.hydrationLevel);
  pushFirst('咖啡因', bh?.caffeineIntake);
  pushFirst('飲酒', bh?.alcoholUse);
  pushFirst('抽菸', bh?.smokingHabit);
  pushFirst('飲食', bh?.eatingRhythm);
  pushFirst('忌口', bh?.foodRestrictions);
  pushFirst('螢幕', bh?.screenHabit);
  pushFirst('握姿', bh?.devicePosture);
  pushFirst('坐/站', bh?.sittingStandingHabit);
  pushFirst('通勤', bh?.commuteMode);
  pushFirst('步頻', bh?.walkingPace);
  pushFirst('放鬆', bh?.relaxationHabit);
  pushFirst('保健', bh?.supplements);
  pushFirst('保養', bh?.skincareSun);
  pushFirst('呼吸', bh?.breathingHabit);
  pushFirst('輔具', bh?.postureAids);
  pushFirst('穿戴', bh?.wearableDevices);
  pushFirst('水分節律', bh?.waterBalance);
  pushFirst('口頭禪', bh?.speechHabit);
    const habitSummary = habitParts.length ? ` 生活習慣：${habitParts.slice(0, 6).join('、')}。` : '';
 
  // 戀愛模式摘要
  const lr = (request as any).loveAndRomance as any;
  const loveParts: string[] = [];
  const pushVal = (label: string, v?: string) => { if (v) loveParts.push(`${label}${v}`); };
  pushVal('類型', lr?.loveType);
  pushVal('風格', lr?.loveStyle);
  pushVal('表達', lr?.expression);
  pushVal('經歷', lr?.experience);
  pushVal('相處', lr?.relationshipMode);
  pushVal('衝突', lr?.conflictStyle);
  pushVal('未來', lr?.futurePlan);
  pushVal('依附', lr?.attachmentStyle);
  pushVal('節奏', lr?.relationshipPace);
  pushVal('排他', lr?.commitmentExclusivity);
  pushVal('定義', lr?.relationshipDefinition);
  pushVal('頻率', lr?.communicationFrequency);
  pushVal('偏好', lr?.communicationPreference);
  pushVal('修復', lr?.conflictRepairTiming);
  pushVal('道歉', lr?.apologyStyle);
  pushVal('嫉妒', lr?.jealousySensitivity);
  pushVal('信任', lr?.trustBuilding);
  pushVal('隱私', lr?.privacyBoundary);
  pushVal('公開', lr?.socialPublicity);
  pushVal('約會', lr?.dateStyle);
  pushVal('頻率', lr?.dateFrequency);
  pushVal('共處', lr?.togetherTimeRatio);
  pushVal('公開親密', lr?.publicIntimacy);
  pushVal('週末', lr?.weekendPreference);
  pushVal('同居', lr?.cohabitationView);
  pushVal('家務', lr?.houseworkDivision);
  pushVal('金錢', lr?.moneyArrangement);
  pushVal('送禮', lr?.giftBudget);
  pushVal('原生界線', lr?.familyBoundaryWithOrigin);
  pushVal('見家人', lr?.meetParentsAttitude);
  pushVal('前任界線', lr?.exBoundary);
  pushVal('異地', lr?.longDistanceTolerance);
  pushVal('見面週期', lr?.longDistanceMeetCycle);
  pushVal('婚姻觀', lr?.marriageView);
  pushVal('生育觀', lr?.fertilityView);
  pushVal('育兒分工', lr?.parentingDivisionView);
  pushVal('親密界線', lr?.intimacyBoundary);
  pushVal('性開放', lr?.sexualOpenness);
  pushVal('性頻率', lr?.sexualFrequencyExpectation);
  pushVal('安全感', lr?.securityTriggers);
  pushVal('儀式感', lr?.ritualImportance);
  pushVal('生活儀式', lr?.sharedRituals);
  pushVal('寵物觀', lr?.petViewRelationship);
  pushVal('時間期待', lr?.timeExpectation);
  const loveSummary = loveParts.length ? ` 戀愛：${loveParts.slice(0, 6).join('、')}。` : '';
 
  const digitalSummary = `數位科技${techAdoption}，隱私${privacySettings}，常用裝置${device}，數位素養${digitalLiteracyLevel}`;
  const socialSummary = `溝通風格${communicationStyle}，參與模式${participationMode}，能量高峰於${energyPattern}`;
  const languageSummary = `語言：${commLang.topic}${commLang.level ? '（'+commLang.level+'）' : ''}，文化喜好${culturalPref}`;
  // 家庭關係摘要（置於最前）
  const fr = (request as any).familyRelations as any;
  const familyParts: string[] = [];
  if (fr?.spouseDetails) {
    const sd = fr.spouseDetails;
    const spouseSegs: string[] = [];
    if (sd.name) spouseSegs.push(`${sd.name}`);
    if (typeof sd.age === 'number') spouseSegs.push(`${sd.age}歲`);
    if (sd.occupationBackground) spouseSegs.push(`${sd.occupationBackground}`);
    if (sd.personalityTrait) spouseSegs.push(`性格${sd.personalityTrait}`);
    if (sd.interests) spouseSegs.push(`興趣${sd.interests}`);
    if (sd.familyBackground) spouseSegs.push(`家庭背景${sd.familyBackground}`);
    if (spouseSegs.length) familyParts.push(`配偶：${spouseSegs.join('，')}`);
  }
  if (fr?.familyBackground) familyParts.push(`家庭背景：${fr.familyBackground}`);
  if (fr?.marriageStage) familyParts.push(`婚姻階段：${fr.marriageStage}`);
  if (fr?.meetingMethod) familyParts.push(`相識方式：${fr.meetingMethod}`);
  if (fr?.childrenCount) familyParts.push(`子女數：${fr.childrenCount}`);
  if (Array.isArray(fr?.childrenAgeDistribution) && fr.childrenAgeDistribution.length) familyParts.push(`子女年齡：${fr.childrenAgeDistribution.join('、')}`);
  if (fr?.parentingStyle) familyParts.push(`教養風格：${fr.parentingStyle}`);
  if (fr?.parentsStatus) familyParts.push(`父母狀態：${fr.parentsStatus}`);
  if (fr?.siblingsRank) familyParts.push(`兄弟姊妹排行：${fr.siblingsRank}`);
  if (fr?.siblingsCloseness) familyParts.push(`親密度：${fr.siblingsCloseness}`);
  const familySummary = familyParts.length ? `家庭：${familyParts.join('；')}。` : '';

  // 日常生活摘要
  const li = (request as any).lifestyleAndInterests as any;
  const dailyParts: string[] = [];
  const add = (label: string, v?: string) => { if (v) dailyParts.push(`${label}${v}`); };
  add('作息', li?.dailyRhythm);
  add('飲食', li?.eatingHabit);
  add('運動', li?.exerciseHabit);
  add('居住', li?.livingEnvironment);
  add('起床', li?.wakeUpRoutine);
  add('就寢', li?.nightRoutine);
  add('用餐', li?.mealPattern);
  add('開伙', li?.cookingFrequency);
  add('零食', li?.snackHabit);
  add('甜度', li?.sugarIntake);
  add('補水', li?.hydrationHabit);
  add('整潔', li?.homeTidiness);
  add('家務', li?.cleaningSchedule);
  add('洗衣', li?.laundryRoutine);
  add('採買', li?.groceryStyle);
  add('工作', li?.workMode);
  add('時間', li?.timeManagement);
  add('記帳', li?.budgetingRoutine);
  add('環保', li?.ecoHabit);
  add('社交', li?.socialRhythm);
  add('媒體', li?.mediaConsumption);
  add('興趣時段', li?.hobbySlot);
  add('寵物', li?.petCareRoutine);
  add('植物', li?.plantCareRoutine);
  add('穿搭', li?.wardrobePrep);
  add('旅行', li?.travelPrepStyle);
  const dailySummary = dailyParts.length ? ` 日常：${dailyParts.slice(0, 6).join('、')}。` : '';

  // 興趣技能摘要
  const li2 = li as any;
  const interestParts: string[] = [];
  const addI = (label: string, v?: string) => { if (v) interestParts.push(`${label}${v}`); };
  addI('藝術', li2?.artInterest);
  addI('運動', li2?.sportsInterest);
  addI('學習', li2?.learningInterest);
  addI('社交', li2?.socialInterest);
  addI('樂器', li2?.musicInstrument);
  addI('烹飪', li2?.culinarySkill);
  addI('工藝', li2?.craftSkill);
  addI('攝影', li2?.photographyStyle);
  addI('閱讀', li2?.readingGenre);
  addI('寫作', li2?.writingStyle);
  addI('表演', li2?.performingArts);
  addI('設計軟體', li2?.creativeSoftware);
  addI('開發', li2?.codingStack);
  addI('桌遊', li2?.boardgamePreference);
  addI('電玩', li2?.gamingGenre);
  addI('運動細分', li2?.sportsDiscipline);
  addI('戶外', li2?.outdoorHobby);
  addI('旅行', li2?.travelStyle);
  addI('園藝', li2?.gardeningStyle);
  addI('寵物訓練', li2?.petTraining);
  addI('志工', li2?.volunteeringFocus);
  addI('投資', li2?.investingStyle);
  addI('表達', li2?.publicSpeaking);
  addI('領導', li2?.leadershipRole);
  addI('自造', li2?.diyMaker);
  addI('收藏', li2?.collectingHobby);
  addI('學習模式', li2?.learningMode);
  addI('頻率', li2?.engagementFrequency);
  addI('熟練度', li2?.proficiencyLevel);
    const interestSummary = interestParts.length ? ` 興趣技能：${interestParts.slice(0, 6).join('、')}。` : '';

  // 交通摘要
  const tp = li as any;
  const transportParts: string[] = [];
  const addT = (label: string, v?: string) => { if (v) transportParts.push(`${label}${v}`); };
  addT('主要通勤', tp?.commutePrimaryMode);
  addT('轉乘', tp?.multiModalHabit);
  addT('距離', tp?.commuteDistance);
  addT('時段', tp?.commuteTimeBand);
  addT('微移動', tp?.microMobility);
  addT('軌道', tp?.railPreference);
  addT('票卡', tp?.publicPass);
  addT('導航', tp?.navigationApp);
  addT('停車', tp?.parkingPreference);
  addT('安全', tp?.safetyPriority);
  addT('共乘', tp?.carpoolHabit);
  // 汽機車摘要（只取一兩項代表）
  addT('車型', tp?.carSegment);
  addT('動力', tp?.carPowertrain);
  addT('用車', tp?.carUseScenario);
  addT('機車', tp?.motorcycleType);
  const transportSummary = transportParts.length ? ` 交通：${transportParts.slice(0, 6).join('、')}。` : '';

  // 情緒摘要
  const pe = (request as any).psychologyAndEmotion as any;
  const emotionParts: string[] = [];
  const addE = (label: string, v?: string) => { if (v) emotionParts.push(`${label}${v}`); };
  addE('正向', pe?.positiveEmotion);
  addE('負向', pe?.negativeEmotion);
  addE('特質', pe?.emotionTrait);
  addE('能量', pe?.emotionEnergy);
  addE('穩定', pe?.emotionStability);
  addE('壓力', pe?.stressTolerance);
  addE('覺察', pe?.emotionAwareness);
  addE('表達', pe?.expressionIntensity);
  addE('管道', pe?.expressionChannel);
  addE('復原', pe?.resilienceRecovery);
  addE('節律', pe?.diurnalMoodPattern);
  addE('社交', pe?.socialAffect);
  addE('觸發', pe?.emotionTriggers);
  addE('預警', pe?.warningSigns);
  addE('敏感', pe?.sensitiveTopics);
  addE('安全感', pe?.safetyAnchors);
  addE('需求', pe?.affectionNeed);
  addE('偏誤', pe?.affectiveBias);
  addE('心流', pe?.flowProneness);
  const emotionSummary = emotionParts.length ? ` 情緒：${emotionParts.slice(0, 6).join('、')}。` : '';
 
  const description = `${familySummary}${age}歲的${gender}，${education}，${maritalStatus}。在${industryObj.name}擔任${role}。個性${personality.join('、')}，興趣包括${hobbies.join('、')}。${digitalSummary}。${languageSummary}。${socialSummary}。${loveSummary}${dailySummary}${interestSummary}${transportSummary}${emotionSummary}${physicalSummary}${clothesSummary}${habitSummary}`;

  
  // 構建背景故事
  const background = `出生於${new Date().getFullYear() - age}年，${education}後進入${industryObj.name}工作。作為${role}，需要具備${GENERATION_FACTORS.occupationEconomy.skillsMap.technical.slice(0, 2).join('、')}等技能，以及${GENERATION_FACTORS.occupationEconomy.skillsMap.soft.slice(0, 2).join('、')}等軟實力。`;
  
  // 構建挑戰和需求
  const challenges = [
    `在${industryObj.name}的競爭環境中保持競爭力`,
    `持續精進專業能力`,
    `提升${GENERATION_FACTORS.occupationEconomy.skillsMap.technical.slice(0, 1)[0]}等專業技能`,
    `在數位時代保持隱私安全`
  ];
  
  // commonNeeds 已不再使用，移除
  
  // 構建詳細檔案
  const detailedProfile: NonNullable<EnhancedCustomCharacter['detailedProfile']> = {
    industry: industryObj.name,
    role: role,
    experience: Math.floor(rng() * 15) + 1, // 1-15年經驗
    skills: GENERATION_FACTORS.occupationEconomy.skillsMap.technical.slice(0, 3),
    certifications: [],
    seniorityLevel: (() => {
      if (request.seniorityLevel) return request.seniorityLevel;
      const y = Math.floor(rng() * 15) + 1;
      if (y <= 1) return 'intern';
      if (y <= 2) return 'junior';
      if (y <= 5) return 'mid';
      if (y <= 8) return 'senior';
      if (y <= 12) return 'lead';
      return 'manager';
    })(),
    
    personalityTraits,
    communicationStyle,
    learningStyle: '視覺學習',
    participationMode,
    
    familySituation: maritalStatus,
    livingArrangement: '獨居',
    financialStatus: '穩定',
    
    techComfort: techAdoption,
    privacyConcerns: privacySettings,
    notificationPreferences: '重要通知',
    
    scheduleType: '規律',
    energyPattern,
    availability: ['週一至週五', '週末']
  };
  
  // 合併職業-人格匹配需求（若可解析）
  const jobReq = getJobRequirement(role);
  if (jobReq) {
    (detailedProfile as any).jobRequirement = jobReq;
  }
  
  return {
    id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `AI生成角色_${industryObj.name}_${role}`,
    description,
    avatar: '👤',
    background,
    personality,
    age,
    occupation: role,
    location: '台灣',
    interests: hobbies,
    challenges,
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // 生成因子相關屬性（已移除任何與信仰相關的結構）
    generationFactors: {
      demographics: {
        ageRange: { min: age - 5, max: age + 5 },
        gender: [gender],
        education: [education],
        maritalStatus: [maritalStatus]
      },
      occupationEconomy: {
        industries: [industryObj],
        skillsMap: GENERATION_FACTORS.occupationEconomy.skillsMap
      },
      personality: {
        dimensions: GENERATION_FACTORS.personality.dimensions,
        patterns: [additionalPatterns],
        communication: [communicationStyle]
      },
      lifestyleInterests: {
        hobbies,
        languages: GENERATION_FACTORS.lifestyleInterests.languages,
        activities: [activities]
      },
      digitalProfile: {
        techAdoption: [techAdoption],
        privacySettings: [privacySettings],
        digitalLiteracy: ['中級'],
        devices: [device]
      },
      factors: {
                  energyCurve: { default: energyCurveBase, byIndustry: GENERATION_FACTORS.factors.energyCurve.byIndustry },
        participationMode: {
          enum: GENERATION_FACTORS.factors.participationMode.enum,
          defaultWeights: GENERATION_FACTORS.factors.participationMode.defaultWeights,
          byIndustryBias: GENERATION_FACTORS.factors.participationMode.byIndustryBias
        }
      }
    },
    
    detailedProfile,
    
    generationMeta: {
      seed: request.seed,
      factors: Object.keys(request.factorWeights || {}),
      version: (bundle as any)?.version ?? 'v2.6.16f2',
      generatedAt: new Date()
    }
  };
}

// 批量生成角色
export function generateMultipleCharacters(
  request: CharacterGenerationRequest,
  count: number = 3
): EnhancedCustomCharacter[] {
  const characters: EnhancedCustomCharacter[] = [];
  
  for (let i = 0; i < count; i++) {
    const modifiedRequest = {
      ...request,
      seed: request.seed ? `${request.seed}_${i}` : `batch_${i}`
    };
    characters.push(generateCharacterProfile(modifiedRequest));
  }
  
  return characters;
}

// 導出生成因子資料供其他模組使用
export { GENERATION_FACTORS }; 