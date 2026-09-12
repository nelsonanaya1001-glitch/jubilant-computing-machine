"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Check, ExternalLink, Copy, Send } from "lucide-react";

type Asset = {
  id: string;
  kind: string;
  label: string | null;
  svg: string | null;
  data: any;
  selected: boolean;
};

type Submission = {
  id: string;
  businessName: string;
  tagline: string | null;
  industry: string;
  contactName: string;
  email: string;
  phone: string | null;
  targetAudience: string;
  businessDescription: string;
  stylePreferences: string[];
  seedColors: string[];
  colorNotes: string | null;
  avoidColors: string | null;
  logoTypePref: string | null;
  inspirationRefs: string | null;
  competitorNotes: string | null;
  tier: string;
  status: string;
  createdAt: string;
  assets: Asset[];
};

const STATUSES = ["SUBMITTED", "GENERATED", "IN_REVIEW", "DELIVERED"];

export default function AdminBrandDetailPage({ params }: { params: { id: string } }) {
  const [sub, setSub] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [seed, setSeed] = useState("#7c3aed");
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/brand/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setSub(data);
      setSeed((data.seedColors?.[0] as string) || "#7c3aed");
    }
    setLoading(false);
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  async function regenerate() {
    setBusy("regen");
    await fetch(`/api/brand/${params.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seedColors: [seed] }),
    });
    await load();
    setBusy("");
  }

  async function select(assetId: string) {
    setBusy(assetId);
    await fetch(`/api/brand/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedAssetId: assetId }),
    });
    await load();
    setBusy("");
  }

  async function setStatus(status: string) {
    setBusy("status");
    await fetch(`/api/brand/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setBusy("");
  }

  function copyGuideLink() {
    const url = `${window.location.origin}/brand-guide/${params.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading) return <div className="p-8 text-gray-400 text-sm">Loading…</div>;
  if (!sub) return <div className="p-8 text-gray-400 text-sm">Not found.</div>;

  const logos = sub.assets.filter((a) => a.kind === "logo");
  const palette = sub.assets.find((a) => a.kind === "palette")?.data;
  const fonts = sub.assets.find((a) => a.kind === "fonts")?.data;

  return (
    <div className="p-8 max-w-6xl">
      <Link href="/admin/brand" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to brand orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{sub.businessName}</h1>
          <p className="text-gray-500 mt-1">
            {sub.industry} · {sub.contactName} · {sub.email}
            {sub.phone ? ` · ${sub.phone}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sub.status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={busy === "status"}
            className="h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={copyGuideLink}>
            <Copy className="w-4 h-4 mr-1.5" /> {copied ? "Copied!" : "Copy guide link"}
          </Button>
          <a href={`/brand-guide/${sub.id}`} target="_blank" rel="noopener noreferrer">
            <Button size="sm"><ExternalLink className="w-4 h-4 mr-1.5" /> Open brand guide</Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Concepts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h2 className="font-bold text-gray-900">Logo concepts</h2>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
                  title="Adjust the brand colour and regenerate"
                />
                <Button variant="outline" size="sm" onClick={regenerate} disabled={busy === "regen"}>
                  <RefreshCw className={`w-4 h-4 mr-1.5 ${busy === "regen" ? "animate-spin" : ""}`} />
                  {busy === "regen" ? "Regenerating…" : "Regenerate"}
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Click a concept to mark it as the client&apos;s primary logo — it leads the brand guide.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {logos.map((l) => (
                <button
                  key={l.id}
                  onClick={() => select(l.id)}
                  disabled={busy === l.id}
                  className={`relative text-left rounded-xl border-2 p-4 transition ${
                    l.selected ? "border-blue-500 bg-blue-50/40" : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  {l.selected && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </span>
                  )}
                  <div
                    className="bg-white rounded-lg min-h-[90px] flex items-center justify-center mb-2 p-2"
                    dangerouslySetInnerHTML={{
                      __html: (l.svg || "").replace("<svg", '<svg style="max-height:64px;max-width:100%"'),
                    }}
                  />
                  <div className="text-xs font-medium text-gray-700">{l.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Palette + fonts */}
          {palette && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4">
                Palette <span className="text-xs font-normal text-gray-400">({palette.harmony})</span>
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {palette.colors?.map((c: any) => (
                  <div key={c.role}>
                    <div className="h-16 rounded-lg border border-gray-200" style={{ backgroundColor: c.hex }} />
                    <div className="text-[10px] font-mono text-gray-500 mt-1.5">{c.hex}</div>
                    <div className="text-[10px] text-gray-400">{c.name}</div>
                  </div>
                ))}
              </div>
              {fonts && (
                <p className="text-sm text-gray-500 mt-5 pt-5 border-t border-gray-100">
                  <span className="font-medium text-gray-700">{fonts.heading}</span> for headings ·{" "}
                  <span className="font-medium text-gray-700">{fonts.body}</span> for body
                </p>
              )}
            </div>
          )}
        </div>

        {/* Brief */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <h2 className="font-bold text-gray-900 mb-4">The brief</h2>
          <dl className="space-y-4 text-sm">
            <Field label="Tier" value={sub.tier} />
            <Field label="Tagline" value={sub.tagline} />
            <Field label="Style" value={(sub.stylePreferences || []).join(", ")} />
            <Field label="Seed colours" value={(sub.seedColors || []).join(", ")} />
            <Field label="Colour notes" value={sub.colorNotes} />
            <Field label="Avoid" value={sub.avoidColors} />
            <Field label="Logo preference" value={sub.logoTypePref} />
            <Field label="Audience" value={sub.targetAudience} />
            <Field label="About" value={sub.businessDescription} />
            <Field label="Inspiration" value={sub.inspirationRefs} />
            <Field label="Competitors" value={sub.competitorNotes} />
          </dl>

          {sub.status !== "DELIVERED" && (
            <Button className="w-full mt-6" onClick={() => setStatus("DELIVERED")} disabled={busy === "status"}>
              <Send className="w-4 h-4 mr-1.5" /> Mark as delivered
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">{label}</dt>
      <dd className="text-gray-700 leading-relaxed whitespace-pre-wrap">{value}</dd>
    </div>
  );
}
