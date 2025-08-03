import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma Client to prevent multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  ...(process.env.DATABASE_URL && {
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }),
});

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Cultural content specific database helpers
export class CulturalDatabase {
  
  /**
   * Get performances with cultural filtering
   */
  static async getPerformances(filters: {
    complexity?: string;
    historicalPeriod?: string;
    emotionalThemes?: string[];
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const {
      complexity,
      historicalPeriod,
      emotionalThemes,
      search,
      limit = 20,
      offset = 0
    } = filters;

    return prisma.performance.findMany({
      where: {
        status: 'PUBLISHED',
        ...(complexity && { complexityLevel: complexity as any }),
        ...(historicalPeriod && { historicalPeriod: historicalPeriod as any }),
        ...(emotionalThemes?.length && {
          emotionalThemes: {
            hasSome: emotionalThemes as any[]
          }
        }),
        ...(search && {
          OR: [
            { titleEnglish: { contains: search, mode: 'insensitive' } },
            { titleChinese: { contains: search } },
            { description: { contains: search, mode: 'insensitive' } },
            { tags: { hasSome: [search] } }
          ]
        })
      },
      select: {
        id: true,
        titleChinese: true,
        titleEnglish: true,
        titlePinyin: true,
        description: true,
        durationMinutes: true,
        complexityLevel: true,
        emotionalThemes: true,
        tags: true,
        culturalSignificance: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit
    });
  }

  /**
   * Get performance with full cultural context
   */
  static async getPerformanceWithContext(id: string, userId?: string) {
    const performance = await prisma.performance.findUnique({
      where: { id },
      include: {
        userProgress: userId ? {
          where: { userId }
        } : false,
        bookmarks: userId ? {
          where: { userId }
        } : false,
        discussions: {
          where: { status: 'ACTIVE' },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: { id: true, name: true, role: true }
            }
          }
        },
        culturalValidations: {
          where: { approved: true },
          include: {
            validator: {
              select: { id: true, name: true, role: true }
            }
          }
        }
      }
    });

    return performance;
  }

  /**
   * Track user learning progress
   */
  static async updateUserProgress(
    userId: string,
    performanceId: string,
    progressData: {
      progressPercentage?: number;
      currentPosition?: number;
      completed?: boolean;
      timeSpent?: number;
      completedSegments?: string[];
      culturalConceptsLearned?: string[];
    }
  ) {
    return prisma.userProgress.upsert({
      where: {
        userId_performanceId: {
          userId,
          performanceId
        }
      },
      create: {
        userId,
        performanceId,
        ...progressData,
        lastAccessed: new Date()
      },
      update: {
        ...progressData,
        lastAccessed: new Date(),
        revisitCount: { increment: 1 }
      }
    });
  }

  /**
   * Get cached audio or create cache entry
   */
  static async getOrCreateAudioCache(
    textHash: string,
    textContent: string,
    ttsOptions: any
  ) {
    const existing = await prisma.audioCache.findUnique({
      where: { textHash }
    });

    if (existing) {
      // Update access count and timestamp
      await prisma.audioCache.update({
        where: { textHash },
        data: {
          accessCount: { increment: 1 },
          lastAccessed: new Date()
        }
      });
      return existing;
    }

    // Will be created after audio generation
    return null;
  }

  /**
   * Create audio cache entry after successful generation
   */
  static async createAudioCache(data: {
    textHash: string;
    textContent: string;
    audioUrl: string;
    audioS3Key?: string;
    fileSizeBytes: number;
    durationSeconds: number;
    ttsOptions: any;
    voice: string;
    speed: number;
    generationCost: number;
    performanceId?: string;
  }) {
    return prisma.audioCache.create({
      data: {
        ...data,
        culturalStyle: 'shakespearean',
        accessCount: 1
      }
    });
  }

  /**
   * Get glossary terms with cultural context
   */
  static async getGlossaryTerms(filters: {
    search?: string;
    category?: string;
    difficulty?: string;
    relatedToPerformance?: string;
    limit?: number;
    offset?: number;
  }) {
    const {
      search,
      category,
      difficulty,
      relatedToPerformance,
      limit = 50,
      offset = 0
    } = filters;

    return prisma.glossaryTerm.findMany({
      where: {
        ...(search && {
          OR: [
            { termEnglish: { contains: search, mode: 'insensitive' } },
            { termChinese: { contains: search } },
            { definition: { contains: search, mode: 'insensitive' } }
          ]
        }),
        ...(category && { category: category as any }),
        ...(difficulty && { difficulty: difficulty as any }),
        ...(relatedToPerformance && {
          performanceReferences: {
            has: relatedToPerformance
          }
        })
      },
      orderBy: [
        { difficulty: 'asc' },
        { termEnglish: 'asc' }
      ],
      skip: offset,
      take: limit
    });
  }

  /**
   * Create cultural discussion with validation
   */
  static async createDiscussion(data: {
    title: string;
    content: string;
    category: string;
    authorId: string;
    performanceId?: string;
    culturalConcepts?: string[];
    culturalQuestion?: string;
  }) {
    return prisma.discussion.create({
      data: {
        ...data,
        category: data.category as any,
        status: 'ACTIVE'
      },
      include: {
        author: {
          select: { id: true, name: true, role: true }
        },
        performance: {
          select: { id: true, titleEnglish: true }
        }
      }
    });
  }

  /**
   * Record analytics event for cultural engagement
   */
  static async recordAnalyticsEvent(data: {
    userId?: string;
    sessionId: string;
    eventType: string;
    performanceId?: string;
    glossaryTermId?: string;
    eventData: any;
    culturalContext?: any;
    userAgent?: string;
    country?: string;
  }) {
    return prisma.analyticsEvent.create({
      data: {
        ...data,
        eventType: data.eventType as any,
        timestamp: new Date()
      }
    });
  }

  /**
   * Get user's cultural learning dashboard data
   */
  static async getUserCulturalDashboard(userId: string) {
    const [
      progressEntries,
      bookmarks,
      recentActivities,
      culturalStats
    ] = await Promise.all([
      // Learning progress
      prisma.userProgress.findMany({
        where: { userId },
        include: {
          performance: {
            select: {
              id: true,
              titleEnglish: true,
              titleChinese: true,
              complexityLevel: true,
              durationMinutes: true
            }
          }
        },
        orderBy: { lastAccessed: 'desc' },
        take: 10
      }),

      // Bookmarks
      prisma.bookmark.findMany({
        where: { userId },
        include: {
          performance: {
            select: {
              id: true,
              titleEnglish: true,
              titleChinese: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Recent analytics events
      prisma.analyticsEvent.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 20
      }),

      // Cultural learning statistics
      prisma.userProgress.groupBy({
        by: ['userId'],
        where: { userId },
        _count: {
          id: true
        },
        _sum: {
          timeSpent: true
        },
        _avg: {
          progressPercentage: true
        }
      })
    ]);

    return {
      progressEntries,
      bookmarks,
      recentActivities,
      culturalStats: culturalStats[0] || {
        _count: { id: 0 },
        _sum: { timeSpent: 0 },
        _avg: { progressPercentage: 0 }
      }
    };
  }
}

export default prisma;