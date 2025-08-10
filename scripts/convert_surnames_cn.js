const fs = require('fs');
const path = require('path');

// 讀取中國大陸姓氏 CSV 檔案
const csvPath = path.join(__dirname, '../data/surnames_cn_sample.csv');
const jsonPath = path.join(__dirname, '../src/utils/data/surnames_cn.json');

try {
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const surname = values[0];
    const weight = parseFloat(values[1]);
    const region = values[2];
    
    return {
      surname,
      weight,
      region
    };
  });
  
  // 寫入 JSON 檔案
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`成功轉換 ${data.length} 個中國大陸姓氏到 ${jsonPath}`);
  
} catch (error) {
  console.error('轉換失敗:', error.message);
} 