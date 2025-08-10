const fs = require('fs');
const path = require('path');

// 讀取香港雙字組合 CSV 檔案
const csvPath = path.join(__dirname, '../data/bigrams_hk_sample.csv');
const jsonPath = path.join(__dirname, '../src/utils/data/bigrams_hk.json');

try {
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const first = values[0];
    const second = values[1];
    const weight = parseFloat(values[2]);
    const gender = values[3];
    const era = values[4];
    const region = values[5];
    
    return {
      first,
      second,
      weight,
      gender,
      era,
      region
    };
  });
  
  // 寫入 JSON 檔案
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`成功轉換 ${data.length} 個香港雙字組合到 ${jsonPath}`);
  
} catch (error) {
  console.error('轉換失敗:', error.message);
} 