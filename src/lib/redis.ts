import Redis from 'ioredis';

// Singleton pattern for Redis connection
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

// Redis configuration for cultural content caching
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
  
  // Connection health monitoring
  connectTimeout: 10000,
  commandTimeout: 5000,
  
  // Optimize for cultural audio caching
  maxMemoryPolicy: 'allkeys-lru',
  
  // Development vs Production settings
  ...(process.env.NODE_ENV === 'production' && {
    enableReadyCheck: true,
    maxRetriesPerRequest: 2,
  }),
};

export const redis = globalForRedis.redis ?? new Redis(redisConfig);

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Error handling for Redis connection
redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

// Cultural content caching utilities
export class CulturalCache {
  
  /**
   * Cache keys for different types of cultural content
   */
  static keys = {
    audioCache: (textHash: string) => `audio:${textHash}`,
    performanceList: (filters: string) => `performances:${filters}`,
    glossaryTerms: (category: string) => `glossary:${category}`,
    userProgress: (userId: string) => `progress:${userId}`,
    searchResults: (query: string) => `search:${query}`,
    culturalContext: (performanceId: string) => `context:${performanceId}`,
    ttsGeneration: (textHash: string) => `tts:generating:${textHash}`,
  };

  /**
   * Cache TTL values for different content types
   */
  static ttl = {
    audioMetadata: 24 * 60 * 60, // 24 hours
    performanceList: 6 * 60 * 60, // 6 hours
    glossaryTerms: 12 * 60 * 60, // 12 hours
    userProgress: 5 * 60, // 5 minutes
    searchResults: 15 * 60, // 15 minutes
    culturalContext: 4 * 60 * 60, // 4 hours
    ttsGeneration: 10 * 60, // 10 minutes (for generation locks)
  };

  /**
   * Cache audio metadata for quick retrieval
   */
  static async cacheAudioMetadata(
    textHash: string,
    metadata: {
      audioUrl: string;
      durationSeconds: number;
      voice: string;
      speed: number;
      cached: boolean;
    }
  ): Promise<void> {
    const key = this.keys.audioCache(textHash);
    await redis.setex(key, this.ttl.audioMetadata, JSON.stringify(metadata));
  }

  /**
   * Get cached audio metadata
   */
  static async getAudioMetadata(textHash: string): Promise<any | null> {
    const key = this.keys.audioCache(textHash);
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Cache performance list with filters
   */
  static async cachePerformanceList(
    filters: any,
    performances: any[]
  ): Promise<void> {
    const filterKey = Buffer.from(JSON.stringify(filters)).toString('base64');
    const key = this.keys.performanceList(filterKey);
    await redis.setex(key, this.ttl.performanceList, JSON.stringify(performances));
  }

  /**
   * Get cached performance list
   */
  static async getCachedPerformanceList(filters: any): Promise<any[] | null> {
    const filterKey = Buffer.from(JSON.stringify(filters)).toString('base64');
    const key = this.keys.performanceList(filterKey);
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Cache user progress for quick dashboard loading
   */
  static async cacheUserProgress(
    userId: string,
    progressData: any
  ): Promise<void> {
    const key = this.keys.userProgress(userId);
    await redis.setex(key, this.ttl.userProgress, JSON.stringify(progressData));
  }

  /**
   * Get cached user progress
   */
  static async getCachedUserProgress(userId: string): Promise<any | null> {
    const key = this.keys.userProgress(userId);
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Cache search results to improve search performance
   */
  static async cacheSearchResults(
    query: string,
    results: any[]
  ): Promise<void> {
    const queryHash = Buffer.from(query.toLowerCase()).toString('base64');
    const key = this.keys.searchResults(queryHash);
    await redis.setex(key, this.ttl.searchResults, JSON.stringify(results));
  }

  /**
   * Get cached search results
   */
  static async getCachedSearchResults(query: string): Promise<any[] | null> {
    const queryHash = Buffer.from(query.toLowerCase()).toString('base64');
    const key = this.keys.searchResults(queryHash);
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Cache cultural context for performance pages
   */
  static async cacheCulturalContext(
    performanceId: string,
    context: any
  ): Promise<void> {
    const key = this.keys.culturalContext(performanceId);
    await redis.setex(key, this.ttl.culturalContext, JSON.stringify(context));
  }

  /**
   * Get cached cultural context
   */
  static async getCachedCulturalContext(performanceId: string): Promise<any | null> {
    const key = this.keys.culturalContext(performanceId);
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Set TTS generation lock to prevent duplicate generations
   */
  static async setTTSGenerationLock(textHash: string): Promise<boolean> {
    const key = this.keys.ttsGeneration(textHash);
    const result = await redis.set(key, 'generating', 'EX', this.ttl.ttsGeneration, 'NX');
    return result === 'OK';
  }

  /**
   * Check if TTS generation is in progress
   */
  static async isTTSGenerating(textHash: string): Promise<boolean> {
    const key = this.keys.ttsGeneration(textHash);
    const exists = await redis.exists(key);
    return exists === 1;
  }

  /**
   * Release TTS generation lock
   */
  static async releaseTTSGenerationLock(textHash: string): Promise<void> {
    const key = this.keys.ttsGeneration(textHash);
    await redis.del(key);
  }

  /**
   * Invalidate cached content when cultural content is updated
   */
  static async invalidateCulturalContent(performanceId: string): Promise<void> {
    const pattern = `*${performanceId}*`;
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * Invalidate user-specific cache
   */
  static async invalidateUserCache(userId: string): Promise<void> {
    const patterns = [
      this.keys.userProgress(userId),
      `bookmark:*:${userId}`,
      `recommendation:${userId}*`,
    ];

    for (const pattern of patterns) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }
  }

  /**
   * Get cache statistics for monitoring
   */
  static async getCacheStats(): Promise<{
    totalKeys: number;
    memoryUsage: string;
    hitRate: number;
    audioCache: number;
    performanceCache: number;
    userCache: number;
  }> {
    const info = await redis.info('memory');
    const dbSize = await redis.dbsize();
    
    // Count different types of cached content
    const [audioCacheKeys, performanceCacheKeys, userCacheKeys] = await Promise.all([
      redis.keys('audio:*'),
      redis.keys('performances:*'),
      redis.keys('progress:*'),
    ]);

    // Parse memory usage from info
    const memoryMatch = info.match(/used_memory_human:(.+)/);
    const memoryUsage = memoryMatch ? memoryMatch[1].trim() : 'unknown';

    return {
      totalKeys: dbSize,
      memoryUsage,
      hitRate: 0, // Would need to implement hit rate tracking
      audioCache: audioCacheKeys.length,
      performanceCache: performanceCacheKeys.length,
      userCache: userCacheKeys.length,
    };
  }

  /**
   * Clear all cache (use with caution)
   */
  static async clearAllCache(): Promise<void> {
    await redis.flushdb();
  }

  /**
   * Health check for Redis connection
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const result = await redis.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }
}

export default redis;