const fs = require('fs');
const path = require('path');

// 定義所有需要轉換的檔案
const conversions = [
  {
    name: '男性用字池',
    csvPath: '../data/given_chars_male_sample.csv',
    jsonPath: '../src/utils/data/given_chars_male.json',
    script: 'convert_given_chars_male.js'
  },
  {
    name: '女性用字池',
    csvPath: '../data/given_chars_female_sample.csv',
    jsonPath: '../src/utils/data/given_chars_female.json',
    script: 'convert_given_chars_female.js'
  },
  {
    name: '香港雙字組合',
    csvPath: '../data/bigrams_hk_sample.csv',
    jsonPath: '../src/utils/data/bigrams_hk.json',
    script: 'convert_bigrams_hk.js'
  },
  {
    name: '中國大陸雙字組合',
    csvPath: '../data/bigrams_cn_sample.csv',
    jsonPath: '../src/utils/data/bigrams_cn.json',
    script: 'convert_bigrams_cn.js'
  },
  {
    name: '香港姓氏',
    csvPath: '../data/surnames_hk_sample.csv',
    jsonPath: '../src/utils/data/surnames_hk.json',
    script: 'convert_surnames_hk.js'
  },
  {
    name: '中國大陸姓氏',
    csvPath: '../data/surnames_cn_sample.csv',
    jsonPath: '../src/utils/data/surnames_cn.json',
    script: 'convert_surnames_cn.js'
  },
  {
    name: '台灣雙字組合',
    csvPath: '../data/bigrams_sample.csv',
    jsonPath: '../src/utils/data/given_bigrams_tw.json',
    script: 'convert_bigrams.js'
  },
  {
    name: '台灣用字池',
    csvPath: '../data/given_chars_sample.csv',
    jsonPath: '../src/utils/data/given_chars_unisex.json',
    script: 'convert_given_chars.js'
  },
  {
    name: '台灣姓氏',
    csvPath: '../data/surnames_sample.csv',
    jsonPath: '../src/utils/data/surnames_tw.json',
    script: 'convert_surnames.js'
  }
];

console.log('開始批次轉換 CSV 檔案到 JSON...\n');

conversions.forEach((conversion, index) => {
  try {
    // 檢查 CSV 檔案是否存在
    const csvFullPath = path.join(__dirname, conversion.csvPath);
    if (!fs.existsSync(csvFullPath)) {
      console.log(`⚠️  ${index + 1}. ${conversion.name}: CSV 檔案不存在 (${conversion.csvPath})`);
      return;
    }

    // 執行轉換腳本
    const scriptPath = path.join(__dirname, conversion.script);
    if (fs.existsSync(scriptPath)) {
      require(scriptPath);
      console.log(`✅ ${index + 1}. ${conversion.name}: 轉換成功`);
    } else {
      console.log(`❌ ${index + 1}. ${conversion.name}: 轉換腳本不存在 (${conversion.script})`);
    }
  } catch (error) {
    console.log(`❌ ${index + 1}. ${conversion.name}: 轉換失敗 - ${error.message}`);
  }
});

console.log('\n批次轉換完成！'); 