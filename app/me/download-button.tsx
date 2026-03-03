"use client";

import { useState } from "react";
import {
  DownloadIcon,
  type DownloadHandle,
} from "@/components/ui/download-icon";
import { LoaderCircleIcon } from "@/components/ui/loader-circle-icon";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { useHoverSequence } from "@/hooks/use-hover-sequence";

interface DownloadButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export function DownloadButton({ targetRef }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const download = useHoverSequence({
    initialDelay: 2000,
  });

  const handleDownload = async () => {
    const el = targetRef.current;
    if (!el || downloading) return;

    setDownloading(true);
    const minDelay = new Promise((r) => setTimeout(r, 1000));
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      // 克隆到屏幕外，强制浅色模式，不影响当前页面
      const clone = el.cloneNode(true) as HTMLDivElement;
      clone.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: ${el.offsetWidth}px;
        height: ${el.offsetHeight}px;
        background: #ffffff;
        --background: hsl(0, 0%, 98%);
        --foreground: oklch(0.145 0 0);
        --muted: oklch(0.97 0 0);
        --muted-foreground: oklch(0.556 0 0);
        --border: oklch(0.942 0 0);
        --secondary-foreground: oklch(0.305 0 0);
        --accent-foreground: oklch(0.205 0 0);
        color-scheme: light;
      `;
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `卢向东-设计工程师简历-${new Date().toISOString().split("T")[0]}.pdf`
      );
      await minDelay;
    } catch (e) {
      console.error("PDF 生成失败", e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      onMouseEnter={download.handleEnter}
      onMouseLeave={download.handleLeave}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-secondary-foreground hover:text-foreground hover:bg-card border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {downloading ? (
        <LoaderCircleIcon size={14} isAnimated duration={0.8} />
      ) : (
        <DownloadIcon
          ref={download.iconRef as React.Ref<DownloadHandle>}
          size={14}
          isAnimated={false}
        />
      )}
      {download.isShimmering ? (
        <TextShimmer as="span">
          下载简历
        </TextShimmer>
      ) : (
        <span>下载简历</span>
      )}
    </button>
  );
}
