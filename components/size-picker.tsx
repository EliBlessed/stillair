"use client";
import { useState } from "react";
import { central, centralRoom, mini, money, site } from "@/lib/site-data";
import { Img } from "./img";
import { Money } from "./roll";
import { BookLink } from "./book-link";

const mid = central[1]; // the typical Florida home

const options = [
  ...mini.map((m) => ({ id: m.id, chip: m.chip, title: m.btu, room: m.room, sqft: m.sqft, price: m.price, photo: m.photo, extra: "" })),
  { id: "central", chip: centralRoom.chip, title: `${mid.size} (${mid.note})`, room: centralRoom.room, sqft: centralRoom.sqft, price: mid.price, photo: centralRoom.photo, extra: central.filter((c) => c !== mid).map((c) => `${c.size} ${money(c.price)}`).join(" · ") },
];

export function SizePicker() {
  const [i, setI] = useState(0);
  const o = options[i];
  return (
    <section id="size" className="section">
      <div className="wrap">
        <h2 className="h2" data-reveal>
          What <span className="text-ice">size</span> do I need?
        </h2>
      </div>
        {/* The room fills the section; the picker sits in a glass card in its corner (below it on phones). */}
        <div className="relative mt-8 md:mt-12" data-reveal="1">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-raised md:aspect-[16/9] lg:max-h-[92svh]">
            {options.map((x, n) => (
              <Img
                key={x.id}
                src={x.photo}
                alt={n === i ? `${x.room}, a typical room for ${x.title}` : ""}
                aria-hidden={n !== i}
                width={1376}
                height={768}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
                style={{ opacity: n === i ? 1 : 0, transition: "opacity 400ms var(--ease-out)" }}
              />
            ))}
          </div>
          <div className="mx-5 mt-4 rounded-[20px] border border-line bg-base/75 p-5 backdrop-blur-xl lg:absolute lg:right-8 lg:bottom-8 lg:mx-0 lg:mt-0 lg:w-[24rem] lg:p-6">
            <div role="group" aria-label="Room size" className="flex flex-wrap gap-2">
              {options.map((x, n) => <button key={x.id} type="button" className="chip num" aria-pressed={n === i} onClick={() => setI(n)}>{x.chip}</button>)}
            </div>
            <div className="mt-5" aria-live="polite">
              <p className="text-xl font-medium tracking-tight">{o.title}</p>
              <p className="text-muted">{o.room}, {o.sqft} (typical)</p>
              <p className="mt-4 text-sm text-muted">Typical installed price</p>
              <p className="text-[clamp(2rem,5vw,2.75rem)] leading-tight font-medium"><Money range={o.price} /></p>
              {o.extra && <p className="small num">Also: {o.extra}</p>}
              <p className="small mt-3">{site.rangeNote} {site.sizeFootnote}</p>
              <div className="mt-5">
                <BookLink need="Install" message={`Size guide: ${o.title} (${o.room}).`} />
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
