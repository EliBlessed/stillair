"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { nav, site } from "@/lib/site-data";
import { BookLink } from "./book-link";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className="fixed inset-x-3 top-3 z-50 mx-auto max-w-[1180px]">
      <div className="flex items-center justify-between gap-3 rounded-full border border-line bg-base/70 py-2 pr-2 pl-5 backdrop-blur-xl">
        <Link href="/" prefetch={false} className="text-xl font-semibold tracking-[-0.03em]" onClick={() => setOpen(false)}>
          {site.brand}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((l) => (
            <Link key={l.label} href={l.href} prefetch={false} className="rounded-full px-4 py-2 text-[0.95rem] text-muted transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={site.phoneHref} className="num hidden px-3 text-[0.95rem] lg:block">{site.phone}</a>
          <BookLink className="btn btn-ice hidden !min-h-11 md:inline-flex" />
          <a href={site.phoneHref} aria-label={`Call ${site.phone}`} className="btn btn-ice !size-11 !min-h-0 !p-0 md:hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
          </a>
          <button
            type="button"
            className="btn !size-11 !min-h-0 !p-0 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>
      <div
        id="mobile-menu"
        hidden={!open}
        className="mt-2 rounded-3xl border border-line bg-base/90 p-3 backdrop-blur-xl md:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {nav.map((l) => (
            <Link key={l.label} href={l.href} prefetch={false} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3.5 text-lg">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-2 flex flex-col gap-2 px-1 pb-1">
          <a href={site.phoneHref} className="btn num">{site.phone}</a>
          <span onClick={() => setOpen(false)} className="contents"><BookLink /></span>
        </div>
      </div>
    </header>
  );
}

