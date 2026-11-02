import { commercial, site } from "@/lib/site-data";
import { DemoForm, type Field } from "@/components/demo-form";
import { Img } from "@/components/img";

export const metadata = {
  title: "Commercial & ducted air conditioning",
  description: "Ducted installs, duct repair, rooftop units and airflow balancing for offices, shops and restaurants in South Florida. Demo concept site.",
  alternates: { canonical: "/commercial" },
};

const fields: Field[] = [
  { name: "business", label: "Business name", required: true, auto: "organization", half: true },
  { name: "contact", label: "Contact name", required: true, auto: "name", half: true },
  { name: "phone", label: "Phone", kind: "tel", required: true, auto: "tel", half: true },
  { name: "type", label: "Building type", kind: "select", options: commercial.buildingTypes, required: true, half: true },
  { name: "sqft", label: "Approx. square footage", kind: "number", half: true },
  { name: "units", label: "Number of units", kind: "number", half: true },
  { name: "message", label: "Message", kind: "textarea" },
];

export default function Commercial() {
  return (
    <>
      <section className="pt-28 pb-4 md:pt-36">
        <div className="wrap grid items-end gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h1 className="h1" data-reveal>{commercial.headline}</h1>
            <p className="lead mt-6 !text-ink/80" data-reveal="1">{commercial.who}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row" data-reveal="2">
              <a href="#survey" className="btn btn-ice">Request a site survey</a>
              <a href={site.phoneHref} className="btn">Call <span className="num">{site.phone}</span></a>
            </div>
          </div>
          <div className="frame aspect-[4/3]" data-reveal="1">
            <Img src="/media/commercial-rooftop.webp" alt="Rooftop air-conditioning units on a commercial building" width={1376} height={768} fetchPriority="high" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="frame aspect-[4/3] lg:aspect-auto lg:min-h-[28rem]" data-reveal>
            <Img src="/media/commercial-ducts.webp" alt="Ductwork running through a commercial ceiling" width={1376} height={768} loading="lazy" />
          </div>
          <div>
            <h2 className="h2" data-reveal>
              What we <span className="text-ice">handle</span>
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {commercial.cards.map((c, i) => (
                <li key={c.name} className="card p-6" data-reveal={Math.min(i + 1, 3)}>
                  <h3 className="text-xl font-medium tracking-tight">{c.name}</h3>
                  <p className="mt-2 text-muted">{c.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="card flex flex-col gap-6 p-7 md:flex-row md:items-end md:justify-between md:p-12" style={{ background: "#142130" }} data-reveal>
            <div className="max-w-2xl">
              <h2 className="h2 !text-[clamp(1.75rem,4.5vw,3rem)]">
                Maintenance <span className="text-ice">contracts</span>
              </h2>
              <p className="mt-4 text-xl">{commercial.contract.text}</p>
            </div>
            <p className="num text-2xl font-medium text-ice">{commercial.contract.price}</p>
          </div>
        </div>
      </section>

      <section id="survey" className="section scroll-mt-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div data-reveal>
            <h2 className="h2">
              Site <span className="text-ice">survey</span>
            </h2>
            <p className="lead mt-5">Tell us about the building. {site.area}.</p>
          </div>
          <div data-reveal="1"><DemoForm id="survey" fields={fields} submit="Request a site survey" /></div>
        </div>
      </section>
    </>
  );
}
