import { site, stats } from "@/lib/site-data";
import { BookLink } from "./book-link";
import { Img } from "./img";

export function StatRow() {
  return (
    <section id="stats" className="section">
      <div className="wrap">
        {/* Florida sun photo: a band on top on phones; behind the text on larger screens, darkened on the left so the copy reads. */}
        <div className="card relative overflow-hidden p-0">
          <Img
            src="/media/florida.webp"
            alt="An outdoor AC unit against a sunlit stucco wall under a palm shadow"
            width={1600}
            height={893}
            loading="lazy"
            className="aspect-[16/9] w-full object-cover object-right md:absolute md:object-[100%_100%] md:inset-0 md:aspect-auto md:h-full"
          />
          <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-r from-base via-base/80 to-base/0 md:block" />
          <div className="relative p-7 md:max-w-[60%] md:p-12">
            <h2 className="h2" data-reveal>
              Built for <span className="text-ice">Florida.</span>
            </h2>
            <dl className="mt-8 grid gap-6 md:mt-10" data-reveal="1">
              {stats.map((s) => (
                <div key={s.value} className="border-t border-line pt-5 first:border-0 first:pt-0 sm:grid sm:grid-cols-[15.5rem_1fr] sm:items-baseline sm:gap-6">
                  <dt className="num text-[clamp(1.75rem,2.6vw,2.25rem)] leading-none font-semibold whitespace-nowrap text-ice">{s.value}</dt>
                  <dd className="mt-2 text-muted sm:mt-0">{s.label}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row" data-reveal="2">
              <BookLink />
              <a href={site.phoneHref} className="btn">
                Call <span className="num">{site.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
