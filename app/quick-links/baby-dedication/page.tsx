import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BabyDedicationForm } from '@/components/quick-links/baby-dedication-form';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Baby Dedication - The Votage',
  description:
    'Want to dedicate your new born to the Lord? Baby Dedication at The Votage.',
};

export default function BabyDedicationPage() {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <Navbar />

      <main className="w-full">
        {/* Top Hero Banner - Solid Black Background */}
        <section className="bg-black text-white pt-36 pb-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-white text-base sm:text-lg font-medium mb-3">
              Want to dedicate your new born to the Lord?
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Baby Dedication
            </h1>
          </div>
        </section>

        {/* Form Section - Clean White Background */}
        <section className="bg-[#F9F9F9] sm:bg-white py-12 sm:py-20 px-4 sm:px-6">
          <BabyDedicationForm />
        </section>

        {/* Other Pastoral Service: Naming Ceremony */}
        <section className="bg-white pb-24 px-4 sm:px-6 lg:px-20">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-5 bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop"
                    alt="Naming Ceremony"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Naming Ceremony
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Names are significant and it is important that naming your loved one be done in the right atmosphere.
                </p>
              </div>

              <div className="pt-4 mt-2">
                <Link
                  href="/quick-links/baby-naming"
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
