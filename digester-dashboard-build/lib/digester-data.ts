// Shared types + mock data for the Digester dashboard.
// These shapes mirror what you'd return from your Next.js API routes
// (e.g. /api/digests) backed by a pgvector store.

export type DigestStatus = "Processed" | "Pending" | "Processing"

export interface DigestSummaryItem {
  id: string
  title: string
  domain: string
  url: string
  status: DigestStatus
}

export interface ContextMatch {
  // The related saved knowledge this insight connects to.
  source: string
  // Human-readable explanation of the relationship.
  note: string
  // Cosine similarity score from pgvector, 0..1.
  similarity: number
}

export interface BriefingBullet {
  insight: string
  context: ContextMatch
}

export interface Briefing {
  id: string
  title: string
  url: string
  domain: string
  readingTime: string
  bullets: [BriefingBullet, BriefingBullet, BriefingBullet]
}

export const recentDigests: DigestSummaryItem[] = [
  {
    id: "1",
    title: "Designing Resilient Vector Search Pipelines at Scale",
    domain: "engineering.acme.dev",
    url: "https://engineering.acme.dev/vector-search",
    status: "Processed",
  },
  {
    id: "2",
    title: "Why Embedding Drift Quietly Breaks RAG Systems",
    domain: "latent.space",
    url: "https://latent.space/embedding-drift",
    status: "Processed",
  },
  {
    id: "3",
    title: "Async Scraping Without Getting Rate-Limited",
    domain: "blog.crawlbase.io",
    url: "https://blog.crawlbase.io/async-scraping",
    status: "Processing",
  },
  {
    id: "4",
    title: "A Practical Guide to pgvector HNSW Indexes",
    domain: "neon.tech",
    url: "https://neon.tech/pgvector-hnsw",
    status: "Pending",
  },
  {
    id: "5",
    title: "Chunking Strategies That Actually Preserve Meaning",
    domain: "pinecone.io",
    url: "https://pinecone.io/chunking",
    status: "Processed",
  },
]

export const activeBriefing: Briefing = {
  id: "1",
  title: "Designing Resilient Vector Search Pipelines at Scale",
  url: "https://engineering.acme.dev/vector-search",
  domain: "engineering.acme.dev",
  readingTime: "11 min read",
  bullets: [
    {
      insight:
        "Hybrid retrieval that fuses dense embeddings with sparse keyword scores consistently outperforms pure vector search on long-tail queries.",
      context: {
        source: "Why Embedding Drift Quietly Breaks RAG Systems",
        note: "Reinforces your earlier note that dense-only recall degrades as the corpus grows — the fix you flagged then was exactly this hybrid approach.",
        similarity: 0.91,
      },
    },
    {
      insight:
        "Re-ranking the top 100 candidates with a cross-encoder adds ~40ms but lifts precision@5 enough to justify the latency in most read-heavy apps.",
      context: {
        source: "A Practical Guide to pgvector HNSW Indexes",
        note: "Pairs with your saved HNSW tuning params — the ef_search value you bookmarked sets the candidate pool this re-ranker depends on.",
        similarity: 0.84,
      },
    },
    {
      insight:
        "Treat the ingestion scraper and the embedding job as separate, idempotent queues so a failed page never blocks the rest of the batch.",
      context: {
        source: "Async Scraping Without Getting Rate-Limited",
        note: "Directly extends the backoff strategy in that digest — decoupling the queues is the missing piece your notes called an open question.",
        similarity: 0.78,
      },
    },
  ],
}
