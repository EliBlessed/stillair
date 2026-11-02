"use client";
import { useState, type KeyboardEvent, type ReactNode } from "react";
import { central, installChoices, mini, prices, repairSymptoms, rule, site, type Range } from "@/lib/site-data";
import { Money } from "./roll";
import { BookLink } from "./book-link";

const tabs = ["Repair", "Replace", "Install"] as const;

function Row({ label, note, range }: { label: string; note?: string; range: Range }) {
  return (
    <div className="flex flex-col gap-1 border-t border-line py-5 first:border-t-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <div>
        <p className="font-medium">{label}</p>
        {note && <p className="small">{note}</p>}
      </div>
      <p className="text-[clamp(1.75rem,5vw,3rem)] leading-none font-medium whitespace-nowrap"><Money range={range} /></p>
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

function Repair() {
  const [id, setId] = useState(repairSymptoms[0].id);
  const s = repairSymptoms.find((x) => x.id === id)!;
  return (
    <>
      <p className="mb-4 text-muted" id="sym-q">What is it doing?</p>
      <div role="group" aria-labelledby="sym-q" className="flex flex-wrap gap-2">
        {repairSymptoms.map((x) => <button key={x.id} type="button" className="chip" aria-pressed={x.id === id} onClick={() => setId(x.id)}>{x.label}</button>)}
      </div>
      <Out need="Repair" message={`Symptom: ${s.label}.`} cta="Book a diagnostic visit">
        <p className="mb-2 text-muted">Most likely: {s.likely}</p>
        <Row label="Diagnostic visit" note="Credited to the repair if you go ahead" range={prices.diagnostic} />
        <Row label="Common repairs" range={prices.repair} />
        {s.compressor && <Row label="If it is the compressor" note="Compressor replacement" range={prices.compressor} />}
      </Out>
    </>
  );
}

function Replace() {
  const [age, setAge] = useState(rule.defaultAge);
  const [quote, setQuote] = useState(rule.defaultQuote);
  const score = age * quote;
  const replace = score > rule.limit;
  return (
    <>
      <div className="grid gap-8 md:grid-cols-2">
        <label className="block">
          <span className="flex justify-between"><span>Unit age</span><span className="num">{age} {age === 1 ? "year" : "years"}</span></span>
          <input type="range" min={rule.ageMin} max={rule.ageMax} value={age} onChange={(e) => setAge(+e.target.value)} />
        </label>
        <label className="block">
          <span className="flex justify-between"><span>Repair quote</span><span className="num">${quote.toLocaleString("en-US")}</span></span>
          <input type="range" min={rule.quoteMin} max={rule.quoteMax} step={rule.quoteStep} value={quote} onChange={(e) => setQuote(+e.target.value)} />
        </label>
      </div>
      <Out need={replace ? "Replace" : "Repair"} message={`Unit age ${age} years, repair quote $${quote.toLocaleString("en-US")}.`}>
        <p className="text-[clamp(2rem,6vw,3.5rem)] leading-none font-semibold tracking-[-0.03em]" aria-live="polite">
          {replace ? "Replacing is likely smarter" : "Repair it"}
        </p>
        <p className="small mt-3">
          The ${rule.limit.toLocaleString("en-US")} rule, a common contractor rule of thumb: <span className="num">{age} × ${quote.toLocaleString("en-US")} = ${score.toLocaleString("en-US")}</span>, which is {replace ? "over" : "not over"} <span className="num">${rule.limit.toLocaleString("en-US")}</span>.
        </p>
        <h3 className="mt-8 mb-1 font-medium">If you replace: central (ducted), whole home</h3>
        {central.map((c) => <Row key={c.id} label={c.size} note={c.note} range={c.price} />)}
      </Out>
    </>
  );
}

function Install() {
  const [id, setId] = useState(installChoices[0].id);
  const c = installChoices.find((x) => x.id === id)!;
  return (
    <>
      <p className="mb-4 text-muted" id="inst-q">What are you doing?</p>
      <div role="group" aria-labelledby="inst-q" className="flex flex-wrap gap-2">
        {installChoices.map((x) => <button key={x.id} type="button" className="chip" aria-pressed={x.id === id} onClick={() => setId(x.id)}>{x.label}</button>)}
      </div>
      <Out need="Install" message={`Install: ${c.label}.`}>
        <p className="mb-2 text-muted">{c.why}</p>
        {c.kind === "mini"
          ? mini.map((m) => <Row key={m.id} label={`Mini-split, ${m.btu}`} note={`${m.room}, ${m.sqft} (typical)`} range={m.price} />)
          : central.map((m) => <Row key={m.id} label={`Central (ducted), ${m.size}`} note={m.note} range={m.price} />)}
      </Out>
    </>
  );
}

export function DecisionTool() {
  const [tab, setTab] = useState(0);
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const n = (tab + d + tabs.length) % tabs.length;
    setTab(n);
    document.getElementById(`tab-${n}`)?.focus();
  };
  return (
    <section id="tools" className="section scroll-mt-20">
      <div className="wrap">
        <h2 className="h2 max-w-[14ch]" data-reveal>Repair, replace or install?</h2>
        <p className="lead mt-5" data-reveal="1">Three quick questions, typical South Florida ranges, and a clear next step.</p>
        <div className="card mt-10 p-5 md:mt-14 md:p-10" data-reveal="2">
          <div role="tablist" aria-label="Repair, replace or install" className="mb-8 flex gap-2" onKeyDown={onKey}>
            {tabs.map((t, i) => (
              <button key={t} id={`tab-${i}`} role="tab" type="button" className="chip flex-1 sm:flex-none sm:px-8" aria-selected={tab === i} aria-controls="tool-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>
          <div id="tool-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {tab === 0 ? <Repair /> : tab === 1 ? <Replace /> : <Install />}
          </div>
        </div>
      </div>
    </section>
  );
}

