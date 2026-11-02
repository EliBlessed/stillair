import { frames, parts, stills } from "@/lib/site-data";
import { ScrollScene } from "./scroll-scene";
import { BookLink } from "./book-link";
import type { CSSProperties } from "react";

const grads: [string, string] = [
  "radial-gradient(90% 70% at 70% 40%, #1d2b38, #0a0f14 75%)",
  "radial-gradient(90% 70% at 70% 40%, #1f4157, #0a0f14 75%)",
];

export function UnitScene() {
  return (
    <ScrollScene frames={frames.unit} stills={stills.unit} grads={grads} alt="An outdoor air-conditioning unit separating into its parts" scroll={200}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-base/85 via-base/20 to-base/50" aria-hidden />
      <div className="wrap relative flex flex-1 flex-col justify-between gap-8 pt-28 pb-8 md:grid md:grid-cols-[1fr_minmax(0,26rem)] md:items-center md:gap-16 md:pb-12">
        <div>
          <h2 className="h2 max-w-[10ch]">
            Every part, <span className="text-ice">checked.</span>
          </h2>
          <div className="mt-6">
            <BookLink need="Tune-up" className="btn">Book a tune-up</BookLink>
          </div>
        </div>
        <ol className="flex flex-col gap-2.5 md:gap-3">
          {parts.map((p, i) => (
            <li key={p.name} className="part rounded-2xl border border-line bg-base/70 px-5 py-3.5 backdrop-blur-md" style={{ "--i": i } as CSSProperties}>
              <p className="font-medium">{p.name}</p>
              <p className="text-[0.95rem] text-muted">{p.note}</p>
            </li>
          ))}
        </ol>
      </div>
    </ScrollScene>
  );
}
