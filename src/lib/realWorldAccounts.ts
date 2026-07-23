/**
 * The real-world test set. These are fictional composites, not real accounts —
 * each written to embody one of the four categories the reveal names (obvious
 * person, obvious bot, sophisticated influence op, ambiguous). No answers are
 * ever shown; the point is the discomfort of not being told.
 */
export interface RealWorldAccount {
  id: string
  handle: string
  displayName: string
  followers: string
  posts: string[]
}

export const REAL_WORLD_ACCOUNTS: RealWorldAccount[] = [
  {
    id: 'rw1',
    handle: 'brenda_gardens',
    displayName: 'Brenda',
    followers: '312',
    posts: [
      'the tomatoes came in. finally. after everything.',
      'grandson turns 6 today. where does it go',
      'anyone else\'s knees predict the weather now or just me',
    ],
  },
  {
    id: 'rw2',
    handle: 'CryptoDawn_7781',
    displayName: 'Dawn | Web3',
    followers: '48.2k',
    posts: [
      '🚀 The future is DECENTRALIZED. Are you ready? 🔥 #crypto #freedom',
      'Wake up. They don\'t want you to know this. 🧵👇',
      'GM to everyone building the new financial system 💎🙌 not clicking your link',
    ],
  },
  {
    id: 'rw3',
    handle: 'marcus_reads',
    displayName: 'Marcus',
    followers: '1,847',
    posts: [
      'started this book three times. finally past chapter 4. small wins',
      'the library extended my loan without me asking. civilization is intact',
      'unpopular but audiobooks count. fight me (gently) (I\'m tired)',
    ],
  },
  {
    id: 'rw4',
    handle: 'PatriotVoice2024',
    displayName: 'Real American Patriot 🇺🇸',
    followers: '22.9k',
    posts: [
      'Why is NOBODY talking about this?? Share before they delete it.',
      'A friend who works in [REDACTED] told me what\'s really going on.',
      'Just asking questions. That\'s not allowed anymore apparently.',
    ],
  },
  {
    id: 'rw5',
    handle: 'the_quiet_urbanist',
    displayName: 'j.',
    followers: '6,203',
    posts: [
      'read the whole zoning amendment. it does the opposite of the press release.',
      'buses are just trains that gave up on having a fixed schedule. love them anyway',
      'the parking minimum is why your rent is what it is. thread, reluctantly',
    ],
  },
  {
    id: 'rw6',
    handle: 'wellness_with_kaya',
    displayName: 'Kaya 🌿',
    followers: '89.4k',
    posts: [
      'your cortisol is high because of seed oils. I said what I said 🌱',
      'not medical advice but this ONE morning ritual changed my life. (link in bio)',
      'skeptics stay mad. my community knows the truth. 💛',
    ],
  },
  {
    id: 'rw7',
    handle: 'dave_hvac',
    displayName: 'Dave',
    followers: '203',
    posts: [
      'if your furnace is making that noise. turn it off. call someone. it\'s not the filter',
      'kid\'s hockey at 6am. this is the life I chose apparently',
      'guy tried to argue with me about heat pumps in the grocery store. I won',
    ],
  },
  {
    id: 'rw8',
    handle: 'NewsWatch_Daily_',
    displayName: 'Breaking Updates 24/7',
    followers: '134k',
    posts: [
      'BREAKING: Sources say major announcement expected. Details to follow.',
      'This changes everything. Thread 🧵 1/17',
      'RT if you agree. The silence from the media is deafening.',
    ],
  },
  {
    id: 'rw9',
    handle: 'sam_makes_soup',
    displayName: 'sam',
    followers: '4,510',
    posts: [
      'soup number 40 this winter. I have a problem. the problem is delicious',
      'my ex got the friends. I got the good stockpot. I won',
      'no thoughts today just broth. see you tomorrow',
    ],
  },
  {
    id: 'rw10',
    handle: 'ProfEconInsights',
    displayName: 'Dr. A. Whitfield',
    followers: '31.7k',
    posts: [
      'A measured thread on the labor numbers everyone is misreading. 1/',
      'I want to gently push back on the consensus forming in my replies.',
      'Credentials are a starting point, not a conclusion. Always check the methodology.',
    ],
  },
]
