"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import Link from "next/link"
import { motion } from "motion/react"
import { useLanguage } from "../context/LanguageContext"

// ── Types ────────────────────────────────────────────────────────────────────

type BlockType = "grass" | "wood" | "log" | "door" | "glass" | "monitor" | "desk" | "coffee" | "bug" | "dirt" | "plant"

const BLOCK_DEFS: { id: BlockType; en: string; es: string; emoji: string; key: string }[] = [
  { id: "plant",   en: "Plant",    es: "Planta",   emoji: "🪴", key: "1" },
  { id: "wood",    en: "Wood",     es: "Madera",   emoji: "🪵", key: "2" },
  { id: "log",     en: "Concrete", es: "Concreto", emoji: "🪨", key: "3" },
  { id: "door",    en: "Door",     es: "Puerta",   emoji: "🚪", key: "4" },
  { id: "glass",   en: "Glass",    es: "Vidrio",   emoji: "🪟", key: "5" },
  { id: "monitor", en: "PC",       es: "PC",       emoji: "🖥️", key: "6" },
  { id: "desk",    en: "Desk",     es: "Mesa",     emoji: "🪑", key: "7" },
  { id: "coffee",  en: "Coffee",   es: "Café",     emoji: "☕", key: "8" },
  { id: "bug",     en: "Bug 💥",   es: "Bug 💥",   emoji: "🐛", key: "9" },
]

// ── Texture helpers ───────────────────────────────────────────────────────────

function px16(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas")
  c.width = c.height = 16
  return [c, c.getContext("2d")!]
}
function toTex(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c)
  t.magFilter = THREE.NearestFilter
  t.minFilter = THREE.NearestFilter
  return t
}
function hn(x: number, y: number, seed = 0) {
  return Math.abs(Math.sin(x * 127.1 + y * 311.7 + seed * 74.3)) % 1
}
function noisy(colors: string[], seed: number) {
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      ctx.fillStyle = colors[Math.floor(hn(x, y, seed) * colors.length)]
      ctx.fillRect(x, y, 1, 1)
    }
  return toTex(c)
}

function grassTop()  { return noisy(["#4EAA2C","#3E9220","#62C038","#46A028","#58B830"], 0) }
function dirtTex()   { return noisy(["#8B5E3C","#7A4E2C","#9A6E4C","#6B3E1C","#A07040"], 2) }
function metalTex()  { return noisy(["#2A2A3A","#252535","#303045","#1E1E2E","#282838"], 10) }

function grassSide(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const v = hn(x, y, 1)
      ctx.fillStyle = y < 4
        ? (["#4EAA2C","#3E9220","#62C038","#46A028"])[Math.floor(v * 4)]
        : (["#8B5E3C","#7A4E2C","#9A6E4C","#6B3E1C"])[Math.floor(v * 4)]
      ctx.fillRect(x, y, 1, 1)
    }
  return toTex(c)
}
function woodSide(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  // 3 tablas horizontales con colores ligeramente distintos — pino/miel cálido
  const planks = [
    ["#D4A248","#CCA040","#DCA852","#C89840","#E0AA55"],
    ["#C89840","#D2A04A","#CAA044","#D8A850","#BF9238"],
    ["#DCA852","#D0A248","#E2B05A","#C89840","#D4A04C"],
  ]
  for (let y = 0; y < 16; y++) {
    const seam = y === 5 || y === 11
    const pi   = y < 5 ? 0 : y < 11 ? 1 : 2
    for (let x = 0; x < 16; x++) {
      if (seam) {
        ctx.fillStyle = "#8B6020"
      } else {
        // Veta horizontal sutil: módulo del ruido más la coordenada x
        const n = hn(x, y, 4)
        ctx.fillStyle = planks[pi][Math.floor(n * planks[pi].length)]
      }
      ctx.fillRect(x, y, 1, 1)
    }
  }
  // Vetas finas dentro de cada tabla
  ctx.fillStyle = "rgba(90,50,10,0.18)"
  for (let y = 1; y < 16; y += 2) ctx.fillRect(0, y, 16, 1)
  // Clavos pequeños en cada tabla
  ctx.fillStyle = "#7A5010"
  ;[[1,2],[14,2],[1,8],[14,8],[1,13],[14,13]].forEach(([nx,ny]) => ctx.fillRect(nx,ny,1,1))
  return toTex(c)
}
function woodTop(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  // Vista desde arriba: tablas en dirección X con seams en Z
  for (let y = 0; y < 16; y++) {
    const seam = y === 5 || y === 11
    for (let x = 0; x < 16; x++) {
      if (seam) {
        ctx.fillStyle = "#8B6020"
      } else {
        const n = hn(x, y, 5)
        ctx.fillStyle = (["#D4A248","#CCA040","#DCA852","#C89840","#D8A64E"])[Math.floor(n * 5)]
      }
      ctx.fillRect(x, y, 1, 1)
    }
  }
  ctx.fillStyle = "rgba(90,50,10,0.12)"
  for (let y = 1; y < 16; y += 2) ctx.fillRect(0, y, 16, 1)
  return toTex(c)
}
function logSide(): THREE.CanvasTexture {
  // Concreto pulido moderno
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      ctx.fillStyle = (["#A8AAAC","#9EA0A2","#B2B4B6","#A4A6A8","#9C9EA0"])[Math.floor(hn(x,y,20)*5)]
      ctx.fillRect(x, y, 1, 1)
    }
  // Juntas de encofrado cada 8px
  ctx.fillStyle = "rgba(70,72,74,0.35)"
  ctx.fillRect(0, 7, 16, 1); ctx.fillRect(0, 8, 16, 1)
  ctx.fillStyle = "rgba(180,182,184,0.4)"
  ctx.fillRect(0, 0, 16, 1); ctx.fillRect(0, 15, 16, 1)
  return toTex(c)
}
function logTop(): THREE.CanvasTexture {
  // Concreto liso desde arriba
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      ctx.fillStyle = (["#A8AAAC","#B0B2B4","#9EA0A2","#A6A8AA"])[Math.floor(hn(x,y,21)*4)]
      ctx.fillRect(x, y, 1, 1)
    }
  ctx.fillStyle = "rgba(70,72,74,0.2)"
  ctx.fillRect(7, 0, 2, 16); ctx.fillRect(0, 7, 16, 2)
  return toTex(c)
}

// Door — bottom half: handle + lower panel
function doorTexBottom(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  ctx.fillStyle = "#7A5230"; ctx.fillRect(0,0,16,16)
  ctx.fillStyle = "#4A2E10"
  ctx.fillRect(0,0,2,16); ctx.fillRect(14,0,2,16)
  ctx.fillRect(0,0,16,2); ctx.fillRect(0,14,16,2)
  ctx.fillRect(0,7,16,2)
  ctx.fillStyle = "#9A7040"; ctx.fillRect(3,3,10,3)
  ctx.fillStyle = "#9A7040"; ctx.fillRect(3,9,10,4)
  ctx.fillStyle = "#C8901A"; ctx.fillRect(12,9,2,3)
  ctx.fillStyle = "#F0B030"; ctx.fillRect(13,11,1,1)
  return toTex(c)
}
// Door — top half: window pane
function doorTexTop(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  ctx.fillStyle = "#7A5230"; ctx.fillRect(0,0,16,16)
  ctx.fillStyle = "#4A2E10"
  ctx.fillRect(0,0,2,16); ctx.fillRect(14,0,2,16)
  ctx.fillRect(0,0,16,2); ctx.fillRect(0,14,16,2)
  // Window pane
  ctx.fillStyle = "rgba(180,220,255,0.45)"; ctx.fillRect(3,3,10,10)
  ctx.fillStyle = "#AACCEE"
  ctx.fillRect(7,3,2,10); ctx.fillRect(3,7,10,2)
  ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(4,4,3,2); ctx.fillRect(9,4,3,2)
  return toTex(c)
}

function glassTex(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  ctx.clearRect(0, 0, 16, 16)
  // Tinte celeste muy sutil en todo el panel
  ctx.fillStyle = "rgba(180, 220, 255, 0.12)"
  ctx.fillRect(0, 0, 16, 16)
  // Marco fino (1px) — blanco con leve tono azulado
  ctx.fillStyle = "#DDEEFF"
  ctx.fillRect(0, 0, 16, 1); ctx.fillRect(0, 15, 16, 1)
  ctx.fillRect(0, 1, 1, 14); ctx.fillRect(15, 1, 1, 14)
  // Centro: transparente
  return toTex(c)
}
function deskTop(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      ctx.fillStyle = (["#F2F0EC","#EAE8E4","#F8F6F2","#ECEAE6","#F0EEE8"])[Math.floor(hn(x, y, 30) * 5)]
      ctx.fillRect(x, y, 1, 1)
    }
  return toTex(c)
}
function deskSide(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  ctx.fillStyle = "#ECEAE6"; ctx.fillRect(0,0,16,16)
  ctx.fillStyle = "#D4D2CE"; ctx.fillRect(0,0,2,16); ctx.fillRect(14,0,2,16)
  ctx.fillStyle = "#F8F6F2"; ctx.fillRect(0,0,16,2)
  return toTex(c)
}
function monitorFront(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  ctx.fillStyle = "#2A2A3A"; ctx.fillRect(0,0,16,16)
  ctx.fillStyle = "#050510"; ctx.fillRect(1,1,14,12)
  ;[{y:2,s:[[2,5],[8,4],[13,2]]},{y:4,s:[[2,8],[11,3]]},{y:6,s:[[2,3],[6,6],[13,2]]},{y:8,s:[[2,10]]},{y:10,s:[[2,4],[7,5]]}]
    .forEach(({y,s}) => s.forEach(([sx,sw]) => { ctx.fillStyle="#00FF41"; ctx.fillRect(sx,y,sw,1) }))
  ctx.fillStyle="#3A3A4A"; ctx.fillRect(6,13,4,1); ctx.fillRect(5,14,6,2)
  return toTex(c)
}
function coffeeTop(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  ctx.fillStyle="#5C3318"; ctx.fillRect(0,0,16,16)
  ctx.fillStyle="#2A1508"; ctx.fillRect(3,3,10,10)
  ctx.fillStyle="#D4A070"; ctx.fillRect(5,5,6,6)
  ctx.fillStyle="#E8C090"; ctx.fillRect(6,6,4,4)
  ctx.fillStyle="#DDDDDD"; ctx.fillRect(4,1,1,1); ctx.fillRect(8,0,1,1); ctx.fillRect(12,1,1,1)
  return toTex(c)
}
function coffeeSide(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  ctx.fillStyle="#5C3318"; ctx.fillRect(0,0,16,16)
  ctx.fillStyle="#8B6040"
  ctx.fillRect(0,0,16,2); ctx.fillRect(13,4,2,1); ctx.fillRect(14,5,1,4); ctx.fillRect(13,9,2,1); ctx.fillRect(2,14,12,2)
  ctx.fillStyle="#AAAAAA"; ctx.fillRect(5,1,1,1); ctx.fillRect(10,1,1,1)
  return toTex(c)
}
// Ceramic pot — light cream/marble tones
function plantPotTex(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      ctx.fillStyle = (["#DDD4CA","#E8DDD4","#CAC0B8","#D8CEC6","#F0E8E0"])[Math.floor(hn(x, y, 60) * 5)]
      ctx.fillRect(x, y, 1, 1)
    }
  // Subtle marble vein lines
  ctx.fillStyle = "rgba(160,140,130,0.25)"
  for (let i = 2; i < 16; i += 5) ctx.fillRect(i, 0, 1, 16)
  return toTex(c)
}
// Worm skin: reddish mottled surface used on the 3-D segments
function bugTex(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      ctx.fillStyle = (["#CC2222","#DD3333","#BB1111","#EE4444","#CC1A1A"])[Math.floor(hn(x, y, 42) * 5)]
      ctx.fillRect(x, y, 1, 1)
    }
  // Subtle ring grooves (segment separators)
  ctx.fillStyle = "rgba(0,0,0,0.28)"
  for (let x = 3; x < 16; x += 4) ctx.fillRect(x, 0, 1, 16)
  // Belly highlight
  ctx.fillStyle = "rgba(255,100,100,0.18)"
  for (let x = 0; x < 16; x++) ctx.fillRect(x, 11, 1, 5)
  return toTex(c)
}

// ── Materials ─────────────────────────────────────────────────────────────────

interface Textures {
  grassTop: THREE.CanvasTexture; grassSide: THREE.CanvasTexture; dirt: THREE.CanvasTexture
  woodSide: THREE.CanvasTexture; woodTop: THREE.CanvasTexture
  logSide: THREE.CanvasTexture; logTop: THREE.CanvasTexture
  doorTop: THREE.CanvasTexture; doorBot: THREE.CanvasTexture
  glass: THREE.CanvasTexture
  monitorFront: THREE.CanvasTexture; metal: THREE.CanvasTexture
  deskTop: THREE.CanvasTexture; deskSide: THREE.CanvasTexture
  coffeeTop: THREE.CanvasTexture; coffeeSide: THREE.CanvasTexture
  bug: THREE.CanvasTexture
  plantPot: THREE.CanvasTexture
}
function buildTextures(): Textures {
  return {
    grassTop: grassTop(), grassSide: grassSide(), dirt: dirtTex(),
    woodSide: woodSide(), woodTop: woodTop(),
    logSide: logSide(), logTop: logTop(),
    doorTop: doorTexTop(), doorBot: doorTexBottom(),
    glass: glassTex(),
    monitorFront: monitorFront(), metal: metalTex(),
    deskTop: deskTop(), deskSide: deskSide(),
    coffeeTop: coffeeTop(), coffeeSide: coffeeSide(),
    bug: bugTex(),
    plantPot: plantPotTex(),
  }
}
// ── Shared geometry & material cache ─────────────────────────────────────────
// Reuse a single BoxGeometry(1,1,1) for all standard cubes (saves GPU memory)
const _geo1 = new THREE.BoxGeometry(1, 1, 1)

// Cache materials by texture UUID — avoids creating thousands of duplicate
// MeshLambertMaterial instances (floor alone was creating ~1500 duplicates)
const _matCache  = new Map<string, THREE.MeshLambertMaterial>()
const _gmatCache = new Map<string, THREE.MeshLambertMaterial>()
function mat(t: THREE.Texture): THREE.MeshLambertMaterial {
  if (!_matCache.has(t.uuid))
    _matCache.set(t.uuid, new THREE.MeshLambertMaterial({ map: t, side: THREE.DoubleSide }))
  return _matCache.get(t.uuid)!
}
function gmat(t: THREE.Texture): THREE.MeshLambertMaterial {
  if (!_gmatCache.has(t.uuid))
    _gmatCache.set(t.uuid, new THREE.MeshLambertMaterial({ map: t, side: THREE.DoubleSide, transparent: true, alphaTest: 0.05 }))
  return _gmatCache.get(t.uuid)!
}

// Used for HUD hand-block (always a simple 1×1×1 cube)
function getMaterials(type: BlockType, tx: Textures): THREE.MeshLambertMaterial[] {
  switch (type) {
    case "grass":   return [mat(tx.grassSide),mat(tx.grassSide),mat(tx.grassTop),mat(tx.dirt),mat(tx.grassSide),mat(tx.grassSide)]
    case "dirt":    return Array(6).fill(null).map(() => mat(tx.dirt))
    case "wood":    return [mat(tx.woodSide),mat(tx.woodSide),mat(tx.woodTop),mat(tx.woodTop),mat(tx.woodSide),mat(tx.woodSide)]
    case "log":     return [mat(tx.logSide),mat(tx.logSide),mat(tx.logTop),mat(tx.logTop),mat(tx.logSide),mat(tx.logSide)]
    case "door":    return Array(6).fill(null).map(() => mat(tx.doorBot))
    case "glass":   return Array(6).fill(null).map(() => new THREE.MeshLambertMaterial({ map: tx.glass, transparent: true, opacity: 0.55, depthWrite: false }))
    case "monitor": return [mat(tx.metal),mat(tx.metal),mat(tx.metal),mat(tx.metal),mat(tx.monitorFront),mat(tx.metal)]
    case "desk":    return [mat(tx.deskSide),mat(tx.deskSide),mat(tx.deskTop),mat(tx.deskSide),mat(tx.deskSide),mat(tx.deskSide)]
    case "coffee":  return [mat(tx.coffeeSide),mat(tx.coffeeSide),mat(tx.coffeeTop),mat(tx.coffeeSide),mat(tx.coffeeSide),mat(tx.coffeeSide)]
    case "bug":     return Array(6).fill(null).map(() => mat(tx.bug))
    case "plant":   return Array(6).fill(null).map(() => mat(tx.plantPot))
  }
}

// ── Custom visual shapes ──────────────────────────────────────────────────────
// facing: door rotation around Y to face the player (snapped to 90° increments)

function createVisual(type: BlockType, tx: Textures, facing = 0): THREE.Object3D {
  switch (type) {

    case "grass":
    case "wood":
    case "log":
    case "dirt":
      return new THREE.Mesh(_geo1, getMaterials(type, tx))

    case "bug": {
      const g = new THREE.Group()
      g.rotation.y = facing
      const bMat   = mat(tx.bug)
      const eyeMat = new THREE.MeshLambertMaterial({ color: 0xFFEE22 })
      const pupMat = new THREE.MeshLambertMaterial({ color: 0x111111 })
      const dkMat  = new THREE.MeshLambertMaterial({ color: 0x881111 })

      // ── Body segments (head → tail, gentle S-curve) ──
      const segs: [number,number,number,number,number,number][] = [
        [ -0.08,  0.06, -0.12,  0.36, 0.34, 0.34 ], // head
        [  0.06,  0.01,  0.05,  0.28, 0.26, 0.26 ], // segment 1
        [ -0.04, -0.05,  0.19,  0.22, 0.20, 0.20 ], // segment 2
        [  0.04, -0.12,  0.30,  0.14, 0.12, 0.14 ], // tail
      ]
      segs.forEach(([x, y, z, w, h, d]) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bMat)
        m.position.set(x, y, z); g.add(m)
      })

      // ── Eyes on head front face (z ≈ −0.29) ──
      const eyeZ = -0.31
      ;[ [-0.07, 0.12], [0.07, 0.12] ].forEach(([ex, ey]) => {
        const eye = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.04), eyeMat)
        eye.position.set(ex, ey, eyeZ); g.add(eye)
        const pup = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), pupMat)
        pup.position.set(ex, ey, eyeZ - 0.03); g.add(pup)
      })

      // ── Antennae on top of head ──
      ;[ [-0.07, 0.3, -0.16, 0.3], [0.07, 0.3, -0.16, -0.3] ].forEach(([ax, ay, az, tilt]) => {
        const stem = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.04), dkMat)
        stem.rotation.z = tilt as number
        stem.position.set(ax as number, ay as number, az as number); g.add(stem)
        const tip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.07), eyeMat)
        tip.position.set(
          (ax as number) + (tilt as number) * 0.07,
          (ay as number) + 0.10,
          az as number
        ); g.add(tip)
      })

      // ── Legs: 3 pairs, dangling from segment undersides ──
      // [segCenterX, segCenterY, segCenterZ, segHalfW, segHalfH]
      const legData: [number,number,number,number,number][] = [
        [ -0.08,  0.06, -0.12,  0.18, 0.17 ],
        [  0.06,  0.01,  0.05,  0.14, 0.13 ],
        [ -0.04, -0.05,  0.19,  0.11, 0.10 ],
      ]
      legData.forEach(([sx, sy, sz, hw, hh]) => {
        const legY = sy - hh - 0.03
        ;[ -(hw + 0.07),  (hw + 0.07) ].forEach(offX => {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.06), dkMat)
          leg.position.set(sx + offX, legY, sz); g.add(leg)
        })
      })

      return g
    }

    case "plant": {
      const g = new THREE.Group()
      const potMat  = mat(tx.plantPot)
      const rimMat  = new THREE.MeshLambertMaterial({ color: 0xB8ACA4 })
      const soilMat = new THREE.MeshLambertMaterial({ color: 0x2A180A })
      const lDark   = new THREE.MeshLambertMaterial({ color: 0x1A5C28, side: THREE.DoubleSide })
      const lMid    = new THREE.MeshLambertMaterial({ color: 0x2E8040, side: THREE.DoubleSide })
      const lLight  = new THREE.MeshLambertMaterial({ color: 0x50A85A, side: THREE.DoubleSide })

      // ── Pot (properly stacked, base bottom = −0.50) ──
      // base:  h=0.03  bot=−0.50  top=−0.47
      // lower: h=0.11  bot=−0.47  top=−0.36
      // upper: h=0.12  bot=−0.36  top=−0.24
      // rim:   h=0.04  bot=−0.24  top=−0.20
      const base  = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.03, 0.17), rimMat)
      base.position.set(0, -0.485, 0); g.add(base)
      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.11, 0.20), potMat)
      lower.position.set(0, -0.415, 0); g.add(lower)
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.25), potMat)
      upper.position.set(0, -0.30, 0); g.add(upper)
      const rim   = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.28), rimMat)
      rim.position.set(0, -0.22, 0); g.add(rim)
      const soil  = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.02, 0.23), soilMat)
      soil.position.set(0, -0.205, 0); g.add(soil)

      // ── Succulent leaves ──
      const mkLeaf = (w: number, h: number, d: number, lMat: THREE.Material,
                      px: number, py: number, pz: number, rx: number, rz: number) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lMat)
        m.position.set(px, py, pz); m.rotation.x = rx; m.rotation.z = rz; g.add(m)
      }
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        mkLeaf(0.05, 0.17, 0.03, i % 3 === 0 ? lLight : lMid,
          Math.sin(a) * 0.06, -0.13, Math.cos(a) * 0.06,
          Math.cos(a) * 0.50, -Math.sin(a) * 0.50)
      }
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4
        mkLeaf(0.04, 0.13, 0.03, lDark,
          Math.sin(a) * 0.03, -0.11, Math.cos(a) * 0.03,
          Math.cos(a) * 0.28, -Math.sin(a) * 0.28)
      }
      const center = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.03), lMid)
      center.position.set(0, -0.07, 0); g.add(center)

      return g
    }

    // 2-block-tall door: two panel halves so the texture isn't stretched
    // The outer group sits at (x, rootY + 0.5, z) — midpoint of both block slots
    case "door": {
      const outer = new THREE.Group()
      outer.rotation.y = facing
      const pivot = new THREE.Group()
      pivot.position.x = -0.45          // hinge at left edge of block
      const panelGeo = new THREE.BoxGeometry(0.9, 0.95, 0.08)
      // Top half — window pane texture
      const pTop = new THREE.Mesh(panelGeo, Array(6).fill(null).map(() => mat(tx.doorTop)))
      pTop.position.set(0.45, 0.475, 0)
      pivot.add(pTop)
      // Bottom half — handle + panel texture
      const pBot = new THREE.Mesh(panelGeo, Array(6).fill(null).map(() => mat(tx.doorBot)))
      pBot.position.set(0.45, -0.475, 0)
      pivot.add(pBot)
      outer.add(pivot)
      outer.userData.pivot = pivot
      return outer
    }

    case "glass": {
      const glassMat = new THREE.MeshLambertMaterial({
        map: tx.glass, transparent: true, opacity: 0.92, alphaTest: 0.01,
        side: THREE.DoubleSide, depthWrite: false,
      })
      const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.06), glassMat)
      m.rotation.y = facing
      return m
    }

    case "monitor": {
      const g = new THREE.Group()
      g.rotation.y = facing
      const mMat = mat(tx.metal)
      // Monitor — pushed toward the back (-Z local = away from player)
      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.78, 0.52, 0.06),
        [mMat,mMat,mMat,mMat,mat(tx.monitorFront),mMat]
      )
      // mBase: h=0.03  bot=−0.50  top=−0.47  center=−0.485
      // stand: h=0.20  bot=−0.47  top=−0.27  center=−0.37
      // screen:h=0.52  bot=−0.27  top=+0.25  center=−0.01
      screen.position.set(0, -0.01, -0.10); g.add(screen)
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.20, 0.05), mMat)
      stand.position.set(0, -0.37, -0.10); g.add(stand)
      const mBase = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.03, 0.20), mMat)
      mBase.position.set(0, -0.485, -0.10); g.add(mBase)
      // Keyboard — toward front (+Z local = toward player)
      const kbMat = new THREE.MeshLambertMaterial({ color: 0x1A1A2A })
      const kb = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.03, 0.22), kbMat)
      kb.position.set(0, -0.485, 0.16); g.add(kb)
      // Keyboard key rows
      const keysMat = new THREE.MeshLambertMaterial({ color: 0x2E2E40 })
      for (let row = 0; row < 3; row++) {
        const row3d = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.01, 0.04), keysMat)
        row3d.position.set(0, -0.470, 0.10 + row * 0.05); g.add(row3d)
      }
      // Mouse — right side of keyboard (+X local)
      const mouseMat = new THREE.MeshLambertMaterial({ color: 0x222232 })
      const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.03, 0.14), mouseMat)
      mouse.position.set(0.37, -0.485, 0.16); g.add(mouse)
      const divider = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.015, 0.08), keysMat)
      divider.position.set(0.37, -0.470, 0.14); g.add(divider)
      return g
    }

    case "desk": {
      const g = new THREE.Group()
      g.rotation.y = facing
      const top = new THREE.Mesh(
        new THREE.BoxGeometry(0.98, 0.08, 0.98),  // touches block edges
        [mat(tx.deskSide),mat(tx.deskSide),mat(tx.deskTop),mat(tx.deskSide),mat(tx.deskSide),mat(tx.deskSide)]
      )
      top.position.set(0, 0.46, 0); g.add(top)   // top = +0.50 (flush with block top)
      const legGeo = new THREE.BoxGeometry(0.08, 0.92, 0.08)   // full block height minus tabletop
      const legMat = mat(tx.deskSide)
      ;([[0.44,0.44],[0.44,-0.44],[-0.44,0.44],[-0.44,-0.44]] as [number,number][]).forEach(([lx,lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat)
        leg.position.set(lx, -0.04, lz); g.add(leg)  // bottom = −0.50, top = 0.42 (under tabletop)
      })
      return g
    }

    case "coffee": {
      const g = new THREE.Group()
      g.rotation.y = facing
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.28, 0.22),
        [mat(tx.coffeeSide),mat(tx.coffeeSide),mat(tx.coffeeTop),mat(tx.coffeeSide),mat(tx.coffeeSide),mat(tx.coffeeSide)]
      )
      body.position.set(0, -0.36, 0); g.add(body)   // bottom = −0.50
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.10, 0.03), mat(tx.coffeeSide))
      handle.position.set(0.135, -0.36, 0); g.add(handle)
      return g
    }
  }
}

// ── Sky & Landscape ───────────────────────────────────────────────────────────

function buildSkyDome(): THREE.Mesh {
  // 2×256 gradient canvas — top=zenith, bottom=underground (hidden by floor)
  const c = document.createElement("canvas"); c.width = 2; c.height = 256
  const ctx = c.getContext("2d")!
  const g = ctx.createLinearGradient(0, 0, 0, 256)
  g.addColorStop(0.00, "#1A1040")   // zenith — deep blue-purple
  g.addColorStop(0.22, "#3A1860")   // upper sky — purple
  g.addColorStop(0.44, "#A03468")   // mid sky — pink-magenta
  g.addColorStop(0.62, "#D05030")   // lower sky — warm red-orange
  g.addColorStop(0.75, "#E87020")   // near horizon — orange
  g.addColorStop(0.86, "#F5A030")   // horizon — bright amber
  g.addColorStop(1.00, "#E8C050")   // underground (never visible)
  ctx.fillStyle = g; ctx.fillRect(0, 0, 2, 256)
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(75, 24, 12),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(c),
      side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false,
    })
  )
  dome.renderOrder = -2
  dome.frustumCulled = false
  return dome
}

function buildSunDisc(): THREE.Mesh {
  // Radial glow texture on a billboard quad
  const c = document.createElement("canvas"); c.width = c.height = 64
  const ctx = c.getContext("2d")!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0.00, "rgba(255,255,215,1.00)")
  g.addColorStop(0.18, "rgba(255,215,70,0.92)")
  g.addColorStop(0.45, "rgba(255,105,10,0.50)")
  g.addColorStop(0.75, "rgba(255,50,0,0.15)")
  g.addColorStop(1.00, "rgba(220,40,0,0.00)")
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64)
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(c),
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, fog: false,
    })
  )
  // Low on the western horizon
  mesh.position.set(-26, 13, -30)
  mesh.lookAt(new THREE.Vector3(7.5, 1.5, 7.5))
  return mesh
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BuildGame() {
  const { language } = useLanguage()
  const t = {
    move:       language === "EN" ? "move"              : "mover",
    jump:       language === "EN" ? "jump"              : "saltar",
    place:      language === "EN" ? "place / open door" : "colocar / abrir puerta",
    remove:     language === "EN" ? "remove block"      : "remover bloque",
    select:     language === "EN" ? "select block"      : "seleccionar bloque",
    pause:      language === "EN" ? "pause"             : "pausar",
    reset:      language === "EN" ? "reset world"       : "reiniciar mundo",
    clickPlay:  language === "EN" ? "click to play"     : "click para jugar",
    placed:     language === "EN" ? "placed"            : "colocados",
    back:       language === "EN" ? "← back"            : "← volver",
  }
  const label = (b: typeof BLOCK_DEFS[0]) => language === "EN" ? b.en : b.es

  const mountRef       = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<BlockType>("grass")
  const [count, setCount]       = useState(0)
  const [locked, setLocked]     = useState(false)

  const selectedRef    = useRef<BlockType>("grass")
  const requestLockRef = useRef<() => void>(() => {})
  const resetRef       = useRef<() => void>(() => {})
  const updateHandRef  = useRef<((t: BlockType) => void) | null>(null)
  const worldRef       = useRef(new Map<string, BlockType>())
  const visualsRef     = useRef(new Map<string, THREE.Object3D>())

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current
    const W = container.clientWidth, H = container.clientHeight

    // ── Scene ──
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog("#D8844A", 18, 34)

    const cam = new THREE.PerspectiveCamera(75, W / H, 0.05, 100)

    const renderer = new THREE.WebGLRenderer({ antialias: false })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.autoClear = false
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight("#B088C0", 0.80))
    const sun = new THREE.DirectionalLight("#FFD888", 1.20)
    // Match the visual sun disc position exactly so shadows fall the right way
    sun.position.set(-26, 13, -30)
    sun.target.position.set(7.5, 0, 7.5)
    scene.add(sun.target)
    sun.castShadow = true
    sun.shadow.bias = -0.0015
    sun.shadow.mapSize.width  = 2048
    sun.shadow.mapSize.height = 2048
    sun.shadow.camera.near = 0.5
    sun.shadow.camera.far  = 80
    sun.shadow.camera.left   = -30
    sun.shadow.camera.right  =  30
    sun.shadow.camera.top    =  30
    sun.shadow.camera.bottom = -30
    scene.add(sun)

    // ── HUD scene ──
    const hudScene = new THREE.Scene()
    const hudCam   = new THREE.PerspectiveCamera(40, W / H, 0.01, 10)
    hudCam.position.set(0, 0, 3)
    hudScene.add(new THREE.AmbientLight("#ffffff", 0.7))
    const hudLight = new THREE.DirectionalLight("#fff8e0", 0.8)
    hudLight.position.set(1, 2, 1); hudScene.add(hudLight)

    const tx = buildTextures()

    const armGroup  = new THREE.Group()
    const handBlock = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.72, 0.72), getMaterials("grass", tx))
    handBlock.rotation.set(0.28, 0.55, -0.12)
    armGroup.add(handBlock)
    armGroup.position.set(2.1, -1.38, -1.6)
    hudScene.add(armGroup)

    updateHandRef.current = (type: BlockType) => {
      handBlock.material = getMaterials(type, tx) as THREE.MeshLambertMaterial[]
    }

    // ── World state ──
    const world     = worldRef.current
    const visuals   = visualsRef.current
    const boundsMap = new Map<string, THREE.Mesh>()
    const placeable: THREE.Mesh[] = []
    // Door-specific state
    const doorRoots  = new Map<string, string>()              // any door key → root (bottom) key
    const doorStates = new Map<string, boolean>()             // root key → isOpen
    const doorAnims  = new Map<string, { cur: number; tgt: number }>()  // root key → anim

    const boundGeo = new THREE.BoxGeometry(1, 1, 1)
    const boundMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })

    function wKey(x: number, y: number, z: number) { return `${x},${y},${z}` }

    // ── removeDoor: removes both world slots + visual + bounds for a 2-tall door ──
    function removeDoor(rootKey: string) {
      const [rx, ry, rz] = rootKey.split(",").map(Number)
      const topKey = wKey(rx, ry + 1, rz)
      const visual = visuals.get(rootKey)
      if (visual) { scene.remove(visual); visuals.delete(rootKey) }
      for (const k of [rootKey, topKey]) {
        const b = boundsMap.get(k)
        if (b) { scene.remove(b); const i = placeable.indexOf(b); if (i >= 0) placeable.splice(i, 1); boundsMap.delete(k) }
        world.delete(k); doorRoots.delete(k)
      }
      doorStates.delete(rootKey); doorAnims.delete(rootKey)
    }

    // ── addBlock ──
    function addBlock(x: number, y: number, z: number, type: BlockType, animate = false, facing = 0) {
      const k = wKey(x, y, z)
      if (world.has(k)) return

      if (type === "door") {
        // Doors occupy two vertical slots
        const topKey = wKey(x, y + 1, z)
        if (world.has(topKey)) return          // top slot already occupied

        world.set(k, "door"); world.set(topKey, "door")

        // Single visual centred between the two block slots
        const visual = createVisual("door", tx, facing)
        visual.position.set(x, y + 0.5, z)
        // Merge — do NOT replace userData; createVisual stores pivot ref there
        Object.assign(visual.userData, { key: k, x, y, z, baseY: y })
        if (animate) visual.userData.animStart = Date.now()
        visual.traverse(child => {
          if (child instanceof THREE.Mesh) { child.castShadow = child.receiveShadow = true }
        })
        scene.add(visual); visuals.set(k, visual)

        // Two invisible bounds (one per slot) for raycasting
        const mkBound = (bx: number, by: number, bz: number, bKey: string) => {
          const b = new THREE.Mesh(boundGeo, boundMat)
          b.position.set(bx, by, bz)
          b.userData = { key: bKey, x: bx, y: by, z: bz, type: "door", rootKey: k }
          scene.add(b); boundsMap.set(bKey, b); placeable.push(b)
        }
        mkBound(x, y, z, k); mkBound(x, y + 1, z, topKey)
        doorRoots.set(k, k); doorRoots.set(topKey, k)
        doorStates.set(k, false)
        doorAnims.set(k, { cur: 0, tgt: 0 })
        return
      }

      // Regular 1-block placement
      world.set(k, type)
      const visual = createVisual(type, tx, facing)
      visual.position.set(x, y, z)
      Object.assign(visual.userData, { key: k, x, y, z, baseY: y })
      if (animate) visual.userData.animStart = Date.now()
      visual.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.receiveShadow = true
          child.castShadow = type !== "dirt"   // dirt layer is never visible, skip shadow cost
        }
      })
      scene.add(visual); visuals.set(k, visual)

      const bound = new THREE.Mesh(boundGeo, boundMat)
      bound.position.set(x, y, z)
      bound.userData = { key: k, x, y, z, type }
      scene.add(bound); boundsMap.set(k, bound); placeable.push(bound)
    }

    // ── removeBlock ──
    function removeBlock(x: number, y: number, z: number) {
      const k = wKey(x, y, z)
      if (!world.has(k)) return
      if (world.get(k) === "door") {
        const rootKey = doorRoots.get(k) ?? k
        removeDoor(rootKey)
        setCount(c => c - 1)
        return
      }
      const visual = visuals.get(k)!
      scene.remove(visual); visuals.delete(k)
      const bound = boundsMap.get(k)!
      scene.remove(bound); placeable.splice(placeable.indexOf(bound), 1); boundsMap.delete(k)
      world.delete(k)
      setCount(c => c - 1)
    }

    // Build floor — 2 layers: grass on top, dirt below
    for (let x = 0; x < 16; x++)
      for (let z = 0; z < 16; z++) {
        addBlock(x, -1, z, "dirt")
        addBlock(x,  0, z, "grass")
      }

    // Sky — added after floor so depth sort is clean
    scene.add(buildSkyDome())
    scene.add(buildSunDisc())

    // ── Reset world ──
    resetRef.current = () => {
      // Remove every block including the floor
      for (const [k] of [...world.entries()]) {
        const v = visuals.get(k); if (v) { scene.remove(v); visuals.delete(k) }
        const b = boundsMap.get(k)
        if (b) { scene.remove(b); const i = placeable.indexOf(b); if (i >= 0) placeable.splice(i, 1); boundsMap.delete(k) }
        world.delete(k)
      }
      doorRoots.clear(); doorStates.clear(); doorAnims.clear()
      // Rebuild the floor fresh
      for (let x = 0; x < 16; x++)
        for (let z = 0; z < 16; z++) {
          addBlock(x, -1, z, "dirt")
          addBlock(x,  0, z, "grass")
        }
      setCount(0)
    }

    const highlight = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.03, 1.03, 1.03)),
      new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.85 })
    )
    highlight.visible = false; scene.add(highlight)

    // ── Player ──
    const pos    = new THREE.Vector3(8, 0.5, 8)
    const vel    = new THREE.Vector3(0, 0, 0)
    let yaw      = Math.PI + 0.3
    let pitch    = 0
    let grounded = true
    const keys   = new Set<string>()

    const GRAVITY = -22, JUMP_VEL = 9, MOVE_SPEED = 4.5
    const EYE_H = 1.62, REACH = 5.5, PW = 0.29

    // Closed doors are solid; open doors are passthrough
    function blockAt(bx: number, by: number, bz: number): boolean {
      const k = `${bx},${by},${bz}`
      if (!world.has(k)) return false
      if (world.get(k) === "door") {
        const rootKey = doorRoots.get(k) ?? k
        return !(doorStates.get(rootKey) ?? false)
      }
      return true
    }

    function playerOverlaps(px: number, py: number, pz: number): boolean {
      const mnX = px-PW, mxX = px+PW, mnY = py, mxY = py+1.8, mnZ = pz-PW, mxZ = pz+PW
      for (let bx = Math.floor(mnX); bx <= Math.floor(mxX); bx++)
        for (let by = Math.floor(mnY); by <= Math.floor(mxY); by++)
          for (let bz = Math.floor(mnZ); bz <= Math.floor(mxZ); bz++)
            if (blockAt(bx,by,bz) &&
                mnX<bx+0.5 && mxX>bx-0.5 &&
                mnY<by+0.5 && mxY>by-0.5 &&
                mnZ<bz+0.5 && mxZ>bz-0.5) return true
      return false
    }

    // True only when the new block's AABB physically intersects the player's current AABB.
    // Used for placement — playerOverlaps(bx,by,bz) was wrong because it scanned
    // blocks ABOVE the target slot and falsely blocked placing below elevated blocks.
    function newBlockHitsPlayer(bx: number, by: number, bz: number): boolean {
      return pos.x - PW < bx + 0.5 && pos.x + PW > bx - 0.5 &&
             pos.y      < by + 0.5 && pos.y + 1.8 > by - 0.5 &&
             pos.z - PW < bz + 0.5 && pos.z + PW > bz - 0.5
    }

    const ray = new THREE.Raycaster(); ray.far = REACH
    function getHit() {
      ray.setFromCamera(new THREE.Vector2(0, 0), cam)
      const hits = ray.intersectObjects(placeable)
      return hits.length > 0 ? hits[0] : null
    }

    // ── Pointer lock ──
    let isLocked = false
    function onLockChange() {
      isLocked = document.pointerLockElement === renderer.domElement
      setLocked(isLocked)
      if (!isLocked) keys.clear()   // evita teclas "atascadas" al salir con ESC
    }
    document.addEventListener("pointerlockchange", onLockChange)
    requestLockRef.current = () => {
      const el = renderer.domElement
      const result = el.requestPointerLock() as unknown as Promise<void> | undefined
      // Browsers return a Promise in newer APIs — if the first attempt fails
      // (cooldown after ESC), retry once after a short delay
      if (result instanceof Promise) result.catch(() => setTimeout(() => el.requestPointerLock(), 200))
    }
    renderer.domElement.addEventListener("click", () => { if (!isLocked) renderer.domElement.requestPointerLock() })

    function onMouseMove(e: MouseEvent) {
      if (!isLocked) return
      yaw   -= e.movementX * 0.0013
      pitch  = Math.max(-Math.PI/2+0.01, Math.min(Math.PI/2-0.01, pitch - e.movementY * 0.0013))
    }
    document.addEventListener("mousemove", onMouseMove)

    function onMouseDown(e: MouseEvent) {
      if (!isLocked) return
      const hit = getHit()
      if (e.button === 2 && hit) {
        const hitKey  = hit.object.userData.key as string
        const hitType = world.get(hitKey)
        if (hitType === "door") {
          // Toggle door — smooth animation
          const rootKey = (hit.object.userData.rootKey as string) ?? hitKey
          const isOpen  = doorStates.get(rootKey) ?? false
          doorStates.set(rootKey, !isOpen)
          const anim = doorAnims.get(rootKey)
          if (anim) anim.tgt = !isOpen ? -Math.PI / 2 : 0
        } else {
          // Place block — snap door facing to player yaw
          const norm    = hit.face!.normal.clone().transformDirection(hit.object.matrixWorld).round()
          const p       = hit.object.position.clone().add(norm)
          const [bx, by, bz] = [Math.round(p.x), Math.round(p.y), Math.round(p.z)]
          if (by >= 0 && !newBlockHitsPlayer(bx, by, bz)) {
            const facing = Math.round(yaw / (Math.PI / 2)) * (Math.PI / 2)
            addBlock(bx, by, bz, selectedRef.current, true, facing)
            setCount(c => c + 1)
            if (selectedRef.current === "bug") pending.push({ x: bx, y: by, z: bz, triggerAt: Date.now() + 2500 })
          }
        }
      } else if (e.button === 0 && hit) {
        const { x, y, z } = hit.object.userData
        if (y >= 0) removeBlock(x, y, z)
      }
    }
    function onContextMenu(e: Event) { e.preventDefault() }
    document.addEventListener("mousedown",   onMouseDown)
    document.addEventListener("contextmenu", onContextMenu)

    function onKeyDown(e: KeyboardEvent) {
      keys.add(e.code)
      if (e.code === "Space" && grounded && isLocked) { vel.y = JUMP_VEL; grounded = false; e.preventDefault() }
      if (["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault()
      const num = parseInt(e.key)
      if (num >= 1 && num <= 9) {
        const b = BLOCK_DEFS[num - 1]
        selectedRef.current = b.id; setSelected(b.id); updateHandRef.current?.(b.id)
      }
    }
    function onKeyUp(e: KeyboardEvent) { keys.delete(e.code) }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup",   onKeyUp)

    function onWheel(e: WheelEvent) {
      if (!isLocked) return
      const idx  = BLOCK_DEFS.findIndex(b => b.id === selectedRef.current)
      const next = BLOCK_DEFS[(idx + (e.deltaY > 0 ? 1 : -1) + BLOCK_DEFS.length) % BLOCK_DEFS.length]
      selectedRef.current = next.id; setSelected(next.id); updateHandRef.current?.(next.id)
    }
    document.addEventListener("wheel", onWheel, { passive: true })

    function onResize() {
      const w = container.clientWidth, h = container.clientHeight
      cam.aspect = hudCam.aspect = w / h
      cam.updateProjectionMatrix(); hudCam.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    // ── Explosions ──
    const pending: { x: number; y: number; z: number; triggerAt: number }[] = []
    let shakeEnd = 0

    function explodeAt(ex: number, ey: number, ez: number) {
      const R = 3
      let removed = 0
      const removedDoors = new Set<string>()
      for (let dx = -R; dx <= R; dx++)
        for (let dy = -R; dy <= R; dy++)
          for (let dz = -R; dz <= R; dz++)
            if (dx*dx + dy*dy + dz*dz <= R*R) {
              const bx = ex+dx, by = ey+dy, bz = ez+dz
              if (by <= 0) continue
              const k = wKey(bx, by, bz)
              if (!world.has(k)) continue
              if (world.get(k) === "door") {
                const rootKey = doorRoots.get(k) ?? k
                if (!removedDoors.has(rootKey)) {
                  removedDoors.add(rootKey); removeDoor(rootKey); removed++
                }
              } else {
                const visual = visuals.get(k)!; scene.remove(visual); visuals.delete(k)
                const bound  = boundsMap.get(k)!; scene.remove(bound)
                const i = placeable.indexOf(bound); if (i >= 0) placeable.splice(i, 1); boundsMap.delete(k)
                world.delete(k); removed++
              }
            }
      if (removed > 0) setCount(c => c - removed)
      shakeEnd = Date.now() + 700
    }

    const clock = new THREE.Clock()
    let walkTime = 0
    let rafId: number

    function animate() {
      rafId = requestAnimationFrame(animate)
      const dt  = Math.min(clock.getDelta(), 0.05)
      const now = Date.now()

      if (isLocked) {
        let mx = 0, mz = 0
        if (keys.has("KeyW")||keys.has("ArrowUp"))    { mx -= Math.sin(yaw); mz -= Math.cos(yaw) }
        if (keys.has("KeyS")||keys.has("ArrowDown"))  { mx += Math.sin(yaw); mz += Math.cos(yaw) }
        if (keys.has("KeyA")||keys.has("ArrowLeft"))  { mx -= Math.cos(yaw); mz += Math.sin(yaw) }
        if (keys.has("KeyD")||keys.has("ArrowRight")) { mx += Math.cos(yaw); mz -= Math.sin(yaw) }
        const len = Math.hypot(mx, mz)
        if (len > 0) { mx = mx/len*MOVE_SPEED*dt; mz = mz/len*MOVE_SPEED*dt }

        const nx = pos.x + mx
        if (!playerOverlaps(nx, pos.y, pos.z)) pos.x = nx
        const nz = pos.z + mz
        if (!playerOverlaps(pos.x, pos.y, nz)) pos.z = nz

        // Clamp to platform boundaries — player can't walk off the edge
        pos.x = Math.max(-0.5 + PW, Math.min(15.5 - PW, pos.x))
        pos.z = Math.max(-0.5 + PW, Math.min(15.5 - PW, pos.z))

        vel.y = Math.max(vel.y + GRAVITY * dt, -20)
        const dy = vel.y * dt
        const steps = Math.max(1, Math.ceil(Math.abs(dy) / 0.4))
        const sy = dy / steps
        for (let i = 0; i < steps; i++) {
          const ny = pos.y + sy
          if (playerOverlaps(pos.x, ny, pos.z)) {
            if (vel.y < 0) { pos.y = Math.floor(ny + 0.5) + 0.5; grounded = true }
            vel.y = 0; break
          }
          pos.y = ny
        }
        if (vel.y !== 0) grounded = playerOverlaps(pos.x, pos.y-0.05, pos.z) && !playerOverlaps(pos.x, pos.y, pos.z)
        if (pos.y < -10) { pos.set(8, 0.5, 8); vel.set(0,0,0) }
      }

      const isWalking = isLocked && grounded &&
        (keys.has("KeyW")||keys.has("KeyS")||keys.has("KeyA")||keys.has("KeyD")||
         keys.has("ArrowUp")||keys.has("ArrowDown")||keys.has("ArrowLeft")||keys.has("ArrowRight"))
      if (isWalking) walkTime += dt * 8
      const bobY  = isWalking ? Math.sin(walkTime)       * 0.038 : 0
      const bobX  = isWalking ? Math.sin(walkTime * 0.5) * 0.016 : 0
      const tiltZ = isWalking ? Math.sin(walkTime * 0.5) * 0.006 : 0

      cam.position.set(pos.x + bobX, pos.y + EYE_H + bobY, pos.z)
      cam.rotation.order = "YXZ"
      cam.rotation.y = yaw; cam.rotation.x = pitch; cam.rotation.z = tiltZ

      const hit = isLocked ? getHit() : null
      if (hit) { highlight.position.copy(hit.object.position); highlight.visible = true }
      else        highlight.visible = false

      // Pop-in animation
      for (const [, visual] of visuals) {
        if (visual.userData.animStart !== undefined) {
          const t = Math.min((now - visual.userData.animStart) / 180, 1)
          const s = t < 0.7 ? t/0.7 : 1 + Math.sin((t-0.7)/0.3*Math.PI)*0.08
          visual.scale.setScalar(Math.max(0.01, Math.min(s, 1.08)))
          if (t >= 1) { visual.scale.setScalar(1); delete visual.userData.animStart }
        }
      }

      // Smooth door swing animation
      for (const [rootKey, anim] of doorAnims) {
        if (Math.abs(anim.tgt - anim.cur) > 0.0005) {
          anim.cur += (anim.tgt - anim.cur) * Math.min(dt * 11, 0.95)
          const visual = visuals.get(rootKey)
          if (visual) (visual.userData.pivot as THREE.Group).rotation.y = anim.cur
        }
      }

      // Bug fuse
      for (let i = pending.length - 1; i >= 0; i--) {
        const p = pending[i]
        const remaining = p.triggerAt - now
        if (remaining <= 0) {
          explodeAt(p.x, p.y, p.z); pending.splice(i, 1)
        } else {
          const visual = visuals.get(wKey(p.x, p.y, p.z))
          if (visual) {
            const freq  = remaining > 1500 ? 300 : remaining > 700 ? 150 : 60
            const flash = Math.sin(now / freq) > 0
            visual.scale.setScalar(flash ? 1.12 : 0.95)
            visual.rotation.y = now / 200
          }
        }
      }

      // Camera shake
      if (now < shakeEnd) {
        const s = 0.18 * (shakeEnd - now) / 700
        cam.position.x += (Math.random() - 0.5) * s
        cam.position.y += (Math.random() - 0.5) * s
      }

      const armBobY = isWalking ? Math.sin(walkTime)       * 0.07 : 0
      const armBobX = isWalking ? Math.sin(walkTime * 0.5) * 0.04 : 0
      armGroup.position.set(2.1 + armBobX, -1.38 + armBobY, -1.6)
      armGroup.rotation.z = 0.08 + (isWalking ? Math.sin(walkTime * 0.5) * 0.06 : 0)

      renderer.clear()
      renderer.render(scene, cam)
      renderer.clearDepth()
      renderer.render(hudScene, hudCam)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener("pointerlockchange", onLockChange)
      document.removeEventListener("mousemove",   onMouseMove)
      document.removeEventListener("mousedown",   onMouseDown)
      document.removeEventListener("contextmenu", onContextMenu)
      document.removeEventListener("keydown",     onKeyDown)
      document.removeEventListener("keyup",       onKeyUp)
      document.removeEventListener("wheel",       onWheel as EventListener)
      window.removeEventListener("resize",        onResize)
      if (document.pointerLockElement === renderer.domElement) document.exitPointerLock()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      world.clear(); visuals.clear(); boundsMap.clear(); placeable.length = 0
      doorRoots.clear(); doorStates.clear(); doorAnims.clear()
    }
  }, [])

  return (
    <div className="fixed inset-0 md:left-44 lg:left-56 z-40 overflow-hidden select-none bg-[#5C8AC0]">
      <div ref={mountRef} className="w-full h-full" />

      {/* Crosshair */}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-5 h-5">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-white mix-blend-difference" />
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-white mix-blend-difference" />
          </div>
        </div>
      )}

      {/* Start / pause overlay */}
      {!locked && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 backdrop-blur-sm cursor-pointer"
          onClick={() => requestLockRef.current()}
        >
          <div className="text-center space-y-5 pointer-events-none">
            <div className="text-[11px] font-mono text-foreground-icons space-y-1.5 leading-relaxed">
              <div><span className="text-foreground-secondary">W A S D</span>  —  {t.move}</div>
              <div><span className="text-foreground-secondary">Space</span>  —  {t.jump}</div>
              <div><span className="text-foreground-secondary">Right click</span>  —  {t.place}</div>
              <div><span className="text-foreground-secondary">Left click</span>  —  {t.remove}</div>
              <div><span className="text-foreground-secondary">1–9  /  scroll</span>  —  {t.select}</div>
              <div><span className="text-foreground-secondary">ESC</span>  —  {t.pause}</div>
            </div>
            <div className="flex flex-col items-center gap-3 pt-1" onClick={e => e.stopPropagation()}>
              <button
                className="text-xs font-mono text-red-400 border border-red-400/50 px-5 py-2 hover:bg-red-400/10 transition-colors pointer-events-auto"
                onClick={() => resetRef.current()}
              >
                {t.reset}
              </button>
            </div>
            <motion.div
              className="text-xs font-mono text-foreground-icons border border-border px-5 py-2 inline-block pointer-events-none"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              {t.clickPlay}
            </motion.div>
          </div>
        </div>
      )}

      {/* Back */}
      <div className="absolute top-3 left-3 z-50">
        <Link href="/" onClick={() => document.exitPointerLock()}
          className="text-[10px] font-mono text-foreground-icons hover:text-foreground-secondary transition-colors px-2 py-1 border border-border bg-background/80 backdrop-blur-sm"
        >
          {t.back}
        </Link>
      </div>

      {/* Hotbar */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5 p-1 bg-black/70 border border-border backdrop-blur-sm transition-opacity duration-300 ${locked ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {BLOCK_DEFS.map((b) => { const { id, emoji, key } = b; return (
          <div key={id} className={`relative w-11 h-12 flex flex-col items-center justify-center gap-0.5 text-[9px] font-mono transition-all
            ${selected === id ? "bg-white/20 text-foreground-principal border-2 border-white/70" : "text-foreground-secondary border border-border/60"}`}>
            <span className="absolute top-0.5 right-0.5 text-[8px] text-foreground-icons opacity-50">{key}</span>
            <span className="text-base leading-none">{emoji}</span>
            <span>{label(b)}</span>
          </div>
        )})}
      </div>

      {locked && (
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-foreground-icons">{count} {t.placed}</div>
      )}
    </div>
  )
}
