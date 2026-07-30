import React from 'react';
import Link from 'next/link';

export default function SagaIndexBanner() {
  return (
    <div className="mt-8 mb-4 rounded-xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm transition-all hover:bg-white hover:border-indigo-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 text-2xl shadow-sm border border-indigo-100">
            📊
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Är du osäker på priset? Jämför mot hela Sverige</h4>
            <p className="mt-1 text-sm text-slate-600 max-w-lg">
              Kolla in <strong>Saga Index</strong> för att se vad snittpriserna faktiskt är just nu, baserat på tusentals riktiga, granskade offerter från din region.
            </p>
          </div>
        </div>
        <Link 
          href="/saga-index" 
          className="shrink-0 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 w-full sm:w-auto text-center transition-colors"
        >
          Se prisrapporten →
        </Link>
      </div>
    </div>
  );
}
