"use client";

import { useState } from "react";
import {
  DownloadIcon,
  type DownloadHandle,
} from "@/components/ui/download-icon";
import {
  LoaderCircleIcon,
} from "@/components/ui/loader-circle-icon";
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
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("卢向东-简历.pdf");
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
      className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-white/5 border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
      {downloading ? (
        "生成中…"
      ) : download.isShimmering ? (
        <TextShimmer as="span" duration={0.8}>
          下载简历
        </TextShimmer>
      ) : (
        <span>下载简历</span>
      )}
    </button>
  );
}
