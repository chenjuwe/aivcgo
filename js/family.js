// js/family.js - 家庭關係相關函數

import { sample } from './utils.js';

// 家庭關係品質邏輯
export function generateFamilyDynamics() {
  const familyQuality = sample(['和諧', '緊張', '疏離', '親密']);
  
  const dynamics = {
    '和諧': {
      familyRelationshipQuality: '親密',
      familyCommunicationStyle: '開放',
      familySupportType: '全方位支持',
      familyTradition: '重視家庭聚會',
      familyValue: '家庭第一'
    },
    '緊張': {
      familyRelationshipQuality: '疏離',
      familyCommunicationStyle: '封閉',
      familySupportType: '有限支持',
      familyTradition: '各自獨立',
      familyValue: '個人發展'
    },
    '疏離': {
      familyRelationshipQuality: '冷淡',
      familyCommunicationStyle: '很少溝通',
      familySupportType: '基本支持',
      familyTradition: '節日聚會',
      familyValue: '自由發展'
    },
    '親密': {
      familyRelationshipQuality: '非常親密',
      familyCommunicationStyle: '無話不談',
      familySupportType: '全力支持',
      familyTradition: '定期聚會',
      familyValue: '家庭團結'
    }
  };
  
  return dynamics[familyQuality];
}

// 生成家庭成員
export function generateFamilyMembers(age, maritalStatus) {
  const members = [];
  
  // 父母
  if (Math.random() > 0.2) { // 80% 機率有父母
    const fatherAge = age + sample([25, 26, 27, 28, 29, 30]);
    const motherAge = age + sample([23, 24, 25, 26, 27, 28]);
    
    members.push({
      type: '父親',
      name: '父親',
      age: fatherAge,
      occupation: sample(['工程師', '業務員', '公務員', '老師', '醫師', '已退休']),
      health: sample(['健康', '良好', '普通', '需要照顧'])
    });
    
    members.push({
      type: '母親',
      name: '母親',
      age: motherAge,
      occupation: sample(['家庭主婦', '護理師', '老師', '行政人員', '店員', '已退休']),
      health: sample(['健康', '良好', '普通', '需要照顧'])
    });
  }
  
  // 兄弟姊妹
  const siblingCount = sample([0, 0, 1, 1, 2, 3]); // 較多機率是1-2個
  for (let i = 0; i < siblingCount; i++) {
    const siblingAge = age + sample([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
    const gender = sample(['男', '女']);
    
    members.push({
      type: gender === '男' ? '兄弟' : '姊妹',
      name: gender === '男' ? '兄弟' : '姊妹',
      age: Math.max(15, siblingAge), // 至少15歲
      occupation: siblingAge < age ? 
        sample(['學生', '工程師', '護理師', '老師', '業務員']) :
        sample(['學生', '上班族', '服務業']),
      health: sample(['健康', '良好', '普通'])
    });
  }
  
  // 祖父母（較少機率）
  if (Math.random() > 0.7) { // 30% 機率有祖父母
    const grandpaAge = age + sample([55, 60, 65, 70]);
    const grandmaAge = age + sample([53, 58, 63, 68]);
    
    members.push({
      type: '祖父',
      name: '祖父',
      age: grandpaAge,
      occupation: '已退休',
      health: sample(['普通', '需要照顧', '健康'])
    });
    
    members.push({
      type: '祖母',
      name: '祖母',
      age: grandmaAge,
      occupation: '已退休',
      health: sample(['普通', '需要照顧', '健康'])
    });
  }
  
  return members;
}

// 生成配偶資訊
export function generateSpouse(age, gender) {
  const spouseGender = gender === '男' ? '女' : '男';
  const spouseAge = age + sample([-3, -2, -1, 0, 1, 2, 3]);
  
  // 使用姓氏和名字生成配偶姓名
  const surnames = [
    { chinese: '陳' }, { chinese: '林' }, { chinese: '張' }, { chinese: '李' },
    { chinese: '王' }, { chinese: '黃' }, { chinese: '吳' }, { chinese: '劉' },
    { chinese: '蔡' }, { chinese: '楊' }, { chinese: '許' }, { chinese: '鄭' }
  ];
  
  const maleNames = ['志明', '家豪', '俊傑', '建華', '明輝', '文雄', '志強', '國華'];
  const femaleNames = ['淑芬', '美玲', '雅婷', '怡君', '佩君', '淑惠', '麗華', '美珠'];
  
  const surname = sample(surnames).chinese;
  const givenName = spouseGender === '男' ? sample(maleNames) : sample(femaleNames);
  
  return {
    surname: surname,
    givenName: givenName,
    age: Math.max(20, spouseAge),
    gender: spouseGender,
    occupation: sample(['工程師', '護理師', '老師', '業務員', '行政人員', '設計師', '會計師'])
  };
}

// 生成子女資訊
export function generateChildren(age, maritalStatus) {
  if (maritalStatus !== '已婚' || age < 25) return [];
  
  const childCount = sample([0, 0, 1, 1, 2, 2, 3]); // 較多機率是1-2個
  const children = [];
  
  for (let i = 0; i < childCount; i++) {
    const childAge = Math.max(0, age - sample([20, 22, 25, 28, 30, 32, 35]));
    const gender = sample(['男', '女']);
    
    const maleNames = ['小明', '小華', '小傑', '小宇', '小翔', '小安'];
    const femaleNames = ['小美', '小婷', '小君', '小萱', '小涵', '小雯'];
    
    children.push({
      name: gender === '男' ? sample(maleNames) : sample(femaleNames),
      age: childAge,
      gender: gender,
      status: childAge < 18 ? '學生' : childAge < 25 ? sample(['學生', '上班族']) : '成年'
    });
  }
  
  return children.sort((a, b) => b.age - a.age); // 按年齡排序
} 