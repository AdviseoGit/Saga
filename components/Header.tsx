import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-black tracking-tight text-[#0f172a] sm:text-2xl">
            Saga
          </span>
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-[#6366f1] sm:inline">
            Fråga Saga
          </span>
        </Link>
        <Navbar />
        <div className="text-right">
          <div className="font-bold tabular-nums text-[#0f172a]">3 841</div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#64748b]">
            offerter analyserade
          </div>
        </div>
      </div>
    </header>
  );
}
