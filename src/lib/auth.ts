import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Validation schemas for cultural user registration
const culturalUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  culturalBackground: z.string().optional(),
  learningGoals: z.array(z.string()).default([]),
  nativeLanguage: z.string().default('en-GB'),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // Google OAuth for convenience
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'USER', // Default role for OAuth users
          culturalLevel: 'BEGINNER',
          preferredComplexity: 'BEGINNER',
          nativeLanguage: 'en-GB',
        };
      },
    }),

    // Email magic link for accessibility
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      // Custom email template for cultural context
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        // Custom email sending logic for cultural branding
        // This would integrate with our email service
      },
    }),

    // Credentials provider for cultural experts and admins
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Include user role and cultural preferences in JWT
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            id: true,
            role: true,
            culturalLevel: true,
            preferredComplexity: true,
            nativeLanguage: true,
            culturalInterests: true,
            preferredVoice: true,
            preferredSpeed: true,
            highContrastMode: true,
            reducedMotion: true,
            screenReaderMode: true,
          },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.culturalLevel = dbUser.culturalLevel;
          token.preferredComplexity = dbUser.preferredComplexity;
          token.nativeLanguage = dbUser.nativeLanguage;
          token.culturalInterests = dbUser.culturalInterests;
          token.audioPreferences = {
            voice: dbUser.preferredVoice,
            speed: dbUser.preferredSpeed,
          };
          token.accessibilitySettings = {
            highContrast: dbUser.highContrastMode,
            reducedMotion: dbUser.reducedMotion,
            screenReader: dbUser.screenReaderMode,
          };
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Include cultural data in session
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.culturalLevel = token.culturalLevel as string;
        session.user.preferredComplexity = token.preferredComplexity as string;
        session.user.nativeLanguage = token.nativeLanguage as string;
        session.user.culturalInterests = token.culturalInterests as string[];
        session.user.audioPreferences = token.audioPreferences as any;
        session.user.accessibilitySettings = token.accessibilitySettings as any;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Update last active timestamp
      if (user.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: { lastActive: new Date() },
        });
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to cultural content after sign in
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/cultural/performances`;
    },
  },

  events: {
    async signIn({ user, account, isNewUser }) {
      // Track cultural engagement analytics
      if (isNewUser) {
        // Send welcome email with cultural introduction
        // Track new user registration
      }
      
      // Update user activity for cultural recommendations
      await prisma.user.update({
        where: { email: user.email! },
        data: { lastActive: new Date() },
      });
    },

    async signOut({ token }) {
      // Clear any cultural content caches for the user
      // Log sign out for analytics
    },
  },

  // Security configuration
  useSecureCookies: process.env.NODE_ENV === 'production',
  
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' 
          ? '.voices-of-kunqu.org' 
          : undefined,
      },
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

// Helper functions for cultural user management

/**
 * Check if user has cultural expert permissions
 */
export async function isCulturalExpert(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  
  return user?.role === 'CULTURAL_EXPERT' || user?.role === 'ADMIN';
}

/**
 * Check if user has admin permissions
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  
  return user?.role === 'ADMIN';
}

/**
 * Get user's cultural preferences for personalization
 */
export async function getUserCulturalPreferences(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      culturalLevel: true,
      preferredComplexity: true,
      culturalInterests: true,
      nativeLanguage: true,
      learningGoals: true,
      preferredVoice: true,
      preferredSpeed: true,
      autoplayEnabled: true,
      highContrastMode: true,
      reducedMotion: true,
      screenReaderMode: true,
    },
  });
}

/**
 * Update user's cultural learning preferences
 */
export async function updateCulturalPreferences(
  userId: string,
  preferences: {
    culturalLevel?: string;
    preferredComplexity?: string;
    culturalInterests?: string[];
    learningGoals?: string[];
    audioPreferences?: {
      voice?: string;
      speed?: number;
      autoplay?: boolean;
    };
    accessibilitySettings?: {
      highContrast?: boolean;
      reducedMotion?: boolean;
      screenReader?: boolean;
    };
  }
) {
  const updateData: any = {};
  
  if (preferences.culturalLevel) updateData.culturalLevel = preferences.culturalLevel;
  if (preferences.preferredComplexity) updateData.preferredComplexity = preferences.preferredComplexity;
  if (preferences.culturalInterests) updateData.culturalInterests = preferences.culturalInterests;
  if (preferences.learningGoals) updateData.learningGoals = preferences.learningGoals;
  
  if (preferences.audioPreferences) {
    if (preferences.audioPreferences.voice) updateData.preferredVoice = preferences.audioPreferences.voice;
    if (preferences.audioPreferences.speed) updateData.preferredSpeed = preferences.audioPreferences.speed;
    if (preferences.audioPreferences.autoplay !== undefined) updateData.autoplayEnabled = preferences.audioPreferences.autoplay;
  }
  
  if (preferences.accessibilitySettings) {
    if (preferences.accessibilitySettings.highContrast !== undefined) updateData.highContrastMode = preferences.accessibilitySettings.highContrast;
    if (preferences.accessibilitySettings.reducedMotion !== undefined) updateData.reducedMotion = preferences.accessibilitySettings.reducedMotion;
    if (preferences.accessibilitySettings.screenReader !== undefined) updateData.screenReaderMode = preferences.accessibilitySettings.screenReader;
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
}

/**
 * Create cultural expert account with verification
 */
export async function createCulturalExpertAccount(data: {
  email: string;
  name: string;
  password: string;
  expertise: string;
  qualifications: string;
  institutionalAffiliation?: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: 'CULTURAL_EXPERT',
      culturalLevel: 'SCHOLAR',
      preferredComplexity: 'ADVANCED',
      // Store expert credentials for validation
      expertCredentials: JSON.stringify({
        expertise: data.expertise,
        qualifications: data.qualifications,
        institutionalAffiliation: data.institutionalAffiliation,
        verificationStatus: 'PENDING',
        verificationDate: null,
      }),
    },
  });
}