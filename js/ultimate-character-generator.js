/**
 * 🚀 VCGOWE 終極人物生成系統 v2.0
 * 整合：60種職業 + 16種MBTI + 特質關聯 + 年齡邏輯 + 信仰一致性
 */

class UltimateCharacterGenerator {
    constructor() {
        this.initializeSystems();
    }

    initializeSystems() {
        // 核心系統初始化
        this.occupations = this.setupOccupations();
        this.mbtiProfiles = this.setupMBTIProfiles();
        this.traitMatrix = this.setupTraitMatrix();
        this.ageStages = this.setupAgeStages();
        this.faithLevels = this.setupFaithLevels();
        this.jobMatching = this.setupJobMatching();
    }

    // ==================== 60種職業系統 ====================
    setupOccupations() {
        return {
            // 科技業 (10種)
            technology: [
                '軟體工程師', '資料科學家', 'UI/UX 設計師', '網路安全分析師', '系統管理員',
                'DevOps 工程師', '產品經理', '人工智慧研究員', '區塊鏈開發者', 'IT 技術支援'
            ],
            // 醫療業 (10種)
            healthcare: [
                '醫師', '護理師', '藥劑師', '牙醫', '物理治療師',
                '心理諮商師', '獸醫', '營養師', '醫學檢驗師', '中醫師'
            ],
            // 商業金融 (10種)
            business: [
                '會計師', '金融分析師', '行銷經理', '人力資源經理', '管理顧問',
                '投資銀行家', '審計師', '不動產經紀人', '保險業務員', '企業家'
            ],
            // 創意藝術 (10種)
            creative: [
                '藝術家', '作家', '音樂家', '攝影師', '平面設計師',
                '電影導演', '編劇', '動畫師', '插畫師', '時尚設計師'
            ],
            // 教育業 (5種)
            education: [
                '老師', '大學教授', '圖書館員', '學術研究員', '幼教老師'
            ],
            // 服務業 (5種)
            service: [
                '廚師', '理髮師', '健身教練', '咖啡師', '飯店經理'
            ],
            // 公職法律 (5種)
            government: [
                '律師', '法官', '警察', '消防員', '公務員'
            ],
            // 傳媒娛樂 (5種)
            media: [
                '記者', '主播', '廣播主持人', '演員', '歌手'
            ]
        };
    }

    // ==================== 16種MBTI系統 ====================
    setupMBTIProfiles() {
        return {
            // 分析師 (NT)
            'INTJ': {
                name: '建築師',
                traits: ['戰略思維', '獨立判斷', '系統規劃'],
                challenges: ['社交困難', '完美主義'],
                workStyle: '獨立工作，重視效率',
                suitableJobs: ['軟體工程師', '建築師', '策略顧問']
            },
            'INTP': {
                name: '邏輯學家',
                traits: ['邏輯分析', '創新思維', '理論探索'],
                challenges: ['實務感不足', '拖延傾向'],
                workStyle: '彈性時間，深度思考',
                suitableJobs: ['資料科學家', '研究員', '系統分析師']
            },
            'ENTJ': {
                name: '指揮官',
                traits: ['領導能力', '戰略規劃', '決斷力'],
                challenges: ['過度控制', '缺乏耐心'],
                workStyle: '目標導向，領導團隊',
                suitableJobs: ['執行長', '創業家', '管理顧問']
            },
            'ENTP': {
                name: '辯論家',
                traits: ['創新思維', '適應力強', '溝通能力'],
                challenges: ['注意力分散', '缺乏持續性'],
                workStyle: '多元化工作，避免重複',
                suitableJobs: ['企業家', '行銷經理', '創意總監']
            },
            // 外交官 (NF)
            'INFJ': {
                name: '提倡者',
                traits: ['洞察人性', '理想主義', '同理心'],
                challenges: ['過度敏感', '完美主義'],
                workStyle: '有意義的工作，幫助他人',
                suitableJobs: ['心理諮商師', '作家', '牧師']
            },
            'INFP': {
                name: '調停者',
                traits: ['價值堅持', '創意表達', '同理心'],
                challenges: ['優柔寡斷', '衝突迴避'],
                workStyle: '價值驅動，個人意義',
                suitableJobs: ['藝術家', '社工師', '編劇']
            },
            'ENFJ': {
                name: '主人公',
                traits: ['領導魅力', '同理心', '溝通能力'],
                challenges: ['過度付出', '忽視自我'],
                workStyle: '團隊合作，人員發展',
                suitableJobs: ['老師', '人力資源經理', '牧師']
            },
            'ENFP': {
                name: '競選者',
                traits: ['熱情活力', '創意思維', '人際技巧'],
                challenges: ['注意力分散', '情緒起伏'],
                workStyle: '多元環境，人際互動',
                suitableJobs: ['行銷專員', '記者', '演員']
            },
            // 守護者 (SJ)
            'ISTJ': {
                name: '物流師',
                traits: ['責任感強', '細心謹慎', '忠誠可靠'],
                challenges: ['變化抗拒', '創新不足'],
                workStyle: '結構化環境，明確分工',
                suitableJobs: ['會計師', '審計師', '公務員']
            },
            'ISFJ': {
                name: '守護者',
                traits: ['關懷他人', '責任感', '細心體貼'],
                challenges: ['自我忽視', '衝突迴避'],
                workStyle: '服務他人，穩定環境',
                suitableJobs: ['護理師', '社工師', '圖書館員']
            },
            'ESTJ': {
                name: '總經理',
                traits: ['組織領導', '決斷力', '效率導向'],
                challenges: ['固執傳統', '缺乏彈性'],
                workStyle: '階層分明，目標導向',
                suitableJobs: ['管理職', '軍官', '法官']
            },
            'ESFJ': {
                name: '執政官',
                traits: ['人際和諧', '組織協調', '關懷他人'],
                challenges: ['衝突敏感', '批評脆弱'],
                workStyle: '團隊協作，人際互動',
                suitableJobs: ['人力資源', '客服經理', '教師']
            },
            // 探險家 (SP)
            'ISTP': {
                name: '鑑賞家',
                traits: ['實務技能', '問題解決', '冷靜客觀'],
                challenges: ['情感表達困難', '長期規劃弱'],
                workStyle: '實務操作，獨立工作',
                suitableJobs: ['工程師', '技師', '設計師']
            },
            'ISFP': {
                name: '探險家',
                traits: ['美感敏銳', '同理心', '適應力'],
                challenges: ['衝突迴避', '決策困難'],
                workStyle: '創意環境，個人空間',
                suitableJobs: ['藝術家', '設計師', '攝影師']
            },
            'ESTP': {
                name: '企業家',
                traits: ['行動力強', '適應力', '人際技巧'],
                challenges: ['缺乏規劃', '注意力分散'],
                workStyle: '動態環境，即時反應',
                suitableJobs: ['業務員', '運動員', '演員']
            },
            'ESFP': {
                name: '娛樂家',
                traits: ['熱情活力', '人際魅力', '適應力'],
                challenges: ['規劃能力弱', '衝突敏感'],
                workStyle: '人際互動，靈活環境',
                suitableJobs: ['娛樂業', '客服代表', '銷售員']
            }
        };
    }

    // ==================== 特質關聯矩陣 ====================
    setupTraitMatrix() {
        return {
            '樂觀開朗': {
                compatible: ['積極主動', '團隊精神', '抗壓能力'],
                incompatible: ['極度悲觀', '憂鬱症傾向'],
                balancing: ['有時過於樂觀', '忽視現實問題']
            },
            '完美主義': {
                compatible: ['注重細節', '責任感強', '品質導向'],
                incompatible: ['馬虎隨便', '得過且過'],
                balancing: ['過度挑剔', '難以妥協', '壓力過大']
            },
            '極度內向': {
                compatible: ['深度思考', '專注力強', '獨立自主'],
                incompatible: ['領導魅力', '公開演講', '社交達人'],
                balancing: ['社交困難', '表達困難', '孤獨感']
            },
            '領導魅力': {
                compatible: ['自信心', '決斷力', '溝通能力'],
                incompatible: ['極度害羞', '缺乏自信'],
                balancing: ['控制慾強', '自我中心', '缺乏耐心']
            },
            '同理心強': {
                compatible: ['善解人意', '關懷他人', '團隊合作'],
                incompatible: ['冷漠無情', '自私自利'],
                balancing: ['過度敏感', '情緒化', '容易受傷']
            }
        };
    }

    // ==================== 年齡階段系統 ====================
    setupAgeStages() {
        return {
            '18-25': {
                name: '探索建立期',
                constraints: {
                    leadership: 'low',
                    experience: 'limited',
                    wisdom: 'basic',
                    finances: 'developing'
                },
                typicalTraits: ['可塑性高', '探索精神', '學習渴望'],
                challenges: ['職涯迷茫', '經濟壓力', '人際適應']
            },
            '26-35': {
                name: '建立穩定期',
                constraints: {
                    leadership: 'developing',
                    experience: 'moderate',
                    wisdom: 'growing',
                    finances: 'improving'
                },
                typicalTraits: ['責任感增加', '目標明確', '技能深化'],
                challenges: ['工作生活平衡', '財務壓力', '職涯發展']
            },
            '36-50': {
                name: '深化成熟期',
                constraints: {
                    leadership: 'high',
                    experience: 'extensive',
                    wisdom: 'mature',
                    finances: 'stable'
                },
                typicalTraits: ['經驗豐富', '領導能力', '人生智慧'],
                challenges: ['職業倦怠', '中年危機', '健康關注']
            },
            '51-70': {
                name: '智慧傳承期',
                constraints: {
                    leadership: 'executive',
                    experience: 'expert',
                    wisdom: 'wise',
                    finances: 'established'
                },
                typicalTraits: ['智慧深邃', '經驗傳承', '靈性成長'],
                challenges: ['健康變化', '角色轉換', '退休適應']
            }
        };
    }

    // ==================== 信仰深度系統 ====================
    setupFaithLevels() {
        return {
            '慕道友': {
                behaviors: ['對信仰好奇', '參加佈道會', '提出質疑'],
                practices: ['偶爾禱告', '閱讀福音書'],
                involvement: 'observer',
                maturity: 0.1
            },
            '初信者': {
                behaviors: ['積極學習', '參加主日', '尋求指導'],
                practices: ['基礎禱告', '讀經計劃', '背誦金句'],
                involvement: 'minimal',
                maturity: 0.3
            },
            '穩定信徒': {
                behaviors: ['規律聚會', '穩定奉獻', '小組參與'],
                practices: ['每日靈修', '主題查經', '感恩禱告'],
                involvement: 'regular',
                maturity: 0.6
            },
            '成熟信徒': {
                behaviors: ['服事委身', '門徒訓練', '屬靈導師'],
                practices: ['深度查經', '代禱服事', '禁食禱告'],
                involvement: 'active',
                maturity: 0.8
            },
            '屬靈長者': {
                behaviors: ['智慧分享', '生命典範', '教會領導'],
                practices: ['默想經文', '靈性指導', '屬靈爭戰'],
                involvement: 'leadership',
                maturity: 1.0
            }
        };
    }

    // ==================== 職業匹配系統 ====================
    setupJobMatching() {
        return {
            '軟體工程師': {
                requiredTraits: ['邏輯思維', '專注力', '學習能力'],
                suitableMBTI: ['INTJ', 'INTP', 'ISTJ', 'ISTP'],
                industry: 'technology'
            },
            '醫師': {
                requiredTraits: ['責任感', '抗壓性', '同理心'],
                suitableMBTI: ['INTJ', 'ENTJ', 'ISFJ', 'ENFJ'],
                industry: 'healthcare'
            },
            '行銷經理': {
                requiredTraits: ['創意思維', '溝通能力', '說服力'],
                suitableMBTI: ['ENFP', 'ENTP', 'ESFP', 'ENFJ'],
                industry: 'business'
            },
            '藝術家': {
                requiredTraits: ['創意天賦', '美感敏銳', '表達能力'],
                suitableMBTI: ['ISFP', 'INFP', 'ESFP', 'ENFP'],
                industry: 'creative'
            },
            '老師': {
                requiredTraits: ['教學熱忱', '溝通能力', '耐心'],
                suitableMBTI: ['ENFJ', 'ESFJ', 'ISFJ', 'INFJ'],
                industry: 'education'
            },
            '廚師': {
                requiredTraits: ['創意能力', '手藝技巧', '抗壓性'],
                suitableMBTI: ['ISFP', 'ESFP', 'ISTP', 'ESTP'],
                industry: 'service'
            },
            '律師': {
                requiredTraits: ['邏輯思維', '表達能力', '正義感'],
                suitableMBTI: ['ENTJ', 'INTJ', 'ENTP', 'ESTJ'],
                industry: 'government'
            },
            '記者': {
                requiredTraits: ['好奇心', '溝通能力', '敏銳觀察'],
                suitableMBTI: ['ENFP', 'ENTP', 'ESFP', 'ESTP'],
                industry: 'media'
            }
        };
    }

    // ==================== 主要生成函數 ====================
    generateUltimateCharacter(options = {}) {
        try {
            // 步驟1: 基本資訊
            const character = this.generateBasicInfo(options);
            
            // 步驟2: MBTI類型
            character.mbti = this.assignMBTIType(character, options);
            
            // 步驟3: 核心特質
            character.traits = this.generateTraits(character);
            
            // 步驟4: 職業匹配
            character.occupation = this.matchOccupation(character, options);
            
            // 步驟5: 信仰檔案
            character.faith = this.generateFaithProfile(character);
            
            // 步驟6: 詳細資料
            character.details = this.generateDetailedProfile(character);
            
            // 步驟7: 真實感評分
            character.realism = this.calculateRealismScore(character);
            
            // 步驟8: 最終格式化
            return this.formatFinalOutput(character);
            
        } catch (error) {
            console.error('Character generation failed:', error);
            return this.generateBackupCharacter();
        }
    }

    // ==================== 基本資訊生成 ====================
    generateBasicInfo(options) {
        const ageRange = options.ageRange || [18, 70];
        const age = Math.floor(Math.random() * (ageRange[1] - ageRange[0] + 1)) + ageRange[0];
        
        const ageStage = this.getAgeStage(age);
        
        return {
            name: this.generateName(options.gender),
            age: age,
            gender: options.gender || this.randomChoice(['男性', '女性']),
            ageStage: ageStage,
            ageConstraints: this.ageStages[ageStage].constraints,
            region: options.region || this.randomChoice(['北部', '中部', '南部'])
        };
    }

    // ==================== MBTI類型指派 ====================
    assignMBTIType(character, options) {
        if (options.mbtiType && this.mbtiProfiles[options.mbtiType]) {
            return options.mbtiType;
        }

        // 基於年齡和地區調整MBTI概率
        const mbtiKeys = Object.keys(this.mbtiProfiles);
        const selectedMBTI = this.randomChoice(mbtiKeys);
        
        return selectedMBTI;
    }

    // ==================== 特質生成 ====================
    generateTraits(character) {
        const mbtiProfile = this.mbtiProfiles[character.mbti];
        const ageStageInfo = this.ageStages[character.ageStage];

        // 基於MBTI的核心特質
        const coreTraits = [...mbtiProfile.traits];
        const challenges = [...mbtiProfile.challenges];

        // 根據年齡階段添加特質
        coreTraits.push(...ageStageInfo.typicalTraits.slice(0, 2));
        challenges.push(...ageStageInfo.challenges.slice(0, 1));

        // 特質平衡檢查
        const balancedTraits = this.balanceTraits(coreTraits, challenges);

        return {
            strengths: balancedTraits.strengths,
            challenges: balancedTraits.challenges,
            workStyle: mbtiProfile.workStyle
        };
    }

    // ==================== 職業匹配 ====================
    matchOccupation(character, options) {
        if (options.occupation) {
            return options.occupation;
        }

        // 獲取所有職業
        const allOccupations = Object.values(this.occupations).flat();
        const occupationScores = {};

        // 計算每個職業的匹配度
        for (let occupation of allOccupations) {
            occupationScores[occupation] = this.calculateJobMatch(character, occupation);
        }

        // 選擇匹配度最高的職業
        const bestMatches = Object.entries(occupationScores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        const selectedJob = bestMatches[0][0];
        const jobData = this.jobMatching[selectedJob] || {};

        return {
            title: selectedJob,
            industry: jobData.industry || 'general',
            matchScore: occupationScores[selectedJob],
            alternatives: bestMatches.slice(1, 3).map(([job]) => job)
        };
    }

    // ==================== 信仰檔案生成 ====================
    generateFaithProfile(character) {
        // 根據年齡決定信仰深度
        const faithDepth = this.determineFaithDepth(character.age);
        const faithData = this.faithLevels[faithDepth];

        return {
            level: faithDepth,
            maturity: faithData.maturity,
            behaviors: faithData.behaviors,
            practices: faithData.practices,
            involvement: faithData.involvement,
            denomination: this.randomChoice(['長老會', '浸信會', '靈恩教會', '循理會']),
            spiritualGifts: this.generateSpiritualGifts(),
            testimony: this.generateTestimony(character)
        };
    }

    // ==================== 詳細資料生成 ====================
    generateDetailedProfile(character) {
        return {
            appearance: this.generateAppearance(),
            family: this.generateFamily(character),
            education: this.generateEducation(character),
            lifestyle: this.generateLifestyle(character),
            hobbies: this.generateHobbies(character),
            personality: this.generatePersonalityDescription(character),
            background: this.generateBackgroundStory(character)
        };
    }

    // ==================== 真實感評分 ====================
    calculateRealismScore(character) {
        const scores = {
            traitConsistency: this.scoreTraitConsistency(character),
            ageLogic: this.scoreAgeLogic(character),
            occupationMatch: character.occupation.matchScore * 100,
            faithConsistency: this.scoreFaithConsistency(character),
            overallCoherence: this.scoreOverallCoherence(character)
        };

        const totalScore = Math.round(
            (scores.traitConsistency * 0.3 +
             scores.ageLogic * 0.25 +
             scores.occupationMatch * 0.25 +
             scores.faithConsistency * 0.1 +
             scores.overallCoherence * 0.1)
        );

        return {
            total: totalScore,
            breakdown: scores,
            grade: this.getGrade(totalScore)
        };
    }

    // ==================== 輔助函數 ====================
    getAgeStage(age) {
        if (age >= 18 && age <= 25) return '18-25';
        if (age >= 26 && age <= 35) return '26-35';
        if (age >= 36 && age <= 50) return '36-50';
        if (age >= 51 && age <= 70) return '51-70';
        return '26-35';
    }

    calculateJobMatch(character, occupation) {
        const jobData = this.jobMatching[occupation];
        if (!jobData) return 0.5;

        let score = 0.5;

        // MBTI匹配
        if (jobData.suitableMBTI.includes(character.mbti)) {
            score += 0.3;
        }

        // 特質匹配
        const characterTraits = character.traits.strengths;
        const requiredTraits = jobData.requiredTraits || [];
        
        for (let trait of requiredTraits) {
            if (characterTraits.includes(trait)) {
                score += 0.1;
            }
        }

        return Math.min(1, score);
    }

    balanceTraits(strengths, challenges) {
        const balanced = { strengths: [...strengths], challenges: [...challenges] };

        // 檢查特質衝突
        for (let strength of strengths) {
            const traitData = this.traitMatrix[strength];
            if (traitData) {
                // 添加平衡特質
                if (traitData.balancing && Math.random() < 0.6) {
                    const balanceTrait = this.randomChoice(traitData.balancing);
                    if (!balanced.challenges.includes(balanceTrait)) {
                        balanced.challenges.push(balanceTrait);
                    }
                }

                // 移除不相容特質
                balanced.challenges = balanced.challenges.filter(
                    challenge => !traitData.incompatible.includes(challenge)
                );
            }
        }

        return balanced;
    }

    determineFaithDepth(age) {
        // 年齡越大，信仰深度概率越高
        const random = Math.random();
        if (age < 25) {
            if (random < 0.4) return '慕道友';
            if (random < 0.8) return '初信者';
            return '穩定信徒';
        } else if (age < 35) {
            if (random < 0.3) return '初信者';
            if (random < 0.7) return '穩定信徒';
            return '成熟信徒';
        } else if (age < 50) {
            if (random < 0.2) return '穩定信徒';
            if (random < 0.7) return '成熟信徒';
            return '屬靈長者';
        } else {
            if (random < 0.3) return '成熟信徒';
            return '屬靈長者';
        }
    }

    generateName(gender) {
        const surnames = ['陳', '林', '張', '李', '王', '劉', '黃', '吳', '蔡', '楊'];
        const maleNames = ['志明', '建國', '文華', '俊傑', '偉強', '家豪', '冠廷', '宗翰'];
        const femaleNames = ['淑芬', '美玲', '雅婷', '怡君', '佳蓉', '素萍', '麗華', '婉婷'];
        
        const surname = this.randomChoice(surnames);
        const givenName = gender === '女性' ? 
            this.randomChoice(femaleNames) : 
            this.randomChoice(maleNames);
            
        return surname + givenName;
    }

    generateSpiritualGifts() {
        const gifts = ['教導', '領導', '服事', '憐憫', '幫助', '勸化', '施捨', '治理'];
        return this.randomChoice(gifts, Math.floor(Math.random() * 3) + 1);
    }

    // ==================== 評分函數 ====================
    scoreTraitConsistency(character) {
        // 檢查特質之間的邏輯一致性
        let score = 80;
        const traits = [...character.traits.strengths, ...character.traits.challenges];
        
        // 基本一致性檢查
        for (let trait of character.traits.strengths) {
            const traitData = this.traitMatrix[trait];
            if (traitData) {
                const conflicts = traits.filter(t => traitData.incompatible.includes(t));
                score -= conflicts.length * 10;
            }
        }
        
        return Math.max(0, Math.min(100, score));
    }

    scoreAgeLogic(character) {
        let score = 90;
        const constraints = character.ageConstraints;
        
        // 檢查領導特質與年齡匹配
        if (character.traits.strengths.includes('領導魅力') && constraints.leadership === 'low') {
            score -= 20;
        }
        
        // 檢查經驗相關特質
        if (character.traits.strengths.includes('人生智慧') && constraints.wisdom === 'basic') {
            score -= 15;
        }
        
        return Math.max(0, score);
    }

    scoreFaithConsistency(character) {
        let score = 85;
        const faithMaturity = character.faith.maturity;
        
        // 檢查信仰行為與深度的一致性
        if (faithMaturity < 0.3 && character.faith.involvement === 'leadership') {
            score -= 30;
        }
        
        if (faithMaturity > 0.8 && character.faith.involvement === 'observer') {
            score -= 25;
        }
        
        return Math.max(0, score);
    }

    scoreOverallCoherence(character) {
        // 整體人物的連貫性評分
        let score = 80;
        
        // MBTI與職業的匹配度
        const jobData = this.jobMatching[character.occupation.title];
        if (jobData && !jobData.suitableMBTI.includes(character.mbti)) {
            score -= 15;
        }
        
        return Math.max(0, score);
    }

    getGrade(score) {
        if (score >= 95) return 'A+';
        if (score >= 90) return 'A';
        if (score >= 85) return 'B+';
        if (score >= 80) return 'B';
        if (score >= 75) return 'C+';
        if (score >= 70) return 'C';
        return 'D';
    }

    // ==================== 最終輸出格式化 ====================
    formatFinalOutput(character) {
        return {
            // 基本資訊
            name: character.name,
            age: character.age,
            gender: character.gender,
            region: character.region,
            
            // 心理特質
            mbti: {
                type: character.mbti,
                name: this.mbtiProfiles[character.mbti].name,
                traits: character.traits.strengths,
                challenges: character.traits.challenges,
                workStyle: character.traits.workStyle
            },
            
            // 職業資訊
            occupation: {
                title: character.occupation.title,
                industry: character.occupation.industry,
                matchScore: Math.round(character.occupation.matchScore * 100),
                alternatives: character.occupation.alternatives
            },
            
            // 信仰生活
            faith: {
                level: character.faith.level,
                denomination: character.faith.denomination,
                spiritualGifts: character.faith.spiritualGifts,
                practices: character.faith.practices,
                involvement: character.faith.involvement
            },
            
            // 個人詳情
            details: character.details,
            
            // 品質評估
            realism: {
                score: character.realism.total,
                grade: character.realism.grade,
                breakdown: character.realism.breakdown
            },
            
            // 元數據
            metadata: {
                generatedAt: new Date().toISOString(),
                version: '2.0',
                engine: 'UltimateCharacterGenerator'
            }
        };
    }

    // ==================== 備用生成器 ====================
    generateBackupCharacter() {
        const occupations60 = Object.values(this.occupations).flat();
        
        return {
            name: this.generateName(this.randomChoice(['男性', '女性'])),
            age: Math.floor(Math.random() * 53) + 18,
            gender: this.randomChoice(['男性', '女性']),
            occupation: { title: this.randomChoice(occupations60) },
            mbti: { type: this.randomChoice(Object.keys(this.mbtiProfiles)) },
            traits: ['樂觀開朗', '責任感強', '學習能力佳'],
            faith: { level: '穩定信徒', denomination: '長老會' },
            realism: { score: 75, grade: 'C+' },
            metadata: { 
                version: '2.0-backup',
                note: '備用生成器產生' 
            }
        };
    }

    // ==================== 工具函數 ====================
    randomChoice(array, count = 1) {
        if (count === 1) {
            return array[Math.floor(Math.random() * array.length)];
        }
        
        const result = [];
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        for (let i = 0; i < Math.min(count, shuffled.length); i++) {
            result.push(shuffled[i]);
        }
        return result;
    }
}

// ==================== 主要導出函數 ====================
function generateUltimateCharacter(options = {}) {
    const generator = new UltimateCharacterGenerator();
    return generator.generateUltimateCharacter(options);
}

// 全域導出
if (typeof window !== 'undefined') {
    window.UltimateCharacterGenerator = UltimateCharacterGenerator;
    window.generateUltimateCharacter = generateUltimateCharacter;
}

export { UltimateCharacterGenerator, generateUltimateCharacter }; 