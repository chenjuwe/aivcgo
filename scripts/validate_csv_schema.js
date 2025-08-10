const fs = require('fs');
const path = require('path');

function readCsv(file) {
  const raw = fs.readFileSync(file, 'utf8').trim();
  const lines = raw.split(/\r?\n/);
  const headers = lines[0].split(',');
  const rows = lines.slice(1).filter(Boolean).map(l => l.split(','));
  return { headers, rows };
}

function validateGivenChars(file) {
  const { headers, rows } = readCsv(file);
  const need = ['char','weight','strokes','rare','structure','poly','freqRank'];
  for (const h of need) if (!headers.includes(h)) throw new Error(`${path.basename(file)} 缺少欄位: ${h}`);
  rows.forEach((r, i) => {
    if (!r[0]) throw new Error(`${path.basename(file)} 第 ${i+2} 行字元缺失`);
    const w = parseFloat(r[1]);
    if (isNaN(w) || w < 0 || w > 20) throw new Error(`${path.basename(file)} 第 ${i+2} 行 weight 非法`);
    const strokes = parseInt(r[2]);
    if (isNaN(strokes) || strokes <= 0 || strokes > 40) throw new Error(`${path.basename(file)} 第 ${i+2} 行 strokes 非法`);
  });
}

function validateBigrams(file) {
  const { headers, rows } = readCsv(file);
  const need = ['first','second','weight','gender','era','region'];
  for (const h of need) if (!headers.includes(h)) throw new Error(`${path.basename(file)} 缺少欄位: ${h}`);
  rows.forEach((r, i) => {
    if (!r[0] || !r[1]) throw new Error(`${path.basename(file)} 第 ${i+2} 行 first/second 缺失`);
    const w = parseFloat(r[2]);
    if (isNaN(w) || w < 0 || w > 20) throw new Error(`${path.basename(file)} 第 ${i+2} 行 weight 非法`);
  });
}

function validateSurnames(file) {
  const { headers, rows } = readCsv(file);
  const need = ['surname','weight'];
  for (const h of need) if (!headers.includes(h)) throw new Error(`${path.basename(file)} 缺少欄位: ${h}`);
  rows.forEach((r, i) => {
    if (!r[0]) throw new Error(`${path.basename(file)} 第 ${i+2} 行 surname 缺失`);
    const w = parseFloat(r[1]);
    if (isNaN(w) || w < 0 || w > 20) throw new Error(`${path.basename(file)} 第 ${i+2} 行 weight 非法`);
  });
}

function main() {
  const root = path.join(__dirname, '../data');
  const files = fs.readdirSync(root).filter(f => f.endsWith('.csv'));
  const errors = [];
  for (const f of files) {
    const fp = path.join(root, f);
    try {
      if (f.startsWith('bigrams')) validateBigrams(fp);
      else if (f.startsWith('surnames')) validateSurnames(fp);
      else if (f.startsWith('given_chars')) validateGivenChars(fp);
      else if (f === 'bigrams_sample.csv') validateBigrams(fp);
      else if (f === 'surnames_sample.csv') validateSurnames(fp);
      else if (f === 'given_chars_sample.csv') validateGivenChars(fp);
      console.log(`✅ ${f} 通過`);
    } catch (e) {
      console.error(`❌ ${f} 失敗: ${e.message}`);
      errors.push(f);
    }
  }
  if (errors.length) {
    console.error(`\n共 ${errors.length} 個檔案未通過`);
    process.exit(1);
  } else {
    console.log('\n所有 CSV 檢核通過');
  }
}

if (require.main === module) main(); 