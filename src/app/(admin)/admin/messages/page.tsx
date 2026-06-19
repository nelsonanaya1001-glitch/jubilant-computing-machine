"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export default function AdminMessagesPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects?limit=50")
      .then((r) => r.json())
      .then((data) => {
        const withMessages = (data.projects || []).filter((p: any) => p._count?.messages > 0);
        setProjects(withMessages);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">Client conversations across all projects</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No messages yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {project.submission?.businessName || project.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {project.client?.email} • {project._count?.messages} message{project._count?.messages !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{formatDate(project.updatedAt)}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
