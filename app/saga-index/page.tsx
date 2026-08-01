import React from 'react';
import type { Metadata } from 'next';
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SagaIndexData from "@/components/SagaIndexData";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  title: 'Saga Index – Svenska Hantverkspriser 2026',
  description: 'Unik data från Fråga Sagas analyser: prisnivåer för badrum, takbyte, VVS och solceller, baserat på riktiga granskade offerter — med antalet analyser bakom varje prispunkt.',
  alternates: {
    canonical: 'https://fragasaga.se/saga-index',
  },
  openGraph: {
    title: 'Saga Index – Svenska Hantverkspriser 2026',
    description: 'Unik data från Fråga Sagas analyser: snittpriser för badrum, takbyte, VVS och solceller.',
    url: 'https://fragasaga.se/saga-index',
  }
};

export default function SagaIndexPage() {
  return (
    <main className="bg-[#f8fafc] text-[#0f172a] min-h-screen">
      

      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div className="absolute inset-0 bg-[#0f172a]"></div>
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#6366f1]/20 blur-[100px]"></div>
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            Saga Index 2026
          </h1>
          <p className="mt-6 text-lg font-medium text-slate-300">
            Sveriges mest transparenta rapport om hantverkspriser. Baserad på Fråga Sagas analyser och användarinskickade kalkyler och offerter. Uppdateras kontinuerligt med ny marknadsdata.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <SagaIndexData />
      </section>
    </main>
  );
}
