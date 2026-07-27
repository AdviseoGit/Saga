import Link from "next/link";

/**
 * "Saga-knappen" – permanent banner som fångar upp besökare på kalkylatorerna
 * som redan har en offert i handen och skickar dem till uppladdningen.
 */
export default function SagaUploadBanner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-[22px] border border-[#6366f1]/25 bg-[#0f172a] p-6 sm:p-8 ${className}`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#818cf8]">
            Har du redan fått en offert?
          </p>
          <p className="mt-2 text-lg font-black leading-snug text-white sm:text-xl">
            Ladda upp den gratis hos Fråga Saga och se om du betalar för mycket.
          </p>
          <p className="mt-2 text-sm font-medium text-slate-400">
            Saga jämför priset mot svenska marknadsdata och kontrollerar F-skatt och
            bolagsstatus. Svar på 10 sekunder, ingen inloggning.
          </p>
        </div>
        <Link
          href="/#ladda-upp"
          className="shrink-0 rounded-2xl bg-[#6366f1] px-6 py-4 text-center font-extrabold text-white shadow-lg shadow-[#6366f1]/30 transition hover:bg-[#4f46e5]"
        >
          Granska min offert →
        </Link>
      </div>
    </div>
  );
}
