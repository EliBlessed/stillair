import { DemoForm, dayField, type Field } from "./demo-form";
import { Img } from "./img";
import { needs } from "@/lib/site-data";

const fields: Field[] = [
  { name: "name", label: "Name", required: true, auto: "name", half: true },
  { name: "phone", label: "Phone", kind: "tel", required: true, auto: "tel", half: true },
  { name: "zip", label: "ZIP code", kind: "zip", required: true, auto: "postal-code", half: true },
  { name: "need", label: "What do you need?", kind: "select", options: needs, required: true, half: true },
  dayField,
  { name: "message", label: "Message", kind: "textarea" },
];

export function Booking() {
  return (
    <section id="book" className="section md:min-h-[80svh]">
      <div className="wrap grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <h2 className="h2 mb-8" data-reveal>
            Book a <span className="text-ice">visit</span>
          </h2>
          <div data-reveal="1"><DemoForm id="book" fields={fields} submit="Request a visit" prefill /></div>
        </div>
        <div className="frame aspect-[4/5] lg:aspect-auto lg:min-h-[32rem]" data-reveal="2">
          <Img src="/media/calm-room.webp" alt="A calm, cool bedroom at dusk" width={896} height={1200} loading="lazy" />
        </div>
      </div>
    </section>
  );
}
