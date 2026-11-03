"use client";
import { useEffect, useState, type FormEvent } from "react";
import { site } from "@/lib/site-data";

export type Field = {
  name: string;
  label: string;
  kind?: "text" | "tel" | "zip" | "number" | "select" | "textarea";
  options?: string[];
  required?: boolean;
  auto?: string;
  half?: boolean;
};

const days = ["Any day", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const dayField: Field = { name: "day", label: "Preferred day", kind: "select", options: days, half: true };

function check(f: Field, v: string) {
  const t = v.trim();
  if (!t) return f.required ? `Enter your ${f.label.toLowerCase()}.` : "";
  if (f.kind === "tel" && t.replace(/\D/g, "").length < 10) return "Enter a 10-digit phone number.";
  if (f.kind === "zip" && !/^\d{5}$/.test(t)) return "Enter a 5-digit ZIP code.";
  if (f.kind === "number" && !/^[\d,.+\s]+$/.test(t)) return "Use numbers only.";
  return "";
}

/** A form that validates on the page and sends nothing. `prefill` listens for the BookLink event. */
export function DemoForm({ id, fields, submit, prefill }: { id: string; fields: Field[]; submit: string; prefill?: boolean }) {
  const [v, setV] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!prefill) return;
    const on = (e: Event) => {
      const { need, message } = (e as CustomEvent<{ need?: string; message?: string }>).detail;
      setV((p) => ({ ...p, ...(need && { need }), ...(message && { message }) }));
      setDone(false);
    };
    addEventListener("prefill", on);
    return () => removeEventListener("prefill", on);
  }, [prefill]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    fields.forEach((f) => { const m = check(f, v[f.name] ?? ""); if (m) next[f.name] = m; });
    setErrors(next);
    const bad = fields.find((f) => next[f.name]);
    if (bad) return document.getElementById(`${id}-${bad.name}`)?.focus();
    setDone(true);
    // Sends nothing: this is a demo.
    requestAnimationFrame(() => document.getElementById(`${id}-thanks`)?.focus());
  };

  if (done) {
    return (
      <div id={`${id}-thanks`} tabIndex={-1} role="status" className="card p-7 outline-none md:p-10">
        <h3 className="h2 !text-[clamp(1.75rem,4vw,2.5rem)]">Thank you</h3>
        <p className="mt-4 text-lg">{site.demoThanks}</p>
        <p className="mt-6 border-t border-line pt-6 text-muted">
          Want a site like this for your business? It was designed and built by Elijah.{" "}
          <a href={site.credit.href} target="_blank" rel="noopener" className="text-ink underline underline-offset-4 hover:text-ice">
            Contact Elijah<span className="sr-only-text"> (opens in a new tab)</span>
          </a>
        </p>
        <a href={`#${id}`} className="btn mt-8" onClick={() => { setDone(false); setV({}); }}>Back to the form</a>
      </div>
    );
  }

  return (
    <form id={`${id}-form`} noValidate onSubmit={onSubmit} className="card grid gap-5 p-6 sm:grid-cols-2 md:p-9">
      {fields.map((f) => {
        const fid = `${id}-${f.name}`;
        const err = errors[f.name];
        const common = {
          id: fid,
          name: f.name,
          className: "field",
          value: v[f.name] ?? "",
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${fid}-err` : undefined,
          autoComplete: f.auto,
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV((p) => ({ ...p, [f.name]: e.target.value })),
        } as const;
        return (
          <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
            <label htmlFor={fid} className="mb-2 block text-[0.95rem]">
              {f.label}{f.required ? <span className="text-muted"> (required)</span> : null}
            </label>
            {f.kind === "textarea" ? <textarea {...common} rows={4} />
              : f.kind === "select" ? (
                <select {...common}>
                  {f.name !== "day" && <option value="">Choose one</option>}
                  {f.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input {...common} type={f.kind === "tel" ? "tel" : "text"} inputMode={f.kind === "zip" || f.kind === "number" ? "numeric" : f.kind === "tel" ? "tel" : undefined} maxLength={f.kind === "zip" ? 5 : undefined} />
              )}
            {err && <p id={`${fid}-err`} className="err">{err}</p>}
          </div>
        );
      })}
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-ice w-full sm:w-auto">{submit}</button>
      </div>
    </form>
  );
}
