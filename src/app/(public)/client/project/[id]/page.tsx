"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getStatusLabel } from "@/lib/utils";
import { ArrowLeft, Send, Download, FileText } from "lucide-react";

const statusFlow = ["SUBMITTED", "DISCOVERY", "DESIGN", "DEVELOPMENT", "REVIEW", "COMPLETED"];

export default function ClientProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function loadProject() {
    const res = await fetch(`/api/projects/${id}`);
    const data = await res.json();
    setProject(data);
    setLoading(false);
  }

  useEffect(() => { loadProject(); }, [id]);

  async function sendMessage() {
    if (!newMessage.trim()) return;
    setSending(true);
    await fetch(`/api/projects/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage }),
    });
    setNewMessage("");
    await loadProject();
    setSending(false);
  }

  if (loading) return <div className="min-h-screen bg-[#080810] flex items-center justify-center text-white/30 text-sm">Loading...</div>;
  if (!project) return <div className="min-h-screen bg-[#080810] flex items-center justify-center text-white/30 text-sm">Project not found.</div>;

  const currentIdx = statusFlow.indexOf(project.status);

  return (
    <div className="min-h-screen bg-[#080810]">
      <header className="bg-[#080810]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/client/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <StatusBadge status={project.status} />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{project.title}</h1>
          <p className="text-white/50 text-sm">Submitted {formatDate(project.createdAt)}</p>
        </div>

        {/* Progress */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
          <h3 className="font-semibold text-white mb-6">Project Progress</h3>
          <div className="flex items-center gap-0">
            {statusFlow.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                    i < currentIdx ? "bg-violet-600 text-white" :
                    i === currentIdx ? "bg-violet-600 text-white ring-4 ring-violet-500/30" :
                    "bg-white/10 text-white/30"
                  }`}>
                    {i < currentIdx ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs text-center ${i <= currentIdx ? "text-white/70 font-medium" : "text-white/30"}`}>
                    {getStatusLabel(s)}
                  </span>
                </div>
                {i < statusFlow.length - 1 && (
                  <div className={`h-0.5 flex-1 -mt-5 ${i < currentIdx ? "bg-violet-600" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10">
          <div className="p-6 border-b border-white/10">
            <h3 className="font-semibold text-white">Messages</h3>
            <p className="text-sm text-white/50 mt-1">Communicate directly with the Launchboarding team</p>
          </div>
          <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
            {project.messages?.length === 0 ? (
              <p className="text-center text-white/30 text-sm py-6">No messages yet. Send a message to get in touch.</p>
            ) : (
              project.messages?.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isAdminMessage ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-md rounded-2xl px-4 py-3 text-sm ${
                    msg.isAdminMessage ? "bg-violet-500/10 text-white" : "bg-violet-600 text-white"
                  }`}>
                    <div className={`text-xs mb-1 ${msg.isAdminMessage ? "text-white/30" : "text-violet-200"}`}>
                      {msg.isAdminMessage ? "Launchboarding" : "You"} • {formatDate(msg.createdAt)}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-white/10 p-4 flex gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a message..."
              rows={2}
              className="flex-1 px-3 py-2 text-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
            />
            <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Files */}
        {project.files?.length > 0 && (
          <div className="bg-white/[0.03] rounded-2xl border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-semibold text-white">Uploaded Files</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {project.files.map((file: any) => (
                <div key={file.id} className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-white/30" />
                    <div>
                      <div className="text-sm font-medium text-white">{file.originalName}</div>
                      <div className="text-xs text-white/30">{file.category}</div>
                    </div>
                  </div>
                  <a href={file.filePath} download={file.originalName} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
