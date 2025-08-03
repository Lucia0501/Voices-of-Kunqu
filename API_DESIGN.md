# API Design Specification: Voices of Kunqu

**Project:** Voices of Kunqu Web Application  
**Document Type:** API Implementation Specifications  
**Target Audience:** Full Stack Developer Agent (Phase 3A)  
**Version:** 1.0  
**Date:** 2025-08-03  
**System Architect:** Icarus (zhehongl91@gmail.com)

---

## Executive Summary

This document provides comprehensive API specifications for implementing the Voices of Kunqu web application backend. The API design prioritizes cultural content authenticity, educational effectiveness, and accessibility while maintaining high performance and security standards. All endpoints are designed for Next.js 14 App Router implementation with TypeScript, focusing on cultural preservation and cross-cultural education.

**API Design Principles:**
- **Cultural Content First:** API structure reflects cultural content relationships
- **Educational Effectiveness:** Endpoints optimized for learning workflows
- **Accessibility Integration:** Built-in support for WCAG 2.1 AA compliance
- **Performance Optimization:** Caching and pagination for scalable cultural content delivery
- **Security by Design:** Authentication, authorization, and input validation throughout

---

## API Architecture Overview

### Base Configuration
```typescript
// API Base Configuration
interface APIConfiguration {
  baseURL: "https://voices-of-kunqu.org/api"
  version: "v1"
  authentication: "Bearer JWT tokens"
  contentType: "application/json"
  rateLimit: {
    anonymous: "60 requests/minute"
    authenticated: "120 requests/minute"
    admin: "unlimited"
  }
  
  responseFormat: {
    success: "{ data: T, meta?: object }"
    error: "{ error: string, code: string, details?: object }"
    pagination: "{ data: T[], pagination: PaginationMeta }"
  }
}
```

### Authentication Strategy
```typescript
// Authentication Configuration
interface AuthenticationConfig {
  tokenType: "JWT"
  accessTokenExpiry: "15 minutes"
  refreshTokenExpiry: "7 days"
  
  headers: {
    authorization: "Bearer {access_token}"
    refreshToken: "X-Refresh-Token: {refresh_token}"
  }
  
  roles: {
    user: "Read cultural content, save progress, participate in discussions"
    cultural_expert: "Create/edit cultural content, moderate discussions"
    admin: "Full system access, user management, analytics"
  }
}
```

---

## Authentication API Endpoints

### POST /api/auth/login
**Purpose:** User authentication with email and password or magic link

```typescript
interface LoginRequest {
  method: "email" | "magic_link"
  email: string
  password?: string // Required for email method
  remember?: boolean
}

interface LoginResponse {
  data: {
    user: {
      id: string
      email: string
      name: string
      role: "user" | "cultural_expert" | "admin"
      culturalPreferences: {
        complexity: "beginner" | "intermediate" | "advanced"
        interests: string[]
        audioPreferences: {
          voice: string
          speed: number
        }
      }
    }
    tokens: {
      accessToken: string
      refreshToken: string
      expiresIn: number
    }
  }
}

// Success: 200, Error: 401, 422
```

### POST /api/auth/refresh
**Purpose:** Refresh expired access tokens

```typescript
interface RefreshRequest {
  refreshToken: string
}

interface RefreshResponse {
  data: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

// Success: 200, Error: 401, 403
```

### POST /api/auth/logout
**Purpose:** Invalidate user session and tokens

```typescript
interface LogoutRequest {
  refreshToken: string
}

interface LogoutResponse {
  data: {
    message: "Successfully logged out"
  }
}

// Success: 200, Error: 401
```

### GET /api/auth/me
**Purpose:** Get current user profile and cultural preferences

```typescript
interface UserProfileResponse {
  data: {
    id: string
    email: string
    name: string
    role: string
    culturalProfile: {
      learningLevel: "beginner" | "intermediate" | "advanced"
      completedPerformances: string[]
      currentLearningPath: string
      culturalInterests: string[]
      progressStats: {
        totalHoursEngaged: number
        performancesCompleted: number
        culturalTermsLearned: number
      }
    }
    preferences: {
      audioSettings: {
        preferredVoice: string
        playbackSpeed: number
        autoplay: boolean
      }
      accessibilitySettings: {
        highContrast: boolean
        reducedMotion: boolean
        screenReaderOptimized: boolean
      }
    }
  }
}

// Success: 200, Error: 401
```

---

## Cultural Content API Endpoints

### GET /api/performances
**Purpose:** Browse and search Kunqu performances with cultural filtering

```typescript
interface PerformancesQuery {
  // Pagination
  page?: number
  limit?: number // Max 50
  cursor?: string
  
  // Cultural Filters
  complexity?: "beginner" | "intermediate" | "advanced"
  historicalPeriod?: "ming" | "qing" | "modern"
  emotionalTheme?: "love" | "tragedy" | "historical" | "supernatural"
  duration?: "short" | "medium" | "long" // <15min, 15-30min, >30min
  
  // Search
  search?: string
  tags?: string[]
  
  // Personalization
  recommended?: boolean // Based on user progress
  bookmarked?: boolean // User's bookmarked performances
}

interface PerformancesResponse {
  data: {
    performances: Array<{
      id: string
      title: {
        chinese: string
        english: string
        pinyin: string
      }
      description: string
      culturalContext: {
        historicalPeriod: string
        culturalSignificance: string
        characterTypes: string[]
        musicalElements: string[]
      }
      metadata: {
        durationMinutes: number
        complexityLevel: string
        emotionalThemes: string[]
        tags: string[]
      }
      media: {
        thumbnailUrl: string
        audioPreviewUrl: string
        hasFullAudio: boolean
      }
      userProgress?: {
        completed: boolean
        progressPercentage: number
        bookmarked: boolean
        lastPosition: number
      }
      createdAt: string
      updatedAt: string
    }>
  }
  pagination: {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
    cursor?: string
  }
}

// Success: 200, Error: 400, 500
```

### GET /api/performances/:id
**Purpose:** Get detailed performance data with cultural context and audio segments

```typescript
interface PerformanceDetailResponse {
  data: {
    id: string
    title: {
      chinese: string
      english: string
      pinyin: string
    }
    culturalMetadata: {
      historicalContext: string
      culturalSignificance: string
      traditionalClassification: string
      modernAdaptations: string[]
      shakespeareanParallels: string
    }
    content: {
      acts: Array<{
        actNumber: number
        title: string
        scenes: Array<{
          sceneNumber: number
          title: string
          characters: Array<{
            name: {
              chinese: string
              english: string
            }
            archetype: string
            description: string
          }>
          dialogue: Array<{
            characterId: string
            text: {
              chinese: string
              english: string
              pinyin: string
            }
            culturalNotes: string[]
            audioSegment: {
              id: string
              startTime: number
              endTime: number
              audioUrl?: string // Generated on demand
            }
          }>
        }>
      }>
    }
    educational: {
      learningObjectives: string[]
      culturalConcepts: string[]
      discussionQuestions: string[]
      relatedPerformances: string[]
    }
    media: {
      images: Array<{
        url: string
        caption: string
        culturalContext: string
      }>
      audioSegments: Array<{
        id: string
        text: string
        audioUrl?: string
        cached: boolean
      }>
    }
  }
}

// Success: 200, Error: 404, 500
```

### GET /api/cultural-content/glossary
**Purpose:** Access cultural terminology glossary with pronunciation and context

```typescript
interface GlossaryQuery {
  search?: string
  category?: "characters" | "musical" | "historical" | "technical"
  letter?: string // First letter filter
  related?: string // Related terms to specific performance
}

interface GlossaryResponse {
  data: {
    terms: Array<{
      id: string
      term: {
        chinese: string
        pinyin: string
        english: string
      }
      definition: string
      culturalContext: string
      pronunciation: {
        audioUrl: string
        ipa: string
      }
      crossReferences: {
        relatedTerms: string[]
        performanceExamples: string[]
        westernEquivalents: string[]
        shakespeareanReferences: string[]
      }
      category: string
      difficulty: "basic" | "intermediate" | "advanced"
    }>
  }
  pagination: {
    page: number
    limit: number
    total: number
    hasNext: boolean
  }
}

// Success: 200, Error: 400, 500
```

### GET /api/cultural-content/timeline
**Purpose:** Historical timeline of Kunqu development with cultural context

```typescript
interface TimelineQuery {
  period?: "all" | "ming" | "qing" | "modern"
  eventType?: "performance" | "political" | "cultural" | "technical"
  detail?: "summary" | "full"
}

interface TimelineResponse {
  data: {
    periods: Array<{
      name: string
      startYear: number
      endYear: number
      description: string
      events: Array<{
        id: string
        date: string
        title: string
        description: string
        culturalSignificance: string
        britishParallels: string[]
        sources: Array<{
          title: string
          author: string
          url?: string
        }>
        media: {
          images: string[]
          audioExamples: string[]
        }
      }>
    }>
  }
}

// Success: 200, Error: 400, 500
```

---

## Audio Generation API Endpoints

### POST /api/tts/generate
**Purpose:** Generate Shakespearean-style TTS audio for cultural content

```typescript
interface TTSGenerateRequest {
  text: string
  options: {
    voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
    speed?: number // 0.75 to 1.5
    style?: "shakespearean" | "narrative" | "conversational"
    culturalContext?: {
      characterType?: string
      emotionalTone?: string
      culturalPeriod?: string
    }
  }
  cache?: boolean // Default true
  priority?: "low" | "normal" | "high"
}

interface TTSGenerateResponse {
  data: {
    audioUrl: string
    duration: number
    audioId: string
    cached: boolean
    cost: number // In credits/USD
    metadata: {
      textLength: number
      voice: string
      speed: number
      generatedAt: string
    }
  }
}

// Success: 200, Error: 400, 402 (quota exceeded), 429 (rate limit), 500
```

### GET /api/tts/audio/:audioId
**Purpose:** Retrieve cached audio file with metadata

```typescript
interface AudioResponse {
  data: {
    audioUrl: string
    metadata: {
      originalText: string
      voice: string
      speed: number
      duration: number
      fileSize: number
      format: string
      createdAt: string
      lastAccessed: string
      accessCount: number
    }
    culturalContext?: {
      performanceId?: string
      characterName?: string
      scene?: string
    }
  }
}

// Success: 200, Error: 404, 500
```

### POST /api/tts/batch-generate
**Purpose:** Generate multiple audio segments for performance content

```typescript
interface BatchTTSRequest {
  segments: Array<{
    id: string
    text: string
    options: {
      voice?: string
      speed?: number
      culturalContext?: object
    }
  }>
  performanceId?: string
  priority?: "background" | "immediate"
}

interface BatchTTSResponse {
  data: {
    batchId: string
    status: "queued" | "processing" | "completed" | "failed"
    results: Array<{
      segmentId: string
      status: "pending" | "completed" | "failed"
      audioUrl?: string
      error?: string
    }>
    progress: {
      completed: number
      total: number
      percentage: number
    }
  }
}

// Success: 202 (Accepted), Error: 400, 402, 500
```

### GET /api/tts/batch/:batchId/status
**Purpose:** Check batch generation progress

```typescript
interface BatchStatusResponse {
  data: {
    batchId: string
    status: "queued" | "processing" | "completed" | "failed"
    progress: {
      completed: number
      total: number
      percentage: number
      estimatedTimeRemaining?: number
    }
    results: Array<{
      segmentId: string
      status: string
      audioUrl?: string
      error?: string
    }>
    createdAt: string
    completedAt?: string
  }
}

// Success: 200, Error: 404, 500
```

---

## User Learning API Endpoints

### GET /api/user/progress
**Purpose:** Get user's learning progress and cultural journey

```typescript
interface UserProgressResponse {
  data: {
    overall: {
      culturalLevel: "beginner" | "intermediate" | "advanced"
      totalHoursEngaged: number
      performancesCompleted: number
      culturalTermsLearned: number
      streakDays: number
    }
    currentLearning: {
      activeLearningPath: {
        id: string
        title: string
        progress: number
        currentLesson: {
          id: string
          title: string
          estimatedTime: number
        }
      }
      recentActivity: Array<{
        type: "performance" | "glossary" | "discussion" | "timeline"
        id: string
        title: string
        timestamp: string
        progress?: number
      }>
    }
    achievements: Array<{
      id: string
      title: string
      description: string
      earnedAt: string
      category: "cultural" | "learning" | "community" | "technical"
    }>
    recommendations: {
      nextPerformances: string[]
      culturalConcepts: string[]
      discussions: string[]
    }
  }
}

// Success: 200, Error: 401, 500
```

### POST /api/user/progress/performance/:performanceId
**Purpose:** Update user progress for a specific performance

```typescript
interface UpdateProgressRequest {
  action: "start" | "progress" | "complete" | "bookmark" | "unbookmark"
  position?: number // Audio position in seconds
  completedSegments?: string[]
  notes?: string
}

interface UpdateProgressResponse {
  data: {
    performanceId: string
    progress: {
      percentage: number
      currentPosition: number
      completed: boolean
      bookmarked: boolean
      completedSegments: string[]
    }
    achievements?: Array<{
      id: string
      title: string
      description: string
    }>
  }
}

// Success: 200, Error: 401, 404, 500
```

### GET /api/user/bookmarks
**Purpose:** Get user's bookmarked cultural content

```typescript
interface BookmarksResponse {
  data: {
    performances: Array<{
      id: string
      title: string
      addedAt: string
      progress: number
      lastAccessed: string
    }>
    glossaryTerms: Array<{
      id: string
      term: string
      addedAt: string
    }>
    discussions: Array<{
      id: string
      title: string
      addedAt: string
    }>
  }
}

// Success: 200, Error: 401, 500
```

### GET /api/learning-paths
**Purpose:** Get available learning pathways for cultural education

```typescript
interface LearningPathsResponse {
  data: {
    paths: Array<{
      id: string
      title: string
      description: string
      culturalFocus: string
      difficulty: "beginner" | "intermediate" | "advanced"
      estimatedHours: number
      lessons: Array<{
        id: string
        title: string
        type: "performance" | "theory" | "practice" | "discussion"
        estimatedMinutes: number
        prerequisites: string[]
      }>
      userProgress?: {
        enrolled: boolean
        currentLessonId: string
        completionPercentage: number
      }
    }>
  }
}

// Success: 200, Error: 500
```

### POST /api/learning-paths/:pathId/enroll
**Purpose:** Enroll user in a cultural learning pathway

```typescript
interface EnrollmentRequest {
  culturalBackground?: string
  goals: string[]
  timeCommitment: "light" | "moderate" | "intensive"
}

interface EnrollmentResponse {
  data: {
    pathId: string
    enrollmentDate: string
    customizedPlan: {
      recommendedSchedule: string
      adaptedContent: string[]
      culturalSupport: string[]
    }
  }
}

// Success: 201, Error: 401, 409 (already enrolled), 500
```

---

## Search and Discovery API Endpoints

### GET /api/search
**Purpose:** Universal search across all cultural content

```typescript
interface SearchQuery {
  q: string // Search query
  type?: "all" | "performances" | "glossary" | "discussions" | "timeline"
  filters?: {
    culturalPeriod?: string[]
    complexity?: string[]
    contentType?: string[]
  }
  sort?: "relevance" | "date" | "popularity" | "cultural_significance"
  limit?: number
  offset?: number
}

interface SearchResponse {
  data: {
    results: Array<{
      id: string
      type: "performance" | "glossary" | "timeline" | "discussion"
      title: string
      snippet: string
      culturalContext: string
      relevanceScore: number
      metadata: {
        complexity?: string
        period?: string
        duration?: number
      }
      url: string
    }>
    facets: {
      types: Array<{
        name: string
        count: number
      }>
      periods: Array<{
        name: string
        count: number
      }>
      complexity: Array<{
        name: string
        count: number
      }>
    }
  }
  pagination: {
    total: number
    limit: number
    offset: number
    hasNext: boolean
  }
}

// Success: 200, Error: 400, 500
```

### GET /api/recommendations
**Purpose:** Personalized cultural content recommendations

```typescript
interface RecommendationsQuery {
  type?: "performances" | "learning" | "discussions" | "cultural_concepts"
  count?: number // Default 10, max 20
  reason?: boolean // Include recommendation reasoning
}

interface RecommendationsResponse {
  data: {
    recommendations: Array<{
      id: string
      type: string
      title: string
      description: string
      culturalRelevance: string
      confidenceScore: number
      reasoning?: {
        factors: string[]
        userProfile: string
        culturalAlignment: string
      }
      metadata: {
        difficulty: string
        estimatedTime: number
        culturalDepth: "introductory" | "intermediate" | "advanced"
      }
    }>
    explanations: {
      algorithm: string
      personalizationFactors: string[]
      culturalConsiderations: string[]
    }
  }
}

// Success: 200, Error: 401, 500
```

---

## Community and Discussion API Endpoints

### GET /api/discussions
**Purpose:** Get community discussions about cultural content

```typescript
interface DiscussionsQuery {
  performanceId?: string
  category?: "general" | "cultural_analysis" | "translations" | "historical_context"
  sort?: "recent" | "popular" | "expert_contributions"
  status?: "active" | "resolved" | "expert_reviewed"
  page?: number
  limit?: number
}

interface DiscussionsResponse {
  data: {
    discussions: Array<{
      id: string
      title: string
      category: string
      author: {
        id: string
        name: string
        role: string
        culturalExpertise?: string
      }
      preview: string
      stats: {
        replies: number
        likes: number
        expertContributions: number
        lastActivity: string
      }
      culturalContext: {
        relatedPerformance?: string
        culturalConcepts: string[]
        expertValidated: boolean
      }
      createdAt: string
    }>
  }
  pagination: {
    page: number
    limit: number
    total: number
    hasNext: boolean
  }
}

// Success: 200, Error: 400, 500
```

### POST /api/discussions
**Purpose:** Create new cultural discussion thread

```typescript
interface CreateDiscussionRequest {
  title: string
  content: string
  category: string
  culturalContext: {
    relatedPerformance?: string
    culturalConcepts: string[]
    culturalQuestion?: string
  }
  tags: string[]
}

interface CreateDiscussionResponse {
  data: {
    discussionId: string
    title: string
    url: string
    moderationStatus: "approved" | "pending_review" | "needs_expert_review"
  }
}

// Success: 201, Error: 401, 400, 429 (rate limit), 500
```

### GET /api/discussions/:discussionId
**Purpose:** Get detailed discussion thread with expert contributions

```typescript
interface DiscussionDetailResponse {
  data: {
    discussion: {
      id: string
      title: string
      content: string
      category: string
      author: {
        id: string
        name: string
        role: string
        culturalCredentials?: string
      }
      culturalContext: {
        relatedPerformance?: object
        culturalConcepts: string[]
        expertValidation: {
          validated: boolean
          validatedBy?: string
          validationDate?: string
          culturalAccuracy: "high" | "medium" | "pending"
        }
      }
      replies: Array<{
        id: string
        content: string
        author: {
          id: string
          name: string
          role: string
          expertise?: string
        }
        culturalContribution: {
          isExpertContribution: boolean
          culturalInsight: string
          citations?: string[]
        }
        likes: number
        createdAt: string
      }>
      stats: {
        totalReplies: number
        expertContributions: number
        culturalValidations: number
      }
      userInteraction: {
        liked: boolean
        bookmarked: boolean
        following: boolean
      }
    }
  }
}

// Success: 200, Error: 404, 500
```

---

## Content Management API Endpoints (Admin/Expert Only)

### POST /api/admin/performances
**Purpose:** Create new cultural performance content (Cultural Expert role required)

```typescript
interface CreatePerformanceRequest {
  culturalMetadata: {
    title: {
      chinese: string
      english: string
      pinyin: string
    }
    historicalContext: string
    culturalSignificance: string
    traditionalClassification: string
    sourceAttribution: {
      primarySource: string
      culturalConsultants: string[]
      academicReferences: string[]
    }
  }
  content: {
    acts: Array<{
      actNumber: number
      title: string
      culturalNotes: string
      scenes: Array<{
        sceneNumber: number
        title: string
        characters: object[]
        dialogue: object[]
      }>
    }>
  }
  educationalMetadata: {
    learningObjectives: string[]
    culturalConcepts: string[]
    targetAudience: string
    culturalComplexity: string
  }
  workflowStatus: "draft" | "cultural_review" | "translation_review" | "ready_for_publication"
}

interface CreatePerformanceResponse {
  data: {
    performanceId: string
    status: string
    reviewWorkflow: {
      currentStage: string
      requiredApprovals: string[]
      estimatedReviewTime: string
    }
    culturalValidation: {
      assignedExperts: string[]
      validationCriteria: string[]
    }
  }
}

// Success: 201, Error: 401, 403, 400, 500
```

### PUT /api/admin/performances/:id/cultural-review
**Purpose:** Submit cultural expert review for performance content

```typescript
interface CulturalReviewRequest {
  reviewDecision: "approve" | "request_changes" | "reject"
  culturalAccuracy: {
    historicalAccuracy: "accurate" | "minor_issues" | "major_issues"
    culturalAuthenticity: "authentic" | "needs_revision" | "inauthentic"
    translationQuality: "excellent" | "good" | "needs_improvement"
  }
  feedback: {
    culturalCorrections: string[]
    translationSuggestions: string[]
    historicalClarifications: string[]
    generalComments: string
  }
  expertCredentials: {
    expertise: string
    qualifications: string
    specialization: string
  }
}

interface CulturalReviewResponse {
  data: {
    reviewId: string
    status: string
    nextSteps: string[]
    workflowProgression: {
      currentStage: string
      completedStages: string[]
      remainingStages: string[]
    }
  }
}

// Success: 200, Error: 401, 403, 404, 500
```

### GET /api/admin/analytics/cultural-impact
**Purpose:** Cultural impact and educational effectiveness analytics

```typescript
interface CulturalAnalyticsResponse {
  data: {
    culturalEngagement: {
      totalCulturalHours: number
      uniqueLearners: number
      culturalConceptsLearned: number
      crossCulturalConnections: number
    }
    contentEffectiveness: {
      performanceCompletionRates: Array<{
        performanceId: string
        title: string
        completionRate: number
        engagementScore: number
        culturalImpactScore: number
      }>
      learningPathEffectiveness: Array<{
        pathId: string
        title: string
        completionRate: number
        learningRetention: number
        culturalAppreciation: number
      }>
    }
    expertContributions: {
      activeExperts: number
      contentValidations: number
      communityContributions: number
      culturalCorrections: number
    }
    userProgression: {
      beginnerToIntermediate: number
      intermediateToAdvanced: number
      averageProgressionTime: number
      culturalRetention: number
    }
  }
  timeRange: {
    start: string
    end: string
    granularity: "daily" | "weekly" | "monthly"
  }
}

// Success: 200, Error: 401, 403, 500
```

---

## Error Handling and Status Codes

### Standard Error Responses
```typescript
interface APIError {
  error: string
  code: string
  details?: {
    field?: string
    culturalContext?: string
    suggestion?: string
    documentation?: string
  }
  timestamp: string
  requestId: string
}

// Common Status Codes
interface StatusCodes {
  200: "Success"
  201: "Created successfully"
  202: "Accepted for processing"
  400: "Bad request - validation failed"
  401: "Unauthorized - authentication required"
  403: "Forbidden - insufficient permissions"
  404: "Not found - cultural content not found"
  409: "Conflict - cultural content version conflict"
  422: "Unprocessable entity - cultural validation failed"
  429: "Too many requests - rate limit exceeded"
  500: "Internal server error"
  503: "Service unavailable - maintenance mode"
}
```

### Cultural Content Specific Errors
```typescript
interface CulturalErrorCodes {
  CULTURAL_VALIDATION_FAILED: "Cultural content does not meet authenticity standards"
  TRANSLATION_QUALITY_INSUFFICIENT: "Translation quality below educational standards"
  EXPERT_REVIEW_REQUIRED: "Cultural expert review required before publication"
  CULTURAL_CONTEXT_MISSING: "Required cultural context information missing"
  HISTORICAL_ACCURACY_QUESTIONED: "Historical accuracy requires expert verification"
  PRONUNCIATION_GUIDE_INVALID: "Pronunciation guide does not match cultural standards"
  TTS_CULTURAL_INAPPROPRIATE: "Generated audio does not meet cultural sensitivity standards"
}
```

---

## Rate Limiting and Security

### Rate Limiting Configuration
```typescript
interface RateLimitingConfig {
  tiers: {
    anonymous: {
      general: "60 requests/minute"
      search: "20 requests/minute"
      tts: "5 requests/minute"
      content: "30 requests/minute"
    }
    user: {
      general: "120 requests/minute"
      search: "60 requests/minute"
      tts: "20 requests/minute"
      content: "100 requests/minute"
      progress: "200 requests/minute"
    }
    cultural_expert: {
      general: "300 requests/minute"
      content_management: "100 requests/minute"
      reviews: "50 requests/minute"
      tts: "100 requests/minute"
    }
    admin: {
      general: "unlimited"
      analytics: "unlimited"
      content_management: "unlimited"
    }
  }
  
  implementation: {
    storage: "Redis sliding window"
    headers: {
      limit: "X-RateLimit-Limit"
      remaining: "X-RateLimit-Remaining"
      reset: "X-RateLimit-Reset"
    }
    gracefulDegradation: "Queue requests when approaching limits"
  }
}
```

### Request Validation
```typescript
interface RequestValidation {
  authentication: {
    required: "All endpoints except public cultural content"
    method: "Bearer JWT tokens"
    validation: "Token signature and expiry verification"
  }
  
  authorization: {
    implementation: "Role-based access control"
    cultural_content: "Cultural expert or admin for modifications"
    user_data: "User owns data or admin access"
    analytics: "Admin only access"
  }
  
  inputValidation: {
    schema: "Zod schema validation for all inputs"
    sanitization: "DOMPurify for user-generated content"
    culturalValidation: "Cultural content-specific validation rules"
    fileUploads: "File type and size validation for cultural media"
  }
  
  culturalSafeguards: {
    contentIntegrity: "Validation of cultural content authenticity"
    translation: "Quality checks for cultural translation accuracy"
    pronunciation: "Validation of pronunciation guides"
    historical: "Historical accuracy verification"
  }
}
```

---

## Performance and Caching

### API Response Caching
```typescript
interface APICachingStrategy {
  staticContent: {
    culturalGlossary: "24 hours with version-based invalidation"
    historicalTimeline: "12 hours with expert update invalidation"
    performanceMetadata: "6 hours with content update invalidation"
    publicPerformances: "4 hours with publication status changes"
  }
  
  userSpecific: {
    userProgress: "5 minutes with real-time updates"
    recommendations: "30 minutes with progress-based invalidation"
    bookmarks: "15 minutes with user action invalidation"
    preferences: "1 hour with settings change invalidation"
  }
  
  computedContent: {
    searchResults: "15 minutes with content update invalidation"
    analytics: "1 hour with batch update cycles"
    culturalRecommendations: "2 hours with learning progress updates"
  }
  
  culturalContent: {
    expertValidated: "Cache until expert review changes"
    audioGenerated: "Permanent cache with backup redundancy"
    translations: "Cache until cultural expert updates"
  }
}
```

### Database Query Optimization
```typescript
interface DatabaseOptimization {
  indexStrategy: {
    culturalSearch: "GIN indexes for full-text search on cultural content"
    userProgress: "Composite indexes for user learning queries"
    expertContent: "Indexes optimized for cultural expert workflows"
    analytics: "Time-series indexes for performance analytics"
  }
  
  queryOptimization: {
    nPlusOne: "Prisma include/select optimization"
    aggregations: "Optimized aggregation queries for analytics"
    pagination: "Cursor-based pagination for large cultural datasets"
    caching: "Query result caching for expensive cultural computations"
  }
}
```

---

## Testing and Quality Assurance

### API Testing Requirements
```typescript
interface APITestingStrategy {
  unitTesting: {
    framework: "Jest with supertest for API endpoint testing"
    coverage: "90% minimum coverage for all endpoints"
    mocking: "OpenAI API mocking for TTS testing"
    cultural: "Cultural content validation testing"
  }
  
  integrationTesting: {
    database: "Real PostgreSQL database testing"
    cache: "Redis integration testing"
    external: "OpenAI API integration testing with rate limiting"
    authentication: "Full auth flow testing"
  }
  
  culturalTesting: {
    contentValidation: "Cultural accuracy validation testing"
    translation: "Translation quality testing"
    accessibility: "Cultural content accessibility testing"
    expert: "Expert workflow testing"
  }
  
  performanceTesting: {
    load: "API load testing with realistic cultural content usage"
    stress: "Stress testing with concurrent audio generation"
    endurance: "Long-running cultural learning session testing"
  }
}
```

This comprehensive API design specification provides the Full Stack Developer agent with detailed implementation guidelines for all backend endpoints, ensuring cultural authenticity, educational effectiveness, accessibility compliance, and technical excellence throughout the Voices of Kunqu platform.