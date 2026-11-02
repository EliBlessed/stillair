import { site, stats } from "@/lib/site-data";
import { BookLink } from "./book-link";

export function StatRow() {
  return (
    <section id="stats" className="section md:min-h-[80svh]">
      <div className="wrap">
        <div className="card p-7 md:p-12">
          <h2 className="h2" data-reveal>
            Built for <span className="text-ice">Florida.</span>
          </h2>
          <dl className="mt-10 grid gap-8 md:mt-12 md:grid-cols-3 md:gap-10" data-reveal="1">
            {stats.map((s) => (
              <div key={s.value} className="border-t border-line pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8 first:border-0 first:pt-0 first:pl-0">
                <dt className="num text-[clamp(2.25rem,4.5vw,3.5rem)] leading-none font-semibold text-ice">{s.value}</dt>
                <dd className="mt-3 text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row md:mt-12" data-reveal="2">
            <BookLink />
            <a href={site.phoneHref} className="btn">
              Call <span className="num">{site.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
