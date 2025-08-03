# Voices of Kunqu Developer Documentation

**Project:** Voices of Kunqu Web Application  
**Target Audience:** New developers joining the project  
**Version:** 1.0  
**Date:** 2025-08-03

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Development Workflow](#development-workflow)
7. [Code Standards](#code-standards)
8. [Testing Guidelines](#testing-guidelines)
9. [Deployment Process](#deployment-process)
10. [Cultural Content Guidelines](#cultural-content-guidelines)
11. [API Integration](#api-integration)
12. [Performance Optimization](#performance-optimization)
13. [Security Considerations](#security-considerations)
14. [Troubleshooting](#troubleshooting)
15. [Contributing Guidelines](#contributing-guidelines)

---

## Project Overview

### Mission Statement
Voices of Kunqu bridges traditional Chinese Kunqu opera with British audiences through AI-powered text-to-speech technology and Shakespearean-style English translations, creating an accessible digital cultural education platform.

### Project Goals
- **Cultural Preservation:** Maintain authentic representation of 600-year-old Kunqu opera tradition
- **Educational Access:** Provide structured learning pathways for various expertise levels
- **Cross-Cultural Understanding:** Connect Kunqu with familiar Shakespearean theatrical traditions
- **Technical Excellence:** Deliver production-ready platform with WCAG 2.1 AA accessibility compliance

### Key Features
- Real-time AI-powered text-to-speech generation with Shakespearean delivery style
- Synchronized text-audio display with word-level highlighting
- Comprehensive cultural context library and interactive glossary
- Performance collection browser with intelligent search and filtering
- Structured learning pathways for different user personas
- Community discussion platform with expert moderation

---

## Development Environment Setup

### Prerequisites
```bash
# Required Software
Node.js 20.x LTS
npm 10.x or yarn 4.x
Git 2.40+
Docker 24.x (for local development)
PostgreSQL 15.x
Redis 7.x
```

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/Lucia0501/Voices-of-Kunqu.git
cd voices-of-kunqu

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
npm run db:setup

# Start development server
npm run dev
```

### Environment Configuration
```env
# .env.local template
DATABASE_URL="postgresql://username:password@localhost:5432/voicesofkunqu"
REDIS_URL="redis://localhost:6379"
OPENAI_API_KEY="your_openai_api_key"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
AWS_S3_BUCKET="voices-of-kunqu-dev"
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
```

### Development Tools Setup
```bash
# Install recommended VS Code extensions
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension ms-playwright.playwright

# Set up pre-commit hooks
npm run prepare

# Run initial tests
npm run test
npm run test:e2e
```

---

## System Architecture

### 🏛️ Voices of Kunqu Architecture Overview

#### Frontend Layer (Next.js 14)
| Component Category | Features |
|:-------------------|:---------|
| **Performance Viewer** | Audio-synchronized text display, cultural context panels |
| **Learning Pathways** | Structured educational journeys, progress tracking |
| **Cultural Browser** | Performance collection, search & filtering, glossary |
| **Community Platform** | Discussion forums, expert contributions, user profiles |
| **Administrative Interface** | Content management, user moderation, analytics |

#### API Gateway & Middleware
| Middleware Type | Purpose |
|:----------------|:--------|
| **Authentication** | NextAuth.js with JWT, role-based access control |
| **Authorization** | Cultural expert verification, content permissions |
| **Rate Limiting** | API usage control, TTS cost management |
| **Monitoring** | Request logging, performance tracking |

#### Backend Services (Next.js API Routes)
| Service | Description |
|:--------|:------------|
| **Cultural Content Management** | Performance CRUD, translation workflow |
| **Audio Generation Service** | OpenAI TTS integration, caching strategy |
| **User Learning Service** | Progress tracking, pathway recommendations |
| **Search & Discovery** | Full-text search, cultural context filtering |
| **Community Management** | Discussion forums, expert verification |
| **Analytics Service** | User engagement, cultural impact metrics |

#### External Services
| Provider | APIs Used |
|:---------|:----------|
| **OpenAI** | Text-to-Speech (gpt-4o-mini), audio generation |
| **AWS** | S3 Storage, CloudFront CDN, RDS PostgreSQL |
| **Vercel** | Hosting, Edge Functions, Analytics |

#### Data Layer
| Storage Type | Technology | Purpose |
|:-------------|:-----------|:--------|
| **Primary DB** | PostgreSQL 15 (AWS RDS) | Cultural content, user data, performance metadata |
| **Cache Layer** | Redis 7 (AWS ElastiCache) | Audio cache, session data, search results |
| **File Storage** | AWS S3 + CloudFront | Audio files, images, cultural media assets |
| **Search Index** | PostgreSQL Full-Text | Performance search, cultural term lookup |
| **Analytics** | Vercel Analytics + Custom | User engagement, cultural learning metrics |

---

## Technology Stack

### Frontend Technologies
```typescript
// Core Frontend Stack
{
  "framework": "Next.js 14.x with App Router",
  "language": "TypeScript 5.x (strict mode)",
  "styling": "Tailwind CSS 3.x with custom cultural components",
  "stateManagement": {
    "client": "Zustand 4.x for local state",
    "server": "TanStack Query 5.x for server state"
  },
  "audio": "Web Audio API with HTML5 audio fallback",
  "accessibility": "React Aria components for WCAG compliance",
  "testing": "Jest + React Testing Library + Playwright"
}
```

### Backend Technologies
```typescript
// Backend Technology Stack
{
  "runtime": "Node.js 20.x LTS",
  "apiFramework": "Next.js 14 API Routes with App Router",
  "database": {
    "primary": "PostgreSQL 15.x with Prisma ORM",
    "cache": "Redis 7.x",
    "search": "PostgreSQL Full-Text Search"
  },
  "authentication": "NextAuth.js 4.x with JWT strategy",
  "fileStorage": "AWS S3 with CloudFront CDN",
  "monitoring": "Sentry + Vercel Analytics"
}
```

### Infrastructure
```yaml
# Production Infrastructure
hosting:
  frontend: "Vercel Pro (global edge network)"
  database: "AWS RDS PostgreSQL (Multi-AZ)"
  cache: "AWS ElastiCache Redis"
  storage: "AWS S3 + CloudFront CDN"
  
monitoring:
  application: "Vercel Analytics + Sentry"
  database: "AWS CloudWatch + pgAdmin"
  uptime: "99.5% availability SLA during UK peak hours"
```

---

## Project Structure

```
voices-of-kunqu/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (cultural)/               # Cultural content routes
│   │   │   ├── performances/
│   │   │   │   ├── [id]/
│   │   │   │   └── browse/
│   │   │   ├── glossary/
│   │   │   ├── timeline/
│   │   │   └── learn/
│   │   ├── (community)/              # Community features
│   │   │   ├── discussions/
│   │   │   └── experts/
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   ├── performances/
│   │   │   ├── tts/
│   │   │   ├── cultural-content/
│   │   │   └── analytics/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                   # Reusable components
│   │   ├── ui/                       # Base UI components
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── TextSyncDisplay.tsx
│   │   │   ├── CulturalGlossary.tsx
│   │   │   └── Timeline.tsx
│   │   ├── cultural/                 # Cultural-specific components
│   │   │   ├── PerformanceViewer.tsx
│   │   │   ├── TranslationDisplay.tsx
│   │   │   ├── CharacterArchetype.tsx
│   │   │   └── MusicalNotation.tsx
│   │   ├── forms/                    # Form components
│   │   └── layout/                   # Layout components
│   ├── lib/                          # Utilities and configurations
│   │   ├── audio/                    # Audio processing utilities
│   │   │   ├── tts-client.ts
│   │   │   ├── audio-sync.ts
│   │   │   └── cache-manager.ts
│   │   ├── cultural/                 # Cultural content utilities
│   │   │   ├── translation-parser.ts
│   │   │   ├── pronunciation-guide.ts
│   │   │   └── cultural-validator.ts
│   │   ├── db/                       # Database utilities
│   │   │   ├── prisma.ts
│   │   │   ├── redis.ts
│   │   │   └── migrations.ts
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAudioPlayer.ts
│   │   ├── useCulturalContent.ts
│   │   └── useUserProgress.ts
│   ├── stores/                       # State management
│   │   ├── audio-store.ts
│   │   ├── user-store.ts
│   │   └── cultural-store.ts
│   └── types/                        # TypeScript definitions
│       ├── cultural.ts
│       ├── audio.ts
│       └── database.ts
├── prisma/                           # Database schema and migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/                            # Test files
│   ├── __mocks__/
│   ├── components/
│   ├── pages/
│   ├── api/
│   └── e2e/
├── docs/                             # Documentation
│   ├── API_DOCS.md
│   ├── USER_GUIDE.md
│   ├── ARCHITECTURE.md
│   └── cultural-guidelines.md
├── public/                           # Static assets
│   ├── audio/
│   ├── images/
│   └── cultural-media/
├── .github/                          # GitHub workflows
│   └── workflows/
├── .env.example                      # Environment template
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── jest.config.js                    # Jest configuration
├── playwright.config.ts              # Playwright configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── next.config.js                    # Next.js configuration
└── package.json                      # Dependencies and scripts
```

---

## Development Workflow

### Git Workflow
We follow a modified Git Flow with emphasis on cultural content accuracy:

```bash
# Branch naming conventions
feature/audio-sync-enhancement
bugfix/tts-pronunciation-accuracy
cultural/new-performance-integration
hotfix/accessibility-compliance

# Commit message format
feat(audio): implement Shakespearean delivery style
fix(cultural): correct Ming Dynasty timeline dates
docs(api): update TTS endpoint documentation
test(performance): add cross-browser audio tests
```

### Pull Request Process
1. **Create Feature Branch:** Branch from `main` for all development
2. **Cultural Validation:** All cultural content reviewed by verified experts
3. **Technical Review:** Code review focusing on accessibility and performance
4. **Testing Requirements:** Unit tests, integration tests, accessibility tests
5. **Documentation Update:** Update relevant docs for user-facing changes

### Code Review Checklist
- [ ] **Cultural Accuracy:** Content reviewed by cultural experts
- [ ] **Accessibility:** WCAG 2.1 AA compliance verified
- [ ] **Performance:** No regression in page load times or audio generation
- [ ] **Security:** Authentication and data protection standards met
- [ ] **Testing:** Adequate test coverage for new functionality
- [ ] **Documentation:** User and developer docs updated

### Release Process
```bash
# Semantic versioning for cultural software
1.0.0 - Major release (new cultural content collections)
1.1.0 - Minor release (new features, improved translations)
1.1.1 - Patch release (bug fixes, cultural accuracy corrections)
```

---

## Code Standards

### TypeScript Configuration
```typescript
// tsconfig.json - Strict configuration for cultural accuracy
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### ESLint Rules
```javascript
// .eslintrc.json - Cultural content specific rules
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "jsx-a11y/alt-text": "error",           // Cultural images need descriptive alt text
    "jsx-a11y/lang": "error",                // Proper language attributes for Chinese content
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-console": "warn"                     // Avoid console logs in production
  }
}
```

### Cultural Content Standards
```typescript
// Cultural content type definitions
interface CulturalPerformance {
  id: string;
  title: {
    chinese: string;        // Traditional Chinese characters
    pinyin: string;         // Romanized pronunciation
    english: string;        // Shakespearean-style translation
  };
  culturalContext: {
    historicalPeriod: HistoricalPeriod;
    culturalSignificance: string;
    expertVerification: ExpertVerification;
  };
  accessibility: {
    altText: string;        // Descriptive text for visual elements
    audioDescription: string; // Vocal description of visual performance
    simplifiedVersion?: string; // Optional simplified cultural explanation
  };
}
```

### Naming Conventions
```typescript
// File naming
performance-viewer.component.tsx    // Components use kebab-case
useCulturalContent.hook.ts          // Hooks use camelCase with .hook suffix
cultural-content.service.ts         // Services use kebab-case
tts-generation.util.ts              // Utilities use kebab-case

// Component naming
export const PerformanceViewer = () => { }     // PascalCase for components
export const useCulturalContent = () => { }    // camelCase for hooks
export const culturalContentService = { }      // camelCase for services

// Constants naming
export const CULTURAL_THEMES = { }             // SCREAMING_SNAKE_CASE
export const DEFAULT_AUDIO_SETTINGS = { }      // SCREAMING_SNAKE_CASE
```

---

## Testing Guidelines

### Testing Strategy
```typescript
// Testing pyramid for cultural software
interface TestingStrategy {
  unit: "70% - Components, utilities, cultural validators";
  integration: "20% - API routes, database operations, TTS generation";
  e2e: "10% - Critical user journeys, accessibility compliance";
}
```

### Unit Testing Standards
```typescript
// Example: Cultural content validation test
describe('CulturalContentValidator', () => {
  it('should validate Ming Dynasty historical accuracy', () => {
    const content: CulturalContent = {
      historicalPeriod: 'ming_dynasty',
      yearCreated: 1598,
      culturalElements: ['scholar_lover', 'garden_imagery']
    };
    
    expect(validateCulturalAccuracy(content)).toBe(true);
  });

  it('should reject culturally inappropriate content', () => {
    const content: CulturalContent = {
      historicalPeriod: 'ming_dynasty',
      yearCreated: 1800, // Anachronistic - Ming ended 1644
      culturalElements: ['western_opera_style'] // Inappropriate mixing
    };
    
    expect(validateCulturalAccuracy(content)).toBe(false);
  });
});
```

### Accessibility Testing
```typescript
// Automated accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('PerformanceViewer Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<PerformanceViewer performance={mockPerformance} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation', () => {
    render(<PerformanceViewer performance={mockPerformance} />);
    const audioPlayer = screen.getByRole('region', { name: 'audio player' });
    
    // Test tab navigation
    userEvent.tab();
    expect(audioPlayer).toHaveFocus();
    
    // Test spacebar play/pause
    userEvent.keyboard(' ');
    expect(mockAudioPlay).toHaveBeenCalled();
  });
});
```

### Integration Testing
```typescript
// Example: TTS integration test
describe('TTS Generation API', () => {
  it('should generate Shakespearean-style audio', async () => {
    const request = {
      text: '原来姹紫嫣红开遍',
      englishTranslation: 'Behold! What feast of purple blooms and crimson fair',
      style: 'shakespearean_actor'
    };

    const response = await POST('/api/tts/generate', request);
    
    expect(response.status).toBe(200);
    expect(response.body.audioUrl).toMatch(/\.mp3$/);
    expect(response.body.duration).toBeGreaterThan(0);
  });
});
```

### Performance Testing
```typescript
// Load testing for audio generation
describe('Audio Performance', () => {
  it('should generate audio within 3 seconds', async () => {
    const startTime = Date.now();
    
    await generateTTSAudio({
      text: 'Medium length Kunqu text segment',
      style: 'shakespearean_actor'
    });
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(3000);
  });
});
```

### Test Commands
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run accessibility tests
npm run test:a11y

# Run end-to-end tests
npm run test:e2e

# Run performance tests
npm run test:performance

# Run cultural content validation
npm run test:cultural
```

---

## Deployment Process

### CI/CD Pipeline
```yaml
# .github/workflows/production.yml
name: Production Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  cultural-validation:
    runs-on: ubuntu-latest
    steps:
      - name: Cultural Content Accuracy Check
        run: npm run validate:cultural-content
      
      - name: Translation Quality Review
        run: npm run validate:translations
        
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - name: TypeScript Check
        run: npx tsc --noEmit
        
      - name: ESLint
        run: npm run lint
        
      - name: Prettier
        run: npm run format:check
        
      - name: Security Audit
        run: npm audit --audit-level moderate

  testing:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]
    steps:
      - name: Unit Tests
        run: npm run test:unit
        
      - name: Integration Tests
        run: npm run test:integration
        
      - name: Accessibility Tests
        run: npm run test:a11y
        
      - name: Performance Tests
        run: npm run test:performance

  build-and-deploy:
    needs: [cultural-validation, code-quality, testing]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Build Application
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  post-deploy:
    needs: build-and-deploy
    runs-on: ubuntu-latest
    steps:
      - name: Health Check
        run: curl -f ${{ secrets.PRODUCTION_URL }}/api/health
        
      - name: Smoke Tests
        run: npm run test:smoke-production
        
      - name: Accessibility Audit
        run: npm run audit:accessibility-production
```

### Environment Configuration
```bash
# Production Environment Variables
DATABASE_URL="postgresql://prod-user:pass@prod-db:5432/voicesofkunqu"
REDIS_URL="redis://prod-redis:6379"
OPENAI_API_KEY="prod_openai_key"
NEXTAUTH_SECRET="production_secret_key"
AWS_S3_BUCKET="voices-of-kunqu-production"
VERCEL_URL="https://voices-of-kunqu.vercel.app"
SENTRY_DSN="https://sentry-dsn"
```

### Database Migration Process
```bash
# Database migration workflow
npm run db:migrate:check      # Check migration status
npm run db:migrate:deploy     # Deploy pending migrations
npm run db:migrate:rollback   # Rollback last migration if needed
npm run db:seed:production    # Seed with cultural content
```

### Performance Monitoring
```typescript
// Production monitoring configuration
const monitoringConfig = {
  lighthouse: {
    performance: ">90",
    accessibility: "100",
    seo: ">90"
  },
  vitals: {
    lcp: "<2.5s",        // Largest Contentful Paint
    fid: "<100ms",       // First Input Delay
    cls: "<0.1"          // Cumulative Layout Shift
  },
  audio: {
    generation: "<3s",    // TTS generation time
    firstPlay: "<1s"      // Time to first audio play
  }
};
```

---

## Cultural Content Guidelines

### Content Authenticity Standards
All cultural content must meet strict authenticity and educational standards:

```typescript
interface CulturalContentStandards {
  authenticity: {
    historicalAccuracy: "All dates, names, and cultural references verified by experts";
    sourceAttribution: "Clear citation of primary sources and cultural institutions";
    expertReview: "Minimum two cultural experts must approve all content";
    versionControl: "Track all changes with cultural reasoning documented";
  };
  
  translation: {
    culturalSensitivity: "Preserve original cultural meaning and context";
    linguisticQuality: "Shakespearean style without losing accessibility";
    accuracy: "Multiple review cycles by language and cultural experts";
    attribution: "Credit all translators and cultural consultants";
  };
  
  accessibility: {
    multipleFormats: "Content available in text, audio, and visual formats";
    languageSupport: "Clear explanations for cultural concepts";
    readingLevels: "Multiple complexity levels without losing authenticity";
    inclusiveDesign: "Consider diverse cultural backgrounds of users";
  };
}
```

### Cultural Review Process
```mermaid
graph TD
    A[Cultural Content Submission] --> B[Initial Technical Review]
    B --> C[Cultural Expert Review]
    C --> D[Translation Quality Check]
    D --> E[Accessibility Review]
    E --> F[Community Beta Testing]
    F --> G[Final Expert Approval]
    G --> H[Publication]
    
    C --> I[Cultural Accuracy Issues]
    I --> J[Expert Consultation]
    J --> C
    
    D --> K[Translation Issues]
    K --> L[Linguistic Review]
    L --> D
```

### Expert Verification System
```typescript
interface CulturalExpert {
  credentials: {
    academicAffiliation: string;      // University or cultural institution
    specialization: CulturalArea[];   // Kunqu, Ming Dynasty, Chinese Literature
    publicationRecord: string[];      // Scholarly articles or books
    performanceExperience?: string;   // Professional Kunqu training
  };
  
  verificationLevel: 'scholar' | 'practitioner' | 'community_recognized';
  approvalAuthority: ContentType[];  // What content types they can approve
  contactInformation: ExpertContact;
}
```

---

## API Integration

### OpenAI TTS Integration
```typescript
// TTS service implementation
class TTSService {
  private openai: OpenAI;
  private cache: RedisCache;
  
  async generateShakespeareanAudio(
    text: string,
    options: TTSOptions
  ): Promise<AudioResult> {
    const cacheKey = this.generateCacheKey(text, options);
    
    // Check cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;
    
    // Generate new audio
    const prompt = `Deliver the following text in the style of a Shakespearean actor, 
                    with cultural reverence and theatrical gravitas: "${text}"`;
    
    const response = await this.openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'nova',
      input: prompt,
      speed: options.speed || 1.0,
      response_format: 'opus'
    });
    
    const audioBuffer = await response.arrayBuffer();
    const audioUrl = await this.uploadToS3(audioBuffer, cacheKey);
    
    const result = {
      audioUrl,
      duration: await this.calculateDuration(audioBuffer),
      cacheKey,
      generatedAt: new Date()
    };
    
    // Cache for future use
    await this.cache.set(cacheKey, result, 60 * 60 * 24); // 24 hours
    
    return result;
  }
}
```

### Database Schema Design
```typescript
// Core cultural content schema
model Performance {
  id                   String   @id @default(cuid())
  
  // Cultural Identity
  titleChinese         String
  titlePinyin          String
  titleEnglish         String
  historicalPeriod     HistoricalPeriod
  culturalTheme        CulturalTheme[]
  
  // Content Structure
  textSegments         TextSegment[]
  audioFiles           AudioFile[]
  culturalNotes        CulturalNote[]
  
  // Educational Metadata
  complexityLevel      ComplexityLevel
  estimatedDuration    Int
  learningObjectives   String[]
  
  // Expert Validation
  culturalExpertId     String
  reviewedAt           DateTime?
  approvedAt           DateTime?
  
  // Search and Discovery
  tags                 String[]
  searchVector         String?  // PostgreSQL tsvector
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  @@fulltext([titleEnglish, culturalNotes])
}

model TextSegment {
  id              String      @id @default(cuid())
  performanceId   String
  performance     Performance @relation(fields: [performanceId], references: [id])
  
  // Text Content
  chineseText     String
  pinyinText      String
  englishText     String
  culturalNotes   String?
  
  // Audio Synchronization
  timestampStart  Int         // Milliseconds
  timestampEnd    Int         // Milliseconds
  audioUrl        String?
  
  // Ordering
  sequenceOrder   Int
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## Performance Optimization

### Frontend Optimization Strategies
```typescript
// Code splitting and lazy loading
const PerformanceViewer = lazy(() => 
  import('../components/cultural/PerformanceViewer')
);

const CulturalGlossary = lazy(() => 
  import('../components/ui/CulturalGlossary')
);

// Audio optimization
class AudioOptimizer {
  static async preloadNextSegments(
    currentSegment: number,
    totalSegments: number,
    preloadCount: number = 3
  ): Promise<void> {
    const nextSegments = Array.from(
      { length: Math.min(preloadCount, totalSegments - currentSegment) },
      (_, i) => currentSegment + i + 1
    );
    
    await Promise.all(
      nextSegments.map(segment => this.preloadAudio(segment))
    );
  }
  
  static async optimizeAudioFormat(
    audioBuffer: ArrayBuffer
  ): Promise<ArrayBuffer> {
    // Convert to Opus format for 50% size reduction
    return await this.convertToOpus(audioBuffer);
  }
}
```

### Caching Strategy
```typescript
// Multi-layer caching implementation
interface CachingStrategy {
  browser: {
    serviceWorker: "Cache cultural assets for offline access";
    localStorage: "User preferences and progress";
    sessionStorage: "Current session data";
  };
  
  edge: {
    vercel: "Static assets and API responses";
    cloudfront: "Global CDN for audio files";
  };
  
  application: {
    redis: "Database query results and session data";
    memory: "Frequently accessed cultural content";
  };
  
  permanent: {
    s3: "Generated audio files with lifecycle management";
    database: "Cultural content with full-text search indexes";
  };
}
```

### Database Optimization
```sql
-- Performance-optimized indexes for cultural content
CREATE INDEX idx_performances_search ON performances 
USING GIN(to_tsvector('english', title_english || ' ' || cultural_notes));

CREATE INDEX idx_performances_discovery ON performances
(complexity_level, historical_period, created_at DESC)
WHERE approved_at IS NOT NULL;

CREATE INDEX idx_text_segments_audio_sync ON text_segments
(performance_id, sequence_order, timestamp_start);

-- Partial indexes for common queries
CREATE INDEX idx_performances_published ON performances(created_at DESC)
WHERE approved_at IS NOT NULL;

CREATE INDEX idx_audio_cache_recent ON audio_cache(created_at DESC)
WHERE created_at > NOW() - INTERVAL '7 days';
```

---

## Security Considerations

### Authentication and Authorization
```typescript
// Role-based access control implementation
enum UserRole {
  USER = 'user',                    // Basic cultural content access
  CULTURAL_EXPERT = 'cultural_expert', // Content creation and review
  MODERATOR = 'moderator',          // Community management
  ADMIN = 'admin'                   // Full system access
}

interface PermissionMatrix {
  [UserRole.USER]: [
    'read:performances',
    'read:cultural-content',
    'create:user-progress',
    'participate:community'
  ];
  [UserRole.CULTURAL_EXPERT]: [
    ...USER_PERMISSIONS,
    'create:cultural-content',
    'review:translations',
    'approve:cultural-accuracy'
  ];
  [UserRole.ADMIN]: [
    'all:permissions'
  ];
}
```

### Data Protection
```typescript
// GDPR compliance implementation
class DataProtectionService {
  static async exportUserData(userId: string): Promise<UserDataExport> {
    const userData = {
      profile: await this.getUserProfile(userId),
      progress: await this.getLearningProgress(userId),
      contributions: await this.getCommunityContributions(userId),
      preferences: await this.getUserPreferences(userId)
    };
    
    // Remove all PII and keep only educational data
    return this.anonymizeData(userData);
  }
  
  static async deleteUserAccount(userId: string): Promise<void> {
    await this.transaction(async (tx) => {
      // Keep educational contributions but anonymize
      await tx.communityPosts.updateMany({
        where: { userId },
        data: { userId: null, authorName: 'Anonymous User' }
      });
      
      // Delete personal data completely
      await tx.user.delete({ where: { id: userId } });
      await tx.userProgress.deleteMany({ where: { userId } });
      await tx.userPreferences.deleteMany({ where: { userId } });
    });
  }
}
```

### API Security
```typescript
// Rate limiting and security headers
export const securityConfig = {
  rateLimit: {
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 100,                     // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },
  
  headers: {
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://vercel.live;
      style-src 'self' 'unsafe-inline';
      media-src 'self' https://cdn.voicesofkunqu.org;
      connect-src 'self' https://api.openai.com;
    `,
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
};
```

---

## Troubleshooting

### Common Development Issues

#### Audio Generation Problems
```typescript
// Debug TTS generation issues
class TTSDebugger {
  static async diagnoseTTSIssue(error: TTSError): Promise<DiagnosisResult> {
    const diagnosis = {
      apiKeyValid: await this.validateAPIKey(),
      rateLimitStatus: await this.checkRateLimit(),
      textLength: error.inputText.length,
      cacheStatus: await this.checkAudioCache(),
      networkConnectivity: await this.pingOpenAI()
    };
    
    if (!diagnosis.apiKeyValid) {
      return {
        issue: 'Invalid OpenAI API key',
        solution: 'Check OPENAI_API_KEY environment variable'
      };
    }
    
    if (diagnosis.textLength > 4096) {
      return {
        issue: 'Text too long for TTS generation',
        solution: 'Split text into smaller segments'
      };
    }
    
    return { issue: 'Unknown TTS error', diagnosis };
  }
}
```

#### Database Connection Issues
```bash
# Database troubleshooting commands
npm run db:status          # Check database connection
npm run db:reset           # Reset database to clean state
npm run db:seed:dev        # Seed with development data
npm run db:migrate:status  # Check migration status
npm run db:logs           # View recent database logs
```

#### Performance Issues
```typescript
// Performance debugging utilities
class PerformanceDebugger {
  static async analyzePagePerformance(url: string): Promise<PerformanceReport> {
    const metrics = await this.lighthouse.audit(url);
    
    return {
      performanceScore: metrics.performance,
      accessibilityScore: metrics.accessibility,
      loadTime: metrics.firstContentfulPaint,
      audioGenerationTime: await this.measureTTSGeneration(),
      cacheHitRate: await this.getCacheMetrics()
    };
  }
  
  static async optimizationSuggestions(report: PerformanceReport): Promise<string[]> {
    const suggestions = [];
    
    if (report.loadTime > 3000) {
      suggestions.push('Consider implementing code splitting');
      suggestions.push('Optimize images with next/image');
    }
    
    if (report.audioGenerationTime > 3000) {
      suggestions.push('Implement audio preloading');
      suggestions.push('Check OpenAI API response times');
    }
    
    return suggestions;
  }
}
```

### Debug Environment Setup
```bash
# Development debugging tools
npm run debug:dev          # Start with debugging enabled
npm run debug:tts          # Debug TTS generation specifically
npm run debug:cultural     # Debug cultural content validation
npm run debug:performance  # Performance profiling mode
```

---

## Contributing Guidelines

### Getting Started as a Contributor
1. **Read Cultural Guidelines:** Understand our commitment to cultural authenticity
2. **Set Up Development Environment:** Follow setup instructions above
3. **Pick Your First Issue:** Look for `good-first-issue` labels on GitHub
4. **Join Community:** Participate in developer discussions and cultural review

### Contribution Types
```typescript
interface ContributionTypes {
  code: {
    bugfixes: "Fix technical issues and improve reliability";
    features: "Add new functionality enhancing cultural education";
    performance: "Optimize loading times and user experience";
    accessibility: "Improve WCAG compliance and inclusive design";
  };
  
  cultural: {
    content: "Add new Kunqu performances with expert verification";
    translations: "Improve English adaptations and cultural context";
    validation: "Review content for historical and cultural accuracy";
    education: "Develop learning pathways and pedagogical resources";
  };
  
  documentation: {
    user: "Improve user guides and educational materials";
    developer: "Enhance technical documentation and API guides";
    cultural: "Document cultural practices and historical context";
    accessibility: "Create inclusive documentation for diverse users";
  };
}
```

### Cultural Content Contribution Process
1. **Expert Verification:** Cultural contributors must be verified experts
2. **Source Documentation:** All content requires primary source attribution
3. **Multi-Expert Review:** Minimum two experts must approve cultural additions
4. **Educational Alignment:** Content must support defined learning objectives
5. **Accessibility Compliance:** All content must meet WCAG 2.1 AA standards

### Code Contribution Standards
```typescript
// Example contribution checklist
interface ContributionChecklist {
  technical: [
    "Code follows TypeScript strict mode standards",
    "All functions have proper type definitions", 
    "Components are properly tested with Jest",
    "Accessibility tested with jest-axe",
    "Performance impact measured and documented"
  ];
  
  cultural: [
    "Cultural content reviewed by verified experts",
    "Historical accuracy verified with primary sources",
    "Translation quality approved by language specialists",
    "Cultural sensitivity reviewed by community",
    "Educational value assessed by pedagogy experts"
  ];
  
  documentation: [
    "User-facing changes documented in USER_GUIDE.md",
    "API changes documented in API_DOCS.md",
    "Cultural decisions documented with reasoning",
    "Breaking changes clearly communicated",
    "Examples provided for new features"
  ];
}
```

### Recognition and Attribution
- **Cultural Experts:** Listed in credits with academic affiliations
- **Technical Contributors:** GitHub contributor recognition and optional bio
- **Community Members:** Special mention for significant cultural insights
- **Educational Partners:** Institutional partnership acknowledgment

---

## Support and Resources

### Getting Help
- **Technical Issues:** Create GitHub issue with reproduction steps
- **Cultural Questions:** Create GitHub issue with 'cultural-expert' label
- **Documentation:** Check docs/ directory for comprehensive guides
- **Community:** Join developer discussions in community forums

### Learning Resources
- **Kunqu Culture:** Comprehensive reading list in USER_GUIDE.md cultural resources
- **Next.js Development:** Official Next.js documentation and tutorials
- **Accessibility:** WCAG 2.1 guidelines and inclusive design resources
- **TypeScript:** Official TypeScript handbook and advanced patterns

### Contact Information
- **Project Lead:** zhehongl91@gmail.com
- **Cultural Advisory:** GitHub issue with 'cultural-expert' label
- **Technical Support:** GitHub issue with 'technical-support' label
- **Community:** GitHub Discussions tab

---

**Welcome to the Voices of Kunqu development community!** Our mission combines technical excellence with cultural preservation, creating an inclusive platform that bridges 600 years of Chinese artistic tradition with modern digital accessibility. Every contribution helps preserve and share this UNESCO World Heritage art form with global audiences.

*Last Updated: 2025-08-03*  
*Version: 1.0*