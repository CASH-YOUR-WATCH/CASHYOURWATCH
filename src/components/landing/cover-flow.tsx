"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Item = { src: string; alt: string };

/**
 * Galería 3D estilo "Cover Flow" (iPod): la pieza central va de frente y las
 * laterales giran en perspectiva. Se navega arrastrando, con flechas, rueda,
 * teclado o tocando una pieza.
 */
export function CoverFlow({ images }: { images: Item[] }) {
  const [active, setActive] = useState(Math.floor(images.length / 2));
  const dragX = useRef<number | null>(null);
  const wheelLock = useRef(false);

  const clamp = (i: number) => Math.max(0, Math.min(images.length - 1, i));
  const go = (dir: number) => setActive((a) => clamp(a + dir));

  function onPointerDown(e: React.PointerEvent) {
    dragX.current = e.clientX;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    if (Math.abs(dx) > 55) {
      go(dx > 0 ? -1 : 1);
      dragX.current = e.clientX;
    }
  }
  function onPointerUp() {
    dragX.current = null;
  }
  function onWheel(e: React.WheelEvent) {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (wheelLock.current || Math.abs(d) < 8) return;
    wheelLock.current = true;
    go(d > 0 ? 1 : -1);
    setTimeout(() => (wheelLock.current = false), 280);
  }

  return (
    <div
      className="relative mx-auto flex h-[380px] w-full max-w-3xl touch-pan-y select-none items-center justify-center"
      style={{ perspective: "1200px" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
      tabIndex={0}
      role="listbox"
      aria-label="Galería de relojes"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {images.map((img, i) => {
          const o = i - active;
          const abs = Math.abs(o);
          const sign = Math.sign(o);
          const transform =
            o === 0
              ? "translateX(-50%) translateZ(40px) rotateY(0deg) scale(1)"
              : `translateX(calc(-50% + ${o * 120}px)) translateZ(${-70 - abs * 35}px) rotateY(${sign * -48}deg) scale(0.86)`;
          return (
            <button
              key={img.src}
              type="button"
              aria-label={img.alt}
              onClick={() => setActive(i)}
              className="absolute left-1/2 top-1/2 h-[300px] w-[210px] -translate-y-1/2 transition-[transform,opacity] duration-500 ease-out"
              style={{
                transform,
                zIndex: 50 - abs,
                opacity: abs > 3 ? 0 : 1,
                pointerEvents: abs > 3 ? "none" : "auto",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="210px"
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              />
            </button>
          );
        })}
      </div>

      {/* Flechas */}
      <button
        type="button"
        aria-label="Anterior"
        onClick={() => go(-1)}
        className="absolute left-1 top-1/2 z-[60] -translate-y-1/2 p-3 text-2xl text-cyw-white/40 transition-colors hover:text-cyw-white disabled:opacity-0"
        disabled={active === 0}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        onClick={() => go(1)}
        className="absolute right-1 top-1/2 z-[60] -translate-y-1/2 p-3 text-2xl text-cyw-white/40 transition-colors hover:text-cyw-white disabled:opacity-0"
        disabled={active === images.length - 1}
      >
        ›
      </button>

      {/* Puntos */}
      <div className="absolute inset-x-0 bottom-1 z-[60] flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir a ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === active ? "bg-cyw-white" : "bg-cyw-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
