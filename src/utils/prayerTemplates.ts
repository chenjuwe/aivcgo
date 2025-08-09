import { PrayerTemplate, PrayerCategory, PrayerRequest } from '../types';

export const prayerTemplates: Record<PrayerCategory, PrayerTemplate> = {
  gratitude: {
    category: 'gratitude',
    templates: {
      opening: [
        '親愛的天父，我來到您面前滿懷感恩',
        '全能的神，我的心充滿對您的感謝',
        '慈愛的主，我要為您的恩典獻上感謝',
        '創造萬物的神，我向您獻上感恩的心',
        '永恆的主，我要讚美您的美善'
      ],
      body: [
        '感謝您賜給我生命中的每一個祝福',
        '感謝您在我軟弱時成為我的力量',
        '感謝您的愛從未離開過我',
        '感謝您為我預備的一切美好',
        '感謝您讓我看見您在我生命中的作為',
        '感謝您賜給我家人朋友的愛與陪伴',
        '感謝您每日的供應和保護',
        '感謝您在困難中與我同在',
        '感謝您給我健康的身體和清晰的思維',
        '感謝您讓我能夠體驗生命的美好'
      ],
      closing: [
        '願一切榮耀歸給您，奉主耶穌基督的名禱告，阿們',
        '我將這感恩的心獻給您，阿們',
        '願您的名得榮耀，阿們',
        '感謝您聽我的禱告，阿們'
      ]
    }
  },
  petition: {
    category: 'petition',
    templates: {
      opening: [
        '慈愛的天父，我謙卑地來到您面前',
        '全能的神，我帶著我的需要來尋求您',
        '親愛的主，我將我的重擔交託給您',
        '憐憫的神，我向您陳明我的心願',
        '信實的主，我相信您必垂聽我的禱告'
      ],
      body: [
        '求您賜給我智慧來面對生活中的挑戰',
        '求您為我開路，指引我前行的方向',
        '求您賜給我平安，讓我的心得到安息',
        '求您供應我一切的需要',
        '求您醫治我身心靈的創傷',
        '求您賜給我勇氣去面對困難',
        '求您幫助我做出正確的決定',
        '求您保守我的家人平安健康',
        '求您在我的工作中賜福與我',
        '求您讓我的生命能夠榮耀您'
      ],
      closing: [
        '我相信您必垂聽我的禱告，奉主耶穌基督的名求，阿們',
        '將這一切交託在您手中，阿們',
        '願您的旨意成就，阿們',
        '憑著信心將這些交給您，阿們'
      ]
    }
  },
  confession: {
    category: 'confession',
    templates: {
      opening: [
        '聖潔的神，我承認我是個罪人',
        '公義的主，我來到您面前認罪悔改',
        '慈愛的天父，我為我的過犯向您懺悔',
        '全知的神，您知道我心中的一切',
        '憐憫的主，我需要您的赦免'
      ],
      body: [
        '求您赦免我的罪孽和過犯',
        '求您洗淨我一切的不義',
        '求您賜給我一顆清潔的心',
        '求您更新我的靈，讓我重新得力',
        '求您幫助我遠離試探和罪惡',
        '求您赦免我對他人的傷害',
        '求您原諒我的自私和驕傲',
        '求您潔淨我的思想和言語',
        '求您幫助我真心悔改',
        '求您賜給我重新開始的機會'
      ],
      closing: [
        '感謝您的寬恕和救贖，奉主耶穌基督的名禱告，阿們',
        '求您繼續引導我走義路，阿們',
        '願我的生命能榮耀您的名，阿們',
        '感謝您的恩典和慈愛，阿們'
      ]
    }
  },
  praise: {
    category: 'praise',
    templates: {
      opening: [
        '全能永在的神，我要讚美您的聖名',
        '萬王之王，萬主之主，我敬拜您',
        '創造天地的主，我向您獻上讚美',
        '至高的神，您配得一切頌讚',
        '榮耀的主，我的心要稱頌您'
      ],
      body: [
        '您是我的磐石，我的救主',
        '您的愛高過諸天，您的信實直到萬代',
        '您的能力無人能及，您的智慧深不可測',
        '您是光，是愛，是生命的源頭',
        '您配得一切尊貴、榮耀和頌讚',
        '您的慈愛永遠長存',
        '您是我們的避難所和力量',
        '您的公義如山嶽，您的判斷如深淵',
        '您是和平的君王，是奇妙的策士',
        '您的名在全地何其美'
      ],
      closing: [
        '願一切榮耀歸於您，直到永永遠遠，阿們',
        '我要一生一世讚美您的名，阿們',
        '您是配得稱頌的神，阿們',
        '願萬口承認您是主，阿們'
      ]
    }
  },
  intercession: {
    category: 'intercession',
    templates: {
      opening: [
        '慈愛的天父，我為他人來到您面前代求',
        '全能的神，我將我所愛的人交託給您',
        '憐憫的主，我為需要幫助的人向您祈求',
        '慈悲的神，我為這個世界禱告',
        '愛我們的主，我為眾人向您祈求'
      ],
      body: [
        '求您看顧保護我的家人朋友',
        '求您醫治那些正在受苦的人',
        '求您賜福給那些服事您的人',
        '求您拯救還未認識您的人',
        '求您為這個世界帶來和平與公義',
        '求您安慰那些憂傷的心',
        '求您供應貧困人的需要',
        '求您醫治病患者的身體',
        '求您保護孩子們的純真',
        '求您賜智慧給領導者們'
      ],
      closing: [
        '相信您必垂聽這代禱，奉主耶穌基督的名求，阿們',
        '將他們都交託在您慈愛的手中，阿們',
        '願您的旨意行在地上如同行在天上，阿們',
        '感謝您聽我為他人的禱告，阿們'
      ]
    }
  },
  protection: {
    category: 'protection',
    templates: {
      opening: [
        '我的避難所，我的山寨，我投靠您',
        '全能的神，您是我的盾牌和保護',
        '耶和華我的神，我尋求您的庇護',
        '全能者的蔭下，我得到安全',
        '我的保護者，我將生命交託給您'
      ],
      body: [
        '求您用您的翅膀遮蔽我',
        '求您保護我脫離一切的危險',
        '求您差遣天使在我四圍安營',
        '求您作我腳前的燈，路上的光',
        '求您賜給我平安，除去我心中的懼怕',
        '求您保護我的家人出入平安',
        '求您看守我的心思意念',
        '求您為我築起保護的牆垣',
        '求您在黑暗中成為我的亮光',
        '求您讓我在您裡面得到安息'
      ],
      closing: [
        '我安然居住，因為獨有您使我安然居住，阿們',
        '在您裡面我得到完全的保護，阿們',
        '您是我永遠的避難所，阿們',
        '我要住在至高者的隱密處，阿們'
      ]
    }
  },
  guidance: {
    category: 'guidance',
    templates: {
      opening: [
        '智慧的神，我需要您的指引',
        '全知的主，求您為我指明道路',
        '慈愛的天父，我將我的前路交託給您',
        '引導者，我的腳步需要您的帶領',
        '明亮晨星，求您照亮我前行的路'
      ],
      body: [
        '求您賜給我智慧來做正確的決定',
        '求您開啟我的心眼，讓我明白您的旨意',
        '求您在每個十字路口為我指引方向',
        '求您讓我的腳步穩妥，道路平坦',
        '求您使用我成為他人的祝福',
        '求您幫助我分辨是非善惡',
        '求您讓我的選擇合乎您的心意',
        '求您在我迷茫時成為我的嚮導',
        '求您賜給我屬天的眼光',
        '求您讓我一生行在您的道路上'
      ],
      closing: [
        '我信靠您的帶領，奉主耶穌基督的名禱告，阿們',
        '願我一生跟隨您的腳蹤，阿們',
        '您的道路高過我的道路，阿們',
        '求您引導我直到永遠，阿們'
      ]
    }
  }
};

export const categoryNames: Record<PrayerCategory, string> = {
  gratitude: '感恩禱告',
  petition: '祈求禱告',
  confession: '懺悔禱告',
  praise: '讚美禱告',
  intercession: '代禱',
  protection: '保護禱告',
  guidance: '引導禱告'
};

export const categoryDescriptions: Record<PrayerCategory, string> = {
  gratitude: '為神的恩典和祝福獻上感謝',
  petition: '向神陳明個人的需要和請求',
  confession: '承認過錯並尋求神的赦免',
  praise: '讚美神的偉大和美好屬性',
  intercession: '為他人的需要向神代求',
  protection: '尋求神的保護和平安',
  guidance: '請求神的智慧和引導'
};

export function generatePrayer(request: PrayerRequest): string {
  const template = prayerTemplates[request.category];
  
  // 隨機選擇開頭
  const opening = template.templates.opening[
    Math.floor(Math.random() * template.templates.opening.length)
  ];
  
  // 根據長度選擇主體內容數量
  const bodyCount = request.length === 'short' ? 2 : 
                   request.length === 'medium' ? 3 : 5;
  
  const bodyParts = [];
  const availableBody = [...template.templates.body];
  
  for (let i = 0; i < bodyCount && availableBody.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableBody.length);
    bodyParts.push(availableBody.splice(randomIndex, 1)[0]);
  }
  
  // 如果有特殊需求，加入自定義內容
  if (request.specificNeeds?.trim()) {
    const customRequest = request.specificNeeds.startsWith('求您') 
      ? request.specificNeeds 
      : `特別求您${request.specificNeeds}`;
    bodyParts.push(customRequest);
  }
  
  // 隨機選擇結尾
  const closing = template.templates.closing[
    Math.floor(Math.random() * template.templates.closing.length)
  ];
  
  // 根據語調調整內容
  let prayerParts = [opening, ...bodyParts, closing];
  
  if (request.tone === 'casual') {
    // 更親切的語調
    prayerParts = prayerParts.map(part => 
      part.replace(/您/g, '祢').replace(/天父/g, '阿爸父')
    );
  } else if (request.tone === 'traditional') {
    // 更傳統的語調
    prayerParts = prayerParts.map(part => 
      part.replace(/您/g, '祢').replace(/神/g, '上帝')
    );
  }
  
  // 組合禱告內容
  return prayerParts.join('。\n\n') + '。';
}

// 獲取每日經文（可以後續擴展為從API獲取）
export function getDailyVerse(): { verse: string; reference: string } {
  const verses = [
    {
      verse: "你們要將一切的憂慮卸給神，因為他顧念你們。",
      reference: "彼得前書 5:7"
    },
    {
      verse: "我靠著那加給我力量的，凡事都能做。",
      reference: "腓立比書 4:13"
    },
    {
      verse: "耶和華是我的牧者，我必不致缺乏。",
      reference: "詩篇 23:1"
    },
    {
      verse: "神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不至滅亡，反得永生。",
      reference: "約翰福音 3:16"
    },
    {
      verse: "應當一無掛慮，只要凡事藉著禱告、祈求，和感謝，將你們所要的告訴神。",
      reference: "腓立比書 4:6"
    }
  ];
  
  const today = new Date().getDate();
  return verses[today % verses.length];
}
