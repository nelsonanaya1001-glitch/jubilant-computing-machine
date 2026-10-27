import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/catalog";
import { ClearCartOnMount } from "./ClearCartOnMount";

export const metadata = { title: "Payment Received | Launchboarding" };
export const dynamic = "force-dynamic";

type OrderItem = { sku: string; name: string; setupCents: number; monthlyCents: number };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  // Looked up by reference only — this page never confirms payment itself, it
  // just shows what was ordered. The Stripe webhook owns the paid/unpaid flag.
  const reference = typeof searchParams.ref === "string" ? searchParams.ref : "";
  const order = reference
    ? await prisma.order.findUnique({ where: { reference } })
    : null;

  const items = (order?.items as unknown as OrderItem[]) ?? [];

  return (
    <div className="bg-[#080810] text-white min-h-screen">
      <ClearCartOnMount />
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full filter blur-[120px]" />
        <div className="relative max-w-2xl mx-auto px-6 lg:px-8 pt-36 pb-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-7">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            You&apos;re all set.
          </h1>
          <p className="text-white/50 leading-relaxed mb-10">
            Payment received. A receipt is on its way to your inbox, and we&apos;ll be in touch
            within one business day to kick things off.
          </p>

          {order && (
            <div className="text-left rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7 mb-10">
              <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-white/5">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/30">
                  Order
                </span>
                <span className="font-mono text-sm font-bold text-violet-300">
                  {order.reference}
                </span>
              </div>
              <ul className="space-y-2 mb-4">
                {items.map((i) => (
                  <li key={i.sku} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-white/55">{i.name}</span>
                    <span className="text-white/80 font-medium">
                      {i.setupCents > 0
                        ? formatMoney(i.setupCents)
                        : `${formatMoney(i.monthlyCents)}/mo`}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/5 pt-4 space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Paid today</span>
                  <span className="font-bold text-white">
                    {formatMoney(order.dueTodayCents)}
                  </span>
                </div>
                {order.balanceCents > 0 && (
                  <div className="flex items-center justify-between text-xs text-white/35">
                    <span>Balance on delivery</span>
                    <span>{formatMoney(order.balanceCents)}</span>
                  </div>
                )}
                {order.monthlyCents > 0 && (
                  <div className="flex items-center justify-between text-xs text-white/35">
                    <span>Monthly from today</span>
                    <span>{formatMoney(order.monthlyCents)}/mo</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left mb-10">
            <h2 className="font-bold text-white mb-3">What happens next</h2>
            <ol className="space-y-2.5 text-sm text-white/50">
              <li className="flex gap-3">
                <span className="text-violet-400 font-bold">1.</span>
                We email you a short intake form so we have everything we need.
              </li>
              <li className="flex gap-3">
                <span className="text-violet-400 font-bold">2.</span>
                You get portal access to follow progress and send us files.
              </li>
              <li className="flex gap-3">
                <span className="text-violet-400 font-bold">3.</span>
                First version lands for your review, usually within a week.
              </li>
            </ol>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/get-started">
              <Button className="bg-violet-600 hover:bg-violet-500 border-0">
                Fill in the intake now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <Mail className="mr-2 w-4 h-4" /> Contact us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
