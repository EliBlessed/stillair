"use client";
import { useState, type KeyboardEvent, type ReactNode } from "react";
import { central, prices, repairSymptoms, rule, site, type Range } from "@/lib/site-data";
import { Money } from "./roll";
import { Img } from "./img";
import { BookLink } from "./book-link";

const tabs = ["Repair", "Replace"] as const;

function Row({ label, note, range }: { label: string; note?: string; range: Range }) {
  return (
    <div className="flex flex-col gap-1 border-t border-line py-4 first:border-t-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <div>
        <p className="font-medium">{label}</p>
        {note && <p className="small">{note}</p>}
      </div>
      <p className="text-[clamp(1.5rem,3.5vw,2.25rem)] leading-none font-medium whitespace-nowrap"><Money range={range} /></p>
    </div>
  );
}

function Out({ children, need, message, cta }: { children: ReactNode; need: string; message: string; cta?: string }) {
  return (
    <div className="mt-8 rounded-[20px] bg-base p-5 md:p-8">
      {children}
      <p className="small mt-4">{site.rangeNote}</p>
      <div className="mt-6"><BookLink need={need} message={message}>{cta ?? "Book a visit"}</BookLink></div>
    </div>
  );
}

type Pick = { id: string; setId: (id: string) => void };

function Symptoms({ id, setId }: Pick) {
  return (
    <>
      <p className="mb-4 text-muted" id="sym-q">What is it doing?</p>
      <div role="group" aria-labelledby="sym-q" className="flex flex-wrap gap-2">
        {repairSymptoms.map((x) => <button key={x.id} type="button" className="chip" aria-pressed={x.id === id} onClick={() => setId(x.id)}>{x.label}</button>)}
      </div>
    </>
  );
}

function Repair({ id, setId }: Pick) {
  const s = repairSymptoms.find((x) => x.id === id)!;
  return (
    <>
      <Symptoms id={id} setId={setId} />
      <Out need="Repair" message={`Symptom: ${s.label}.`} cta="Book a diagnostic visit">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10">
          {/* the likely part, so the answer is a picture first and prices second */}
          <div className="frame aspect-[16/10] lg:aspect-auto lg:min-h-80">
            {repairSymptoms.map((x) => (
              <Img key={x.id} src={x.photo} alt={x.id === id ? `Likely part: ${x.likely}` : ""} aria-hidden={x.id !== id} width={560} height={420} loading="lazy" className="absolute inset-0" style={{ opacity: x.id === id ? 1 : 0, transition: "opacity 300ms var(--ease-out)" }} />
            ))}
          </div>
          <div>
            <p className="mb-2 text-lg font-semibold tracking-tight md:text-xl">Most likely: {s.likely}</p>
            <Row label="Diagnostic visit" note="Credited to the repair if you go ahead" range={prices.diagnostic} />
            {s.fixes.map((f) => <Row key={f.label} label={f.label} note={f.note} range={f.range} />)}
            {s.big && <Row label={s.big.label} note={s.big.note} range={s.big.range} />}
          </div>
        </div>
      </Out>
    </>
  );
}

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const typical = (r: Range) => Math.round((r.low + r.high) / 2 / 50) * 50; // middle of the range, to the nearest $50

// The $5,000 rule: age × repair cost. No quote needed: each likely repair for the symptom is tested at its typical price.
function Replace({ id, setId }: Pick) {
  const [age, setAge] = useState(rule.defaultAge);
  const [quote, setQuote] = useState<number | null>(null); // null = no quote yet
  const s = repairSymptoms.find((x) => x.id === id)!;
  const repairs = quote === null
    ? [...s.fixes, ...(s.big ? [s.big] : [])].map((f) => ({ label: f.label, cost: typical(f.range) }))
    : [{ label: "Your quote", cost: quote }];
  const over = repairs.filter((r) => r.cost * age > rule.limit).length;
  const replace = over === repairs.length; // every likely repair fails the test
  const verdict = over === 0 ? "Repair it" : replace ? "Replacing is likely smarter" : "It depends on the cause";
  return (
    <>
      <p className="mb-8 max-w-2xl text-lg">
        Older unit acting up? Pick what it is doing and set its age. Contractors use a simple test: age × repair cost. Over {usd(rule.limit)}, a new unit usually makes more sense than the repair.
      </p>
      <Symptoms id={id} setId={setId} />
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <label className="block">
          <span className="flex justify-between gap-4"><span>How old is your unit?</span><span className="num shrink-0">{age} {age === 1 ? "year" : "years"}</span></span>
          <input type="range" min={rule.ageMin} max={rule.ageMax} value={age} onChange={(e) => setAge(+e.target.value)} />
        </label>
        <div>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="size-5 accent-[var(--color-ice)]" checked={quote !== null} onChange={(e) => setQuote(e.target.checked ? rule.defaultQuote : null)} />
            <span>I already have a repair quote</span>
          </label>
          {quote !== null && (
            <label className="mt-4 block">
              <span className="flex justify-between gap-4"><span>Your quote</span><span className="num shrink-0">{usd(quote)}</span></span>
              <input type="range" min={rule.quoteMin} max={rule.quoteMax} step={rule.quoteStep} value={quote} onChange={(e) => setQuote(+e.target.value)} />
            </label>
          )}
        </div>
      </div>
      <Out need={replace ? "Replace" : "Repair"} message={`Unit age ${age} years. ${quote === null ? `Symptom: ${s.label}.` : `Repair quote ${usd(quote)}.`}`}>
        <p className="text-[clamp(2rem,6vw,3.5rem)] leading-none font-semibold tracking-[-0.03em]" aria-live="polite">
          {verdict}
        </p>
        {over > 0 && !replace && <p className="mt-3 max-w-xl">A cheap fix is worth doing; a big one is not. A diagnostic visit ({usd(prices.diagnostic.low)}–{usd(prices.diagnostic.high)}, credited to the repair) tells you which it is.</p>}
        <p className="small mt-3">The {usd(rule.limit)} rule, a common contractor rule of thumb.{quote === null && ` Typical South Florida repair prices for "${s.label.toLowerCase()}".`}</p>
        <div className="mt-6">
          {repairs.map((r) => {
            const score = r.cost * age;
            return (
              <div key={r.label} className="flex flex-col gap-1 border-t border-line py-4 first:border-t-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <div>
                  <p className="font-medium">{r.label}</p>
                  <p className="small num">{age} × {usd(r.cost)} = {usd(score)}</p>
                </div>
                <p className={`text-xl font-semibold whitespace-nowrap ${score > rule.limit ? "text-ice" : ""}`}>{score > rule.limit ? "Replace" : "Repair"}</p>
              </div>
            );
          })}
        </div>
        <h3 className="mt-8 mb-1 font-medium">If you replace: central (ducted), whole home</h3>
        {central.map((c) => <Row key={c.id} label={c.size} note={c.note} range={c.price} />)}
      </Out>
    </>
  );
}

export function DecisionTool() {
  const [tab, setTab] = useState(0);
  const [id, setId] = useState(repairSymptoms[0].id); // shared, so a symptom picked in Repair carries to Replace
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const n = (tab + d + tabs.length) % tabs.length;
    setTab(n);
    document.getElementById(`tab-${n}`)?.focus();
  };
  return (
    <section id="tools" className="section">
      <div className="wrap">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2 className="h2 max-w-[14ch]" data-reveal>
            Repair or <span className="text-ice">replace?</span>
          </h2>
          <p className="lead md:max-w-sm" data-reveal="1">Tell us what it is doing and see the likely cause and typical South Florida prices. Older unit? The Replace tab tells you if fixing it is worth it.</p>
        </div>
        <div className="card mt-10 p-5 md:mt-14 md:p-10" data-reveal="2">
          <div role="tablist" aria-label="Repair or replace" className="mb-8 flex gap-1.5 sm:gap-2" onKeyDown={onKey}>
            {tabs.map((t, i) => (
              <button key={t} id={`tab-${i}`} role="tab" type="button" className="chip flex-1 whitespace-nowrap px-3 text-sm sm:flex-none sm:px-8 sm:text-[1rem]" aria-selected={tab === i} aria-controls="tool-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>
          <div id="tool-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {tab === 0 ? <Repair id={id} setId={setId} /> : <Replace id={id} setId={setId} />}
          </div>
        </div>
      </div>
    </section>
  );
}

