const BRANDS = [
  "Rolex",
  "Patek Philippe",
  "Audemars Piguet",
  "Richard Mille",
  "Vacheron Constantin",
  "Jaeger-LeCoultre",
  "Omega",
  "Cartier",
];

export function BrandMarquee() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <div className="overflow-hidden border-y border-cyw-white/10 py-7">
      <div className="cyw-marquee flex w-max items-center gap-14 whitespace-nowrap">
        {row.map((b, i) => (
          <span
            key={i}
            className="flex items-center gap-14 text-sm uppercase tracking-[0.3em] text-cyw-white/35"
          >
            {b}
            <span className="text-[8px] text-cyw-white/20">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
