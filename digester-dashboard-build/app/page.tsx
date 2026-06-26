import { Sidebar } from "@/components/digester/sidebar"
import { InputBar } from "@/components/digester/input-bar"
import { BriefingCard } from "@/components/digester/briefing-card"
import { recentDigests, activeBriefing } from "@/lib/digester-data"

export default function Page() {
  return (
    <main className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar items={recentDigests} activeId={activeBriefing.id} />
      <div className="flex min-w-0 flex-1 flex-col">
        <InputBar />
        <div className="flex-1 overflow-y-auto">
          <BriefingCard briefing={activeBriefing} />
        </div>
      </div>
    </main>
  )
}
