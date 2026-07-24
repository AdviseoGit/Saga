import Link from 'next/link';

export default function Navbar() {
  return (
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
    </nav>
  );
}
