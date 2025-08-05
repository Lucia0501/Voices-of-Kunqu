import { notFound } from "next/navigation";
import Link from "next/link";
import { getOperaBySlug, getAllOperaSlugs } from "@/lib/data/operas";
import Header from "@/components/layout/Header";
import SplitTextViewer from "@/components/opera/SplitTextViewer";

interface OperaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllOperaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function OperaPage({ params }: OperaPageProps) {
  const { slug } = await params;
  const opera = getOperaBySlug(slug);

  if (!opera) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Opera Header */}
      <Header 
        title={opera.title}
        subtitle={`${opera.originalTitle} • ${opera.author} • ${opera.dynasty}`}
        className="pb-8"
      />

      {/* Cultural Context */}
      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-700 leading-relaxed">
            {opera.culturalContext}
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-imperial-red" />
              {opera.metadata.estimatedReadingTime} min read
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-imperial-gold" />
              {opera.metadata.difficultyLevel}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-imperial-jade" />
              {opera.metadata.totalParagraphs} paragraphs
            </span>
          </div>
        </div>
      </section>

      {/* Main Content - Show only the most famous paragraph */}
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <SplitTextViewer 
            paragraph={opera.paragraphs[0]}
            operaSlug={opera.slug}
            isFirst={true}
          />
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="border-t border-amber-200/50 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-2 text-imperial-red hover:text-imperial-red/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Opera Collection
            </Link>
            <div className="text-center text-sm text-gray-600">
              <p className="font-chinese">{opera.originalTitle}</p>
            </div>
            <div className="text-sm text-gray-500">
              {opera.yearWritten}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}