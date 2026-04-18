"use client"

import dynamic from "next/dynamic"

// Loaded only when this route is actually visited — no prefetch, no SSR
const BuildGame = dynamic(
  () => import("@/app/components/BuildGame"),
  { ssr: false, loading: () => <div className="fixed inset-0 bg-[#EC8008]" /> }
)

export default function EasterEggPage() {
  return <BuildGame />
}
