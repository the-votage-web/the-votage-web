import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Milestones - The Votage",
  description: "Milestones Celebration at The Votage. Coming Soon.",
};

export default function MilestonesPage() {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="w-full">
        {/* Top Hero Banner - Solid Black Background */}
        <section className="bg-black text-white pt-36 pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-white text-base sm:text-lg font-medium mb-3">
              Celebrate your significant moments
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Milestones
            </h1>
          </div>
        </section>

        {/* Coming Soon Placeholder */}
        <section className="bg-[#F9F9F9] sm:bg-white py-20 px-6">
          <div className="max-w-xl mx-auto text-center py-16 px-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-6 h-6 text-gray-800" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Coming Soon
            </h2>

            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-8">
              We are currently preparing our milestones celebration platform. Please check back soon.
            </p>

            <div className="flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
