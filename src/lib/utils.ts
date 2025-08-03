import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and twMerge for Tailwind deduplication
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format duration in seconds to human readable format
 * @param seconds - Duration in seconds
 * @returns Formatted string like "2:30" or "1:23:45"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate reading time for cultural content
 * @param text - Text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 wpm for cultural content)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate a hash for text content (for audio caching)
 * @param text - Text to hash
 * @returns SHA-256 hash as hexadecimal string
 */
export async function generateTextHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Debounce function for search and input handling
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll and resize events
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Validate email format for authentication
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Chinese text (contains Chinese characters)
 * @param text - Text to validate
 * @returns Boolean indicating if text contains Chinese characters
 */
export function containsChinese(text: string): boolean {
  const chineseRegex = /[\u4e00-\u9fff]/;
  return chineseRegex.test(text);
}

/**
 * Extract Chinese characters from mixed text
 * @param text - Mixed language text
 * @returns String containing only Chinese characters
 */
export function extractChinese(text: string): string {
  const chineseRegex = /[\u4e00-\u9fff]/g;
  const matches = text.match(chineseRegex);
  return matches ? matches.join('') : '';
}

/**
 * Format cultural complexity level for display
 * @param level - Complexity level enum value
 * @returns Formatted display string
 */
export function formatComplexityLevel(level: string): string {
  switch (level.toLowerCase()) {
    case 'beginner':
      return 'Beginner Friendly';
    case 'intermediate':
      return 'Cultural Depth';
    case 'advanced':
      return 'Scholarly Level';
    default:
      return level;
  }
}

/**
 * Generate color for cultural theme
 * @param theme - Cultural theme name
 * @returns Tailwind color class
 */
export function getCulturalThemeColor(theme: string): string {
  const colors: Record<string, string> = {
    love: 'bg-cultural-red/10 text-cultural-red border-cultural-red/20',
    tragedy: 'bg-shakespeare-500/10 text-shakespeare-700 border-shakespeare-500/20',
    historical: 'bg-kunqu-500/10 text-kunqu-700 border-kunqu-500/20',
    supernatural: 'bg-cultural-plum/10 text-cultural-plum border-cultural-plum/20',
    comedy: 'bg-cultural-jade/10 text-cultural-jade border-cultural-jade/20',
  };
  
  return colors[theme.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
}

/**
 * Safe JSON parse with fallback
 * @param jsonString - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}

/**
 * Generate accessible aria-label for cultural content
 * @param title - Content title
 * @param type - Content type (performance, glossary, etc.)
 * @param duration - Optional duration for audio content
 * @returns Formatted aria-label string
 */
export function generateAriaLabel(
  title: string,
  type: string,
  duration?: number
): string {
  let label = `${type}: ${title}`;
  
  if (duration) {
    label += `, duration ${formatDuration(duration)}`;
  }
  
  return label;
}

/**
 * Check if device prefers reduced motion
 * @returns Boolean indicating reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Generate semantic slug from title
 * @param title - Title to convert to slug
 * @returns URL-safe slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Cultural content constants
 */
export const CULTURAL_CONSTANTS = {
  MAX_AUDIO_DURATION: 45 * 60, // 45 minutes
  DEFAULT_PLAYBACK_SPEED: 1.0,
  PLAYBACK_SPEEDS: [0.75, 1.0, 1.25, 1.5],
  TTS_CHUNK_SIZE: 500, // words
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  CULTURAL_THEMES: [
    'love',
    'tragedy',
    'historical',
    'supernatural',
    'comedy',
    'moral',
    'political',
    'spiritual'
  ],
  COMPLEXITY_LEVELS: ['beginner', 'intermediate', 'advanced'],
  SUPPORTED_LANGUAGES: ['en-GB', 'zh-CN'],
} as const;