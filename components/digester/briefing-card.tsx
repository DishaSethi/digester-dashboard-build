import { ArrowUpRight, GitBranch, Link as LinkIcon } from "lucide-react"
import type { Briefing, BriefingBullet } from "@/lib/digester-data"

function BulletBlock({ bullet, index }: { bullet: BriefingBullet; index: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      {/* Insight */}
      <div className="flex gap-3">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-zinc-800 font-mono text-xs font-medium text-zinc-400">
          {index + 1}
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400">
            Insight
          </span>
          <p className="text-[15px] font-medium leading-relaxed text-zinc-100 text-pretty">
            {bullet.insight}
          </p>
        </div>
      </div>

      {/* Context match */}
      <div className="mt-4 ml-9 rounded-lg border border-indigo-500/15 bg-indigo-500/[0.06] p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-indigo-300/80">
            <GitBranch className="size-3" aria-hidden="true" />
            Context Match
          </span>
          <span className="font-mono text-[10px] text-zinc-500">
            sim {bullet.context.similarity.toFixed(2)}
          </span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-400 text-pretty">
          {bullet.context.note}
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 text-[12px] text-zinc-300">
          <LinkIcon className="size-3 shrink-0 text-indigo-400" aria-hidden="true" />
          <span className="truncate font-medium">{bullet.context.source}</span>
        </div>
      </div>
    </div>
  )
}

export function BriefingCard({ briefing }: { briefing: Briefing }) {
  return (
    <article className="mx-auto max-w-3xl px-8 py-8">
      {/* Header */}
      <header className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
          <span>{briefing.domain}</span>
          <span className="text-zinc-700">·</span>
          <span>{briefing.readingTime}</span>
        </div>
        <h1 className="mt-3 flex items-start gap-2 text-2xl font-semibold leading-tight tracking-tight text-zinc-50 text-balance">
          <span>{briefing.title}</span>
          <a
            href={briefing.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open original article"
            className="mt-1.5 shrink-0 text-zinc-500 transition-colors hover:text-indigo-400"
          >
            <ArrowUpRight className="size-5" />
          </a>
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Three-point briefing generated from the full article and cross-referenced against your saved knowledge.
        </p>
      </header>

      {/* Bullets */}
      <div className="mt-6 flex flex-col gap-4">
        {briefing.bullets.map((bullet, i) => (
          <BulletBlock key={i} bullet={bullet} index={i} />
        ))}
      </div>
    </article>
  )
}
