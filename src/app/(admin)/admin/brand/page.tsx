"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Search, Filter, Palette } from "lucide-react";

const STATUSES = ["", "SUBMITTED", "GENERATED", "IN_REVIEW", "DELIVERED"];

const statusStyles: Record<string, string> = {
  SUBMITTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
  GENERATED: "bg-blue-100 text-blue-800 border-blue-200",
  IN_REVIEW: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
};

type BrandRow = {
  id: string;
  businessName: string;
  industry: string;
  contactName: string;
  email: string;
  tier: string;
  status: string;
  createdAt: string;
  _count?: { assets: number };
};

export default function AdminBrandPage() {
  const [rows, setRows] = useState<BrandRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    params.set("page", String(page));

    setLoading(true);
    fetch(`/api/brand?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setRows(data.submissions || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [search, status, page]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Brand &amp; Identity</h1>
        <p className="text-gray-500 mt-1">{total} total brand orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="p-4 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search business, client, email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 h-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s ? s.replace("_", " ") : "All Statuses"}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Business", "Client", "Tier", "Status", "Assets", "Ordered", ""].map((h, i) => (
                  <th key={i} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Palette className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No brand orders yet</p>
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-sm">{r.businessName}</div>
                      <div className="text-xs text-gray-400">{r.industry}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{r.contactName}</div>
                      <div className="text-xs text-gray-400">{r.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold uppercase text-gray-600">{r.tier}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[r.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                        {r.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{r._count?.assets ?? 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(r.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/brand/${r.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > 20 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page * 20 >= total}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
