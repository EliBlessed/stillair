import { frames, stills, temps, site } from "@/lib/site-data";
import { ScrollScene } from "./scroll-scene";
import { BookLink } from "./book-link";

const grads: [string, string] = [
  "linear-gradient(160deg, #e8892b -10%, #4a2a12 38%, #0a0f14 85%)",
  "linear-gradient(160deg, #7cc8f2 -25%, #16364d 40%, #0a0f14 85%)",
];

export function Hero() {
  return (
    <ScrollScene frames={frames.hero} stills={stills.hero} grads={grads} alt="Cool. Finally. A room cooling from 91 to 72 degrees" priority>
      {/* heat tint: amber at the hot end, gone by the cool end */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden style={{ background: "radial-gradient(110% 80% at 75% 100%, var(--color-heat), transparent 70%)", opacity: "calc((1 - var(--p)) * 0.38)" }} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-base/90 via-base/30 to-base/20" aria-hidden />

      <p className="absolute top-24 right-5 z-10 rounded-full border border-line bg-base/60 px-3 py-1 text-xs text-muted backdrop-blur-md md:right-8">{site.demoLabel}</p>

      <div className="wrap relative mt-auto flex flex-col gap-8 pt-40 pb-10 md:gap-10 md:pb-14">
        <div className="readout num text-[clamp(5.5rem,22vw,15rem)] leading-[0.85] font-medium" style={{ "--hot": temps.hot, "--cool": temps.cool } as React.CSSProperties}>
          <span className="sr-only-text">Temperature falls from {temps.hot} to {temps.cool} degrees Fahrenheit</span>
        </div>
        <div className="grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
          <h1 className="h1">{site.tagline}</h1>
          <div className="flex flex-col gap-6">
            <p className="lead !text-ink/80">Air conditioning repair, replacement and installation. {site.area}.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <BookLink />
              <a href={site.phoneHref} className="btn">Call <span className="num">{site.phone}</span></a>
            </div>
          </div>
        </div>
      </div>
    </ScrollScene>
  );
}

