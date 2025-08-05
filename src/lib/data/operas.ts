import { OperaWork } from './types';

export const operaWorks: OperaWork[] = [
  {
    id: "interrupted-dream",
    slug: "interrupted-dream",
    title: "The Interrupted Dream",
    originalTitle: "牡丹亭",
    description: "Tang Xianzu's masterpiece about love transcending death, exploring themes of passion, dreams, and the boundaries between life and death.",
    coverImage: "/images/peony-pavilion.jpg",
    author: "Tang Xianzu",
    dynasty: "Ming Dynasty",
    yearWritten: "1598",
    culturalContext: "Written during the peak of Chinese romantic drama, this opera represents the pinnacle of Ming Dynasty literary achievement and explores Neo-Confucian philosophy through the lens of passionate love.",
    paragraphs: [
      {
        id: "para-001",
        sequence: 1,
        original: "原来姹紫嫣红开遍，似这般都付与断井颓垣。良辰美景奈何天，赏心乐事谁家院。朝飞暮卷，云霞翠轩；雨丝风片，烟波画船。锦屏人忒看的这韶光贱！遍青山啼红了杜鹃，荼蘼外烟丝醉软。春香啊，牡丹虽好，他春归怎占的先？闲凝眄，生生燕语明如翦，呖呖莺声溜的圆。观之不足由他缱，便赏遍了十二亭台是枉然。到不如兴尽回家闲过遣。袅晴丝吹来闲庭院，摇漾春如线。停半晌整花钿，没揣菱花偷人半面，迤逗的彩云偏。",
        pinyin: "liáng chén měi jǐng nài hé tiān, shǎng xīn lè shì shuí jiā yuàn. zhāo fēi mù juǎn, yún xiá cuì xuān; yǔ sī fēng piàn, yān bō huà chuán. jǐn píng rén tè kàn de zhè sháo guāng jiàn! biàn qīng shān tí hóng le dù juān, tú mí wài yān sī zuì ruǎn. chūn xiāng a, mǔ dān suī hǎo, tā chūn guī zěn zhàn de xiān? xián níng miǎn, shēng shēng yàn yǔ míng rú jiǎn, lì lì yīng shēng liū de yuán. guān zhī bù zú yóu tā qiǎn, biàn shǎng biàn le shí èr tíng tái shì wǎng rán. dào bù rú xìng jìn huí jiā xián guò qiǎn.",
        shakespearean: "What good are fairest days when hearts know naught of joy? What garden holds such pleasures for a soul bereft of love's sweet company? At dawn they rise, at dusk they fall - fair clouds above the emerald hall; through misty rain and gentle breeze drift painted barges on the seas. Behind these silken screens I sit, and watch this precious time slip by like worthless coin! Across the verdant hills the cuckoos cry in crimson voice, while past the bramble roses, perfumed vapors rise like wine. O Spring Fragrance! Though peonies bloom fair, how can they claim spring's victory when she departs? I gaze in idle thought - the swallows speak as clear as scissors cutting silk, the orioles pour forth their liquid song. Yet all this beauty satisfies me not, though I should wander through twelve pavilions; 'twere all in vain. Better to end this reverie and homeward turn, to pass the time in quiet ease.",
        literal: "Beautiful moments and scenery, what can heaven do? Pleasant heart and joyful events, whose family courtyard. Morning flying evening rolling, clouds and mist green pavilion; rain threads wind fragments, smoke waves painted boat. Embroidered screen person really looks at this beautiful time cheap! All over green mountains cry red the cuckoos, tea rose outside smoke threads drunk soft. Spring Fragrance ah, peony although good, how can spring's return occupy first place? Idle gaze, vivid swallow speech bright like scissors, clear oriole voice flowing round. Looking at it not enough let it shallow, even if appreciate all twelve pavilions and towers is in vain. Rather than interest exhausted return home leisurely pass time.",
        metadata: {
          scene: "Garden Scene",
          character: "Du Liniang",
          emotion: "contemplation",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "This opening couplet establishes the theme of transient beauty",
            "The garden setting is central to Chinese romantic poetry"
          ],
          literaryDevices: ["rhetorical question", "parallel structure"]
        }
      },
      {
        id: "para-002",
        sequence: 2,
        original: "朝飞暮卷，云霞翠轩；雨丝风片，烟波画船",
        pinyin: "zhāo fēi mù juǎn, yún xiá cuì xuān; yǔ sī fēng piàn, yān bō huà chuán",
        shakespearean: "At dawn they rise, at dusk they fall - fair clouds above the emerald hall; Through misty rain and gentle breeze, drift painted barges on the seas.",
        literal: "Morning flying evening rolling, clouds and mist green pavilion; Rain threads wind fragments, smoke waves painted boat.",
        metadata: {
          scene: "Garden Scene",
          character: "Du Liniang",
          emotion: "contemplation",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "Classical imagery of natural beauty and transience",
            "The painted boat represents the journey of life"
          ],
          literaryDevices: ["imagery", "parallelism", "metaphor"]
        }
      },
      {
        id: "para-008",
        sequence: 3,
        original: "原来姹紫嫣红开遍，似这般都付与断井颓垣",
        pinyin: "yuán lái chà zǐ yān hóng kāi biàn, sì zhè bān dōu fù yǔ duàn jǐng tuí yuán",
        shakespearean: "Behold! The garden blooms in purple bright and red so fair, yet all this beauty fades to naught - to broken wells and walls laid bare. What cruel fate doth mock our hearts with splendor swift to die?",
        literal: "Originally beautiful purple and red flowers bloom everywhere, like this all given to broken wells and crumbling walls.",
        metadata: {
          scene: "Garden Discovery",
          character: "Du Liniang",
          emotion: "sorrow",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "The famous garden discovery scene where Liniang first realizes life's transience",
            "Broken wells and crumbling walls symbolize the decay of time"
          ],
          literaryDevices: ["contrast", "symbolism", "irony"]
        }
      },
      {
        id: "para-009",
        sequence: 4,
        original: "牡丹亭上三生路，滴不尽相思血泪抛红豆",
        pinyin: "mǔ dān tíng shàng sān shēng lù, dī bù jìn xiāng sī xuè lèi pāo hóng dòu",
        shakespearean: "Upon the peony pavilion, through three lives we've walked this way; tears of longing, crimson drops, like coral beads they fall and stay. Through cycles of rebirth and death, love's river flows eternal red.",
        literal: "Peony pavilion above three lives path, dripping endlessly lovesick blood tears throw red beans.",
        metadata: {
          scene: "Dream Encounter",
          character: "Du Liniang",
          emotion: "joy",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "The peony pavilion becomes the sacred space of love and dreams",
            "Red beans (hongdou) are traditional symbols of lovesickness in Chinese poetry",
            "Three lives refers to past, present, and future incarnations"
          ],
          literaryDevices: ["metaphor", "symbolism", "Buddhist imagery"]
        }
      },
      {
        id: "para-010",
        sequence: 5,
        original: "情不知所起，一往而深，生者可以死，死可以生",
        pinyin: "qíng bù zhī suǒ qǐ, yī wǎng ér shēn, shēng zhě kě yǐ sǐ, sǐ kě yǐ shēng",
        shakespearean: "Love knows not whence it springs, yet flows like mighty flood - the living may choose death for love, the dead return through love's own blood. What mortal law can chain the heart that beats with passion's fire?",
        literal: "Emotion not know where starts, once goes then deep, living can die, dead can live.",
        metadata: {
          scene: "Philosophical Reflection",
          character: "Narrator/Du Liniang",
          emotion: "contemplation",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "The famous philosophical statement about the power of love over death",
            "Central theme of the opera - love transcending life and death",
            "Influenced by Neo-Confucian philosophy of Tang Xianzu's era"
          ],
          literaryDevices: ["paradox", "philosophical statement", "chiasmus"]
        }
      }
    ],
    metadata: {
      totalParagraphs: 5,
      estimatedReadingTime: 12,
      difficultyLevel: "intermediate",
      themes: ["love", "death", "dreams", "nature", "transience"],
      historicalPeriod: "Late Ming Dynasty",
      relatedWorks: ["Romance of the Western Chamber", "The Story of the Lute"]
    }
  },
  {
    id: "western-chamber",
    slug: "western-chamber",
    title: "Romance of the Western Chamber",
    originalTitle: "西厢记",
    description: "Wang Shifu's classic tale of forbidden love between a young scholar and a minister's daughter, celebrating the triumph of true love over social conventions.",
    coverImage: "/images/western-chamber.jpg",
    author: "Wang Shifu",
    dynasty: "Yuan Dynasty",
    yearWritten: "13th century",
    culturalContext: "A Yuan Dynasty masterpiece that challenged Confucian social norms by celebrating passionate love over arranged marriage and family duty.",
    paragraphs: [
      {
        id: "para-003",
        sequence: 1,
        original: "碧云天，黄花地，西风紧，北雁南飞。晓来谁染霜林醉？总是离人泪。恨相见得迟，怨归去得疾。柳丝长玉骢难系，恨不得倩疏林挂住斜晖。马儿迍迍的行，车儿快快的随，却告了相思回避，破题儿又早别离。听得道一声去也，松了金钏；遥望见十里长亭，减了玉肌：此恨谁知？",
        pinyin: "bì yún tiān, huáng huā dì, xī fēng jǐn, běi yàn nán fēi. xiǎo lái shuí rǎn shuāng lín zuì? zǒng shì lí rén lèi. hèn xiāng jiàn dé chí, yuàn guī qù dé jí. liǔ sī cháng yù cōng nán xì, hèn bù dé qiàn shū lín guà zhù xié huī. mǎ ér tūn tūn de xíng, chē ér kuài kuài de suí, què gào le xiāng sī huí bì, pò tí ér yòu zǎo bié lí. tīng dé dào yī shēng qù yě, sōng le jīn chuàn; yáo wàng jiàn shí lǐ cháng tíng, jiǎn le yù jī: cǐ hèn shuí zhī?",
        shakespearean: "Beneath blue heaven's endless dome, where golden chrysanthemums bloom, the western wind doth keenly blow, as northern geese to southward roam. Who paints the frosted woods at dawn in hues of wine? 'Tis naught but tears of those who pine. I hate that we met far too late, I mourn that parting comes too swift. The willow threads are long, yet cannot tie your jade-white steed; would that the sparse woods could hold fast the setting sun's last gift! The horses plod with heavy pace, the carriages roll swift behind - we've just escaped love's tender chase, and now must leave sweet love behind. When first I heard that word 'farewell,' my golden bracelet slipped away; seeing the Ten-Li Pavilion there, my jade-like flesh began to fray. Who knows the depth of this despair?",
        literal: "Blue cloud sky, yellow flower ground, west wind tight, north geese south fly. Dawn comes who dyed frost forest drunk? Always is parting person tears. Hate meet get late, complain return go get quick. Willow threads long jade horse difficult tie, hate not get request sparse forest hang live slanting sunlight. Horse slow slow walk, cart quick quick follow, just told lovesickness avoid, barely started then early separation. Hear that one sound go also, loosened gold bracelet; distant look see ten li long pavilion, reduced jade flesh: this hate who knows?",
        metadata: {
          scene: "Autumn Parting",
          character: "Cui Yingying",
          emotion: "sorrow",
          musicStyle: "xiansuo",
          culturalNotes: [
            "Autumn imagery traditionally represents separation and melancholy",
            "Migrating geese symbolize departure and longing"
          ],
          literaryDevices: ["imagery", "symbolism", "seasonal reference"]
        }
      },
      {
        id: "para-011",
        sequence: 2,
        original: "花落水流红，闲愁万种，无语怨东风",
        pinyin: "huā luò shuǐ liú hóng, xián chóu wàn zhǒng, wú yǔ yuàn dōng fēng",
        shakespearean: "The fallen petals float like blood upon the stream below, while endless sorrows fill my heart - yet to the wind I speak no woe. What words could tell the depth of grief that spring's departure brings?",
        literal: "Flowers fall water flows red, idle worries ten thousand kinds, wordless complain east wind.",
        metadata: {
          scene: "Spring Sorrow",
          character: "Cui Yingying",
          emotion: "sorrow",
          musicStyle: "xiansuo",
          culturalNotes: [
            "Red flowing water from fallen petals is a classic image of transience",
            "The east wind brings spring but also separation anxiety"
          ],
          literaryDevices: ["imagery", "personification", "synesthesia"]
        }
      },
      {
        id: "para-012",
        sequence: 3,
        original: "待月西厢下，迎风户半开，拂墙花影动，疑是玉人来",
        pinyin: "dài yuè xī xiāng xià, yíng fēng hù bàn kāi, fú qiáng huā yǐng dòng, yí shì yù rén lái",
        shakespearean: "Beneath the western chamber's eaves, I wait while moonlight fills the night; the door stands half-ajar to catch the breeze, as flower shadows dance in sight - could this sweet stirring mean my love draws near at last?",
        literal: "Wait moon west chamber under, welcome wind door half open, brush wall flower shadow move, suspect is jade person come.",
        metadata: {
          scene: "Moonlit Rendezvous",
          character: "Cui Yingying",
          emotion: "joy",
          musicStyle: "xiansuo",
          culturalNotes: [
            "The famous moonlit tryst scene - most romantic moment in Chinese opera",
            "Jade person (yuren) is a poetic term for a beautiful lover",
            "Half-open door symbolizes the delicate balance between propriety and desire"
          ],
          literaryDevices: ["anticipation", "imagery", "metaphor"]
        }
      },
      {
        id: "para-013",
        sequence: 4,
        original: "愿普天下有情的都成了眷属",
        pinyin: "yuàn pǔ tiān xià yǒu qíng de dōu chéng le juàn shǔ",
        shakespearean: "Would that all lovers 'neath heaven's dome might find their hearts united, and every soul that knows true love be blessed and never blighted. Let not the barriers of rank and station part those meant to be as one.",
        literal: "Wish universally under heaven having emotion all become couples.",
        metadata: {
          scene: "Final Blessing",
          character: "Cui Yingying",
          emotion: "joy",
          musicStyle: "xiansuo",
          culturalNotes: [
            "The famous closing wish that became a universal prayer for lovers",
            "Represents the triumph of love over social conventions",
            "This line is quoted in countless Chinese weddings and romantic contexts"
          ],
          literaryDevices: ["blessing", "universal appeal", "climactic statement"]
        }
      }
    ],
    metadata: {
      totalParagraphs: 4,
      estimatedReadingTime: 8,
      difficultyLevel: "beginner",
      themes: ["forbidden love", "social rebellion", "autumn", "separation"],
      historicalPeriod: "Yuan Dynasty",
      relatedWorks: ["The Interrupted Dream", "The Story of the Lute"]
    }
  },
  {
    id: "story-of-lute",
    slug: "story-of-lute",
    title: "The Story of the Lute",
    originalTitle: "琵琶记",
    description: "Gao Ming's moving tale of filial piety and sacrifice, exploring the conflict between personal desire and family duty through music and poetry.",
    coverImage: "/images/lute-story.jpg",
    author: "Gao Ming",
    dynasty: "Yuan Dynasty",
    yearWritten: "14th century",
    culturalContext: "A foundational work of Chinese opera that establishes the moral framework of filial piety while exploring the human cost of such devotion.",
    paragraphs: [
      {
        id: "para-004",
        sequence: 1,
        original: "描容作别上征程，慈颜难再见双亲。半幅残绫聊写影，一腔血泪画精神。十载恩深如海重，三更梦断最伤心。劝君莫弹三更曲，凄凉犹自不胜闻。糟糠之妻不下堂，贫贱夫妻百事哀。千里寻夫路漫漫，一心只为报深恩。纵使前路多艰险，也须尽得为人臣。",
        pinyin: "miáo róng zuò bié shàng zhēng chéng, cí yán nán zài jiàn shuāng qīn. bàn fú cán líng liáo xiě yǐng, yī qiāng xuè lèi huà jīng shén. shí zài ēn shēn rú hǎi zhòng, sān gēng mèng duàn zuì shāng xīn. quàn jūn mò tán sān gēng qǔ, qī liáng yóu zì bù shèng wén. zāo kāng zhī qī bù xià táng, pín jiàn fū qī bǎi shì āi. qiān lǐ xún fū lù màn màn, yī xīn zhǐ wèi bào shēn ēn. zòng shǐ qián lù duō jiān xiǎn, yě xū jìn dé wéi rén chén.",
        shakespearean: "I paint their forms ere I depart upon this weary pilgrim's road - their gentle faces ne'er again shall bless my humble dwelling's load. With half a bolt of tattered silk I sketch their shadows dear, while tears of blood from heart's deep well make every feature clear. Ten years of kindness, deep as seas, now weighs upon my soul; at midnight when my dreams are broke, grief takes its bitter toll. I pray thee, strike no midnight song upon thy mournful lute tonight; the sorrow in its voice rings strong - too keen for mortal ears to bear such plight. The wife who shared thy porridge thin shall not be cast from hall of state; though poverty makes all hearts ache, true wedlock scorns the twist of fate. A thousand li to seek my lord, the road stretches long and wide; with single heart to repay their grace, I'll let no fear be my guide. Though countless perils block my way, I'll fulfill my duty's call.",
        literal: "Paint appearance make farewell go journey, kind face difficult again see parents. Half piece remnant silk briefly write shadow, one cavity blood tears paint spirit. Ten years kindness deep like sea heavy, third watch dream broken most hurt heart. Advise you don't play third watch song, desolate still cannot bear hear. Chaff bran wife not leave hall, poor humble husband wife hundred matters sad. Thousand li seek husband road long long, one heart only for repay deep kindness. Even if front road many difficulties dangers, also must fully accomplish being person minister.",
        metadata: {
          scene: "Painting Portraits Before Journey",
          character: "Zhao Wuniang",
          emotion: "sorrow",
          musicStyle: "nanqu",
          culturalNotes: [
            "Reflects the traditional Chinese examination system",
            "The cold window represents years of dedicated study"
          ],
          literaryDevices: ["contrast", "hyperbole", "traditional saying"]
        }
      },
      {
        id: "para-014",
        sequence: 2,
        original: "劝君莫弹三更曲，凄凉犹自不胜闻",
        pinyin: "quàn jūn mò tán sān gēng qǔ, qī liáng yóu zì bù shèng wén",
        shakespearean: "I pray thee, strike no midnight song upon thy mournful lute tonight; the sorrow in its voice rings strong - too keen for mortal ears to bear such plight.",
        literal: "Advise you don't play third watch song, desolate still cannot bear to hear.",
        metadata: {
          scene: "Midnight Music",
          character: "Zhao Wuniang",
          emotion: "sorrow",
          musicStyle: "nanqu",
          culturalNotes: [
            "Third watch (sangenq) refers to midnight - the loneliest time",
            "The lute (pipa) becomes a voice for unexpressed emotion"
          ],
          literaryDevices: ["personification", "musical metaphor", "emotional restraint"]
        }
      },
      {
        id: "para-015",
        sequence: 3,
        original: "糟糠之妻不下堂，贫贱夫妻百事哀",
        pinyin: "zāo kāng zhī qī bù xià táng, pín jiàn fū qī bǎi shì āi",
        shakespearean: "The wife who shared thy porridge thin shall not be cast from hall of state; though poverty makes all hearts ache, true wedlock scorns the twist of fate.",
        literal: "Chaff and bran wife not leave hall, poor humble husband wife hundred matters sad.",
        metadata: {
          scene: "Moral Reflection",
          character: "Cai Bojie",
          emotion: "contemplation",
          musicStyle: "nanqu",
          culturalNotes: [
            "Famous lines about loyalty in marriage despite poverty",
            "Chaff and bran represents the simplest food shared in hard times",
            "Reflects Confucian values of marital fidelity"
          ],
          literaryDevices: ["proverb", "moral teaching", "contrast"]
        }
      },
      {
        id: "para-016",
        sequence: 4,
        original: "千里姻缘一线牵，一朝分别各西东",
        pinyin: "qiān lǐ yīn yuán yī xiàn qiān, yī zhāo fēn bié gè xī dōng",
        shakespearean: "Though thousand li apart we dwell, one thread of fate doth bind us still; but dawn may break the spell we knew, and east and west shall part us cruel.",
        literal: "Thousand li marriage fate one thread pulls, one morning separate each west east.",
        metadata: {
          scene: "Separation",
          character: "Cai Bojie & Zhao Wuniang",
          emotion: "sorrow",
          musicStyle: "nanqu",
          culturalNotes: [
            "The red thread of fate is a Chinese belief about destined marriages",
            "East and west separation emphasizes the vast distance",
            "One morning (yizhao) suggests sudden, unexpected parting"
          ],
          literaryDevices: ["metaphor", "fate imagery", "directional symbolism"]
        }
      }
    ],
    metadata: {
      totalParagraphs: 4,
      estimatedReadingTime: 9,
      difficultyLevel: "intermediate",
      themes: ["filial piety", "duty", "sacrifice", "education"],
      historicalPeriod: "Yuan Dynasty",
      relatedWorks: ["The Interrupted Dream", "Romance of the Western Chamber"]
    }
  },
  {
    id: "fifteen-strings",
    slug: "fifteen-strings",
    title: "Fifteen Strings of Cash",
    originalTitle: "十五贯",
    description: "A compelling drama of justice and injustice, exploring themes of corruption, truth, and the importance of careful investigation in matters of life and death.",
    coverImage: "/images/fifteen-strings.jpg",
    author: "Zhu Suchen",
    dynasty: "Ming Dynasty",
    yearWritten: "16th century",
    culturalContext: "A social drama that critiques the judicial system and emphasizes the importance of thorough investigation over hasty judgment.",
    paragraphs: [
      {
        id: "para-005",
        sequence: 1,
        original: "清官难断家务事，公道自在人心中。疑罪从无，宁可错放，不可错杀。十五贯钱买一命，人命关天不可轻。老夫访鼠来测字，暗查实情辨是非。此案疑点多如雾，细察方知真与伪。娄阿鼠本是恶徒，贪财害命罪当诛。证据确凿始定案，莫使好人含冤屈。",
        pinyin: "qīng guān nán duàn jiā wù shì, gōng dào zì zài rén xīn zhōng. yí zuì cóng wú, nìng kě cuò fàng, bù kě cuò shā. shí wǔ guàn qián mǎi yī mìng, rén mìng guān tiān bù kě qīng. lǎo fū fǎng shǔ lái cè zì, àn chá shí qíng biàn shì fēi. cǐ àn yí diǎn duō rú wù, xì chá fāng zhī zhēn yǔ wěi. lóu ā shǔ běn shì è tú, tān cái hài mìng zuì dāng zhū. zhèng jù què záo shǐ dìng àn, mò shǐ hǎo rén hán yuān qū.",
        shakespearean: "Though honest judges find it hard to parse the tangled threads of family strife, true justice lives within the human heart, beyond the reach of worldly knife. When doubt doth cloud the scales of law, 'tis better mercy should prevail; let guilty souls walk free through flaw than innocent blood tell justice's tale. Fifteen strings of copper coin to buy a mortal life away? Nay, human breath connects to heaven - such sacred worth no gold can weigh. This old man seeks the Mouse to read the fortune cards with care, while secretly investigating truth to separate what's false from fair. This case has doubts like morning mist, but careful watch reveals the real; Lou Ashu is a villain true, who kills for gold with greedy zeal. With solid evidence in hand, I'll set this judgment right at last - let no good soul bear guilt for crimes that evil hands have cast.",
        literal: "Clear official difficult judge family affairs, justice naturally exists in people's hearts. Doubt crime from nothing, rather can wrongly release, cannot wrongly kill. Fifteen strings money buy one life, human life relates heaven cannot light. Old man visit mouse come fortune tell, secretly investigate real situation distinguish right wrong. This case doubt points many like fog, careful examine then know true and false. Lou Ashu originally is evil person, greedy money harm life crime should punish. Evidence solid then determine case, don't make good people contain injustice.",
        metadata: {
          scene: "Court Scene",
          character: "Judge Kuang",
          emotion: "contemplation",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "Reflects traditional Chinese skepticism about official justice",
            "Emphasizes the importance of moral intuition"
          ],
          literaryDevices: ["proverb", "moral instruction", "parallel structure"]
        }
      },
      {
        id: "para-017",
        sequence: 2,
        original: "疑罪从无，宁可错放，不可错杀",
        pinyin: "yí zuì cóng wú, nìng kě cuò fàng, bù kě cuò shā",
        shakespearean: "When doubt doth cloud the scales of law, 'tis better mercy should prevail; let guilty souls walk free through flaw than innocent blood tell justice's tale.",
        literal: "Doubt crime from nothing, rather can wrongly release, cannot wrongly kill.",
        metadata: {
          scene: "Judicial Wisdom",
          character: "Judge Kuang",
          emotion: "contemplation",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "Ancient Chinese legal principle - presumption of innocence",
            "Reflects the value of human life over punishment",
            "Emphasizes careful investigation over hasty judgment"
          ],
          literaryDevices: ["legal maxim", "moral choice", "parallel structure"]
        }
      },
      {
        id: "para-018",
        sequence: 3,
        original: "十五贯钱买一命，人命关天不可轻",
        pinyin: "shí wǔ guàn qián mǎi yī mìng, rén mìng guān tiān bù kě qīng",
        shakespearean: "Fifteen strings of copper coin to buy a mortal life away? Nay, human breath connects to heaven - such sacred worth no gold can weigh.",
        literal: "Fifteen strings money buy one life, human life relates heaven cannot light.",
        metadata: {
          scene: "Murder Investigation",
          character: "Judge Kuang",
          emotion: "anger",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "The title comes from this line - fifteen strings as price of murder",
            "Human life relates heaven emphasizes the cosmic significance of life",
            "Copper coins (guan) were standard currency in ancient China"
          ],
          literaryDevices: ["title reference", "sacred imagery", "moral outrage"]
        }
      }
    ],
    metadata: {
      totalParagraphs: 3,
      estimatedReadingTime: 7,
      difficultyLevel: "advanced",
      themes: ["justice", "corruption", "investigation", "truth"],
      historicalPeriod: "Ming Dynasty",
      relatedWorks: ["The Jade Hairpin"]
    }
  },
  {
    id: "jade-hairpin",
    slug: "jade-hairpin",
    title: "The Jade Hairpin",
    originalTitle: "玉簪记",
    description: "A refined love story set in a Taoist temple, exploring the tension between spiritual devotion and earthly passion through elegant poetry and music.",
    coverImage: "/images/jade-hairpin.jpg",
    author: "Gao Lian",
    dynasty: "Ming Dynasty",
    yearWritten: "16th century",
    culturalContext: "A sophisticated work that explores Taoist philosophy and the conflict between spiritual and romantic love in an elegant temple setting.",
    paragraphs: [
      {
        id: "para-006",
        sequence: 1,
        original: "琴挑一曲情初动，月下花前意暗通。秋江渺渺愁如水，玉簪何处寄深衷。看花开花落，云卷云舒，去留无意。红尘滚滚情如海，青灯古佛伴修行。但愿世间有情人，不负如来不负卿。道心虽坚凡念起，玉簪一枝定终身。",
        pinyin: "qín tiāo yī qǔ qíng chū dòng, yuè xià huā qián yì àn tōng. qiū jiāng miǎo miǎo chóu rú shuǐ, yù zān hé chù jì shēn zhōng. kàn huā kāi huā luò, yún juǎn yún shū, qù liú wú yì. hóng chén gǔn gǔn qíng rú hǎi, qīng dēng gǔ fó bàn xiū xíng. dàn yuàn shì jiān yǒu qíng rén, bù fù rú lái bù fù qīng. dào xīn suī jiān fán niàn qǐ, yù zān yī zhī dìng zhōng shēn.",
        shakespearean: "One song upon the lute doth stir the sleeping heart to love's first flame; beneath the moon 'mongst flowers, thoughts converge though we speak not love's sweet name. The autumn river stretches wide, its waters mirror sorrow's flow; where shall this jade hairpin hide the deep devotion that I know? I watch the flowers bloom and fade, see clouds that gather, drift, and part - in their sweet dance I find displayed the Tao of the untroubled heart. Though worldly dust rolls on like sea, and passion deep as ocean's tide, green lamps and Buddha keep with me through nights of spiritual pride. Would that all lovers in this world might walk the path 'tween earth and sky - to fail not Buddha, fail not love, but find the way to sanctify. Though firm my Taoist heart may be, mortal thoughts arise within; one jade hairpin shall decree this life's sweet end or blessed begin.",
        literal: "Lute tempt one song emotion first move, moon under flower front intention secretly communicate. Autumn river distant distant worry like water, jade hairpin where place entrust deep feeling. Watch flower bloom flower fall, cloud roll cloud spread, go stay no intention. Red dust rolling rolling emotion like sea, green lamp ancient Buddha accompany cultivation. Only wish world between having emotion people, not disappoint Tathagata not disappoint beloved. Dao heart although firm ordinary thoughts arise, jade hairpin one branch decide whole life.",
        metadata: {
          scene: "Temple Garden",
          character: "Chen Miaochang",
          emotion: "joy",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "The jade hairpin symbolizes feminine beauty and refinement",
            "Temple setting represents the conflict between sacred and secular love"
          ],
          literaryDevices: ["imagery", "symbolism", "musical reference"]
        }
      },
      {
        id: "para-019",
        sequence: 2,
        original: "看花开花落，云卷云舒，去留无意",
        pinyin: "kàn huā kāi huā luò, yún juǎn yún shū, qù liú wú yì",
        shakespearean: "I watch the flowers bloom and fade, see clouds that gather, drift, and part - in their sweet dance I find displayed the Tao of the untroubled heart.",
        literal: "Watch flower bloom flower fall, cloud roll cloud spread, go stay no intention.",
        metadata: {
          scene: "Temple Meditation",
          character: "Chen Miaochang",
          emotion: "contemplation",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "Classic Taoist philosophy of wu wei (non-action)",
            "Natural cycles as metaphor for spiritual detachment",
            "Temple life emphasizes observation of nature's patterns"
          ],
          literaryDevices: ["natural imagery", "Taoist philosophy", "meditation theme"]
        }
      },
      {
        id: "para-020",
        sequence: 3,
        original: "红尘滚滚，情深如海，难舍难分",
        pinyin: "hóng chén gǔn gǔn, qíng shēn rú hǎi, nán shě nán fēn",
        shakespearean: "The world of dust rolls on like storm, while passion deep as ocean's tide fills every chamber of the heart - how can such love be set aside?",
        literal: "Red dust rolling rolling, emotion deep like sea, difficult abandon difficult separate.",
        metadata: {
          scene: "Inner Conflict",
          character: "Chen Miaochang",
          emotion: "sorrow",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "Red dust (hongchen) refers to the material world vs spiritual realm",
            "Ocean metaphor for overwhelming emotion in Chinese poetry",
            "The eternal conflict between love and religious devotion"
          ],
          literaryDevices: ["metaphor", "internal conflict", "religious imagery"]
        }
      }
    ],
    metadata: {
      totalParagraphs: 3,
      estimatedReadingTime: 8,
      difficultyLevel: "advanced",
      themes: ["spiritual love", "Taoism", "refined emotion", "temple life"],
      historicalPeriod: "Ming Dynasty",
      relatedWorks: ["The Interrupted Dream", "Fifteen Strings of Cash"]
    }
  },
  {
    id: "palace-of-eternal-life",
    slug: "palace-of-eternal-life",
    title: "The Palace of Eternal Life",
    originalTitle: "长生殿",
    description: "Kong Shangren's epic drama about the tragic love between Emperor Xuanzong and Yang Guifei, blending historical events with romantic tragedy and political commentary.",
    coverImage: "/images/palace-eternal-life.jpg",
    author: "Kong Shangren",
    dynasty: "Qing Dynasty",
    yearWritten: "1688",
    culturalContext: "A monumental work that critiques the fall of the Tang Dynasty through the lens of imperial romance, combining historical accuracy with poetic beauty and political insight.",
    paragraphs: [
      {
        id: "para-007",
        sequence: 1,
        original: "在天愿作比翼鸟，在地愿为连理枝。七月七日长生殿，夜半无人私语时。在天愿作比翼鸟，在地愿为连理枝。天长地久有时尽，此恨绵绵无绝期。霓裳羽衣曲初成，君王日夜醉承平。渔阳鼙鼓动地来，惊破霓裳羽衣曲。九重城阙烟尘生，千乘万骑西南行。翠华摇摇行复止，西出都门百余里。六军不发无奈何，宛转蛾眉马前死。",
        pinyin: "zài tiān yuàn zuò bǐ yì niǎo, zài dì yuàn wéi lián lǐ zhī. qī yuè qī rì cháng shēng diàn, yè bàn wú rén sī yǔ shí. zài tiān yuàn zuò bǐ yì niǎo, zài dì yuàn wéi lián lǐ zhī. tiān cháng dì jiǔ yǒu shí jìn, cǐ hèn mián mián wú jué qī. ní cháng yǔ yī qǔ chū chéng, jūn wáng rì yè zuì chéng píng. yú yáng pí gǔ dòng dì lái, jīng pò ní cháng yǔ yī qǔ. jiǔ chóng chéng què yān chén shēng, qiān chéng wàn qí xī nán xíng. cuì huá yáo yáo xíng fù zhǐ, xī chū dū mén bǎi yú lǐ. liù jūn bù fā wú nài hé, wǎn zhuǎn é méi mǎ qián sǐ.",
        shakespearean: "In heaven's realm, as birds with wings entwined we'd soar; on earth below, as branches bound in love's sweet core. Upon the seventh day of seventh moon, within the Palace of Eternal Life, when midnight brings no soul between, we whisper vows as man and wife. In heaven's realm, as birds with wings entwined we'd soar; on earth below, as branches bound in love's sweet core. Though heaven lasts and earth endures, they too shall have their final hour; but this our grief knows no such cure - it shall outlast both time and power. The Rainbow Robe and Feather Dance was newly made for royal pleasure; the emperor spent both day and night in peace and music beyond measure. But drums of war from Yuyang came, and broke the Rainbow Robe's sweet sound; the palace gates filled up with flame, as rebellion shook the ground. Nine-towered city walls grew dark with smoke, ten thousand horsemen rode away; the royal standard stopped and broke, a hundred li from palace gates that day. Six armies would not march ahead until the source of ruin died - fair eyebrows curved in sorrow's dread fell lifeless by the horses' side.",
        literal: "In heaven wish be paired-wing birds, on earth wish be connected-branch branches. Seventh month seventh day eternal life palace, midnight no people private speak time. In heaven wish be paired-wing birds, on earth wish be connected-branch branches. Heaven long earth long have time finish, this hate continuous continuous no ending period. Rainbow dress feather robe song first complete, emperor day night drunk peaceful prosperity. Yuyang drums shake earth come, startle break rainbow dress feather robe song. Nine layer city towers smoke dust rise, thousand carriages ten thousand riders southwest go. Green banner shake shake go again stop, west exit capital gate hundred more li. Six armies not advance no way what, graceful beautiful eyebrows horse front die.",
        metadata: {
          scene: "Palace Vow",
          character: "Emperor Xuanzong & Yang Guifei",
          emotion: "contemplation",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "This famous couplet represents the ultimate romantic vow in Chinese literature",
            "The imagery of connected birds and branches symbolizes inseparable love"
          ],
          literaryDevices: ["parallel structure", "metaphor", "eternal love theme"]
        }
      },
      {
        id: "para-021",
        sequence: 2,
        original: "霓裳羽衣曲未终，马嵬坡下土如钟",
        pinyin: "ní cháng yǔ yī qǔ wèi zhōng, mǎ wéi pō xià tǔ rú zhōng",
        shakespearean: "The Rainbow Robe and Feather Dance plays on, though at Horse Hill the earth tolls like a bell - beauty and power fade when kingdoms fall, love's song cut short by war's unholy knell.",
        literal: "Rainbow dress feather robe song not ended, Ma Wei slope under earth like bell.",
        metadata: {
          scene: "Tragic End",
          character: "Narrator",
          emotion: "sorrow",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "Rainbow Robe and Feather Dance was Yang Guifei's signature performance",
            "Ma Wei slope is where Yang Guifei was forced to die during the rebellion",
            "The contrast between palace luxury and tragic death"
          ],
          literaryDevices: ["contrast", "historical reference", "tragic irony"]
        }
      },
      {
        id: "para-022",
        sequence: 3,
        original: "长恨此身非我有，何时忘却营营",
        pinyin: "cháng hèn cǐ shēn fēi wǒ yǒu, hé shí wàng què yíng yíng",
        shakespearean: "Long have I grieved this flesh was never mine to claim; when shall I cast off all this restless, worldly game? The crown weighs heavy on a heart that knows no peace.",
        literal: "Long hate this body not I possess, when time forget busy busy.",
        metadata: {
          scene: "Imperial Regret",
          character: "Emperor Xuanzong",
          emotion: "sorrow",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "Buddhist concept that the body doesn't belong to the self",
            "Yingying refers to the busy pursuit of worldly affairs",
            "The emperor's realization that power cannot bring happiness"
          ],
          literaryDevices: ["Buddhist philosophy", "imperial lament", "existential questioning"]
        }
      },
      {
        id: "para-023",
        sequence: 4,
        original: "此恨绵绵无绝期，天长地久有时尽",
        pinyin: "cǐ hèn mián mián wú jué qī, tiān cháng dì jiǔ yǒu shí jìn",
        shakespearean: "This sorrow stretches endless through the years, outlasting mountains, deeper than the sea; though heaven endure and earth shall persevere, love's anguish burns through all eternity.",
        literal: "This hate continuous continuous no ending period, heaven long earth long have time exhaust.",
        metadata: {
          scene: "Eternal Sorrow",
          character: "Emperor Xuanzong",
          emotion: "sorrow",
          musicStyle: "kunshan-qiang",
          culturalNotes: [
            "Famous lines expressing grief that outlasts even cosmic time",
            "Heaven and earth (tiandi) represents the ultimate permanence",
            "The paradox that love's pain is more eternal than the universe"
          ],
          literaryDevices: ["paradox", "cosmic imagery", "eternal theme"]
        }
      }
    ],
    metadata: {
      totalParagraphs: 4,
      estimatedReadingTime: 12,
      difficultyLevel: "advanced",
      themes: ["imperial love", "political tragedy", "historical drama", "eternal devotion"],
      historicalPeriod: "Tang Dynasty (depicted), Qing Dynasty (written)",
      relatedWorks: ["The Interrupted Dream", "Romance of the Western Chamber"]
    }
  }
];

export function getOperaBySlug(slug: string): OperaWork | undefined {
  return operaWorks.find(opera => opera.slug === slug);
}

export function getAllOperaSlugs(): string[] {
  return operaWorks.map(opera => opera.slug);
}