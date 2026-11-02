"use client";
import { useEffect, useRef, useState } from "react";
import { money, type Range } from "@/lib/site-data";

/** Number that rolls to its new value (450ms ease-out). Instant with reduced motion. */
export function Roll({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const ms = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450;
    const a = from.current;
    const t0 = performance.now();
    let id = 0;
    const tick = (t: number) => {
      const k = ms ? Math.min((t - t0) / ms, 1) : 1;
      const cur = a + (value - a) * (1 - (1 - k) ** 4);
      from.current = cur;
      setShown(cur);
      if (k < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [value]);
  return <>{Math.round(shown).toLocaleString("en-US")}</>;
}

/** "$2,500–$5,000" with both ends rolling. The sr-only copy gives screen readers the settled value. */
export function Money({ range }: { range: Range }) {
  return (
    <span className="num">
      <span className="sr-only-text">{money(range)}</span>
      <span aria-hidden>$<Roll value={range.low} />–$<Roll value={range.high} /></span>
    </span>
  );
}

