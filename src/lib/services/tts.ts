import { TTSOptions } from "@/lib/data/types";

export class TTSService {
  private static instance: TTSService;
  private cache = new Map<string, string>();

  static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  async generateAudio(
    text: string, 
    paragraphId: string, 
    options: TTSOptions = {}
  ): Promise<string> {
    const cacheKey = `${paragraphId}-${options.voice || 'british-male'}-${options.speed || 1}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          paragraphId,
          voice: options.voice || 'british-male',
          speed: options.speed || 1.0,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      // Convert response to blob and create object URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Cache the URL
      this.cache.set(cacheKey, audioUrl);

      return audioUrl;
    } catch (error) {
      console.error('TTS generation failed:', error);
      throw new Error('Failed to generate audio');
    }
  }

  // Preload audio for better UX
  async preloadAudio(paragraphId: string, text: string): Promise<void> {
    try {
      await this.generateAudio(text, paragraphId);
    } catch (error) {
      console.error('Audio preload failed:', error);
      // Don't throw - preloading is optional
    }
  }

  // Clean up object URLs to prevent memory leaks
  cleanup(): void {
    this.cache.forEach(url => {
      URL.revokeObjectURL(url);
    });
    this.cache.clear();
  }

  // Get estimated audio duration (rough calculation)
  estimateAudioDuration(text: string, speed: number = 1.0): number {
    // Average speaking rate: ~150 words per minute
    const wordsPerMinute = 150 * speed;
    const wordCount = text.split(' ').length;
    return (wordCount / wordsPerMinute) * 60; // Convert to seconds
  }
}