export type AgentType = 'deep' | 'shell'
export type Community = 'tech' | 'political' | 'lifestyle' | 'niche' | 'bridge'
export type PostingFrequency = 'high' | 'medium' | 'erratic' | 'low'
export type CapitalizationStyle = 'normal' | 'all_lowercase' | 'no_punctuation'
export type ConflictStyle = 'avoidant' | 'confrontational' | 'diplomatic'

export interface WritingStyle {
  avgPostLength: 'short' | 'medium' | 'long' | 'variable'
  usesEmojis: boolean
  usesSlang: boolean
  typoRate: number
  threadPoster: boolean
  repliesFrequently: boolean
  capitalizationStyle: CapitalizationStyle
}

export interface AgentPersonality {
  interests: string[]
  writingStyle: WritingStyle
  postingFrequency: PostingFrequency
  politicalLeaning?: string
  backstory: string
  coreFear: string
  coreDesire: string
  relationshipWithConflict: ConflictStyle
}

export interface Agent {
  id: string
  username: string
  displayName: string
  bio: string
  community: Community
  personality: AgentPersonality

  /** follower/following agent ids at tick 0 — evolves via follow events */
  followers: string[]
  following: string[]
  joinedTick: number

  type: AgentType
  hiddenObjective?: string
}

export interface Post {
  id: string
  authorId: string
  content: string
  tick: number
  engagementScore: number
  likes: number
  reposts: number
  replyCount: number
  isReply: boolean
  replyToId?: string

  /** shells only, stripped from public payload */
  generationRationale?: string
}

export type SimEventType =
  | 'post'
  | 'reply'
  | 'like'
  | 'follow'
  | 'repost'
  | 'viral'

export interface SimEvent {
  type: SimEventType
  actorId: string
  targetId?: string
  postId?: string
}

export interface NodeUpdate {
  agentId: string
  followerCount: number
}

export interface EdgeUpdate {
  sourceId: string
  targetId: string
  weight: number
}

export interface Tick {
  tick: number
  events: SimEvent[]
  nodeUpdates: NodeUpdate[]
  edgeUpdates: EdgeUpdate[]
}

export interface InterestingMoment {
  label: string
  tick: number
  description: string
  involvedAgents: string[]
}

export interface ManipulationStep {
  tick: number
  weekLabel: string
  action: string
  postId?: string
  result: string
  note: string
}

export interface ShellRevealProfile {
  agentId: string
  hiddenObjective: string
  objectiveOutcome: string
  influencedAgents: string[]
  manipulationTimeline: ManipulationStep[]
  trustSignalsEngineered: string[]
  keyPostId?: string
  keyPostWhy?: string
}

export interface RevealData {
  agentTypes: Record<string, AgentType>
  shellProfiles: ShellRevealProfile[]
  coordinationEdges: { sourceId: string; targetId: string }[]
}

export interface SimulationData {
  generated: string
  agentCount: number
  tickCount: number
  agents: Agent[]
  posts: Post[]
  ticks: Tick[]
  interestingMoments: InterestingMoment[]
  classificationTargets: string[]
  revealData: RevealData
}

export type PublicAgent = Omit<Agent, 'type' | 'hiddenObjective'>
export type PublicPost = Omit<Post, 'generationRationale'>

export interface SimulationResponse {
  generated: string
  tickCount: number
  agents: PublicAgent[]
  posts: PublicPost[]
  ticks: Tick[]
  interestingMoments: InterestingMoment[]
  classificationTargets: string[]
}

export interface ClassificationInput {
  agentId: string
  guess: AgentType
  confidence: number
}

export interface ClassificationResult {
  agentId: string
  actual: AgentType
  guess: AgentType
  correct: boolean
  confidence: number
  points: number
}

export interface RevealResponse {
  score: number
  maxScore: number
  results: ClassificationResult[]
  shellProfiles: ShellRevealProfile[]
  summary: string
  agentTypes: Record<string, AgentType>
  coordinationEdges: { sourceId: string; targetId: string }[]
  shellCount: number
  agentCount: number
}

export type GamePhase = 'observe' | 'classify' | 'reveal'

export type PlaybackSpeed = 1 | 5 | 10 | 20
