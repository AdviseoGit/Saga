"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-[#0f172a] p-2 ml-auto"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isOpen ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
        <Link href="/saga-index" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Saga Index</Link>
        
        <div className="group relative">
          <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors py-2">
            Renovering & Bygg
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white border border-slate-200 shadow-xl rounded-xl py-2 z-50">
            <Link href="/verktyg/renoverings-kalkylator" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]">Generell Renovering</Link>
            <Link href="/verktyg/badrumsrenovering-kalkylator" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]">Badrum</Link>
            <Link href="/verktyg/maleriarbete-kalkylator" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]">Måleri</Link>
            <Link href="/verktyg/takbyte-kalkylator" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]">Takbyte</Link>
            <Link href="/verktyg/fasadrenovering-kalkylator" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]">Fasad</Link>
          </div>
        </div>

        <div className="group relative">
          <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors py-2">
            Energi & VVS
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white border border-slate-200 shadow-xl rounded-xl py-2 z-50">
            <Link href="/verktyg/solcells-kalkylator" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]">Solceller</Link>
            <Link href="/verktyg/varmepump-kalkylator" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]">Värmepump</Link>
            <Link href="/verktyg/bergvarme-kalkylator" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]">Bergvärme</Link>
            <Link href="/verktyg/franluftvarme-kalkylator" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]">Frånluftsvärme</Link>
            <Link href="/verktyg/jordvarme-kalkylator" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]">Jordvärme</Link>
            <Link href="/verktyg/vvs-kalkylator" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0f172a]">VVS</Link>
          </div>
        </div>

        <Link href="/om-sajten" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Om Saga</Link>
        <Link href="/kontakt" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Kontakt</Link>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg py-4 px-4 z-50">
          <div className="flex flex-col gap-4">
            <Link href="/saga-index" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-700 hover:text-[#0f172a]">Saga Index</Link>
            
            <div className="space-y-2 border-t border-slate-100 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Renovering & Bygg</p>
              <Link href="/verktyg/renoverings-kalkylator" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Generell Renovering</Link>
              <Link href="/verktyg/badrumsrenovering-kalkylator" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Badrum</Link>
              <Link href="/verktyg/maleriarbete-kalkylator" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Måleri</Link>
              <Link href="/verktyg/takbyte-kalkylator" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Takbyte</Link>
              <Link href="/verktyg/fasadrenovering-kalkylator" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Fasad</Link>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Energi & VVS</p>
              <Link href="/verktyg/solcells-kalkylator" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Solceller</Link>
              <Link href="/verktyg/varmepump-kalkylator" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Värmepump</Link>
              <Link href="/verktyg/bergvarme-kalkylator" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Bergvärme</Link>
              <Link href="/verktyg/franluftvarme-kalkylator" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Frånluftsvärme</Link>
              <Link href="/verktyg/jordvarme-kalkylator" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Jordvärme</Link>
              <Link href="/verktyg/vvs-kalkylator" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">VVS</Link>
            </div>
            
            <div className="space-y-2 border-t border-slate-100 pt-2">
              <Link href="/om-sajten" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Om Saga</Link>
              <Link href="/kontakt" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-600 hover:text-[#0f172a]">Kontakt</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
