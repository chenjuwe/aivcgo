// test-character.js - 測試人物生成功能
import { sample } from './utils.js';
import { generateRandomCharacter } from './character.js';

// 測試 sample 函數
console.log('=== 測試 sample 函數 ===');
console.log('正常陣列:', sample(['a', 'b', 'c']));
console.log('空陣列:', sample([]));
console.log('undefined:', sample(undefined));
console.log('null:', sample(null));

// 測試人物生成
console.log('\n=== 測試人物生成 ===');
try {
  const character = generateRandomCharacter();
  console.log('生成成功:', character.name?.chinese);
  console.log('年齡:', character.age);
  console.log('職業:', character.occupation);
  console.log('優點:', character.strengths);
  console.log('缺點:', character.weaknesses);
} catch (error) {
  console.error('生成失敗:', error);
  console.error('錯誤堆疊:', error.stack);
}

// 匯出測試函數供外部調用
export function testCharacterGeneration() {
  try {
    const character = generateRandomCharacter();
    console.log('測試生成成功:', character);
    return character;
  } catch (error) {
    console.error('測試生成失敗:', error);
    return null;
  }
} 