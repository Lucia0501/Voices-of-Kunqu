export interface OperaWork {
  id: string;
  slug: string;
  title: string;
  originalTitle: string;
  description: string;
  coverImage: string;
  author: string;
  dynasty: string;
  yearWritten: string;
  culturalContext: string;
  paragraphs: Paragraph[];
  metadata: OperaMetadata;
}

export interface Paragraph {
  id: string;
  sequence: number;
  original: string;           // Chinese text
  pinyin?: string;           // Optional romanization
  shakespearean: string;     // Shakespeare-style translation
  literal: string;          // Literal translation
  audioUrl?: string;        // Cached TTS audio URL
  audioTimestamp?: number;  // Duration in seconds
  wordTimings?: WordTiming[]; // For synchronized highlighting
  metadata: ParagraphMetadata;
}

export interface WordTiming {
  word: string;
  startTime: number;        // Seconds from audio start
  endTime: number;
  confidence: number;       // TTS timing confidence
}

export interface ParagraphMetadata {
  scene?: string;
  character?: string;
  emotion?: 'joy' | 'sorrow' | 'anger' | 'contemplation';
  musicStyle?: string;      // Kunqu musical pattern
  culturalNotes?: string[];
  literaryDevices?: string[];
}

export interface OperaMetadata {
  totalParagraphs: number;
  estimatedReadingTime: number; // Minutes
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  themes: string[];
  historicalPeriod: string;
  relatedWorks: string[];
}

export interface TTSOptions {
  speed?: number;
  emotion?: 'neutral' | 'joy' | 'sorrow' | 'contemplation';
  voice?: 'british-male' | 'british-female';
}

export interface AudioCacheEntry {
  audioUrl: string;
  timestamp: number;
  size: number;
  key: string;
}