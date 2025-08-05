# Voice of Kunqu - Deployment Guide

A classical Chinese opera web application with AI-powered narration.

## 🚀 Quick Start for Users

### Option 1: Development Mode (Recommended for testing)
```bash
# 1. Clone the repository
git clone https://github.com/Lucia0501/Voices-of-Kunqu.git
cd Voices-of-Kunqu

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key:
# OPENAI_API_KEY=sk-proj-your-key-here

# 4. Start the development server
npm run dev

# 5. Open in browser
open http://localhost:3000
```

### Option 2: Production Build
```bash
# 1. Build for production
npm run build

# 2. Start production server
npm start

# 3. Open in browser
open http://localhost:3000
```

### Voice Options
The app uses OpenAI's "onyx" voice (deep and authoritative). Available voices:
- `alloy` - Neutral and balanced
- `echo` - Smooth and articulate  
- `fable` - Expressive and dynamic
- `onyx` - Deep and authoritative (current)
- `nova` - Warm and friendly
- `shimmer` - Soft and pleasant

## 🎭 Features

- **6 Classical Operas**: 牡丹亭, 西厢记, 琵琶记, 十五贯, 玉簪记, 长生殿
- **Split-screen Translations**: Shakespeare-style poetic and literal translations
- **AI Narration**: OpenAI TTS with poetic, emotional voice styling
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Offline Content**: All opera texts included, only audio requires internet

## 🌐 Deployment Options

### Local Deployment
Perfect for personal use or small groups:
```bash
npm run dev  # Development mode
# or
npm run build && npm start  # Production mode
```

### Cloud Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

#### Netlify
```bash
# Build command: npm run build
# Publish directory: .next
# Add environment variables in Netlify dashboard
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔊 Audio Features

- **Primary**: OpenAI TTS with gpt-4o-mini-tts model
- **Fallback**: Browser Web Speech API
- **Voice Instructions**: Poetic delivery with natural pauses and emotional expression

## 🎨 Customization

### Changing Voice
Edit `/src/components/opera/AudioController.tsx`:
```typescript
voice: 'nova', // Change from 'onyx' to any available voice
```

### Modifying Instructions
Edit `/src/app/api/tts/route.ts` to customize the voice delivery style.

## 📱 Usage

1. **Home Page**: Browse 6 opera cards
2. **Opera Page**: Click any opera to read with audio
3. **Audio Control**: Play button generates and plays narration
4. **Text Viewing**: Split-screen shows original Chinese, poetic English, and literal translation

## 🛠 Troubleshooting

### Audio Not Working
- Check OpenAI API key in `.env`
- Check browser console for errors

### Build Errors
- Clear cache: `rm -rf .next node_modules && npm install`
- Check Node.js version: `node --version` (requires 18.17+)

## 📄 License

This project showcases classical Chinese opera with modern web technology.

## 🤝 Support

For technical issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Test with `npm run dev` first before production build