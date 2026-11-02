import { frames, parts, stills } from "@/lib/site-data";
import { ScrollScene } from "./scroll-scene";
import { BookLink } from "./book-link";
import type { CSSProperties } from "react";

const grads: [string, string] = [
  "radial-gradient(90% 70% at 70% 40%, #1d2b38, #0a0f14 75%)",
  "radial-gradient(90% 70% at 70% 40%, #1f4157, #0a0f14 75%)",
];

const CARD_X = 64; // desktop cards start here (% of the frame), right of the unit

export function UnitScene() {
  return (
    <ScrollScene frames={frames.unit} stills={stills.unit} grads={grads} alt="An outdoor air-conditioning unit separating into its parts" scroll={220}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-base/70 via-transparent to-base/40" aria-hidden />

      {/* Labels pinned to the parts. This box covers the section exactly like the frames do (object-cover),
          so % positions on the frame line up on every screen size. */}
      <div className="pointer-events-none absolute inset-0 [container-type:size]">
        <div className="unit-box absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg className="absolute inset-0 hidden size-full md:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {parts.map((p, i) => (
              <polyline key={p.name} className="pin" style={{ "--i": i } as CSSProperties} points={`${p.at[0]},${p.at[1]} ${CARD_X - 2},${p.cardY} ${CARD_X},${p.cardY}`} fill="none" stroke="var(--color-ice)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <ol>
            {parts.map((p, i) => (
              <li key={p.name} className="pin" style={{ "--i": i } as CSSProperties}>
                {/* dot on the part (desktop and phone positions differ: the frames are cropped differently) */}
                <span className="absolute hidden size-2.5 -translate-1/2 rounded-full bg-ice shadow-[0_0_0_4px_rgb(124_200_242/0.25)] md:block" style={{ left: `${p.at[0]}%`, top: `${p.at[1]}%` }} aria-hidden />
                <span className="absolute size-2 -translate-1/2 rounded-full bg-ice shadow-[0_0_0_3px_rgb(124_200_242/0.25)] md:hidden" style={{ left: `${p.phone[0]}%`, top: `${p.phone[1]}%` }} aria-hidden />
                {/* desktop: card at the end of the line */}
                <div className="absolute hidden w-64 -translate-y-1/2 rounded-xl border border-line bg-base/75 px-4 py-2.5 backdrop-blur-md md:block" style={{ left: `${CARD_X}%`, top: `${p.cardY}%` }}>
                  <p className="text-[0.95rem] font-medium">{p.name}</p>
                  <p className="text-sm text-muted">{p.note}</p>
                </div>
                {/* phone: short tag beside the dot */}
                <p
                  className="absolute -translate-y-1/2 rounded-full border border-line bg-base/75 px-2 py-0.5 text-xs whitespace-nowrap backdrop-blur-md md:hidden"
                  style={p.side === "right" ? { left: `calc(${p.phone[0]}% + 0.6rem)`, top: `${p.phone[1]}%` } : { right: `calc(${100 - p.phone[0]}% + 0.6rem)`, top: `${p.phone[1]}%` }}
                >
                  {p.name}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="wrap relative flex flex-1 flex-col justify-between gap-8 pt-28 pb-10 md:justify-center md:pb-12">
        <div>
          <h2 className="h2 max-w-[10ch]">
            Every part, <span className="text-ice">checked.</span>
          </h2>
          <div className="mt-6">
            <BookLink need="Tune-up" className="btn">Book a tune-up</BookLink>
          </div>
        </div>
      </div>
    </ScrollScene>
  );
}
