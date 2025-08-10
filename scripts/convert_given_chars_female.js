const fs = require('fs');
const path = require('path');

// 讀取女性用字池 CSV 檔案
const csvPath = path.join(__dirname, '../data/given_chars_female_sample.csv');
const jsonPath = path.join(__dirname, '../src/utils/data/given_chars_female.json');

try {
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const char = values[0];
    const weight = parseFloat(values[1]);
    const strokes = parseInt(values[2]);
    const rare = parseInt(values[3]);
    const structure = values[4];
    const poly = parseInt(values[5]);
    const freqRank = parseInt(values[6]);
    const tags = values[7].split('|');
    const gender = values[8];
    
    return {
      char,
      weight,
      strokes,
      rare,
      structure,
      poly,
      freqRank,
      tags,
      gender
    };
  });
  
  // 寫入 JSON 檔案
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`成功轉換 ${data.length} 個女性用字到 ${jsonPath}`);
  
} catch (error) {
  console.error('轉換失敗:', error.message);
} 