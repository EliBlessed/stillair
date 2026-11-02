"use client";
import { useState } from "react";
import { symptoms } from "@/lib/site-data";
import { BookLink } from "./book-link";

export function Symptoms() {
  const [open, setOpen] = useState(-1);
  return (
    <section id="services" className="section scroll-mt-20 md:min-h-[80svh]">
      <div className="wrap">
        <div className="mx-auto max-w-2xl">
          <h2 className="h2 text-center" data-reveal>
            Sound <span className="text-ice">familiar?</span>
          </h2>
          <p className="lead mx-auto mt-5 text-center" data-reveal="1">
            Most air-conditioning trouble starts with one of three things. Tap the one you are hearing.
          </p>
          <ul className="mt-10 flex flex-col gap-3" data-reveal="2">
            {symptoms.map((s, i) => (
              <li key={s.title} className="card overflow-hidden">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open === i}
                    aria-controls={`sym-${i}`}
                    onClick={() => setOpen(open === i ? -1 : i)}
                    className="flex min-h-20 w-full cursor-pointer items-center justify-between gap-4 p-6 text-left text-xl font-medium tracking-tight active:scale-[0.99] md:text-2xl"
                    style={{ transition: "transform 160ms var(--ease-out)" }}
                  >
                    {s.title}
                    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-ice transition-transform duration-200" style={{ transform: open === i ? "rotate(45deg)" : "none", transitionTimingFunction: "var(--ease-out)" }}>+</span>
                  </button>
                </h3>
                <div id={`sym-${i}`} className="acc" data-open={open === i} inert={open !== i}>
                  <div>
                    <div className="space-y-3 px-6 pb-6">
                      <p><span className="text-muted">Likely cause. </span>{s.cause}</p>
                      <p><span className="text-muted">What we check. </span>{s.check}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-center" data-reveal="3">
            <BookLink need="Repair">Book a diagnostic visit</BookLink>
          </div>
        </div>
      </div>
    </section>
  );
}
