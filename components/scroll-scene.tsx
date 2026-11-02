"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Img } from "./img";

type Props = {
  frames: { dir: string; phoneDir: string; count: number }; // frame-0001.webp … frame-NNNN.webp; count 0 = none yet
  stills: string[]; // placeholders: [start, end] crossfade, or one image that slowly pushes in
  grads: [string, string]; // CSS backgrounds used when no image exists (start, end)
  alt: string;
  scroll?: number; // pinned scroll distance in vh
  priority?: boolean; // first screen: fetchpriority high
  hold?: number; // share of the scroll before cooling starts (sets --hold, read as --c in CSS)
  children: ReactNode;
};

const name = (dir: string, n: number) => `${dir}/frame-${String(n).padStart(4, "0")}.webp`;
const layer = "pointer-events-none absolute inset-0 h-full w-full object-cover";

/**
 * Pins itself and scrubs a frame sequence with scroll. It writes progress (0 to 1) to the CSS
 * variable --p, which children and the layers below read directly. Reduced motion: no pin, no
 * frames, rests at --p: 1 (see globals.css).
 */
export function ScrollScene({ frames, stills, grads, alt, scroll = 150, priority, hold, children }: Props) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const first = useRef<HTMLImageElement>(null);
  const hasFrames = frames.count > 1;

  useEffect(() => {
    const el = root.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No scrubbing: show the end state (cool room, unit apart), which is what --p: 1 describes.
      const img = first.current;
      if (hasFrames && img) {
        img.parentElement?.querySelector("source")?.setAttribute("srcset", name(frames.phoneDir, frames.count));
        img.src = name(frames.dir, frames.count);
      }
      return;
    }

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

    // gsap loads after hydration (not in the first HTML), then pins the scene.
    let revert = () => {};
    let dead = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (dead) return;
      gsap.registerPlugin(ScrollTrigger);
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
      revert = () => ctx.revert();
    });

    return () => {
      dead = true;
      revert();
      wake.forEach((t) => removeEventListener(t, loadRest));
      el.style.removeProperty("--p");
    };
  }, [frames, hasFrames, scroll]);

  // The plain div is React's own parent: ScrollTrigger's pin wraps <section> in a pin-spacer, and
  // without this wrapper React can't remove the section on a page change (removeChild error).
  return (
    <div>
    <section ref={root} className="scene relative isolate flex min-h-svh flex-col overflow-hidden bg-base" aria-label={alt} style={hold ? ({ "--hold": hold } as CSSProperties) : undefined}>
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0" style={{ background: grads[0] }} />
        <div className="absolute inset-0" style={{ background: grads[1], opacity: "var(--p)" }} />
        {!hasFrames && stills.map((src, i) => (
          <Img
            key={src}
            src={src}
            alt=""
            width={1376}
            height={768}
            fetchPriority={priority && i === 0 && !hasFrames ? "high" : undefined}
            srcSet={priority && i === 0 ? `${src.replace(/\.webp$/, "-800.webp")} 800w, ${src} 1376w` : undefined} // phones get the 800px copy (keep one beside the first hero still)
            sizes={priority && i === 0 ? "100vw" : undefined}
            loading={priority && i === 0 ? undefined : "lazy"} // React preloads every eager img in <head>; only the first hero still should compete for bandwidth
            className={layer}
            style={stills.length > 1 ? (i ? { opacity: "var(--p)" } : undefined) : { transform: "scale(calc(1 + var(--p) * 0.08))" }}
          />
        ))}
        {hasFrames && (
          <>
            <picture>
              <source media="(max-width: 767px)" srcSet={name(frames.phoneDir, 1)} />
              <img ref={first} src={name(frames.dir, 1)} alt="" width={1376} height={768} fetchPriority={priority ? "high" : undefined} loading={priority ? undefined : "lazy"} className={layer} onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </picture>
            <canvas ref={canvas} className={layer} style={{ opacity: 0 }} />
          </>
        )}
      </div>
      {children}
    </section>
    </div>
  );
}

