import { notFound } from "next/navigation";
import { problemRegistry } from "@/data/problems";
import { ProblemVisualizer } from "@/components/visualizer/ProblemVisualizer";
import { requireAuth } from "@/libs/require-auth";

export default async function PatternProblemPage({ params }: {
  params: Promise<{ patternSlug: string; problemSlug: string }>;
}) {
  const { patternSlug, problemSlug } = await params;
  await requireAuth(`/patterns/${patternSlug}/${problemSlug}`);
  const problem = problemRegistry[problemSlug as keyof typeof problemRegistry];
  if (!problem || problem.patternSlug !== patternSlug) notFound();
  return <ProblemVisualizer key={`${patternSlug}/${problemSlug}`} problem={problem} />;
}
