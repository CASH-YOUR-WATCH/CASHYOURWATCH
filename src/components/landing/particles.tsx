"use client";

import { useEffect, useRef } from "react";

/**
 * Capa de partículas plateadas que flotan lento. Son REACTIVAS: al mover el
 * cursor o tocar la pantalla, las partículas cercanas se encienden y crecen.
 * Canvas ligero. Respeta prefers-reduced-motion.
 */
export function Particles({
  className = "",
  color = "210,214,224", // plateado
}: {
  className?: string;
  color?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    const dots: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    const resize = () => {
      w = canvas.width = parent.clientWidth * dpr;
      h = canvas.height = parent.clientHeight * dpr;
    };
    const init = () => {
      dots.length = 0;
      const n = Math.min(120, Math.floor((parent.clientWidth * parent.clientHeight) / 9000));
      for (let i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18 * dpr,
          vy: (Math.random() - 0.5) * 0.18 * dpr,
          r: (Math.random() * 1.5 + 0.5) * dpr,
          a: Math.random() * 0.45 + 0.18,
        });
      }
    };

    const R = 150 * dpr; // radio de influencia del puntero
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;

        let a = d.a;
        let r = d.r;
        if (pointer.active) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < R) {
            const f = 1 - dist / R; // 1 en el centro, 0 en el borde
            a = Math.min(1, d.a + f * 0.85);
            r = d.r * (1 + f * 1.4);
          }
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * dpr;
      const y = (e.clientY - rect.top) * dpr;
      pointer.x = x;
      pointer.y = y;
      pointer.active = x >= 0 && x <= w && y >= 0 && y <= h;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = pointer.y = -9999;
    };

    resize();
    init();
    tick();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onLeave, { passive: true });
    window.addEventListener("pointercancel", onLeave, { passive: true });
    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onLeave);
      window.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [color]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
