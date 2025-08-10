import { useEffect, useMemo, useRef, useState } from 'react';

export interface GenerateParams {
  gender?: 'male'|'female'|'unisex';
  surname?: string;
  allowSingleGiven?: boolean;
  maxStrokePerChar?: number;
  avoidRareChars?: boolean;
  seed?: string;
  theme?: any;
  region?: 'TW'|'HK'|'CN';
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
  // 進階模組
  enablePhonologyAesthetics?: boolean;
  structureDiversityWeight?: number;
  literaryPreference?: 'none'|'classic'|'poetic'|'virtue';
  familyGenerationChar?: string;
  familyGenerationPosition?: 'first'|'second';
  siblingNames?: string[];
  enableThreeFiveGrids?: boolean;
  uniquenessPreference?: number;
  additionalBlacklist?: string[];
  // 偏好學習
  likedChars?: string[];
  likedBigrams?: string[]; // 'AB'
  blockedChars?: string[];
  blockedBigrams?: string[];
  blockedNames?: string[];
  // 權重
  weights?: { alpha?: number; beta?: number; gamma?: number; delta?: number; epsilon?: number };
  batch?: number;
}

export function useNameWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL('../workers/nameWorker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const warmup = useMemo(() => {
    return async (region: 'TW'|'HK'|'CN') => {
      return new Promise<void>((resolve) => {
        const worker = workerRef.current;
        if (!worker) return resolve();
        const onMessage = (e: MessageEvent<any>) => {
          if (e.data?.type === 'warmed') {
            cleanup();
            resolve();
          }
        };
        const cleanup = () => worker.removeEventListener('message', onMessage as any);
        worker.addEventListener('message', onMessage as any);
        worker.postMessage({ type: 'warmup', payload: { region } });
        setTimeout(() => { cleanup(); resolve(); }, 1500);
      });
    };
  }, []);

  const generate = useMemo(() => {
    return (params: GenerateParams): Promise<Array<{ name: string; reasons: string; roman?: string; meta?: any }>> => {
      return new Promise((resolve, reject) => {
        setLoading(true);
        setError(null);
        const worker = workerRef.current;
        if (!worker) {
          setLoading(false);
          reject(new Error('Worker not initialized'));
          return;
        }
        const onMessage = (e: MessageEvent<any>) => {
          const data = e.data;
          if (data?.type === 'result') {
            resolve(data.payload);
            cleanup();
          } else if (data?.type === 'error') {
            setError(data.message || 'Unknown error');
            reject(new Error(data.message || 'Unknown error'));
            cleanup();
          }
        };
        const cleanup = () => {
          setLoading(false);
          worker.removeEventListener('message', onMessage as any);
        };
        worker.addEventListener('message', onMessage as any);
        worker.postMessage({ type: 'generate', payload: params });
      });
    };
  }, []);

  return { generate, loading, error, warmup } as const;
} 