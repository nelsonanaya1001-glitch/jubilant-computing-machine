import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";

export const metadata = { title: "Checkout Cancelled | Launchboarding" };

export default function CheckoutCancelledPage() {
  return (
    <div className="bg-[#080810] text-white min-h-screen">
      <section className="max-w-xl mx-auto px-6 lg:px-8 pt-40 pb-24 text-center">
        <h1 className="text-4xl font-black tracking-tight mb-5">No payment taken.</h1>
        <p className="text-white/50 leading-relaxed mb-10">
          Your cart is exactly where you left it, so you can pick up whenever you&apos;re ready.
          If something was unclear about the pricing, just ask — we&apos;d rather answer first.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/cart">
            <Button className="bg-violet-600 hover:bg-violet-500 border-0">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to cart
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outlineDark">
              <MessageCircle className="mr-2 w-4 h-4" /> Ask a question
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
