"use client";
import { useState } from "react";
import { central, centralRoom, mini, money, site } from "@/lib/site-data";
import { Img } from "./img";
import { Money } from "./roll";

const mid = central[1]; // the typical Florida home

const options = [
  ...mini.map((m) => ({ id: m.id, chip: m.chip, title: m.btu, room: m.room, sqft: m.sqft, price: m.price, photo: m.photo, extra: "" })),
  { id: "central", chip: centralRoom.chip, title: `${mid.size} (${mid.note})`, room: centralRoom.room, sqft: centralRoom.sqft, price: mid.price, photo: centralRoom.photo, extra: central.filter((c) => c !== mid).map((c) => `${c.size} ${money(c.price)}`).join(" · ") },
];

export function SizePicker() {
  const [i, setI] = useState(0);
  const o = options[i];
  return (
    <section id="size" className="section scroll-mt-20">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div className="frame aspect-[4/3] lg:aspect-[5/4]" data-reveal>
          {options.map((x, n) => (
            <Img
              key={x.id}
              src={x.photo}
              alt={n === i ? `${x.room}, a typical room for ${x.title}` : ""}
              aria-hidden={n !== i}
              width={1376}
              height={768}
              loading="lazy"
              className="absolute inset-0"
              style={{ opacity: n === i ? 1 : 0, transition: "opacity 400ms var(--ease-out)" }}
            />
          ))}
        </div>
        <div>
          <h2 className="h2" data-reveal>What size do I need?</h2>
          <div role="group" aria-label="Room size" className="mt-8 flex flex-wrap gap-2" data-reveal="1">
            {options.map((x, n) => <button key={x.id} type="button" className="chip num" aria-pressed={n === i} onClick={() => setI(n)}>{x.chip}</button>)}
          </div>
          <div className="mt-8" aria-live="polite" data-reveal="2">
            <p className="text-sm text-muted">Typical size</p>
            <p className="text-2xl font-medium tracking-tight">{o.title}</p>
            <p className="mt-3 text-lg">{o.room}</p>
            <p className="text-muted">{o.sqft} (typical)</p>
            <p className="mt-6 text-sm text-muted">Typical installed price</p>
            <p className="text-[clamp(2.25rem,6vw,3.5rem)] leading-tight font-medium"><Money range={o.price} /></p>
            {o.extra && <p className="small num">Also: {o.extra}</p>}
            <p className="small mt-4">{site.rangeNote}</p>
            <p className="small mt-2">{site.sizeFootnote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

