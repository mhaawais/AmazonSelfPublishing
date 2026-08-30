import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyPage } from "@/components/LegacyPage";
import { loadLegacyPage, routeFiles } from "@/lib/legacy-pages";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(routeFiles).map((slug) => ({ slug }));
}

function getFileName(slug: string) {
  return routeFiles[slug as keyof typeof routeFiles];
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const fileName = getFileName(slug);
  if (!fileName) return {};
  const page = loadLegacyPage(fileName);
  return { title: page.title, description: page.description };
}

export default async function RoutePage({ params }: RouteProps) {
  const { slug } = await params;
  const fileName = getFileName(slug);
  if (!fileName) notFound();
  return <LegacyPage page={loadLegacyPage(fileName)} />;
}
