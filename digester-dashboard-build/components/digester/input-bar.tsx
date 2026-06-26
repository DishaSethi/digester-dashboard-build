"use client"

import { useState, type FormEvent } from "react"
import { Link2, Loader2, Sparkles } from "lucide-react"

export function InputBar() {
  const [url, setUrl] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock ingestion. Wire this to POST /api/digests later.
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!url.trim() || isProcessing) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setUrl("")
    }, 3200)
  }

  return (
    <div className="border-b border-zinc-800 bg-zinc-950/60 px-8 py-5">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 transition-colors focus-within:border-indigo-500/50 focus-within:bg-zinc-900">
          <Link2 className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isProcessing}
            placeholder="Paste a URL to digest…"
            aria-label="URL to digest"
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isProcessing || !url.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-500 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            Digest
          </button>
        </div>
      </form>

      {isProcessing && (
        <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2">
          <Loader2 className="size-3.5 shrink-0 animate-spin text-indigo-400" aria-hidden="true" />
          <span className="font-mono text-xs text-indigo-300">
            Running async scraper &amp; vector search<span className="animate-pulse">…</span>
          </span>
        </div>
      )}
    </div>
  )
}
