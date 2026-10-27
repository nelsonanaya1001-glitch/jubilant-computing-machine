import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { formatMoney } from "@/lib/catalog";
import { CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

type OrderItem = { sku: string; name: string; setupCents: number; monthlyCents: number };

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PAID: "bg-green-100 text-green-800 border-green-200",
  FAILED: "bg-red-100 text-red-800 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-700 border-gray-200",
  REFUNDED: "bg-purple-100 text-purple-800 border-purple-200",
};

export default async function AdminOrdersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const paid = orders.filter((o) => o.status === "PAID");
  const collected = paid.reduce((sum, o) => sum + o.dueTodayCents, 0);
  const outstanding = paid.reduce((sum, o) => sum + o.balanceCents, 0);
  const recurring = paid.reduce((sum, o) => sum + o.monthlyCents, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">{orders.length} most recent orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Collected", value: formatMoney(collected), hint: `${paid.length} paid orders` },
          { label: "Balances due", value: formatMoney(outstanding), hint: "On delivery" },
          { label: "Recurring", value: `${formatMoney(recurring)}/mo`, hint: "Active subscriptions" },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              {card.label}
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-xs text-gray-400 mt-1">{card.hint}</div>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3 text-right">Paid today</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                  <th className="px-5 py-3 text-right">Monthly</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => {
                  const items = (o.items as unknown as OrderItem[]) ?? [];
                  return (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-gray-900">
                        {o.reference}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900">{o.name ?? "—"}</div>
                        <div className="text-xs text-gray-400">{o.email}</div>
                        {o.company && <div className="text-xs text-gray-400">{o.company}</div>}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {items.map((i) => i.name).join(", ") || "—"}
                        {o.discountCents > 0 && (
                          <div className="text-xs text-green-600">
                            −{formatMoney(o.discountCents)} bundle
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-gray-900">
                        {formatMoney(o.dueTodayCents)}
                        <div className="text-xs font-normal text-gray-400">
                          {o.paymentChoice === "deposit" ? "deposit" : "in full"}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right text-gray-600">
                        {o.balanceCents > 0 ? formatMoney(o.balanceCents) : "—"}
                      </td>
                      <td className="px-5 py-4 text-right text-gray-600">
                        {o.monthlyCents > 0 ? `${formatMoney(o.monthlyCents)}/mo` : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            statusStyles[o.status] ?? statusStyles.PENDING
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(o.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
