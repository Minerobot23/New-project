"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { FileText, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { darkButton } from "@/components/billing/styles";
import { deleteUploadAction } from "../actions";

type FileRow = { id: string; filename: string; sizeBytes: number; isImage: boolean };

const MAX_BYTES = 4 * 1024 * 1024;
const formatSize = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export function Uploader({ projectId, accept, limit, files }: { projectId: string; accept: string; limit: number; files: FileRow[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ tone: "error" | "ok"; text: string }[]>([]);
  const [removing, startRemoving] = useTransition();

  async function upload(list: FileList) {
    const results: { tone: "error" | "ok"; text: string }[] = [];
    for (const file of Array.from(list)) {
      if (file.size > MAX_BYTES) {
        results.push({ tone: "error", text: `${file.name}: files must be 4 MB or smaller.` });
        continue;
      }
      setUploading(file.name);
      const body = new FormData();
      body.set("file", file);
      try {
        const response = await fetch(`/api/projects/${projectId}/uploads`, { method: "POST", body });
        const json = (await response.json().catch(() => ({}))) as { error?: string };
        results.push(response.ok ? { tone: "ok", text: `${file.name} uploaded.` } : { tone: "error", text: `${file.name}: ${json.error ?? "upload failed."}` });
      } catch {
        results.push({ tone: "error", text: `${file.name}: upload failed. Check your connection and try again.` });
      }
    }
    setUploading(null);
    setMessages(results);
    if (input.current) input.current.value = "";
    router.refresh();
  }

  return (
    <div>
      <p className="text-[15px] text-white/70">
        Your logo, photos of your work, team, or location, and any documents that help. PNG, JPEG, WebP, GIF, or PDF, up to 4 MB each, {limit} files total.
      </p>
      <div className="mt-4">
        <input
          ref={input}
          id="upload-input"
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          onChange={(event) => event.target.files && event.target.files.length > 0 && upload(event.target.files)}
          disabled={Boolean(uploading) || files.length >= limit}
        />
        <label
          htmlFor="upload-input"
          className={`${darkButton.secondary} cursor-pointer ${uploading || files.length >= limit ? "pointer-events-none opacity-50" : ""}`}
        >
          {uploading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Upload aria-hidden="true" className="size-4" />}
          {uploading ? `Uploading ${uploading}…` : "Choose files"}
        </label>
      </div>
      <div aria-live="polite" className="mt-3 space-y-1">
        {messages.map((message) => (
          <p key={message.text} className={`text-sm ${message.tone === "error" ? "text-red-300" : "text-emerald-200"}`}>
            {message.text}
          </p>
        ))}
      </div>
      {files.length > 0 && (
        <ul className="mt-5 divide-y divide-night-line border-y border-night-line">
          {files.map((file) => (
            <li key={file.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <a href={`/api/uploads/${file.id}`} className="flex min-w-0 items-center gap-2.5 hover:text-accent-on-night">
                {file.isImage ? <ImageIcon aria-hidden="true" className="size-4 shrink-0 text-white/50" /> : <FileText aria-hidden="true" className="size-4 shrink-0 text-white/50" />}
                <span className="truncate">{file.filename}</span>
                <span className="shrink-0 text-white/45">{formatSize(file.sizeBytes)}</span>
              </a>
              <button
                type="button"
                disabled={removing}
                onClick={() => {
                  if (!window.confirm(`Remove ${file.filename}?`)) return;
                  const data = new FormData();
                  data.set("uploadId", file.id);
                  startRemoving(() => deleteUploadAction(data));
                }}
                className="inline-flex size-9 shrink-0 items-center justify-center text-white/55 hover:bg-red-500/20 hover:text-red-200"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                <span className="sr-only">Remove {file.filename}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
