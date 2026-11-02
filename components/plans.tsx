import { plans, site } from "@/lib/site-data";
import { BookLink } from "./book-link";

export function Plans() {
  return (
    <section id="plans" className="section scroll-mt-20">
      <div className="wrap">
        <h2 className="h2" data-reveal>Plans and prices</h2>
        <p className="small mt-4" data-reveal="1">{site.rangeNote}</p>
        <ul className="mt-10 grid items-stretch gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
          {plans.map((p, i) => (
            <li
              key={p.id}
              data-reveal={i}
              className={`card flex flex-col p-7 md:p-9 ${p.featured ? "border-ice md:-translate-y-4" : ""}`}
              style={p.featured ? { background: "#142130" } : undefined}
            >
              <h3 className="text-xl font-medium">{p.name}</h3>
              <p className="num mt-6 text-5xl font-medium">{p.price}</p>
              <p className="small">{p.unit}</p>
              <ul className="mt-6 mb-8 flex flex-col gap-2">
                {p.points.map((pt) => <li key={pt} className="flex gap-3"><span aria-hidden className="text-ice">+</span>{pt}</li>)}
              </ul>
              <div className="mt-auto">
                <BookLink need={p.need} className={`btn w-full ${p.featured ? "btn-ice" : ""}`}>{p.cta}</BookLink>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

