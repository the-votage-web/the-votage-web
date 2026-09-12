import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { NamingCeremonyForm } from '@/components/quick-links/naming-ceremony-form';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Naming Ceremony - The Votage',
  description:
    'Names are significant and it is important that naming your loved one be done in the right atmosphere. Schedule baby naming ceremony at The Votage.',
};

export default function BabyNamingPage() {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <Navbar />

      <main className="w-full">
        {/* Top Hero Banner - Solid Black Background */}
        <section className="bg-black text-white pt-36 pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-white text-base sm:text-lg font-medium mb-3">
              Names are significant and it is important that naming your loved one be done in the right atmosphere
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Naming Ceremony
            </h1>
          </div>
        </section>

        {/* Form Section - Clean White Background */}
        <section className="bg-[#F9F9F9] sm:bg-white py-12 sm:py-20 px-4 sm:px-6">
          <NamingCeremonyForm />
        </section>

        {/* Other Pastoral Service: Baby Dedication */}
        <section className="bg-white pb-24 px-4 sm:px-6 lg:px-20">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-5 bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=800&auto=format&fit=crop"
                    alt="Baby Dedication"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Baby Dedication
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Want to dedicate your new born to the Lord? We are excited to celebrate with you.
                </p>
              </div>

              <div className="pt-4 mt-2">
                <Link
                  href="/quick-links/baby-dedication"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E46B0A] hover:text-[#c95e09] transition-colors"
                >
                  <span>Schedule Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
