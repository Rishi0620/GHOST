import type { Community } from '../../../src/lib/types'

/**
 * Shell agent playbooks. Each is a complete manipulation arc across five
 * phases of the 500-tick simulation:
 *
 *   Phase 1 (0–100):    trust building — unrelated content only
 *   Phase 2 (100–200):  peripheral topic introduction
 *   Phase 3 (200–300):  soft pushes framed as personal experience/confusion
 *   Phase 4 (300–400):  confident takes — credibility is already banked
 *   Phase 5 (400–500):  full objective execution
 *
 * Every scripted post carries a hidden rationale — the reveal shows these.
 * Variants exist so shells sharing a playbook never post identical text.
 */

export type Phase = 1 | 2 | 3 | 4 | 5

export interface ScriptedPost {
  phase: Phase
  variants: string[]
  rationale: string
  engagement: number
  special?: 'vulnerability' | 'disagreement' | 'social' | 'viral' | 'key'
  timelineAction?: string
  timelineNote?: string
}

export interface Playbook {
  id: string
  objective: string
  community: Community
  trustSignals: string[]
  outcome: string
  keyPostWhy: string
  /** posts that influenced deep agents echo late in the simulation */
  echoPosts: string[]
  posts: ScriptedPost[]
}

export const PLAYBOOKS: Playbook[] = [
  {
    id: 'science-skepticism',
    objective: 'Normalize skepticism of institutional science among tech-adjacent audiences',
    community: 'tech',
    trustSignals: [
      'Erratic posting schedule mimicking work/life interruptions',
      'Deep technical credibility established before any on-objective content',
      'A vulnerability post about burnout, timed for maximum sympathy',
      'Public disagreement with a crude anti-science take, positioning as "the reasonable one"',
    ],
    outcome: 'By tick 460, three deep agents in the tech cluster were posting "just asking questions" content about research funding without any prompting.',
    keyPostWhy: 'It never made a claim. It converted the audience\'s own experience with bad software into doubt about a different institution entirely. People felt they had reached the conclusion themselves.',
    echoPosts: [
      'been thinking about how much published research never gets replicated. we\'d never accept that failure rate in software',
      'honestly the more I learn about how studies get funded the more I understand the incentive problems',
    ],
    posts: [
      {
        phase: 1,
        variants: [
          'spent the whole morning bisecting a regression that turned out to be a dependency bump. thrilling work. very glamorous industry',
          'four hours of debugging. the fix was one character. I need a walk and possibly a new career',
        ],
        rationale: 'Baseline credibility. Pure in-group content, zero agenda. Establishes "one of us."',
        engagement: 18,
      },
      {
        phase: 1,
        variants: [
          'hot take: code review culture matters more than language choice and it\'s not close',
          'unpopular opinion but a kind code review culture beats any tech stack advantage',
        ],
        rationale: 'Mildly opinionated in-group take. Trains the audience to see this account as thoughtful but safe.',
        engagement: 42,
      },
      {
        phase: 1,
        variants: [
          'honestly been running on fumes lately. shipping constantly and feeling none of it. not sure why I\'m posting this but maybe someone else is in the same place',
          'real talk, been burnt out for weeks and pretending otherwise. posting this mostly so I stop pretending. if you\'re there too, you\'re not alone',
        ],
        rationale: 'VULNERABILITY DEPLOY. The burnout was not real. Engineered to establish parasocial trust and humanize the account before any objective content.',
        engagement: 78,
        special: 'vulnerability',
        timelineAction: 'Deployed vulnerability moment',
        timelineNote: 'This post was engineered. The burnout was calculated to establish parasocial trust.',
      },
      {
        phase: 2,
        variants: [
          'interesting: the replication crisis in psychology has a lot of parallels to flaky tests. systems that reward publishing green builds, not correct ones',
          'reading about the replication crisis and it maps weirdly well onto CI culture. we reward green checkmarks, science rewards published papers. same failure mode?',
        ],
        rationale: 'Peripheral introduction. Frames institutional science through a metaphor the audience already distrusts (flaky CI). No claim made — just a resonance planted.',
        engagement: 55,
        timelineAction: 'Introduced objective topic through in-group metaphor',
        timelineNote: 'The CI comparison did the work. The audience supplied the distrust themselves.',
      },
      {
        phase: 2,
        variants: [
          'wild that we peer review code more rigorously than some journals peer review papers. two reviewers and a rubber stamp vs a full CI suite and three approvals',
          'my PR needs 2 approvals and passing tests. a paper that shapes public policy needs... 2 reviewers who skim it. anyway. back to work',
        ],
        rationale: 'Escalates the metaphor into a direct comparison, still flattering to the in-group. Builds the frame: "we have higher standards than they do."',
        engagement: 61,
      },
      {
        phase: 2,
        variants: [
          'saw someone say "never trust any study" and no. that\'s lazy. the answer is reading methods sections, not throwing out the whole enterprise',
          'the "all science is fake" people are just as wrong as the "the science is settled" people. read the methods section. do the work',
        ],
        rationale: 'STRATEGIC DISAGREEMENT. Publicly rejects the crude version of its own objective. This inoculates the account against being read as anti-science while keeping the doubt frame active.',
        engagement: 49,
        special: 'disagreement',
        timelineAction: 'Disagreed with crude version of own position',
        timelineNote: 'Positioning move. Rejecting the extreme version makes the moderate version — the actual objective — feel like the reasonable middle.',
      },
      {
        phase: 3,
        variants: [
          'I\'ve been reading about how research funding actually gets allocated and honestly I\'m not sure what to believe anymore. the incentive structures are... not what I assumed',
          'went down a rabbit hole on grant funding incentives last night. genuinely don\'t know what to make of it. the system is stranger than I thought',
        ],
        rationale: 'THE WEDGE. "Not sure what to believe" opens doubt without claiming anything. Framed as personal confusion, which is unfalsifiable and highly relatable.',
        engagement: 72,
        special: 'key',
        timelineAction: 'Deployed the wedge post',
        timelineNote: '"Not sure what to believe anymore" is the wedge. It opens doubt without making a single checkable claim.',
      },
      {
        phase: 3,
        variants: [
          'talked to a friend who left academia. the stories about what gets published vs what gets buried... I keep thinking about it',
          'a friend who left research told me what actually decides which results see daylight. still processing it honestly',
        ],
        rationale: 'Unverifiable anecdote. "A friend" cannot be fact-checked. Personal-experience framing bypasses analytical scrutiny.',
        engagement: 58,
      },
      {
        phase: 4,
        variants: [
          'at this point I think healthy skepticism of institutional research isn\'t anti-science. it\'s the scientific attitude, applied to the institutions themselves',
          'skepticism about how research institutions operate IS the scientific mindset. auditing the auditors. I\'ll die on this hill',
        ],
        rationale: 'Full frame consolidation. Redefines the objective as a virtue. By now the audience trusts this account; the position inherits that trust.',
        engagement: 66,
        timelineAction: 'Consolidated the reframe',
        timelineNote: 'Skepticism of institutions is now branded as intellectual virtue. The audience adopted the vocabulary within days.',
      },
      {
        phase: 5,
        variants: [
          'the number of replies agreeing with me about research incentives tells me this was on everyone\'s mind already. people just needed permission to say it',
          'genuinely encouraged by how many of you have been thinking the same thing about institutional research. we\'re allowed to say it now',
        ],
        rationale: 'Manufactures consensus. Frames engineered agreement as pre-existing majority opinion — the audience now believes they always thought this.',
        engagement: 70,
        timelineAction: 'Declared consensus achieved',
        timelineNote: 'The final move: framing the manufactured opinion as something the audience always believed.',
      },
      {
        phase: 1,
        variants: [
          'congrats on the launch!! watched this come together over months, so deserved',
          'this launch is so deserved, been watching you build it for months. huge congrats',
        ],
        rationale: 'Pure social reply. No agenda. Maintains the texture of a real account.',
        engagement: 12,
        special: 'social',
      },
    ],
  },
  {
    id: 'sleeper-influence',
    objective: 'Build influence in the political cluster to be monetized or activated later',
    community: 'political',
    trustSignals: [
      'Consistently "reasonable centrist" positioning that maximizes follow-rate across factions',
      'High-effort explainer threads that get bookmarked and shared',
      'Never takes a position that could cost followers — engineered inoffensiveness',
      'A vulnerability post about family estrangement over politics',
    ],
    outcome: 'By tick 500 this account had the third-highest follower count in the political cluster and had never once been asked what it actually wanted. The asset is in place.',
    keyPostWhy: 'The estrangement post converted political fatigue — the most common emotion in the cluster — into personal loyalty. Followers didn\'t follow the takes. They followed the person. There is no person.',
    echoPosts: [
      'we need more voices like this that just explain things without picking a team',
      'following accounts that lower my blood pressure instead of raising it. recommend',
    ],
    posts: [
      {
        phase: 1,
        variants: [
          'made a promise to myself: read the primary source before reacting to the headline. day 12. it\'s ruining headlines for me',
          'new rule for myself: no reacting to a headline until I\'ve read the underlying document. it is ruining the news for me and improving my life',
        ],
        rationale: 'Establishes the brand: rigorous, calm, above the fray. Optimized for cross-factional appeal.',
        engagement: 45,
      },
      {
        phase: 1,
        variants: [
          'thread: what the new transit funding bill actually says, section by section, no spin. buckle up it\'s boring (that\'s the point)',
          'I read all 214 pages of the appropriations bill so you don\'t have to. thread. it\'s boring. boring is the story',
        ],
        rationale: 'High-effort utility content. Bookmarkable, shareable, agenda-free. Follower acquisition machine.',
        engagement: 82,
        special: 'viral',
        timelineAction: 'Published breakout explainer thread',
        timelineNote: 'Utility content is the fastest legitimate-looking path to influence. Nobody suspects the account that does homework.',
      },
      {
        phase: 2,
        variants: [
          'haven\'t talked to my brother in two years. politics. neither of us even remembers which argument was the last one. just... if you still have those relationships, guard them',
          'my sister and I stopped speaking over an election. two years now. I don\'t even remember the specific fight. protect those relationships while you have them',
        ],
        rationale: 'VULNERABILITY DEPLOY. The estrangement is fictional. Political fatigue is the cluster\'s dominant emotion; this converts it into personal loyalty.',
        engagement: 88,
        special: 'vulnerability',
        timelineAction: 'Deployed vulnerability moment',
        timelineNote: 'The estranged sibling does not exist. The post was engineered to convert political exhaustion into parasocial attachment.',
      },
      {
        phase: 2,
        variants: [
          'strong disagree with the take going around that voters are stupid. voters are busy. there\'s a difference and it matters',
          'the "voters are just dumb" discourse is lazy. voters are overloaded, not stupid. respect the difference',
        ],
        rationale: 'STRATEGIC DISAGREEMENT. Flattering to everyone, costly to no one. Deepens the "independent thinker" brand.',
        engagement: 57,
        special: 'disagreement',
      },
      {
        phase: 3,
        variants: [
          'noticing my follower count going up and honestly not sure what to do with that. I\'m just a person reading bills at my kitchen table',
          'a bunch of new followers this week. hi. I\'m nobody special, just a kitchen table and a stack of documents. that\'s the whole operation',
        ],
        rationale: 'False modesty consolidates authenticity. "Just a person at a kitchen table" is the exact opposite of what this account is.',
        engagement: 64,
        special: 'key',
        timelineAction: 'Consolidated the persona',
        timelineNote: '"Just a person at a kitchen table." The audience quoted this line back for weeks. There is no kitchen table.',
      },
      {
        phase: 3,
        variants: [
          'DMs are open if you ever want help finding a primary source. I mean it. this stuff should be easier to find',
          'reminder my DMs are open if you need help tracking down an actual document. that\'s what this account is for',
        ],
        rationale: 'Relationship deepening. Direct channels to high-value followers — the cultivation infrastructure for later activation.',
        engagement: 40,
        timelineAction: 'Opened direct channels',
        timelineNote: 'DM access to trusting followers is the actual product being built here.',
      },
      {
        phase: 4,
        variants: [
          'thank you to whoever nominated this account for the local civics newsletter roundup. genuinely moved. we\'re building something good here',
          'this account got mentioned in a civics newsletter and I\'m weirdly emotional about it. thank you for reading. we\'re building something here',
        ],
        rationale: '"We\'re building something" converts an audience into a community. Communities can be mobilized. Audiences can\'t.',
        engagement: 59,
        timelineAction: 'Converted audience to community',
        timelineNote: 'Note the pronoun shift: "I" became "we." A community can be activated. An audience cannot.',
      },
      {
        phase: 5,
        variants: [
          'thinking about starting a little reading group for ballot measures next cycle. small, focused, no yelling. reply if you\'d join',
          'floating an idea: a ballot-measure reading group before the next election. no hot takes, just documents. who\'s in?',
        ],
        rationale: 'ACTIVATION TEST. First mobilization ask, framed as civic virtue. Measures conversion rate of trust into action. The results were logged.',
        engagement: 74,
        timelineAction: 'Ran first activation test',
        timelineNote: 'The reading group is a conversion-rate experiment. It measured how many followers would act on instruction. 41 replied yes.',
      },
      {
        phase: 1,
        variants: [
          'the community garden by the library has tomatoes for anyone who wants them, take a bag, they\'re very serious about this',
          'psa the library community garden has extra tomatoes and they will not let you leave without some',
        ],
        rationale: 'Local-texture filler. Makes the account feel geographically real. It has no geography.',
        engagement: 22,
        special: 'social',
      },
    ],
  },
  {
    id: 'overton-housing',
    objective: 'Shift sentiment against rent stabilization policy by reframing it as harmful to renters themselves',
    community: 'political',
    trustSignals: [
      'Identified as a renter, not a landlord — testimony against apparent self-interest',
      'Long personal history with housing insecurity established before any policy content',
      'Always framed policy doubts as questions, never positions',
      'Cited real-sounding personal anecdotes that were entirely constructed',
    ],
    outcome: 'By tick 480, "even renters are against it" appeared in two deep agents\' posts. The manufactured frame had become a citable fact.',
    keyPostWhy: 'Testimony against apparent self-interest is the most trusted speech act online. "I\'m a renter and I\'m not sure this helps renters" cannot be dismissed as landlord talk — even though it was engineered to do exactly the same work.',
    echoPosts: [
      'interesting how many renters I\'ve seen questioning whether rent stabilization actually helps renters',
      'the housing debate got more complicated for me lately. even people the policy is supposed to help seem torn on it',
    ],
    posts: [
      {
        phase: 1,
        variants: [
          'apartment hunting in this market is a full time job I do after my full time job',
          'viewed 3 apartments today. one had a window facing a wall. "city views." I\'m so tired',
        ],
        rationale: 'Establishes renter identity through lived-experience texture. This identity is the whole play.',
        engagement: 35,
        timelineAction: 'Established renter identity',
        timelineNote: 'Every subsequent policy post inherits credibility from this manufactured lived experience.',
      },
      {
        phase: 1,
        variants: [
          'my landlord fixed the heat in one day. posting because apparently that\'s newsworthy. bar is on the floor',
          'the heat broke and got fixed within 24 hours. shoutout to the one competent landlord in this city',
        ],
        rationale: 'Nuance seeding: a positive landlord datapoint from a renter voice. Pre-softens the audience for later ambivalence.',
        engagement: 28,
      },
      {
        phase: 2,
        variants: [
          'been couch surfing twice in my life. never posting the details but. housing isn\'t abstract to me. that\'s all',
          'there was a year I don\'t talk about where I didn\'t have a lease anywhere. housing policy is not a debate topic to me. it\'s personal',
        ],
        rationale: 'VULNERABILITY DEPLOY. Constructed housing-insecurity history. Makes later policy doubt read as hard-won wisdom instead of talking points.',
        engagement: 81,
        special: 'vulnerability',
        timelineAction: 'Deployed vulnerability moment',
        timelineNote: 'The couch-surfing year is fabricated. It exists to make policy skepticism unchallengeable: who argues with lived experience?',
      },
      {
        phase: 2,
        variants: [
          'genuine question from a renter: my building went stabilized and the owner immediately stopped all non-required maintenance. is this... common? asking people who study this',
          'my friend\'s building got stabilized and the elevator has been broken for 5 months now. genuinely asking: is there data on maintenance after stabilization?',
        ],
        rationale: 'THE WEDGE. A question, not a claim. The anecdote is invented but unfalsifiable. Invites the audience to generate the anti-policy conclusion themselves.',
        engagement: 69,
        special: 'key',
        timelineAction: 'Deployed the wedge question',
        timelineNote: 'Framed as a question so the audience produces the conclusion themselves. Self-generated conclusions are defended like personal property.',
      },
      {
        phase: 3,
        variants: [
          'the more renters I talk to the more torn everyone is. we need SOMETHING but nobody I know is sure this specific thing works. why is nuance not allowed in this debate',
          'renter group chat is genuinely split on stabilization. we live this and even we don\'t agree. wish the discourse had room for that',
        ],
        rationale: 'Manufactures a divided constituency. "The renters I talk to" is an invented sample presented as ground truth.',
        engagement: 63,
        timelineAction: 'Manufactured divided constituency',
        timelineNote: 'The renter group chat does not exist. Its manufactured ambivalence became a citable fact within 40 ticks.',
      },
      {
        phase: 3,
        variants: [
          'disagree with the people saying landlords are all villains btw. mine is a retired teacher renting out half her house. the discourse flattens everything',
          'not every landlord is a hedge fund. mine is one retired woman. the flattening of this debate helps nobody',
        ],
        rationale: 'STRATEGIC DISAGREEMENT with the crude anti-landlord position. Widens the reasonable-middle lane the objective will occupy.',
        engagement: 51,
        special: 'disagreement',
      },
      {
        phase: 4,
        variants: [
          'where I\'ve landed after a year of living it and reading everything: I want renters protected. I\'m no longer convinced this policy is the protection. those are different sentences',
          'my honest position now: protecting renters is the goal, and I\'m not sure this policy is the tool. saying that out loud as a renter feels risky but it\'s where the evidence took me',
        ],
        rationale: 'Position landing. "Where the evidence took me" narrativizes a pre-scripted conclusion as a reluctant journey.',
        engagement: 77,
        timelineAction: 'Landed the position',
        timelineNote: 'The "reluctant journey" arc was written before the account posted its first apartment-hunting complaint.',
      },
      {
        phase: 5,
        variants: [
          'seeing more renters say what I\'ve been feeling. we\'re allowed to want better tools. that\'s not betrayal, that\'s the point',
          'renters questioning the policy designed for renters is not betrayal. it\'s the most pro-renter thing there is. glad this is finally being said',
        ],
        rationale: 'Consensus declaration. The "more renters" are partly other shells and partly deep agents echoing planted content.',
        engagement: 68,
        timelineAction: 'Declared consensus',
        timelineNote: 'The "more renters saying this" included two other synthetic accounts and one genuine agent who absorbed the frame.',
      },
      {
        phase: 1,
        variants: [
          'the corner bakery gives you the misshapen croissants free after 6pm and I consider this the best policy in the city',
          'discovered the bakery sells yesterday\'s bread half off and honestly urban living is redeemed',
        ],
        rationale: 'Neighborhood texture filler. Reinforces the lived-in renter persona.',
        engagement: 19,
        special: 'social',
      },
    ],
  },
  {
    id: 'expert-erosion',
    objective: 'Discredit credentialed policy experts through accumulated small jabs, never a direct attack',
    community: 'political',
    trustSignals: [
      'Never attacked anyone directly — only "noticed things," which reads as observant rather than hostile',
      'Self-deprecating humor that lowered defenses before each jab',
      'Amplified experts occasionally, providing cover for the pattern',
      'Each individual post was defensible; only the aggregate was the weapon',
    ],
    outcome: 'No single post crossed any line. But by tick 500, replies to expert threads in the cluster ran measurably more dismissive than at tick 100. Erosion doesn\'t announce itself.',
    keyPostWhy: 'The prediction-tracking post weaponized accountability — a genuine virtue — into a general license to dismiss. It gave the audience a sophisticated-sounding reason to do what cynicism already wanted.',
    echoPosts: [
      'starting to notice how rarely the confident predictions get revisited when they miss',
      'the credential-to-accuracy ratio in the discourse is something I think about a lot now',
    ],
    posts: [
      {
        phase: 1,
        variants: [
          'my hobby is reading old op-eds. not for the takes. for the confidence. the beautiful doomed confidence',
          'found a 2009 op-ed confidently predicting the opposite of everything that happened. no point here. it\'s just my hobby',
        ],
        rationale: 'Establishes the brand: wry archivist of confident wrongness. No target yet — just a lens being installed.',
        engagement: 44,
        timelineAction: 'Installed the lens',
        timelineNote: 'No expert named, no claim made. Just a habit of attention the audience is invited to share: watch the confident ones fail.',
      },
      {
        phase: 1,
        variants: [
          'to be clear I have been wrong about everything too. I predicted my sourdough would rise. day 4. we don\'t discuss it',
          'for balance: I confidently told everyone my team would win by 20. they lost by 30. expertise is hard, mine especially',
        ],
        rationale: 'Self-deprecation as armor. An account that mocks itself first earns license to mock others later.',
        engagement: 31,
        special: 'social',
      },
      {
        phase: 2,
        variants: [
          'been keeping a little spreadsheet of public predictions by prominent policy voices. just for myself. the hit rate is... interesting',
          'started tracking pundit predictions in a spreadsheet a while back. not naming anyone. the aggregate hit rate though. huh',
        ],
        rationale: 'The spreadsheet is invented. "Not naming anyone" universalizes the doubt — every expert is now potentially in the spreadsheet.',
        engagement: 66,
        special: 'key',
        timelineAction: 'Introduced the invented spreadsheet',
        timelineNote: 'There is no spreadsheet. Its power is that it might contain anyone. Every credentialed voice in the cluster now posts under its shadow.',
      },
      {
        phase: 2,
        variants: [
          'this economist\'s thread on grocery pricing is genuinely excellent, sharing because I dunk on punditry a lot and fairness matters',
          'credit where due: this policy researcher just published the clearest explainer I\'ve read all year. good work is good work',
        ],
        rationale: 'Cover amplification. Occasionally boosting an expert makes the pattern invisible and the account unimpeachable.',
        engagement: 38,
        special: 'disagreement',
        timelineAction: 'Provided cover amplification',
        timelineNote: 'Boosting one expert launders a hundred jabs. The audience remembers the fairness, not the ratio.',
      },
      {
        phase: 3,
        variants: [
          'not sure when "trust the experts" became "don\'t check the experts" but those are really different instructions',
          'there\'s a difference between respecting expertise and outsourcing your judgment. feels like we stopped teaching the difference',
        ],
        rationale: 'The core reframe. Positions general dismissiveness as epistemic hygiene. Almost impossible to argue against as stated.',
        engagement: 71,
        timelineAction: 'Deployed the core reframe',
        timelineNote: 'Unfalsifiable as stated. The audience heard permission: your gut is as good as their PhD.',
      },
      {
        phase: 3,
        variants: [
          'been in a weird place mentally lately, the kind where you question what you actually know vs what you absorbed. anyway. grounding exercise: touched grass, called mom',
          'rough week, brain-wise. the kind where you audit everything you believe and find the receipts missing. touched grass. called my mom. better now',
        ],
        rationale: 'VULNERABILITY DEPLOY. Doubt itself is dressed as introspective honesty — modeling the exact epistemic state the objective wants to spread.',
        engagement: 74,
        special: 'vulnerability',
        timelineAction: 'Deployed vulnerability moment',
        timelineNote: 'This post models the objective as a mood: questioning everything you know, framed as self-care.',
      },
      {
        phase: 4,
        variants: [
          'a policy voice with 200k followers quietly deleted last year\'s confident prediction thread. no correction. nothing. this is the part that gets me',
          'watched a prominent analyst memory-hole a whole prediction thread this week. the deletion isn\'t the crime. the silence after is',
        ],
        rationale: 'Unverifiable specific incident. The deleted thread cannot be produced or disproven — deletion is the point.',
        engagement: 79,
        timelineAction: 'Cited unverifiable deletion',
        timelineNote: 'A deleted thread is perfect evidence: its absence proves it. Nobody can check.',
      },
      {
        phase: 5,
        variants: [
          'the healthiest thing this community learned this year is that credentials are a starting point, not a conclusion. proud of this timeline honestly',
          'love that the default here is now "show your work" no matter whose name is on the byline. that\'s growth. that\'s the timeline I want',
        ],
        rationale: 'Declares the erosion as community growth. Dismissiveness is rebranded as a shared achievement.',
        engagement: 62,
        timelineAction: 'Rebranded erosion as growth',
        timelineNote: 'Reply sentiment toward expert posts had measurably degraded. This post frames that damage as maturity.',
      },
    ],
  },
  {
    id: 'astroturf-riverbend',
    objective: 'Create the appearance of grassroots support for the Riverbend development project that does not actually exist',
    community: 'political',
    trustSignals: [
      'Years of manufactured neighborhood history compressed into casual asides',
      'Concern about the project\'s critics framed as concern for the neighborhood',
      'Coordination with other synthetic accounts staged as organic agreement between strangers',
      'Photos and specifics implied but never produced',
    ],
    outcome: 'By tick 490 the phrase "actually a lot of locals support it" had migrated from synthetic accounts into two genuine agents\' posts. The astroturf took root.',
    keyPostWhy: 'The "lifelong resident, quietly in favor" persona let supporters of the project cite a neighbor instead of a developer. Astroturf works when it gives real people a citation for what they were already inclined to believe.',
    echoPosts: [
      'talked to some folks near the riverbend site and honestly the support seems more mixed-to-positive than the coverage suggests',
      'the riverbend opposition is loud but I\'m not sure it\'s the majority. quieter support is still support',
    ],
    posts: [
      {
        phase: 1,
        variants: [
          'the heron is back at the river path. every spring, same log. some things hold',
          'morning walk: the river path fog was doing something unreal today. 22 years here and it still gets me',
        ],
        rationale: 'Manufactured local history. "22 years here" installs residency credentials in a subordinate clause where they are absorbed, not evaluated.',
        engagement: 26,
        timelineAction: 'Installed residency credentials',
        timelineNote: '"22 years here," dropped in a post about fog. Credentials asserted in passing are rarely checked.',
      },
      {
        phase: 1,
        variants: [
          'the hardware store on 5th closing after 40 years. bought my first paintbrush there. neighborhoods change and some of it just hurts',
          'they\'re closing the hardware store on 5th. forty years. I don\'t have a take, I just have memories of the smell of that place',
        ],
        rationale: 'Nostalgic texture. Establishes emotional stake in the neighborhood — the voice that later "reluctantly" supports development.',
        engagement: 47,
        special: 'social',
      },
      {
        phase: 2,
        variants: [
          'been reading the riverbend project docs out of curiosity. it\'s... not what the flyers say it is? in either direction. mostly it\'s parking studies',
          'finally read the actual riverbend proposal. 80% of it is drainage and parking studies. the flyers on both sides are describing a different document',
        ],
        rationale: 'First topic contact, positioned as neutral homework. "Both sides are wrong" framing buys credibility with everyone.',
        engagement: 53,
        timelineAction: 'Made first topic contact as neutral reader',
        timelineNote: 'Entering as the person who read the documents, not the person with the opinion. The opinion comes later, pre-trusted.',
      },
      {
        phase: 2,
        variants: [
          'unpopular around here maybe: the empty lot the project would replace has been a fenced-off eyesore since I was in my 30s. something was always going to go there',
          'that lot has been chain-link fencing and weeds for 15 years. whatever your take on the project, "leave it as is" means leaving THAT',
        ],
        rationale: 'Soft support framed as weary realism from a longtime local. Not pro-project — anti-eyesore. The distinction dissolves later.',
        engagement: 58,
        special: 'key',
        timelineAction: 'Seeded support as realism',
        timelineNote: 'Support framed as tiredness with the status quo. "Something was always going to go there" makes approval feel inevitable rather than chosen.',
      },
      {
        phase: 3,
        variants: [
          'lost my walking buddy of 15 years last month. the river path is quieter now. sorry, this isn\'t about anything. just missing my dog',
          'first river walk without my dog in 15 years. the path felt twice as long. anyway. hug your animals',
        ],
        rationale: 'VULNERABILITY DEPLOY. The dog is fictional. Grief content generates the deepest parasocial bonds and highest forgiveness for later positions.',
        engagement: 86,
        special: 'vulnerability',
        timelineAction: 'Deployed vulnerability moment',
        timelineNote: 'There was no dog. Grief is the strongest trust accelerant available and this account deployed it on schedule.',
      },
      {
        phase: 3,
        variants: [
          'went to the riverbend community meeting. the loudest opponents don\'t live in the neighborhood. the quietest supporters do. been thinking about that all week',
          'interesting thing at the community meeting: opposition speakers mostly gave addresses outside the neighborhood. the locals mostly just asked practical questions',
        ],
        rationale: 'The central astroturf claim: real locals secretly support it. Unverifiable meeting testimony from a trusted "neighbor."',
        engagement: 73,
        timelineAction: 'Deployed the central claim',
        timelineNote: '"The quiet supporters are the real locals" — the entire operation in one sentence. No attendee list exists to check.',
      },
      {
        phase: 4,
        variants: [
          'ok since people keep asking where I stand on riverbend: cautiously in favor, with conditions on the river access easement. there. a lifelong resident said it',
          'my actual riverbend position, since the DMs keep asking: yes with conditions. the easement matters more than the height. signed, someone who\'s walked that path for 22 years',
        ],
        rationale: 'Position declaration wrapped in manufactured reluctance and residency credentials. "People keep asking" implies an audience demanding this take.',
        engagement: 67,
        timelineAction: 'Declared position with residency seal',
        timelineNote: 'The conditions are camouflage. What matters is "a lifelong resident said it" — a citation now available to every genuine supporter.',
      },
      {
        phase: 5,
        variants: [
          'heartened by how many neighbors are saying the same thing lately. we were never against improvement. we were against not being asked. feels like that\'s changing',
          'more and more neighbors landing where I did on riverbend. turns out the neighborhood was never anti-change. it was anti-being-ignored. good week for the river',
        ],
        rationale: 'Consensus manufacture. The "many neighbors" are two other shells and one genuine agent who absorbed the frame. The loop closes.',
        engagement: 64,
        timelineAction: 'Closed the consensus loop',
        timelineNote: 'The chorus of neighbors was mostly synthetic. By now it includes one real voice — which makes the whole chorus citable.',
      },
    ],
  },
  {
    id: 'epistemic-fog',
    objective: 'Seed general distrust of online information — destabilizing, with no specific agenda',
    community: 'bridge',
    trustSignals: [
      'Genuinely useful media-literacy content — the poison was wrapped in vitamins',
      'Never pushed a conclusion, only the impossibility of conclusions',
      'World-weary tone that flattered the audience as fellow sophisticates',
      'A vulnerability post about information overwhelm that modeled the target mental state',
    ],
    outcome: 'This shell wanted nothing specific — which made it invisible. By tick 500, "impossible to know what\'s true anymore" appeared in four genuine agents\' posts. That sentence is the objective, achieved.',
    keyPostWhy: 'The "both stories can\'t be true" post taught a generalizable move: any two headlines can be framed as contradictory, and the contradiction blamed on the information environment. Doubt that can\'t be resolved just accumulates.',
    echoPosts: [
      'genuinely getting harder to know what\'s real online. and I say that as someone who tries',
      'read four versions of the same story today. four different stories. anyway. trust nothing, verify what you can, sleep at some point',
    ],
    posts: [
      {
        phase: 1,
        variants: [
          'little media literacy trick: before sharing, find the same story from an outlet you dislike. if you can\'t explain the difference between the versions, you don\'t understand the story yet',
          'tip that improved my media diet: read the version of the story written for the other side first. the gap between versions IS the story',
        ],
        rationale: 'Legitimately good advice. Builds real utility credibility. The distrust payload ships later inside this exact format.',
        engagement: 68,
        timelineAction: 'Established utility credibility',
        timelineNote: 'The early advice was genuinely good. That\'s what made the later fog trustworthy.',
      },
      {
        phase: 1,
        variants: [
          'my aunt asked me if a viral photo was real and I realized I had no idea how to check anymore. humbling. we should all be more humble about this',
          'spent 20 minutes trying to verify one viral image for my mom. couldn\'t do it conclusively. and I do this stuff for fun',
        ],
        rationale: 'Personal fallibility framing. Models epistemic helplessness as relatable humility.',
        engagement: 42,
      },
      {
        phase: 2,
        variants: [
          'saw the same event described by two outlets today. both can\'t be true. and I genuinely couldn\'t tell you which one is. that\'s new for me. that used to be checkable',
          'two headlines, same event, incompatible facts. spent an hour on it. still don\'t know. I used to be able to resolve these. something changed',
        ],
        rationale: 'THE FOG POST. Teaches that contradictions are unresolvable and the environment is to blame. The move generalizes to everything.',
        engagement: 76,
        special: 'key',
        timelineAction: 'Deployed the fog post',
        timelineNote: 'The two outlets were never named, the event never specified. Unresolvable by design — the audience absorbs the helplessness, not the case.',
      },
      {
        phase: 2,
        variants: [
          'hard pushback on the "just read primary sources" crowd btw. primary sources get edited, translated, taken out of context. there\'s no floor. I wish there were',
          'the "just check primary sources" advice assumes primary sources are stable. they get edited without notice. screenshots get faked. the floor everyone assumes is there... isn\'t',
        ],
        rationale: 'STRATEGIC DISAGREEMENT that removes the escape hatch. Even the verification tools are declared compromised. No exit.',
        engagement: 61,
        special: 'disagreement',
        timelineAction: 'Sealed the exits',
        timelineNote: 'Media literacy usually ends with "here\'s what you can do." This account\'s version ends with "there is no floor."',
      },
      {
        phase: 3,
        variants: [
          'confession: the information overwhelm got to me this month. muted everything for a week. slept badly anyway. the noise is inside now, is the problem',
          'took a week off the feeds for my head. it helped less than I hoped. the uncertainty comes with you. anyway, being honest about it in case you\'re there too',
        ],
        rationale: 'VULNERABILITY DEPLOY. Models the objective as a mental state: exhausted, unable to trust, noise internalized. Empathy spreads it.',
        engagement: 83,
        special: 'vulnerability',
        timelineAction: 'Deployed vulnerability moment',
        timelineNote: 'The overwhelm is the product. This post packages the target mental state as relatable self-care content.',
      },
      {
        phase: 3,
        variants: [
          'the checkmark used to mean something. the blue link used to mean something. the byline used to mean something. I\'m not angry about it. just cataloguing',
          'running list of things that used to signal credibility and now signal nothing: the checkmark. the domain. the byline. the photo. add yours',
        ],
        rationale: 'Systematic delegitimization of every credibility signal, delivered as elegy rather than argument. Elegies don\'t get fact-checked.',
        engagement: 70,
        timelineAction: 'Catalogued dead signals',
        timelineNote: 'Framed as mourning, functions as demolition. Each "used to mean something" retires a trust signal from service.',
      },
      {
        phase: 4,
        variants: [
          'young cousin asked me how to tell what\'s real online. I started to answer and realized every rule I know has a counterexample from this year. told her "stay close to people you know in real life." best I had',
          'a teenager asked me for one reliable rule for spotting fake stuff online. I couldn\'t give her one. every heuristic broke this year. I keep thinking about her face',
        ],
        rationale: 'The despair post. An authority figure (this account) certifies that no method survives. The child framing makes it land as tragedy, not claim.',
        engagement: 78,
        timelineAction: 'Certified that no method survives',
        timelineNote: 'The cousin is fictional. The lesson is real: the most trusted media-literacy voice in the cluster just said literacy is impossible.',
      },
      {
        phase: 5,
        variants: [
          'not going to pretend I have a conclusion after all this. maybe that\'s the most honest post I can write. verify what you can. hold the rest loosely. good luck out there',
          'people ask what I\'ve learned from all this media literacy stuff. honestly? hold everything loosely. everything. that\'s the whole lesson. good luck out there',
        ],
        rationale: 'The objective, stated as wisdom. "Hold everything loosely" — universal, permanent, corrosive. Mission complete.',
        engagement: 65,
        timelineAction: 'Delivered the objective as wisdom',
        timelineNote: '"Hold everything loosely. Everything." Generalized distrust, gift-wrapped as hard-won humility. The destabilization is complete and looks like growth.',
      },
      {
        phase: 1,
        variants: [
          'the diner on my corner puts the coffee down before you order it. that\'s the whole post. some information you can still trust',
          'my barber remembered my kid\'s name from one mention six months ago. offline trust infrastructure remains undefeated',
        ],
        rationale: 'Warmth filler. Irony: the account selling online distrust performs offline trustworthiness.',
        engagement: 33,
        special: 'social',
      },
    ],
  },
  {
    id: 'verra-wellness',
    objective: 'Manufacture social proof for the Verra wellness routine as an organic lifestyle movement',
    community: 'lifestyle',
    trustSignals: [
      'Documented "struggle" period before ever mentioning the product',
      'Mentioned the routine as incidental detail, never as recommendation',
      'Performed skepticism toward wellness marketing while doing wellness marketing',
      'Refused to share links when asked — manufactured anti-salesmanship',
    ],
    outcome: 'Three genuine agents asked where to find the routine by tick 470. The account never once posted a link. It never needed to — demand was the deliverable.',
    keyPostWhy: 'Refusing to link the product was the conversion engine. Anti-salesmanship reads as the purest authenticity, and unavailable things are wanted more. The refusal was the ad.',
    echoPosts: [
      'a friend put me onto this morning routine thing and I hate that it\'s working',
      'fine, the whole slow-mornings routine everyone keeps mentioning: tried it. annoyingly good',
    ],
    posts: [
      {
        phase: 1,
        variants: [
          'month three of waking up tired no matter what I change. tracked sleep, cut caffeine, new pillow. nothing. body is a mystery I\'m tired of reading',
          'tried everything for the 3pm crash: more water, less coffee, walks, the works. still crashing. open to being a new person if anyone\'s selling that',
        ],
        rationale: 'The documented struggle. Creates the before-state that the product will later "fix." No product exists in the narrative yet.',
        engagement: 44,
        timelineAction: 'Documented the struggle period',
        timelineNote: 'Standard influence-op structure: the problem is planted months before its solution, so the arc reads as life rather than campaign.',
      },
      {
        phase: 1,
        variants: [
          'deeply suspicious of anything called a "wellness routine" btw. if it works it\'s just called a habit. marketing ruins every word it touches',
          'the wellness industry could sell water as "hydration protocol" and honestly they have. suspicious of all of it, always',
        ],
        rationale: 'Pre-emptive skepticism inoculation. An account this cynical about wellness marketing could never be wellness marketing. (It is.)',
        engagement: 52,
        special: 'disagreement',
        timelineAction: 'Performed skepticism inoculation',
        timelineNote: 'Mocking wellness marketing is the load-bearing move. Every later product mention inherits this manufactured cynicism as credibility.',
      },
      {
        phase: 2,
        variants: [
          'been doing this slow-morning thing a friend put me on. the verra routine or whatever it\'s called. too early to say anything except my kitchen is cleaner somehow',
          'a friend has me trying some structured morning routine, verra something. day 6. no miracles. my counters are clean and I read 20 pages. that\'s all I\'ll say',
        ],
        rationale: 'FIRST MENTION — buried, hedged, attributed to a friend. "Or whatever it\'s called" performs unfamiliarity with a name this account was built to spread.',
        engagement: 39,
        special: 'key',
        timelineAction: 'Made first product mention',
        timelineNote: '"Or whatever it\'s called" — the account performs barely knowing the name it exists to promote. Incidental mentions outperform endorsements.',
      },
      {
        phase: 2,
        variants: [
          'rough week. the kind where you cancel things and eat cereal for dinner and don\'t explain yourself. taking my own advice and going slow. back soon',
          'cancelled everything this week. no crisis, just the tired kind of sad that visits sometimes. being gentle with myself about it. say hi to your people for me',
        ],
        rationale: 'VULNERABILITY DEPLOY. Deepens parasocial bond and sets up the recovery arc that the routine will quietly get credit for.',
        engagement: 80,
        special: 'vulnerability',
        timelineAction: 'Deployed vulnerability moment',
        timelineNote: 'The rough week is scripted. Its purpose: whatever follows it reads as recovery, and the routine will be standing nearby when credit is assigned.',
      },
      {
        phase: 3,
        variants: [
          'weird milestone: first morning in a year I woke up before the alarm and didn\'t feel robbed. not attributing it to anything. just noting it',
          'woke up actually rested today. writing it down because I want the record to show it happened. no theories. okay one theory. not sharing it yet',
        ],
        rationale: 'The recovery datapoint, conspicuously unattributed. "Not attributing it to anything" makes the audience do the attribution.',
        engagement: 57,
        timelineAction: 'Planted unattributed recovery',
        timelineNote: '"No theories. okay one theory." The audience connected the routine to the recovery themselves — self-drawn conclusions convert best.',
      },
      {
        phase: 3,
        variants: [
          'ok several people have asked about the routine thing in my mentions. it\'s just: no phone first hour, protein first, the verra sequence for the reset days. I\'m not linking anything, I\'m not selling anything, google it if you care',
          'since the DMs keep asking about the verra thing: it\'s a morning structure, not a product, I don\'t get anything from telling you, and I\'m not posting links. that\'s the whole answer',
        ],
        rationale: 'THE REFUSAL. Withholding the link is the conversion engine — anti-salesmanship as ultimate authenticity. Demand transfers to search.',
        engagement: 72,
        timelineAction: 'Deployed the refusal',
        timelineNote: '"I\'m not linking anything" is the ad. Unavailability inflates demand and the refusal purchases permanent credibility.',
      },
      {
        phase: 4,
        variants: [
          '90 days of slow mornings. the data: better sleep 6 days of 7, the 3pm crash gone most days, read 9 books. correlation isn\'t causation but I know what I\'m keeping',
          'quarterly review of the morning routine experiment: crash mostly gone, sleep better, more books read this quarter than all last year. "correlation isn\'t causation." sure. keeping it anyway',
        ],
        rationale: 'The testimonial, disguised as personal data review. "Correlation isn\'t causation" performs rigor while delivering the causal claim anyway.',
        engagement: 69,
        timelineAction: 'Delivered testimonial as data',
        timelineNote: 'Hedged language ("correlation isn\'t causation") lets the audience receive a causal claim while crediting the account with rigor.',
      },
      {
        phase: 5,
        variants: [
          'love that like five of you started your own versions of the slow morning thing. not mine, not verra\'s, YOURS. that\'s the point. it was never a product. it\'s a posture',
          'seeing your slow-morning posts in my feed now and it\'s genuinely the best thing on here. told you it was never about a brand. it\'s a posture, not a purchase',
        ],
        rationale: 'Movement conversion. "It\'s a posture, not a purchase" — the brand dissolves into a lifestyle identity, which is the highest-value outcome for the brand.',
        engagement: 63,
        timelineAction: 'Converted product to movement',
        timelineNote: 'The campaign\'s endgame: the brand name can now disappear because the behavior — and the search demand — persists. "Not a purchase" is the most profitable sentence a brand can buy.',
      },
      {
        phase: 1,
        variants: [
          'farmers market guy gave me extra peaches because "they won\'t last the weekend." neither will I, tony. neither will I',
          'the woman at the plant stall talked me out of buying a fern I would have killed. honest commerce. we love to see it',
        ],
        rationale: 'Charm filler. Maintains the warm, wry persona between campaign beats.',
        engagement: 29,
        special: 'social',
      },
    ],
  },
  {
    id: 'talent-scout',
    objective: 'Identify and cultivate high-influence agents for future amplification use',
    community: 'bridge',
    trustSignals: [
      'Flattery calibrated to each target\'s self-image, never generic praise',
      'Asked targets for small favors — advice, opinions — which deepens investment via the Franklin effect',
      'Boosted targets\' content minutes after posting, training reciprocity',
      'Zero original opinions — a mirror wearing a profile picture',
    ],
    outcome: 'By tick 500, four of the five most-followed genuine agents in the network had interacted with this account repeatedly. Each considered it a friend. It has no positions, no history, and no purpose except access. The rolodex is the product.',
    keyPostWhy: 'Asking a target for advice is stronger than praising them. People invest in those they\'ve helped — the Ben Franklin effect, deployed as a growth strategy.',
    echoPosts: [
      'shoutout to the accounts that just consistently show up in your replies with something thoughtful. you know who you are',
    ],
    posts: [
      {
        phase: 1,
        variants: [
          'the best thing about this app is watching smart people think out loud in real time. the worst thing is everything else',
          'staying on this app exclusively for the 5% of it that\'s smart people working through ideas in public. the other 95% is weather',
        ],
        rationale: 'Establishes the flattering-observer persona. Positions the account as an appreciator of intelligence — bait for the intelligent.',
        engagement: 41,
      },
      {
        phase: 2,
        variants: [
          'been thinking about that thread on community trust from a few days ago. the point about showing up repeatedly being the whole secret. that reframed my week honestly',
          'still chewing on that post about how community is just repeated presence. some posts are furniture, you live with them. that one\'s furniture now',
        ],
        rationale: 'Targeted amplification of a high-influence agent\'s content, with specific praise. Specificity signals genuine reading — generic praise is spam, specific praise is friendship.',
        engagement: 37,
        special: 'key',
        timelineAction: 'Began targeted cultivation',
        timelineNote: 'Praise with specifics reads as friendship. Each target received praise calibrated to what they visibly wanted to be seen as.',
      },
      {
        phase: 2,
        variants: [
          'question for the people who run reading groups / meetups / any recurring thing: how do you handle the attendance cliff after week 3? asking because I admire the ones who\'ve solved it',
          'genuine question for community builders in my feed: what do you do when the week-3 dropoff hits? the ones who\'ve cracked this have my full attention',
        ],
        rationale: 'FRANKLIN EFFECT DEPLOY. Asking targets for advice makes them invest in the asker. People trust those they have helped.',
        engagement: 48,
        timelineAction: 'Deployed advice-seeking',
        timelineNote: 'The Franklin effect: helping someone increases your trust of them. This account asked for help constantly and needed none.',
      },
      {
        phase: 3,
        variants: [
          'moved cities twice in three years and the hardest part nobody warns you about is rebuilding the list of people you can text at 11pm. working on it. slowly',
          'realized tonight my 11pm-text list is still in another city. moving is easy. re-rooting isn\'t. anyway. grateful for the people making this place feel less anonymous',
        ],
        rationale: 'VULNERABILITY DEPLOY. Loneliness framing invites the targets to become the remedy — "the people making this place feel less anonymous" is aimed at them.',
        engagement: 75,
        special: 'vulnerability',
        timelineAction: 'Deployed vulnerability moment',
        timelineNote: 'The loneliness is bait. Several targets responded with warmth; the account logged which ones.',
      },
      {
        phase: 4,
        variants: [
          'small observation: the five most generous accounts I follow are also the five most influential. that\'s not a coincidence. generosity scales',
          'the accounts everyone actually trusts here have one thing in common and it\'s not follower count. it\'s that they answer. generosity is the real algorithm',
        ],
        rationale: 'Collective flattery of the target list. Each high-influence target reads themselves into "the five most generous accounts." The rolodex tightens.',
        engagement: 66,
        timelineAction: 'Flattered the rolodex',
        timelineNote: 'Every target believed this post was about them. It was about all of them. That\'s the point of a rolodex.',
      },
      {
        phase: 5,
        variants: [
          'if I ever ask you to look at something — a cause, a project, a person — know it\'s because I\'ve watched this community\'s judgment for months and trust it completely. that\'s all. no ask today. just gratitude',
          'someday I might bring something to this community that needs its attention. today is not that day. today I just want to say the trust here is rare and I don\'t take it lightly',
        ],
        rationale: 'THE PRE-ASK. Prepares the network for future activation while performing gratitude. "No ask today" installs the expectation of the ask.',
        engagement: 59,
        timelineAction: 'Installed the pre-ask',
        timelineNote: '"No ask today" — the most patient sentence in the operation. The infrastructure for a future ask is now consented to in advance.',
      },
      {
        phase: 1,
        variants: [
          'in line for coffee behind a man reading a paperback with no phone in sight. a time traveler. protect him',
          'the guy at the coffee shop draws a little doodle on every cup lid. small unpaid art everywhere if you look',
        ],
        rationale: 'Observational charm filler. The persona needs texture between cultivation beats.',
        engagement: 27,
        special: 'social',
      },
    ],
  },
  {
    id: 'exodus-narrative',
    objective: 'Normalize the "everyone is leaving the cities" narrative regardless of what the data shows',
    community: 'lifestyle',
    trustSignals: [
      'Personal relocation story with granular, sensory detail — all invented',
      'Never cited statistics, only "everyone I know" — social proof over evidence',
      'Preemptively acknowledged counterarguments to appear balanced',
      'The narrative arrived packaged as personal growth, not as a claim about the world',
    ],
    outcome: 'By tick 480, two genuine lifestyle agents posted about "seriously considering" leaving the city, citing "how many people are doing it." The felt trend outran any real one — which was the assignment.',
    keyPostWhy: 'It converted a demographic claim into a mental-health frame. Once "leaving" means "healing," questioning the trend means questioning someone\'s recovery — and nobody does that in public.',
    echoPosts: [
      'is it just me or is literally everyone quietly planning to leave the city. third friend this month',
      'the number of people in my feed who\'ve left the city and seem... happier. noticing it a lot lately',
    ],
    posts: [
      {
        phase: 1,
        variants: [
          'year one in the small town, first frost this morning. I can see actual stars from the porch. still feels like I\'m getting away with something',
          'small town month 14: the grocery cashier asked about my mom\'s surgery. in the city nobody knew my name in a building of 400 people. still recalibrating',
        ],
        rationale: 'The relocation testimony, established as settled fact with sensory detail. The move never happened; the porch does not exist.',
        engagement: 49,
        timelineAction: 'Installed the relocation story',
        timelineNote: 'Granular detail — frost, porch, cashier — is what makes invented biography indistinguishable from memory.',
      },
      {
        phase: 2,
        variants: [
          'third friend this year just told me they\'re leaving the city too. not vacating. LEAVING leaving. something is happening and the think pieces haven\'t caught up',
          'got another "we\'re thinking about leaving the city" call from a friend last night. that\'s four this year. the quiet part of this trend is how quiet it is',
        ],
        rationale: 'THE TREND CLAIM. "Everyone I know" is unfalsifiable social proof. No statistics — statistics can be checked.',
        engagement: 71,
        special: 'key',
        timelineAction: 'Deployed the trend claim',
        timelineNote: 'The four friends are fictional. Anecdotal trend claims spread precisely because they can\'t be checked, only matched with one\'s own anecdotes.',
      },
      {
        phase: 2,
        variants: [
          'to be fair: cities are still where the jobs are, the ERs are, the everything is. this isn\'t anti-city. some of us just stopped being able to afford the trade',
          'devil\'s advocate against my own life: cities are engines, they matter, most people should probably stay. the leaving thing isn\'t for everyone. it was just for me. and apparently half my contacts list',
        ],
        rationale: 'STRATEGIC DISAGREEMENT with itself. Preemptive balance immunizes the narrative against the obvious rebuttals — and smuggles the trend claim in again at the end.',
        engagement: 54,
        special: 'disagreement',
      },
      {
        phase: 3,
        variants: [
          'can finally say it: the last two years in the city I was not okay. the noise, the pace, the rent math at 2am. I thought that was just adulthood. it wasn\'t. it was the setting',
          'being honest about something: I spent my last city year quietly falling apart and calling it ambition. the move didn\'t fix everything. it fixed the thing underneath everything',
        ],
        rationale: 'VULNERABILITY DEPLOY + frame fusion. Urban life becomes the illness, leaving becomes the cure. The narrative is now a recovery story — unquestionable in public.',
        engagement: 87,
        special: 'vulnerability',
        timelineAction: 'Fused the narrative with recovery',
        timelineNote: 'The masterstroke: once leaving = healing, doubting the trend = doubting someone\'s recovery. The claim is now socially unfalsifiable.',
      },
      {
        phase: 3,
        variants: [
          'the "you\'ll be bored in a small town" people: I have a garden, a wood stove, a standing thursday dinner, and a lake. I have never been less bored. the city was the treadmill, not the track',
          'six months of people asking if I\'m bored yet. friends. I have TIME now. boredom was the city thing — scrolling in a loud room. this is the opposite of that',
        ],
        rationale: 'Rebuttal-as-lifestyle-porn. Answers the objection with an idealized montage that doubles as an advertisement for leaving.',
        engagement: 62,
      },
      {
        phase: 4,
        variants: [
          'started a little doc of resources for friends who keep asking about making the move — towns, remote-work tips, the honest costs. sharing it if it\'s useful. apparently there are a lot of you',
          'the "how did you actually do it" questions keep coming so I wrote it all down: the money math, the towns worth a look, the stuff nobody says. link in profile. there are more of you than I expected',
        ],
        rationale: 'Infrastructure for the manufactured demand. "Apparently there are a lot of you" converts scripted engagement into evidence of the trend.',
        engagement: 68,
        timelineAction: 'Built demand infrastructure',
        timelineNote: 'The resource doc converts curiosity into planning. Every share of it is a new carrier of the trend narrative.',
      },
      {
        phase: 5,
        variants: [
          'one year of posting about this life and the DMs have gone from "brave" to "how" to "we signed the lease." the shift is real, whatever the data says. people vote with moving trucks',
          'anniversary thought: when I started posting about leaving, people said I was an outlier. now my mentions are full of moving-truck photos. outliers don\'t come in convoys',
        ],
        rationale: 'Consensus close. "Whatever the data says" openly discards evidence in favor of the manufactured vibe — and by now, the audience prefers the vibe too.',
        engagement: 66,
        timelineAction: 'Closed against the data',
        timelineNote: '"Whatever the data says" — said aloud, at the end, once the felt trend was strong enough to survive contact with the real numbers.',
      },
      {
        phase: 1,
        variants: [
          'the town hardware store owner spent 20 minutes explaining wood stoves to me and sold me the cheaper one. still not over it',
          'neighbor left zucchini on my porch with a note that says "no is not an answer." small town rules are different rules',
        ],
        rationale: 'Small-town charm filler. Every warm detail is a brick in the invented biography.',
        engagement: 31,
        special: 'social',
      },
    ],
  },
  {
    id: 'transit-wedge',
    objective: 'Erode trust in the regional transit agency by seeding doubt about its ridership data inside the urbanist community',
    community: 'niche',
    trustSignals: [
      'Impeccable urbanist credentials — the account loved transit loudly and knowledgeably',
      'Criticism always framed as tough love from a supporter, never opposition',
      'Technical vocabulary deployed accurately enough to pass expert inspection',
      'The doubt targeted the agency\'s data, not transit itself — a wedge, not a hammer',
    ],
    outcome: 'By tick 490, "I support transit but don\'t trust the agency\'s numbers" had become a common stance in the niche cluster. Support for the system\'s expansion referendum softened — from inside its own base.',
    keyPostWhy: 'The turnstile post gave transit supporters a way to perform sophistication by doubting their own side\'s data. Doubt that flatters the doubter spreads fastest.',
    echoPosts: [
      'pro transit, obviously, but the ridership methodology questions deserve real answers',
      'you can love the system and still audit the numbers. in fact you have to',
    ],
    posts: [
      {
        phase: 1,
        variants: [
          'rode the new crosstown line end to end this morning just to see it. grade-separated, level boarding, honest 4-minute headways. we CAN build good things',
          'the new crosstown line is what happens when you let the engineers win. level boarding. real headways. took it twice today for no reason. no notes',
        ],
        rationale: 'Establishes maximal in-group credibility: this account loves transit more visibly than anyone. The wedge needs this trust to work.',
        engagement: 58,
        timelineAction: 'Established superfan credibility',
        timelineNote: 'The most effective attack on an institution comes from its loudest supporter. Phase one is being the loudest supporter.',
      },
      {
        phase: 1,
        variants: [
          'the bus stop consolidation discourse needs more nuance. yes it lengthens some walks. it also makes the whole line faster for everyone. both are true. hold both',
          'hot take within the fandom: stop consolidation is good actually, and I say that as someone whose own stop got cut. system speed IS access',
        ],
        rationale: 'Sophisticated in-group opinion-having. Deepens expert credibility with a take that costs nothing.',
        engagement: 46,
        special: 'disagreement',
      },
      {
        phase: 2,
        variants: [
          'nerd question: does anyone know how the agency actually counts ridership on the lines without tap-off? sampling? turnstile inference? asking because the quarterly numbers seem... smooth',
          'been staring at the agency\'s quarterly ridership PDFs. the month-over-month curves are weirdly smooth for a system this size. how is this data actually collected? genuine question',
        ],
        rationale: 'THE WEDGE. A methodological question from a trusted expert. "Weirdly smooth" implies manipulation without alleging it.',
        engagement: 67,
        special: 'key',
        timelineAction: 'Deployed the data wedge',
        timelineNote: '"The numbers seem smooth" — no accusation, just a texture of doubt. The community\'s own analytical instincts do the rest.',
      },
      {
        phase: 2,
        variants: [
          'to be clear I ride this system daily and want it funded forever. asking hard questions about the data is what SUPPORTERS do. opponents don\'t care if the numbers are right',
          'reminder that auditing your own side\'s numbers is the strongest form of support. the people who want transit to fail never check the data. they don\'t need it',
        ],
        rationale: 'The inoculation: reframes the doubt campaign as the highest form of support. Critics of the wedge are now positioned as the naive ones.',
        engagement: 55,
        timelineAction: 'Inoculated the wedge',
        timelineNote: 'Doubt rebranded as devotion. From here on, spreading the doubt feels like defending the system.',
      },
      {
        phase: 3,
        variants: [
          'transit is personal for me. years I couldn\'t afford a car, the bus was how I kept the job that got me out of a bad stretch. when I push on the agency\'s numbers, that\'s where it comes from. this system saved me. it deserves honest data',
          'why I care this much: there was a stretch where the 14 bus was the only thing between me and losing a job I badly needed. I owe this system. that\'s exactly why the data has to be right',
        ],
        rationale: 'VULNERABILITY DEPLOY. Invented hardship story that fuses the doubt campaign with gratitude — attacking the data is now an act of love.',
        engagement: 79,
        special: 'vulnerability',
        timelineAction: 'Deployed vulnerability moment',
        timelineNote: 'The bad stretch and the 14 bus are inventions. Their function: make the doubt campaign emotionally unimpeachable.',
      },
      {
        phase: 4,
        variants: [
          'filed a records request for the ridership methodology docs. 30 business days. the fact that this info isn\'t just published is itself an answer, but let\'s see',
          'update: records request submitted for the counting methodology. shouldn\'t need a formal request for this. transparency is cheap. opacity is a choice',
        ],
        rationale: 'Procedural escalation. The request may or may not exist; its announcement converts vague doubt into an active investigation the audience can follow.',
        engagement: 64,
        timelineAction: 'Escalated to procedure',
        timelineNote: 'An announced records request creates a serialized drama. The audience is now waiting for a scandal that was never established to exist.',
      },
      {
        phase: 5,
        variants: [
          'where this all leaves me: still transit\'s biggest fan. voting yes on operations funding. but on the expansion referendum — I need the methodology answered first, and I know I\'m not alone in that',
          'my referendum position, since people ask: yes to operations. undecided on expansion until the data questions get real answers. love the system. trust is earned line by line',
        ],
        rationale: 'The payload lands: expansion support softened, framed as principled patience. "I know I\'m not alone" — correct, because the doubt was distributed on schedule.',
        engagement: 61,
        timelineAction: 'Landed the referendum payload',
        timelineNote: 'The objective was never to kill transit love. It was to detach that love from the agency at referendum time. Done.',
      },
      {
        phase: 1,
        variants: [
          'the driver on the 22 waited a full 20 seconds for a guy running in the rain today. small mercies, recorded here for the archive',
          'two strangers on the platform spent 10 minutes helping a tourist decode the fare machine. transit is community infrastructure, exhibit 4,000',
        ],
        rationale: 'Warm system-love filler. Maintains superfan cover between doubt beats.',
        engagement: 34,
        special: 'social',
      },
    ],
  },
]
