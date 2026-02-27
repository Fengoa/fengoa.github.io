"use client";

import { useRef } from "react";
import { DownloadButton } from "./download-button";
import { ResumeContent } from "./resume-content";

export default function MePage() {
  const resumeRef = useRef<HTMLDivElement>(null);

  return (
    <main className="py-20 flex flex-col gap-12 justify-center">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-2xl font-semibold">Oriensx.</h2>
          <p className="text-muted-foreground">
            我在做出伟大产品的路上持续耕耘。
          </p>
        </div>
        <DownloadButton targetRef={resumeRef} />
      </div>
      <div className="w-full flex justify-center">
        <div
          ref={resumeRef}
          id="resume"
          className="max-w-3xl aspect-210/297 p-8 hover:bg-white dark:hover:bg-white/5 transition-all duration-300"
        >
          <ResumeContent />
        </div>
      </div>
    </main>
  );
}
