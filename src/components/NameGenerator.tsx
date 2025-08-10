import { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { NameTheme } from '@/utils/nameGenerator';
import { useNameWorker } from '@/hooks/useNameWorker';

export function NameGenerator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [surname, setSurname] = useState<string>('');
  const [allowSingle, setAllowSingle] = useState(false);
  const [maxStrokes, setMaxStrokes] = useState<number | ''>('');
  const [avoidRare, setAvoidRare] = useState(true);
  const [seed, setSeed] = useState<string>('');
  const [theme, setTheme] = useState<NameTheme | ''>('');
  const [candidateCount, setCandidateCount] = useState(96);
  const [region, setRegion] = useState<'TW'|'HK'|'CN'>('TW');
  const [style, setStyle] = useState<'classic'|'modern'|'literary'|'neutral'>('neutral');

  const [selectionMode, setSelectionMode] = useState<'max'|'sample'>('max');
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(50);
  const [topP, setTopP] = useState(0.9);
  const [beamSize, setBeamSize] = useState(0);
  const [diversityPenalty, setDiversityPenalty] = useState(0.05);
  const [era, setEra] = useState<'1980s'|'1990s'|'2000s'|'2010s'|''>('');
  const [homophonePolicy, setHomophonePolicy] = useState<'block'|'penalize'|'ignore'>('block');
  const [surnameTonePenaltyWeight, setSurnameTonePenaltyWeight] = useState(1);
  const [fiveElementPreference, setFiveElementPreference] = useState<'balanced'|'wood'|'water'|'fire'|'earth'|'metal'|'none'>('none');
  const [crossRegionMix, setCrossRegionMix] = useState(0);
  const [chineseZodiac, setChineseZodiac] = useState<'鼠'|'牛'|'虎'|'兔'|'龍'|'蛇'|'馬'|'羊'|'猴'|'雞'|'狗'|'豬'|''>('');
  const [westernZodiac, setWesternZodiac] = useState<'Aries'|'Taurus'|'Gemini'|'Cancer'|'Leo'|'Virgo'|'Libra'|'Scorpio'|'Sagittarius'|'Capricorn'|'Aquarius'|'Pisces'|''>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('');
  const [customWeights, setCustomWeights] = useState<{ alpha?: number; beta?: number; gamma?: number; delta?: number; epsilon?: number } | undefined>(undefined);
  const [enablePhonologyAesthetics, setEnablePhonologyAesthetics] = useState(false);
  const [literaryPreference, setLiteraryPreference] = useState<'none'|'classic'|'poetic'|'virtue'>('none');
  const [familyGenerationChar, setFamilyGenerationChar] = useState<string>('');
  const [familyGenerationPosition, setFamilyGenerationPosition] = useState<'first'|'second'>('first');
  const [siblingNamesText, setSiblingNamesText] = useState<string>('');
  const [enableThreeFiveGrids, setEnableThreeFiveGrids] = useState(false);
  const [uniquenessPreference, setUniquenessPreference] = useState(0);
  const [additionalBlacklistText, setAdditionalBlacklistText] = useState<string>('');
  // 偏好學習（本地）
  const [likedChars, setLikedChars] = useState<string[]>(() => JSON.parse(localStorage.getItem('prefs.likedChars') || '[]'));
  const [likedBigrams, setLikedBigrams] = useState<string[]>(() => JSON.parse(localStorage.getItem('prefs.likedBigrams') || '[]'));
  const [blockedChars, setBlockedChars] = useState<string[]>(() => JSON.parse(localStorage.getItem('prefs.blockedChars') || '[]'));
  const [blockedBigrams, setBlockedBigrams] = useState<string[]>(() => JSON.parse(localStorage.getItem('prefs.blockedBigrams') || '[]'));
  const [blockedNames, setBlockedNames] = useState<string[]>(() => JSON.parse(localStorage.getItem('prefs.blockedNames') || '[]'));
  useEffect(() => { localStorage.setItem('prefs.likedChars', JSON.stringify(likedChars)); }, [likedChars]);
  useEffect(() => { localStorage.setItem('prefs.likedBigrams', JSON.stringify(likedBigrams)); }, [likedBigrams]);
  useEffect(() => { localStorage.setItem('prefs.blockedChars', JSON.stringify(blockedChars)); }, [blockedChars]);
  useEffect(() => { localStorage.setItem('prefs.blockedBigrams', JSON.stringify(blockedBigrams)); }, [blockedBigrams]);
  useEffect(() => { localStorage.setItem('prefs.blockedNames', JSON.stringify(blockedNames)); }, [blockedNames]);

  // 對比視圖（最多 4 個）
  const [compare, setCompare] = useState<Array<{ name: string; parts?: any }>>([]);
  const toggleCompare = (item: { name: string; parts?: any }) => {
    setCompare(prev => {
      const exists = prev.find(x => x.name === item.name);
      if (exists) return prev.filter(x => x.name !== item.name);
      if (prev.length >= 4) return prev; // 最多 4 筆
      return [...prev, item];
    });
  };
  const compareMetrics: Array<{ key: string; label: string; negate?: boolean }> = [
    { key: 'bigram', label: '雙字搭配' },
    { key: 'chars', label: '字頻/筆畫' },
    { key: 'phonetic', label: '音韻' },
    { key: 'semantics', label: '語義綜合' },
    { key: 'eraRegion', label: '年代/區域' },
    { key: 'penalties', label: '懲罰扣分', negate: true },
    { key: 'weightedStyle', label: '風格加分' },
    { key: 'weightedEra', label: '年代加分' },
    { key: 'weightedFive', label: '五行加分' },
    { key: 'weightedZodiacCN', label: '生肖加分' },
    { key: 'weightedZodiacWest', label: '星座加分' },
    { key: 'weightedBaziHour', label: '時辰加分' },
    { key: 'weightedPhonAes', label: '音韻美學' },
    { key: 'weightedLiterary', label: '文學偏好' },
    { key: 'weightedFamilyGen', label: '字輩加分' },
    { key: 'weightedSibling', label: '手足呼應' },
    { key: 'weightedThreeFive', label: '三才五格' },
    { key: 'weightedPreference', label: '偏好加權' },
  ];

  const [result, setResult] = useState<{ name: string; reasons: string; roman?: string; parts?: any } | null>(null);
  const [batch, setBatch] = useState<{ name: string; reasons: string; roman?: string; parts?: any }[]>([]);
  const [copied, setCopied] = useState(false);
  const { generate, loading, warmup } = useNameWorker();

  useEffect(() => { warmup('TW'); }, []);
  useEffect(() => { warmup(region); }, [region]);

  const applyPreset = (p: 'tw_classic'|'hk_modern'|'cn_era90s'|'bazi_focus') => {
    if (p === 'tw_classic') {
      setRegion('TW'); setStyle('classic'); setSelectionMode('max'); setBeamSize(5); setTemperature(0.6); setTopK(40); setTopP(0.85); setDiversityPenalty(0.05); setEra('');
      setCustomWeights(undefined);
    } else if (p === 'hk_modern') {
      setRegion('HK'); setStyle('modern'); setSelectionMode('sample'); setBeamSize(6); setTemperature(0.8); setTopK(60); setTopP(0.9); setDiversityPenalty(0.08); setEra('2010s');
      setCustomWeights(undefined);
    } else if (p === 'cn_era90s') {
      setRegion('CN'); setStyle('neutral'); setSelectionMode('max'); setBeamSize(4); setTemperature(0.7); setTopK(50); setTopP(0.9); setDiversityPenalty(0.06); setEra('1990s');
      setCustomWeights(undefined);
    } else if (p === 'bazi_focus') {
      // 強化語義（含五行/生肖/星座/時辰），略降 bigram 權重
      setSelectionMode('max');
      setBeamSize(5);
      setTemperature(0.6);
      setTopK(50);
      setTopP(0.9);
      setCustomWeights({ alpha: 0.35, beta: 0.2, gamma: 0.15, delta: 0.25, epsilon: 0.05 });
    }
  };

  function inferWesternZodiac(month: number, day: number): typeof westernZodiac {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    return 'Pisces';
  }

  function inferChineseZodiac(year: number): typeof chineseZodiac {
    const z = ['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'] as const;
    const base = 2008; // 鼠
    const idx = ((year - base) % 12 + 12) % 12;
    return z[idx];
  }

  useEffect(() => {
    if (!birthDate) {
      setChineseZodiac('');
      setWesternZodiac('');
      return;
    }
    const d = new Date(birthDate);
    if (isNaN(d.getTime())) return;
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const wz = inferWesternZodiac(m, day);
    const cz = inferChineseZodiac(y);
    setWesternZodiac(wz);
    setChineseZodiac(cz);
  }, [birthDate]);

  const handleGenerate = async (withBatch = false) => {
    setCopied(false);
    const common = {
      gender,
      surname: surname || undefined,
      allowSingleGiven: allowSingle,
      maxStrokePerChar: typeof maxStrokes === 'number' ? maxStrokes : undefined,
      avoidRareChars: avoidRare,
      seed: seed || undefined,
      theme: theme || undefined,
      region,
      style,
      candidateCount,
      selectionMode,
      temperature,
      topK,
      topP,
      beamSize,
      diversityPenalty,
      era: era || undefined,
      homophonePolicy,
      surnameTonePenaltyWeight,
      fiveElementPreference: fiveElementPreference === 'none' ? undefined : fiveElementPreference,
      crossRegionMix,
      chineseZodiac: chineseZodiac || undefined,
      westernZodiac: westernZodiac || undefined,
      birthTime: birthTime || undefined,
      weights: customWeights,
      enablePhonologyAesthetics,
      literaryPreference,
      familyGenerationChar: familyGenerationChar || undefined,
      familyGenerationPosition,
      siblingNames: siblingNamesText ? siblingNamesText.split(/[，,\n\s]+/).filter(Boolean) : undefined,
      enableThreeFiveGrids,
      uniquenessPreference,
      additionalBlacklist: additionalBlacklistText ? additionalBlacklistText.split(/[，,\n\s]+/).filter(Boolean) : undefined,
      likedChars, likedBigrams, blockedChars, blockedBigrams, blockedNames,
    } as const;

    if (withBatch) {
      const res = await generate({ ...common, batch: 10 });
      const mapped = res.map(r => ({ name: r.name, reasons: r.reasons, roman: r.roman, parts: r.meta?.parts }));
      setBatch(mapped);
      // 自動把首筆納入對比
      if (mapped[0]) setCompare(c => (c.find(x => x.name === mapped[0].name) ? c : [...c, { name: mapped[0].name, parts: mapped[0].parts }]).slice(0,4));
      setResult(res[0] ? { name: res[0].name, reasons: res[0].reasons, roman: res[0].roman, parts: res[0].meta?.parts } : null);
    } else {
      const res = await generate({ ...common, batch: 1 });
      const r = res[0];
      setResult(r ? { name: r.name, reasons: r.reasons, roman: r.roman, parts: r.meta?.parts } : null);
      setBatch([]);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          <Sparkles className="inline mr-2 text-purple-600" />
          中文姓名生成器
        </h1>
        <p className="text-gray-600">依性別、主題、筆畫等偏好，一鍵產生高品質中文姓名</p>
      </div>

      {/* 設定區 */}
      <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">姓氏（可輸入覆蓋隨機）</label>
              <div className="flex items-center gap-3">
                <input value={surname} onChange={(e)=>setSurname(e.target.value)} placeholder="例如：陳" className="px-3 py-2 border rounded-md w-60 h-10" />
                {surname && <button onClick={()=>setSurname('')} className="text-xs text-gray-600 hover:underline">清除</button>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
              <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
                {([
                  { v: 'male', l: '男性' },
                  { v: 'female', l: '女性' },
                ] as const).map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => setGender(opt.v)}
                    className={`py-2 px-3 rounded-md text-sm font-medium border ${gender === opt.v ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* 生日快速填入 */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">生日（輸入後自動推算）</label>
              <div className="flex items-center gap-3">
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="px-3 py-2 border rounded-md w-full md:w-60 h-10" />
                <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} className="px-3 py-2 border rounded-md w-full md:w-40 h-10" />
              </div>
              {(chineseZodiac || westernZodiac) && (
                <div className="mt-2 text-xs text-gray-600">已套用：{chineseZodiac ? `生肖：${chineseZodiac} ` : ''}{westernZodiac ? `星座：${westernZodiac}` : ''}</div>
              )}
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">生肖（可選）</label>
                  <select value={chineseZodiac} onChange={(e) => setChineseZodiac((e.target.value || '') as any)} className="w-full md:w-44 px-2 py-1.5 h-9 text-sm border rounded-md">
                    <option value="">無</option>
                    {(['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'] as const).map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
                <div className="md:justify-self-end">
                  <label className="block text-sm font-medium text-gray-700 mb-2">星座（可選）</label>
                  <select value={westernZodiac} onChange={(e) => setWesternZodiac((e.target.value || '') as any)} className="w-full md:w-44 px-2 py-1.5 h-9 text-sm border rounded-md">
                    <option value="">無</option>
                    {([
                      { value: 'Aries', label: '牡羊座' },
                      { value: 'Taurus', label: '金牛座' },
                      { value: 'Gemini', label: '雙子座' },
                      { value: 'Cancer', label: '巨蟹座' },
                      { value: 'Leo', label: '獅子座' },
                      { value: 'Virgo', label: '處女座' },
                      { value: 'Libra', label: '天秤座' },
                      { value: 'Scorpio', label: '天蠍座' },
                      { value: 'Sagittarius', label: '射手座' },
                      { value: 'Capricorn', label: '摩羯座' },
                      { value: 'Aquarius', label: '水瓶座' },
                      { value: 'Pisces', label: '雙魚座' },
                    ] as const).map(z => (
                      <option key={z.value} value={z.value}>{z.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">主題（可選）</label>
          <select
            value={theme}
            onChange={(e) => setTheme((e.target.value || '') as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10"
          >
            <option value="">無</option>
            <option value="nature">自然</option>
            <option value="virtue">品德</option>
            <option value="bright">光明</option>
            <option value="family">家庭</option>
            <option value="study">學業</option>
            <option value="art">藝術</option>
            <option value="peace">平安</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">地區音系</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10"
          >
            <option value="TW">臺灣（國語/注音）</option>
            <option value="HK">香港（粵語/粵拼）</option>
            <option value="CN">中國大陸（普通話/拼音）</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">風格</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10"
          >
            <option value="neutral">中性</option>
            <option value="classic">古典</option>
            <option value="modern">現代</option>
            <option value="literary">文青</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">筆畫上限（可選）</label>
          <input
            type="number"
            placeholder="例如 18"
            value={maxStrokes}
            onChange={(e) => setMaxStrokes(e.target.value ? parseInt(e.target.value) : '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">其它設定</label>
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={allowSingle} onChange={(e) => setAllowSingle(e.target.checked)} />
              允許單字名
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={avoidRare} onChange={(e) => setAvoidRare(e.target.checked)} />
              避冷僻字
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Seed（可重現，選填）</label>
          <input
            type="text"
            placeholder="例如 202408"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">候選深度</label>
          <input
            type="range"
            min={16}
            max={256}
            step={16}
            value={candidateCount}
            onChange={(e) => setCandidateCount(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-gray-500 mt-1">候選數：{candidateCount}</div>
        </div>

        {/* 生成策略 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">生成模式與創新度</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <select value={selectionMode} onChange={(e) => setSelectionMode(e.target.value as any)} className="px-3 py-2 border rounded-md">
                <option value="max">最佳（分數最高）</option>
                <option value="sample">抽樣（更有變化）</option>
              </select>
              <input type="number" className="w-24 px-2 py-2 border rounded-md" title="Beam 大小（0 關閉）" value={beamSize} min={0} max={16} onChange={(e) => setBeamSize(Math.max(0, Math.min(16, parseInt(e.target.value || '0'))))} />
              <span className="text-xs text-gray-500">Beam</span>
            </div>
            <div className="grid grid-cols-3 gap-3 items-center">
              <div>
                <div className="text-xs text-gray-500">溫度</div>
                <input type="number" step={0.1} min={0.3} max={1.2} value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value || '0.7'))} className="w-full px-2 py-2 border rounded-md" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Top-k</div>
                <input type="number" min={10} max={100} value={topK} onChange={(e) => setTopK(parseInt(e.target.value || '50'))} className="w-full px-2 py-2 border rounded-md" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Top-p</div>
                <input type="number" step={0.05} min={0.6} max={0.95} value={topP} onChange={(e) => setTopP(parseFloat(e.target.value || '0.9'))} className="w-full px-2 py-2 border rounded-md" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">年代（可選）</label>
          <select value={era} onChange={(e) => setEra((e.target.value || '') as any)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">無</option>
            <option value="1980s">1980s</option>
            <option value="1990s">1990s</option>
            <option value="2000s">2000s</option>
            <option value="2010s">2010s</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Beam 多樣性懲罰</label>
          <input type="range" min={0} max={0.2} step={0.01} value={diversityPenalty} onChange={(e) => setDiversityPenalty(parseFloat(e.target.value))} className="w-full" />
          <div className="text-xs text-gray-500 mt-1">強度：{diversityPenalty.toFixed(2)}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">諧音策略</label>
          <select value={homophonePolicy} onChange={(e) => setHomophonePolicy(e.target.value as any)} className="w-full px-3 py-2 border rounded-md">
            <option value="block">嚴格過濾（block）</option>
            <option value="penalize">保留但扣分（penalize）</option>
            <option value="ignore">忽略（不建議）</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">姓氏節奏懲罰強度</label>
          <input type="range" min={0} max={1} step={0.05} value={surnameTonePenaltyWeight} onChange={(e) => setSurnameTonePenaltyWeight(parseFloat(e.target.value))} className="w-full" />
          <div className="text-xs text-gray-500 mt-1">{surnameTonePenaltyWeight.toFixed(2)}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">五行偏好（可選）</label>
          <select value={fiveElementPreference} onChange={(e) => setFiveElementPreference(e.target.value as any)} className="w-full px-3 py-2 border rounded-md">
            <option value="none">無</option>
            <option value="balanced">均衡</option>
            <option value="wood">木</option>
            <option value="water">水</option>
            <option value="fire">火</option>
            <option value="earth">土</option>
            <option value="metal">金</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">區域混入比率</label>
          <input type="range" min={0} max={0.3} step={0.01} value={crossRegionMix} onChange={(e) => setCrossRegionMix(parseFloat(e.target.value))} className="w-full" />
          <div className="text-xs text-gray-500 mt-1">{(crossRegionMix*100).toFixed(0)}%</div>
        </div>

        

        {/* 進階：音韻/文學/家族/三才/獨特/黑名單 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">進階命名選項</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enablePhonologyAesthetics} onChange={(e) => setEnablePhonologyAesthetics(e.target.checked)} />
              音韻/字形美學
            </label>
            <div>
              <div className="text-sm text-gray-700 mb-1">文學偏好</div>
              <select value={literaryPreference} onChange={(e) => setLiteraryPreference(e.target.value as any)} className="w-full px-3 py-2 border rounded-md">
                <option value="none">無</option>
                <option value="classic">經典/典雅</option>
                <option value="poetic">詩意/文藝</option>
                <option value="virtue">德目/品性</option>
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-700 mb-1">字輩字（可選）</div>
              <input value={familyGenerationChar} onChange={(e) => setFamilyGenerationChar(e.target.value)} placeholder="如：宏" className="w-full px-3 py-2 border rounded-md" />
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                位置：
                <label className="inline-flex items-center gap-1">
                  <input type="radio" name="genPos" value="first" checked={familyGenerationPosition==='first'} onChange={() => setFamilyGenerationPosition('first')} />
                  第一個名
                </label>
                <label className="inline-flex items-center gap-1">
                  <input type="radio" name="genPos" value="second" checked={familyGenerationPosition==='second'} onChange={() => setFamilyGenerationPosition('second')} />
                  第二個名
                </label>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-700 mb-1">兄弟姐妹姓名（逗號分隔）</div>
              <input value={siblingNamesText} onChange={(e) => setSiblingNamesText(e.target.value)} className="w-full px-3 py-2 border rounded-md h-10" placeholder="例如：陳博文, 陳雅婷" />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enableThreeFiveGrids} onChange={(e) => setEnableThreeFiveGrids(e.target.checked)} />
              三才五格（簡化）
            </label>
            <div>
              <div className="text-sm text-gray-700 mb-1">獨特性偏好</div>
              <input type="range" min={0} max={1} step={0.05} value={uniquenessPreference} onChange={(e) => setUniquenessPreference(parseFloat(e.target.value))} className="w-full" />
              <div className="text-xs text-gray-500">{uniquenessPreference.toFixed(2)}（越高越避免熱門）</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-700 mb-1">額外黑名單（字/詞，逗號分隔）</div>
              <input value={additionalBlacklistText} onChange={(e) => setAdditionalBlacklistText(e.target.value)} className="w-full px-3 py-2 border rounded-md h-10" placeholder="例如：狗、病、醜" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">風格 Quick Preset</label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => applyPreset('tw_classic')} className="px-3 py-2 text-sm border rounded hover:bg-gray-50">TW・古典穩健</button>
            <button onClick={() => applyPreset('hk_modern')} className="px-3 py-2 text-sm border rounded hover:bg-gray-50">HK・現代順口</button>
            <button onClick={() => applyPreset('cn_era90s')} className="px-3 py-2 text-sm border rounded hover:bg-gray-50">CN・90年代</button>
            <button onClick={() => { setRegion('TW'); setStyle('literary'); setSelectionMode('sample'); setBeamSize(6); setTemperature(0.85); setTopK(70); setTopP(0.92); setDiversityPenalty(0.08); setEra('2000s'); }} className="px-3 py-2 text-sm border rounded hover:bg-gray-50">TW・文青</button>
            <button onClick={() => { setRegion('HK'); setStyle('classic'); setSelectionMode('max'); setBeamSize(5); setTemperature(0.6); setTopK(40); setTopP(0.85); setDiversityPenalty(0.05); setEra('1990s'); }} className="px-3 py-2 text-sm border rounded hover:bg-gray-50">HK・傳統</button>
            <button onClick={() => { setRegion('CN'); setStyle('modern'); setSelectionMode('sample'); setBeamSize(6); setTemperature(0.8); setTopK(60); setTopP(0.9); setDiversityPenalty(0.08); setEra('2000s'); }} className="px-3 py-2 text-sm border rounded hover:bg-gray-50">CN・00後</button>
            <button onClick={() => applyPreset('bazi_focus')} className="px-3 py-2 text-sm border rounded hover:bg-gray-50">生辰加權</button>
          </div>
        </div>
      </div>

      {/* 動作按鈕 */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleGenerate(false)}
          disabled={loading}
          className="flex items-center px-5 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-md font-medium"
        >
          {loading ? <RefreshCw className="animate-spin h-5 w-5 mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
          生成姓名
        </button>
        <button
          onClick={() => handleGenerate(true)}
          disabled={loading}
          className="px-5 py-3 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-md font-medium"
        >
          批量生成（10）
        </button>
      </div>

      {/* 結果區 */}
      {result && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">建議姓名</h3>
            <button
              onClick={() => handleCopy(result.name)}
              className="flex items-center text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded"
            >
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              複製
            </button>
          </div>
          <div className="p-6 space-y-3">
            <div className="text-3xl font-bold text-gray-800">{result.name}</div>
            {result.roman && (
              <div className="text-sm text-gray-500">{region === 'HK' ? '粵拼' : '拼音'}：{result.roman}</div>
            )}
            {result.reasons && (
              <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded p-3">
                生成理由：{result.reasons}
              </div>
            )}
            {result.parts && (
              <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
                <div className="font-medium">得分拆解</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                  <div>bigram：<span className="font-mono">{result.parts.bigram}</span></div>
                  <div>chars：<span className="font-mono">{result.parts.chars}</span></div>
                  <div>phonetic：<span className="font-mono">{result.parts.phonetic}</span></div>
                  <div>semantics：<span className="font-mono">{result.parts.semantics}</span></div>
                  <div>eraRegion：<span className="font-mono">{result.parts.eraRegion}</span></div>
                  <div>penalties：<span className="font-mono">-{result.parts.penalties}</span></div>
                </div>
                <div className="text-[11px] text-gray-500">
                  風格加分：<span className="font-mono">{result.parts.weightedStyle}</span>；年代加分：
                  <span className="font-mono">{result.parts.weightedEra}</span>；五行加分：
                  <span className="font-mono">{result.parts.weightedFive}</span>；生肖：
                  <span className="font-mono">{result.parts.weightedZodiacCN}</span>；星座：
                  <span className="font-mono">{result.parts.weightedZodiacWest}</span>；時辰：
                  <span className="font-mono">{result.parts.weightedBaziHour}</span>；音韻：
                  <span className="font-mono">{result.parts.weightedPhonAes}</span>；文學：
                  <span className="font-mono">{result.parts.weightedLiterary}</span>；字輩：
                  <span className="font-mono">{result.parts.weightedFamilyGen}</span>；手足：
                  <span className="font-mono">{result.parts.weightedSibling}</span>；三才：
                  <span className="font-mono">{result.parts.weightedThreeFive}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 批量清單 */}
      {batch.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">更多建議</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {batch.map((b, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <div className="font-medium text-gray-900">{b.name}</div>
                  {b.reasons && <div className="text-xs text-gray-500 mt-1">{b.reasons}</div>}
                  {b.parts && (
                    <div className="text-[11px] text-gray-500 mt-1">
                      風格：<span className="font-mono">{b.parts.weightedStyle}</span>，年代：<span className="font-mono">{b.parts.weightedEra}</span>，
                      五行：<span className="font-mono">{b.parts.weightedFive}</span>，生肖：<span className="font-mono">{b.parts.weightedZodiacCN}</span>，星座：<span className="font-mono">{b.parts.weightedZodiacWest}</span>，時辰：<span className="font-mono">{b.parts.weightedBaziHour}</span>
                      ，音韻：<span className="font-mono">{b.parts.weightedPhonAes}</span>，文學：<span className="font-mono">{b.parts.weightedLiterary}</span>，字輩：<span className="font-mono">{b.parts.weightedFamilyGen}</span>，手足：<span className="font-mono">{b.parts.weightedSibling}</span>，三才：<span className="font-mono">{b.parts.weightedThreeFive}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setLikedChars(prev => Array.from(new Set([...prev, ...Array.from(b.name.replace(/^.{1}/,''))]))) } className="text-xs text-green-600 hover:underline">喜歡字</button>
                  <button onClick={() => setBlockedNames(prev => Array.from(new Set([...prev, b.name])))} className="text-xs text-red-600 hover:underline">排除此名</button>
                  <button onClick={() => toggleCompare({ name: b.name, parts: b.parts })} className="text-xs text-blue-600 hover:underline">{compare.find(x => x.name === b.name) ? '移除對比' : '加入對比'}</button>
                  <button onClick={() => handleCopy(b.name)} className="text-sm text-purple-600 hover:underline">複製</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 偏好學習區塊 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">偏好學習（本地）</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-700 mb-1">喜歡的字（以逗號分隔）</div>
            <input className="w-full px-3 py-2 border rounded-md h-10" value={likedChars.join(',')} onChange={(e)=>setLikedChars(e.target.value.split(/[，,\s]+/).filter(Boolean))} />
          </div>
          <div>
            <div className="text-gray-700 mb-1">喜歡的雙字（AB，逗號分隔）</div>
            <input className="w-full px-3 py-2 border rounded-md h-10" value={likedBigrams.join(',')} onChange={(e)=>setLikedBigrams(e.target.value.split(/[，,\s]+/).filter(Boolean))} />
          </div>
          <div>
            <div className="text-gray-700 mb-1">排除字（逗號分隔）</div>
            <input className="w-full px-3 py-2 border rounded-md h-10" value={blockedChars.join(',')} onChange={(e)=>setBlockedChars(e.target.value.split(/[，,\s]+/).filter(Boolean))} />
          </div>
          <div>
            <div className="text-gray-700 mb-1">排除雙字（AB，逗號分隔）</div>
            <input className="w-full px-3 py-2 border rounded-md h-10" value={blockedBigrams.join(',')} onChange={(e)=>setBlockedBigrams(e.target.value.split(/[，,\s]+/).filter(Boolean))} />
          </div>
          <div className="md:col-span-2">
            <div className="text-gray-700 mb-1">排除全名（逗號分隔）</div>
            <input className="w-full px-3 py-2 border rounded-md h-10" value={blockedNames.join(',')} onChange={(e)=>setBlockedNames(e.target.value.split(/[，,\s]+/).filter(Boolean))} />
          </div>
        </div>
      </div>

      {/* 對比視圖 */}
      {compare.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">對比視圖（最多 4 筆）</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {compare.map(c => (
              <span key={c.name} className="px-2 py-1 bg-gray-100 rounded text-xs">
                {c.name}
                <button onClick={()=>toggleCompare(c)} className="ml-2 text-red-600">×</button>
              </span>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-gray-500">
                  <th className="text-left p-2">指標</th>
                  {compare.map(c => <th key={c.name} className="text-left p-2">{c.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {compareMetrics.map(m => (
                  <tr key={m.key} className="border-t">
                    <td className="p-2 text-gray-700 whitespace-nowrap">{m.label}</td>
                    {compare.map(c => {
                      const raw = c.parts ? Number(c.parts[m.key] ?? 0) : 0;
                      const v = m.negate ? -Math.abs(raw) : Number(raw);
                      const w = Math.min(100, Math.max(0, Math.abs(v) * 100));
                      const color = v >= 0 ? 'bg-purple-500' : 'bg-red-500';
                      return (
                        <td key={c.name + m.key} className="p-2">
                          {c.parts ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-gray-700 w-14">{v.toFixed(3)}</span>
                              <div className="flex-1 h-2 bg-gray-100 rounded">
                                <div className={`h-2 ${color} rounded`} style={{ width: `${w}%` }} />
                              </div>
                            </div>
                          ) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 