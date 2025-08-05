import Header from "@/components/layout/Header";
import OperaGrid from "@/components/opera/OperaGrid";
import { operaWorks } from "@/lib/data/operas";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Main Content */}
      <main className="container mx-auto">
        {/* Hero Header */}
        <Header 
          subtitle="Bridging Eastern and Western literary traditions through the timeless art of Kunqu Opera"
        />

        {/* Opera Selection Grid */}
        <section className="pb-16">
          <OperaGrid operas={operaWorks} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/50 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Preserving the cultural heritage of Kunqu Opera through modern technology
            </p>
            <p className="text-xs mt-2 opacity-70">
              © 2025 Voice of Kunqu. A bridge between traditions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
