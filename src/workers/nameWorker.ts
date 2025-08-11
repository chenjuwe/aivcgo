/// <reference lib="webworker" />

import { generateChineseName, NameTheme, ensureRegionData } from '@/utils/nameGenerator';

type Region = 'TW'|'HK'|'CN';

type RequestPayload = {
  gender?: 'male'|'female'|'unisex';
  surname?: string;
  allowSingleGiven?: boolean;
  maxStrokePerChar?: number;
  avoidRareChars?: boolean;
  seed?: string;
  theme?: NameTheme;
  region?: Region;
  style?: 'classic'|'modern'|'literary'|'neutral';
  candidateCount?: number;
  selectionMode?: 'max'|'sample';
  temperature?: number;
  topK?: number;
  topP?: number;
  beamSize?: number;
  diversityPenalty?: number;
  era?: '1980s'|'1990s'|'2000s'|'2010s';
  homophonePolicy?: 'block'|'penalize'|'ignore';
  surnameTonePenaltyWeight?: number;
  fiveElementPreference?: 'balanced'|'wood'|'water'|'fire'|'earth'|'metal';
  crossRegionMix?: number;
  chineseZodiac?: '鼠'|'牛'|'虎'|'兔'|'龍'|'蛇'|'馬'|'羊'|'猴'|'雞'|'狗'|'豬';
  westernZodiac?: 'Aries'|'Taurus'|'Gemini'|'Cancer'|'Leo'|'Virgo'|'Libra'|'Scorpio'|'Sagittarius'|'Capricorn'|'Aquarius'|'Pisces';
  birthTime?: string;
  enablePhonologyAesthetics?: boolean;
  structureDiversityWeight?: number;
  literaryPreference?: 'none'|'classic'|'poetic'|'virtue';
  familyGenerationChar?: string;
  familyGenerationPosition?: 'first'|'second';
  siblingNames?: string[];
  enableThreeFiveGrids?: boolean;
  uniquenessPreference?: number;
  additionalBlacklist?: string[];
  likedChars?: string[];
  likedBigrams?: string[];
  blockedChars?: string[];
  blockedBigrams?: string[];
  blockedNames?: string[];
  weights?: { alpha?: number; beta?: number; gamma?: number; delta?: number; epsilon?: number };
  batch?: number; // 1 表示單次
};

type InMsg = 
  | { type: 'generate'; payload: RequestPayload }
  | { type: 'warmup'; payload: { region: Region } };

type OutMsg =
  | { type: 'result'; payload: Array<{ name: string; reasons: string; roman?: string; meta?: any }> }
  | { type: 'warmed'; payload: { region: Region } }
  | { type: 'error'; message: string };

const ctx: DedicatedWorkerGlobalScope = self as any;

function getGiven(name: string): string {
  return name ? name.slice(1) : name;
}

function simGiven(a: string, b: string): number {
  if (a === b) return 1;
  let s = 0;
  if (a[0] && b[0] && a[0] === b[0]) s += 0.5;
  const setA = new Set(Array.from(a));
  const setB = new Set(Array.from(b));
  const inter = Array.from(setA).filter(ch => setB.has(ch)).length;
  const union = new Set([...Array.from(setA), ...Array.from(setB)]).size || 1;
  s += inter / union * 0.5;
  return Math.min(1, s);
}

function mmrRerankBatch<T extends { name: string; meta?: any }>(items: T[], lambda = 0.8): T[] {
  if (items.length <= 2) return items;
  const remain: T[] = [...items];
  const picked: T[] = [];
  // 以 meta.score 排序初選
  remain.sort((a, b) => ((b.meta?.score ?? 0) - (a.meta?.score ?? 0)));
  picked.push(remain.shift()!);
  while (remain.length) {
    let bestIdx = 0; let bestScore = -Infinity;
    for (let i = 0; i < remain.length; i++) {
      const g = getGiven(remain[i].name);
      let maxSim = 0;
      for (const p of picked) maxSim = Math.max(maxSim, simGiven(g, getGiven(p.name)));
      const base = (remain[i].meta?.score ?? 0);
      const mmr = lambda * base - (1 - lambda) * maxSim;
      if (mmr > bestScore) { bestScore = mmr; bestIdx = i; }
    }
    picked.push(remain.splice(bestIdx, 1)[0]);
  }
  // 去重同一個 given
  const seen = new Set<string>();
  const uniq: T[] = [];
  for (const it of picked) {
    const g = getGiven(it.name);
    if (seen.has(g)) continue;
    seen.add(g);
    uniq.push(it);
  }
  return uniq;
}

ctx.onmessage = async (e: MessageEvent<InMsg>) => {
  try {
    const msg = e.data;
    if (msg.type === 'warmup') {
      const region = msg.payload.region || 'TW';
      await ensureRegionData(region);
      ctx.postMessage({ type: 'warmed', payload: { region } } as OutMsg);
      return;
    }
    if (msg.type !== 'generate') return;
    const payload = msg.payload;
    const region = payload.region || 'TW';
    await ensureRegionData(region as Region);
    const batch = Math.max(1, payload.batch || 1);
    let results: Array<{ name: string; reasons: string; roman?: string; meta?: any }> = [];
    for (let i = 0; i < batch; i++) {
      const n = generateChineseName({
        gender: payload.gender,
        allowSingleGiven: payload.allowSingleGiven,
        maxStrokePerChar: payload.maxStrokePerChar,
        avoidRareChars: payload.avoidRareChars,
        seed: (payload.seed || Math.random().toString()) + (batch > 1 ? '_' + i : ''),
        theme: payload.theme,
        region: region as Region,
        surname: payload.surname,
        style: payload.style,
        candidateCount: payload.candidateCount,
        selectionMode: payload.selectionMode,
        temperature: payload.temperature,
        topK: payload.topK,
        topP: payload.topP,
        beamSize: payload.beamSize,
        diversityPenalty: payload.diversityPenalty,
        era: payload.era,
        homophonePolicy: payload.homophonePolicy,
        surnameTonePenaltyWeight: payload.surnameTonePenaltyWeight,
        fiveElementPreference: payload.fiveElementPreference,
        crossRegionMix: payload.crossRegionMix,
        chineseZodiac: payload.chineseZodiac,
        westernZodiac: payload.westernZodiac,
        birthTime: payload.birthTime,
        enablePhonologyAesthetics: payload.enablePhonologyAesthetics,
        structureDiversityWeight: payload.structureDiversityWeight,
        literaryPreference: payload.literaryPreference,
        familyGenerationChar: payload.familyGenerationChar,
        familyGenerationPosition: payload.familyGenerationPosition,
        siblingNames: payload.siblingNames,
        enableThreeFiveGrids: payload.enableThreeFiveGrids,
        uniquenessPreference: payload.uniquenessPreference,
        additionalBlacklist: payload.additionalBlacklist,
        likedChars: payload.likedChars,
        likedBigrams: payload.likedBigrams,
        blockedChars: payload.blockedChars,
        blockedBigrams: payload.blockedBigrams,
        blockedNames: payload.blockedNames,
        weights: payload.weights,
      });
      results.push({ name: n.fullName, reasons: Array.isArray(n.meta?.reasons) ? (n.meta?.reasons as string[]).join('、') : (n.meta?.reasons || ''), roman: (n.meta as any)?.romanization, meta: n.meta });
    }
    // 跨批次 MMR + 去重同名
    results = mmrRerankBatch(results).slice(0, batch);
    const out: OutMsg = { type: 'result', payload: results };
    ctx.postMessage(out);
  } catch (err: any) {
    ctx.postMessage({ type: 'error', message: err?.message || String(err) } as OutMsg);
  }
}; 