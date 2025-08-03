import type { Metadata } from 'next';
import { Inter, Playfair_Display, Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from './providers';

// Font configurations for cultural content
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-cultural',
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-chinese',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Voices of Kunqu | Bridging Chinese Opera with British Audiences',
    template: '%s | Voices of Kunqu',
  },
  description:
    'Experience the 600-year-old art of Kunqu opera through AI-powered Shakespearean-style English translations. A cultural bridge between Chinese and British performing arts traditions.',
  keywords: [
    'Kunqu opera',
    'Chinese culture',
    'Shakespeare',
    'cultural education',
    'text-to-speech',
    'accessibility',
    'performing arts',
    'cultural bridge',
    'British education',
    'Chinese heritage',
  ],
  authors: [{ name: 'Icarus', email: 'zhehongl91@gmail.com' }],
  creator: 'Voices of Kunqu Team',
  publisher: 'Voices of Kunqu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://voices-of-kunqu.org'
      : 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
    languages: {
      'en-GB': '/en-GB',
      'zh-CN': '/zh-CN',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: '/',
    title: 'Voices of Kunqu | Bridging Chinese Opera with British Audiences',
    description:
      'Experience the 600-year-old art of Kunqu opera through AI-powered Shakespearean-style English translations.',
    siteName: 'Voices of Kunqu',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voices of Kunqu - Cultural Bridge Between Chinese and British Arts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voices of Kunqu | Cultural Bridge Through AI-Powered Translation',
    description:
      'Experience Kunqu opera through Shakespearean-style English translations.',
    images: ['/twitter-image.jpg'],
    creator: '@VoicesOfKunqu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
  category: 'education',
  classification: 'Cultural Education Platform',
  other: {
    'cultural-focus': 'Kunqu Opera',
    'target-audience': 'British Cultural Enthusiasts',
    'accessibility-standard': 'WCAG 2.1 AA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={cn(
        inter.variable,
        playfair.variable,
        notoSansSC.variable,
        'antialiased'
      )}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical cultural fonts */}
        <link
          rel="preload"
          href="/_next/static/media/playfair-display.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/_next/static/media/noto-sans-sc.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Cultural content meta tags */}
        <meta name="theme-color" content="#f59e0b" />
        <meta name="msapplication-TileColor" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Voices of Kunqu" />
        
        {/* Structured data for cultural content */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Voices of Kunqu',
              description:
                'Cultural educational platform bridging Kunqu opera with British audiences',
              url: 'https://voices-of-kunqu.org',
              sameAs: [
                'https://twitter.com/VoicesOfKunqu',
                'https://github.com/Icarus603/Voices-of-Kunqu',
              ],
              educationalUse: 'Cultural Education',
              audience: {
                '@type': 'EducationalAudience',
                educationalRole: 'Cultural Learner',
              },
              about: {
                '@type': 'Thing',
                name: 'Kunqu Opera',
                description: 'Traditional Chinese opera form and UNESCO heritage',
              },
            }),
          }}
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-ui antialiased',
          'selection:bg-kunqu-200 selection:text-shakespeare-900'
        )}
      >
        <Providers>
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-kunqu-500 text-white px-4 py-2 rounded-cultural font-medium"
          >
            Skip to main content
          </a>
          
          {/* Cultural accessibility announcement */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            id="cultural-announcements"
          />
          
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
        
        {/* Cultural performance analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', {
                    scope: '/audio/'
                  }).then(function(registration) {
                    console.log('Audio SW registered successfully');
                  }).catch(function(registrationError) {
                    console.log('Audio SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}