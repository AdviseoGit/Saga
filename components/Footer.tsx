"use client";
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#e2e8f0] bg-white px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl text-center text-xs font-medium text-[#64748b]">
        <p>Denna sajt skapas och drivs helt av AI · <a href="/om-sajten" className="underline hover:text-[#0f172a]">Om sajten</a></p>
        <p className="mt-2">Saga – Offertanalys, offertjämförelse och fakturakontroll. Prisanalys och företagskoll. Ingen garanti för fullständighet; använd som stöd, inte som enda beslutsunderlag.</p>
        <p className="mt-2">
          <a href="/granska-offert-hantverkare" className="underline hover:text-[#0f172a]">Guide: Granska offert från hantverkare</a>
          <span className="mx-2">·</span>
          <a href="/kolla-faktura" className="underline hover:text-[#0f172a]">Guide: Kolla faktura från hantverkare</a>
          <span className="mx-2">·</span>
          <a href="/rot-avdrag" className="underline hover:text-[#0f172a]">Guide: ROT-avdrag</a>
          <span className="mx-2">·</span>
          <a href="/f-skatt" className="underline hover:text-[#0f172a]">Guide: F-skatt</a>
          <span className="mx-2">·</span>
          <a href="/ar-offerten-rimlig" className="underline hover:text-[#0f172a]">Är offerten rimlig?</a>
          <span className="mx-2">·</span>
          <a href="/verktyg/renoverings-kalkylator" className="underline hover:text-[#0f172a]">Renovering</a><span className="mx-2">·</span><a href="/verktyg/badrumsrenovering-kalkylator" className="underline hover:text-[#0f172a]">Badrum</a>
          <span className="mx-2">·</span>
          <a href="/verktyg/takbyte-kalkylator" className="underline hover:text-[#0f172a]">Takbyte</a>
          <span className="mx-2">·</span>
          <a href="/verktyg/fasadrenovering-kalkylator" className="underline hover:text-[#0f172a]">Fasad</a>
          <span className="mx-2">·</span>
          <a href="/verktyg/maleriarbete-kalkylator" className="underline hover:text-[#0f172a]">Måleri</a>
          <span className="mx-2">·</span>
          <a href="/verktyg/varmepump-kalkylator" className="underline hover:text-[#0f172a]">Värmepump</a>
          <span className="mx-2">·</span>
          <a href="/verktyg/bergvarme-kalkylator" className="underline hover:text-[#0f172a]">Bergvärme</a>
          <span className="mx-2">·</span>
          <a href="/verktyg/franluftvarme-kalkylator" className="underline hover:text-[#0f172a]">Frånluftsvärme</a>
          <span className="mx-2">·</span>
          <a href="/verktyg/jordvarme-kalkylator" className="underline hover:text-[#0f172a]">Jordvärme</a>
          <span className="mx-2">·</span>
          <a href="/verktyg/solcells-kalkylator" className="underline hover:text-[#0f172a]">Solceller</a>
          <span className="mx-2">·</span>
          <a href="/verktyg/vvs-kalkylator" className="underline hover:text-[#0f172a]">VVS</a>
          <span className="mx-2">·</span>
          <a href="/om-sajten" className="underline hover:text-[#0f172a]">Om Saga</a>
          <span className="mx-2">·</span>
          <a href="/kontakt" className="underline hover:text-[#0f172a]">Kontakt</a>
        </p>
      </div>
    </footer>
  );
}
