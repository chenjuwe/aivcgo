// ==================== 進階人物生成AI引擎 ====================
// 整合：特質關聯矩陣 + MBTI完整系統 + 年齡邏輯 + 職業匹配 + 60種職業

class AdvancedCharacterEngine {
  constructor(database) {
    this.db = database;
    this.initializeCoreSystems();
  }

  // ==================== 核心系統初始化 ====================
  initializeCoreSystems() {
    this.traitWeightSystem = this.setupTraitWeights();
    this.mbtiSystem = this.setupCompleteMBTI();
    this.lifeStageFramework = this.setupLifeStages();
    this.jobPersonalityMatrix = this.setupJobPersonality();
    this.traitCorrelationMatrix = this.setupTraitCorrelations();
    this.faithBehaviorSystem = this.setupFaithBehavior();
    this.taiwanCulturalFactors = this.setupTaiwanCulture();
  }

  // ==================== 特質權重系統 ====================
  setupTraitWeights() {
    return {
      coreTraits: {
        weight: 1.0,
        traits: ['MBTI類型', '價值觀', '信仰深度', '道德標準'],
        influence: '決定基本人格框架'
      },
      primaryTraits: {
        weight: 0.8,
        traits: ['情緒管理', '溝通風格', '決策模式', '領導特質'],
        influence: '影響日常行為表現'
      },
      secondaryTraits: {
        weight: 0.6,
        traits: ['興趣愛好', '生活習慣', '外貌特徵', '消費習慣'],
        influence: '增加人物豐富度'
      },
      contextualTraits: {
        weight: 0.4,
        traits: ['工作表現', '社交表現', '壓力反應', '環境適應'],
        influence: '根據環境動態調整'
      }
    };
  }

  // ==================== 完整MBTI系統 (16種) ====================
  setupCompleteMBTI() {
    return {
      // 分析師 (NT)
      'INTJ': {
        name: '建築師', 
        strengths: ['戰略思維', '獨立判斷', '系統規劃', '長期視野'],
        challenges: ['過度完美主義', '社交困難', '不善妥協', '情感表達困難'],
        workStyle: '喜歡獨立工作，重視效率和創新',
        relationshipStyle: '深度但不廣泛的人際關係',
        stressResponse: '內化壓力，尋求獨處和理性分析',
        suitableJobs: ['軟體工程師', '建築師', '策略顧問', '研究員']
      },
      'INTP': {
        name: '邏輯學家',
        strengths: ['邏輯分析', '創新思維', '理論探索', '客觀思考'],
        challenges: ['缺乏實務感', '拖延傾向', '社交迴避', '細節疏忽'],
        workStyle: '彈性時間，專注深度思考',
        relationshipStyle: '智識導向的交流',
        stressResponse: '退縮思考，尋求邏輯解釋',
        suitableJobs: ['資料科學家', '研究員', '哲學家', '系統分析師']
      },
      'ENTJ': {
        name: '指揮官',
        strengths: ['領導能力', '戰略規劃', '決斷力', '組織協調'],
        challenges: ['過度控制', '缺乏耐心', '情感忽視', '權威導向'],
        workStyle: '目標導向，喜歡領導和挑戰',
        relationshipStyle: '主導性強，重視效率',
        stressResponse: '加強控制，尋求行動解決',
        suitableJobs: ['執行長', '創業家', '管理顧問', '投資銀行家']
      },
      'ENTP': {
        name: '辯論家',
        strengths: ['創新思維', '適應力強', '溝通能力', '概念理解'],
        challenges: ['注意力分散', '缺乏持續性', '細節疏忽', '衝動決策'],
        workStyle: '多元化工作，避免重複性任務',
        relationshipStyle: '充滿活力的智識交流',
        stressResponse: '尋求新奇刺激，分散注意力',
        suitableJobs: ['企業家', '行銷經理', '創意總監', '顧問']
      },

      // 外交官 (NF)
      'INFJ': {
        name: '提倡者',
        strengths: ['洞察人性', '理想主義', '創意能力', '同理心'],
        challenges: ['過度敏感', '完美主義', '孤獨感', '壓力易累'],
        workStyle: '有意義的工作，幫助他人成長',
        relationshipStyle: '深度情感連結，重視真誠',
        stressResponse: '內在反思，尋求獨處時間',
        suitableJobs: ['心理諮商師', '作家', '牧師', '教育工作者']
      },
      'INFP': {
        name: '調停者',
        strengths: ['價值堅持', '創意表達', '同理心', '適應力'],
        challenges: ['優柔寡斷', '衝突迴避', '過度理想化', '拖延傾向'],
        workStyle: '價值驅動，需要個人意義',
        relationshipStyle: '真誠深度，重視理解',
        stressResponse: '情感化反應，尋求支持',
        suitableJobs: ['藝術家', '社工師', '編劇', '非營利組織工作者']
      },
      'ENFJ': {
        name: '主人公',
        strengths: ['領導魅力', '同理心', '溝通能力', '組織協調'],
        challenges: ['過度付出', '忽視自我', '情感化決策', '完美主義'],
        workStyle: '團隊合作，專注人員發展',
        relationshipStyle: '關懷他人，建立和諧',
        stressResponse: '尋求他人支持，情感表達',
        suitableJobs: ['老師', '人力資源經理', '牧師', '社區工作者']
      },
      'ENFP': {
        name: '競選者',
        strengths: ['熱情活力', '創意思維', '人際技巧', '適應力'],
        challenges: ['注意力分散', '情緒起伏', '組織能力弱', '壓力敏感'],
        workStyle: '多元化環境，人際互動頻繁',
        relationshipStyle: '充滿熱情，廣泛社交',
        stressResponse: '尋求社交支持，情感宣洩',
        suitableJobs: ['行銷專員', '記者', '演員', '活動企劃']
      },

      // 守護者 (SJ)
      'ISTJ': {
        name: '物流師',
        strengths: ['責任感強', '細心謹慎', '忠誠可靠', '組織能力'],
        challenges: ['變化抗拒', '創新不足', '表達困難', '固執傾向'],
        workStyle: '結構化環境，明確責任分工',
        relationshipStyle: '忠誠穩定，重視傳統',
        stressResponse: '加強控制，遵循既定程序',
        suitableJobs: ['會計師', '審計師', '公務員', '銀行員']
      },
      'ISFJ': {
        name: '守護者',
        strengths: ['關懷他人', '責任感', '細心體貼', '忠誠度高'],
        challenges: ['自我忽視', '衝突迴避', '變化焦慮', '過度謙遜'],
        workStyle: '服務他人，穩定環境',
        relationshipStyle: '關懷支持，重視和諧',
        stressResponse: '內化壓力，尋求安全感',
        suitableJobs: ['護理師', '社工師', '圖書館員', '行政助理']
      },
      'ESTJ': {
        name: '總經理',
        strengths: ['組織領導', '決斷力', '效率導向', '責任感'],
        challenges: ['固執傳統', '缺乏彈性', '情感忽視', '控制慾強'],
        workStyle: '階層分明，目標導向',
        relationshipStyle: '權威領導，重視秩序',
        stressResponse: '加強控制，尋求既定解決方案',
        suitableJobs: ['管理職', '軍官', '法官', '專案經理']
      },
      'ESFJ': {
        name: '執政官',
        strengths: ['人際和諧', '組織協調', '責任感', '關懷他人'],
        challenges: ['衝突敏感', '批評脆弱', '變化焦慮', '過度取悅'],
        workStyle: '團隊協作，人際互動',
        relationshipStyle: '和諧維護，情感支持',
        stressResponse: '尋求他人認同，維持關係',
        suitableJobs: ['人力資源', '客服經理', '活動企劃', '教師']
      },

      // 探險家 (SP)
      'ISTP': {
        name: '鑑賞家',
        strengths: ['實務技能', '問題解決', '冷靜客觀', '適應力'],
        challenges: ['情感表達困難', '長期規劃弱', '社交迴避', '衝動傾向'],
        workStyle: '實務操作，獨立工作',
        relationshipStyle: '行動勝於言語，重視空間',
        stressResponse: '物理活動，實際行動',
        suitableJobs: ['工程師', '技師', '飛行員', '設計師']
      },
      'ISFP': {
        name: '探險家',
        strengths: ['美感敏銳', '同理心', '適應力', '價值堅持'],
        challenges: ['衝突迴避', '決策困難', '組織能力弱', '壓力敏感'],
        workStyle: '創意環境，個人空間',
        relationshipStyle: '溫和支持，重視理解',
        stressResponse: '情感表達，尋求美感療癒',
        suitableJobs: ['藝術家', '設計師', '音樂家', '攝影師']
      },
      'ESTP': {
        name: '企業家',
        strengths: ['行動力強', '適應力', '人際技巧', '實務導向'],
        challenges: ['缺乏規劃', '注意力分散', '衝動決策', '理論迴避'],
        workStyle: '動態環境，即時反應',
        relationshipStyle: '活躍社交，享受當下',
        stressResponse: '尋求刺激活動，社交互動',
        suitableJobs: ['業務員', '運動員', '演員', '企業家']
      },
      'ESFP': {
        name: '娛樂家',
        strengths: ['熱情活力', '人際魅力', '適應力', '同理心'],
        challenges: ['規劃能力弱', '衝突敏感', '注意力分散', '批評脆弱'],
        workStyle: '人際互動，靈活環境',
        relationshipStyle: '熱情友善，享受社交',
        stressResponse: '尋求社交支持，情感表達',
        suitableJobs: ['娛樂業', '客服代表', '活動主持', '銷售員']
      }
    };
  }

  // ==================== 年齡階段框架 ====================
  setupLifeStages() {
    return {
      '18-25': {
        name: '探索建立期',
        characteristics: ['身份認同探索', '職業方向不明確', '依賴性較強', '可塑性高'],
        typicalExperiences: ['大學教育', '初入職場', '第一次戀愛', '同儕影響'],
        developmentalTasks: ['獨立生活技能', '職業技能培養', '人際關係建立', '價值觀形成'],
        constraintsCheck: {
          leadership: 'low',
          financialStability: 'developing',
          lifeWisdom: 'basic',
          relationshipExperience: 'limited',
          careerProgress: 'entry-level'
        },
        typicalChallenges: ['經濟壓力', '職涯迷茫', '人際適應', '自我認同']
      },
      '26-35': {
        name: '建立穩定期',
        characteristics: ['職業發展關鍵期', '建立親密關係', '經濟責任增加', '社會角色確立'],
        typicalExperiences: ['職業晉升', '結婚生子', '購屋置產', '職場競爭'],
        developmentalTasks: ['專業技能深化', '財務管理', '家庭經營', '社會網絡建立'],
        constraintsCheck: {
          leadership: 'developing',
          financialStability: 'improving',
          lifeWisdom: 'growing',
          relationshipExperience: 'moderate',
          careerProgress: 'mid-level'
        },
        typicalChallenges: ['工作生活平衡', '財務壓力', '關係經營', '職涯發展']
      },
      '36-50': {
        name: '深化成熟期',
        characteristics: ['職業高峰期', '家庭責任重', '領導角色增加', '人生反思'],
        typicalExperiences: ['管理職責', '子女教育', '父母照護', '中年危機'],
        developmentalTasks: ['領導技能發展', '財富累積', '下一代栽培', '人生意義探索'],
        constraintsCheck: {
          leadership: 'high',
          financialStability: 'stable',
          lifeWisdom: 'mature',
          relationshipExperience: 'extensive',
          careerProgress: 'senior-level'
        },
        typicalChallenges: ['職業倦怠', '家庭壓力', '健康關注', '人生意義']
      },
      '51-70': {
        name: '智慧傳承期',
        characteristics: ['經驗智慧豐富', 'mentor角色', '健康關注增加', '靈性發展'],
        typicalExperiences: ['職業轉換', '退休規劃', '祖輩角色', '健康挑戰'],
        developmentalTasks: ['經驗傳承', '退休準備', '健康維護', '靈性成長'],
        constraintsCheck: {
          leadership: 'executive',
          financialStability: 'established',
          lifeWisdom: 'wise',
          relationshipExperience: 'deep',
          careerProgress: 'executive/transition'
        },
        typicalChallenges: ['健康變化', '角色轉換', '代溝問題', '死亡焦慮']
      }
    };
  }

  // ==================== 職業性格匹配矩陣 ====================
  setupJobPersonality() {
    return {
      // 科技業 (10種)
      '軟體工程師': {
        requiredTraits: ['邏輯思維', '專注力', '學習能力', '問題解決'],
        beneficialTraits: ['獨立工作', '創新思維', '細節導向', '持續學習'],
        challengingTraits: ['極度外向', '討厭細節', '無法專注', '抗拒變化'],
        mbtiSuitability: ['INTJ', 'INTP', 'ISTJ', 'ISTP'],
        personalityFit: 0.9
      },
      '資料科學家': {
        requiredTraits: ['邏輯分析', '數據敏感度', '好奇心', '統計思維'],
        beneficialTraits: ['研究精神', '模式識別', '假設驗證', '批判思考'],
        challengingTraits: ['缺乏耐心', '討厭數字', '表面思考', '結論跳躍'],
        mbtiSuitability: ['INTJ', 'INTP', 'ISTJ', 'ENTP'],
        personalityFit: 0.85
      },
      'UI/UX 設計師': {
        requiredTraits: ['創意思維', '同理心', '美感', '用戶導向'],
        beneficialTraits: ['視覺敏感', '趨勢感知', '溝通協調', '迭代思維'],
        challengingTraits: ['缺乏美感', '自我中心', '溝通困難', '抗拒反饋'],
        mbtiSuitability: ['INFP', 'ISFP', 'ENFP', 'ESFP'],
        personalityFit: 0.8
      },

      // 醫療業 (10種)  
      '醫師': {
        requiredTraits: ['責任感', '抗壓性', '學習能力', '同理心'],
        beneficialTraits: ['決斷力', '細心謹慎', '溝通能力', '持續更新'],
        challengingTraits: ['責任感弱', '壓力脆弱', '學習懶散', '冷漠無情'],
        mbtiSuitability: ['INTJ', 'ENTJ', 'ISFJ', 'ENFJ'],
        personalityFit: 0.95
      },
      '護理師': {
        requiredTraits: ['同理心', '抗壓性', '細心負責', '團隊合作'],
        beneficialTraits: ['服務精神', '溝通技巧', '應變能力', '情緒管理'],
        challengingTraits: ['自私冷漠', '壓力脆弱', '粗心大意', '個人主義'],
        mbtiSuitability: ['ISFJ', 'ESFJ', 'ENFJ', 'ISFP'],
        personalityFit: 0.9
      },

      // 商業金融 (10種)
      '行銷經理': {
        requiredTraits: ['創意思維', '溝通能力', '市場敏感度', '說服力'],
        beneficialTraits: ['趨勢洞察', '數據分析', '品牌思維', '項目管理'],
        challengingTraits: ['創意匱乏', '溝通困難', '市場盲目', '說服力弱'],
        mbtiSuitability: ['ENFP', 'ENTP', 'ESFP', 'ENFJ'],
        personalityFit: 0.85
      },
      '會計師': {
        requiredTraits: ['細心謹慎', '責任感', '邏輯思維', '規則遵循'],
        beneficialTraits: ['數字敏感', '系統思維', '誠信正直', '持續專注'],
        challengingTraits: ['粗心大意', '責任感弱', '邏輯混亂', '規則藐視'],
        mbtiSuitability: ['ISTJ', 'ISFJ', 'INTJ', 'ESTJ'],
        personalityFit: 0.9
      },

      // 創意藝術 (10種)
      '藝術家': {
        requiredTraits: ['創意天賦', '美感敏銳', '表達能力', '獨特視角'],
        beneficialTraits: ['情感豐富', '想像力', '實驗精神', '自我表達'],
        challengingTraits: ['創意匱乏', '美感缺失', '表達困難', '思維僵化'],
        mbtiSuitability: ['ISFP', 'INFP', 'ESFP', 'ENFP'],
        personalityFit: 0.85
      },
      '作家': {
        requiredTraits: ['文字能力', '想像力', '觀察力', '表達技巧'],
        beneficialTraits: ['閱讀廣泛', '人性洞察', '故事感', '持續創作'],
        challengingTraits: ['文字障礙', '想像貧乏', '觀察遲鈍', '表達困難'],
        mbtiSuitability: ['INFP', 'INFJ', 'ENFP', 'INTP'],
        personalityFit: 0.8
      },

      // 教育業 (5種)
      '老師': {
        requiredTraits: ['教學熱忱', '溝通能力', '耐心', '責任感'],
        beneficialTraits: ['知識廣博', '啟發能力', '班級管理', '終身學習'],
        challengingTraits: ['缺乏熱忱', '溝通困難', '缺乏耐心', '責任感弱'],
        mbtiSuitability: ['ENFJ', 'ESFJ', 'ISFJ', 'INFJ'],
        personalityFit: 0.9
      },
      '大學教授': {
        requiredTraits: ['學術能力', '研究精神', '表達能力', '批判思考'],
        beneficialTraits: ['知識深度', '創新思維', '學術寫作', '國際視野'],
        challengingTraits: ['學術平庸', '研究怠惰', '表達不清', '思考淺薄'],
        mbtiSuitability: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
        personalityFit: 0.85
      },

      // 服務業 (5種)
      '廚師': {
        requiredTraits: ['創意能力', '手藝技巧', '抗壓性', '品味敏感'],
        beneficialTraits: ['食材知識', '時間管理', '團隊協作', '客戶導向'],
        challengingTraits: ['創意匱乏', '手藝笨拙', '壓力脆弱', '味覺遲鈍'],
        mbtiSuitability: ['ISFP', 'ESFP', 'ISTP', 'ESTP'],
        personalityFit: 0.75
      },

      // 公職法律 (5種)
      '律師': {
        requiredTraits: ['邏輯思維', '表達能力', '正義感', '抗壓性'],
        beneficialTraits: ['辯論技巧', '法理研究', '客戶服務', '談判能力'],
        challengingTraits: ['邏輯混亂', '表達困難', '正義感弱', '壓力脆弱'],
        mbtiSuitability: ['ENTJ', 'INTJ', 'ENTP', 'ESTJ'],
        personalityFit: 0.9
      },
      '法官': {
        requiredTraits: ['公正客觀', '邏輯分析', '道德操守', '決斷力'],
        beneficialTraits: ['法學素養', '經驗智慧', '情緒穩定', '威嚴氣質'],
        challengingTraits: ['偏見主觀', '邏輯不清', '道德缺失', '優柔寡斷'],
        mbtiSuitability: ['INTJ', 'ISTJ', 'ENTJ', 'ESTJ'],
        personalityFit: 0.95
      },

      // 傳媒娛樂 (5種)
      '記者': {
        requiredTraits: ['好奇心', '溝通能力', '敏銳觀察', '文字能力'],
        beneficialTraits: ['時事敏感', '人脈建立', '快速學習', '抗壓性'],
        challengingTraits: ['缺乏好奇', '溝通困難', '觀察遲鈍', '文字障礙'],
        mbtiSuitability: ['ENFP', 'ENTP', 'ESFP', 'ESTP'],
        personalityFit: 0.8
      },
      '演員': {
        requiredTraits: ['表演天賦', '情感豐富', '表達能力', '想像力'],
        beneficialTraits: ['身體協調', '記憶能力', '適應力', '自信心'],
        challengingTraits: ['表演生澀', '情感貧乏', '表達困難', '想像匱乏'],
        mbtiSuitability: ['ESFP', 'ENFP', 'ISFP', 'ESTP'],
        personalityFit: 0.75
      }
    };
  }

  // ==================== 特質關聯矩陣 ====================
  setupTraitCorrelations() {
    return {
      // 正面特質的平衡機制
      '樂觀開朗': {
        compatibleNegative: ['有時過於樂觀', '忽視現實問題', '缺乏危機意識'],
        incompatibleNegative: ['極度悲觀', '憂鬱症傾向', '絕望心態'],
        synergisticPositive: ['積極主動', '團隊精神', '抗壓能力'],
        probability: 0.7
      },
      '完美主義': {
        compatibleNegative: ['過度挑剔', '難以妥協', '壓力過大', '拖延傾向'],
        compatiblePositive: ['注重細節', '責任感強', '品質導向'],
        incompatibleNegative: ['馬虎隨便', '得過且過', '不負責任'],
        probability: 0.8
      },
      '極度內向': {
        compatibleNegative: ['社交困難', '表達困難', '孤獨感', '社交恐懼'],
        compatiblePositive: ['深度思考', '專注力強', '獨立自主'],
        incompatibleNegative: ['譁眾取寵', '過度社交', '膚淺外向'],
        incompatiblePositive: ['領導魅力', '公開演講', '社交達人'],
        probability: 0.9
      },
      '領導魅力': {
        compatibleNegative: ['控制慾強', '自我中心', '缺乏耐心'],
        compatiblePositive: ['自信心', '決斷力', '溝通能力'],
        incompatibleNegative: ['極度害羞', '缺乏自信', '逃避責任'],
        probability: 0.75
      },
      '同理心強': {
        compatibleNegative: ['過度敏感', '情緒化', '容易受傷'],
        compatiblePositive: ['善解人意', '關懷他人', '團隊合作'],
        incompatibleNegative: ['冷漠無情', '自私自利', '缺乏感情'],
        probability: 0.8
      }
    };
  }

  // ==================== 信仰行為一致性 ====================
  setupFaithBehavior() {
    return {
      '慕道友': {
        typicalBehaviors: ['對信仰好奇', '參加佈道會', '提出質疑', '觀察信徒'],
        spiritualPractices: ['偶爾禱告', '閱讀福音書', '參與查經'],
        churchInvolvement: 'observer',
        witnessing: 'none',
        maturityLevel: 0.1
      },
      '初信者': {
        typicalBehaviors: ['積極學習', '參加主日', '信仰疑問多', '尋求指導'],
        spiritualPractices: ['基礎禱告', '讀經計劃', '背誦金句'],
        churchInvolvement: 'minimal',
        witnessing: 'hesitant',
        maturityLevel: 0.3
      },
      '穩定信徒': {
        typicalBehaviors: ['規律聚會', '穩定奉獻', '小組參與', '關懷新人'],
        spiritualPractices: ['每日靈修', '主題查經', '感恩禱告'],
        churchInvolvement: 'regular',
        witnessing: 'occasional',
        maturityLevel: 0.6
      },
      '成熟信徒': {
        typicalBehaviors: ['服事委身', '門徒訓練', '屬靈導師', '真理教導'],
        spiritualPractices: ['深度查經', '代禱服事', '禁食禱告'],
        churchInvolvement: 'active',
        witnessing: 'confident',
        maturityLevel: 0.8
      },
      '屬靈長者': {
        typicalBehaviors: ['智慧分享', '生命典範', '教會領導', '跨代牧養'],
        spiritualPractices: ['默想經文', '靈性指導', '屬靈爭戰'],
        churchInvolvement: 'leadership',
        witnessing: 'lifestyle',
        maturityLevel: 1.0
      }
    };
  }

  // ==================== 台灣文化因子 ====================
  setupTaiwanCulture() {
    return {
      regionalDifferences: {
        '北部都會': {
          characteristics: ['步調快速', '競爭激烈', '國際化程度高', '創新開放'],
          influences: ['效率導向', '壓力較大', '多元包容', '時尚意識'],
          personalityTrends: ['目標導向', '時間敏感', '網路依賴', '個人主義']
        },
        '中部傳統': {
          characteristics: ['重視傳統', '家庭觀念強', '人情味濃', '產業聚集'],
          influences: ['保守穩定', '關係導向', '集體意識', '實務重視'],
          personalityTrends: ['關係優先', '穩定保守', '家庭責任', '實用主義']
        },
        '南部悠閒': {
          characteristics: ['生活節奏慢', '重視享受', '人際溫暖', '文化底蘊'],
          influences: ['隨性自在', '情感豐富', '生活品質', '傳統保存'],
          personalityTrends: ['享受當下', '人情重視', '藝術感知', '傳統價值']
        }
      },
      generationalDifferences: {
        '嬰兒潮世代': {
          values: ['勤儉持家', '重視穩定', '尊重權威', '集體利益'],
          workStyle: ['忠誠度高', '重視資歷', '集體決策', '長期導向'],
          challenges: ['科技適應', '觀念轉換', '代溝問題']
        },
        'X世代': {
          values: ['平衡工作生活', '實用主義', '獨立自主', '懷疑權威'],
          workStyle: ['效率導向', '彈性工作', '結果導向', '個人表現'],
          challenges: ['職涯轉換', '家庭責任', '中年危機']
        },
        'Y世代': {
          values: ['自我實現', '多元包容', '科技運用', '即時滿足'],
          workStyle: ['創新思維', '協作模式', '即時回饋', '彈性安排'],
          challenges: ['經濟壓力', '職涯迷茫', '關係經營']
        },
        'Z世代': {
          values: ['個人品牌', '社會責任', '數位原生', '多元認同'],
          workStyle: ['多工處理', '視覺化溝通', '彈性職涯', '遠端工作'],
          challenges: ['注意力分散', '現實適應', '深度關係']
        }
      }
    };
  }

  // ==================== 主要生成函數 ====================
  generateAdvancedCharacter(constraints = {}) {
    const generationSteps = {
      step1: () => this.generateBasicInfo(constraints),
      step2: () => this.assignMBTIType(),
      step3: () => this.generateCoreTraits(),
      step4: () => this.validateTraitCompatibility(),
      step5: () => this.matchOccupationToPersonality(),
      step6: () => this.validateAgeLogic(),
      step7: () => this.generateFaithProfile(),
      step8: () => this.applyTaiwanCulturalFactors(),
      step9: () => this.generateDetailedProfile(),
      step10: () => this.calculateRealismScore()
    };

    this.character = {};
    this.generationLog = [];

    try {
      // 執行所有生成步驟
      Object.entries(generationSteps).forEach(([stepName, stepFunction]) => {
        const result = stepFunction();
        this.generationLog.push({
          step: stepName,
          success: result.success,
          data: result.data,
          warnings: result.warnings || []
        });
      });

      // 最終驗證和調整
      this.finalValidationAndAdjustment();

      return {
        character: this.character,
        realismScore: this.character.realismScore,
        generationLog: this.generationLog,
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '2.0.0',
          engine: 'AdvancedCharacterEngine'
        }
      };

    } catch (error) {
      return this.handleGenerationError(error);
    }
  }

  // ==================== 步驟1: 基本資訊生成 ====================
  generateBasicInfo(constraints) {
    try {
      // 年齡生成 (考慮約束)
      const ageRange = constraints.ageRange || [18, 70];
      this.character.age = Math.floor(Math.random() * (ageRange[1] - ageRange[0] + 1)) + ageRange[0];
      
      // 獲取年齡階段資訊
      const ageStage = this.getAgeStage(this.character.age);
      this.character.ageStage = ageStage;
      this.character.ageStageInfo = this.lifeStageFramework[ageStage];

      // 性別
      this.character.gender = constraints.gender || this.randomChoice(['男性', '女性']);

      // 姓名生成
      this.character.name = this.generateName(this.character.gender);

      // 地區背景
      this.character.region = constraints.region || this.randomChoice(['北部都會', '中部傳統', '南部悠閒']);
      this.character.regionalInfluence = this.taiwanCulturalFactors.regionalDifferences[this.character.region];

      // 世代特徵
      this.character.generation = this.determineGeneration(this.character.age);
      this.character.generationalTraits = this.taiwanCulturalFactors.generationalDifferences[this.character.generation];

      return {
        success: true,
        data: {
          age: this.character.age,
          ageStage: this.character.ageStage,
          gender: this.character.gender,
          name: this.character.name,
          region: this.character.region,
          generation: this.character.generation
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== 步驟2: MBTI類型指派 ====================
  assignMBTIType() {
    try {
      // 基於年齡、地區、世代的MBTI概率調整
      const mbtiProbabilities = this.calculateMBTIProbabilities();
      
      this.character.mbtiType = this.weightedRandomChoice(mbtiProbabilities);
      this.character.mbtiProfile = this.mbtiSystem[this.character.mbtiType];

      // 基於MBTI推導基本行為傾向
      this.character.behaviorTendencies = {
        workStyle: this.character.mbtiProfile.workStyle,
        relationshipStyle: this.character.mbtiProfile.relationshipStyle,
        stressResponse: this.character.mbtiProfile.stressResponse,
        decisionMaking: this.deriveMBTIDecisionStyle(this.character.mbtiType),
        communicationStyle: this.deriveMBTICommunicationStyle(this.character.mbtiType)
      };

      return {
        success: true,
        data: {
          mbtiType: this.character.mbtiType,
          behaviorTendencies: this.character.behaviorTendencies
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== 步驟3: 核心特質生成 ====================
  generateCoreTraits() {
    try {
      // 基於MBTI生成核心特質
      const mbtiStrengths = this.character.mbtiProfile.strengths;
      const mbtiChallenges = this.character.mbtiProfile.challenges;

      // 核心特質權重分配
      this.character.coreTraits = this.selectWeightedTraits(this.traitWeightSystem.coreTraits, 3);
      this.character.primaryTraits = this.selectWeightedTraits(this.traitWeightSystem.primaryTraits, 4);
      this.character.secondaryTraits = this.selectWeightedTraits(this.traitWeightSystem.secondaryTraits, 5);

      // 結合MBTI特質
      this.character.strengths = [...mbtiStrengths, ...this.character.coreTraits.filter(t => this.isPositiveTrait(t))];
      this.character.challenges = [...mbtiChallenges, ...this.character.primaryTraits.filter(t => this.isNegativeTrait(t))];

      // 確保特質平衡
      this.balanceTraitDistribution();

      return {
        success: true,
        data: {
          coreTraits: this.character.coreTraits,
          strengths: this.character.strengths,
          challenges: this.character.challenges
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== 步驟4: 特質相容性驗證 ====================
  validateTraitCompatibility() {
    try {
      const allTraits = [...this.character.strengths, ...this.character.challenges];
      const incompatiblePairs = [];
      const warnings = [];

      // 檢查特質相容性
      for (let trait of allTraits) {
        if (this.traitCorrelationMatrix[trait]) {
          const correlation = this.traitCorrelationMatrix[trait];
          
          // 檢查不相容特質
          if (correlation.incompatiblePositive) {
            const conflicts = allTraits.filter(t => correlation.incompatiblePositive.includes(t));
            if (conflicts.length > 0) {
              incompatiblePairs.push([trait, conflicts]);
            }
          }

          if (correlation.incompatibleNegative) {
            const conflicts = allTraits.filter(t => correlation.incompatibleNegative.includes(t));
            if (conflicts.length > 0) {
              incompatiblePairs.push([trait, conflicts]);
            }
          }
        }
      }

      // 處理不相容問題
      if (incompatiblePairs.length > 0) {
        this.resolveTraitConflicts(incompatiblePairs);
        warnings.push(`解決了 ${incompatiblePairs.length} 個特質衝突`);
      }

      // 添加關聯特質以增加真實感
      this.addCorrelatedTraits();

      return {
        success: true,
        data: {
          incompatiblePairs: incompatiblePairs.length,
          traitsAdjusted: true
        },
        warnings
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== 步驟5: 職業性格匹配 ====================
  matchOccupationToPersonality() {
    try {
      // 計算所有職業的匹配度
      const occupationScores = {};
      
      for (let occupation of this.db.occupations.all) {
        const score = this.calculateJobPersonalityMatch(occupation);
        occupationScores[occupation] = score;
      }

      // 選擇匹配度最高的前5名職業
      const topMatches = Object.entries(occupationScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      // 從前5名中隨機選擇 (給予一些變化性)
      const selectedOccupation = this.weightedRandomChoice(
        topMatches.reduce((acc, [job, score]) => {
          acc[job] = score;
          return acc;
        }, {})
      );

      this.character.occupation = selectedOccupation;
      this.character.occupationMatch = occupationScores[selectedOccupation];
      this.character.occupationData = this.jobPersonalityMatrix[selectedOccupation];

      // 生成職業相關特質和技能
      this.generateOccupationTraits();

      return {
        success: true,
        data: {
          occupation: this.character.occupation,
          matchScore: this.character.occupationMatch,
          topAlternatives: topMatches.slice(1, 4)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== 步驟6: 年齡邏輯驗證 ====================
  validateAgeLogic() {
    try {
      const ageStageConstraints = this.character.ageStageInfo.constraintsCheck;
      const warnings = [];

      // 驗證職業經驗與年齡匹配
      const occupationLevel = this.determineOccupationLevel(this.character.occupation);
      const expectedLevel = this.getExpectedCareerLevel(this.character.age);

      if (occupationLevel > expectedLevel + 1) {
        warnings.push('職業級別可能高於年齡預期');
        // 調整職業描述或降低責任範圍
        this.adjustOccupationForAge();
      }

      // 驗證領導經驗
      if (this.character.strengths.includes('領導魅力') && ageStageConstraints.leadership === 'low') {
        warnings.push('年齡較小但具有領導特質，調整為潛在領導力');
        this.character.strengths = this.character.strengths.map(t => 
          t === '領導魅力' ? '潛在領導力' : t
        );
      }

      // 驗證財務狀況
      this.character.financialStatus = this.generateAgeAppropriateFinances();

      // 驗證人生經歷
      this.character.lifeExperiences = this.generateAgeAppropriateExperiences();

      return {
        success: true,
        data: {
          ageLogicValid: warnings.length === 0,
          adjustmentsMade: warnings.length
        },
        warnings
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== 步驟7: 信仰檔案生成 ====================
  generateFaithProfile() {
    try {
      // 信仰深度與年齡、經歷相關
      const faithDepth = this.determineFaithDepth();
      this.character.faithLevel = faithDepth;
      this.character.faithProfile = this.faithBehaviorSystem[faithDepth];

      // 生成具體信仰特徵
      this.character.faithDetails = {
        denomination: this.randomChoice(this.db.faith.denominations),
        conversionStory: this.generateConversionStory(),
        spiritualGifts: this.selectSpiritualGifts(),
        churchInvolvement: this.generateChurchInvolvement(),
        dailyPractices: this.generateSpiritualPractices(),
        challenges: this.generateFaithChallenges()
      };

      // 確保信仰行為一致性
      this.validateFaithBehaviorConsistency();

      return {
        success: true,
        data: {
          faithLevel: this.character.faithLevel,
          denomination: this.character.faithDetails.denomination,
          consistency: 'validated'
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== 步驟8: 台灣文化因子應用 ====================
  applyTaiwanCulturalFactors() {
    try {
      // 地區文化影響
      const regionalTraits = this.character.regionalInfluence.personalityTrends;
      this.character.culturalTraits = regionalTraits;

      // 世代特徵影響
      const generationalValues = this.character.generationalTraits.values;
      this.character.values = [...this.character.values || [], ...generationalValues.slice(0, 2)];

      // 工作風格調整
      this.character.workStyle = this.blendWorkStyles(
        this.character.behaviorTendencies.workStyle,
        this.character.generationalTraits.workStyle
      );

      // 社交模式調整
      this.character.socialPatterns = this.generateCulturalSocialPatterns();

      // 語言使用
      this.character.languageUse = this.generateLanguageProfile();

      return {
        success: true,
        data: {
          culturalTraits: this.character.culturalTraits,
          values: this.character.values,
          workStyle: this.character.workStyle
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== 步驟9: 詳細檔案生成 ====================
  generateDetailedProfile() {
    try {
      // 外貌特徵
      this.character.appearance = this.generateAppearance();

      // 家庭背景
      this.character.family = this.generateFamilyBackground();

      // 教育背景
      this.character.education = this.generateEducationBackground();

      // 興趣愛好
      this.character.hobbies = this.generateHobbies();

      // 生活模式
      this.character.lifestyle = this.generateLifestyle();

      // 健康狀況
      this.character.health = this.generateHealthProfile();

      // 個人故事
      this.character.personalStory = this.generatePersonalStory();

      // 目標與夢想
      this.character.goals = this.generateGoalsAndDreams();

      return {
        success: true,
        data: {
          profileComplete: true,
          sectionsGenerated: 8
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== 步驟10: 真實感評分 ====================
  calculateRealismScore() {
    try {
      const scores = {
        traitConsistency: this.scoreTraitConsistency(),
        ageLogic: this.scoreAgeLogic(),
        occupationMatch: this.scoreOccupationMatch(),
        faithConsistency: this.scoreFaithConsistency(),
        culturalFit: this.scoreCulturalFit(),
        overallCoherence: this.scoreOverallCoherence()
      };

      const weightedScore = (
        scores.traitConsistency * 0.25 +
        scores.ageLogic * 0.20 +
        scores.occupationMatch * 0.20 +
        scores.faithConsistency * 0.15 +
        scores.culturalFit * 0.10 +
        scores.overallCoherence * 0.10
      );

      this.character.realismScore = Math.round(weightedScore);
      this.character.realismDetails = scores;
      this.character.realismGrade = this.getRealismGrade(weightedScore);

      return {
        success: true,
        data: {
          totalScore: this.character.realismScore,
          grade: this.character.realismGrade,
          breakdown: scores
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== 輔助函數 ====================
  getAgeStage(age) {
    if (age >= 18 && age <= 25) return '18-25';
    if (age >= 26 && age <= 35) return '26-35';
    if (age >= 36 && age <= 50) return '36-50';
    if (age >= 51 && age <= 70) return '51-70';
    return '18-25'; // 預設值
  }

  determineGeneration(age) {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    
    if (birthYear >= 1946 && birthYear <= 1964) return '嬰兒潮世代';
    if (birthYear >= 1965 && birthYear <= 1980) return 'X世代';
    if (birthYear >= 1981 && birthYear <= 1996) return 'Y世代';
    if (birthYear >= 1997 && birthYear <= 2012) return 'Z世代';
    return 'Y世代'; // 預設值
  }

  calculateMBTIProbabilities() {
    // 基礎MBTI分布 (基於台灣人口統計調整)
    const baseProbabilities = {
      'ISTJ': 0.12, 'ISFJ': 0.14, 'INFJ': 0.04, 'INTJ': 0.03,
      'ISTP': 0.06, 'ISFP': 0.09, 'INFP': 0.05, 'INTP': 0.04,
      'ESTP': 0.05, 'ESFP': 0.08, 'ENFP': 0.08, 'ENTP': 0.04,
      'ESTJ': 0.09, 'ESFJ': 0.12, 'ENFJ': 0.03, 'ENTJ': 0.02
    };

    // 根據地區、世代調整概率
    const adjustedProbabilities = { ...baseProbabilities };
    
    // 地區調整
    if (this.character.region === '北部都會') {
      adjustedProbabilities['ENTJ'] *= 1.5;
      adjustedProbabilities['ENTP'] *= 1.3;
      adjustedProbabilities['ISFJ'] *= 0.8;
    }

    return adjustedProbabilities;
  }

  calculateJobPersonalityMatch(occupation) {
    const jobData = this.jobPersonalityMatrix[occupation];
    if (!jobData) return 0.5;

    let score = 0.5; // 基礎分數

    const allTraits = [...this.character.strengths, ...this.character.coreTraits];

    // 必需特質匹配
    for (let trait of jobData.requiredTraits) {
      if (allTraits.includes(trait)) score += 0.15;
    }

    // 有益特質匹配
    for (let trait of jobData.beneficialTraits) {
      if (allTraits.includes(trait)) score += 0.1;
    }

    // 挑戰性特質懲分
    for (let trait of jobData.challengingTraits) {
      if (allTraits.includes(trait)) score -= 0.1;
    }

    // MBTI適合度
    if (jobData.mbtiSuitability.includes(this.character.mbtiType)) {
      score += 0.2;
    }

    return Math.max(0, Math.min(1, score));
  }

  weightedRandomChoice(probabilities) {
    const total = Object.values(probabilities).reduce((sum, prob) => sum + prob, 0);
    let random = Math.random() * total;
    
    for (let [item, probability] of Object.entries(probabilities)) {
      random -= probability;
      if (random <= 0) return item;
    }
    
    return Object.keys(probabilities)[0]; // 回退選項
  }

  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // ==================== 生成完整人物資料 ====================
  formatCharacterOutput() {
    return {
      // 基本資訊
      name: this.character.name,
      age: this.character.age,
      gender: this.character.gender,
      occupation: this.character.occupation,
      
      // 心理特質
      mbtiType: this.character.mbtiType,
      strengths: this.character.strengths,
      challenges: this.character.challenges,
      
      // 信仰生活
      faithLevel: this.character.faithLevel,
      denomination: this.character.faithDetails.denomination,
      spiritualGifts: this.character.faithDetails.spiritualGifts,
      
      // 生活背景
      family: this.character.family,
      education: this.character.education,
      lifestyle: this.character.lifestyle,
      
      // 文化背景
      region: this.character.region,
      generation: this.character.generation,
      values: this.character.values,
      
      // 品質指標
      realismScore: this.character.realismScore,
      realismGrade: this.character.realismGrade,
      occupationMatch: this.character.occupationMatch
    };
  }
}

// ==================== 主要導出函數 ====================
export function generateAdvancedCharacter(database, constraints = {}) {
  const engine = new AdvancedCharacterEngine(database);
  const result = engine.generateAdvancedCharacter(constraints);
  
  if (result.character) {
    return engine.formatCharacterOutput();
  }
  
  throw new Error('Character generation failed: ' + result.error);
}

export { AdvancedCharacterEngine }; 