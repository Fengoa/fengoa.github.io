import type { Metadata } from "next";
import { ArenaApp } from "@/components/2048/arena";
import "./2048.css";

export const metadata: Metadata = {
  title: "2048 Arena",
  description:
    "Write a bot, play 2048, and rank your product site. Board styling adapted from 2048bid.lol.",
};

export default function ArenaPage() {
  return (
    <>
      {/*
        THESIS: Left board + daily site leaderboard, right a live bot script desk.
        OWN-WORLD: 2048bid cream / clay board, Bricolage + Space Mono, 4px borders, selective hard shadows.
        STORY: Claim a product URL, paste a JS bot, climb today's ranking.
        FIRST VIEWPORT: Sticky header, split desk — board and leaderboard left, editor right.
        FORM: Faithful recreation of 2048bid.lol materials as an Operate surface for bot authors.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
      */}
      <ArenaApp />
    </>
  );
}
