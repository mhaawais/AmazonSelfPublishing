import type { Metadata } from "next";
import { LegacyPage } from "@/components/LegacyPage";
import { loadLegacyPage } from "@/lib/legacy-pages";

const page = loadLegacyPage("index.html");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function HomePage() {
  return <LegacyPage page={page} />;
}
