"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { roomCompare, temps } from "@/lib/site-data";
import { Img } from "./img";

export function FeelDifference() {
  const [pct, setPct] = useState(0); // starts on the hot side (0% cool revealed = 91°)
  const [dragging, setDragging] = useState(false);
  const [hinting, setHinting] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  // The first time the slider is well into view, the handle slides a little way right and back,
  // so visitors see it can be dragged. Skipped with reduced motion or once someone has touched it.
  useEffect(() => {
    const box = boxRef.current;
    if (!box || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timers.push(window.setTimeout(() => {
          if (touched.current) return;
          setHinting(true);
          setPct(35);
          timers.push(window.setTimeout(() => {
            if (!touched.current) setPct(0);
            timers.push(window.setTimeout(() => setHinting(false), 700));
          }, 900));
        }, 400));
      },
      { threshold: 0.6 },
    );
    io.observe(box);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, []);

  const temp = Math.round(temps.hot - ((temps.hot - temps.cool) * pct) / 100);

  const setFromX = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    setPct(Math.max(0, Math.min(100, Math.round(((clientX - r.left) / r.width) * 100))));
  };

  const onDown = (e: PointerEvent<HTMLInputElement>) => {
    touched.current = true;
    setHinting(false);
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromX(e.clientX);
  };

  const onMove = (e: PointerEvent<HTMLInputElement>) => {
    if (!dragging) return;
    setFromX(e.clientX);
  };

  const t = hinting ? "700ms var(--ease-in-out)" : "120ms var(--ease-out)";
  const ease = dragging ? "none" : `clip-path ${t}, left ${t}`;

  return (
    <section id="feel" className="section scroll-mt-20 md:min-h-[80svh]">
      <div className="wrap">
        <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
          <h2 className="h2" data-reveal>
            Feel the <span className="text-ice">difference.</span>
          </h2>
          <p className="lead" data-reveal="1">{roomCompare.caption}</p>
        </div>

        <div
          ref={boxRef}
          className="frame relative aspect-[16/10] w-full select-none md:aspect-[16/9]"
          data-reveal="2"
          style={{ background: "linear-gradient(135deg, #4a2a12, #16364d)" }}
        >
          {/* Base layer: hot room */}
          <Img
            src={roomCompare.hot}
            alt="Warm South Florida room at 91 degrees before cooling"
            width={1376}
            height={768}
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />

          {/* Wipe layer: cool room revealed as handle moves right */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pct}% 0 0)`, transition: ease }}
          >
            <Img
              src={roomCompare.cool}
              alt="Cool room at 72 degrees after cooling"
              width={1376}
              height={768}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Accessible range input covering the frame for mouse, touch and keyboard arrows */}
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={pct}
            aria-label="Drag to cool it down"
            aria-valuetext={`${temp}°F`}
            onChange={(e) => { touched.current = true; setHinting(false); setPct(+e.target.value); }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            className="peer absolute inset-0 z-20 m-0 h-full w-full cursor-ew-resize opacity-0"
          />

          {/* Wipe vertical line */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-ice/80"
            style={{ left: `${pct}%`, transition: ease }}
          />

          {/* Draggable handle with live temperature readout */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-ice bg-base/90 px-3.5 py-2 shadow-lg backdrop-blur-md peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ice"
            style={{ left: `clamp(3.25rem, ${pct}%, calc(100% - 3.25rem))`, transition: ease }}
          >
            <span className="text-xs text-muted">‹</span>
            <span className="num text-[1rem] font-semibold text-ice">{temp}°F</span>
            <span className="text-xs text-muted">›</span>
          </div>
        </div>
      </div>
    </section>
  );
}

