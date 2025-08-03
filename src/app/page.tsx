import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  BookOpen, 
  Users, 
  Globe, 
  Headphones,
  Sparkles,
  Clock,
  Heart
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Discover the ancient art of Kunqu opera through modern AI-powered translations, bridging 600 years of Chinese cultural heritage with contemporary British audiences.',
};

export default function HomePage() {
  return (
    <main id="main-content" className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cultural-ivory via-white to-kunqu-50 py-24 sm:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge 
              variant="secondary" 
              className="mb-6 bg-kunqu-100 text-kunqu-800 hover:bg-kunqu-200"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              UNESCO Cultural Heritage Meets Modern Technology
            </Badge>
            
            <h1 className="cultural-title mb-8">
              <span className="block text-shakespeare-900">Voices of</span>
              <span className="block text-cultural-gradient">Kunqu</span>
            </h1>
            
            <p className="cultural-body mb-12 max-w-3xl mx-auto text-xl text-shakespeare-600">
              Experience the 600-year-old art of Kunqu opera through AI-powered 
              Shakespearean-style English translations. Discover the cultural bridge 
              between ancient Chinese performing arts and British literary traditions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="cultural-button group"
                asChild
              >
                <Link href="/cultural/performances">
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Start Your Cultural Journey
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-shakespeare-300 text-shakespeare-700 hover:bg-shakespeare-50"
                asChild
              >
                <Link href="/cultural/learn">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Learn About Kunqu
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-shakespeare-500">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                5-45 minute experiences
              </div>
              <div className="flex items-center">
                <Headphones className="mr-2 h-4 w-4" />
                AI-powered audio
              </div>
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                WCAG 2.1 AA accessible
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="cultural-heading mb-6">
              Bridging Cultures Through Technology
            </h2>
            <p className="cultural-body text-shakespeare-600">
              Our platform combines cultural authenticity with modern accessibility, 
              making the ancient art of Kunqu opera accessible to contemporary British audiences.
            </p>
          </div>
          
          <div className="cultural-grid">
            <Card className="performance-card">
              <CardHeader>
                <CardTitle className="flex items-center text-shakespeare-800">
                  <Headphones className="mr-3 h-6 w-6 text-kunqu-500" />
                  AI-Powered Audio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="cultural-body">
                  Experience Kunqu performances through our OpenAI-powered text-to-speech 
                  engine, delivering content in the style of a Shakespearean actor with 
                  cultural reverence and theatrical gravitas.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="performance-card">
              <CardHeader>
                <CardTitle className="flex items-center text-shakespeare-800">
                  <BookOpen className="mr-3 h-6 w-6 text-cultural-jade" />
                  Cultural Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="cultural-body">
                  Every performance comes with comprehensive cultural context, 
                  historical background, and cross-cultural connections to British 
                  theatrical traditions and Shakespearean themes.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="performance-card">
              <CardHeader>
                <CardTitle className="flex items-center text-shakespeare-800">
                  <Users className="mr-3 h-6 w-6 text-cultural-plum" />
                  Expert Validated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="cultural-body">
                  All cultural content is reviewed and validated by Kunqu experts 
                  and cultural scholars to ensure authenticity, accuracy, and 
                  respectful representation of this UNESCO heritage art form.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="performance-card">
              <CardHeader>
                <CardTitle className="flex items-center text-shakespeare-800">
                  <Globe className="mr-3 h-6 w-6 text-cultural-red" />
                  Fully Accessible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="cultural-body">
                  Built with WCAG 2.1 AA compliance, featuring screen reader support, 
                  keyboard navigation, high contrast modes, and multiple text 
                  complexity levels for inclusive cultural education.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cultural Journey Section */}
      <section className="py-24 bg-gradient-to-br from-kunqu-50 to-shakespeare-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="cultural-heading mb-6">
                Your Cultural Learning Journey
              </h2>
              <p className="cultural-body text-shakespeare-600">
                Whether you're a Shakespeare enthusiast, cultural learner, or academic researcher, 
                we provide structured pathways to explore Kunqu opera at your own pace.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-kunqu-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-kunqu-600">1</span>
                </div>
                <h3 className="cultural-subheading mb-4 text-shakespeare-800">
                  Discover
                </h3>
                <p className="cultural-body text-shakespeare-600">
                  Explore our curated collection of Kunqu performances, 
                  starting with shorter pieces that introduce key cultural concepts 
                  and character archetypes.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-cultural-jade/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-cultural-jade">2</span>
                </div>
                <h3 className="cultural-subheading mb-4 text-shakespeare-800">
                  Learn
                </h3>
                <p className="cultural-body text-shakespeare-600">
                  Deepen your understanding through our interactive glossary, 
                  historical timeline, and cross-cultural comparisons between 
                  Kunqu and Shakespearean themes.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-cultural-plum/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-cultural-plum">3</span>
                </div>
                <h3 className="cultural-subheading mb-4 text-shakespeare-800">
                  Connect
                </h3>
                <p className="cultural-body text-shakespeare-600">
                  Join our community of cultural enthusiasts, contribute to discussions, 
                  and engage with expert scholars who provide authentic cultural insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-shakespeare-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold font-cultural mb-6">
              Begin Your Cultural Journey Today
            </h2>
            <p className="text-xl mb-8 text-shakespeare-200">
              Join thousands of cultural enthusiasts discovering the beauty 
              and depth of Kunqu opera through accessible, expert-validated content.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-kunqu-500 hover:bg-kunqu-600 text-white"
                asChild
              >
                <Link href="/cultural/performances">
                  <Heart className="mr-2 h-5 w-5" />
                  Explore Performances
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-shakespeare-900"
                asChild
              >
                <Link href="/auth/register">
                  <Users className="mr-2 h-5 w-5" />
                  Join Our Community
                </Link>
              </Button>
            </div>
            
            <p className="mt-8 text-sm text-shakespeare-300">
              Free to explore • No credit card required • Expert-validated content
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}