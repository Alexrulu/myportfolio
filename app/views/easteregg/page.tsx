"use client"

import dynamic from "next/dynamic"

const BuildGame = dynamic(
  () => import("@/app/components/BuildGame"),
  { ssr: false }
)

export default function EasterEggPage() {
  return <BuildGame />
}
