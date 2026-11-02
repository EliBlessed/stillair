"use client";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Img } from "./img";

type Props = {
  frames: { dir: string; phoneDir: string; count: number }; // frame-0001.webp … frame-NNNN.webp; count 0 = none yet
  stills: string[]; // placeholders: [start, end] crossfade, or one image that slowly pushes in
  grads: [string, string]; // CSS backgrounds used when no image exists (start, end)
  alt: string;
  scroll?: number; // pinned scroll distance in vh
  priority?: boolean; // first screen: fetchpriority high
  children: ReactNode;
};

const name = (dir: string, n: number) => `${dir}/frame-${String(n).padStart(4, "0")}.webp`;
const layer = "pointer-events-none absolute inset-0 h-full w-full object-cover";

/**
 * Pins itself and scrubs a frame sequence with scroll. It writes progress (0 to 1) to the CSS
 * variable --p, which children and the layers below read directly. Reduced motion: no pin, no
 * frames, rests at --p: 1 (see globals.css).
 */
export function ScrollScene({ frames, stills, grads, alt, scroll = 150, priority, children }: Props) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const first = useRef<HTMLImageElement>(null);
  const hasFrames = frames.count > 1;

  useEffect(() => {
    const el = root.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    // shortcut: breakpoint is read once; rotating across 768px needs a reload to swap frame sets.
    const dir = matchMedia("(max-width: 767px)").matches ? frames.phoneDir : frames.dir;
    const imgs: HTMLImageElement[] = [];
    let shown = -1;
    let want = 0;

    const draw = () => {
      const cv = canvas.current;
      const ctx = cv?.getContext("2d");
      if (!cv || !ctx) return;
      for (let i = want; i >= 0; i--) {
        const im = imgs[i];
        if (!im?.complete || !im.naturalWidth) continue;
        if (i !== shown) {
          if (cv.width !== im.naturalWidth) { cv.width = im.naturalWidth; cv.height = im.naturalHeight; }
          ctx.drawImage(im, 0, 0);
          cv.style.opacity = "1";
          shown = i;
        }
        return;
      }
    };

    let loadedRest = false;
    const loadRest = () => {
      if (loadedRest || !hasFrames) return;
      loadedRest = true;
      for (let n = 2; n <= frames.count; n++) {
        const im = new Image();
        im.onload = draw;
        im.src = name(dir, n);
        imgs[n - 1] = im;
      }
    };
    const wake = ["scroll", "pointerdown", "touchstart", "keydown"] as const;
    wake.forEach((t) => addEventListener(t, loadRest, { once: true, passive: true }));

    if (hasFrames && first.current) {
      imgs[0] = first.current;
      first.current.addEventListener("load", draw);
      draw();
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${(innerHeight * scroll) / 100}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          el.style.setProperty("--p", self.progress.toFixed(4));
          if (hasFrames) { want = Math.round(self.progress * (frames.count - 1)); draw(); }
        },
      });
    }, el);

    return () => {
      ctx.revert();
      wake.forEach((t) => removeEventListener(t, loadRest));
      el.style.removeProperty("--p");
    };
  }, [frames, hasFrames, scroll]);

  return (
    <section ref={root} className="scene relative isolate flex min-h-svh flex-col overflow-hidden bg-base" aria-label={alt}>
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0" style={{ background: grads[0] }} />
        <div className="absolute inset-0" style={{ background: grads[1], opacity: "var(--p)" }} />
        {stills.map((src, i) => (
          <Img
            key={src}
            src={src}
            alt=""
            width={1376}
            height={768}
            fetchPriority={priority && i === 0 && !hasFrames ? "high" : undefined}
            className={layer}
            style={stills.length > 1 ? (i ? { opacity: "var(--p)" } : undefined) : { transform: "scale(calc(1 + var(--p) * 0.08))" }}
          />
        ))}
        {hasFrames && (
          <>
            <picture>
              <source media="(max-width: 767px)" srcSet={name(frames.phoneDir, 1)} />
              <img ref={first} src={name(frames.dir, 1)} alt="" width={1376} height={768} fetchPriority={priority ? "high" : undefined} className={layer} onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </picture>
            <canvas ref={canvas} className={layer} style={{ opacity: 0 }} />
          </>
        )}
      </div>
      {children}
    </section>
  );
}

