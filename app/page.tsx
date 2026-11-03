import { Hero } from "@/components/hero";
import { FeelDifference } from "@/components/feel-difference";
import { UnitScene } from "@/components/unit-scene";
import { DecisionTool } from "@/components/decision-tool";
import { SizePicker } from "@/components/size-picker";
import { StatRow } from "@/components/stat-row";
import { Plans } from "@/components/plans";
import { Booking } from "@/components/booking";

export const metadata = {
  title: { absolute: "Stillair: Cool. Finally. Air conditioning in South Florida" },
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <FeelDifference />
      <UnitScene />
      <DecisionTool />
      <SizePicker />
      <StatRow />
      <Plans />
      <Booking />
    </>
  );
}
