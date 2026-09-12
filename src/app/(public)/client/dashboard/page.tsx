"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { FolderKanban, MessageSquare, ArrowRight, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ClientDashboardPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(data.projects || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#080810]">
      {/* Header */}
      <header className="bg-[#080810]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-white">
            launch<span className="text-violet-400">board</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50">{session?.user?.name || session?.user?.email}</span>
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {session?.user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-white/50 mt-1">Here's the status of your projects.</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-white/30 text-sm">Loading your projects...</div>
        ) : projects.length === 0 ? (
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 text-center py-16">
            <FolderKanban className="w-12 h-12 text-white/25 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-white/30 text-sm mb-6">Submit your website request to get started.</p>
            <Link href="/get-started">
              <Button>Start a New Project <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{project.title}</h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="text-sm text-white/50 mb-4">
                      Submitted {formatDate(project.createdAt)}
                      {project._count?.messages > 0 && (
                        <span className="ml-4 flex items-center gap-1 inline-flex">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {project._count.messages} message{project._count.messages !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    {/* Progress indicator */}
                    <div className="flex gap-2">
                      {["SUBMITTED", "DISCOVERY", "DESIGN", "DEVELOPMENT", "REVIEW", "COMPLETED"].map((s) => {
                        const statuses = ["SUBMITTED", "DISCOVERY", "DESIGN", "DEVELOPMENT", "REVIEW", "COMPLETED"];
                        const current = statuses.indexOf(project.status);
                        const thisIdx = statuses.indexOf(s);
                        return (
                          <div
                            key={s}
                            className={`flex-1 h-1.5 rounded-full ${thisIdx <= current ? "bg-violet-500/100" : "bg-white/10"}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <Link href={`/client/project/${project.id}`} className="ml-6 flex-shrink-0">
                    <Button variant="outline" size="sm">View Details →</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link href="/get-started">
            <Button variant="outline">+ Submit Another Project</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
