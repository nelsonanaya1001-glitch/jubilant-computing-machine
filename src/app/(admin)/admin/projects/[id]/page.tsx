"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatFileSize, getStatusLabel } from "@/lib/utils";
import {
  ArrowLeft,
  Download,
  Send,
  FileText,
  Clock,
  MessageSquare,
  StickyNote,
  User,
} from "lucide-react";

const statusFlow = ["SUBMITTED", "DISCOVERY", "DESIGN", "DEVELOPMENT", "REVIEW", "COMPLETED"];

export default function AdminProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "files" | "messages" | "notes">("overview");
  const [newMessage, setNewMessage] = useState("");
  const [newNote, setNewNote] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [changingStatus, setChangingStatus] = useState(false);

  async function loadProject() {
    const res = await fetch(`/api/projects/${id}`);
    const data = await res.json();
    setProject(data);
    setLoading(false);
  }

  useEffect(() => { loadProject(); }, [id]);

  async function changeStatus(newStatus: string) {
    setChangingStatus(true);
    await fetch(`/api/projects/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, note: statusNote }),
    });
    setStatusNote("");
    await loadProject();
    setChangingStatus(false);
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;
    setSendingMessage(true);
    await fetch(`/api/projects/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage }),
    });
    setNewMessage("");
    await loadProject();
    setSendingMessage(false);
  }

  async function saveNote() {
    if (!newNote.trim()) return;
    setSavingNote(true);
    await fetch("/api/admin/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: id, content: newNote }),
    });
    setNewNote("");
    await loadProject();
    setSavingNote(false);
  }

  if (loading) {
    return <div className="p-8 text-gray-500 text-sm">Loading project...</div>;
  }

  if (!project) {
    return <div className="p-8 text-red-500 text-sm">Project not found.</div>;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "files", label: `Files (${project.files?.length || 0})`, icon: Download },
    { id: "messages", label: `Messages (${project.messages?.length || 0})`, icon: MessageSquare },
    { id: "notes", label: `Notes (${project.adminNotes?.length || 0})`, icon: StickyNote },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <Link href="/admin/projects" className="mt-1">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {project.submission?.businessName || project.title}
              </h1>
              <StatusBadge status={project.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{project.client?.name || project.client?.email}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Submitted {formatDate(project.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Project Status</h3>
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
          {statusFlow.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => changeStatus(s)}
                disabled={changingStatus || project.status === s}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  project.status === s
                    ? "bg-blue-600 text-white"
                    : statusFlow.indexOf(project.status) > i
                    ? "bg-gray-200 text-gray-500 cursor-default"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {getStatusLabel(s)}
              </button>
              {i < statusFlow.length - 1 && <div className="w-4 h-0.5 bg-gray-200 flex-shrink-0" />}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Optional note about this status change..."
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            className="flex-1 h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Section title="Business Information">
              <Row label="Business Name" value={project.submission?.businessName} />
              <Row label="Industry" value={project.submission?.industry} />
              <Row label="Contact" value={project.submission?.contactName} />
              <Row label="Email" value={project.submission?.email} />
              <Row label="Phone" value={project.submission?.phone} />
              {project.submission?.website && <Row label="Website" value={project.submission?.website} />}
            </Section>
            <Section title="Business Details">
              <Row label="Services" value={project.submission?.servicesOffered} />
              <Row label="Service Area" value={project.submission?.serviceArea} />
              <Row label="Target Audience" value={project.submission?.targetAudience} />
              <Row label="Description" value={project.submission?.businessDescription} />
            </Section>
          </div>
          <div className="space-y-4">
            <Section title="Design Preferences">
              <Row label="Colors" value={project.submission?.preferredColors} />
              <Row label="Style" value={project.submission?.preferredStyle} />
              {project.submission?.competitorWebsites && (
                <Row label="Competitors" value={project.submission?.competitorWebsites} />
              )}
              {project.submission?.websitesTheyLike && (
                <Row label="Liked Sites" value={project.submission?.websitesTheyLike} />
              )}
            </Section>
            <Section title="Features Requested">
              <div className="flex flex-wrap gap-2">
                {(project.submission?.featuresNeeded || []).map((f: string) => (
                  <span key={f} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </Section>
            <Section title="Status History">
              {project.statusUpdates?.length === 0 ? (
                <p className="text-sm text-gray-400">No status changes yet</p>
              ) : (
                project.statusUpdates?.map((u: any) => (
                  <div key={u.id} className="flex items-start gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700">{getStatusLabel(u.oldStatus)} → {getStatusLabel(u.newStatus)}</span>
                      {u.note && <div className="text-gray-400 text-xs">{u.note}</div>}
                      <div className="text-gray-400 text-xs">{formatDate(u.createdAt)}</div>
                    </div>
                  </div>
                ))
              )}
            </Section>
          </div>
        </div>
      )}

      {/* Files */}
      {activeTab === "files" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {project.files?.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No files uploaded</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {project.files?.map((file: any) => (
                <div key={file.id} className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{file.originalName}</div>
                      <div className="text-xs text-gray-400">
                        {file.category} • {formatFileSize(file.fileSize)} • {formatDate(file.uploadedAt)}
                      </div>
                    </div>
                  </div>
                  <a href={file.filePath} download={file.originalName} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {activeTab === "messages" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col" style={{ minHeight: 400 }}>
          <div className="flex-1 p-6 space-y-4 max-h-96 overflow-y-auto">
            {project.messages?.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No messages yet</p>
            ) : (
              project.messages?.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isAdminMessage ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-md rounded-2xl px-4 py-3 text-sm ${
                    msg.isAdminMessage ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}>
                    <div className={`text-xs mb-1 ${msg.isAdminMessage ? "text-blue-200" : "text-gray-400"}`}>
                      {msg.sender?.name || msg.sender?.email} • {formatDate(msg.createdAt)}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-gray-100 p-4 flex gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message to the client..."
              rows={2}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
            <Button onClick={sendMessage} disabled={sendingMessage || !newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Notes */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-sm text-yellow-700">
            Internal notes are only visible to administrators and will never be shown to clients.
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
              {project.adminNotes?.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">No notes yet</p>
              ) : (
                project.adminNotes?.map((note: any) => (
                  <div key={note.id} className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-2">
                      {note.author?.name} • {formatDate(note.createdAt)}
                    </div>
                    <p className="text-sm text-gray-700">{note.content}</p>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-gray-100 p-4 flex gap-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add an internal note..."
                rows={2}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
              <Button onClick={saveNote} disabled={savingNote || !newNote.trim()}>
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-3 border-b border-gray-100">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[120px,1fr] gap-3 text-sm">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className="text-gray-700 break-words">{value}</span>
    </div>
  );
}
