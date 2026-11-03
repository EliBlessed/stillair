"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { frames, heroHold, heroStages, site, stills, temps } from "@/lib/site-data";
import { ScrollScene } from "./scroll-scene";
import { BookLink } from "./book-link";

const grads: [string, string] = [
  "linear-gradient(160deg, #e8892b -10%, #4a2a12 38%, #0a0f14 85%)",
  "linear-gradient(160deg, #7cc8f2 -25%, #16364d 40%, #0a0f14 85%)",
];

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const scene = wrapRef.current?.closest(".scene") as HTMLElement | null;
    if (!scene) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dispRef.current?.setAttribute("scale", "0");
      if (h1Ref.current) h1Ref.current.style.filter = "none";
      const id = requestAnimationFrame(() => setStageIdx(heroStages.length - 1));
      return () => cancelAnimationFrame(id);
    }

    // Shimmer starts on the first scroll, not on load: a filtered h1 counts as a late repaint and
    // pushed phone LCP from ~0.9s to ~3.4s.
    let armed = false;
    const arm = () => { armed = true; sync(); };
    addEventListener("scroll", arm, { once: true, passive: true });

    const sync = () => {
      const raw = scene.style.getPropertyValue("--p");
      const p = Math.min(1, Math.max(0, ((raw ? parseFloat(raw) : 0) - heroHold) / (1 - heroHold)));
      const t = Math.round(temps.hot - (temps.hot - temps.cool) * p);
      const nextIdx = t > temps.mid ? 0 : t > temps.cool ? 1 : 2;
      setStageIdx((prev) => (prev === nextIdx ? prev : nextIdx));

      // Heat shimmer while readout is above 84°, settling sharp and still by 72°
      const strength =
        t > temps.mid
          ? 1.2 + ((t - temps.mid) / (temps.hot - temps.mid)) * 2.3
          : Math.max(0, ((t - temps.cool) / (temps.mid - temps.cool)) * 1.0);

      if (armed && dispRef.current && turbRef.current && h1Ref.current) {
        if (strength <= 0.05) {
          dispRef.current.setAttribute("scale", "0");
          h1Ref.current.style.filter = "none";
        } else {
          dispRef.current.setAttribute("scale", strength.toFixed(2));
          turbRef.current.setAttribute("baseFrequency", `0.015 ${(0.055 + p * 0.025).toFixed(4)}`);
          h1Ref.current.style.filter = "url(#hero-shimmer)";
        }
      }
    };

    sync();
    const mo = new MutationObserver(sync);
    mo.observe(scene, { attributes: true, attributeFilter: ["style"] });
    return () => { mo.disconnect(); removeEventListener("scroll", arm); };
  }, []);

  const stage = heroStages[stageIdx];

  return (
    <ScrollScene frames={frames.hero} stills={stills.hero} grads={grads} alt="Cool. Finally. An air conditioner being installed, then a room cooling from 91 to 72 degrees" priority scroll={350} hold={heroHold}>
      <svg className="pointer-events-none absolute size-0" aria-hidden>
        <defs>
          <filter id="hero-shimmer" x="-5%" y="-10%" width="110%" height="120%">
            <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.015 0.055" numOctaves={2} seed={3} result="noise" />
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale={3.5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* heat tint: amber at the hot end, gone by the cool end */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden style={{ background: "radial-gradient(110% 80% at 75% 100%, var(--color-heat), transparent 70%)", opacity: "calc((1 - var(--c)) * 0.38)" }} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-base/90 via-base/35 to-base/55 md:bg-gradient-to-r md:from-base/90 md:via-base/45 md:to-transparent" aria-hidden />


      <div ref={wrapRef} className="wrap relative flex flex-1 flex-col gap-6 pt-28 pb-12 md:justify-end md:gap-8 md:pt-32 md:pb-14">
        {/* Same order on every screen: readout and stage caption, then headline and line, then buttons.
            Phone: buttons sit at the bottom (mt-auto). Desktop: everything sits low on the left. */}
        <div className="max-w-xl">
          <div className="readout num text-[clamp(4.75rem,20vw,12rem)] leading-[0.85] font-medium" style={{ "--hot": temps.hot, "--cool": temps.cool } as CSSProperties}>
            <span className="sr-only-text">Temperature falls from {temps.hot} to {temps.cool} degrees Fahrenheit</span>
          </div>
          <p className="num mt-3 text-[1rem] tracking-tight text-ink/90 md:text-lg" aria-live="polite">
            {stage.text}
          </p>
        </div>

        <div className="flex max-w-xl flex-col gap-5 md:gap-6">
          <h1 ref={h1Ref} className="h1">{site.tagline}</h1>
          <p className="lead !text-ink/85">Air conditioning repair, replacement and installation. {site.area}.</p>
        </div>

        <div className="mt-auto flex max-w-xl flex-col gap-3 sm:flex-row md:-mt-2">
          <BookLink />
          <a href={site.phoneHref} className="btn">Call <span className="num">{site.phone}</span></a>
        </div>
      </div>
    </ScrollScene>
  );
}
