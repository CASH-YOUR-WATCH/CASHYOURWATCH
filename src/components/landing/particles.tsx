"use client";

import { useEffect, useRef } from "react";

/**
 * Capa de partículas sutil (motas de luz que flotan lento). Canvas ligero.
 * Respeta prefers-reduced-motion. Se posiciona absoluto dentro de un contenedor
 * relativo.
 */
export function Particles({
  className = "",
  color = "255,255,255",
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

    const resize = () => {
      w = canvas.width = parent.clientWidth * dpr;
      h = canvas.height = parent.clientHeight * dpr;
    };
    const init = () => {
      dots.length = 0;
      const n = Math.min(60, Math.floor((parent.clientWidth * parent.clientHeight) / 18000));
      for (let i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.1 * dpr,
          vy: (Math.random() - 0.5) * 0.1 * dpr,
          r: (Math.random() * 1.3 + 0.4) * dpr,
          a: Math.random() * 0.35 + 0.08,
        });
      }
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${d.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    init();
    tick();

    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
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
