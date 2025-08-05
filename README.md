# Voice of Kunqu 昆曲之声

A sophisticated web application that bridges Eastern and Western literary traditions by presenting Kunqu Opera texts with dual English translations (Shakespeare-style and literal) enhanced with AI-powered audio narration.

## ✨ Features

- **Bilingual Text Display**: Split-screen layout showing Shakespeare-style vs literal translations
- **AI Audio Narration**: OpenAI TTS with poetic, emotional voice styling using "onyx" voice
- **Cultural Design**: Traditional Chinese color palette and typography
- **Mobile-First**: Responsive design with touch gestures and swipe navigation
- **Performance Optimized**: Next.js 15+ with SSG for fast loading
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation

## 🎭 Included Operas

1. **The Interrupted Dream** (牡丹亭) - Tang Xianzu
2. **Romance of the Western Chamber** (西厢记) - Wang Shifu
3. **The Story of the Lute** (琵琶记) - Gao Ming
4. **Fifteen Strings of Cash** (十五贯) - Zhu Suchen
5. **The Jade Hairpin** (玉簪记) - Gao Lian
6. **Palace of Eternal Life** (长生殿) - Hong Sheng

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17+ 
- npm or yarn
- OpenAI API key (for TTS functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lucia0501/Voices-of-Kunqu.git
   cd Voices-of-Kunqu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-proj-your-openai-api-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom cultural colors
- **Animations**: Framer Motion
- **Text-to-Speech**: OpenAI TTS API (gpt-4o-mini-tts model)
- **Fonts**: Google Fonts (Noto Serif SC, Crimson Text)
- **Deployment**: Vercel

## 🎨 Cultural Design System

### Colors
- **Imperial Red**: `#DC143C` - Traditional Chinese red
- **Imperial Gold**: `#FFD700` - Imperial gold accents  
- **Imperial Jade**: `#00A86B` - Jade green highlights
- **Imperial Ink**: `#2F4F4F` - Deep ink black for text

### Typography
- **Chinese Text**: Noto Serif SC (Google Fonts)
- **English Text**: Crimson Text (Google Fonts)
- **Responsive scaling** for optimal readability

## 📱 Mobile Features

- **Swipe Navigation**: Swipe left/right to navigate between paragraphs
- **Touch-Friendly**: Large touch targets and optimized spacing
- **Responsive Layout**: Vertical stacking on mobile, side-by-side on desktop
- **Progressive Web App**: Offline-capable and installable

## 🔊 Audio Features

- **AI-Powered TTS**: OpenAI gpt-4o-mini-tts with "onyx" voice (deep and authoritative)
- **Poetic Delivery**: Custom voice instructions for emotional, dramatic narration
- **Natural Pauses**: Intelligent pacing with breathing pauses and emotional peaks
- **Playback Controls**: Play/pause, speed control, progress tracking
- **Smart Fallback**: Browser Web Speech API when OpenAI TTS fails
- **Error Handling**: Graceful degradation for network issues

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - `OPENAI_API_KEY`: Your OpenAI API key

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Local Production Build

```bash
npm run build
npm start
```

*Preserving cultural heritage through modern technology* 🎭✨
