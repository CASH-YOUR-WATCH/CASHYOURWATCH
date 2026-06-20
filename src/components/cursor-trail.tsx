"use client";

import { useEffect, useRef } from "react";

/**
 * Rastro de partículas plateadas que sigue al cursor / dedo. Solo se generan
 * con el movimiento (tipo agua/spray) y se desvanecen al detenerse. Canvas
 * fijo a pantalla completa, sin bloquear clics. Respeta prefers-reduced-motion.
 */
export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;

    type P = { x: number; y: number; vx: number; vy: number; life: number; decay: number; r: number };
    const ps: P[] = [];
    const last = { x: 0, y: 0, has: false };

    const resize = () => {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
    };

    const spawn = (x: number, y: number, dx: number, dy: number) => {
      const speed = Math.hypot(dx, dy);
      const count = Math.min(10, 2 + Math.floor(speed / 4));
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = (Math.random() * 0.7 + 0.1) * dpr;
        ps.push({
          x: x * dpr + (Math.random() - 0.5) * 8 * dpr,
          y: y * dpr + (Math.random() - 0.5) * 8 * dpr,
          vx: Math.cos(ang) * spd + dx * 0.05 * dpr,
          vy: Math.sin(ang) * spd + dy * 0.05 * dpr,
          life: 1,
          decay: 0.012 + Math.random() * 0.022,
          r: (Math.random() * 1.7 + 0.6) * dpr,
        });
      }
      if (ps.length > 600) ps.splice(0, ps.length - 600);
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.025 * dpr; // leve gravedad (efecto agua)
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.life -= p.decay;
        if (p.life <= 0) {
          ps.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life) * 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(214,218,228)";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (ps.length === 0) {
        running = false;
        ctx.clearRect(0, 0, w, h);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const ensure = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const dx = last.has ? x - last.x : 0;
      const dy = last.has ? y - last.y : 0;
      last.x = x;
      last.y = y;
      last.has = true;
      spawn(x, y, dx, dy);
      ensure();
    };

    resize();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] h-full w-full"
    />
  );
}
