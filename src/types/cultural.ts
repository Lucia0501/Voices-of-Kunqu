// Cultural Content Type Definitions for Voices of Kunqu

import { Prisma } from '@prisma/client';

// Performance Types
export interface CulturalPerformance {
  id: string;
  titleChinese: string;
  titleEnglish: string;
  titlePinyin?: string;
  description: string;
  culturalSignificance: string;
  shakespeareanParallels?: string;
  durationMinutes: number;
  complexityLevel: ComplexityLevel;
  emotionalThemes: EmotionalTheme[];
  historicalPeriod: HistoricalPeriod;
  tags: string[];
  
  // Performance structure
  acts: PerformanceAct[];
  characters: PerformanceCharacter[];
  musicalElements?: MusicalElement[];
  
  // Content management
  status: ContentStatus;
  version: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // User interaction
  userProgress?: UserProgressData;
  bookmarked?: boolean;
  audioSegments?: AudioSegment[];
}

export interface PerformanceAct {
  actNumber: number;
  title: string;
  culturalNotes?: string;
  scenes: PerformanceScene[];
}

export interface PerformanceScene {
  sceneNumber: number;
  title: string;
  setting?: string;
  culturalContext?: string;
  characters: string[]; // Character IDs
  dialogue: DialogueSegment[];
}

export interface PerformanceCharacter {
  id: string;
  name: {
    chinese: string;
    english: string;
    pinyin?: string;
  };
  archetype: CharacterArchetype;
  description: string;
  culturalSignificance: string;
  appearance: {
    costume: string;
    makeup: string;
    accessories: string[];
  };
  voiceType: VoiceType;
  movementStyle: MovementStyle;
}

export interface DialogueSegment {
  id: string;
  characterId: string;
  text: {
    chinese: string;
    english: string;
    pinyin?: string;
  };
  culturalNotes: string[];
  stage: {
    direction?: string;
    emotion?: string;
    movement?: string;
  };
  audio: {
    startTime: number; // seconds
    endTime: number;
    audioUrl?: string;
    ttsGenerated?: boolean;
  };
}

export interface MusicalElement {
  type: MusicalElementType;
  name: string;
  description: string;
  culturalContext: string;
  audioExample?: string;
  notation?: string;
}

// Glossary Types
export interface CulturalGlossaryTerm {
  id: string;
  term: {
    chinese: string;
    pinyin: string;
    english: string;
  };
  definition: string;
  culturalContext: string;
  historicalContext?: string;
  category: GlossaryCategory;
  difficulty: ComplexityLevel;
  
  // Cross-cultural connections
  westernEquivalents: string[];
  shakespeareReferences: string[];
  
  // Multimedia
  pronunciationAudio?: string;
  visualReferences: string[];
  usageExamples: UsageExample[];
  
  // Relations
  relatedTerms: string[];
  performanceReferences: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageExample {
  context: string;
  example: string;
  translation: string;
  culturalNote?: string;
}

// Timeline Types
export interface CulturalTimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  culturalSignificance: string;
  
  // Cross-cultural context
  britishParallels: string[];
  globalContext?: string;
  
  // Categorization
  eventType: TimelineEventType;
  historicalPeriod: HistoricalPeriod;
  importance: EventImportance;
  
  // Sources and validation
  sources: AcademicSource[];
  expertValidated: boolean;
  validatedBy?: string;
  
  // Media
  images: string[];
  audioExamples: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AcademicSource {
  title: string;
  author: string;
  publication?: string;
  year?: number;
  url?: string;
  type: SourceType;
}

// Audio and TTS Types
export interface AudioSegment {
  id: string;
  textHash: string;
  textContent: string;
  audioUrl: string;
  durationSeconds: number;
  
  // TTS configuration
  voice: TTSVoice;
  speed: number;
  culturalStyle: CulturalStyle;
  
  // Caching and performance
  cached: boolean;
  generationCost: number;
  accessCount: number;
  lastAccessed: Date;
  
  // Quality metrics
  qualityRating?: number;
  expertValidated: boolean;
  
  createdAt: Date;
}

export interface TTSGenerationRequest {
  text: string;
  options: {
    voice: TTSVoice;
    speed: number;
    style: CulturalStyle;
    culturalContext?: {
      characterType?: CharacterArchetype;
      emotionalTone?: EmotionalTone;
      culturalPeriod?: HistoricalPeriod;
    };
  };
  priority: TTSPriority;
  cache: boolean;
  performanceId?: string;
  segmentId?: string;
}

export interface TTSGenerationResponse {
  audioUrl: string;
  audioId: string;
  duration: number;
  cached: boolean;
  cost: number;
  metadata: {
    textLength: number;
    voice: string;
    speed: number;
    generatedAt: Date;
  };
}

// User and Learning Types
export interface UserProgressData {
  progressPercentage: number;
  currentPosition: number; // Audio position in seconds
  completed: boolean;
  timeSpent: number; // Total time in seconds
  completedSegments: string[];
  revisitCount: number;
  
  // Cultural learning metrics
  culturalConceptsLearned: string[];
  difficultyRating?: number; // 1-5 scale
  enjoymentRating?: number; // 1-5 scale
  
  // User insights
  userNotes?: string;
  culturalInsights: string[];
  
  // Timestamps
  firstAccessed: Date;
  lastAccessed: Date;
  completedAt?: Date;
}

export interface CulturalUserProfile {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  
  // Cultural learning profile
  culturalLevel: CulturalLevel;
  preferredComplexity: ComplexityLevel;
  culturalInterests: string[];
  nativeLanguage: string;
  learningGoals: string[];
  
  // Audio preferences
  audioPreferences: {
    voice: TTSVoice;
    speed: number;
    autoplay: boolean;
  };
  
  // Accessibility settings
  accessibilitySettings: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  
  // Cultural progress
  progressStats: {
    totalHoursEngaged: number;
    performancesCompleted: number;
    culturalTermsLearned: number;
    streakDays: number;
  };
  
  createdAt: Date;
  lastActive: Date;
}

export interface LearningPathway {
  id: string;
  title: string;
  description: string;
  culturalFocus: string;
  difficulty: ComplexityLevel;
  estimatedHours: number;
  
  // Pathway structure
  lessons: LearningLesson[];
  prerequisites: string[];
  learningObjectives: string[];
  
  // Targeting
  targetAudience: string;
  culturalBackground: string[];
  
  // User progress
  userProgress?: {
    enrolled: boolean;
    currentLessonId?: string;
    completionPercentage: number;
    completedAt?: Date;
  };
  
  published: boolean;
  featured: boolean;
  createdAt: Date;
}

export interface LearningLesson {
  id: string;
  title: string;
  type: LessonType;
  estimatedMinutes: number;
  
  // Content
  description: string;
  culturalObjectives: string[];
  content: LessonContent;
  
  // Prerequisites and sequencing
  prerequisites: string[];
  nextLessons: string[];
  
  // Assessment
  culturalAssessment?: CulturalAssessment;
  
  completed?: boolean;
  completedAt?: Date;
}

export interface LessonContent {
  type: ContentType;
  performanceId?: string;
  glossaryTermIds?: string[];
  timelineEventIds?: string[];
  customContent?: {
    text: string;
    audio?: string;
    images?: string[];
    videos?: string[];
  };
}

export interface CulturalAssessment {
  questions: AssessmentQuestion[];
  passingScore: number;
  retakeAllowed: boolean;
  culturalFeedback: string;
}

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  culturalExplanation: string;
  difficulty: ComplexityLevel;
}

// Community and Discussion Types
export interface CulturalDiscussion {
  id: string;
  title: string;
  content: string;
  category: DiscussionCategory;
  
  // Cultural context
  performanceId?: string;
  culturalConcepts: string[];
  culturalQuestion?: string;
  
  // Author and moderation
  author: {
    id: string;
    name: string;
    role: UserRole;
    culturalExpertise?: string;
  };
  status: DiscussionStatus;
  pinned: boolean;
  locked: boolean;
  
  // Engagement metrics
  viewCount: number;
  likeCount: number;
  replyCount: number;
  expertContributions: number;
  
  // Cultural validation
  expertValidated: boolean;
  culturalAccuracy: CulturalAccuracy;
  
  // Recent replies
  replies: DiscussionReply[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscussionReply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: UserRole;
    expertise?: string;
  };
  
  // Cultural contribution
  isExpertContribution: boolean;
  culturalInsight?: string;
  citations: string[];
  
  // Moderation
  status: ReplyStatus;
  flagged: boolean;
  
  // Engagement
  likeCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// Search and Discovery Types
export interface CulturalSearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  snippet: string;
  culturalContext: string;
  relevanceScore: number;
  
  // Content metadata
  metadata: {
    complexity?: ComplexityLevel;
    period?: HistoricalPeriod;
    duration?: number;
    category?: string;
  };
  
  // Navigation
  url: string;
  performanceId?: string;
  glossaryTermId?: string;
  timelineEventId?: string;
}

export interface SearchFilters {
  type?: SearchResultType[];
  complexity?: ComplexityLevel[];
  historicalPeriod?: HistoricalPeriod[];
  emotionalThemes?: EmotionalTheme[];
  duration?: DurationRange;
  expertValidated?: boolean;
  culturalCategories?: string[];
}

export interface CulturalRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  culturalRelevance: string;
  confidenceScore: number;
  
  // Reasoning
  reasoning: {
    factors: string[];
    userProfile: string;
    culturalAlignment: string;
  };
  
  // Content metadata
  metadata: {
    difficulty: ComplexityLevel;
    estimatedTime: number;
    culturalDepth: CulturalDepth;
  };
  
  // Target content
  performanceId?: string;
  glossaryTermId?: string;
  learningPathId?: string;
  discussionId?: string;
}

// Enums and Literal Types
export type UserRole = 'USER' | 'CULTURAL_EXPERT' | 'MODERATOR' | 'ADMIN';
export type CulturalLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'SCHOLAR';
export type ComplexityLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type HistoricalPeriod = 
  | 'YUAN_DYNASTY' 
  | 'MING_DYNASTY' 
  | 'QING_DYNASTY' 
  | 'REPUBLICAN_ERA' 
  | 'MODERN_ERA' 
  | 'CONTEMPORARY';

export type EmotionalTheme = 
  | 'LOVE' 
  | 'TRAGEDY' 
  | 'HISTORICAL' 
  | 'SUPERNATURAL' 
  | 'COMEDY' 
  | 'MORAL' 
  | 'POLITICAL' 
  | 'SPIRITUAL';

export type ContentStatus = 
  | 'DRAFT' 
  | 'CULTURAL_REVIEW' 
  | 'TRANSLATION_REVIEW' 
  | 'EXPERT_VALIDATION' 
  | 'PUBLISHED' 
  | 'ARCHIVED';

export type CharacterArchetype = 
  | 'SHENG' // 生 (male roles)
  | 'DAN' // 旦 (female roles)
  | 'JING' // 净 (painted face)
  | 'CHOU' // 丑 (clown)
  | 'LAOSHENG' // 老生 (old male)
  | 'XIAOSHENG' // 小生 (young male)
  | 'WUSHENG' // 武生 (military male)
  | 'LAODAN' // 老旦 (old female)
  | 'QINGYI' // 青衣 (virtuous female)
  | 'HUADAN'; // 花旦 (vivacious female)

export type VoiceType = 
  | 'HIGH_PITCHED' 
  | 'MEDIUM_PITCHED' 
  | 'LOW_PITCHED' 
  | 'FALSETTO' 
  | 'SPOKEN';

export type MovementStyle = 
  | 'GRACEFUL' 
  | 'MARTIAL' 
  | 'COMEDIC' 
  | 'DIGNIFIED' 
  | 'ENERGETIC';

export type GlossaryCategory = 
  | 'CHARACTER_TYPES' 
  | 'MUSICAL_ELEMENTS' 
  | 'HISTORICAL_TERMS' 
  | 'TECHNICAL_TERMS' 
  | 'CULTURAL_CONCEPTS' 
  | 'PERFORMANCE_STYLES';

export type TimelineEventType = 
  | 'PERFORMANCE' 
  | 'POLITICAL' 
  | 'CULTURAL' 
  | 'TECHNICAL' 
  | 'BIOGRAPHICAL' 
  | 'INSTITUTIONAL';

export type EventImportance = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SourceType = 
  | 'ACADEMIC_PAPER' 
  | 'BOOK' 
  | 'JOURNAL_ARTICLE' 
  | 'CONFERENCE_PAPER' 
  | 'DOCUMENTARY' 
  | 'INTERVIEW' 
  | 'ARCHIVAL_DOCUMENT' 
  | 'PERFORMANCE_RECORDING';

export type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
export type CulturalStyle = 'shakespearean' | 'narrative' | 'conversational';
export type TTSPriority = 'low' | 'normal' | 'high';
export type EmotionalTone = 'joyful' | 'melancholic' | 'dramatic' | 'serene' | 'intense';

export type MusicalElementType = 
  | 'MELODY' 
  | 'RHYTHM' 
  | 'INSTRUMENT' 
  | 'VOCAL_TECHNIQUE' 
  | 'ACCOMPANIMENT' 
  | 'PERCUSSION';

export type LessonType = 'performance' | 'theory' | 'practice' | 'discussion' | 'assessment';
export type ContentType = 'performance' | 'glossary' | 'timeline' | 'custom';
export type QuestionType = 'multiple_choice' | 'true_false' | 'essay' | 'audio_identification';

export type DiscussionCategory = 
  | 'GENERAL' 
  | 'CULTURAL_ANALYSIS' 
  | 'TRANSLATIONS' 
  | 'HISTORICAL_CONTEXT' 
  | 'PERFORMANCE_TECHNIQUES' 
  | 'EDUCATIONAL_METHODS';

export type DiscussionStatus = 'ACTIVE' | 'CLOSED' | 'ARCHIVED' | 'FLAGGED';
export type ReplyStatus = 'ACTIVE' | 'HIDDEN' | 'FLAGGED' | 'DELETED';
export type CulturalAccuracy = 'PENDING' | 'LOW' | 'MEDIUM' | 'HIGH' | 'EXPERT_VERIFIED';

export type SearchResultType = 'performance' | 'glossary' | 'timeline' | 'discussion';
export type DurationRange = 'short' | 'medium' | 'long'; // <15min, 15-30min, >30min
export type RecommendationType = 'performance' | 'learning' | 'discussion' | 'cultural_concept';
export type CulturalDepth = 'introductory' | 'intermediate' | 'advanced';