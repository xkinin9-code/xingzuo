import { NextRequest, NextResponse } from "next/server";
import { getZodiacByBirthday } from "@/lib/zodiac";
import { validateBirthday } from "@/lib/birthday";
import { generatePersonalizedContent } from "@/lib/personalization";
import { getTodayFortuneFromCacheOrAI } from "@/lib/deepseek";

interface FortuneTemplate {
  keyword: string;
  overall: string;
  love: string;
  career: string;
  health: string;
  wealth: string;
  meditation: string;
  dailyMessage: string;
}

// 12星座完整运势模板
const zodiacTemplates: Record<string, FortuneTemplate> = {
  白羊座: {
    keyword: "突破",
    overall: "今天整体运势如破晓之光，充满了突破桎梏的能量。你的行动力将达到顶峰，那些搁置已久的计划终于迎来了最佳启动时机。不要被固有的框架限制，敢于挑战边界，你会发现新的天地正在眼前展开。",
    love: "单身者在社交场合中会散发出强烈的吸引力，一次不经意的眼神交汇可能就是缘分的开始。有伴侣者适合与另一半共同尝试新鲜事物，在突破日常的冒险中重新点燃激情。",
    career: "工作上可能会遇到需要快速决策的时刻，你的直觉将成为最好的向导。不要害怕承担风险，今天的每一次主动出击都可能带来意想不到的收获。学习方面，攻克难题的效率极高。",
    health: "体能充沛，适合进行高强度的运动来释放过剩的能量。注意运动前的热身，避免因过于急切而造成肌肉拉伤。保持规律的作息，让你的活力持续燃烧。",
    wealth: "财运呈现上升趋势，可能会有意外的收入来源。投资方面可以考虑一些创新性的项目，但仍需做好风险控制。避免冲动的大额消费。",
    meditation: "用'我是燃烧的火焰，我如破晓的晨光'来引导你的今日。每一次突破都是对自我的超越，在行动中你会找到真正的自由。",
    dailyMessage: "与其在等待中消耗热情，不如在星光的指引下主动出击。今天适合处理积压已久的挑战，晚上会有意想不到的收获。"
  },
  金牛座: {
    keyword: "沉淀",
    overall: "今天整体运势平稳而深邃，就像大地吸收春雨般适合沉淀与积累。不必急于追求外在的喧嚣，静下心来整理思绪和规划，你会发现真正有价值的东西往往需要时间来酝酿。",
    love: "单身者在今天更适合享受独处的时光，在宁静中你会更清楚自己真正需要什么样的伴侣。有伴侣者适合与另一半共度温馨的家庭时光，一顿亲手烹饪的晚餐胜过千言万语。",
    career: "工作上按部就班即可，今天适合处理那些需要耐心和细心的任务。财务整理、文档归档、长期规划的制定都会进展顺利。学习方面，温故知新会有意想不到的领悟。",
    health: "注意脾胃的调养，饮食宜清淡温热。今天适合进行一些舒缓的运动，如瑜伽或散步，帮助身心达到更深层的放松。充足的睡眠是最好的疗愈。",
    wealth: "财务状况稳健，适合进行储蓄和长期理财规划。今天不宜进行高风险投资，稳扎稳打才是上策。可能会收到一笔迟来的款项。",
    meditation: "用'我是大地的根系，我如深埋的种子'来引导你的今日。在沉淀中积蓄力量，当时机成熟时，你的绽放将无可阻挡。",
    dailyMessage: "真正的丰盛不在于拥有多少，而在于能否在当下感受到满足。今天适合整理生活环境，让能量流动更加顺畅。"
  },
  双子座: {
    keyword: "宁静",
    overall: "今天整体运势如静谧的星空，在信息的洪流中为你开辟了一片宁静的港湾。你的思维格外敏锐，但更重要的是学会在喧嚣中保持内心的平和。当你安静下来，那些困扰已久的问题会自行浮现答案。",
    love: "单身者今天可能会在一个安静的场合遇到让你心动的人，或许是一本书店、一家咖啡馆。有伴侣者适合与另一半进行深度的心灵交流，在宁静的氛围中增进彼此的默契。",
    career: "工作上适合独立思考和创作，关闭不必要的通知，给自己一段不被打扰的时间。你会发现专注力比 multitasking 更能带来高质量的产出。学习方面，静心阅读能让你吸收更多知识。",
    health: "神经系统今天需要特别的呵护，避免过度使用电子设备和摄入过多咖啡因。冥想、深呼吸或轻度拉伸都能帮助你恢复内在的宁静。",
    wealth: "财运平稳，今天不宜做重大的财务决策。可以把时间花在整理账单和优化支出结构上。小的节约累积起来也是一笔可观的财富。",
    meditation: "用'我是宇宙恒久，我如星辰涌动'来引导你的今日。在宁静中，你能听见内心最真实的声音，那是比任何外界建议都更准确的导航。",
    dailyMessage: "与其在等待中消耗热情，不如在星光的指引下主动出击。今天适合处理积压已久的文案工作，晚上会有惊喜发生。"
  },
  巨蟹座: {
    keyword: "守护",
    overall: "今天整体运势被温柔的月光笼罩，守护的能量环绕着你。你会格外关注身边人的情绪和需求，这种细腻的体贴将为你赢得更多的信任与好感。同时也别忘了守护好自己的边界，温柔也要有锋芒。",
    love: "单身者今天可能会因为一次体贴的举动而吸引到对方的注意，细节之处最见真心。有伴侣者适合表达你的关怀，为对方准备一份小惊喜，让感情在守护中升温。",
    career: "团队中的和谐氛围将成为你今天最大的助力。你的同理心能化解潜在的矛盾，成为同事间的润滑剂。适合处理需要沟通协调的事务。",
    health: "情绪对健康的影响今天会格外明显，保持心情的平和就是最好的养生。注意胃部的保暖，多喝温热的水。给自己一段独处的时间来恢复能量。",
    wealth: "财运与家庭相关，可能会有家居改善或家人馈赠方面的支出与收入。在消费时多考虑长远价值，为家人投资总是值得的。",
    meditation: "用'我是潮汐的韵律，我如贝壳中的珍珠'来引导你的今日。在守护他人的同时，也记得温柔地守护自己内心的柔软。",
    dailyMessage: "真正的力量不在于征服，而在于能够温柔地包容。今天适合与家人朋友共度时光，在陪伴中收获满满的幸福感。"
  },
  狮子座: {
    keyword: "璀璨",
    overall: "今天整体运势如星辰般璀璨夺目，你的个人魅力将达到巅峰。这是一个适合展现自我、站上舞台的日子。不要隐藏你的光芒，自信地表达想法和创意，周围的人会被你的热情所感染。",
    love: "单身者在人群中自带聚光灯，大胆展示真实的自己会吸引到欣赏你的人。有伴侣者今天适合一起出席社交场合，让另一半见证你的闪耀时刻。",
    career: "工作上你的领导力将得到充分发挥，适合主导项目推进或进行重要的演讲汇报。你的创意方案很容易获得上司和同事的认可。学习方面，表现自己的机会不要错过。",
    health: "心脏和脊椎今天需要关注，避免长时间的伏案工作。适度的有氧运动能帮助你保持旺盛的精力。注意防晒，保护你的肌肤光彩。",
    wealth: "偏财运不错，可能会因为出色的表现而获得奖金或礼物。投资方面可以关注那些有品牌溢价的优质标的。适度奖励自己是必要的。",
    meditation: "用'我是正午的阳光，我如燃烧的恒星'来引导你的今日。你的存在本身就是一种璀璨，无需借谁的光，你自会发光。",
    dailyMessage: "世界是你的舞台，而今天正是你大放异彩的时刻。勇敢地去争取你想要的东西，宇宙正在为你鼓掌。"
  },
  处女座: {
    keyword: "精微",
    overall: "今天整体运势强调对细节的精准把控，在精微之处藏着改变全局的力量。你的分析能力和条理性将达到最佳状态，适合处理复杂的数据和繁琐的流程。追求完美是好事，但也要记得接纳事物的不完美。",
    love: "单身者可能会因为某个细心的举动而打动对方，比如记住对方说过的小事。有伴侣者适合一起规划未来的生活细节，在共同的蓝图中找到安全感。",
    career: "工作上你的专业度将受到高度评价，那些别人忽略的细节恰恰是你脱颖而出的关键。适合进行质量检查、流程优化和深度研究。学习方面， today is perfect for systematic review.",
    health: "消化系统和神经系统今天需要格外关注，规律的饮食和适度的放松同样重要。不要把所有的精力都放在工作上，给自己一些放空的时间。",
    wealth: "财运稳健，适合进行精细的财务分析和预算规划。今天可能会发现一些可以优化的支出项。对待投资要有耐心，细致研究后再行动。",
    meditation: "用'我是磨砺的玉石，我如精密的星图'来引导你的今日。在关注每一处细节的同时，也看见整体的美好，完美是一种过程而非终点。",
    dailyMessage: "伟大的成就往往诞生于对细节的执着。今天适合整理和规划，当你把基础打牢，高楼自会拔地而起。"
  },
  天秤座: {
    keyword: "平衡",
    overall: "今天整体运势呼唤内在的平衡与和谐。你可能会面临一些需要权衡的选择，但你的直觉会帮助你在矛盾中找到最佳的中间点。美与和谐不仅是外在的追求，更是内心的状态。",
    love: "单身者今天魅力值满分，在社交场合中容易成为焦点。有伴侣者适合与另一半共同探讨如何让关系更加平衡，倾听与表达同样重要。",
    career: "工作上需要处理多方利益的协调，你的公正态度将赢得各方的尊重。适合进行合作洽谈和合同签订。遇到分歧时，寻找双赢的解决方案。",
    health: "腰肾区域今天需要关注，保持正确的坐姿和适度的运动。饮食上注意营养均衡，避免偏食。瑜伽和普拉提能帮助你找到身体的平衡感。",
    wealth: "财运与合作关系密切相关，可能会有合作分成或共同投资的收益。消费时多考虑物品的实用性和美感的平衡。",
    meditation: "用'我是天平的指针，我如和弦的共鸣'来引导你的今日。在给予与接受、独处与社交之间找到属于你的平衡点。",
    dailyMessage: "生活的艺术在于平衡。今天适合处理需要协调的事务，你的公正和智慧将为你赢得意想不到的尊重。"
  },
  天蝎座: {
    keyword: "洞察",
    overall: "今天整体运势如深渊中的星光，赋予你穿透表象的洞察力。那些隐藏在水面之下的真相将逐渐浮现，你的直觉几乎不会出错。善用这份洞察力，但也要注意保护他人的隐私和感受。",
    love: "单身者今天可能会对某人产生强烈的吸引力，那种灵魂深处的共鸣让你无法忽视。有伴侣者适合进行深度的情感交流，分享彼此内心最隐秘的想法。",
    career: "工作上你的洞察力能帮助你发现别人忽略的问题或机会。适合进行市场调研、风险评估和策略制定。信任你的直觉，但也要用数据来验证。",
    health: "生殖系统和排泄系统今天需要关注，多喝水，避免憋尿。情绪可能会有些起伏，找到健康的宣泄渠道很重要。深度睡眠能帮助你恢复精力。",
    wealth: "财运与洞察力相关，今天可能会发现一个好的投资机会或省钱的窍门。 but avoid lending money to others. 保持财务的独立性。",
    meditation: "用'我是深夜的凝视，我如蜕变的凤凰'来引导你的今日。在洞察世界的同时，也勇敢地面对自己内心的阴影。",
    dailyMessage: "真相有时残酷，但唯有直面它才能获得真正的自由。今天适合进行深度的自我反思，在独处中你会获得重要的启示。"
  },
  射手座: {
    keyword: "远方",
    overall: "今天整体运势充满了对远方的向往和探索的渴望。你的视野变得格外开阔，那些宏大的计划和遥远的梦想在今天显得格外清晰。即使身体不能远行，心灵也可以飞向更广阔的天地。",
    love: "单身者可能会在一次旅行或学习活动中遇到有趣的人，共同的理想会让你们迅速拉近距离。有伴侣者适合与另一半规划一次未来的旅行，在憧憬中加深感情。",
    career: "工作上适合进行跨领域学习和长远规划。你的宏观思维能为团队带来全新的视角。如果有出差或外派的机会，不妨积极争取。",
    health: "大腿和肝脏今天需要关注，避免久坐，多起来活动。户外运动是最佳的选择，呼吸新鲜空气能让你的身心都得到舒展。",
    wealth: "财运与远方有关，可能会有来自外地或国外的收入机会。投资方面可以关注海外市场或新兴行业。为未来的旅行储蓄一笔资金吧。",
    meditation: "用'我是射出的箭矢，我如自由的飞鸟'来引导你的今日。远方不仅是地理的概念，更是心灵不受束缚的状态。",
    dailyMessage: "世界比你想象的更大，而你的可能性也比你以为的更多。今天适合学习新知识或制定长远计划，让梦想开始启航。"
  },
  摩羯座: {
    keyword: "攀登",
    overall: "今天整体运势如山间的磐石，坚定而有力。你心中那座想要攀登的高峰正在召唤着你，而今天的每一步踏实前行都在缩短你与山顶的距离。成功没有捷径，但你的坚韧就是最好的通行证。",
    love: "单身者今天可能会因为稳重可靠的形象而吸引到认真的对象。有伴侣者适合与另一半讨论未来的共同目标，在携手攀登的过程中感情会更加稳固。",
    career: "工作上你的责任心和专业能力将得到认可，可能会有重要的任务交到你手上。虽然压力不小，但这是你证明自己的绝佳机会。学习方面，自律将带来显著的进步。",
    health: "骨骼和关节今天需要关注，注意运动时的保护和保暖。长时间工作后记得起来活动筋骨。规律的生活作息是你保持精力的基石。",
    wealth: "正财运势强劲，你的努力将直接转化为收入的提升。适合进行长期的理财规划和稳健型投资。避免投机心理，脚踏实地才能积累真正的财富。",
    meditation: "用'我是山巅的岩石，我如攀登的行者'来引导你的今日。每一步都算数，每一次坚持都在塑造一个更强大的你。",
    dailyMessage: "伟大的成就从来不是一蹴而就的。今天适合专注于手头的重要任务，你的耐心和毅力将为你打开通往成功的大门。"
  },
  水瓶座: {
    keyword: "觉醒",
    overall: "今天整体运势如同晨曦中的第一缕光，带来觉醒与新生的能量。你的思维将跳出常规的框架，那些天马行空的想法中可能藏着改变现状的钥匙。不要害怕与众不同，你的独特正是最大的财富。",
    love: "单身者今天可能会因为一个出其不意的举动而吸引到特别的对象。有伴侣者适合与另一半分享你最新的想法和见解，在思想的碰撞中激发新的火花。",
    career: "工作上你的创新思维将为团队带来突破性的解决方案。适合参与头脑风暴、产品设计和科技相关的项目。勇敢提出那些看似疯狂的建议。",
    health: "小腿和血液循环今天需要关注，避免久坐不动。可以尝试一些新奇的运动方式，让锻炼也变得有趣。保持充足的水分摄入。",
    wealth: "财运与创新相关，可能会因为独特的眼光而发现别人忽略的机会。投资方面可以关注科技、环保等前沿领域。但也要注意风险的分散。",
    meditation: "用'我是闪电的启示，我如未来的先知'来引导你的今日。在觉醒中打破旧有的限制，拥抱属于你的独特道路。",
    dailyMessage: "当所有人都朝着一个方向走时，敢于走向相反方向的人可能需要勇气，但也可能发现新大陆。今天相信你的直觉。"
  },
  双鱼座: {
    keyword: "柔韧",
    overall: "今天整体运势如流水般柔韧而有力。生活可能会带来一些意想不到的变数，但你拥有一种神奇的能力——像水一样适应任何容器的形状。在柔软中找到力量，在顺应中把握主动，这是今天最大的智慧。",
    love: "单身者今天桃花运旺盛，你的温柔和善解人意会吸引到不少关注。有伴侣者适合用柔软的态度化解可能的矛盾，以退为进往往能达到更好的效果。",
    career: "工作上可能会遇到一些计划之外的变动，保持灵活的心态是关键。你的创造力和直觉能帮助你在变化中找到新的机会。艺术、设计、公益相关的事务会进展顺利。",
    health: "脚部和免疫系统今天需要关注，避免着凉。游泳或水中运动是极佳的选择，能让你的身体在舒展中恢复活力。注意情绪的调节，不要让负面情绪积压。",
    wealth: "财运波动较大，不适合在今天做重大的财务决策。可能会有一些意外的小支出，但也会有意外的收获。保持收支的弹性很重要。",
    meditation: "用'我是深海的潮汐，我如融化的冰川'来引导你的今日。柔韧不是软弱，而是像水一样，能穿透最坚硬的岩石。",
    dailyMessage: "生活就像海洋，时而平静时而汹涌。今天学会像水一样流动，在适应变化的过程中，你会发现自己比想象中更强大。"
  },
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const birthday = searchParams.get("birthday");

    // 验证参数
    if (!birthday) {
      return NextResponse.json(
        { error: "缺少生日参数", code: "MISSING_BIRTHDAY" },
        { status: 400 }
      );
    }

    // 验证生日格式
    const validation = validateBirthday(birthday);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error, code: "INVALID_BIRTHDAY" },
        { status: 400 }
      );
    }

    // 判断星座
    const zodiac = getZodiacByBirthday(birthday);

    // 获取运势数据：优先 DeepSeek AI 生成，失败则回退硬编码模板
    let template = await getTodayFortuneFromCacheOrAI(zodiac.chineseName);
    let source = "deepseek";

    if (!template) {
      template = zodiacTemplates[zodiac.chineseName];
      source = "template";
    }

    if (!template) {
      return NextResponse.json(
        { error: "未找到该星座的运势模板", code: "TEMPLATE_NOT_FOUND" },
        { status: 500 }
      );
    }

    const fortuneData = {
      overall: template.overall,
      love: template.love,
      career: template.career,
      health: template.health,
      wealth: template.wealth,
    };

    // 生成个性化内容
    const personalized = generatePersonalizedContent(birthday, zodiac);

    // 构建响应数据
    const responseData = {
      success: true,
      data: {
        zodiac: {
          sign: zodiac.sign,
          chineseName: zodiac.chineseName,
          englishName: zodiac.englishName,
          color: zodiac.color,
          element: zodiac.element,
        },
        fortune: fortuneData,
        personalized: {
          dayInCycle: personalized.dayInCycle,
          dayInCycleText: personalized.dayInCycleText,
          birthdayTrait: personalized.birthdayTrait,
          timeGreeting: personalized.timeGreeting,
          randomElements: personalized.randomElements,
          currentZodiacSeason: personalized.currentZodiacSeason,
        },
        // 将模板中的固定字段直接返回
        extra: {
          keyword: template.keyword,
          meditation: template.meditation,
          dailyMessage: template.dailyMessage,
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          source,
          wordCount: Object.values(fortuneData).join(" ").length,
        },
      },
    };

    // 设置缓存头（1小时）
    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("获取运势失败:", error);
    return NextResponse.json(
      {
        error: "服务器内部错误",
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
