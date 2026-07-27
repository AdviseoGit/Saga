"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  buildHandoverText,
  buildPartnerPitch,
  INTENT_BUYER,
  INTENT_LABEL,
  leadAgeDays,
  STATUS_LABEL,
  type LeadStatus,
  type PartnerLead,
} from "@/lib/partner-pitch";

const TOKEN_KEY = "saga_admin_token";

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-emerald-100 text-emerald-800",
  contacted: "bg-amber-100 text-amber-800",
  sold: "bg-indigo-100 text-indigo-800",
  discarded: "bg-slate-200 text-slate-600",
};

function kr(value: number | null): string {
  const n = Number(value);
  if (!isFinite(n) || !value) return "—";
  return `${Math.round(n).toLocaleString("sv-SE")} kr`;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="rounded-lg bg-[#0f172a] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#1e293b]"
    >
      {copied ? "Kopierat ✓" : label}
    </button>
  );
}

export default function AdminLeadsPage() {
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [leads, setLeads] = useState<PartnerLead[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("new");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (saved) setToken(saved);
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const qs = statusFilter === "all" ? "" : `?status=${statusFilter}`;
      const r = await fetch(`/api/admin/partner-leads${qs}`, { headers: { "x-admin-token": token } });
      const payload = await r.json();
      if (!r.ok) {
        if (r.status === 401) {
          sessionStorage.removeItem(TOKEN_KEY);
          setToken("");
        }
        setError(payload.error ?? "Kunde inte hämta leads.");
        setLeads([]);
        return;
      }
      setLeads(payload.leads ?? []);
      setCounts(payload.counts ?? {});
    } catch {
      setError("Nätverksfel.");
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(lead: PartnerLead, status: LeadStatus, soldTo?: string) {
    const r = await fetch("/api/admin/partner-leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id: lead.id, status, soldTo }),
    });
    if (r.ok) void load();
    else setError("Kunde inte uppdatera leadet.");
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4">
        <div className="w-full max-w-sm rounded-[22px] border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <h1 className="text-lg font-black text-[#0f172a]">Saga Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Ange admin-token för att se leads.</p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tokenInput) {
                sessionStorage.setItem(TOKEN_KEY, tokenInput);
                setToken(tokenInput);
              }
            }}
            placeholder="Token"
            className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6366f1]"
          />
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(TOKEN_KEY, tokenInput);
              setToken(tokenInput);
            }}
            disabled={!tokenInput}
            className="mt-3 w-full rounded-xl bg-[#6366f1] py-2.5 text-sm font-bold text-white transition hover:bg-[#4f46e5] disabled:opacity-50"
          >
            Logga in
          </button>
          {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-black text-[#0f172a]">Partnerleads</h1>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(TOKEN_KEY);
              setToken("");
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Logga ut
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["new", "contacted", "sold", "discarded", "all"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                statusFilter === s ? "bg-[#0f172a] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {s === "all" ? "Alla" : STATUS_LABEL[s]}
              {s !== "all" && counts[s] !== undefined ? ` (${counts[s]})` : ""}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
        {loading && <p className="mt-4 text-sm text-slate-500">Hämtar…</p>}
        {!loading && leads.length === 0 && !error && (
          <p className="mt-6 rounded-[22px] border border-[#e2e8f0] bg-white p-6 text-sm text-slate-500">
            Inga leads med den statusen än.
          </p>
        )}

        <div className="mt-4 space-y-3">
          {leads.map((lead) => {
            const pitch = buildPartnerPitch(lead);
            const open = openId === lead.id;
            const days = leadAgeDays(lead);
            return (
              <div key={lead.id} className="rounded-[22px] border border-[#e2e8f0] bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : lead.id)}
                  className="flex w-full items-start justify-between gap-3 p-5 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_STYLE[lead.status]}`}>
                        {STATUS_LABEL[lead.status]}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {days === 0 ? "I dag" : `${days} d gammalt`}
                      </span>
                    </div>
                    <p className="mt-1.5 font-bold text-[#0f172a]">
                      {lead.quote_category ?? "Okänd kategori"} · {lead.quote_region ?? "Okänd region"}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {kr(lead.quote_total)}
                      {lead.over_market_pct ? ` · ${Math.round(Number(lead.over_market_pct))} % mot snittet` : ""}
                      {" · "}
                      {INTENT_LABEL[lead.intent]}
                    </p>
                  </div>
                  <span className="shrink-0 text-slate-400">{open ? "▲" : "▼"}</span>
                </button>

                {open && (
                  <div className="space-y-4 border-t border-[#e2e8f0] p-5">
                    <p className="text-xs font-semibold text-slate-500">
                      Säljs till: {INTENT_BUYER[lead.intent]}
                      {lead.sold_to ? ` · Såld till ${lead.sold_to}` : ""}
                    </p>

                    <div className="rounded-xl bg-[#f8fafc] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Mejlskript</p>
                        <CopyButton text={`${pitch.subject}\n\n${pitch.body}`} label="Kopiera mejl" />
                      </div>
                      <p className="mt-2 text-xs font-bold text-slate-700">Ämne: {pitch.subject}</p>
                      <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-700">
                        {pitch.body}
                      </pre>
                    </div>

                    <div className="rounded-xl bg-[#f8fafc] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Telefonskript</p>
                        <CopyButton text={pitch.callScript} label="Kopiera punkter" />
                      </div>
                      <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-700">
                        • {pitch.callScript}
                      </pre>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                        Kundens kontaktuppgifter
                      </p>
                      <p className="mt-1 text-xs text-amber-800">
                        Lämnas ut först när leadet är sålt – skriptet ovan är anonymiserat.
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <CopyButton text={buildHandoverText(lead)} label="Kopiera kontaktuppgifter" />
                        <span className="text-xs text-amber-800">
                          {lead.name ? `${lead.name} · ` : ""}
                          {lead.email}
                          {lead.phone ? ` · ${lead.phone}` : ""}
                        </span>
                      </div>
                    </div>

                    <StatusActions lead={lead} onSet={setStatus} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function StatusActions(props: {
  lead: PartnerLead;
  onSet: (lead: PartnerLead, status: LeadStatus, soldTo?: string) => void;
}) {
  const [soldTo, setSoldTo] = useState(props.lead.sold_to ?? "");
  const [sellOpen, setSellOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => props.onSet(props.lead, "contacted")}
        className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 transition hover:bg-amber-200"
      >
        Markera kontaktad
      </button>
      {sellOpen ? (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={soldTo}
            onChange={(e) => setSoldTo(e.target.value)}
            placeholder="Vilket bolag köpte?"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#6366f1]"
          />
          <button
            type="button"
            onClick={() => props.onSet(props.lead, "sold", soldTo)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-700"
          >
            Spara som såld
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setSellOpen(true)}
          className="rounded-lg bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-800 transition hover:bg-indigo-200"
        >
          Markera såld
        </button>
      )}
      <button
        type="button"
        onClick={() => props.onSet(props.lead, "discarded")}
        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
      >
        Kasta
      </button>
    </div>
  );
}
