// utils.js - 工具函數

/**
 * 從陣列中隨機取樣一個元素
 * @param {Array<T>} arr - 來源陣列
 * @returns {T} - 陣列中的隨機一個元素
 * @template T
 */
export const sample = (arr) => {
  // 詳細檢查陣列
  if (arr === undefined) {
    console.error('sample 函數接收到 undefined，調用位置:', new Error().stack);
    return '預設值';
  }
  
  if (arr === null) {
    console.error('sample 函數接收到 null，調用位置:', new Error().stack);
    return '預設值';
  }
  
  if (!Array.isArray(arr)) {
    console.error('sample 函數接收到非陣列類型:', typeof arr, arr, '調用位置:', new Error().stack);
    return '預設值';
  }
  
  if (arr.length === 0) {
    console.warn('sample 函數接收到空陣列，調用位置:', new Error().stack);
    return '預設值';
  }
  
  // 正常情況下返回隨機元素
  const randomIndex = Math.floor(Math.random() * arr.length);
  const result = arr[randomIndex];
  
  // 確保結果不是 undefined
  if (result === undefined) {
    console.error('sample 函數返回 undefined，陣列:', arr, '索引:', randomIndex);
    return '預設值';
  }
  
  return result;
};

/**
 * 生成指定範圍內的隨機整數
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} - 隨機整數
 */
export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * 生成隨機布林值
 * @param {number} probability - 返回 true 的機率（0-1）
 * @returns {boolean}
 */
export const randomBool = (probability = 0.5) => Math.random() < probability;

/**
 * 打亂陣列順序
 * @param {Array} arr - 要打亂的陣列
 * @returns {Array} - 打亂後的新陣列
 */
export const shuffle = (arr) => {
    if (!arr || !Array.isArray(arr)) {
        console.warn('shuffle 函數接收到無效陣列:', arr);
        return [];
    }
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

/**
 * 從陣列中隨機取樣多個不重複的元素
 * @param {Array} arr - 來源陣列
 * @param {number} count - 要取樣的數量
 * @returns {Array} - 取樣結果陣列
 */
export const sampleMultiple = (arr, count) => {
    if (!arr || !Array.isArray(arr)) {
        console.warn('sampleMultiple 函數接收到無效陣列:', arr);
        return [];
    }
    if (count <= 0) return [];
    if (count >= arr.length) return [...arr];
    const shuffled = shuffle(arr);
    return shuffled.slice(0, count);
}; 