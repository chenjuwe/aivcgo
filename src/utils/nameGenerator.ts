import surnamesTW from './data/surnames_tw.json';
// 移除 HK/CN 靜態匯入，改由 ensureRegionData 動態載入
// import surnamesHK from './data/surnames_hk.json';
// import surnamesCN from './data/surnames_cn.json';
import maleChars from './data/given_chars_male.json';
import femaleChars from './data/given_chars_female.json';
import unisexChars from './data/given_chars_unisex.json';
import blacklist from './data/name_blacklist.json';
import bigramsTW from './data/given_bigrams_tw.json';
// import bigramsHK from './data/bigrams_hk.json';
// import bigramsCN from './data/bigrams_cn.json';
import phonetics from './data/char_phonetics.json';
import tagsDict from './data/char_tags.json';
import yue from './data/cantonese_phonetics.json';
import homophoneBL from './data/homophone_blacklist.json';

export type ChineseNameStyle = 'classic' | 'modern' | 'literary' | 'neutral';
export type Region = 'TW' | 'HK' | 'CN';
export type NameTheme = 'nature' | 'virtue' | 'bright' | 'family' | 'study' | 'art' | 'peace';

// 實用函式：可重現隨機、加權抽樣、softmax 抽樣
export function createRng(seed?: string | number) {
  if (seed === undefined || seed === null || seed === '') {
    return Math.random;
  }
  let s = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) >>> 0;
  // mulberry32
  return function rng() {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function sampleWeighted<T extends { weight?: number }>(arr: T[], rnd: () => number): T {
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

export function softmaxSample<T extends { score: number }>(
  arr: T[],
  rnd: () => number,
  temperature = 0.7,
  topK = 50,
  topP = 0.9
): T | null {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => b.score - a.score);
  const kList = sorted.slice(0, Math.max(1, Math.min(topK, sorted.length)));
  // 累積到 topP
  const max = kList[0].score;
  const exp = kList.map(x => Math.exp((x.score - max) / Math.max(1e-6, temperature)));
  let sum = exp.reduce((a, b) => a + b, 0);
  // topP 濾掉尾部
  const probs = exp.map(e => e / (sum || 1));
  const cumulative: number[] = [];
  let acc = 0;
  for (let i = 0; i < probs.length; i++) { acc += probs[i]; cumulative.push(acc); }
  let cut = probs.length;
  for (let i = 0; i < cumulative.length; i++) { if (cumulative[i] >= topP) { cut = i + 1; break; } }
  const final = kList.slice(0, cut);
  const finalExp = exp.slice(0, cut);
  sum = finalExp.reduce((a, b) => a + b, 0) || 1;
  let r = rnd() * sum;
  for (let i = 0; i < final.length; i++) {
    r -= finalExp[i];
    if (r <= 0) return final[i];
  }
  return final[final.length - 1];
}

export interface NameRequest {
  gender?: 'male' | 'female' | 'unisex';
  style?: ChineseNameStyle;
  theme?: NameTheme;
  region?: Region;
  surname?: string;
  allowSingleGiven?: boolean;
  maxStrokePerChar?: number;
  avoidRareChars?: boolean;
  seed?: string | number;
  candidateCount?: number;
  // 加權與懲罰
  weights?: { alpha?: number; beta?: number; gamma?: number; delta?: number; epsilon?: number };
  penalties?: { homophone?: number; sameTone?: number; sameStructure?: number; semanticConflict?: number };
  // 生成策略
  selectionMode?: 'max' | 'sample';
  temperature?: number;
  topK?: number;
  topP?: number;
  beamSize?: number;
  diversityPenalty?: number;
  era?: '1980s' | '1990s' | '2000s' | '2010s';
  // 諧音/節奏/五行/跨區
  homophonePolicy?: 'block' | 'penalize' | 'ignore';
  surnameTonePenaltyWeight?: number; // 0~1
  fiveElementPreference?: 'balanced' | 'wood' | 'water' | 'fire' | 'earth' | 'metal';
  crossRegionMix?: number; // 0~0.3
  // 生肖/星座
  chineseZodiac?: '鼠'|'牛'|'虎'|'兔'|'龍'|'蛇'|'馬'|'羊'|'猴'|'雞'|'狗'|'豬';
  westernZodiac?: 'Aries'|'Taurus'|'Gemini'|'Cancer'|'Leo'|'Virgo'|'Libra'|'Scorpio'|'Sagittarius'|'Capricorn'|'Aquarius'|'Pisces';
  // 新增：生辰時間（HH:mm），用於時柱（地支）偏好
  birthTime?: string;
  // 進階取名模組
  enablePhonologyAesthetics?: boolean;
  structureDiversityWeight?: number; // 0~0.2
  literaryPreference?: 'none'|'classic'|'poetic'|'virtue';
  familyGenerationChar?: string; // 字輩字
  siblingNames?: string[]; // 兄弟姐妹姓名（用於協同）
  enableThreeFiveGrids?: boolean;
  uniquenessPreference?: number; // 0(popular)~1(unique)
  additionalBlacklist?: string[];
  familyGenerationPosition?: 'first' | 'second';
  // 偏好學習
  likedChars?: string[];
  likedBigrams?: string[];
  blockedChars?: string[];
  blockedBigrams?: string[];
  blockedNames?: string[];
}

export interface GeneratedName {
  fullName: string;
  surname: string;
  givenName: string;
  totalStrokes?: number;
  meta?: Record<string, any>;
}

export interface WeightedSurname { surname: string; weight: number; }
export interface WeightedChar { char: string; weight: number; strokes?: number; rare?: boolean; structure?: string; polyphonic?: boolean; freqRank?: number; tags?: string[]; }
export interface Bigram { first: string; second: string; weight: number; gender?: string; era?: string; region?: string; }

let DATA_SURNAMES_TW: WeightedSurname[] = surnamesTW as any;
let DATA_SURNAMES_HK: WeightedSurname[] = [];
let DATA_SURNAMES_CN: WeightedSurname[] = [];
let DATA_GIVEN_MALE: WeightedChar[] = maleChars as any;
let DATA_GIVEN_FEMALE: WeightedChar[] = femaleChars as any;
let DATA_GIVEN_UNISEX: WeightedChar[] = unisexChars as any;
let DATA_BIGRAMS_TW: Bigram[] = bigramsTW as any;
let DATA_BIGRAMS_HK: Bigram[] = [];
let DATA_BIGRAMS_CN: Bigram[] = [];
let DATA_BLACKLIST: string[] = blacklist as any;
let DATA_PHONETICS: Record<string, any> = phonetics as any;
let DATA_YUE: Record<string, any> = yue as any;
let DATA_HOMOPHONE_BL: string[] = homophoneBL as any;

// Bigram 索引快取：依地區→首字→候選列表
let INDEX_BIGRAMS_TW: Map<string, Bigram[]> | null = null;
let INDEX_BIGRAMS_HK: Map<string, Bigram[]> | null = null;
let INDEX_BIGRAMS_CN: Map<string, Bigram[]> | null = null;

export interface NameDataSources {
  surnames?: WeightedSurname[];
  givenMale?: WeightedChar[];
  givenFemale?: WeightedChar[];
  givenUnisex?: WeightedChar[];
  bigrams?: Bigram[];
  blacklist?: string[];
  phonetics?: Record<string, any>;
  cantonese?: Record<string, any>;
  homophoneBlacklist?: string[];
}

export function configureNameData(overrides: NameDataSources) {
  if (overrides.surnames) { DATA_SURNAMES_TW = overrides.surnames; }
  if (overrides.givenMale) DATA_GIVEN_MALE = overrides.givenMale;
  if (overrides.givenFemale) DATA_GIVEN_FEMALE = overrides.givenFemale;
  if (overrides.givenUnisex) DATA_GIVEN_UNISEX = overrides.givenUnisex;
  if (overrides.bigrams) { DATA_BIGRAMS_TW = overrides.bigrams; INDEX_BIGRAMS_TW = null; }
  if (overrides.blacklist) DATA_BLACKLIST = overrides.blacklist;
  if (overrides.phonetics) DATA_PHONETICS = overrides.phonetics;
  if (overrides.cantonese) DATA_YUE = overrides.cantonese;
  if (overrides.homophoneBlacklist) DATA_HOMOPHONE_BL = overrides.homophoneBlacklist;
}

// 動態載入並快取各地區資料
export async function ensureRegionData(region: Region) {
  if (region === 'TW') {
    // 已在 bundle 內，僅確保索引
    if (!INDEX_BIGRAMS_TW) INDEX_BIGRAMS_TW = buildBigramIndex(DATA_BIGRAMS_TW);
    return;
  }
  if (region === 'HK') {
    if (DATA_SURNAMES_HK.length === 0) {
      const [s, b] = await Promise.all([
        import('./data/surnames_hk.json'),
        import('./data/bigrams_hk.json')
      ]);
      DATA_SURNAMES_HK = (s as any).default as WeightedSurname[];
      DATA_BIGRAMS_HK = (b as any).default as Bigram[];
      INDEX_BIGRAMS_HK = null;
    }
    if (!INDEX_BIGRAMS_HK) INDEX_BIGRAMS_HK = buildBigramIndex(DATA_BIGRAMS_HK);
    return;
  }
  if (region === 'CN') {
    if (DATA_SURNAMES_CN.length === 0) {
      const [s, b] = await Promise.all([
        import('./data/surnames_cn.json'),
        import('./data/bigrams_cn.json')
      ]);
      DATA_SURNAMES_CN = (s as any).default as WeightedSurname[];
      DATA_BIGRAMS_CN = (b as any).default as Bigram[];
      INDEX_BIGRAMS_CN = null;
    }
    if (!INDEX_BIGRAMS_CN) INDEX_BIGRAMS_CN = buildBigramIndex(DATA_BIGRAMS_CN);
    return;
  }
}

function buildBigramIndex(arr: Bigram[]): Map<string, Bigram[]> {
  const m = new Map<string, Bigram[]>();
  for (const b of arr) {
    if (!m.has(b.first)) m.set(b.first, []);
    m.get(b.first)!.push(b);
  }
  for (const [k, list] of m.entries()) list.sort((a, b) => (b.weight || 0) - (a.weight || 0));
  return m;
}

function ensureBigramIndex(region: Region) {
  if (region === 'TW' && !INDEX_BIGRAMS_TW) INDEX_BIGRAMS_TW = buildBigramIndex(DATA_BIGRAMS_TW);
  if (region === 'HK' && !INDEX_BIGRAMS_HK) INDEX_BIGRAMS_HK = buildBigramIndex(DATA_BIGRAMS_HK);
  if (region === 'CN' && !INDEX_BIGRAMS_CN) INDEX_BIGRAMS_CN = buildBigramIndex(DATA_BIGRAMS_CN);
}

function getBigramsByFirst(region: Region, first: string): Bigram[] {
  ensureBigramIndex(region);
  if (region === 'HK') return (INDEX_BIGRAMS_HK!.get(first) || []);
  if (region === 'CN') return (INDEX_BIGRAMS_CN!.get(first) || []);
  return (INDEX_BIGRAMS_TW!.get(first) || []);
}

function getRegionSurnames(region: Region): WeightedSurname[] {
  if (region === 'HK' && DATA_SURNAMES_HK.length) return DATA_SURNAMES_HK;
  if (region === 'CN' && DATA_SURNAMES_CN.length) return DATA_SURNAMES_CN;
  return DATA_SURNAMES_TW;
}

function getRegionBigrams(region: Region): Bigram[] {
  if (region === 'HK' && DATA_BIGRAMS_HK.length) return DATA_BIGRAMS_HK;
  if (region === 'CN' && DATA_BIGRAMS_CN.length) return DATA_BIGRAMS_CN;
  return DATA_BIGRAMS_TW;
}

function pickGivenChar(
  pools: WeightedChar[],
  opts: Required<Pick<NameRequest, 'avoidRareChars'>> & Pick<NameRequest, 'maxStrokePerChar'>,
  rnd: () => number
): WeightedChar | undefined {
  const filtered = pools.filter(c => {
    if (opts.avoidRareChars && c.rare) return false;
    if (opts.maxStrokePerChar && c.strokes && c.strokes > opts.maxStrokePerChar) return false;
    return true;
  });
  const list = filtered.length > 0 ? filtered : pools;
  if (list.length === 0) return undefined;
  return sampleWeighted<WeightedChar>(list as unknown as Array<WeightedChar>, rnd) as WeightedChar;
}

function scoreStrokes(strokes: number[]): number {
  if (strokes.length === 1) return 0.5;
  const diff = Math.abs((strokes[0] || 0) - (strokes[1] || 0));
  const penalty = diff > 8 ? -0.6 : diff > 5 ? -0.3 : 0;
  const heavy = strokes.some(s => s > 16) ? -0.4 : 0;
  return 1 + penalty + heavy;
}

function getBigramsMixedByFirst(region: Region, first: string, crossRegionMix = 0): Bigram[] {
  // 基礎為當前 region 的候選
  const base = getBigramsByFirst(region, first);
  if (!crossRegionMix || crossRegionMix <= 0) return base;
  const out: Bigram[] = [...base];
  const addScaled = (arr: Bigram[], scale: number) => {
    for (const b of arr) out.push({ ...b, weight: (b.weight || 0) * scale });
  };
  // 將其他區候選以比例混入（僅在資料已載入時混入）
  if (region !== 'TW' && DATA_BIGRAMS_TW.length) addScaled(getBigramsByFirst('TW', first), crossRegionMix);
  if (region !== 'HK' && DATA_BIGRAMS_HK.length) addScaled(getBigramsByFirst('HK', first), crossRegionMix);
  if (region !== 'CN' && DATA_BIGRAMS_CN.length) addScaled(getBigramsByFirst('CN', first), crossRegionMix);
  return out;
}

function scoreBigramLaplace(first: string, second: string, region: Region, reqGender?: 'male'|'female'|'unisex', reqEra?: '1980s'|'1990s'|'2000s'|'2010s', crossRegionMix = 0): number {
  const candidates = getBigramsMixedByFirst(region, first, crossRegionMix);
  if (candidates.length === 0) return 0;
  const weightOf = (b: Bigram) => {
    let w = (b.weight || 0);
    if (reqGender && b.gender && b.gender !== 'unisex' && b.gender === reqGender) w *= 1.2;
    if (reqEra && b.era && b.era === reqEra) w *= 1.15;
    return w;
  };
  const V = candidates.length;
  const sum = candidates.reduce((s, b) => s + weightOf(b), 0);
  const match = candidates.find(b => b.second === second);
  const k = 1;
  const p = ((match ? weightOf(match) : 0) + k) / (sum + k * V);
  return Math.min(1.2, 0.6 + 1.2 * p);
}

function pickSecondByBigram(
  first: string,
  pools: WeightedChar[],
  rnd: () => number,
  region: Region,
  reqGender?: 'male'|'female'|'unisex',
  reqEra?: '1980s'|'1990s'|'2000s'|'2010s',
  crossRegionMix = 0
): WeightedChar | undefined {
  const candidates = pools.filter(c => c.char !== first);
  const matches = getBigramsMixedByFirst(region, first, crossRegionMix);
  if (matches.length === 0) {
    return candidates.length ? candidates[Math.floor(rnd() * candidates.length)] : undefined;
  }
  const weightOf = (b: Bigram) => {
    let w = (b.weight || 0);
    if (reqGender && b.gender && b.gender !== 'unisex' && b.gender === reqGender) w *= 1.2;
    if (reqEra && b.era && b.era === reqEra) w *= 1.15;
    return w;
  };
  const total = matches.reduce((s, m) => s + weightOf(m), 0) || 1;
  let r = rnd() * total;
  for (const m of matches) {
    r -= weightOf(m);
    if (r <= 0) {
      const chosen = candidates.find(c => c.char === m.second);
      if (chosen) return chosen;
    }
  }
  return candidates.length ? candidates[0] : undefined;
}

function toneOf(ch: string): number | undefined {
  return (DATA_PHONETICS as any)[ch]?.tone;
}
function finalOf(ch: string): string | undefined { return (DATA_PHONETICS as any)[ch]?.final; }
function initialOf(ch: string): string | undefined { return (DATA_PHONETICS as any)[ch]?.initial; }

function scorePhonetics(given: string): { score: number; reason: string; penalties: { sameTone: number } } {
  const tones = Array.from(given).map(toneOf).filter(Boolean) as number[];
  const finals = Array.from(given).map(finalOf).filter(Boolean) as string[];
  const initials = Array.from(given).map(initialOf).filter(Boolean) as string[];
  let s = 0; const reasons: string[] = []; let sameTonePenalty = 0;
  if (tones.length === 2) {
    const [t1, t2] = tones;
    if (t1 !== t2) { s += 0.4; reasons.push('聲調有變化'); } else { sameTonePenalty = 0.2; }
    if (!(t1 === 3 && t2 === 3)) { s += 0.2; } else { s -= 0.4; reasons.push('避免 3-3 聲調'); }
    if ((t1 === 2 && t2 === 4) || (t1 === 1 && t2 === 4)) { s += 0.2; reasons.push('節奏順暢'); }
  }
  if (finals.length === 2) {
    const [f1, f2] = finals;
    if (f1 !== f2) { s += 0.2; reasons.push('韻母多樣'); } else { s -= 0.2; reasons.push('避免相同韻母'); }
  }
  if (initials.length === 2) {
    const [i1, i2] = initials;
    if (i1 !== i2) s += 0.1;
    const affricates = new Set(['zh','ch','sh','j','q','x','z','c','s']);
    if (affricates.has(String(i1)) && affricates.has(String(i2))) { s -= 0.1; reasons.push('避免連續塞擦音'); }
  }
  return { score: s, reason: reasons.join('、'), penalties: { sameTone: sameTonePenalty } };
}

function scorePhoneticsYue(given: string): { score: number; reason: string; penalties: { sameTone: number } } {
  const tones = Array.from(given).map(ch => (DATA_YUE as any)[ch]?.tone).filter(Boolean) as number[];
  let s = 0; const reasons: string[] = []; let sameTonePenalty = 0;
  if (tones.length === 2) {
    const [t1, t2] = tones;
    if (t1 !== t2) s += 0.3; else sameTonePenalty = 0.2;
    // 高(1/2/3)低(4/5/6)交替更順暢
    const hi = (t: number) => (t <= 3);
    if (hi(t1) !== hi(t2)) s += 0.1;
  }
  return { score: s, reason: reasons.join('、'), penalties: { sameTone: sameTonePenalty } };
}

function scorePhoneticsFull(surname: string, given: string, region: Region, weight = 1): { penalty: number; reason?: string } {
  const word = surname + given;
  const chars = Array.from(word);
  const baseTones = region === 'HK'
    ? chars.map(ch => (DATA_YUE as any)[ch]?.tone).filter((t: any) => t != null) as number[]
    : chars.map(toneOf).filter((t: any) => t != null) as number[];
  if (baseTones.length < 2) return { penalty: 0 };
  let tones = [...baseTones];
  // 普通話簡化變調處理：3-3 → 前字作 2；「一」「不」視後字調整
  if (region !== 'HK') {
    for (let i = 0; i < tones.length - 1; i++) {
      if (tones[i] === 3 && tones[i + 1] === 3) tones[i] = 2;
    }
    for (let i = 0; i < chars.length - 1; i++) {
      if (chars[i] === '一') {
        tones[i] = (tones[i + 1] === 4) ? 2 : 4; // yi2 before 4th, else yi4（簡化）
      } else if (chars[i] === '不') {
        tones[i] = (tones[i + 1] === 4) ? 2 : 4; // bu2 before 4th, else bu4（簡化）
      }
    }
  }
  // 懲罰：相鄰同調、連續多次同調、首兩音 3-3（已變調但仍視為不佳）
  let penalty = 0;
  let reason: string[] = [];
  for (let i = 0; i < tones.length - 1; i++) {
    if (tones[i] === tones[i + 1]) { penalty += 0.07 * weight; }
    if (baseTones[i] === 3 && baseTones[i + 1] === 3 && region !== 'HK') {
      penalty += 0.1 * weight; reason.push('避免 3-3');
    }
  }
  // 若姓與名第一字同調，額外懲罰
  if (tones.length >= 2 && tones[0] === tones[1]) { penalty += 0.15 * weight; reason.push('姓與名同調'); }
  // 節奏：高(1/2) vs 低(3/4) 類別交替可略減少懲罰
  const hi = (t: number) => (region === 'HK') ? (t <= 3) : (t <= 2);
  let alternations = 0;
  for (let i = 0; i < tones.length - 1; i++) if (hi(tones[i]) !== hi(tones[i + 1])) alternations++;
  if (alternations >= Math.floor((tones.length - 1) / 2)) penalty = Math.max(0, penalty - 0.08 * weight);
  return { penalty, reason: reason.length ? reason.join('、') : undefined };
}

function scoreFiveElements(given: string, pref?: 'balanced' | 'wood' | 'water' | 'fire' | 'earth' | 'metal'): { score: number; reason?: string } {
  if (!pref) return { score: 0 } as any;
  const mapTagToElem = (tags: string[]): ('wood'|'water'|'fire'|'earth'|'metal'|null) => {
    if (tags.some(t => t.includes('木'))) return 'wood';
    if (tags.some(t => t.includes('水'))) return 'water';
    if (tags.some(t => t.includes('火'))) return 'fire';
    if (tags.some(t => t.includes('土'))) return 'earth';
    if (tags.some(t => t.includes('金') || t.includes('玉'))) return 'metal';
    return null;
  };
  const elems: ('wood'|'water'|'fire'|'earth'|'metal'|null)[] = Array.from(given).map(ch => mapTagToElem(((tagsDict as any)[ch] || []) as string[]));
  let score = 0;
  if (pref === 'balanced') {
    const counts: Record<string, number> = { wood:0, water:0, fire:0, earth:0, metal:0 } as any;
    for (const e of elems) if (e) counts[e]++;
    const vals = Object.values(counts);
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    score = Math.max(0, 0.12 - 0.04 * (max - min)); // 越均衡越高，最大 0.12
    return { score, reason: '五行均衡' };
  } else {
    const target = pref;
    const hits = elems.filter(e => e === target).length;
    score = Math.min(0.12, hits * 0.08);
    return { score, reason: '五行偏好' };
  }
}

const themeTagMap: Record<NameTheme, string[]> = {
  nature: ['自然', '木', '水', '草木', '清澈', '新生'],
  virtue: ['善良', '涵養', '聰慧', '智慧', '包容', '溫婉', '奮發', '志向'],
  bright: ['光明', '明亮', '晶瑩'],
  family: ['家庭', '溫暖', '庭園', '平安'],
  study: ['語言', '文學', '成就', '建設'],
  art: ['美玉', '珍貴', '美麗', '典雅', '文雅'],
  peace: ['平安', '安定', '包容']
};

function scoreTheme(given: string, theme?: NameTheme): { score: number; reason: string } {
  if (!theme) return { score: 0, reason: '' };
  const wanted = new Set(themeTagMap[theme] || []);
  let hit = 0;
  for (const ch of given) {
    const tags: string[] = (tagsDict as any)[ch] || [];
    if (tags.some(t => wanted.has(t))) hit++;
  }
  const score = hit * 0.35;
  return { score, reason: hit > 0 ? `主題匹配（${theme}）` : '' };
}

function scoreSemanticSynergy(given: string): { score: number; conflict: number; reason?: string } {
  if (given.length < 2) return { score: 0, conflict: 0 };
  const [a, b] = [given[0], given[1]];
  const tagsA: string[] = (tagsDict as any)[a] || [];
  const tagsB: string[] = (tagsDict as any)[b] || [];
  const setA = new Set(tagsA);
  const setB = new Set(tagsB);
  const inter = tagsA.filter(t => setB.has(t)).length;
  const union = new Set([...tagsA, ...tagsB]).size || 1;
  const jacc = inter / union; // 0~1
  let conflict = 0;
  const soft = new Set(['典雅','文雅','安靜','溫婉','平安']);
  const hard = new Set(['強壯','堅強','豪邁','軍']);
  const hasSoft = tagsA.some(t => soft.has(t)) || tagsB.some(t => soft.has(t));
  const hasHard = tagsA.some(t => hard.has(t)) || tagsB.some(t => hard.has(t));
  if (hasSoft && hasHard) conflict = 0.15;
  const score = Math.min(0.3, jacc * 0.3);
  const reason = inter > 0 ? '語義相容' : undefined;
  return { score, conflict, reason };
}

const styleTagMap: Record<ChineseNameStyle, string[]> = {
  neutral: [],
  classic: ['典雅','文雅','靜','德','文','博'],
  modern: ['軒','朗','皓','霆','豪','俊'],
  literary: ['詩','文','藝','雅','然','安']
};

function scoreStyle(given: string, style?: ChineseNameStyle): number {
  if (!style) return 0;
  const wants = new Set(styleTagMap[style] || []);
  let s = 0;
  for (const ch of given) {
    const tags: string[] = (tagsDict as any)[ch] || [];
    if (tags.some(t => wants.has(t))) s += 0.08;
  }
  return Math.min(0.24, s);
}

function toPinyin(word: string): string {
  const parts = Array.from(word).map(ch => {
    const p = (DATA_PHONETICS as any)[ch];
    if (!p) return ch;
    const ini = p.initial || '';
    const fin = p.final || '';
    const tone = p.tone || '';
    return `${ini}${fin}${tone ? tone : ''}`;
  });
  return parts.join(' ');
}

function toJyutping(word: string): string {
  const parts = Array.from(word).map(ch => {
    const p = (DATA_YUE as any)[ch];
    if (!p) return ch;
    return `${p.initial || ''}${p.tone || ''}`;
  });
  return parts.join(' ');
}

function violatesHomophone(fullName: string): boolean {
  if ((DATA_HOMOPHONE_BL as string[]).some(t => fullName.includes(t))) return true;
  const py = toPinyin(fullName).replace(/\s+/g, '');
  const neg = ['si', 'pi', 'sha', 'zai'];
  if (neg.some(n => py.includes(n))) return true;
  return false;
}

// 簡易中間分數快取（進程內）
const CACHE_CHAR_WEIGHT = new Map<string, number>(); // key: gender|given
const CACHE_SEMANTIC = new Map<string, { score: number; conflict: number; reason?: string }>(); // key: given
const CACHE_STYLE = new Map<string, number>(); // key: style|given

function cacheGetOrSet<T>(map: Map<string, T>, key: string, compute: () => T): T {
  if (map.has(key)) return map.get(key)!;
  const val = compute();
  if (map.size > 5000) map.clear();
  map.set(key, val);
  return val;
}

// 偏好學習：硬過濾與加分
function applyPreferenceBlocks(
  fullName: string,
  given: string,
  blocked?: { names?: string[]; chars?: string[]; bigrams?: string[] }
): boolean {
  if (!blocked) return false;
  if (blocked.names && blocked.names.some(n => n && fullName.includes(n))) return true;
  if (blocked.chars && Array.from(given).some(ch => blocked.chars!.includes(ch))) return true;
  if (blocked.bigrams && given.length === 2) {
    const bg = given[0] + given[1];
    if (blocked.bigrams.includes(bg)) return true;
  }
  return false;
}

function preferenceBonus(
  given: string,
  liked?: { chars?: string[]; bigrams?: string[] }
): { score: number; reason?: string } {
  if (!liked) return { score: 0 } as any;
  let s = 0;
  if (liked.chars && liked.chars.length) {
    for (const ch of given) if (liked.chars.includes(ch)) s += 0.05;
  }
  if (liked.bigrams && liked.bigrams.length && given.length === 2) {
    const bg = given[0] + given[1];
    if (liked.bigrams.includes(bg)) s += 0.08;
  }
  return { score: Math.min(0.16, s), reason: s > 0 ? '偏好加權' : undefined } as any;
}

function charWeightScore(chars: string[], gender: 'male'|'female'|'unisex'): number {
  const pools: WeightedChar[] = [];
  if (gender === 'male') pools.push(...(DATA_GIVEN_MALE as WeightedChar[]));
  if (gender === 'female') pools.push(...(DATA_GIVEN_FEMALE as WeightedChar[]));
  pools.push(...(DATA_GIVEN_UNISEX as WeightedChar[]));
  const map = new Map<string, number>();
  for (const c of pools) map.set(c.char, Math.max(map.get(c.char) || 0, c.weight || 0));
  const vals = chars.map(ch => map.get(ch) || 1);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.min(1, Math.max(0, 0.4 + (avg - 1) / 9 * 0.6));
}

function sameStructurePenalty(chars: string[], pools: WeightedChar[]): { penalty: number; reason?: string } {
  if (chars.length < 2) return { penalty: 0 };
  const info = (ch: string) => pools.find(c => c.char === ch);
  const a = info(chars[0]);
  const b = info(chars[1]);
  if (a?.structure && b?.structure && a.structure === b.structure) {
    return { penalty: 0.1, reason: '結構過於相似' };
  }
  return { penalty: 0 };
}

function scorePhonologyAesthetics(given: string, enabled?: boolean): { score: number; reason?: string } {
  if (!enabled) return { score: 0 } as any;
  const initials = Array.from(given).map(initialOf).filter(Boolean) as string[];
  let s = 0; const reasons: string[] = [];
  if (initials.length === 2) {
    const [i1, i2] = initials;
    if (i1 && i2 && i1 !== i2) { s += 0.08; reasons.push('聲母對比'); }
  }
  // 字形多樣：左右/上下/獨體互補
  // 具體在 sameStructurePenalty 已懲罰相同，這裡補小幅鼓勵不同
  s += 0.06;
  return { score: Math.min(0.14, s), reason: reasons.join('、') };
}

function scoreLiterary(given: string, pref?: 'none'|'classic'|'poetic'|'virtue'): { score: number; reason?: string } {
  if (!pref || pref === 'none') return { score: 0 } as any;
  const tagSets: Record<string, string[]> = {
    classic: ['典雅','文雅','經典','禮'],
    poetic: ['詩','文','藝','雅','然','清','明','月','風'],
    virtue: ['德','誠','善良','仁','智','信','勇']
  } as any;
  const wants = new Set(tagSets[pref] || []);
  let hits = 0;
  for (const ch of given) {
    const tags: string[] = (tagsDict as any)[ch] || [];
    if (tags.some(t => wants.has(t))) hits++;
  }
  const score = Math.min(0.16, hits * 0.08);
  return { score, reason: '文學/德目偏好' };
}

function scoreFamilyGeneration(given: string, genChar?: string, pos?: 'first'|'second'): { score: number; reason?: string } {
  if (!genChar) return { score: 0 } as any;
  const first = given[0];
  const second = given[1];
  let hit = false;
  if (pos === 'first') hit = first === genChar;
  else if (pos === 'second') hit = second === genChar;
  else hit = given.includes(genChar);
  return { score: hit ? 0.12 : 0, reason: hit ? '字輩匹配' : undefined } as any;
}

function scoreSiblingSynergy(given: string, siblings?: string[]): { score: number; reason?: string } {
  if (!siblings || siblings.length === 0) return { score: 0 } as any;
  // 簡化：避免與兄弟姐妹完全同韻/同調；共享部分語義標籤加分
  const thisTags = new Set<string>();
  for (const ch of given) ((tagsDict as any)[ch] || []).forEach((t: string) => thisTags.add(t));
  let best = 0;
  for (const sib of siblings) {
    const sibTags = new Set<string>();
    for (const ch of sib) ((tagsDict as any)[ch] || []).forEach((t: string) => sibTags.add(t));
    const inter = Array.from(thisTags).filter(t => sibTags.has(t)).length;
    best = Math.max(best, Math.min(0.12, inter * 0.04));
  }
  return { score: best, reason: best > 0 ? '手足主題呼應' : undefined };
}

function scoreThreeFiveGrids(surname: string, given: string, enabled?: boolean): { score: number; reason?: string } {
  if (!enabled) return { score: 0 } as any;
  // 粗略：以總筆畫與兩字筆畫組合是否落在常見吉數集合來給分
  const lucky = new Set([3,5,6,7,8,11,13,15,16,17,18,21,23,24,25,29,31,32,35,37]);
  const strokesSurname = Array.from(surname).reduce((s, ch) => s + (((maleChars as any).find?.(() => false), 0) || 0), 0); // 無法取姓筆畫，改用 0
  const strokesGiven = Array.from(given).reduce((s, ch) => s + (((tagsDict as any)[ch]?.strokes) || 0), 0);
  const total = strokesSurname + strokesGiven;
  const score = lucky.has(total % 40) ? 0.12 : 0;
  return { score, reason: score > 0 ? '數理吉數' : undefined } as any;
}

function scoreUniqueness(given: string, region: Region, pref = 0): { penalty: number; reason?: string } {
  if (pref <= 0) return { penalty: 0 } as any;
  if (given.length < 2) return { penalty: 0 } as any;
  const matches = getBigramsByFirst(region, given[0]).find(b => b.second === given[1]);
  const popularity = (matches?.weight || 0) / 10; // 0~1 粗估
  const penalty = Math.max(0, popularity - (1 - pref)) * 0.2; // 偏好越高，對熱門越懲罰
  return { penalty, reason: penalty > 0 ? '避免重名' : undefined } as any;
}

const zodiacToElement: Record<string, 'wood'|'water'|'fire'|'earth'|'metal'> = {
  '鼠': 'water','牛': 'earth','虎': 'wood','兔': 'wood','龍': 'earth','蛇': 'fire','馬': 'fire','羊': 'earth','猴': 'metal','雞': 'metal','狗': 'earth','豬': 'water'
};

const westernZodiacTags: Record<string, string[]> = {
  Aries: ['勇敢','奮發','自由','光明'],
  Taurus: ['穩重','德','堅強','安定'],
  Gemini: ['語言','智慧','靈巧'],
  Cancer: ['家庭','溫暖','關懷','平安'],
  Leo: ['光明','自信','偉大','榮耀'],
  Virgo: ['潔淨','細膩','勤勉'],
  Libra: ['典雅','文雅','和諧','平衡'],
  Scorpio: ['堅毅','深沉','志向'],
  Sagittarius: ['自由','探索','遠志'],
  Capricorn: ['成就','勤奮','建設'],
  Aquarius: ['創新','博愛','智慧'],
  Pisces: ['憐憫','夢想','平安']
};

function scoreChineseZodiac(given: string, cz?: string): { score: number; reason?: string } {
  if (!cz) return { score: 0 } as any;
  const elem = zodiacToElement[cz];
  if (!elem) return { score: 0 } as any;
  // 借用五行加分（較小權重）
  const s = scoreFiveElements(given, elem as any);
  return { score: Math.min(0.1, s.score * 0.8), reason: '生肖偏好' };
}

function scoreWesternZodiac(given: string, wz?: string): { score: number; reason?: string } {
  if (!wz) return { score: 0 } as any;
  const wants = new Set(westernZodiacTags[wz] || []);
  let hits = 0;
  for (const ch of given) {
    const tags: string[] = (tagsDict as any)[ch] || [];
    if (tags.some(t => wants.has(t))) hits++;
  }
  const score = Math.min(0.18, hits * 0.06);
  return { score, reason: '星座傾向' };
}

function hourToBranch(h: number): '子'|'丑'|'寅'|'卯'|'辰'|'巳'|'午'|'未'|'申'|'酉'|'戌'|'亥' {
  if (h >= 23 || h < 1) return '子';
  if (h < 3) return '丑';
  if (h < 5) return '寅';
  if (h < 7) return '卯';
  if (h < 9) return '辰';
  if (h < 11) return '巳';
  if (h < 13) return '午';
  if (h < 15) return '未';
  if (h < 17) return '申';
  if (h < 19) return '酉';
  if (h < 21) return '戌';
  return '亥';
}

const branchToElement: Record<string, 'wood'|'water'|'fire'|'earth'|'metal'> = {
  '子': 'water','丑': 'earth','寅': 'wood','卯': 'wood','辰': 'earth','巳': 'fire','午': 'fire','未': 'earth','申': 'metal','酉': 'metal','戌': 'earth','亥': 'water'
};

function scoreBaziHour(given: string, birthTime?: string): { score: number; reason?: string } {
  if (!birthTime) return { score: 0 } as any;
  const m = birthTime.match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (!m) return { score: 0 } as any;
  const hour = Math.max(0, Math.min(23, parseInt(m[1], 10)));
  const branch = hourToBranch(hour);
  const elem = branchToElement[branch];
  const s = scoreFiveElements(given, elem as any);
  return { score: Math.min(0.12, s.score), reason: '時辰五行' };
}

type Candidate = {
  given: string;
  strokes: number[];
  parts: any;
  reasons: string[];
  score: number;
};

// MMR 重排序：兼顧高分與差異性
function candidateSimilarity(a: Candidate, b: Candidate): number {
  if (a.given === b.given) return 1;
  const setA = new Set(Array.from(a.given));
  const setB = new Set(Array.from(b.given));
  const inter = Array.from(setA).filter(ch => setB.has(ch)).length;
  const union = new Set([...Array.from(setA), ...Array.from(setB)]).size || 1;
  let sim = inter / union; // 0~1
  // 首字相同提升相似度
  if (a.given[0] === b.given[0]) sim = Math.min(1, sim + 0.35);
  // 聲調序列相似加權
  const tonesA = Array.from(a.given).map(toneOf).filter(Boolean) as number[];
  const tonesB = Array.from(b.given).map(toneOf).filter(Boolean) as number[];
  if (tonesA.length && tonesB.length) {
    const samePos = Math.min(tonesA.length, tonesB.length);
    let eq = 0;
    for (let i = 0; i < samePos; i++) if (tonesA[i] === tonesB[i]) eq++;
    sim = Math.min(1, sim + (eq / samePos) * 0.3);
  }
  return Math.max(0, Math.min(1, sim));
}

function rerankWithMMR(cands: Candidate[], lambda = 0.8, k?: number): Candidate[] {
  if (cands.length <= 2) return cands;
  const picked: Candidate[] = [];
  const remain = [...cands].sort((a, b) => b.score - a.score);
  const targetK = Math.min(remain.length, k ?? remain.length);
  // 先選最高分
  picked.push(remain.shift()!);
  while (picked.length < targetK && remain.length) {
    let bestIdx = 0; let bestScore = -Infinity;
    for (let i = 0; i < remain.length; i++) {
      const c = remain[i];
      let maxSim = 0;
      for (const p of picked) maxSim = Math.max(maxSim, candidateSimilarity(c, p));
      const mmr = lambda * c.score - (1 - lambda) * maxSim;
      if (mmr > bestScore) { bestScore = mmr; bestIdx = i; }
    }
    picked.push(remain.splice(bestIdx, 1)[0]);
  }
  // 把未選的依原分數附在後面
  return [...picked, ...remain];
}

function buildCandidate(
  pickedSurname: string,
  given: string,
  strokes: number[],
  gender: 'male'|'female'|'unisex',
  region: Region,
  theme: NameTheme | undefined,
  w: { alpha: number; beta: number; gamma: number; delta: number; epsilon: number },
  pen: { homophone: number; sameTone: number; sameStructure: number; semanticConflict: number },
  pools: WeightedChar[],
  reqEra?: '1980s'|'1990s'|'2000s'|'2010s',
  style?: ChineseNameStyle,
  surnameTonePenaltyWeight = 1,
  homophonePolicy: 'block'|'penalize'|'ignore' = 'block',
  fivePref?: 'balanced' | 'wood' | 'water' | 'fire' | 'earth' | 'metal',
  crossRegionMix = 0,
  chineseZodiac?: string,
  westernZodiac?: string,
  birthTime?: string,
  enablePhonologyAesthetics?: boolean,
  structureDiversityWeight = 0,
  literaryPreference?: 'none'|'classic'|'poetic'|'virtue',
  familyGenerationChar?: string,
  familyGenerationPosition?: 'first'|'second',
  siblingNames?: string[],
  enableThreeFiveGrids?: boolean,
  uniquenessPreference = 0,
  additionalBlacklist?: string[],
  likedChars?: string[], likedBigrams?: string[], blockedChars?: string[], blockedBigrams?: string[], blockedNames?: string[]
): Candidate | null {
  const fullName = pickedSurname + given;
  if ((DATA_BLACKLIST as string[]).some(b => fullName.includes(b))) return null;
  if (additionalBlacklist && additionalBlacklist.some(t => fullName.includes(t))) return null;
  // 偏好：硬過濾
  if (applyPreferenceBlocks(fullName, given, { names: blockedNames, chars: blockedChars, bigrams: blockedBigrams })) return null;
  const homophoneHit = violatesHomophone(fullName);
  if (homophonePolicy === 'block' && homophoneHit) return null;

  const bigramScore = (given.length === 2 ? scoreBigramLaplace(given[0], given[1], region, gender, reqEra, crossRegionMix) : 0);
  const charsScore = cacheGetOrSet(CACHE_CHAR_WEIGHT, `${gender}|${given}`, () => charWeightScore(Array.from(given), gender));
  const phon = region === 'HK' ? scorePhoneticsYue(given) : scorePhonetics(given);
  const { score: themeScore, reason: themeReason } = scoreTheme(given, theme);
  const { score: synergy, conflict, reason: semReason } = cacheGetOrSet(CACHE_SEMANTIC, given, () => scoreSemanticSynergy(given));
  const styleScore = cacheGetOrSet(CACHE_STYLE, `${style || 'none'}|${given}`, () => scoreStyle(given, style));
  const five = scoreFiveElements(given, fivePref);
  const cz = scoreChineseZodiac(given, chineseZodiac);
  const wz = scoreWesternZodiac(given, westernZodiac);
  const bz = scoreBaziHour(given, birthTime);
  const phonAes = scorePhonologyAesthetics(given, enablePhonologyAesthetics);
  const lit = scoreLiterary(given, literaryPreference);
  const fam = scoreFamilyGeneration(given, familyGenerationChar, familyGenerationPosition);
  const sib = scoreSiblingSynergy(given, siblingNames);
  const tf = scoreThreeFiveGrids(pickedSurname, given, enableThreeFiveGrids);
  const pref = preferenceBonus(given, { chars: likedChars, bigrams: likedBigrams });
  const uniq = scoreUniqueness(given, region, uniquenessPreference);
  let eraRegionScore = 0;
  if (reqEra && given.length === 2) {
    const pair = getBigramsByFirst(region, given[0]).find(b => b.second === given[1]);
    if (pair?.era === reqEra) eraRegionScore = 0.08;
  }
  const strokeScore = scoreStrokes(strokes);

  const structurePen = sameStructurePenalty(Array.from(given), pools);
  const fullTonePen = scorePhoneticsFull(pickedSurname, given, region, Math.max(0, Math.min(1, surnameTonePenaltyWeight)));
  let penaltiesSum = structurePen.penalty + (phon.penalties.sameTone ? pen.sameTone : 0) + (pen.semanticConflict * conflict) + fullTonePen.penalty + uniq.penalty;
  if (homophonePolicy === 'penalize' && homophoneHit) penaltiesSum += Math.max(0.2, pen.homophone || 0.5);

  const semanticsTotal = themeScore + synergy + styleScore + five.score + cz.score + wz.score + bz.score + phonAes.score + lit.score + fam.score + sib.score + tf.score + pref.score;

  const total = (w.alpha * bigramScore)
    + (w.beta * (charsScore + 0.2 * strokeScore))
    + (w.gamma * phon.score)
    + (w.delta * semanticsTotal)
    + (w.epsilon * eraRegionScore)
    - penaltiesSum;

  const reasons: string[] = [];
  if (bigramScore > 0) reasons.push('常見雙字搭配');
  if (phon.reason) reasons.push(phon.reason);
  if (themeReason) reasons.push(themeReason);
  if (semReason) reasons.push(semReason);
  if (structurePen.reason) reasons.push(structurePen.reason);
  if (fullTonePen.reason) reasons.push(fullTonePen.reason);
  if (five.reason) reasons.push(five.reason);
  if (cz.reason) reasons.push(cz.reason as any);
  if (wz.reason) reasons.push(wz.reason as any);
  if (bz.reason) reasons.push(bz.reason as any);
  if (phonAes.reason) reasons.push('音韻/字形美學');
  if (lit.reason) reasons.push(lit.reason as any);
  if (fam.reason) reasons.push(fam.reason as any);
  if (sib.reason) reasons.push(sib.reason as any);
  if (tf.reason) reasons.push(tf.reason as any);
  if (pref.reason) reasons.push(pref.reason as any);
  if (uniq.reason) reasons.push(uniq.reason as any);

  const parts = {
    bigram: +(w.alpha * bigramScore).toFixed(3),
    chars: +(w.beta * (charsScore + 0.2 * strokeScore)).toFixed(3),
    phonetic: +(w.gamma * phon.score).toFixed(3),
    semantics: +(w.delta * semanticsTotal).toFixed(3),
    eraRegion: +(w.epsilon * eraRegionScore).toFixed(3),
    penalties: +penaltiesSum.toFixed(3),
    raw: { bigramScore, charsScore, strokeScore, phonScore: phon.score, themeScore, synergy, styleScore, eraRegionScore, fiveScore: five.score, chineseZodiacScore: cz.score, westernZodiacScore: wz.score, baziHourScore: bz.score },
    weightedStyle: +(w.delta * styleScore).toFixed(3),
    weightedEra: +(w.epsilon * eraRegionScore).toFixed(3),
    weightedFive: +(w.delta * five.score).toFixed(3),
    weightedZodiacCN: +(w.delta * cz.score).toFixed(3),
    weightedZodiacWest: +(w.delta * wz.score).toFixed(3),
    weightedBaziHour: +(w.delta * bz.score).toFixed(3),
    weightedPhonAes: +(w.delta * phonAes.score).toFixed(3),
    weightedLiterary: +(w.delta * lit.score).toFixed(3),
    weightedFamilyGen: +(w.delta * fam.score).toFixed(3),
    weightedSibling: +(w.delta * sib.score).toFixed(3),
    weightedThreeFive: +(w.delta * tf.score).toFixed(3),
    weightedPreference: +(w.delta * pref.score).toFixed(3),
  };

  return { given, strokes, score: total, parts, reasons };
}

function generateCandidatesRandom(
  pickedSurname: string,
  pools: WeightedChar[],
  filterOpts: Required<Pick<NameRequest, 'avoidRareChars'>> & Pick<NameRequest, 'maxStrokePerChar'>,
  trials: number,
  rnd: () => number,
  gender: 'male'|'female'|'unisex',
  region: Region,
  theme: NameTheme | undefined,
  w: any,
  pen: any,
  allowSingleGiven?: boolean,
  reqEra?: '1980s'|'1990s'|'2000s'|'2010s',
  style?: ChineseNameStyle,
  surnameTonePenaltyWeight = 1,
  homophonePolicy: 'block'|'penalize'|'ignore' = 'block',
  fivePref?: 'balanced'|'wood'|'water'|'fire'|'earth'|'metal',
  crossRegionMix = 0,
  chineseZodiac?: string,
  westernZodiac?: string,
  birthTime?: string,
  familyGenerationChar?: string,
  familyGenerationPosition?: 'first'|'second',
  enablePhonologyAesthetics?: boolean,
  structureDiversityWeight = 0,
  literaryPreference?: 'none'|'classic'|'poetic'|'virtue',
  siblingNames?: string[],
  enableThreeFiveGrids?: boolean,
  uniquenessPreference = 0,
  additionalBlacklist?: string[],
  likedChars?: string[], likedBigrams?: string[], blockedChars?: string[], blockedBigrams?: string[], blockedNames?: string[]
): Candidate[] {
  const cands: Candidate[] = [];
  for (let i = 0; i < trials; i++) {
    const givenLength = allowSingleGiven ? (rnd() < 0.3 ? 1 : 2) : 2;
    // 強制/偏好字輩位置
    let first: WeightedChar | undefined;
    if (familyGenerationChar && familyGenerationPosition === 'first') {
      first = pools.find(c => c.char === familyGenerationChar);
      if (!first) first = pickGivenChar(pools, filterOpts, rnd);
    } else {
      first = pickGivenChar(pools, filterOpts, rnd);
    }
    if (!first) continue;
    let given = first.char;
    const strokes: number[] = [first.strokes || 0];
    if (givenLength === 2) {
      let second: WeightedChar | undefined;
      if (familyGenerationChar && familyGenerationPosition === 'second' && familyGenerationChar !== first.char) {
        second = pools.find(c => c.char === familyGenerationChar) || undefined;
      }
      if (!second) {
        second = pickSecondByBigram(first.char, pools, rnd, region, gender, reqEra, crossRegionMix) || pickGivenChar(pools, filterOpts, rnd) || first;
      }
      if (second && second.char !== first.char) {
        given = first.char + second.char;
        strokes.push(second.strokes || 0);
      }
    }
    const cand = buildCandidate(pickedSurname, given, strokes, gender, region, theme, w, pen, pools, reqEra, style, surnameTonePenaltyWeight, homophonePolicy, fivePref, crossRegionMix, chineseZodiac, westernZodiac, birthTime, enablePhonologyAesthetics, structureDiversityWeight, literaryPreference, familyGenerationChar, familyGenerationPosition, siblingNames, enableThreeFiveGrids, uniquenessPreference, additionalBlacklist, likedChars, likedBigrams, blockedChars, blockedBigrams, blockedNames);
    if (cand) cands.push(cand);
  }
  return cands;
}

function generateCandidatesBeam(
  pickedSurname: string,
  pools: WeightedChar[],
  gender: 'male'|'female'|'unisex',
  region: Region,
  theme: NameTheme | undefined,
  beamSize: number,
  w: any,
  pen: any,
  diversityPenalty = 0.05,
  allowSingleGiven?: boolean,
  reqEra?: '1980s'|'1990s'|'2000s'|'2010s',
  style?: ChineseNameStyle,
  surnameTonePenaltyWeight = 1,
  homophonePolicy: 'block'|'penalize'|'ignore' = 'block',
  fivePref?: 'balanced'|'wood'|'water'|'fire'|'earth'|'metal',
  crossRegionMix = 0,
  chineseZodiac?: string,
  westernZodiac?: string,
  birthTime?: string,
  familyGenerationChar?: string,
  familyGenerationPosition?: 'first'|'second',
  enablePhonologyAesthetics?: boolean,
  structureDiversityWeight = 0,
  literaryPreference?: 'none'|'classic'|'poetic'|'virtue',
  siblingNames?: string[],
  enableThreeFiveGrids?: boolean,
  uniquenessPreference = 0,
  additionalBlacklist?: string[],
  likedChars?: string[], likedBigrams?: string[], blockedChars?: string[], blockedBigrams?: string[], blockedNames?: string[]
): Candidate[] {
  const sortedPool = [...pools].sort((a, b) => (b.weight || 0) - (a.weight || 0));
  let firstList = sortedPool.slice(0, Math.max(3, Math.min(beamSize, 20)));
  if (familyGenerationChar && familyGenerationPosition === 'first') {
    const forced = pools.find(p => p.char === familyGenerationChar);
    if (forced) firstList = [forced, ...firstList.filter(x => x.char !== forced.char)].slice(0, Math.max(3, Math.min(beamSize, 20)));
  }
  const cands: Candidate[] = [];
  for (const f of firstList) {
    if (allowSingleGiven) {
      const single = buildCandidate(pickedSurname, f.char, [f.strokes || 0], gender, region, theme, w, pen, pools, reqEra, style, surnameTonePenaltyWeight, homophonePolicy, fivePref, crossRegionMix, chineseZodiac, westernZodiac, birthTime, enablePhonologyAesthetics, structureDiversityWeight, literaryPreference, familyGenerationChar, familyGenerationPosition, siblingNames, enableThreeFiveGrids, uniquenessPreference, additionalBlacklist, likedChars, likedBigrams, blockedChars, blockedBigrams, blockedNames);
      if (single) cands.push(single);
    }
    const matches = getBigramsMixedByFirst(region, f.char, crossRegionMix).sort((a, b) => (b.weight || 0) - (a.weight || 0));
    let secondChars = matches.slice(0, Math.max(3, Math.min(beamSize, 20))).map(m => pools.find(p => p.char === m.second)).filter(Boolean) as WeightedChar[];
    if (familyGenerationChar && familyGenerationPosition === 'second') {
      const forced2 = pools.find(p => p.char === familyGenerationChar && p.char !== f.char);
      if (forced2) secondChars = [forced2, ...secondChars.filter(x => x!.char !== forced2.char)];
    }
    const fallback = sortedPool.filter(p => p.char !== f.char).slice(0, 5);
    const seconds = (secondChars.length ? secondChars : fallback);
    for (const s of seconds) {
      const given = f.char + s.char;
      const strokes = [f.strokes || 0, s.strokes || 0];
      const cand = buildCandidate(pickedSurname, given, strokes, gender, region, theme, w, pen, pools, reqEra, style, surnameTonePenaltyWeight, homophonePolicy, fivePref, crossRegionMix, chineseZodiac, westernZodiac, birthTime, enablePhonologyAesthetics, structureDiversityWeight, literaryPreference, familyGenerationChar, familyGenerationPosition, siblingNames, enableThreeFiveGrids, uniquenessPreference, additionalBlacklist, likedChars, likedBigrams, blockedChars, blockedBigrams, blockedNames);
      if (cand) cands.push(cand);
    }
  }
  // diversity 懲罰同首字
  const seen = new Map<string, number>();
  for (const c of cands) {
    const key = c.given[0];
    const k = (seen.get(key) || 0) + 1;
    seen.set(key, k);
    c.score -= Math.max(0, k - 1) * Math.max(0, diversityPenalty);
  }
  return cands.sort((a, b) => b.score - a.score).slice(0, Math.max(beamSize * 4, allowSingleGiven ? beamSize * 4 + 3 : beamSize * 4));
}

export function generateChineseName(req: NameRequest = {}): GeneratedName {
  const {
    gender = 'unisex',
    region = 'TW',
    theme,
    surname,
    allowSingleGiven = false,
    maxStrokePerChar,
    avoidRareChars = true,
    seed,
    candidateCount = 64,
    weights,
    penalties,
    selectionMode = 'max',
    temperature = 0.7,
    topK = 50,
    topP = 0.9,
    beamSize = 0,
    diversityPenalty = 0.05,
    era,
    style,
    homophonePolicy = 'block',
    surnameTonePenaltyWeight = 1,
    fiveElementPreference,
    crossRegionMix = 0,
    chineseZodiac,
    westernZodiac,
    birthTime,
    enablePhonologyAesthetics,
    structureDiversityWeight = 0,
    literaryPreference = 'none',
    familyGenerationChar,
    siblingNames,
    enableThreeFiveGrids,
    uniquenessPreference = 0,
    additionalBlacklist,
    familyGenerationPosition,
    likedChars, likedBigrams, blockedChars, blockedBigrams, blockedNames,
  } = req as any;

  const w = { alpha: 0.5, beta: 0.2, gamma: 0.15, delta: 0.1, epsilon: 0.05 };
  Object.assign(w, weights);
  const pen = { homophone: 0.5, sameTone: 0.2, sameStructure: 0.1, semanticConflict: 0.15 };
  Object.assign(pen, penalties);

  const rnd = createRng(seed);
  const surnames = getRegionSurnames(region);
  const providedSurname = (typeof surname === 'string' && surname.trim()) ? surname.trim() : '';
  const pickedSurname = providedSurname || (surnames.length ? sampleWeighted(surnames, rnd).surname : '陳');

  const pools: WeightedChar[] = [];
  if (gender === 'male') pools.push(...(DATA_GIVEN_MALE as WeightedChar[]));
  else if (gender === 'female') pools.push(...(DATA_GIVEN_FEMALE as WeightedChar[]));
  else pools.push(...(DATA_GIVEN_UNISEX as WeightedChar[]));
  if (gender !== 'unisex') pools.push(...(DATA_GIVEN_UNISEX as WeightedChar[]).map(c => ({ ...c, weight: Math.max(1, Math.floor((c.weight || 1) * 0.6)) })));

  const filterOpts = { avoidRareChars, maxStrokePerChar } as const;

  let candidates: Candidate[] = [];
  if (beamSize && beamSize > 0) {
    candidates = generateCandidatesBeam(
      pickedSurname, pools, gender, region, theme, beamSize, w, pen, diversityPenalty, allowSingleGiven, era, style,
      surnameTonePenaltyWeight, homophonePolicy, fiveElementPreference, crossRegionMix, chineseZodiac, westernZodiac, birthTime,
      familyGenerationChar, familyGenerationPosition,
      enablePhonologyAesthetics, structureDiversityWeight, literaryPreference, siblingNames, enableThreeFiveGrids, uniquenessPreference, additionalBlacklist,
      likedChars, likedBigrams, blockedChars, blockedBigrams, blockedNames
    ).map(c => buildCandidate(
      pickedSurname, c.given, c.strokes, gender, region, theme, w, pen, pools, era, style, surnameTonePenaltyWeight,
      homophonePolicy, fiveElementPreference, crossRegionMix, chineseZodiac, westernZodiac, birthTime,
      enablePhonologyAesthetics, structureDiversityWeight, literaryPreference, familyGenerationChar, familyGenerationPosition, siblingNames, enableThreeFiveGrids, uniquenessPreference, additionalBlacklist,
      likedChars, likedBigrams, blockedChars, blockedBigrams, blockedNames
    )!).filter(Boolean) as Candidate[];
  } else {
    const trials = Math.max(16, candidateCount);
    candidates = generateCandidatesRandom(
      pickedSurname, pools, filterOpts, trials, rnd, gender, region, theme, w, pen, allowSingleGiven, era, style,
      surnameTonePenaltyWeight, homophonePolicy, fiveElementPreference, crossRegionMix, chineseZodiac, westernZodiac, birthTime,
      familyGenerationChar, familyGenerationPosition,
      enablePhonologyAesthetics, structureDiversityWeight, literaryPreference, siblingNames, enableThreeFiveGrids, uniquenessPreference, additionalBlacklist,
      likedChars, likedBigrams, blockedChars, blockedBigrams, blockedNames
    ).map(c => buildCandidate(
      pickedSurname, c.given, c.strokes, gender, region, theme, w, pen, pools, era, style, surnameTonePenaltyWeight,
      homophonePolicy, fiveElementPreference, crossRegionMix, chineseZodiac, westernZodiac, birthTime,
      enablePhonologyAesthetics, structureDiversityWeight, literaryPreference, familyGenerationChar, familyGenerationPosition, siblingNames, enableThreeFiveGrids, uniquenessPreference, additionalBlacklist,
      likedChars, likedBigrams, blockedChars, blockedBigrams, blockedNames
    )!).filter(Boolean) as Candidate[];
  }

  // 使用 MMR 對候選重排序，提升多樣性
  candidates = rerankWithMMR(candidates, 0.8);

  if (candidates.length === 0) {
    const f = pickGivenChar(pools, filterOpts, rnd);
    const g = f ? f.char : '安';
    return {
      fullName: pickedSurname + g,
      surname: pickedSurname,
      givenName: g,
      totalStrokes: f?.strokes,
      meta: { region, gender, strategy: 'fallback' }
    };
  }

  let chosen: Candidate;
  if (selectionMode === 'sample') {
    const picked = softmaxSample(candidates, rnd, temperature, topK, topP) as Candidate;
    chosen = picked || candidates[0];
  } else {
    chosen = candidates.sort((a, b) => b.score - a.score)[0];
  }

  const fullName2 = pickedSurname + chosen.given;
  const roman = region === 'HK' ? toJyutping(fullName2) : toPinyin(fullName2);
  return {
    fullName: fullName2,
    surname: pickedSurname,
    givenName: chosen.given,
    totalStrokes: chosen.strokes.reduce((a, b) => a + b, 0),
    meta: {
      region,
      gender,
      score: +chosen.score.toFixed(3),
      strokes: chosen.strokes,
      parts: chosen.parts,
      reasons: chosen.reasons,
      theme,
      style,
      era,
      chineseZodiac,
      westernZodiac,
      birthTime,
      romanization: roman,
      strategy: beamSize > 0 ? 'beam' : (selectionMode === 'sample' ? 'sample' : 'max'),
      params: { temperature, topK, topP, beamSize, diversityPenalty, homophonePolicy, surnameTonePenaltyWeight, fiveElementPreference, crossRegionMix }
    }
  };
} 