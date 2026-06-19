import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SUBMITTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
    DISCOVERY: "bg-blue-100 text-blue-800 border-blue-200",
    DESIGN: "bg-purple-100 text-purple-800 border-purple-200",
    DEVELOPMENT: "bg-orange-100 text-orange-800 border-orange-200",
    REVIEW: "bg-cyan-100 text-cyan-800 border-cyan-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    SUBMITTED: "Submitted",
    DISCOVERY: "Discovery",
    DESIGN: "Design",
    DEVELOPMENT: "Development",
    REVIEW: "Review",
    COMPLETED: "Completed",
  };
  return labels[status] || status;
}
