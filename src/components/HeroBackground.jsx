'use client'

import { useEffect, useRef, useState } from 'react'

export default function HeroBackground() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const video1Ref = useRef(null)
  const video2Ref = useRef(null)

  const [activeVideo, setActiveVideo] = useState(0)
  const [isMobile, setIsMobile] = useState(true) // Default to mobile/lightweight on SSR
  const [videosReady, setVideosReady] = useState(false)
  const isVisibleRef = useRef(true)

  // 1. Check viewport & device capability on mount
  useEffect(() => {
    const checkCapability = () => {
      const mobile = window.innerWidth < 768
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setIsMobile(mobile || reducedMotion)
    }

    checkCapability()

    // Defer loading heavy desktop video until after main interactive thread is idle
    const deferTimer = setTimeout(() => {
      if (window.innerWidth >= 768) {
        setVideosReady(true)
      }
    }, 400)

    window.addEventListener('resize', checkCapability, { passive: true })
    return () => {
      clearTimeout(deferTimer)
      window.removeEventListener('resize', checkCapability)
    }
  }, [])

  // 2. Start Video 1 when ready on desktop
  useEffect(() => {
    if (videosReady && video1Ref.current && isVisibleRef.current) {
      video1Ref.current.play().catch(() => {})
    }
  }, [videosReady])

  // 3. Smooth video switching via ended event (Zero state churn during playback)
  const handleVideo1Ended = () => {
    if (!isVisibleRef.current) return
    const v2 = video2Ref.current
    if (v2) {
      v2.currentTime = 0
      v2.play().catch(() => {})
    }
    setActiveVideo(1)
  }

  const handleVideo2Ended = () => {
    if (!isVisibleRef.current) return
    const v1 = video1Ref.current
    if (v1) {
      v1.currentTime = 0
      v1.play().catch(() => {})
    }
    setActiveVideo(0)
  }

  // 4. Viewport IntersectionObserver: Pause everything when Hero is scrolled out of view!
  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        isVisibleRef.current = visible

        // Pause/Resume Videos
        if (videosReady) {
          if (!visible) {
            video1Ref.current?.pause()
            video2Ref.current?.pause()
          } else {
            if (activeVideo === 0) video1Ref.current?.play().catch(() => {})
            else video2Ref.current?.play().catch(() => {})
          }
        }
      },
      { threshold: 0.05 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [videosReady, activeVideo])

  // 5. Hardware-Accelerated Lightweight Particle Canvas (Auto-paused when off-screen)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId
    let width = (canvas.width = Math.min(window.innerWidth, 1920))
    let height = (canvas.height = window.innerHeight)

    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = Math.min(window.innerWidth, 1920)
      height = canvas.height = window.innerHeight
    }

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX
      mouse.targetY = e.clientY
    }

    window.addEventListener('resize', handleResize, { passive: true })
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    // Lightweight Particle Pool (22 high-performance points)
    const particleCount = isMobile ? 12 : 24
    const particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.3 - 0.1,
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        color:
          Math.random() > 0.65
            ? '#fd5001'
            : Math.random() > 0.35
            ? '#818cf8'
            : '#38bdf8',
      })
    }

    let time = 0

    const render = () => {
      // Pause drawing if hero is out of viewport (0% CPU when scrolling the rest of site)
      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      time += 0.015
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      ctx.clearRect(0, 0, width, height)

      // Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha += Math.sin(time * 2 + i) * p.pulseSpeed

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        const clampedAlpha = Math.max(0.15, Math.min(0.75, p.alpha))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = clampedAlpha
        ctx.fill()
      }

      // Cursor Ambient Glow (Only on desktop)
      if (!isMobile) {
        ctx.save()
        const radialGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          320
        )
        radialGlow.addColorStop(0, 'rgba(253, 80, 1, 0.04)')
        radialGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.015)')
        radialGlow.addColorStop(1, 'transparent')
        ctx.fillStyle = radialGlow
        ctx.fillRect(0, 0, width, height)
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* 1. Deep Midnight Base Layer */}
      <div className="absolute inset-0 bg-[#060814]" />

      {/* 2. Visual Layer: High-speed Poster on Mobile, Seamless Videos on Desktop */}
      {isMobile || !videosReady ? (
        <img
          src="/videos/hero-poster.jpg"
          alt=""
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center filter blur-[6px] brightness-[0.82] contrast-[1.05] opacity-65 scale-105"
        />
      ) : (
        <>
          {/* Video 1: Custom Robotic Cyber Optics */}
          <video
            ref={video1Ref}
            muted
            playsInline
            preload="metadata"
            poster="/videos/hero-poster.jpg"
            onEnded={handleVideo1Ended}
            className={`absolute inset-0 h-full w-full object-cover object-center filter blur-[6.5px] brightness-[0.82] contrast-[1.05] transition-opacity duration-1000 ease-in-out ${
              activeVideo === 0 ? 'opacity-65' : 'opacity-0 pointer-events-none'
            }`}
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>

          {/* Video 2: Custom Connected Web Technology Nodes */}
          <video
            ref={video2Ref}
            muted
            playsInline
            preload="none"
            onEnded={handleVideo2Ended}
            className={`absolute inset-0 h-full w-full object-cover object-center filter blur-[6.5px] brightness-[0.82] contrast-[1.05] transition-opacity duration-1000 ease-in-out ${
              activeVideo === 1 ? 'opacity-65' : 'opacity-0 pointer-events-none'
            }`}
          >
            <source src="/videos/hero-bg-2.mp4" type="video/mp4" />
          </video>
        </>
      )}

      {/* 3. Atmospheric Nebula Glows (Violet, Deep Blue, Brand Orange) */}
      <div className="absolute -left-[10%] top-[12%] h-[480px] w-[480px] rounded-full bg-gradient-to-br from-[#4c1d95]/30 via-[#2e1065]/15 to-transparent blur-[120px]" />
      <div className="absolute -right-[10%] bottom-[8%] h-[520px] w-[520px] rounded-full bg-gradient-to-tl from-[#1e3a8a]/25 via-[#172554]/15 to-transparent blur-[130px]" />

      {/* Centerpiece Radiant Core Warmth */}
      <div className="absolute left-1/2 top-[46%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#fd5001]/14 via-[#ea580c]/08 to-transparent blur-[100px]" />

      {/* 4. Hardware-Accelerated Lightweight Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-75"
      />

      {/* 5. Precision Tech Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_48%,#000_65%,transparent_100%)]" />

      {/* 6. Cinematic Radial Vignette & Bottom Section Frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060814]/20 to-[#060814]/65" />
    </div>
  )
}
