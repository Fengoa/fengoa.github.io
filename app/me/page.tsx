"use client";

import { useRef } from "react";
import { Grid } from "@/components/ui/grid";
import { MeHero } from "./me-hero";
import { ResumeContent } from "./resume-content";

export default function MePage() {
  const resumeRef = useRef<HTMLDivElement>(null);

  return (
    <main className="py-20">
      <Grid.System>
        <MeHero resumeRef={resumeRef} />
        <ResumeContent resumeRef={resumeRef} />
      </Grid.System>
    </main>
  );
}
