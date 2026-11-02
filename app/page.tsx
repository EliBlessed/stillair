import { Hero } from "@/components/hero";
import { Symptoms } from "@/components/symptoms";
import { UnitScene } from "@/components/unit-scene";
import { DecisionTool } from "@/components/decision-tool";
import { SizePicker } from "@/components/size-picker";
import { Plans } from "@/components/plans";
import { HowItWorks } from "@/components/how-it-works";
import { Booking } from "@/components/booking";

export const metadata = {
  title: { absolute: "Stillair: Cool. Finally. Air conditioning in South Florida" },
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Symptoms />
      <UnitScene />
      <DecisionTool />
      <SizePicker />
      <Plans />
      <HowItWorks />
      <Booking />
    </>
  );
}
