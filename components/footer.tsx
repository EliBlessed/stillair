import Link from "next/link";
import { nav, services, site } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="border-t border-line pt-16 pb-10">
      <div className="wrap">
        <p className="text-[clamp(3.5rem,17vw,13rem)] leading-[0.85] font-semibold tracking-[-0.05em] text-ink/90" aria-hidden>
          {site.brand}
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="inline-block rounded-full border border-line px-3 py-1 text-sm text-muted">{site.demoLabel}</p>
            <p className="mt-4 max-w-xs text-muted">{site.tagline} {site.area}.</p>
          </div>
          <div>
            <p className="mb-3 text-[1rem] font-medium">Contact</p>
            <ul className="space-y-2 text-muted">
              <li><a href={site.phoneHref} className="num hover:text-ink">{site.phone}</a></li>
              <li><a href={`mailto:${site.email}`} className="break-all hover:text-ink">{site.email}</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-[1rem] font-medium">Pages</p>
            <ul className="space-y-2 text-muted">
              {nav.map((l) => <li key={l.label}><Link href={l.href} prefetch={false} className="hover:text-ink">{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-[1rem] font-medium">Services</p>
            <ul className="space-y-2 text-muted">
              {services.map((s) => <li key={s.name}>{s.name}</li>)}
            </ul>
          </div>
        </div>
        <p className="mt-14 flex flex-wrap items-center gap-x-2 text-sm text-muted">
          <span>{site.credit.text}</span>
          <a href={site.credit.href} target="_blank" rel="noopener" className="rounded-full border border-line px-3 py-1 text-ink transition-colors hover:bg-white/5">
            Contact<span className="sr-only-text"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </footer>
  );
}

