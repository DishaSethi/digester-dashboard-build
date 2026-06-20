import { Boxes } from "lucide-react"
import type { DigestStatus, DigestSummaryItem } from "@/lib/digester-data"

function StatusBadge({ status }: { status: DigestStatus }) {
  const styles: Record<DigestStatus, string> = {
    Processed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    Processing: "border-indigo-400/20 bg-indigo-400/10 text-indigo-300",
    Pending: "border-zinc-600/40 bg-zinc-700/30 text-zinc-400",
  }

  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  )
}

interface SidebarProps {
  items: DigestSummaryItem[]
  activeId: string
}

export function Sidebar({ items, activeId }: SidebarProps) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Brand header */}
      <div className="flex items-center gap-2.5 border-b border-zinc-800 px-5 py-4">
        <div className="flex size-8 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-400">
          <Boxes className="size-4" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight text-zinc-100">Digester</span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            knowledge engine
          </span>
        </div>
      </div>

      {/* Recent digests */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Recent digests">
        <h2 className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          Recent Digests
        </h2>
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = item.id === activeId
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  className={`group flex w-full flex-col gap-1.5 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? "bg-zinc-800/70 ring-1 ring-inset ring-zinc-700"
                      : "hover:bg-zinc-900"
                  }`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span
                      className={`line-clamp-2 text-[13px] font-medium leading-snug ${
                        isActive ? "text-zinc-100" : "text-zinc-300 group-hover:text-zinc-100"
                      }`}
                    >
                      {item.title}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-[11px] text-zinc-500">{item.domain}</span>
                    <StatusBadge status={item.status} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer / db status */}
      <div className="border-t border-zinc-800 px-5 py-3">
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono">pgvector · 1,284 vectors</span>
        </div>
      </div>
    </aside>
  )
}
