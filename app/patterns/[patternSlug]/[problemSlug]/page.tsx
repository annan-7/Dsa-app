"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeftRight, Bot, GitCompareArrows, Layers3 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ArrayVisualizer } from "@/components/visualizer/ArrayVisualizer";
import { CodePanel } from "@/components/visualizer/CodePanel";
import { ComplexityCard } from "@/components/visualizer/ComplexityCard";
import { Controls } from "@/components/visualizer/Controls";
import { HashMapVisualizer } from "@/components/visualizer/HashMapVisualizer";
import { MessageDisplay } from "@/components/visualizer/MessageDisplay";
import { StackVisualizer } from "@/components/visualizer/StackVisualizer";
import { useAlgo } from "@/hooks/useAlgo";
import { problemRegistry } from "@/data/problems";

interface PatternProblemPageProps {
  params: {
    patternSlug: string;
    problemSlug: string;
  };
}

export default function PatternProblemPage({ params }: PatternProblemPageProps) {
  const problem = useMemo(() => {
    const candidate = problemRegistry[params.problemSlug as keyof typeof problemRegistry] ?? null;

    return candidate?.patternSlug === params.patternSlug ? candidate : null;
  }, [params.patternSlug, params.problemSlug]);

  const algo = useAlgo(problem?.steps ?? { brute: [], optimized: [] }, {
    defaultMode: problem?.defaultMode ?? "optimized",
    defaultSpeed: 1,
  });

  if (!problem) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center p-6">
        <div className="max-w-xl rounded-[2rem] border border-zinc-800 bg-zinc-900/80 p-8 text-center shadow-2xl shadow-black/30">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-300/90">Problem not found</p>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-50">This route is not wired yet.</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            The visualizer currently ships with a fully animated 3Sum demo under the two-pointers pattern.
          </p>
          <Button asChild variant="primary" className="mt-6">
            <Link href="/patterns/two-pointers/three-sum">Open 3Sum</Link>
          </Button>
        </div>
      </div>
    );
  }

  const activeStep = algo.currentStep;
  const isOptimized = algo.mode === "optimized";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 px-6 py-8 lg:px-10 lg:py-10">
      <Header
        eyebrow={`${problem.patternSlug.replaceAll("-", " ")} / ${problem.problemSlug}`}
        title={problem.title}
        description={problem.summary}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant={isOptimized ? "primary" : "secondary"} onClick={() => algo.setMode("optimized")}>
              <ArrowLeftRight className="h-4 w-4" />
              Optimized
            </Button>
            <Button variant={!isOptimized ? "primary" : "secondary"} onClick={() => algo.setMode("brute")}>
              <GitCompareArrows className="h-4 w-4" />
              Brute force
            </Button>
          </div>
        }
        stats={[
          { label: "Input size", value: `${problem.input.length} values` },
          ...(problem.target !== undefined ? [{ label: "Target", value: String(problem.target) }] : []),
          { label: "Mode", value: isOptimized ? "Optimized" : "Brute force" },
          { label: "Steps", value: `${algo.totalSteps}` },
        ]}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-zinc-800/80 bg-zinc-900/70 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Layers3 className="h-4 w-4 text-orange-500" />
                  Visual execution
                </div>
                <p className="mt-2 text-sm text-zinc-500">Step through the current state and watch pointers glide instead of jumping.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={isOptimized ? "emerald" : "blue"}>{isOptimized ? "Optimized" : "Brute force"}</Badge>
                <Badge tone="default">{activeStep.label}</Badge>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              {problem.visualization === "stack" ? (
                <StackVisualizer step={activeStep} />
              ) : (
                <ArrayVisualizer step={activeStep} />
              )}

              {problem.visualization === "array-hashmap" ? <HashMapVisualizer step={activeStep} /> : null}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
              <MessageDisplay message={activeStep.message} />
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Progress</div>
                <div className="mt-3 text-2xl font-semibold text-zinc-100">
                  {algo.stepIndex + 1}/{algo.totalSteps}
                </div>
                <div className="mt-4">
                  <ProgressBar value={algo.progress} />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Controls
                isPlaying={algo.isPlaying}
                speed={algo.speed}
                onPlayPause={algo.playPause}
                onNext={algo.next}
                onPrev={algo.prev}
                onReset={algo.reset}
                onSpeedChange={algo.setSpeed}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <CodePanel
            title={isOptimized ? "Optimized two-pointer scan" : "Brute force triplet scan"}
            lines={problem.pseudocode[algo.mode]}
            activeLine={activeStep.codeLine}
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <ComplexityCard
              title="Brute force"
              time={problem.complexity.brute.time}
              space={problem.complexity.brute.space}
              detail={problem.complexity.brute.detail}
              tone="blue"
            />
            <ComplexityCard
              title="Optimized"
              time={problem.complexity.optimized.time}
              space={problem.complexity.optimized.space}
              detail={problem.complexity.optimized.detail}
              tone="orange"
            />
          </div>

          <div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/90 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
              <Bot className="h-4 w-4 text-orange-500" />
              Why this matters
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              The brute force pass is intentionally expensive, because it makes the optimization payoff obvious. The two-pointer version sorts once and then uses pointer motion to eliminate whole regions of the search space.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
              <span className="rounded-full border border-zinc-800 px-3 py-1">Sorted anchors</span>
              <span className="rounded-full border border-zinc-800 px-3 py-1">Duplicate pruning</span>
              <span className="rounded-full border border-zinc-800 px-3 py-1">Spring motion</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-start pb-2">
        <Button asChild variant="ghost">
          <Link href="/">Back to overview</Link>
        </Button>
      </div>
    </div>
  );
}