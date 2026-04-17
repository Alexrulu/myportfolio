"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import Link from "next/link"
import { motion } from "motion/react"

// ── Types ────────────────────────────────────────────────────────────────────

type BlockType = "grass" | "wood" | "log" | "door" | "glass" | "monitor" | "desk" | "coffee" | "bug"

const BLOCK_DEFS: { id: BlockType; label: string; emoji: string; key: string }[] = [
  { id: "grass",   label: "Grass",   emoji: "🌿", key: "1" },
  { id: "wood",    label: "Madera",  emoji: "🪵", key: "2" },
  { id: "log",     label: "Tronco",  emoji: "🌲", key: "3" },
  { id: "door",    label: "Puerta",  emoji: "🚪", key: "4" },
  { id: "glass",   label: "Vidrio",  emoji: "🪟", key: "5" },
  { id: "monitor", label: "Monitor", emoji: "🖥️", key: "6" },
  { id: "desk",    label: "Mesa",    emoji: "🪑", key: "7" },
  { id: "coffee",  label: "Café",    emoji: "☕", key: "8" },
  { id: "bug",     label: "Bug 💥",  emoji: "🐛", key: "9" },
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

function grassTop()  { return noisy(["#5A8C3C","#4A7230","#6CA845","#528534","#4F7B2F"], 0) }
function dirtTex()   { return noisy(["#8B5E3C","#7A4E2C","#9A6E4C","#6B3E1C","#A07040"], 2) }
function metalTex()  { return noisy(["#2A2A3A","#252535","#303045","#1E1E2E","#282838"], 10) }

function grassSide(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const v = hn(x, y, 1)
      ctx.fillStyle = y < 3
        ? (["#5A8C3C","#4A7230","#6CA845"])[Math.floor(v * 3)]
        : (["#8B5E3C","#7A4E2C","#9A6E4C","#6B3E1C"])[Math.floor(v * 4)]
      ctx.fillRect(x, y, 1, 1)
    }
  return toTex(c)
}
function woodSide(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const v = (hn(x, y, 4) + hn(x, 0, 4) * 0.3) % 1
      ctx.fillStyle = (["#8B6340","#7A5230","#9A7450","#6B4220","#A07855"])[Math.floor(v * 5)]
      ctx.fillRect(x, y, 1, 1)
    }
  return toTex(c)
}
function woodTop(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      ctx.fillStyle = Math.floor(Math.sqrt((x-7.5)**2+(y-7.5)**2)) % 2 === 0 ? "#8B6340" : "#7A5230"
      ctx.fillRect(x, y, 1, 1)
    }
  return toTex(c)
}
function logSide(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      ctx.fillStyle = (["#5C3A1E","#6B4420","#4A2A10","#7A5030"])[Math.floor(hn(x, y, 20) * 4)]
      ctx.fillRect(x, y, 1, 1)
    }
  ctx.fillStyle = "rgba(0,0,0,0.3)"
  for (let x = 3; x < 16; x += 4) ctx.fillRect(x, 0, 1, 16)
  return toTex(c)
}
function logTop(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const d = Math.sqrt((x-7.5)**2+(y-7.5)**2)
      ctx.fillStyle = Math.floor(d * 0.75) % 2 === 0 ? "#6B4420" : "#5A3318"
      ctx.fillRect(x, y, 1, 1)
    }
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
  ctx.clearRect(0,0,16,16)
  ctx.fillStyle = "rgba(190,225,255,0.35)"
  ctx.fillRect(2,2,5,5); ctx.fillRect(9,2,5,5); ctx.fillRect(2,9,5,5); ctx.fillRect(9,9,5,5)
  ctx.fillStyle = "#CCDDEEBB"
  ctx.fillRect(0,0,16,2); ctx.fillRect(0,14,16,2); ctx.fillRect(0,0,2,16); ctx.fillRect(14,0,2,16)
  ctx.fillRect(7,0,2,16); ctx.fillRect(0,7,16,2)
  ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.fillRect(3,3,2,1); ctx.fillRect(10,3,2,1)
  return toTex(c)
}
function deskTop(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      ctx.fillStyle = (["#C0A060","#B09050","#D0B070","#A88040"])[Math.floor(hn(x, y, 30) * 4)]
      ctx.fillRect(x, y, 1, 1)
    }
  ctx.fillStyle = "#777777"; ctx.fillRect(3,5,10,6)
  ctx.fillStyle = "#555555"
  for (let kx = 0; kx < 5; kx++) { ctx.fillRect(4+kx*2,6,1,1); ctx.fillRect(4+kx*2,8,1,1) }
  ctx.fillRect(5,10,6,1)
  return toTex(c)
}
function deskSide(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  ctx.fillStyle = "#8B6340"; ctx.fillRect(0,0,16,16)
  ctx.fillStyle = "#5C3818"; ctx.fillRect(0,0,3,16); ctx.fillRect(13,0,3,16)
  ctx.fillStyle = "#A07850"; ctx.fillRect(0,0,16,3)
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
function bugTex(): THREE.CanvasTexture {
  const [c, ctx] = px16()
  ctx.fillStyle = "#0D0608"; ctx.fillRect(0, 0, 16, 16)
  ctx.fillStyle = "#CC2222"
  ctx.fillRect(1, 5, 4, 5); ctx.fillRect(5, 4, 3, 6); ctx.fillRect(8, 5, 3, 5); ctx.fillRect(11, 6, 3, 3)
  ctx.fillStyle = "#EE5555"
  ctx.fillRect(1, 5, 4, 2); ctx.fillRect(5, 4, 3, 2); ctx.fillRect(8, 5, 3, 2); ctx.fillRect(11, 6, 3, 1)
  ctx.fillStyle = "#881111"
  ctx.fillRect(5, 5, 1, 5); ctx.fillRect(8, 5, 1, 5); ctx.fillRect(11, 6, 1, 3)
  ctx.fillStyle = "#FFFF00"
  ctx.fillRect(2, 6, 1, 1); ctx.fillRect(2, 8, 1, 1)
  ctx.fillStyle = "#AA1111"
  ctx.fillRect(2, 4, 1, 1); ctx.fillRect(4, 3, 1, 1)
  ctx.fillRect(6, 3, 1, 1); ctx.fillRect(9, 3, 1, 1)
  ctx.fillRect(6, 10, 1, 2); ctx.fillRect(9, 10, 1, 2); ctx.fillRect(12, 9, 1, 2)
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
  }
}
function mat(t: THREE.Texture)  { return new THREE.MeshLambertMaterial({ map: t, side: THREE.DoubleSide }) }
function gmat(t: THREE.Texture) { return new THREE.MeshLambertMaterial({ map: t, side: THREE.DoubleSide, transparent: true, alphaTest: 0.05 }) }

// Used for HUD hand-block (always a simple 1×1×1 cube)
function getMaterials(type: BlockType, tx: Textures): THREE.MeshLambertMaterial[] {
  switch (type) {
    case "grass":   return [mat(tx.grassSide),mat(tx.grassSide),mat(tx.grassTop),mat(tx.dirt),mat(tx.grassSide),mat(tx.grassSide)]
    case "wood":    return [mat(tx.woodSide),mat(tx.woodSide),mat(tx.woodTop),mat(tx.woodTop),mat(tx.woodSide),mat(tx.woodSide)]
    case "log":     return [mat(tx.logSide),mat(tx.logSide),mat(tx.logTop),mat(tx.logTop),mat(tx.logSide),mat(tx.logSide)]
    case "door":    return Array(6).fill(null).map(() => mat(tx.doorBot))
    case "glass":   return Array(6).fill(null).map(() => new THREE.MeshLambertMaterial({ map: tx.glass, side: THREE.DoubleSide, transparent: true, opacity: 0.55 }))
    case "monitor": return [mat(tx.metal),mat(tx.metal),mat(tx.metal),mat(tx.metal),mat(tx.monitorFront),mat(tx.metal)]
    case "desk":    return [mat(tx.deskSide),mat(tx.deskSide),mat(tx.deskTop),mat(tx.deskSide),mat(tx.deskSide),mat(tx.deskSide)]
    case "coffee":  return [mat(tx.coffeeSide),mat(tx.coffeeSide),mat(tx.coffeeTop),mat(tx.coffeeSide),mat(tx.coffeeSide),mat(tx.coffeeSide)]
    case "bug":     return Array(6).fill(null).map(() => mat(tx.bug))
  }
}

// ── Custom visual shapes ──────────────────────────────────────────────────────
// facing: door rotation around Y to face the player (snapped to 90° increments)

function createVisual(type: BlockType, tx: Textures, facing = 0): THREE.Object3D {
  switch (type) {

    case "grass":
    case "wood":
    case "log":
    case "bug":
      return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), getMaterials(type, tx))

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

    case "glass":
      return new THREE.Mesh(
        new THREE.BoxGeometry(0.92, 0.92, 0.08),
        new THREE.MeshLambertMaterial({ map: tx.glass, side: THREE.DoubleSide, transparent: true, opacity: 0.42, alphaTest: 0.01 })
      )

    case "monitor": {
      const g = new THREE.Group()
      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.82, 0.56, 0.07),
        [mat(tx.metal),mat(tx.metal),mat(tx.metal),mat(tx.metal),mat(tx.monitorFront),mat(tx.metal)]
      )
      screen.position.set(0, 0.1, 0); g.add(screen)
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.06), mat(tx.metal))
      stand.position.set(0, -0.22, 0); g.add(stand)
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.04, 0.26), mat(tx.metal))
      base.position.set(0, -0.34, 0); g.add(base)
      return g
    }

    case "desk": {
      const g = new THREE.Group()
      const top = new THREE.Mesh(
        new THREE.BoxGeometry(0.95, 0.08, 0.95),
        [mat(tx.deskSide),mat(tx.deskSide),mat(tx.deskTop),mat(tx.deskSide),mat(tx.deskSide),mat(tx.deskSide)]
      )
      top.position.set(0, 0.3, 0); g.add(top)
      const legGeo = new THREE.BoxGeometry(0.07, 0.7, 0.07)
      const legMat = mat(tx.deskSide)
      ;([[0.42,0.42],[0.42,-0.42],[-0.42,0.42],[-0.42,-0.42]] as [number,number][]).forEach(([lx,lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat)
        leg.position.set(lx, -0.09, lz); g.add(leg)
      })
      return g
    }

    case "coffee": {
      const g = new THREE.Group()
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.42, 0.32),
        [mat(tx.coffeeSide),mat(tx.coffeeSide),mat(tx.coffeeTop),mat(tx.coffeeSide),mat(tx.coffeeSide),mat(tx.coffeeSide)]
      )
      body.position.set(0, -0.15, 0); g.add(body)
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.04), mat(tx.coffeeSide))
      handle.position.set(0.2, -0.15, 0); g.add(handle)
      return g
    }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BuildGame() {
  const mountRef       = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<BlockType>("grass")
  const [count, setCount]       = useState(0)
  const [locked, setLocked]     = useState(false)

  const selectedRef    = useRef<BlockType>("grass")
  const requestLockRef = useRef<() => void>(() => {})
  const updateHandRef  = useRef<((t: BlockType) => void) | null>(null)
  const worldRef       = useRef(new Map<string, BlockType>())
  const visualsRef     = useRef(new Map<string, THREE.Object3D>())

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current
    const W = container.clientWidth, H = container.clientHeight

    // ── Scene ──
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#5C8AC0")
    scene.fog = new THREE.Fog("#7AABD8", 18, 35)

    const cam = new THREE.PerspectiveCamera(75, W / H, 0.05, 100)

    const renderer = new THREE.WebGLRenderer({ antialias: false })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.autoClear = false
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight("#c8dff5", 0.7))
    const sun = new THREE.DirectionalLight("#fff8e0", 1.0)
    sun.position.set(12, 20, 8); sun.castShadow = true; scene.add(sun)

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
        visual.userData = { key: k, x, y, z, baseY: y }
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
      visual.userData = { key: k, x, y, z, baseY: y }
      if (animate) visual.userData.animStart = Date.now()
      visual.traverse(child => {
        if (child instanceof THREE.Mesh) { child.castShadow = child.receiveShadow = true }
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

    // Build floor
    for (let x = 0; x < 16; x++)
      for (let z = 0; z < 16; z++)
        addBlock(x, 0, z, "grass")

    const highlight = new THREE.Mesh(
      new THREE.BoxGeometry(1.03, 1.03, 1.03),
      new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true, opacity: 0.45 })
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
    }
    document.addEventListener("pointerlockchange", onLockChange)
    requestLockRef.current = () => renderer.domElement.requestPointerLock()
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
          if (by >= 0 && !playerOverlaps(bx, by, bz)) {
            const facing = Math.round(yaw / (Math.PI / 2)) * (Math.PI / 2)
            addBlock(bx, by, bz, selectedRef.current, true, facing)
            setCount(c => c + 1)
            if (selectedRef.current === "bug") pending.push({ x: bx, y: by, z: bz, triggerAt: Date.now() + 2500 })
          }
        }
      } else if (e.button === 0 && hit) {
        const { x, y, z } = hit.object.userData
        if (y > 0) removeBlock(x, y, z)
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
            <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-white mix-blend-difference" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white mix-blend-difference" />
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
            <div className="text-2xl font-mono text-foreground-principal tracking-[0.3em]">BUILD BATTLE</div>
            <div className="text-[11px] font-mono text-foreground-icons space-y-1.5 leading-relaxed">
              <div><span className="text-foreground-secondary">W A S D</span>  —  move</div>
              <div><span className="text-foreground-secondary">Space</span>  —  jump</div>
              <div><span className="text-foreground-secondary">Right click</span>  —  place / open door</div>
              <div><span className="text-foreground-secondary">Left click</span>  —  remove block</div>
              <div><span className="text-foreground-secondary">1–9  /  scroll</span>  —  select block</div>
              <div><span className="text-foreground-secondary">ESC</span>  —  pause</div>
            </div>
            <motion.div
              className="text-xs font-mono text-foreground-icons border border-border px-5 py-2 inline-block"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              click to play
            </motion.div>
          </div>
        </div>
      )}

      {/* Back */}
      <div className="absolute top-3 left-3 z-50">
        <Link href="/" onClick={() => document.exitPointerLock()}
          className="text-[10px] font-mono text-foreground-icons hover:text-foreground-secondary transition-colors px-2 py-1 border border-border bg-background/80 backdrop-blur-sm"
        >
          ← back
        </Link>
      </div>

      {/* Hotbar */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5 p-1 bg-black/70 border border-border backdrop-blur-sm transition-opacity duration-300 ${locked ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {BLOCK_DEFS.map(({ id, label, emoji, key }) => (
          <div key={id} className={`relative w-11 h-12 flex flex-col items-center justify-center gap-0.5 text-[9px] font-mono transition-all
            ${selected === id ? "bg-white/20 text-foreground-principal border-2 border-white/70" : "text-foreground-secondary border border-border/60"}`}>
            <span className="absolute top-0.5 right-0.5 text-[8px] text-foreground-icons opacity-50">{key}</span>
            <span className="text-base leading-none">{emoji}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {locked && (
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-foreground-icons">{count} placed</div>
      )}
    </div>
  )
}
