import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Palette } from "@/lib/brand/palette";
import { readableOn } from "@/lib/brand/palette";
import type { FontPairing } from "@/lib/brand/fonts";
import { PrintButton } from "./PrintButton";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const submission = await prisma.brandSubmission.findUnique({
    where: { id: params.id },
    select: { businessName: true },
  });
  return {
    title: submission ? `${submission.businessName} — Brand Guide` : "Brand Guide",
    robots: { index: false, follow: false },
  };
}

export default async function BrandGuidePage({ params }: Props) {
  const submission = await prisma.brandSubmission.findUnique({
    where: { id: params.id },
    include: { assets: { orderBy: { createdAt: "asc" } } },
  });

  if (!submission) notFound();

  const logos = submission.assets.filter((a) => a.kind === "logo");
  const paletteAsset = submission.assets.find((a) => a.kind === "palette");
  const fontsAsset = submission.assets.find((a) => a.kind === "fonts");

  const palette = paletteAsset?.data as unknown as Palette | undefined;
  const fonts = fontsAsset?.data as unknown as FontPairing | undefined;

  if (!palette || !fonts || logos.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-8 text-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900">Brand guide not ready yet</h1>
          <p className="text-zinc-500">
            We&apos;re still preparing this brand kit. Check back shortly.
          </p>
        </div>
      </div>
    );
  }

  const primaryLogo = logos.find((l) => l.selected) ?? logos[0];
  const otherLogos = logos.filter((l) => l.id !== primaryLogo.id);
  const primary = palette.colors.find((c) => c.role === "primary")!;
  const ink = palette.colors.find((c) => c.role === "ink")!;

  const sized = (svg: string, maxHeight: number) =>
    svg.replace("<svg", `<svg style="max-height:${maxHeight}px;max-width:100%;height:auto"`);

  return (
    <div className="min-h-screen bg-zinc-100 py-10 print:bg-white print:py-0">
      {/* Google Fonts for the chosen pairing, so samples render in the real faces. */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href={fonts.embedUrl} rel="stylesheet" />
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .sheet { box-shadow: none !important; margin: 0 !important; max-width: none !important; }
          .page-break { break-before: page; }
        }
        @page { margin: 14mm; }
      `}</style>

      <div className="sheet mx-auto max-w-4xl bg-white p-10 shadow-xl print:p-0 md:p-14">
        {/* Masthead */}
        <header className="mb-12 flex flex-wrap items-start justify-between gap-6 border-b border-zinc-200 pb-8">
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Brand Guide
            </div>
            <h1
              className="text-4xl font-bold tracking-tight text-zinc-900"
              style={{ fontFamily: `"${fonts.heading}", system-ui, sans-serif` }}
            >
              {submission.businessName}
            </h1>
            {submission.tagline && (
              <p className="mt-2 text-zinc-500" style={{ fontFamily: `"${fonts.body}", system-ui, sans-serif` }}>
                {submission.tagline}
              </p>
            )}
          </div>
          <PrintButton />
        </header>

        {/* 1 — Primary logo */}
        <section className="mb-12">
          <SectionTitle n="01" title="Primary logo" />
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-zinc-500">
            This is your main mark. Give it room to breathe — keep clear space around it equal to
            at least the height of one letter, and never stretch or recolour it.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex min-h-[190px] items-center justify-center rounded-xl border border-zinc-200 bg-white p-8">
              <div dangerouslySetInnerHTML={{ __html: sized(primaryLogo.svg!, 110) }} />
            </div>
            <div
              className="flex min-h-[190px] items-center justify-center rounded-xl p-8"
              style={{ backgroundColor: ink.hex }}
            >
              <div
                className="[&_svg_text]:!fill-white [&_svg_rect]:!opacity-100"
                dangerouslySetInnerHTML={{ __html: sized(primaryLogo.svg!, 110) }}
              />
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-4 text-xs text-zinc-400 sm:grid-cols-2">
            <div>On light backgrounds</div>
            <div>On dark backgrounds</div>
          </div>
        </section>

        {/* 2 — Alternates */}
        {otherLogos.length > 0 && (
          <section className="mb-12">
            <SectionTitle n="02" title="Logo variations" />
            <p className="mb-5 max-w-2xl text-sm leading-relaxed text-zinc-500">
              Use these where the primary mark doesn&apos;t fit — square avatars, app icons,
              stamps and narrow headers.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {otherLogos.map((l) => (
                <div key={l.id}>
                  <div className="flex min-h-[130px] items-center justify-center rounded-xl border border-zinc-200 bg-white p-5">
                    <div dangerouslySetInnerHTML={{ __html: sized(l.svg!, 72) }} />
                  </div>
                  <div className="mt-2 text-center text-xs text-zinc-400">{l.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3 — Colour */}
        <section className="page-break mb-12">
          <SectionTitle n="03" title="Colour palette" />
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-zinc-500">
            Lead with Primary. Use Accent for secondary actions and Highlight sparingly. Ink and
            Surface carry most of your text and backgrounds.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {palette.colors.map((c) => (
              <div key={c.role} className="overflow-hidden rounded-xl border border-zinc-200">
                <div
                  className="flex h-24 items-end p-3"
                  style={{ backgroundColor: c.hex, color: readableOn(c.hex) }}
                >
                  <span className="font-mono text-xs font-semibold uppercase">{c.hex}</span>
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold text-zinc-900">{c.name}</div>
                  <div className="mt-1 text-xs leading-relaxed text-zinc-500">{c.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4 — Typography */}
        <section className="mb-12">
          <SectionTitle n="04" title="Typography" />
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-zinc-500">{fonts.rationale}</p>

          <div className="mb-4 rounded-xl border border-zinc-200 p-6">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Headings
              </span>
              <span className="font-mono text-xs text-zinc-500">
                {fonts.heading} · {fonts.headingWeight}
              </span>
            </div>
            <div
              className="text-4xl leading-tight text-zinc-900"
              style={{ fontFamily: `"${fonts.heading}", system-ui, sans-serif`, fontWeight: fonts.headingWeight }}
            >
              {submission.businessName}
            </div>
            <div
              className="mt-1 text-2xl text-zinc-400"
              style={{ fontFamily: `"${fonts.heading}", system-ui, sans-serif`, fontWeight: fonts.headingWeight }}
            >
              ABCDEFGHIJKLM · 0123456789
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 p-6">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Body text
              </span>
              <span className="font-mono text-xs text-zinc-500">
                {fonts.body} · {fonts.bodyWeight}
              </span>
            </div>
            <p
              className="max-w-2xl leading-relaxed text-zinc-600"
              style={{ fontFamily: `"${fonts.body}", system-ui, sans-serif`, fontWeight: fonts.bodyWeight }}
            >
              This is how your body copy will look. Use it for paragraphs, descriptions, form
              labels and anything a customer needs to read carefully. Keep line length comfortable
              — around 60 to 80 characters — and leave generous space between lines.
            </p>
          </div>

          <div className="mt-3 rounded-lg bg-zinc-50 p-4 font-mono text-xs text-zinc-500">
            {`<link href="${fonts.embedUrl}" rel="stylesheet">`}
          </div>
        </section>

        {/* 5 — Usage */}
        <section className="mb-12">
          <SectionTitle n="05" title="Usage notes" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
              <div className="mb-3 text-sm font-bold text-emerald-800">Do</div>
              <ul className="space-y-2 text-sm leading-relaxed text-emerald-900/80">
                <li>Keep clear space around the logo on every placement.</li>
                <li>Use Primary for your main call-to-action buttons.</li>
                <li>Stick to the two fonts above across all materials.</li>
                <li>Use the square monogram for social avatars and favicons.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5">
              <div className="mb-3 text-sm font-bold text-rose-800">Don&apos;t</div>
              <ul className="space-y-2 text-sm leading-relaxed text-rose-900/80">
                <li>Stretch, squash or rotate the logo.</li>
                <li>Recolour the mark outside this palette.</li>
                <li>Place the logo on a busy photo without a solid backing.</li>
                <li>Add drop shadows, outlines or gradients to the mark.</li>
              </ul>
            </div>
          </div>
        </section>

        <footer
          className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-400"
          style={{ borderTopColor: primary.hex + "33" }}
        >
          <span>
            {submission.businessName} — Brand Guide ·{" "}
            {new Date(submission.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>Prepared by Launchboarding</span>
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-3 flex items-baseline gap-3">
      <span className="font-mono text-xs text-zinc-300">{n}</span>
      <h2 className="text-xl font-bold tracking-tight text-zinc-900">{title}</h2>
    </div>
  );
}
