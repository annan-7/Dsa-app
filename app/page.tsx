import Link from "next/link";
import { ArrowRight, Layers3, PlayCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col px-6 py-8 lg:px-10 lg:py-10">
      <Header
        eyebrow="DSA Visual"
        title="Show the Aha moment, not just the answer."
        description="Step through classic algorithm patterns with smooth pointer motion, highlighted pseudocode, and a premium developer-tool interface built for learning."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="primary">
              <Link href="/patterns/two-pointers/three-sum">
                Open the visualizer <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <a href="#features">
                Explore the flow <PlayCircle className="h-4 w-4" />
              </a>
            </Button>
          </div>
        }
        stats={[
          { label: "Patterns", value: "14+" },
          { label: "Motion", value: "Framer" },
          { label: "Focus", value: "Two Pointers" },
        ]}
      />

      <section id="features" className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-[2rem] border border-zinc-800/80 bg-zinc-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="orange">Live simulation</Badge>
            <Badge tone="blue">Brute force vs optimized</Badge>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Physical pointers", "Pointers slide instead of teleporting, so every state change feels continuous."],
              ["Explained code", "Each execution step pairs with the active pseudocode line and a readable note."],
              ["Outcome glow", "Successful hits pulse with a green finish so the found state is unmistakable."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <Sparkles className="h-4 w-4 text-orange-500" />
                  {title}
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-zinc-800/80 bg-zinc-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-sm font-medium text-zinc-400">
              <Layers3 className="h-4 w-4 text-orange-500" />
              Architecture
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-100">
              Modular by design, with logic isolated from rendering.
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              The app routes, hooks, data, and visual components are split so each algorithm can be added as a pure step generator and plugged into the same visual shell.
            </p>
          </div>

          <div className="rounded-[2rem] border border-orange-500/30 bg-orange-500/10 p-6 shadow-[0_0_40px_rgba(249,115,22,0.12)]">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-orange-300/90">Start here</p>
            <p className="mt-3 text-lg text-zinc-100">
              Open <span className="font-semibold text-orange-300">3Sum</span> to compare the brute force scan with the two-pointer optimization.
            </p>
            <Button asChild variant="primary" className="mt-5">
              <Link href="/patterns/two-pointers/three-sum">
                Launch the demo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
