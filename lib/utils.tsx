// lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "text-yellow-500 bg-yellow-500/10",
    running: "text-blue-500 bg-blue-500/10",
    paused: "text-orange-500 bg-orange-500/10",
    completed: "text-green-500 bg-green-500/10",
    failed: "text-red-500 bg-red-500/10",
    cancelled: "text-gray-500 bg-gray-500/10",
  };
  return colors[status] || "text-gray-500 bg-gray-500/10";
}

export function getEntityTypeColor(entityType: string): string {
  const colors: Record<string, string> = {
    person: "#3b82f6", // blue
    organization: "#8b5cf6", // purple
    location: "#10b981", // green
    event: "#f59e0b", // amber
    document: "#6366f1", // indigo
    concept: "#ec4899", // pink
    other: "#6b7280", // gray
  };
  return colors[entityType] || "#6b7280";
}

export function calculateConfidenceLevel(confidence: number): string {
  if (confidence >= 0.9) return "Very High";
  if (confidence >= 0.7) return "High";
  if (confidence >= 0.5) return "Medium";
  if (confidence >= 0.3) return "Low";
  return "Very Low";
}

export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number,
): (...args: Args) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
