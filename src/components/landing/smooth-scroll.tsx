"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Scroll suave (lenis) + barra de progreso de scroll arriba.
 * También intercepta los enlaces de ancla para hacer scroll suave con offset
 * del header fijo. Respeta prefers-reduced-motion.
 */
export function SmoothScroll() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: !reduce,
      autoRaf: false,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    lenis.on("scroll", (e: { progress: number }) => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${e.progress})`;
      }
    });

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-cyw-white/10">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-cyw-white/70"
      />
    </div>
  );
}
