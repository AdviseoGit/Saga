"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { RailwayAPIClient } from "@/lib/api-client";

type AppMode = "quote" | "compare" | "invoice";
type AnalysisStep = "idle" | "reading" | "verifying" | "result" | "error";

export interface SagaAnalysis {
  company: { name: string | null; org_nr: string | null; address: string | null; contact: string | null };
  quote: {
    total_amount: number;
    includes_vat?: boolean;
    includes_rot?: boolean;
    rot_eligible_labor?: number | null;
    rot_deduction?: number | null;
    total_after_rot?: number | null;
    category: string;
    region_guess: string | null;
    validity_days?: number | null;
  };
  verdict: "LOW" | "FAIR" | "HIGH" | "VERY_HIGH";
  verdict_text: string;
  market_range: { low: number; high: number };
  line_items: Array<{
    description: string;
    amount: number;
    is_labor?: boolean;
    assessment?: string;
    market_range?: string;
    comment?: string;
  }>;
  red_flags: string[];
  yellow_flags: string[];
  green_flags: string[];
  negotiate_tips: string[];
  missing_in_quote: string[];
  confidence?: string;
}

export interface InvoiceAnalysis {
  company: { name: string | null; org_nr: string | null; address: string | null; contact: string | null };
  invoice: {
    invoice_number: string | null;
    invoice_date: string | null;
    due_date: string | null;
    total_amount: number;
    payment_account: string | null;
    payment_method: string | null;
    ocr_reference: string | null;
  };
  fraud_verdict: "SAFE" | "SUSPICIOUS" | "LIKELY_FRAUD";
  verdict_text: string;
  risk_score: number;
  fraud_signals: string[];
  legitimate_signals: string[];
  missing_fields: string[];
  confidence: "high" | "medium" | "low";
}

export interface CompanyVerification {
  companyName: string | null;
  companyId: string | null;
  statusCode: string | null;
  statusTextHigh: string | null;
  statusTextDetailed: string | null;
  preliminaryTaxReg: boolean | null;
  vatReg: boolean | null;
  employerContributionReg: boolean | null;
  legalGroupCode: string | null;
  legalGroupText: string | null;
  companyRegistrationDate: string | null;
  address: string | null;
  zipCode: string | null;
  town: string | null;
  numberEmployeesInterval: string | null;
  industryCode: string | null;
  industryText: string | null;
  topDirectorName: string | null;
  topDirectorFunction: string | null;
  commune: string | null;
  county: string | null;
}

type CompareResult = {
  analysis: SagaAnalysis;
  verification: CompanyVerification | null;
  verificationError: string | null;
};

// ─── File helpers ─────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<{ data: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve({ data: base64, mediaType: file.type || "image/jpeg" });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const PDFJS_WORKER = "https://unpkg.com/pdfjs-dist@4/legacy/build/pdf.worker.min.mjs";

async function initPdfJs(): Promise<typeof import("pdfjs-dist/legacy/build/pdf")> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
  const lib = pdfjsLib as typeof pdfjsLib & { GlobalWorkerOptions?: { workerSrc: string } };
  if (lib.GlobalWorkerOptions) lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  return pdfjsLib;
}

async function pdfToText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await initPdfJs();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = Math.min(pdf.numPages, 10);
  let fullText = "";
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map((item: { str?: string }) => item.str ?? "").join(" ") + "\n";
    if (fullText.length >= 50000) break;
  }
  return fullText.trim();
}

async function pdfToImageBase64(file: File): Promise<{ data: string; mediaType: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await initPdfJs();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Kunde inte skapa canvas-kontekst för PDF-rendering.");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;
  const dataUrl = canvas.toDataURL("image/png");
  return { data: dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl, mediaType: "image/png" };
}

async function prepareFileBody(file: File): Promise<{ imageBase64?: string; mediaType?: string; pdfText?: string }> {
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isImage && !isPdf) throw new Error("Ladda upp en bild eller PDF.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Filen är för stor. Max 10 MB.");
  if (isImage) {
    const { data, mediaType } = await fileToBase64(file);
    return { imageBase64: data, mediaType };
  }
  const pdfText = await pdfToText(file);
  if (pdfText.length >= 50) return { pdfText };
  const { data, mediaType } = await pdfToImageBase64(file);
  return { imageBase64: data, mediaType };
}

async function verifyCompany(orgNr: string): Promise<{ verification: CompanyVerification | null; verificationError: string | null }> {
  try {
    const { data, error, details } = await RailwayAPIClient.verifyCompany({ org_nr: orgNr });
    if (error) {
      let msg = error;
      if (error === "company_not_found") msg = "Företaget hittades inte i registret.";
      return { verification: null, verificationError: msg };
    }
    const p = data as { verification?: CompanyVerification; error?: string; message?: string };
    if (!p.verification) return { verification: null, verificationError: p.message ?? p.error ?? "Verifiering misslyckades." };
    return { verification: p.verification, verificationError: null };
  } catch {
    return { verification: null, verificationError: "Kunde inte verifiera företaget." };
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SagaLandingPage() {
  const [mode, setMode] = useState<AppMode>("quote");
  const [step, setStep] = useState<AnalysisStep>("idle");
  const [error, setError] = useState<string | null>(null);

  // Quote mode state
  const [analysis, setAnalysis] = useState<SagaAnalysis | null>(null);
  const [verification, setVerification] = useState<CompanyVerification | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Invoice mode state
  const [invoiceAnalysis, setInvoiceAnalysis] = useState<InvoiceAnalysis | null>(null);
  const [invoiceVerification, setInvoiceVerification] = useState<CompanyVerification | null>(null);
  const [invoiceVerificationError, setInvoiceVerificationError] = useState<string | null>(null);

  // Compare mode state
  const [compareFileA, setCompareFileA] = useState<File | null>(null);
  const [compareFileB, setCompareFileB] = useState<File | null>(null);
  const [compareA, setCompareA] = useState<CompareResult | null>(null);
  const [compareB, setCompareB] = useState<CompareResult | null>(null);

  function resetOverlay() {
    setStep("idle");
    setError(null);
    setAnalysis(null);
    setVerification(null);
    setVerificationError(null);
    setInvoiceAnalysis(null);
    setInvoiceVerification(null);
    setInvoiceVerificationError(null);
    setCompareA(null);
    setCompareB(null);
  }

  function handleModeChange(m: AppMode) {
    setMode(m);
    resetOverlay();
    setCompareFileA(null);
    setCompareFileB(null);
  }

  // ─── Quote/Invoice single-file handler ──────────────────────────────────────

  const handleSingleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, currentMode: AppMode) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";
      if (!supabase) {
        setError("Supabase är inte konfigurerad. Lägg till NEXT_PUBLIC_SUPABASE_URL och NEXT_PUBLIC_SUPABASE_ANON_KEY i .env.local.");
        setStep("error");
        return;
      }
      setError(null);
      setStep("reading");
      try {
        const body = await prepareFileBody(file);
        const analysisMode = currentMode === "compare" ? "quote" : currentMode;
        const { data, error: fnError, details } = await RailwayAPIClient.analyzeQuote({
          ...body, mode: analysisMode
        });
        if (fnError) {
          let message = fnError || "Något gick fel vid anropet.";
          if (details) message = `${message}\n\n${details}`;
          setError(message);
          setStep("error");
          return;
        }

        if (currentMode === "invoice") {
          const payload = data as { invoiceAnalysis?: InvoiceAnalysis; error?: string };
          if (payload.error || !payload.invoiceAnalysis) {
            setError(payload.error || "Ingen analys returnerades.");
            setStep("error");
            return;
          }
          setInvoiceAnalysis(payload.invoiceAnalysis);
          setInvoiceVerification(null);
          setInvoiceVerificationError(null);
          setStep("verifying");
          const orgNr = payload.invoiceAnalysis.company?.org_nr;
          if (orgNr) {
            const { verification: v, verificationError: ve } = await verifyCompany(orgNr);
            setInvoiceVerification(v);
            setInvoiceVerificationError(ve);
          } else {
            setInvoiceVerificationError("Organisationsnummer saknas i fakturan.");
          }
          setStep("result");
        } else {
          const payload = data as { analysis?: SagaAnalysis; error?: string };
          if (payload.error || !payload.analysis) {
            setError(payload.error || "Ingen analys returnerades.");
            setStep("error");
            return;
          }
          setAnalysis(payload.analysis);
          setVerification(null);
          setVerificationError(null);
          setStep("verifying");
          const orgNr = payload.analysis.company?.org_nr;
          if (orgNr) {
            const { verification: v, verificationError: ve } = await verifyCompany(orgNr);
            setVerification(v);
            setVerificationError(ve);
          } else {
            setVerificationError("Organisationsnummer saknas i offerten.");
          }
          setStep("result");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Något gick fel.");
        setStep("error");
      }
    },
    []
  );

  // ─── Compare handler ─────────────────────────────────────────────────────────

  const handleCompareAnalyze = useCallback(async () => {
    if (!compareFileA || !compareFileB) return;
    setError(null);
    setStep("reading");
    try {
      const [bodyA, bodyB] = await Promise.all([
        prepareFileBody(compareFileA),
        prepareFileBody(compareFileB),
      ]);
      const [resA, resB] = await Promise.all([
        RailwayAPIClient.analyzeQuote({ ...bodyA, mode: "quote" }),
        RailwayAPIClient.analyzeQuote({ ...bodyB, mode: "quote" }),
      ]);
      if (resA.error) throw new Error(resA.error || "Analys A misslyckades.");
      if (resB.error) throw new Error(resB.error || "Analys B misslyckades.");
      const pA = resA.data as { analysis?: SagaAnalysis; error?: string };
      const pB = resB.data as { analysis?: SagaAnalysis; error?: string };
      if (!pA.analysis) throw new Error(pA.error || "Ingen analys för offert A.");
      if (!pB.analysis) throw new Error(pB.error || "Ingen analys för offert B.");

      setStep("verifying");
      const [vA, vB] = await Promise.all([
        pA.analysis.company?.org_nr ? verifyCompany(pA.analysis.company.org_nr) : Promise.resolve({ verification: null, verificationError: "Org.nr saknas." }),
        pB.analysis.company?.org_nr ? verifyCompany(pB.analysis.company.org_nr) : Promise.resolve({ verification: null, verificationError: "Org.nr saknas." }),
      ]);
      setCompareA({ analysis: pA.analysis, verification: vA.verification, verificationError: vA.verificationError });
      setCompareB({ analysis: pB.analysis, verification: vB.verification, verificationError: vB.verificationError });
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel.");
      setStep("error");
    }
  }, [compareFileA, compareFileB]);

  // ─── Derived upload labels ────────────────────────────────────────────────────

  const uploadLabelMobile = mode === "invoice" ? "Fota din faktura" : "Fota din offert";
  const uploadLabelDesktop = mode === "invoice" ? "Ladda upp din faktura" : "Ladda upp din offert";
  const heroSubtitle =
    mode === "invoice"
      ? "Ladda upp en mottagen faktura. Saga kontrollerar om den är äkta och om företaget finns i registret."
      : mode === "compare"
      ? "Välj två offerter och låt Saga jämföra pris, flaggor och trovärdighet – och rekommendera den bästa."
      : "Ladda upp din offert som bild eller PDF. Saga säger om priset är rimligt och om du kan lita på företaget.";

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-xl font-black tracking-tight text-[#0f172a] sm:text-2xl">Saga</span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-[#6366f1] sm:inline">Fråga Saga</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link href="/verktyg/renoverings-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Renovering</Link>
            <Link href="/verktyg/badrumsrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Badrum</Link>
            <Link href="/verktyg/takbyte-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Tak</Link>
            <Link href="/verktyg/fasadrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Fasad</Link>
            <Link href="/verktyg/maleriarbete-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Måleri</Link>
            <Link href="/verktyg/solcells-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Solceller</Link>
            <Link href="/verktyg/varmepump-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Värmepump</Link>
            <Link href="/verktyg/bergvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Bergvärme</Link>
            <Link href="/verktyg/franluftvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Frånluftsvärme</Link>
            <Link href="/verktyg/vvs-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">VVS</Link>
          </nav>
          <div className="text-right">
            <div className="font-bold tabular-nums text-[#0f172a]">3 841</div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-[#64748b]">offerter analyserade</div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0f172a]/98 to-[#f8fafc]" />
        <div className="absolute left-1/2 top-20 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#6366f1]/20 blur-[80px]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6366f1]">Offertanalys på sekunder</p>
          <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">Fråga Saga</h1>
          <p className="mt-5 max-w-xl mx-auto text-lg font-medium text-slate-300 sm:text-xl">{heroSubtitle}</p>

          {/* Mode switcher */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-2xl bg-white/10 p-1">
              {([ { id: "quote", label: "Offert" }, { id: "compare", label: "Jämför offerter" }, { id: "invoice", label: "Faktura" } ] as { id: AppMode; label: string }[]).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleModeChange(opt.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition ${mode === opt.id ? "bg-white text-[#0f172a] shadow-sm" : "text-slate-300 hover:text-white"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload UI — quote or invoice mode */}
          {mode !== "compare" && (
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <label className="group flex w-full max-w-xs cursor-pointer items-center justify-center gap-3 rounded-2xl bg-[#6366f1] px-6 py-4 font-extrabold text-white shadow-lg shadow-[#6366f1]/30 transition hover:bg-[#4f46e5] sm:hidden">
                <span className="text-lg">📷</span>
                <span>{uploadLabelMobile}</span>
                <input type="file" accept="image/*,application/pdf" capture="environment" className="hidden" onChange={(e) => handleSingleFile(e, mode)} />
              </label>
              <label className="group hidden w-full max-w-xs cursor-pointer items-center justify-center gap-3 rounded-2xl bg-[#6366f1] px-6 py-4 font-extrabold text-white shadow-lg shadow-[#6366f1]/30 transition hover:bg-[#4f46e5] sm:flex sm:w-auto">
                <span className="text-lg">📁</span>
                <span>{uploadLabelDesktop}</span>
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleSingleFile(e, mode)} />
              </label>
              <label className="group flex w-full max-w-xs cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-white/10 px-6 py-4 font-extrabold text-white backdrop-blur transition hover:bg-white/20 sm:hidden">
                <span className="text-lg">🗂️</span>
                <span>Välj från galleriet</span>
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleSingleFile(e, mode)} />
              </label>
            </div>
          )}

          {/* Upload UI — compare mode */}
          {mode === "compare" && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className={`group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 px-5 py-5 font-bold text-white backdrop-blur transition ${compareFileA ? "border-[#6366f1] bg-[#6366f1]/20" : "border-white/30 bg-white/10 hover:bg-white/20"}`}>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#6366f1]">Offert A</span>
                  <span className="text-sm">{compareFileA ? compareFileA.name : "Välj fil…"}</span>
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { setCompareFileA(e.target.files?.[0] ?? null); e.target.value = ""; }} />
                </label>
                <label className={`group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 px-5 py-5 font-bold text-white backdrop-blur transition ${compareFileB ? "border-[#6366f1] bg-[#6366f1]/20" : "border-white/30 bg-white/10 hover:bg-white/20"}`}>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#6366f1]">Offert B</span>
                  <span className="text-sm">{compareFileB ? compareFileB.name : "Välj fil…"}</span>
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { setCompareFileB(e.target.files?.[0] ?? null); e.target.value = ""; }} />
                </label>
              </div>
              {compareFileA && compareFileB && (
                <button
                  type="button"
                  onClick={handleCompareAnalyze}
                  className="mx-auto flex items-center gap-2 rounded-2xl bg-[#6366f1] px-8 py-4 font-extrabold text-white shadow-lg shadow-[#6366f1]/30 transition hover:bg-[#4f46e5]"
                >
                  Jämför nu →
                </button>
              )}
            </div>
          )}

          <p className="mt-6 text-xs font-medium text-slate-400">Ingen inloggning krävs. Din fil sparas aldrig utan ditt medgivande.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["🔒 Sparas aldrig", "🇸🇪 Myndighetsdata", "⚡ Svar på 10 sek"].map((badge) => (
              <span key={badge} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur">{badge}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Vad Saga kollar */}
      <section className="border-t border-[#e2e8f0] bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.25em] text-[#64748b]">Vad Saga kollar</h2>
          <p className="mt-3 text-center text-xl font-bold text-[#0f172a] sm:text-2xl">När du frågar Saga får du hela bilden</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, i) => (
              <div key={card.title} className="group rounded-[22px] border border-[#e2e8f0] bg-[#f8fafc] p-5 transition hover:border-[#6366f1]/30 hover:bg-white hover:shadow-lg hover:shadow-[#6366f1]/5" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="text-2xl">{card.icon}</div>
                <h3 className="mt-3 text-sm font-bold text-[#0f172a]">{card.title}</h3>
                <p className="mt-1.5 text-sm font-medium text-[#64748b]">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Hur det fungerar */}
      <section className="border-t border-[#e2e8f0] bg-[#f8fafc] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-[#64748b]">Tre enkla steg</p>
          <h2 className="mt-3 text-center text-xl font-bold text-[#0f172a] sm:text-2xl">Hur Fråga Saga fungerar</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6366f1]/10 text-2xl font-black text-[#6366f1]">1</div>
              <h3 className="mt-4 text-base font-bold text-[#0f172a]">Ladda upp din offert</h3>
              <p className="mt-2 text-sm font-medium text-[#64748b]">Fota eller välj en bild (JPG/PNG) eller PDF av din offert. Inga specialprogram krävs – bara ett foto räcker.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6366f1]/10 text-2xl font-black text-[#6366f1]">2</div>
              <h3 className="mt-4 text-base font-bold text-[#0f172a]">Saga analyserar</h3>
              <p className="mt-2 text-sm font-medium text-[#64748b]">AI läser offerten och jämför mot svenska marknadsdata. Företagets F-skatt och bolagsstatus kontrolleras automatiskt mot myndighetsregister.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6366f1]/10 text-2xl font-black text-[#6366f1]">3</div>
              <h3 className="mt-4 text-base font-bold text-[#0f172a]">Få hela sanningen</h3>
              <p className="mt-2 text-sm font-medium text-[#64748b]">Du får ett tydligt prisverdict (Bra pris / Rimligt / I överkant / Högt pris), röda och gula flaggor, och konkreta förhandlingstips.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vanliga frågor */}
      <section className="border-t border-[#e2e8f0] bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-[#64748b]">Vanliga frågor</p>
          <h2 className="mt-3 text-center text-xl font-bold text-[#0f172a] sm:text-2xl">Allt du behöver veta om Fråga Saga</h2>
          <dl className="mt-10 space-y-4">
            {[
              {
                q: "Vad är Fråga Saga?",
                a: "Fråga Saga är ett gratis verktyg som analyserar offerter och fakturor med hjälp av AI och svenska myndighetsdata. Du laddar upp en bild eller PDF och får direkt svar på om priset är rimligt, om företaget är seriöst och vad du bör förhandla om.",
              },
              {
                q: "Är Fråga Saga gratis?",
                a: "Ja, helt gratis. Ingen registrering eller inloggning krävs och din fil sparas aldrig.",
              },
              {
                q: "Hur lång tid tar analysen?",
                a: "Normalt 10–20 sekunder. Saga läser offerten, jämför mot marknadsdata och kontrollerar företaget mot Skatteverket och Bolagsverket parallellt.",
              },
              {
                q: "Vilka typer av offerter kan Saga analysera?",
                a: "Saga analyserar offerter från hantverkare, byggföretag, VVS-firmor, elektriker, takläggare, målare och andra servicebranscher. Du laddar upp som foto (JPG/PNG) eller PDF.",
              },
              {
                q: "Vad är F-skatt och varför är det viktigt?",
                a: "F-skatt innebär att ett företag ansvarar för sin egen skatteinbetalning. Om du anlitar en hantverkare utan F-skatt kan du bli ansvarig för arbetsgivaravgifter. Saga kontrollerar alltid F-skattstatus.",
              },
              {
                q: "Kan jag jämföra två offerter mot varandra?",
                a: 'Ja! Med läget "Jämför offerter" laddar du upp två offerter och Saga analyserar båda – pris, flaggor och trovärdighet – och rekommenderar vilken du bör välja.',
              },
              {
                q: "Kan Saga avslöja falska fakturor?",
                a: "Ja. I fakturakontrollläget analyserar Saga om fakturan ser äkta ut, kontrollerar avsändaren mot Bolagsverket och letar efter bedrägerimarkörer som felaktiga kontonummer.",
              },
              {
                q: "Är mina filer säkra?",
                a: "Ja. Din fil används bara för att genomföra analysen och sparas aldrig permanent. Inga personuppgifter krävs.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-[20px] border border-[#e2e8f0] bg-[#f8fafc] p-5">
                <dt className="text-sm font-bold text-[#0f172a]">{q}</dt>
                <dd className="mt-2 text-sm font-medium leading-relaxed text-[#64748b]">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA repeat */}
      <section className="border-t border-[#e2e8f0] bg-[#f8fafc] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-black text-[#0f172a] sm:text-3xl">Redo att fråga Saga?</h2>
          <p className="mt-3 font-medium text-[#64748b]">En offert. Ett foto. Hela sanningen.</p>
          <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#0f172a] px-6 py-3 font-extrabold text-white transition hover:bg-[#1e293b] sm:hidden">
            <span>📷</span><span>Fota din offert</span>
            <input type="file" accept="image/*,application/pdf" capture="environment" className="hidden" onChange={(e) => handleSingleFile(e, "quote")} />
          </label>
          <label className="mt-6 hidden cursor-pointer items-center gap-2 rounded-2xl bg-[#0f172a] px-6 py-3 font-extrabold text-white transition hover:bg-[#1e293b] sm:inline-flex">
            <span>📁</span><span>Ladda upp din offert</span>
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleSingleFile(e, "quote")} />
          </label>
        </div>
      </section>

      {/* Overlay */}
      {step !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 p-4 backdrop-blur-sm">
          <div className={`w-full overflow-hidden rounded-[26px] bg-[#0f172a] text-white shadow-2xl ring-1 ring-white/10 transition-all duration-500 ${step === "result" ? "max-w-3xl" : "max-w-md"}`}>
            {step === "reading" && (
              <AnalysisStepBlock
                title={mode === "invoice" ? "Analyserar fakturan..." : mode === "compare" ? "Analyserar båda offerterna..." : "Läser offerten..."}
                subtitle={mode === "invoice" ? "Saga letar efter bedrägerimarkörer och extraherar fakturadata..." : mode === "compare" ? "Saga analyserar pris, poster och företagsinfo för båda offert..." : "Saga analyserar poster, belopp och företagsinfo..."}
              />
            )}
            {step === "verifying" && <VerifyingBlock />}
            {step === "result" && mode === "quote" && analysis && (
              <ResultBlock
                analysis={analysis}
                verification={verification}
                verificationError={verificationError}
                onClose={resetOverlay}
              />
            )}
            {step === "result" && mode === "invoice" && invoiceAnalysis && (
              <InvoiceResultBlock
                analysis={invoiceAnalysis}
                verification={invoiceVerification}
                verificationError={invoiceVerificationError}
                onClose={resetOverlay}
              />
            )}
            {step === "result" && mode === "compare" && compareA && compareB && (
              <CompareResultBlock
                a={compareA}
                b={compareB}
                onClose={resetOverlay}
              />
            )}
            {step === "error" && (
              <ErrorBlock message={error || "Något gick fel."} onClose={resetOverlay} />
            )}
          </div>
        </div>
      )}
    </main>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────

const cards = [
  { icon: "💰", title: "Prisanalys", body: "Jämför mot svenska marknadspriser – totalt och per post." },
  { icon: "🏛️", title: "F-skatt", body: "Kontrollerar F-skatt och moms mot Skatteverket." },
  { icon: "🏢", title: "Företagskoll", body: "Ålder, anställda, omsättning – signaler på stabilitet." },
  { icon: "⭐", title: "Kreditvärdighet", body: "Tydlig bedömning av betalningsförmåga." },
  { icon: "🔍", title: "Fakturakontroll", body: "Avslöjar falska fakturor – kontrollerar avsändare, konto och format." },
  { icon: "🛡️", title: "Jämförelse", body: "Analyserar två offerter mot varandra och rekommenderar den bästa." },
];

// ─── Components ───────────────────────────────────────────────────────────────

function QuoteScanner() {
  return (
    <>
      <style>{`
        @keyframes saga-scan { 0%{top:12px;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{top:calc(100% - 12px);opacity:0} }
        @keyframes saga-line { 0%,100%{opacity:0.15} 50%{opacity:0.6} }
        @keyframes saga-amount { 0%,100%{opacity:0.2} 50%{opacity:0.9} }
      `}</style>
      <div style={{ position: "relative", width: 44, height: 56, margin: "0 auto" }}>
        <div style={{ width: "100%", height: "100%", background: "#1e293b", borderRadius: 5, border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden", padding: "8px 7px 7px", display: "flex", flexDirection: "column", gap: 4 }}>
          {[0.8, 1, 0.55, 0.9, 0.65, 0.75, 0.4].map((w, i) => (
            <div key={i} style={{ height: i === 5 ? 3 : 2, width: `${w * 100}%`, background: i === 5 ? "#6366f1" : "#334155", borderRadius: 2, animation: i === 5 ? `saga-amount 1.1s ease-in-out infinite` : `saga-line ${1.2 + i * 0.13}s ease-in-out infinite`, animationDelay: `${i * 0.08}s` }} />
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, height: 1.5, background: "linear-gradient(90deg, transparent 0%, #6366f1 35%, #c7d2fe 50%, #6366f1 65%, transparent 100%)", boxShadow: "0 0 8px 3px rgba(99,102,241,0.55)", animation: "saga-scan 2.2s ease-in-out infinite" }} />
        </div>
        <div style={{ position: "absolute", top: 0, right: 0, width: 10, height: 10, background: "#0f172a", clipPath: "polygon(100% 0, 100% 100%, 0 0)" }} />
      </div>
    </>
  );
}

function AnalysisStepBlock(props: { title: string; subtitle: string }) {
  return (
    <div className="space-y-6 p-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Steg 1 av 3</p>
      <div>
        <h2 className="text-lg font-bold text-white">{props.title}</h2>
        <p className="mt-1 text-sm text-slate-400">{props.subtitle}</p>
      </div>
      <div className="flex justify-center py-2"><QuoteScanner /></div>
    </div>
  );
}

function VerifyingBlock() {
  const items = [
    { icon: "🏛️", label: "Skatteverket – F-skatt", status: "Kontrolleras" },
    { icon: "🏢", label: "Bolagsverket", status: "Kontrolleras" },
    { icon: "⭐", label: "Kreditvärdighet", status: "—" },
    { icon: "🔧", label: "Certifieringar", status: "—" },
    { icon: "🛡️", label: "Ansvarsförsäkring", status: "—" },
  ];
  return (
    <div className="space-y-6 p-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Steg 2 av 3</p>
      <div>
        <h2 className="text-lg font-bold text-white">Verifierar företaget...</h2>
        <p className="mt-1 text-sm text-slate-400">Skatteverket, Bolagsverket, branschregister.</p>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <span className="text-xs font-semibold text-slate-400">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorBlock(props: { message: string; onClose: () => void }) {
  return (
    <div className="space-y-6 p-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">Kunde inte analysera</p>
      <p className="text-sm text-slate-200">{props.message}</p>
      <button type="button" onClick={props.onClose} className="w-full rounded-2xl bg-[#6366f1] py-3 text-sm font-bold text-white transition hover:bg-[#4f46e5]">Prova igen</button>
    </div>
  );
}

const VERDICT_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; dotColor: string }> = {
  LOW:      { label: "Bra pris",     color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", dotColor: "#34d399" },
  FAIR:     { label: "Rimligt pris", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", dotColor: "#34d399" },
  HIGH:     { label: "I överkant",   color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30",   dotColor: "#fbbf24" },
  VERY_HIGH:{ label: "Högt pris",    color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30",     dotColor: "#f87171" },
};


function buildQuestionsEmail(a: SagaAnalysis): string {
  const company = a.company?.name ?? "er";
  const concerns = [...(a.red_flags ?? []), ...(a.yellow_flags ?? [])].slice(0, 3);
  const tips = (a.negotiate_tips ?? []).slice(0, Math.max(0, 5 - concerns.length));
  const items: string[] = [
    ...concerns.map((f) => `Angående "${f}" – kan ni förtydliga detta?`),
    ...tips,
  ];
  const numbered = items.map((t, i) => `${i + 1}. ${t}`).join("\n");
  return `Hej ${company},\n\nInnan jag fattar beslut vill jag ha svar på:\n\n${numbered}\n\nVänligen återkom med svar så snart som möjligt.\n\nMed vänlig hälsning`;
}

function generateRFQ(a: SagaAnalysis): string {
  const category = a.quote?.category ?? "arbetet";
  const region = a.quote?.region_guess ?? "Sverige";
  const market = a.market_range;
  const items = (a.line_items ?? []).map((item) => `- ${item.description}: ca ${item.amount.toLocaleString("sv-SE")} kr`).join("\n");
  const budget = market ? `Budget: ${market.low.toLocaleString("sv-SE")}–${market.high.toLocaleString("sv-SE")} kr` : "";
  return `Offertförfrågan – ${category}\n\nJag söker offerter för ${category} i ${region}-området.\n\n${budget}\n\nArbetet avser:\n${items}\n\nJag önskar:\n1. Fast pris inkl. moms\n2. Tidsplan för utförandet\n3. Bekräftelse av F-skatteregistrering\n4. Minst ett referensuppdrag\n\nKontakta mig för mer information.\n\nMed vänlig hälsning`;
}

function buildConfirmEmail(a: SagaAnalysis): string {
  const company = a.company?.name ?? "er";
  const total = a.quote?.total_amount?.toLocaleString("sv-SE") ?? "";
  const category = a.quote?.category ?? "arbetet";
  return `Hej ${company},\n\nJag bekräftar härmed att jag accepterar er offert avseende ${category} till ett totalt belopp om ${total} kr.\n\nVänligen bekräfta att ni mottagit detta och meddela planerad startdatum.\n\nMed vänlig hälsning`;
}

function VerificationRow(props: { icon: string; label: string; value: boolean | string | null | undefined; trueText?: string; falseText?: string }) {
  let displayValue: string;
  let colorClass: string;
  if (props.value === null || props.value === undefined) {
    displayValue = "Uppgift saknas"; colorClass = "text-slate-500";
  } else if (typeof props.value === "boolean") {
    displayValue = props.value ? (props.trueText ?? "Ja") : (props.falseText ?? "Nej");
    colorClass = props.value ? "text-emerald-400" : "text-red-400";
  } else {
    displayValue = props.value; colorClass = "text-slate-200";
  }
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2.5">
      <div className="flex items-center gap-3">
        <span className="text-lg">{props.icon}</span>
        <span className="text-sm font-medium text-slate-300">{props.label}</span>
      </div>
      <span className={`text-xs font-semibold ${colorClass}`}>{displayValue}</span>
    </div>
  );
}

function CompanyBlock(props: { verification: CompanyVerification | null; verificationError: string | null }) {
  const v = props.verification;
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Företagskoll</p>
      {props.verificationError ? (
        <p className="mt-2 text-sm text-amber-400">{props.verificationError}</p>
      ) : v ? (
        <div className="mt-3 space-y-2">
          <VerificationRow icon="🏛️" label="F-skatt" value={v.preliminaryTaxReg} trueText="Registrerad" falseText="Ej registrerad" />
          <VerificationRow icon="🏢" label="Bolagsverket" value={v.statusTextHigh} />
          <VerificationRow icon="📋" label="Momsregistrerad" value={v.vatReg} trueText="Ja" falseText="Nej" />
          <VerificationRow icon="📅" label="Registrerad" value={v.companyRegistrationDate} />
          <VerificationRow icon="👥" label="Anställda" value={v.numberEmployeesInterval} />
          <VerificationRow icon="🔧" label="Bransch" value={v.industryText} />
          {v.topDirectorName && <VerificationRow icon="👤" label="VD / Ansvarig" value={v.topDirectorName} />}
          {v.town && v.address && <VerificationRow icon="📍" label="Adress" value={`${v.address}, ${v.zipCode ?? ""} ${v.town}`} />}
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-500">Verifiering pågår...</p>
      )}
    </div>
  );
}


// ─── EmailCapture ─────────────────────────────────────────────────────────────

function EmailCapture({ analysis }: { analysis: SagaAnalysis }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStatus("loading");
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          quoteCategory: analysis.quote?.category,
          quoteRegion: analysis.quote?.region_guess,
          analysisVerdict: analysis.verdict,
          analysisSummary: {
            company: analysis.company?.name,
            total: analysis.quote?.total_amount,
            verdict: analysis.verdict_text,
          },
        }),
      });
      setStatus(r.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
        ✓ Tack! Vi har tagit emot din e-post.
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        Spara rapporten via e-post
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="din@epost.se"
          className="min-w-0 flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-[#6366f1]"
        />
        <button
          type="button"
          onClick={submit}
          disabled={status === "loading"}
          className="shrink-0 rounded-xl bg-[#6366f1] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#4f46e5] disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Skicka →"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-1.5 text-xs text-red-400">Något gick fel. Prova igen.</p>
      )}
      <p className="mt-1.5 text-[11px] text-slate-600">Vi delar aldrig din e-post med tredje part.</p>
    </div>
  );
}

// ─── ResultBlock (quote) ──────────────────────────────────────────────────────

function ResultBlock(props: { analysis: SagaAnalysis; verification: CompanyVerification | null; verificationError: string | null; onClose: () => void }) {
  const [showDetails, setShowDetails] = useState(false);
  const [activeEmail, setActiveEmail] = useState<"questions" | "confirm" | null>(null);
  const [rfqVisible, setRfqVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rfqCopied, setRfqCopied] = useState(false);

  const a = props.analysis;
  const v = props.verification;
  const vc = VERDICT_CONFIG[a.verdict] ?? VERDICT_CONFIG.FAIR;
  const total = a.quote?.total_amount ?? 0;
  const afterRot = a.quote?.total_after_rot;
  const market = a.market_range;
  const showRFQButton = a.verdict === "HIGH" || a.verdict === "VERY_HIGH";

  const verificationRedFlags: string[] = [];
  if (v) {
    if (v.preliminaryTaxReg === false) verificationRedFlags.push("Företaget saknar F-skattsedel");
    if (v.statusTextHigh && /avregistrerad|konkurs|likvidation/i.test(v.statusTextHigh)) verificationRedFlags.push(`Företaget är ${v.statusTextHigh.toLowerCase()}`);
    if (v.vatReg === false) verificationRedFlags.push("Företaget är inte momsregistrerat");
  }
  const allRedFlags = [...verificationRedFlags, ...(a.red_flags ?? [])];
  const filteredGreenFlags = (a.green_flags ?? []).filter((flag) => {
    if (v?.preliminaryTaxReg === false && /f-skatt/i.test(flag)) return false;
    if (v?.vatReg === false && /moms/i.test(flag)) return false;
    return true;
  });

  const marketMid = market ? (market.low + market.high) / 2 : null;
  const vsPct = marketMid ? Math.round(((total - marketMid) / marketMid) * 100) : null;
  const vsText = vsPct === null ? null : vsPct > 0 ? `+${vsPct}% över snittet` : vsPct < 0 ? `${Math.abs(vsPct)}% under snittet` : "Exakt på snittet";
  const barPct = market ? Math.min(95, Math.max(5, ((total - market.low) / (market.high - market.low)) * 100)) : 50;

  // Top flags: red first, then yellow, max 3
  const topFlags = [
    ...allRedFlags.map((f) => ({ text: f, kind: "red" as const })),
    ...(a.yellow_flags ?? []).map((f) => ({ text: f, kind: "yellow" as const })),
  ].slice(0, 3);

  // Company micro row
  const fSkattOk = v ? v.preliminaryTaxReg !== false : null;
  const activeOk = v ? !(v.statusTextHigh && /avregistrerad|konkurs|likvidation/i.test(v.statusTextHigh)) : null;
  const regYear = v?.companyRegistrationDate ? v.companyRegistrationDate.slice(0, 4) : null;

  function handleCopy(text: string, setFn: (b: boolean) => void) {
    navigator.clipboard.writeText(text).then(() => { setFn(true); setTimeout(() => setFn(false), 2000); });
  }

  return (
    <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Saga svarar</p>

      {/* Verdict card */}
      <div className={`mt-4 rounded-2xl border p-4 ${vc.bg} ${vc.border}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-400">
              {a.company?.name ?? "Okänt företag"}
              {a.quote?.category && ` · ${a.quote.category}`}
              {a.quote?.region_guess && ` · ${a.quote.region_guess}`}
            </p>
            <p className={`mt-1 text-2xl font-black ${vc.color}`}>{vc.label}</p>
            <p className="mt-1 text-sm leading-snug text-slate-300">{a.verdict_text}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xl font-black tabular-nums text-white">{total.toLocaleString("sv-SE")} kr</p>
            {afterRot != null && afterRot !== total && <p className="text-xs text-slate-400">efter ROT: {afterRot.toLocaleString("sv-SE")} kr</p>}
          </div>
        </div>
      </div>

      {/* Market bar */}
      {market && (
        <div className="mt-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{market.low.toLocaleString("sv-SE")} kr</span>
            <span className="font-medium text-slate-400">Marknadsintervall</span>
            <span>{market.high.toLocaleString("sv-SE")} kr</span>
          </div>
          <div className="relative mt-1.5 h-2 w-full overflow-visible rounded-full bg-white/10">
            <div className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0f172a] shadow-lg" style={{ left: `${barPct}%`, backgroundColor: vc.dotColor }} />
          </div>
          {vsText && <p className={`mt-2.5 text-sm font-bold ${vc.color}`}>Din offert är {vsText}</p>}
        </div>
      )}

      {/* Company micro row */}
      {(v || props.verificationError) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-white/5 px-4 py-2.5 ring-1 ring-white/10 text-sm">
          {v ? (
            <>
              <span className={fSkattOk ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                {fSkattOk ? "✓" : "✗"} F-skatt
              </span>
              <span className="text-slate-600">·</span>
              <span className={activeOk ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                {activeOk ? "✓" : "✗"} Aktivt bolag
              </span>
              {regYear && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Reg. {regYear}</span>
                </>
              )}
            </>
          ) : (
            <span className="text-amber-400 text-xs">{props.verificationError}</span>
          )}
        </div>
      )}

      {/* Top flags */}
      {topFlags.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {topFlags.map((f, i) => (
            <li key={i} className={`flex gap-2 rounded-xl px-3 py-2 text-sm ${f.kind === "red" ? "bg-red-500/10 text-red-200" : "bg-amber-500/10 text-amber-200"}`}>
              <span className={`shrink-0 font-bold ${f.kind === "red" ? "text-red-400" : "text-amber-400"}`}>{f.kind === "red" ? "✗" : "⚠"}</span>
              {f.text}
            </li>
          ))}
        </ul>
      )}

      {/* Action buttons */}
      <div className="mt-4 space-y-2">
        {activeEmail === null && !rfqVisible && (
          <div className={`grid gap-2 ${showRFQButton ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
            <button type="button" onClick={() => setActiveEmail("questions")} className="rounded-xl bg-amber-500/20 py-2.5 text-sm font-bold text-amber-300 transition hover:bg-amber-500/30">
              Ställ frågor →
            </button>
            <button type="button" onClick={() => setActiveEmail("confirm")} className="rounded-xl bg-emerald-500/20 py-2.5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/30">
              Bekräfta offerten →
            </button>
            {showRFQButton && (
              <button type="button" onClick={() => setRfqVisible(true)} className="rounded-xl bg-slate-500/20 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-slate-500/30">
                Hitta andra offerter →
              </button>
            )}
          </div>
        )}

        {activeEmail === "questions" && (
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 space-y-2">
            <p className="text-xs text-slate-400">Frågemejl till {a.company?.name ?? "företaget"} – kopiera och skicka:</p>
            <div className="rounded-xl bg-black/30 p-3 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-mono">{buildQuestionsEmail(a)}</div>
            <button type="button" onClick={() => handleCopy(buildQuestionsEmail(a), setCopied)} className="w-full rounded-xl bg-white/10 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/20">{copied ? "Kopierat ✓" : "Kopiera text"}</button>
            <button type="button" onClick={() => setActiveEmail(null)} className="w-full text-xs text-slate-500 hover:text-slate-400">← Tillbaka</button>
          </div>
        )}

        {activeEmail === "confirm" && (
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 space-y-2">
            <p className="text-xs text-slate-400">Bekräftelsemejl till {a.company?.name ?? "företaget"} – kopiera och skicka:</p>
            <div className="rounded-xl bg-black/30 p-3 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-mono">{buildConfirmEmail(a)}</div>
            <button type="button" onClick={() => handleCopy(buildConfirmEmail(a), setCopied)} className="w-full rounded-xl bg-white/10 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/20">{copied ? "Kopierat ✓" : "Kopiera text"}</button>
            <button type="button" onClick={() => setActiveEmail(null)} className="w-full text-xs text-slate-500 hover:text-slate-400">← Tillbaka</button>
          </div>
        )}

        {rfqVisible && (
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 space-y-2">
            <p className="text-xs text-slate-400">Offertförfrågan att skicka till andra hantverkare:</p>
            <div className="rounded-xl bg-black/30 p-3 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-mono">{generateRFQ(a)}</div>
            <button type="button" onClick={() => handleCopy(generateRFQ(a), setRfqCopied)} className="w-full rounded-xl bg-white/10 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/20">{rfqCopied ? "Kopierat ✓" : "Kopiera offertförfrågan"}</button>
            <p className="text-xs text-slate-500">Hitta hantverkare via: <a href="https://www.hantverksdata.se" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">hantverksdata.se</a> · <a href="https://www.mittanbud.se" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">mittanbud.se</a></p>
            <button type="button" onClick={() => setRfqVisible(false)} className="w-full text-xs text-slate-500 hover:text-slate-400">← Tillbaka</button>
          </div>
        )}
      </div>

      <EmailCapture analysis={a} />

      {/* Visa detaljer toggle */}
      <button
        type="button"
        onClick={() => setShowDetails((s) => !s)}
        className="mt-4 w-full rounded-xl bg-white/5 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-white/10 hover:text-slate-300"
      >
        {showDetails ? "▲ Dölj detaljer" : "▼ Visa detaljer"}
      </button>

      {showDetails && (
        <div className="mt-3 space-y-4">
          {/* Line items */}
          {a.line_items && a.line_items.length > 0 && (
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Offertposter</p>
              <ul className="mt-3 divide-y divide-white/5 text-sm">
                {a.line_items.map((item, i) => {
                  const aColor = item.assessment === "HIGH" ? "text-red-400" : item.assessment === "LOW" ? "text-emerald-400" : "text-slate-500";
                  const aLabel = item.assessment === "HIGH" ? "Högt" : item.assessment === "LOW" ? "Lågt" : item.assessment === "FAIR" ? "OK" : null;
                  return (
                    <li key={i} className="flex items-start justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <span className="text-slate-200">{item.description}</span>
                        {item.market_range && <p className="mt-0.5 text-[11px] text-slate-500">Marknad: {item.market_range}</p>}
                        {item.comment && <p className="mt-0.5 text-[11px] text-slate-500">{item.comment}</p>}
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="font-semibold tabular-nums text-white">{item.amount.toLocaleString("sv-SE")} kr</span>
                        {aLabel && <p className={`text-[11px] font-bold ${aColor}`}>{aLabel}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* All flags */}
          {(filteredGreenFlags.length > 0 || (a.yellow_flags?.length ?? 0) > 0 || allRedFlags.length > 0) && (
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Alla signaler</p>
              {allRedFlags.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-bold text-red-400">✗ Problem</p>
                  <ul className="space-y-1 text-sm text-red-100/90">{allRedFlags.map((f, i) => <li key={i} className="flex gap-2"><span className="mt-0.5 shrink-0 text-red-500">·</span>{f}</li>)}</ul>
                </div>
              )}
              {(a.yellow_flags?.length ?? 0) > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-bold text-amber-400">⚠ Att tänka på</p>
                  <ul className="space-y-1 text-sm text-amber-100/90">{a.yellow_flags.map((f, i) => <li key={i} className="flex gap-2"><span className="mt-0.5 shrink-0 text-amber-500">·</span>{f}</li>)}</ul>
                </div>
              )}
              {filteredGreenFlags.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-bold text-emerald-400">✓ Positivt</p>
                  <ul className="space-y-1 text-sm text-emerald-100/90">{filteredGreenFlags.map((f, i) => <li key={i} className="flex gap-2"><span className="mt-0.5 shrink-0 text-emerald-500">·</span>{f}</li>)}</ul>
                </div>
              )}
            </div>
          )}

          {/* Full company block */}
          <CompanyBlock verification={props.verification} verificationError={props.verificationError} />

          {/* Missing items */}
          {(a.missing_in_quote?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {a.missing_in_quote.map((m, i) => <span key={i} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">Saknas: {m}</span>)}
            </div>
          )}
        </div>
      )}

      <button type="button" onClick={props.onClose} className="mt-4 w-full rounded-2xl bg-[#6366f1] py-3 text-sm font-bold text-white transition hover:bg-[#4f46e5]">Fråga Saga om en ny offert</button>
    </div>
  );
}

// ─── InvoiceResultBlock ───────────────────────────────────────────────────────

const INVOICE_VERDICT_CONFIG = {
  SAFE:         { label: "ÄKTA",   icon: "✓", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  SUSPICIOUS:   { label: "OSÄKER", icon: "⚠", color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30"   },
  LIKELY_FRAUD: { label: "FALSK",  icon: "✗", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30"     },
} as const;

function InvoiceResultBlock(props: { analysis: InvoiceAnalysis; verification: CompanyVerification | null; verificationError: string | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const a = props.analysis;
  const v = props.verification;
  const vc = INVOICE_VERDICT_CONFIG[a.fraud_verdict] ?? INVOICE_VERDICT_CONFIG.SUSPICIOUS;

  // Primary reason: first fraud signal if available, else first from verdict_text
  const primaryReason = a.fraud_signals?.[0] ?? a.verdict_text;

  const fSkattOk = v ? v.preliminaryTaxReg !== false : null;
  const activeOk = v ? !(v.statusTextHigh && /avregistrerad|konkurs|likvidation/i.test(v.statusTextHigh)) : null;
  const regYear = v?.companyRegistrationDate ? v.companyRegistrationDate.slice(0, 4) : null;

  function buildDisputeEmail(): string {
    const isLikelyFraud = a.fraud_verdict === "LIKELY_FRAUD";
    const subject = isLikelyFraud ? "Anmälan – misstänkt bedrägeriförsök" : "Frågor angående faktura";
    return `${subject}\n\nHej ${a.company?.name ?? "er"},\n\nJag har mottagit faktura nr ${a.invoice?.invoice_number ?? "–"} daterad ${a.invoice?.invoice_date ?? "–"} på ${a.invoice?.total_amount?.toLocaleString("sv-SE") ?? "–"} kr.\n\nJag ber er bekräfta:\n1. Att angivet bankgiro/IBAN tillhör ert företag\n2. Att organisationsnummer ${a.company?.org_nr ?? "–"} stämmer\n3. Specificering av de utförda tjänsterna\n\nJag betalar inte fakturan förrän dessa uppgifter bekräftats.\n\nMed vänlig hälsning`;
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildDisputeEmail()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Saga svarar – Fakturakontroll</p>

      {/* Full-width verdict panel */}
      <div className={`mt-4 rounded-2xl border p-6 text-center ${vc.bg} ${vc.border}`}>
        <p className={`text-5xl font-black ${vc.color}`}>{vc.icon} {vc.label}</p>
        <p className="mt-2 text-sm font-medium leading-snug text-slate-300 max-w-xs mx-auto">{primaryReason}</p>
        <p className="mt-3 text-xs text-slate-500">
          {a.company?.name ?? "Okänt företag"}
          {a.invoice?.invoice_number ? ` · Faktura ${a.invoice.invoice_number}` : ""}
          {a.invoice?.total_amount ? ` · ${a.invoice.total_amount.toLocaleString("sv-SE")} kr` : ""}
        </p>
      </div>

      {/* Company micro row */}
      {(v || props.verificationError) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-white/5 px-4 py-2.5 ring-1 ring-white/10 text-sm">
          {v ? (
            <>
              <span className={fSkattOk ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                {fSkattOk ? "✓" : "✗"} F-skatt
              </span>
              <span className="text-slate-600">·</span>
              <span className={activeOk ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                {activeOk ? "✓" : "✗"} Aktivt
              </span>
              {regYear && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Reg. {regYear}</span>
                </>
              )}
            </>
          ) : (
            <span className="text-amber-400 text-xs">{props.verificationError}</span>
          )}
        </div>
      )}

      {/* Single action button */}
      <div className="mt-4">
        {a.fraud_verdict === "SAFE" && (
          <button type="button" onClick={props.onClose} className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">
            OK, fakturan är kontrollerad
          </button>
        )}
        {a.fraud_verdict === "SUSPICIOUS" && (
          <button type="button" onClick={handleCopy} className="w-full rounded-2xl bg-amber-500/20 py-3 text-sm font-bold text-amber-300 transition hover:bg-amber-500/30">
            {copied ? "Kopierat ✓" : "Kopiera ifrågasättande mejl"}
          </button>
        )}
        {a.fraud_verdict === "LIKELY_FRAUD" && (
          <div className="space-y-2">
            <button type="button" onClick={handleCopy} className="w-full rounded-2xl bg-red-500/20 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/30">
              {copied ? "Kopierat ✓" : "BETALA INTE — Kopiera anmälningsmejl"}
            </button>
            <p className="text-center text-xs font-bold text-red-400">Ring din bank: 114 14</p>
          </div>
        )}
      </div>

      {a.fraud_verdict !== "SAFE" && (
        <button type="button" onClick={props.onClose} className="mt-3 w-full rounded-2xl bg-white/5 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-white/10">Kontrollera en ny faktura</button>
      )}
    </div>
  );
}

// ─── CompareResultBlock ───────────────────────────────────────────────────────

const VERDICT_SCORE: Record<string, number> = { LOW: 3, FAIR: 2, HIGH: 1, VERY_HIGH: 0 };

function calcCompareScore(a: SagaAnalysis): number {
  return (VERDICT_SCORE[a.verdict] ?? 1) - (a.red_flags?.length ?? 0) * 0.5;
}

function CompareResultBlock(props: { a: CompareResult; b: CompareResult; onClose: () => void }) {
  const { a, b } = props;
  const scoreA = calcCompareScore(a.analysis);
  const scoreB = calcCompareScore(b.analysis);
  const winner: "A" | "B" | "draw" = scoreA > scoreB ? "A" : scoreB > scoreA ? "B" : "draw";

  const vcA = VERDICT_CONFIG[a.analysis.verdict] ?? VERDICT_CONFIG.FAIR;
  const vcB = VERDICT_CONFIG[b.analysis.verdict] ?? VERDICT_CONFIG.FAIR;
  const totalA = a.analysis.quote?.total_amount ?? 0;
  const totalB = b.analysis.quote?.total_amount ?? 0;
  const cheaper = totalA < totalB ? "A" : totalB < totalA ? "B" : "draw";
  const priceDiff = Math.abs(totalA - totalB);

  const fSkattA = a.verification ? a.verification.preliminaryTaxReg !== false : null;
  const fSkattB = b.verification ? b.verification.preliminaryTaxReg !== false : null;
  const activeA = a.verification ? !(a.verification.statusTextHigh && /avregistrerad|konkurs|likvidation/i.test(a.verification.statusTextHigh)) : null;
  const activeB = b.verification ? !(b.verification.statusTextHigh && /avregistrerad|konkurs|likvidation/i.test(b.verification.statusTextHigh)) : null;

  function boolCell(val: boolean | null): React.ReactNode {
    if (val === null) return <span className="text-slate-500">—</span>;
    return val
      ? <span className="text-emerald-400 font-bold">✓</span>
      : <span className="text-red-400 font-bold">✗</span>;
  }

  const redCountA = (a.analysis.red_flags?.length ?? 0);
  const redCountB = (b.analysis.red_flags?.length ?? 0);

  const winnerName = winner === "A" ? (a.analysis.company?.name ?? "Offert A") : winner === "B" ? (b.analysis.company?.name ?? "Offert B") : null;

  // Build summary text
  let summaryText = "";
  if (winner === "draw") {
    summaryText = "Jämnt resultat — välj baserat på tillgänglighet";
  } else {
    const parts: string[] = [];
    if (cheaper === winner) parts.push(`${priceDiff.toLocaleString("sv-SE")} kr billigare`);
    if (winner === "A" && redCountA < redCountB) parts.push("färre problem");
    if (winner === "B" && redCountB < redCountA) parts.push("färre problem");
    summaryText = `★ Saga rekommenderar ${winnerName}${parts.length ? ` — ${parts.join(" och ")}` : ""}`;
  }

  const rows = [
    {
      label: "Företag",
      a: <span className="text-slate-200 text-xs">{a.analysis.company?.name ?? "—"}</span>,
      b: <span className="text-slate-200 text-xs">{b.analysis.company?.name ?? "—"}</span>,
    },
    {
      label: "Totalpris",
      a: (
        <span className={`font-bold tabular-nums text-xs ${cheaper === "A" ? "text-emerald-400" : "text-slate-200"}`}>
          {totalA.toLocaleString("sv-SE")} kr{cheaper === "A" ? " ✓" : ""}
        </span>
      ),
      b: (
        <span className={`font-bold tabular-nums text-xs ${cheaper === "B" ? "text-emerald-400" : "text-slate-200"}`}>
          {totalB.toLocaleString("sv-SE")} kr{cheaper === "B" ? " ✓" : ""}
        </span>
      ),
    },
    {
      label: "Prisnivå",
      a: <span className={`text-xs font-bold ${vcA.color}`}>{vcA.label}</span>,
      b: <span className={`text-xs font-bold ${vcB.color}`}>{vcB.label}</span>,
    },
    {
      label: "F-skatt",
      a: boolCell(fSkattA),
      b: boolCell(fSkattB),
    },
    {
      label: "Aktivt bolag",
      a: boolCell(activeA),
      b: boolCell(activeB),
    },
    {
      label: "Röda flaggor",
      a: (
        <span className={`text-xs font-bold ${redCountA === 0 ? "text-emerald-400" : "text-red-400"}`}>
          {redCountA} {redCountA === 0 ? "✓" : "✗"}
        </span>
      ),
      b: (
        <span className={`text-xs font-bold ${redCountB === 0 ? "text-emerald-400" : "text-red-400"}`}>
          {redCountB} {redCountB === 0 ? "✓" : "✗"}
        </span>
      ),
    },
  ];

  return (
    <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Saga jämför</p>

      {/* Comparison table */}
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white/5 ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-3 pl-4 pr-2 text-left text-xs font-bold uppercase tracking-wider text-slate-500 w-1/3"></th>
              <th className={`py-3 px-3 text-center text-xs font-black uppercase tracking-wider ${winner === "A" ? "text-[#6366f1]" : "text-slate-400"}`}>
                Offert A{winner === "A" && " ★"}
              </th>
              <th className={`py-3 pl-3 pr-4 text-center text-xs font-black uppercase tracking-wider ${winner === "B" ? "text-[#6366f1]" : "text-slate-400"}`}>
                Offert B{winner === "B" && " ★"}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 1 ? "bg-white/[0.03]" : ""}>
                <td className="py-2.5 pl-4 pr-2 text-xs font-medium text-slate-500">{row.label}</td>
                <td className="py-2.5 px-3 text-center">{row.a}</td>
                <td className="py-2.5 pl-3 pr-4 text-center">{row.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary banner */}
      <div className={`mt-4 rounded-2xl p-4 text-center ${winner === "draw" ? "bg-slate-500/10 border border-slate-500/30" : "bg-[#6366f1]/15 border border-[#6366f1]/30"}`}>
        <p className={`text-sm font-bold ${winner === "draw" ? "text-slate-300" : "text-white"}`}>{summaryText}</p>
      </div>

      <div className="mt-4">
        <button type="button" onClick={props.onClose} className="w-full rounded-2xl bg-[#6366f1] py-3 text-sm font-bold text-white transition hover:bg-[#4f46e5]">Jämför nya offerter</button>
      </div>
    </div>
  );
}
