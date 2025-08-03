# Voices of Kunqu API Documentation

**Version:** 1.0  
**Last Updated:** 2025-08-03  
**Target Audience:** External developers integrating with Voices of Kunqu platform

---

## Overview

The Voices of Kunqu API provides programmatic access to our comprehensive collection of Kunqu opera performances, cultural context, and educational content. This RESTful API enables developers to integrate authentic Chinese cultural content with Shakespearean-style English translations into their own applications.

### Base URL
```
Production: https://voices-of-kunqu.vercel.app/api/v1
Staging: https://voices-of-kunqu-staging.vercel.app/api/v1
```

### API Philosophy
Our API is designed with cultural sensitivity and educational purpose at its core. All endpoints respect the artistic integrity of Kunqu opera while providing accessible pathways for cross-cultural understanding.

---

## Authentication

### API Key Authentication
All API requests require authentication using API keys in the request header:

```http
Authorization: Bearer YOUR_API_KEY
```

### Obtaining API Keys
API keys are available for educational and non-commercial use:

1. **Educational Institutions:** Free tier with 10,000 requests/month
2. **Cultural Organizations:** Free tier with 25,000 requests/month  
3. **Researchers:** Free tier with 5,000 requests/month
4. **Commercial Projects:** Create GitHub issue with 'partnership' label

### Rate Limiting
- **Free Tier:** 100 requests per hour
- **Educational:** 500 requests per hour
- **Cultural Orgs:** 1,000 requests per hour

Rate limit headers included in all responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1691234567
```

---

## Content Structure

### Performance Object
```json
{
  "id": "kunqu_001",
  "title": {
    "chinese": "牡丹亭·游园",
    "pinyin": "Mǔdān Tíng · Yóuyuán", 
    "english": "The Peony Pavilion: Strolling in the Garden"
  },
  "duration": 1847,
  "theme": "romantic_longing",
  "complexity": "intermediate",
  "historical_period": "ming_dynasty",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-02-01T14:20:00Z",
  "cultural_context": {
    "background": "String describing historical and cultural significance",
    "symbols": ["garden", "spring", "youth", "desire"],
    "shakespeare_parallels": ["Romeo and Juliet", "A Midsummer Night's Dream"]
  },
  "audio": {
    "original_chinese": "https://cdn.voicesofkunqu.org/audio/kunqu_001_cn.mp3",
    "english_tts": "https://cdn.voicesofkunqu.org/audio/kunqu_001_en.mp3",
    "pronunciation_guide": "https://cdn.voicesofkunqu.org/audio/kunqu_001_guide.mp3"
  },
  "text_content": {
    "segments": [
      {
        "id": "seg_001",
        "chinese": "原来姹紫嫣红开遍",
        "pinyin": "yuánlái chàzǐ yānhóng kāi biàn",
        "english": "Behold! What feast of purple blooms and crimson fair",
        "timestamp_start": 0,
        "timestamp_end": 4500,
        "cultural_notes": "Classical reference to natural beauty and transience"
      }
    ]
  }
}
```

---

## Core Endpoints

### Performances

#### GET /performances
Retrieve collection of Kunqu performances with filtering and pagination.

**Parameters:**
- `theme` (string): Filter by emotional theme (romantic_longing, heroic_journey, etc.)
- `complexity` (string): beginner | intermediate | advanced
- `duration_min` (integer): Minimum duration in seconds
- `duration_max` (integer): Maximum duration in seconds
- `historical_period` (string): ming_dynasty | qing_dynasty | contemporary
- `page` (integer): Page number (default: 1)
- `limit` (integer): Results per page (max: 50, default: 20)

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.voicesofkunqu.org/v1/performances?theme=romantic_longing&complexity=beginner&limit=10"
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "kunqu_001",
      "title": {
        "chinese": "牡丹亭·游园",
        "english": "The Peony Pavilion: Strolling in the Garden"
      },
      "duration": 1847,
      "theme": "romantic_longing",
      "complexity": "beginner"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "total_pages": 5
  }
}
```

#### GET /performances/{id}
Retrieve complete performance details including all text segments and audio resources.

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.voicesofkunqu.org/v1/performances/kunqu_001"
```

#### GET /performances/{id}/audio/{type}
Direct access to audio resources with streaming support.

**Parameters:**
- `type`: original_chinese | english_tts | pronunciation_guide
- `format`: mp3 | wav (default: mp3)
- `quality`: low | medium | high (default: medium)

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.voicesofkunqu.org/v1/performances/kunqu_001/audio/english_tts?quality=high"
```

#### POST /performances/{id}/generate-audio
Generate custom English TTS with specific style instructions.

**Request Body:**
```json
{
  "style": "shakespearean_actor",
  "speed": 1.0,
  "voice_character": "classical_male",
  "segments": ["seg_001", "seg_003", "seg_007"]
}
```

### Cultural Context

#### GET /glossary
Comprehensive glossary of Kunqu terms with cultural explanations.

**Parameters:**
- `search` (string): Search term in Chinese, pinyin, or English
- `category` (string): music | movement | costume | character_types
- `difficulty` (string): basic | intermediate | scholarly

**Example Response:**
```json
{
  "data": [
    {
      "term_chinese": "水磨调",
      "term_pinyin": "shuǐmó diào",
      "term_english": "water-mill melody",
      "definition": "The refined, slow-tempo musical style characteristic of Kunqu opera, emphasizing subtle emotional expression through sustained melodic lines.",
      "cultural_significance": "Represents the sophisticated aesthetic of Ming Dynasty literati culture",
      "audio_pronunciation": "https://cdn.voicesofkunqu.org/glossary/shuimo_diao.mp3",
      "related_terms": ["kunshan_qiang", "classical_melody"],
      "shakespeare_equivalent": "Similar to iambic pentameter in creating measured, artistic speech rhythm"
    }
  ]
}
```

#### GET /timeline
Historical timeline connecting Kunqu development with global theatrical traditions.

**Example Response:**
```json
{
  "data": [
    {
      "year": 1579,
      "event_chinese": "魏良辅改良昆山腔",
      "event_english": "Wei Liangfu refines Kunshan melody style",
      "significance": "Established the musical foundation of modern Kunqu opera",
      "global_context": "15 years after Shakespeare's birth, during early English Renaissance theater",
      "cultural_impact": "high"
    }
  ]
}
```

### Search and Discovery

#### GET /search
Unified search across performances, cultural content, and educational materials.

**Parameters:**
- `q` (string): Search query
- `type` (string): performance | glossary | cultural_context | all
- `language` (string): chinese | english | pinyin
- `limit` (integer): Results per page (max: 100, default: 20)

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.voicesofkunqu.org/v1/search?q=garden&type=performance&language=english"
```

#### GET /recommendations
Personalized content recommendations based on user preferences.

**Parameters:**
- `user_level` (string): beginner | intermediate | advanced
- `interests` (array): Cultural themes of interest
- `previous_content` (array): Previously accessed performance IDs

---

## Text-to-Speech Integration

### Real-time TTS Generation

#### POST /tts/generate
Generate Shakespearean-style English audio from Kunqu text segments.

**Request Body:**
```json
{
  "text": "Behold! What feast of purple blooms and crimson fair",
  "style": {
    "voice_character": "classical_male",
    "delivery_style": "shakespearean_actor", 
    "emotion": "contemplative",
    "pace": "measured"
  },
  "output_format": "mp3",
  "quality": "high"
}
```

**Response:**
```json
{
  "audio_url": "https://cdn.voicesofkunqu.org/generated/tts_abc123.mp3",
  "duration": 4.7,
  "expires_at": "2025-08-04T10:30:00Z",
  "cost_credits": 3
}
```

### Voice Customization Options

| Parameter | Options | Description |
|-----------|---------|-------------|
| `voice_character` | classical_male, classical_female, narrator | Voice persona |
| `delivery_style` | shakespearean_actor, academic_lecture, storyteller | Performance style |
| `emotion` | contemplative, passionate, melancholic, joyful | Emotional tone |
| `pace` | slow, measured, moderate, brisk | Speaking speed |

---

## Educational Pathways

### Learning Paths

#### GET /learning-paths
Structured educational journeys for different user types.

**Response:**
```json
{
  "data": [
    {
      "id": "beginner_cultural_bridge",
      "title": "From Shakespeare to Kunqu: A Cultural Bridge",
      "description": "Introduction to Kunqu through familiar English literary traditions",
      "estimated_duration": "4 hours",
      "lesson_count": 12,
      "completion_rate": 0.73,
      "prerequisites": [],
      "target_audience": "cultural_enthusiasts"
    }
  ]
}
```

#### GET /learning-paths/{id}/lessons
Retrieve structured lesson content within a learning path.

#### POST /learning-paths/{id}/progress
Track user progress through educational content.

---

## Webhook Integration

### Event Notifications
Subscribe to events for real-time updates on content additions and user engagement.

#### Supported Events
- `performance.added` - New Kunqu performance published
- `performance.updated` - Existing performance content modified
- `cultural_context.added` - New educational content available
- `user.milestone_reached` - User completes significant learning milestone

#### Webhook Configuration
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhooks/voicesofkunqu",
    "events": ["performance.added", "cultural_context.added"],
    "secret": "your_webhook_secret"
  }' \
  "https://api.voicesofkunqu.org/v1/webhooks"
```

---

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "CULTURAL_CONTENT_NOT_FOUND",
    "message": "The requested Kunqu performance could not be located",
    "details": "Performance ID 'kunqu_999' does not exist in our cultural database",
    "timestamp": "2025-08-03T15:30:00Z",
    "request_id": "req_abc123def456"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_API_KEY` | 401 | API key missing or invalid |
| `RATE_LIMIT_EXCEEDED` | 429 | Request rate limit exceeded |
| `CULTURAL_CONTENT_NOT_FOUND` | 404 | Requested cultural content not available |
| `INVALID_PARAMETERS` | 400 | Request parameters invalid or malformed |
| `TTS_GENERATION_FAILED` | 503 | Text-to-speech service temporarily unavailable |
| `CULTURAL_ACCURACY_VIOLATION` | 422 | Request violates cultural authenticity guidelines |

---

## SDK and Libraries

### Official SDKs
- **JavaScript/TypeScript:** `npm install @voicesofkunqu/api-client`
- **Python:** `pip install voicesofkunqu-api`
- **PHP:** `composer require voicesofkunqu/api-client`

### JavaScript Example
```javascript
import { VoicesOfKunquAPI } from '@voicesofkunqu/api-client';

const client = new VoicesOfKunquAPI('YOUR_API_KEY');

// Fetch beginner-friendly performances
const performances = await client.performances.list({
  complexity: 'beginner',
  theme: 'romantic_longing',
  limit: 5
});

// Generate custom English audio
const audio = await client.tts.generate({
  text: 'Behold! What feast of purple blooms and crimson fair',
  style: {
    voice_character: 'classical_male',
    delivery_style: 'shakespearean_actor'
  }
});
```

### Python Example
```python
from voicesofkunqu import VoicesOfKunquAPI

client = VoicesOfKunquAPI(api_key='YOUR_API_KEY')

# Search for garden-themed content
results = client.search(
    query='garden',
    type='performance',
    language='english'
)

# Access cultural glossary
glossary = client.glossary.search(
    term='water-mill melody',
    category='music'
)
```

---

## Best Practices

### Cultural Sensitivity Guidelines
1. **Respect Cultural Context:** Always present Kunqu content with appropriate cultural background
2. **Attribution Required:** Credit source performers and cultural institutions
3. **Non-Commercial Use:** Educational and cultural exchange purposes prioritized
4. **Accurate Representation:** Maintain authenticity of cultural interpretations

### Performance Optimization
1. **Cache Audio Resources:** Generated TTS audio expires after 24 hours
2. **Batch Requests:** Use bulk endpoints for multiple performance queries
3. **Compression:** Enable gzip compression for large cultural datasets
4. **CDN Integration:** Leverage our global CDN for media assets

### Integration Patterns
1. **Progressive Enhancement:** Core content accessible without JavaScript
2. **Offline Capability:** Cache critical cultural content for offline access
3. **Responsive Design:** Ensure cultural content readable on all devices
4. **Accessibility:** Follow WCAG 2.1 AA standards for inclusive cultural education

---

## Support and Community

### Technical Support
- **Documentation:** See docs/ folder in repository
- **GitHub Issues:** https://github.com/Lucia0501/Voices-of-Kunqu/issues
- **Community Discussions:** GitHub Discussions tab
- **Support:** Create GitHub issue with 'support' label

### Cultural Consultation
- **Expert Network:** Access to verified Kunqu scholars and practitioners
- **Cultural Review:** Content accuracy verification services
- **Educational Partnerships:** Integration support for academic institutions

### Rate Limits and Quotas
Monitor your usage through the developer dashboard:
```
https://dashboard.voicesofkunqu.org/api-usage
```

---

## Changelog

### Version 1.0 (2025-08-03)
- Initial API release
- Core performance and cultural content endpoints
- Real-time TTS generation with Shakespearean styling
- Educational pathway integration
- Comprehensive cultural glossary access

### Upcoming Features
- **Q4 2025:** VR performance space integration endpoints
- **Q1 2026:** AI-powered cultural translator API
- **Q2 2026:** Collaborative annotation system API
- **Q3 2026:** Multi-language expansion support

---

**Cultural Heritage Through Technology**  
The Voices of Kunqu API bridges 600 years of cultural tradition with modern digital accessibility, enabling developers to create respectful, educational, and engaging cross-cultural experiences.

For partnership opportunities and cultural collaboration:  
**GitHub:** https://github.com/Lucia0501/Voices-of-Kunqu  
**Issues:** Create GitHub issue with 'partnership' label