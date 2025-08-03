# Voices of Kunqu 🎭

> Bridging 600 years of Chinese opera tradition with British audiences through AI-powered cultural education

**Voices of Kunqu** is a non-profit educational web application that makes traditional Chinese Kunqu opera accessible to British audiences through innovative technology. By combining authentic cultural content with Shakespearean-style English translations and AI-powered text-to-speech, we create an immersive bridge between Eastern and Western theatrical traditions.

[![Production Deploy](https://github.com/Icarus603/Voices-of-Kunqu/actions/workflows/production-deploy.yml/badge.svg)](https://github.com/Icarus603/Voices-of-Kunqu/actions/workflows/production-deploy.yml)
[![Security Scan](https://github.com/Icarus603/Voices-of-Kunqu/actions/workflows/security-scan.yml/badge.svg)](https://github.com/Icarus603/Voices-of-Kunqu/actions/workflows/security-scan.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)

## 🌟 Features

### 🎵 **Audio-First Cultural Experience**
- **AI-Powered Text-to-Speech**: OpenAI TTS generates Shakespearean-style English narration
- **Synchronized Text Display**: Real-time highlighting as audio plays
- **Cultural Pronunciation Guides**: Authentic Chinese pronunciation with English phonetics
- **Accessibility Controls**: Full keyboard navigation and screen reader support

### 🎭 **Comprehensive Cultural Library**
- **20+ Kunqu Performances**: Curated collection spanning 600 years of tradition
- **Interactive Glossary**: 100+ cultural terms with cross-references
- **Historical Timeline**: Parallel development of Chinese and British theater
- **Character Archetypes**: Detailed explanations with visual references

### 📚 **Educational Pathways**
- **Beginner's Journey**: Introduction through familiar Shakespearean themes
- **Scholar's Path**: Deep dive into historical and cultural significance
- **Performer's Path**: Technical analysis of vocal techniques and movement
- **Progress Tracking**: Personal learning analytics and achievements

### 🤝 **Cultural Bridge**
- **Shakespeare-Kunqu Parallels**: Side-by-side thematic and technical comparisons
- **Cross-Cultural Context**: British cultural equivalents for Chinese concepts
- **Expert Validation**: All content reviewed by certified cultural experts
- **Community Discussions**: Moderated forums for cultural exchange

## 🚀 Quick Start

### Prerequisites
- Node.js 20.0.0 or higher
- PostgreSQL 15 or higher
- Redis 7 or higher
- OpenAI API key with TTS access

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/Icarus603/Voices-of-Kunqu.git
cd Voices-of-Kunqu

# Install dependencies
npm install

# Set up environment variables
cp .env.sample .env.local
# Edit .env.local with your configuration

# Set up database
npx prisma migrate dev
npx prisma generate
npx prisma db seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Docker Development

```bash
# Start with Docker Compose
docker-compose up -d

# Run database migrations
docker-compose exec app npx prisma migrate dev

# View logs
docker-compose logs -f app
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL with Redis caching
- **Authentication**: NextAuth.js with role-based access
- **External APIs**: OpenAI TTS, AWS S3
- **Deployment**: Vercel with AWS infrastructure

### Key Components
- **Cultural Content Management**: Version-controlled cultural accuracy
- **Audio Engine**: Optimized TTS with intelligent caching
- **User Progress System**: Personalized learning analytics
- **Expert Validation Workflow**: Multi-level content review process

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [📋 PRD.md](./PRD.md) | Product requirements and business objectives |
| [🏗️ ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture and system design |
| [🔧 DEV_PLAN.md](./DEV_PLAN.md) | Development roadmap and implementation plan |
| [🌐 API_DESIGN.md](./API_DESIGN.md) | API specifications and endpoints |
| [✅ QA_CHECKLIST.md](./QA_CHECKLIST.md) | Quality assurance standards and testing |
| [🚀 DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Production deployment instructions |
| [📝 CHANGELOG.md](./CHANGELOG.md) | Version history and release notes |

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y

# Cultural content validation
npm run validate:cultural
```

### Test Coverage
- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Complete user workflows and cultural features
- **Accessibility Tests**: WCAG 2.1 AA compliance verification
- **Cultural Validation**: Expert review and authenticity checks

## 🚀 Deployment

### Production Deployment
The application is designed for deployment on Vercel with AWS infrastructure:

```bash
# Deploy to production
vercel --prod

# Run post-deployment verification
npm run verify:production
```

### Infrastructure Requirements
- **Hosting**: Vercel Pro (recommended)
- **Database**: PostgreSQL (AWS RDS or Supabase)
- **Cache**: Redis (AWS ElastiCache or Upstash)
- **Storage**: AWS S3 + CloudFront CDN
- **Monitoring**: Vercel Analytics + Sentry

For complete deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## 🎯 Performance

- **Page Load Time**: < 3 seconds for initial content
- **Audio Generation**: < 3 seconds for 500-word segments
- **Search Response**: < 500ms for cultural content queries
- **Accessibility**: 100% WCAG 2.1 AA compliance
- **SEO**: Optimized for cultural content discoverability

## 🔒 Security

- **Authentication**: Secure JWT with refresh token rotation
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: GDPR compliance with minimal data collection
- **Content Security**: Cultural expert validation and version control
- **Infrastructure**: Security headers, rate limiting, and vulnerability scanning

## 🌍 Accessibility & Internationalization

### Accessibility Features
- **Visual**: High contrast ratios, scalable text up to 200%
- **Motor**: Full keyboard navigation, 44px minimum touch targets
- **Auditory**: Captions for all audio, adjustable playback speeds
- **Cognitive**: Clear navigation, consistent interaction patterns

### Cultural Sensitivity
- **Expert Validation**: All content reviewed by Kunqu scholars
- **Respectful Presentation**: Culturally appropriate design and language
- **Attribution**: Clear sourcing and contributor recognition
- **Community Input**: Feedback integration with expert validation

## 🤝 Contributing

We welcome contributions that enhance cultural education and accessibility! Please read our contributing guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/cultural-enhancement`
3. Make your changes with cultural sensitivity
4. Add tests for new functionality
5. Ensure accessibility compliance
6. Submit a pull request with detailed description

### Cultural Content Contributions
- **Expert Review Required**: Cultural content must be validated by certified experts
- **Attribution**: Provide clear sourcing for all cultural materials
- **Sensitivity**: Maintain respect for traditional Chinese culture
- **Accuracy**: Verify historical and cultural accuracy

### Development Guidelines
- Follow TypeScript strict mode standards
- Maintain 90%+ test coverage
- Ensure WCAG 2.1 AA compliance
- Document cultural context and decisions

## 🎓 Educational Impact

### Target Metrics
- **User Engagement**: 70% completion rate for cultural experiences
- **Learning Effectiveness**: 50% improvement in cultural knowledge
- **Accessibility**: 100% inclusive design compliance
- **Cultural Reach**: Partnerships with 5+ UK cultural institutions

### Success Stories
- Academic adoption in UK universities
- Cultural institution partnerships
- Positive feedback from Kunqu experts
- International cultural preservation recognition

## 📞 Support & Community

### Getting Help
- **Documentation**: Comprehensive guides in `/docs`
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: Community forum for cultural questions
- **Email**: [support@voices-of-kunqu.org](mailto:support@voices-of-kunqu.org)

### Cultural Expert Network
- **Advisory Board**: Recognized Kunqu scholars and practitioners
- **Content Review**: Multi-expert validation process
- **Community Contributions**: Verified expert contributor system
- **Educational Partnerships**: UK universities and cultural institutions

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Cultural Content License
Cultural content is provided under additional terms ensuring:
- Respectful use of traditional Chinese cultural heritage
- Appropriate attribution to cultural experts and sources
- Educational and cultural preservation focus
- Expert validation for content modifications

## 🙏 Acknowledgments

- **Jiangsu Performing Arts Group**: Authentic Kunqu performance content
- **Cambridge Digital Museum**: Historical context and academic collaboration  
- **Cultural Experts**: Dr. Zhang Wei, Professor Li Ming, and the advisory board
- **Accessibility Consultants**: Ensuring inclusive design throughout
- **Open Source Community**: Technologies that make this platform possible

---

**Made with ❤️ for cultural preservation and cross-cultural understanding**

*Voices of Kunqu is a non-profit initiative dedicated to preserving and sharing the UNESCO-recognized heritage of Kunqu opera with global audiences through innovative technology and respectful cultural presentation.*