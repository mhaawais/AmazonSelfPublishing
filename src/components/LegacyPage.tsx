import type { LegacyPage as LegacyPageData } from "@/lib/legacy-pages";
import { LegacyRuntime } from "./LegacyRuntime";

export function LegacyPage({ page }: { page: LegacyPageData }) {
  return (
    <>
      <div className="legacy-page" dangerouslySetInnerHTML={{ __html: page.html }} />
      <LegacyRuntime />
    </>
  );
}
