"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  FolderKanban,
  Users,
  CheckCircle,
  Bell,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface Stats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  newSubmissions: number;
  recentProjects: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Projects",
      value: stats?.totalProjects ?? 0,
      icon: FolderKanban,
      color: "bg-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Active Projects",
      value: stats?.activeProjects ?? 0,
      icon: TrendingUp,
      color: "bg-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Completed",
      value: stats?.completedProjects ?? 0,
      icon: CheckCircle,
      color: "bg-green-500",
      bg: "bg-green-50",
    },
    {
      label: "New Submissions",
      value: stats?.newSubmissions ?? 0,
      icon: Bell,
      color: "bg-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's an overview of your projects.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${card.color.split("-")[1]}-600`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {loading ? "—" : card.value}
              </div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
          <Link href="/admin/projects" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Project</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Client</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">Loading...</td>
                </tr>
              ) : stats?.recentProjects?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No submissions yet</td>
                </tr>
              ) : (
                stats?.recentProjects?.map((project) => (
                  <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-sm">{project.submission?.businessName || project.title}</div>
                      <div className="text-xs text-gray-400">{project.submission?.industry}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{project.client?.name || "—"}</div>
                      <div className="text-xs text-gray-400">{project.client?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/projects/${project.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
