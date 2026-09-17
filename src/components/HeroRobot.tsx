// import {
//   useRef,
//   useEffect,
//   useState,
//   useCallback,
//   type CSSProperties,
//   type KeyboardEvent as ReactKeyboardEvent,
//   type PointerEvent as ReactPointerEvent,
//   type MutableRefObject,
//   type RefObject,
// } from 'react'
// import { gsap } from 'gsap'

// type HeroRobotProps = { heroRef: RefObject<HTMLElement | null> }
// type Particle = { id: number; x: number; y: number; rot: number; hue: number }
// export type HeroBotFace = 'normal' | 'hit' | 'combo'
// type AimRef = MutableRefObject<{ x: number; y: number }>
// type SvgRobotRefs = {
//   floatRef: MutableRefObject<SVGGElement | null>
//   shadowRef: MutableRefObject<SVGEllipseElement | null>
//   chestRef: MutableRefObject<SVGCircleElement | null>
//   orbRef: MutableRefObject<SVGCircleElement | null>
//   neckRef: MutableRefObject<SVGGElement | null>
//   headRef: MutableRefObject<SVGGElement | null>
//   pupilsRef: MutableRefObject<SVGGElement | null>
// }

// const BONK_LINES = ['BONK!', 'WHACK!', 'TAGGED!', 'POW!', 'ZAP!', 'NICE!', 'HEY!!', 'OOF!']
// const COMBO_LINES = ['COMBO', 'DOUBLE!', 'TRIPLE!!', 'ON FIRE!', 'UNSTOPPABLE!', 'LEGENDARY!']
// const LOOK = { yawMaxDeg: 18, pitchMaxDeg: 10, pitchSign: 1, pupilRangeX: 7.1, pupilRangeY: 4.8, smooth: 0.2 } as const
// const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
// const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// function useSvgRobotMotion(aimRef: AimRef, reducedMotion: boolean, bonkImpulseRef: MutableRefObject<number>, bundleRef: MutableRefObject<SvgRobotRefs>) {
//   const tRef = useRef(0)
//   const aimSmoothed = useRef({ x: 0, y: 0 })

//   useEffect(() => {
//     const rafRef = { id: 0 }
//     let cancelled = false
//     let last = performance.now()

//     const tick = (now: number) => {
//       if (cancelled) return
//       const delta = Math.min(0.05, (now - last) / 1000)
//       last = now
//       tRef.current += delta

//       const t = tRef.current
//       const tx = clamp(aimRef.current.x, -1, 1)
//       const ty = clamp(aimRef.current.y, -1, 1)
//       let bonk = bonkImpulseRef.current
//       bonk *= Math.pow(0.9, delta * 55)
//       bonkImpulseRef.current = bonk

//       const wobble = bonk * Math.sin(now * 0.001 * 38)
//       const s = reducedMotion ? 1 : LOOK.smooth
//       aimSmoothed.current.x = lerp(aimSmoothed.current.x, tx, s)
//       aimSmoothed.current.y = lerp(aimSmoothed.current.y, ty, s)

//       const ax = aimSmoothed.current.x
//       const ay = aimSmoothed.current.y
//       const yawDeg = ax * LOOK.yawMaxDeg + wobble * 7
//       const pitchDeg = LOOK.pitchSign * ay * LOOK.pitchMaxDeg + bonk * 6 * Math.sin(now * 0.001 * 28)
//       const swayX = reducedMotion ? 0 : Math.sin(t * 0.62) * 4 + ax * 4.2
//       const floatY = reducedMotion ? 0 : Math.sin(t * 0.85) * 5 + Math.cos(t * 1.45) * 1.4
//       const rollDeg = reducedMotion ? ax * 0.8 : ax * 3.8 + Math.sin(t * 0.72) * 2.1 + wobble * 4
//       const punch = bonk * 0.12
//       const scale = 1 - punch + (reducedMotion ? 0 : Math.sin(t * 5.4) * 0.012) + Math.sin(t * 24) * bonk * 0.03
//       const { floatRef, shadowRef, chestRef, orbRef, neckRef, headRef, pupilsRef } = bundleRef.current

//       if (floatRef.current) floatRef.current.setAttribute('transform', `translate(${swayX}, ${-6 + floatY}) rotate(${rollDeg}) scale(${scale})`)
//       if (neckRef.current) neckRef.current.setAttribute('transform', `rotate(${yawDeg})`)
//       if (headRef.current) headRef.current.setAttribute('transform', `rotate(${pitchDeg})`)
//       if (pupilsRef.current) pupilsRef.current.setAttribute('transform', `translate(${ax * LOOK.pupilRangeX}, ${ay * LOOK.pupilRangeY})`)

//       const pulse = 0.75 + Math.sin(t * 2.2) * 0.25
//       if (shadowRef.current) {
//         shadowRef.current.setAttribute('rx', String(clamp(92 + floatY * 2.2 - bonk * 6, 78, 104)))
//         shadowRef.current.setAttribute('ry', String(clamp(14 + floatY * 0.18 - bonk * 0.45, 11.5, 17)))
//         shadowRef.current.setAttribute('opacity', String(clamp(0.18 + floatY * 0.012 + bonk * 0.04, 0.08, 0.24)))
//       }
//       if (chestRef.current) {
//         chestRef.current.setAttribute('r', String(6.8 + pulse * 1.25 + bonk * 1.9))
//         chestRef.current.setAttribute('opacity', String(clamp((0.55 + bonk * 0.8) * pulse, 0.35, 1)))
//       }
//       if (orbRef.current) {
//         orbRef.current.setAttribute('r', String(10.2 + pulse * 0.95 + bonk * 1.4))
//         orbRef.current.setAttribute('opacity', String(clamp(0.75 + bonk * 1.2 + Math.sin(t * 3) * 0.15, 0.4, 1)))
//       }

//       rafRef.id = requestAnimationFrame(tick)
//     }

//     rafRef.id = requestAnimationFrame(tick)
//     return () => {
//       cancelled = true
//       cancelAnimationFrame(rafRef.id)
//     }
//   }, [aimRef, bonkImpulseRef, reducedMotion, bundleRef])
// }

// function RobotSvg({
//   floatRef,
//   shadowRef,
//   chestRef,
//   orbRef,
//   neckRef,
//   headRef,
//   pupilsRef,
//   faceMode,
// }: {
//   floatRef: MutableRefObject<SVGGElement | null>
//   shadowRef: MutableRefObject<SVGEllipseElement | null>
//   chestRef: MutableRefObject<SVGCircleElement | null>
//   orbRef: MutableRefObject<SVGCircleElement | null>
//   neckRef: MutableRefObject<SVGGElement | null>
//   headRef: MutableRefObject<SVGGElement | null>
//   pupilsRef: MutableRefObject<SVGGElement | null>
//   faceMode: HeroBotFace
// }) {
//   return (
//     <svg className={`hero-robot-svg hero-robot-svg--face-${faceMode}`} viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" data-face={faceMode} aria-hidden="true">
//       <defs>
//         <linearGradient id="heroBot-headShell" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="#556177" />
//           <stop offset="55%" stopColor="#3b4557" />
//           <stop offset="100%" stopColor="#242d3b" />
//         </linearGradient>
//         <linearGradient id="heroBot-bodyShell" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="#46546b" />
//           <stop offset="60%" stopColor="#2e374a" />
//           <stop offset="100%" stopColor="#252d3c" />
//         </linearGradient>
//         <linearGradient id="heroBot-accentBar" x1="0%" y1="0%" x2="100%" y2="0%">
//           <stop offset="0%" stopColor="#7efff2" />
//           <stop offset="50%" stopColor="#55e1d6" />
//           <stop offset="100%" stopColor="#6de6ff" />
//         </linearGradient>
//         <linearGradient id="heroBot-visor" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="#0b1117" />
//           <stop offset="55%" stopColor="#0d1e28" />
//           <stop offset="100%" stopColor="#071017" />
//         </linearGradient>
//         <linearGradient id="heroBot-visorGlow" x1="0%" y1="0%" x2="0%" y2="100%">
//           <stop offset="0%" stopColor="#dbfffb" stopOpacity="0.44" />
//           <stop offset="55%" stopColor="#84fff0" stopOpacity="0.08" />
//           <stop offset="100%" stopColor="#84fff0" stopOpacity="0" />
//         </linearGradient>
//         <radialGradient id="heroBot-core" cx="50%" cy="45%" r="55%">
//           <stop offset="0%" stopColor="#f8fffe" />
//           <stop offset="45%" stopColor="#92fff2" />
//           <stop offset="100%" stopColor="#3dcfbe" />
//         </radialGradient>
//         <radialGradient id="heroBot-ambient" cx="50%" cy="50%" r="50%">
//           <stop offset="0%" stopColor="#9efff5" stopOpacity="0.95" />
//           <stop offset="55%" stopColor="#5ce2d4" stopOpacity="0.34" />
//           <stop offset="100%" stopColor="#5ce2d4" stopOpacity="0" />
//         </radialGradient>
//         <filter id="heroBot-soft" x="-20%" y="-20%" width="140%" height="140%">
//           <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="b" />
//           <feMerge>
//             <feMergeNode in="b" />
//             <feMergeNode in="SourceGraphic" />
//           </feMerge>
//         </filter>
//         <filter id="heroBot-glow" x="-40%" y="-40%" width="180%" height="180%">
//           <feGaussianBlur stdDeviation="4" />
//         </filter>
//         <filter id="heroBot-bigGlow" x="-60%" y="-60%" width="220%" height="220%">
//           <feGaussianBlur stdDeviation="12" />
//         </filter>
//         <filter id="heroBot-shadow" x="-50%" y="-120%" width="200%" height="300%">
//           <feGaussianBlur stdDeviation="7" />
//         </filter>
//         <clipPath id="heroBot-visorClip">
//           <rect x="84" y="98" width="132" height="82" rx="28" />
//         </clipPath>
//       </defs>

//       <g ref={floatRef} transform="translate(0, 0)">
//         <ellipse cx="152" cy="154" rx="108" ry="92" fill="url(#heroBot-ambient)" opacity="0.3" filter="url(#heroBot-bigGlow)" />
//         <ellipse ref={shadowRef} cx="150" cy="312" rx="92" ry="14" fill="#59e4d2" opacity="0.2" filter="url(#heroBot-shadow)" />

//         <path
//           d="M84 202h132c29 0 49 20 49 49v23c0 24-20 44-49 44H84c-29 0-49-20-49-44v-23c0-29 20-49 49-49Z"
//           fill="url(#heroBot-bodyShell)"
//           stroke="#9cfff4"
//           strokeOpacity="0.16"
//           strokeWidth="1.2"
//         />
//         <rect x="84" y="190" width="132" height="18" rx="9" fill="url(#heroBot-accentBar)" opacity="0.9" />
//         <rect x="62" y="223" width="18" height="52" rx="8" fill="#24303d" />
//         <rect x="220" y="223" width="18" height="52" rx="8" fill="#24303d" />
//         <rect x="48" y="240" width="28" height="12" rx="6" fill="#59e1d2" opacity="0.86" />
//         <rect x="224" y="240" width="28" height="12" rx="6" fill="#59e1d2" opacity="0.86" />
//         <path d="M98 233Q150 213 202 233" fill="none" stroke="#7ff9ec" strokeOpacity="0.18" strokeWidth="4" strokeLinecap="round" />
//         <rect x="96" y="252" width="108" height="24" rx="12" fill="#24303d" opacity="0.78" />
//         <circle cx="150" cy="246" r="24" fill="url(#heroBot-ambient)" opacity="0.2" filter="url(#heroBot-glow)" />
//         <circle cx="150" cy="246" r="17" fill="#2e4250" stroke="#63ebdc" strokeOpacity="0.5" strokeWidth="2" />
//         <circle cx="150" cy="246" r="10.5" fill="#41586a" stroke="#7cfcef" strokeOpacity="0.55" strokeWidth="1.4" />
//         <circle ref={chestRef} cx="150" cy="246" r="7" fill="url(#heroBot-core)" opacity="0.9" filter="url(#heroBot-soft)" />
//         <circle cx="150" cy="246" r="3.4" fill="#f8fffe" opacity="0.9" />

//         <g transform="translate(150, 192)">
//           <g ref={neckRef}>
//             <g transform="translate(-150, -192)">
//               <ellipse cx="150" cy="188" rx="24" ry="10" fill="#22313d" />
//               <path d="M132 160h36c6 0 12 5 12 12v18c0 6-6 12-12 12h-36c-6 0-12-6-12-12v-18c0-7 6-12 12-12Z" fill="#2d3949" stroke="#1c2631" strokeWidth="1.2" />
//               <circle cx="150" cy="181" r="8.5" fill="#8ffff4" opacity="0.22" filter="url(#heroBot-soft)" />

//               <g transform="translate(150, 162)">
//                 <g ref={headRef}>
//                   <g transform="translate(-150, -162)">
//                     <ellipse cx="150" cy="136" rx="106" ry="82" fill="url(#heroBot-ambient)" opacity="0.18" filter="url(#heroBot-bigGlow)" />
//                     <rect x="60" y="108" width="18" height="52" rx="8" fill="#26313e" />
//                     <rect x="222" y="108" width="18" height="52" rx="8" fill="#26313e" />
//                     <rect x="54" y="120" width="12" height="28" rx="6" fill="#10161f" opacity="0.6" />
//                     <rect x="234" y="120" width="12" height="28" rx="6" fill="#10161f" opacity="0.6" />
//                     <rect x="52" y="58" width="196" height="128" rx="42" fill="url(#heroBot-headShell)" stroke="#9ffff4" strokeOpacity="0.14" strokeWidth="1.2" />
//                     <path d="M75 70h150c9 0 17 6 20 14H55c3-8 11-14 20-14Z" fill="#dffffb" opacity="0.14" />
//                     <rect x="68" y="48" width="164" height="18" rx="9" fill="url(#heroBot-accentBar)" opacity="0.92" />
//                     <rect x="84" y="98" width="132" height="82" rx="28" fill="url(#heroBot-visor)" />
//                     <rect x="82" y="96" width="136" height="86" rx="30" fill="none" stroke="#7efdf0" strokeOpacity="0.28" strokeWidth="2.2" />
//                     <g clipPath="url(#heroBot-visorClip)">
//                       <path d="M88 102c24-17 82-20 125-6v14c-42-10-97-5-125 13Z" fill="url(#heroBot-visorGlow)" />
//                       <rect className="hero-bot-visor-scan" x="98" y="104" width="102" height="8" rx="4" fill="#97fff4" opacity="0.5" />
//                       <ellipse cx="150" cy="184" rx="58" ry="16" fill="#77fff0" opacity="0.08" />
//                     </g>
//                     <ellipse cx="104" cy="156" rx="14" ry="9" fill="#8ffff4" opacity="0.11" />
//                     <ellipse cx="196" cy="156" rx="14" ry="9" fill="#8ffff4" opacity="0.11" />
//                     <rect className="hero-bot-visor-flash" x="84" y="98" width="132" height="82" rx="28" fill="#ff7a7a" opacity={faceMode === 'hit' ? 0.48 : faceMode === 'combo' ? 0.18 : 0} style={{ transition: 'opacity 0.07s ease-out' }} />
//                     <g className="hero-bot-combo-stars" opacity={faceMode === 'combo' ? 1 : 0} style={{ transition: 'opacity 0.12s ease' }}>
//                       <path d="M56 82l2.8 6 6.4 0.9-4.6 4.5 1.1 6.5-5.7-3-5.7 3 1.1-6.5-4.6-4.5 6.4-0.9z" fill="#ffe08a" stroke="#ffb020" strokeWidth="0.7" />
//                       <path d="M244 82l2.8 6 6.4 0.9-4.6 4.5 1.1 6.5-5.7-3-5.7 3 1.1-6.5-4.6-4.5 6.4-0.9z" fill="#ffe08a" stroke="#ffb020" strokeWidth="0.7" />
//                     </g>
//                     <g opacity={faceMode === 'normal' ? 1 : 0} style={{ transition: 'opacity 0.06s linear' }}>
//                       <path d="M96 110c8-9 23-9 31 0" fill="none" stroke="#d9fff9" strokeOpacity="0.26" strokeWidth="2.2" strokeLinecap="round" />
//                       <path d="M173 110c8-9 23-9 31 0" fill="none" stroke="#d9fff9" strokeOpacity="0.26" strokeWidth="2.2" strokeLinecap="round" />
//                       <ellipse cx="118" cy="133" rx="23" ry="24" fill="#f8fffe" />
//                       <ellipse cx="182" cy="133" rx="23" ry="24" fill="#f8fffe" />
//                       <g ref={pupilsRef}>
//                         <circle cx="118" cy="133" r="10.2" fill="#59e2d4" />
//                         <circle cx="182" cy="133" r="10.2" fill="#59e2d4" />
//                         <circle cx="118" cy="133" r="5.2" fill="#081117" />
//                         <circle cx="182" cy="133" r="5.2" fill="#081117" />
//                         <circle cx="122" cy="128" r="2.5" fill="#ffffff" opacity="0.95" />
//                         <circle cx="186" cy="128" r="2.5" fill="#ffffff" opacity="0.95" />
//                       </g>
//                       <circle cx="107" cy="160" r="4.5" fill="#8dfff2" opacity="0.78" />
//                       <circle cx="193" cy="160" r="4.5" fill="#8dfff2" opacity="0.78" />
//                       <path d="M128 159Q150 177 172 156" fill="none" stroke="#7efced" strokeWidth="5" strokeLinecap="round" />
//                       <path d="M138 162Q150 168 162 161" fill="none" stroke="#7efced" strokeOpacity="0.35" strokeWidth="2.4" strokeLinecap="round" />
//                     </g>
//                     <g opacity={faceMode === 'hit' ? 1 : 0} style={{ transition: 'opacity 0.04s linear' }}>
//                       <path d="M103 116 L133 146 M133 116 L103 146" stroke="#f8fffe" strokeWidth="4.4" strokeLinecap="round" />
//                       <path d="M167 116 L197 146 M197 116 L167 146" stroke="#f8fffe" strokeWidth="4.4" strokeLinecap="round" />
//                       <path d="M96 108Q118 94 140 109" fill="none" stroke="#24303d" strokeWidth="3.2" strokeLinecap="round" />
//                       <path d="M160 109Q182 94 204 108" fill="none" stroke="#24303d" strokeWidth="3.2" strokeLinecap="round" />
//                       <path d="M133 166q6-7 11 0t11 0" fill="none" stroke="#f8fffe" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
//                     </g>
//                     <g opacity={faceMode === 'combo' ? 1 : 0} style={{ transition: 'opacity 0.08s ease' }}>
//                       <ellipse cx="118" cy="133" rx="23" ry="24" fill="#f8fffe" />
//                       <ellipse cx="182" cy="133" rx="23" ry="24" fill="#f8fffe" />
//                       <circle cx="118" cy="133" r="11.5" fill="none" stroke="#59e2d4" strokeWidth="2" opacity="0.95" />
//                       <circle cx="118" cy="133" r="6.4" fill="none" stroke="#59e2d4" strokeWidth="1.3" opacity="0.7" />
//                       <circle cx="182" cy="133" r="11.5" fill="none" stroke="#59e2d4" strokeWidth="2" opacity="0.95" />
//                       <circle cx="182" cy="133" r="6.4" fill="none" stroke="#59e2d4" strokeWidth="1.3" opacity="0.7" />
//                       <circle cx="118" cy="133" r="2.8" fill="#081117" />
//                       <circle cx="182" cy="133" r="2.8" fill="#081117" />
//                       <path d="M143 165h14" fill="none" stroke="#ffe08a" strokeWidth="3.4" strokeLinecap="round" />
//                     </g>
//                     <line x1="150" y1="58" x2="150" y2="32" stroke="#29313e" strokeWidth="5" strokeLinecap="round" />
//                     <circle cx="150" cy="37" r="4.5" fill="#23313a" />
//                     <circle ref={orbRef} className="hero-bot-antenna-tip" cx="150" cy="24" r="10.2" fill="#8cf5e4" stroke="#52d7c3" strokeWidth="2" opacity="0.95" />
//                     <circle className="hero-bot-antenna-ring" cx="150" cy="24" r="16" fill="none" stroke="#91fff2" strokeOpacity="0.42" strokeWidth="1.3" />
//                   </g>
//                 </g>
//               </g>
//             </g>
//           </g>
//         </g>
//       </g>
//     </svg>
//   )
// }

// export function HeroRobot({ heroRef }: HeroRobotProps) {
//   const wrapRef = useRef<HTMLDivElement>(null)
//   const hitboxRef = useRef<HTMLDivElement>(null)
//   const tiltRef = useRef<HTMLDivElement>(null)
//   const aimRef = useRef({ x: 0, y: 0 })
//   const bonkImpulseRef = useRef(0)
//   const floatRef = useRef<SVGGElement>(null)
//   const shadowRef = useRef<SVGEllipseElement>(null)
//   const chestRef = useRef<SVGCircleElement>(null)
//   const orbRef = useRef<SVGCircleElement>(null)
//   const neckRef = useRef<SVGGElement>(null)
//   const headRef = useRef<SVGGElement>(null)
//   const pupilsRef = useRef<SVGGElement>(null)
//   const lastTapRef = useRef(0)
//   const comboRef = useRef(0)
//   const particleId = useRef(0)
//   const audioCtxRef = useRef<AudioContext | null>(null)
//   const [reducedMotion, setReducedMotion] = useState(false)
//   const [particles, setParticles] = useState<Particle[]>([])
//   const [floater, setFloater] = useState<{ text: string; sub?: string; key: number } | null>(null)
//   const [faceMode, setFaceMode] = useState<HeroBotFace>('normal')
//   const faceTimersRef = useRef<number[]>([])

//   const clearFaceTimers = useCallback(() => {
//     faceTimersRef.current.forEach((id) => window.clearTimeout(id))
//     faceTimersRef.current = []
//   }, [])

//   useEffect(() => () => clearFaceTimers(), [clearFaceTimers])

//   const motionBundleRef = useRef({ floatRef, shadowRef, chestRef, orbRef, neckRef, headRef, pupilsRef })
//   motionBundleRef.current = { floatRef, shadowRef, chestRef, orbRef, neckRef, headRef, pupilsRef }
//   useSvgRobotMotion(aimRef, reducedMotion, bonkImpulseRef, motionBundleRef)

//   useEffect(() => {
//     setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
//   }, [])

//   useEffect(() => {
//     const hero = heroRef.current
//     if (!hero) return
//     if (reducedMotion) {
//       aimRef.current.x = 0
//       aimRef.current.y = 0
//       return
//     }
//     const applyAim = (clientX: number, clientY: number) => {
//       const hb = hitboxRef.current?.getBoundingClientRect()
//       const hr = hero.getBoundingClientRect()
//       const box = hb && hb.width > 8 && hb.height > 8 ? hb : hr
//       const cx = box.left + box.width * 0.5
//       const cy = box.top + box.height * 0.33
//       aimRef.current.x = clamp((clientX - cx) / Math.max(box.width * 0.4, 72), -1, 1)
//       aimRef.current.y = clamp((clientY - cy) / Math.max(box.height * 0.4, 72), -1, 1)
//     }
//     const onPointerMove = (e: PointerEvent) => applyAim(e.clientX, e.clientY)
//     window.addEventListener('pointermove', onPointerMove, { passive: true })
//     const io = new IntersectionObserver((entries) => {
//       const entry = entries[0]
//       if (entry && !entry.isIntersecting) {
//         aimRef.current.x = 0
//         aimRef.current.y = 0
//       }
//     })
//     io.observe(hero)
//     return () => {
//       window.removeEventListener('pointermove', onPointerMove)
//       io.disconnect()
//     }
//   }, [heroRef, reducedMotion])

//   const spawnParticles = useCallback((clientX: number, clientY: number) => {
//     const box = hitboxRef.current?.getBoundingClientRect()
//     if (!box) return
//     const px = ((clientX - box.left) / box.width) * 100
//     const py = ((clientY - box.top) / box.height) * 100
//     const next: Particle[] = Array.from({ length: 10 }, () => {
//       particleId.current += 1
//       return { id: particleId.current, x: px, y: py, rot: Math.random() * 360, hue: 160 + Math.random() * 40 }
//     })
//     setParticles((prev) => [...prev, ...next])
//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         next.forEach((pt) => {
//           const el = document.querySelector(`[data-particle="${pt.id}"]`)
//           if (!el) return
//           gsap.fromTo(el, { scale: 0.2, opacity: 1, x: 0, y: 0, rotation: 0 }, {
//             scale: 1 + Math.random() * 0.6,
//             opacity: 0,
//             x: (Math.random() - 0.5) * 120,
//             y: (Math.random() - 0.5) * 120 - 40,
//             rotation: pt.rot,
//             duration: 0.45 + Math.random() * 0.2,
//             ease: 'power2.out',
//             onComplete: () => setParticles((prev) => prev.filter((item) => item.id !== pt.id)),
//           })
//         })
//       })
//     })
//   }, [])

//   const triggerBonk = useCallback((clientX: number, clientY: number) => {
//     const hb = hitboxRef.current
//     const tilt = tiltRef.current
//     if (!hb || !tilt) return
//     const now = Date.now()
//     comboRef.current = now - lastTapRef.current < 1100 ? comboRef.current + 1 : 1
//     lastTapRef.current = now
//     const combo = comboRef.current
//     const line = BONK_LINES[Math.floor(Math.random() * BONK_LINES.length)]
//     const sub = combo >= 2 ? `${COMBO_LINES[Math.min(combo - 2, COMBO_LINES.length - 1)]} x${combo}` : undefined
//     setFloater({ text: line, sub, key: now })
//     window.setTimeout(() => setFloater(null), 1400)
//     bonkImpulseRef.current = Math.min(1, bonkImpulseRef.current + 0.55 + combo * 0.04)
//     clearFaceTimers()
//     if (reducedMotion) {
//       setFaceMode('hit')
//       faceTimersRef.current.push(window.setTimeout(() => setFaceMode('normal'), 220))
//     } else if (combo >= 2) {
//       setFaceMode('hit')
//       faceTimersRef.current.push(window.setTimeout(() => setFaceMode('combo'), 150))
//       faceTimersRef.current.push(window.setTimeout(() => setFaceMode('normal'), 780))
//     } else {
//       setFaceMode('hit')
//       faceTimersRef.current.push(window.setTimeout(() => setFaceMode('normal'), 340))
//     }
//     if (reducedMotion) {
//       gsap.fromTo(hb, { opacity: 0.88 }, { opacity: 1, duration: 0.25 })
//       return
//     }
//     gsap.killTweensOf(hb)
//     gsap.killTweensOf(tilt)
//     spawnParticles(clientX, clientY)
//     gsap.timeline().to(hb, { x: gsap.utils.random(-14, 14), y: gsap.utils.random(-10, 10), rotation: gsap.utils.random(-6, 6), duration: 0.045, ease: 'power4.in' }).to(hb, { x: gsap.utils.random(-10, 10), y: gsap.utils.random(-8, 8), rotation: gsap.utils.random(-4, 4), duration: 0.04 }).to(hb, { x: 0, y: 0, rotation: 0, duration: 0.35, ease: 'elastic.out(1.1, 0.35)' })
//     gsap.timeline().to(tilt, { z: -32, scale: 0.9, rotationX: 14, duration: 0.07, ease: 'power4.in' }).to(tilt, { z: 22, scale: 1.05, rotationX: -8, duration: 0.09, ease: 'power2.out' }).to(tilt, { z: 0, scale: 1, rotationX: 0, duration: 0.55, ease: 'elastic.out(1.2, 0.38)' })
//     try {
//       const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
//       let actx = audioCtxRef.current
//       if (!actx) {
//         actx = new Ctx()
//         audioCtxRef.current = actx
//       }
//       void actx.resume()
//       const osc = actx.createOscillator()
//       const gain = actx.createGain()
//       osc.connect(gain)
//       gain.connect(actx.destination)
//       osc.type = 'sine'
//       const t0 = actx.currentTime
//       osc.frequency.setValueAtTime(280 + combo * 35, t0)
//       osc.frequency.exponentialRampToValueAtTime(120, t0 + 0.12)
//       gain.gain.setValueAtTime(0.07, t0)
//       gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14)
//       osc.start(t0)
//       osc.stop(t0 + 0.15)
//     } catch {
//       // ignore audio failures
//     }
//   }, [clearFaceTimers, reducedMotion, spawnParticles])

//   const onBonk = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
//     e.currentTarget.releasePointerCapture?.(e.pointerId)
//     triggerBonk(e.clientX, e.clientY)
//   }, [triggerBonk])

//   const onKeyBonk = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
//     if (e.key !== 'Enter' && e.key !== ' ') return
//     e.preventDefault()
//     const hb = hitboxRef.current
//     if (!hb) return
//     const r = hb.getBoundingClientRect()
//     triggerBonk(r.left + r.width / 2, r.top + r.height * 0.38)
//   }, [triggerBonk])

//   return (
//     <div className="hero-robot">
//       <div className="hero-robot-float" ref={wrapRef}>
//         <div className="hero-robot-shell">
//           <div className={`hero-robot-stage${reducedMotion ? ' hero-robot-stage--still' : ''}`} aria-hidden="true">
//             <span className="hero-robot-bubble hero-robot-bubble--main" />
//             <span className="hero-robot-bubble hero-robot-bubble--mini" />
//             <span className="hero-robot-aura hero-robot-aura--primary" />
//             <span className="hero-robot-aura hero-robot-aura--secondary" />
//             <span className="hero-robot-ring hero-robot-ring--one" />
//             <span className="hero-robot-ring hero-robot-ring--two" />
//             <span className="hero-robot-trail hero-robot-trail--one" />
//             <span className="hero-robot-trail hero-robot-trail--two" />
//             <span className="hero-robot-orbit hero-robot-orbit--one"><span className="hero-robot-orbit-dot" /></span>
//             <span className="hero-robot-orbit hero-robot-orbit--two"><span className="hero-robot-orbit-dot" /></span>
//             <span className="hero-robot-spark hero-robot-spark--left" />
//             <span className="hero-robot-spark hero-robot-spark--right" />
//             <span className="hero-robot-dot hero-robot-dot--one" />
//             <span className="hero-robot-dot hero-robot-dot--two" />
//             <span className="hero-robot-dot hero-robot-dot--three" />
//           </div>
//           <div className="hero-robot-hitbox" ref={hitboxRef} onPointerDown={onBonk} onKeyDown={onKeyBonk} role="button" tabIndex={0} aria-label="Bonk the bot for a playful reaction and combo">
//             {floater && <div className="hero-robot-floater" key={floater.key}><span className="hero-robot-floater-main">{floater.text}</span>{floater.sub && <span className="hero-robot-floater-sub">{floater.sub}</span>}</div>}
//             <div className="hero-robot-fx" aria-hidden="true">
//               {particles.map((p) => (
//                 <span key={p.id} data-particle={p.id} className="hero-robot-star" style={{ left: `${p.x}%`, top: `${p.y}%`, ['--star-hue' as string]: `${p.hue}deg` } as CSSProperties} />
//               ))}
//             </div>
//             <div className="hero-robot-tilt" ref={tiltRef}>
//               <RobotSvg floatRef={floatRef} shadowRef={shadowRef} chestRef={chestRef} orbRef={orbRef} neckRef={neckRef} headRef={headRef} pupilsRef={pupilsRef} faceMode={faceMode} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
