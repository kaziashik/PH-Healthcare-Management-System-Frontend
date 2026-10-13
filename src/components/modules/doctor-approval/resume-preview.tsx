"use client";

import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const MAX_PAGES = 8;

function isDirectImage(url: string) {
  return /\.(png|jpe?g|webp|gif|bmp|avif)(\?|$)/i.test(url);
}

function cloudinaryPageUrl(url: string, page: number) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return null;
  }
  const [base, rest] = url.split("/upload/");
  const withoutExtension = rest.replace(/\.pdf$/i, "");
  return `${base}/upload/f_jpg,pg_${page},q_auto,w_1400/${withoutExtension}.jpg`;
}

function useResumePages(url: string, asPdf: boolean) {
  const [pages, setPages] = useState<string[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    const found: string[] = [];

    const loadPage = (page: number) => {
      const src = cloudinaryPageUrl(url, page);
      if (!src) {
        if (!cancelled) setStatus("missing");
        return;
      }
      const image = new Image();
      image.onload = () => {
        if (cancelled) return;
        found.push(src);
        setPages([...found]);
        setStatus("ready");
        if (page < MAX_PAGES) loadPage(page + 1);
      };
      image.onerror = () => {
        if (cancelled) return;
        setStatus(found.length > 0 ? "ready" : "missing");
      };
      image.src = src;
    };

    setPages([]);
    setStatus("loading");
    if (asPdf) {
      setStatus("missing");
      return;
    }
    if (isDirectImage(url)) {
      setPages([url]);
      setStatus("ready");
      return;
    }
    if (!/\.pdf(\?|$)/i.test(url)) {
      setStatus("missing");
      return;
    }
    loadPage(1);

    return () => {
      cancelled = true;
    };
  }, [url, asPdf]);

  return { pages, status };
}

function PdfPages({ url }: { url: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    let destroyTask: (() => void) | null = null;

    const paint = async () => {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
      const task = pdfjs.getDocument({ data: bytes });
      destroyTask = () => {
        task.destroy().catch(() => undefined);
      };
      const pdf = await task.promise;
      const host = hostRef.current;
      if (cancelled || !host) return;
      host.replaceChildren();
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.className =
          "mx-auto mb-4 block w-full max-w-3xl bg-white shadow-md";
        canvas.setAttribute("aria-label", `Invoice page ${pageNumber}`);
        await page.render({ canvas, viewport }).promise;
        if (cancelled) return;
        host.appendChild(canvas);
      }
      if (!cancelled) setStatus("ready");
    };

    setStatus("loading");
    paint().catch(() => {
      if (!cancelled) setStatus("error");
    });

    return () => {
      cancelled = true;
      destroyTask?.();
    };
  }, [url]);

  return (
    <div>
      {status === "loading" ? (
        <p className="text-center text-sm text-neutral-600">
          Opening document...
        </p>
      ) : null}
      {status === "error" ? (
        <iframe
          title="Appointment Invoice"
          src={url}
          className="h-full min-h-[70vh] w-full bg-white"
        />
      ) : null}
      <div ref={hostRef} />
    </div>
  );
}

export default function ResumePreview({
  open,
  url,
  title,
  fileName,
  asPdf = false,
  children,
  onClose,
}: {
  open: boolean;
  url: string | null;
  title: string;
  fileName: string;
  asPdf?: boolean;
  children?: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  if (!open || !url || typeof document === "undefined") return null;

  return createPortal(
    <ResumeWindow
      url={url}
      title={title}
      fileName={fileName}
      asPdf={asPdf}
      onClose={onClose}
    >
      {children}
    </ResumeWindow>,
    document.body,
  );
}

function ResumeWindow({
  url,
  title,
  fileName,
  asPdf,
  children,
  onClose,
}: {
  url: string;
  title: string;
  fileName: string;
  asPdf: boolean;
  children?: ReactNode;
  onClose: () => void;
}) {
  const { pages, status } = useResumePages(url, asPdf);
  const openTarget = pages[0] ?? url;

  const download = async () => {
    const target = pages[0] ?? url;
    const downloadName = pages[0] ? fileName.replace(/\.pdf$/i, ".jpg") : fileName;
    try {
      const response = await fetch(target);
      if (!response.ok) throw new Error("download failed");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = downloadName;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(target, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="Close resume"
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex h-[min(92vh,960px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border bg-background shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{title}</p>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
              <FileText className="size-3.5 shrink-0" aria-hidden="true" />
              {fileName}
            </p>
          </div>
          {asPdf ? null : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(openTarget, "_blank", "noopener,noreferrer")
              }
            >
              <ExternalLink aria-hidden="true" />
              Open
            </Button>
          )}
          <Button type="button" variant="destructive" size="sm" onClick={download}>
            <Download aria-hidden="true" />
            Download
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-neutral-200 p-4 sm:p-6">
          {children ??
            (asPdf ? (
              <PdfPages url={url} />
            ) : (
              <>
                {status === "loading" ? (
                  <p className="text-center text-sm text-neutral-600">
                    Opening document...
                  </p>
                ) : null}
                {status === "missing" ? (
                  <iframe
                    title={title}
                    src={url}
                    className="h-full min-h-[70vh] w-full bg-white"
                  />
                ) : null}
              </>
            ))}
          {children
            ? null
            : pages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`${title} page ${index + 1}`}
              className="mx-auto mb-4 w-full max-w-3xl bg-white shadow-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
