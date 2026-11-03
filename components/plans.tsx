import { money, prices, site } from "@/lib/site-data";
import { BookLink } from "./book-link";

const points = ["2 tune-ups a year", "Priority visits in a heatwave", "15% off repairs"];

export function Plans() {
  return (
    <section id="plans" className="section scroll-mt-20">
      <div className="wrap">
        <div className="card grid gap-8 border-ice p-7 md:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16" style={{ background: "#142130" }}>
          <div>
            <h2 className="h2" data-reveal>
              The Comfort <span className="text-ice">Plan</span>
            </h2>
            <p className="lead mt-5" data-reveal="1">Most breakdowns start as small problems. Two visits a year catch them before a hot week does.</p>
          </div>
          <div data-reveal="2">
            <p className="num text-5xl font-medium md:text-6xl">${prices.comfortPlanPerYear}<span className="ml-2 text-lg text-muted">/ year</span></p>
            <ul className="mt-6 flex flex-col gap-2">
              {points.map((pt) => <li key={pt} className="flex gap-3"><span aria-hidden className="text-ice">+</span>{pt}</li>)}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BookLink need="Comfort Plan" className="btn btn-ice">Join the Comfort Plan</BookLink>
              <BookLink need="Tune-up" className="btn">One tune-up <span className="num">{money(prices.tuneUp)}</span></BookLink>
            </div>
            <p className="small mt-4">{site.rangeNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
