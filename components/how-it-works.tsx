import { steps } from "@/lib/site-data";
import { Img } from "./img";

export function HowItWorks() {
  return (
    <section className="section">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <h2 className="h2" data-reveal>How it works</h2>
          <ol className="mt-10 flex flex-col gap-4">
            {steps.map((s, i) => (
              <li key={s.title} className="card p-6" data-reveal={i + 1 > 3 ? 3 : i + 1}>
                <h3 className="text-xl font-medium tracking-tight md:text-2xl">{s.title}</h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="frame aspect-[4/5]" data-reveal>
          <Img src="/media/technician.webp" alt="A technician checking an outdoor air-conditioning unit" width={896} height={1200} loading="lazy" />
        </div>
      </div>
    </section>
  );
}
