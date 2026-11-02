// Single source of truth: every price, size, plan, symptom, service and contact detail.
// Components only read from here, so editing a value changes it everywhere.

export type Range = { low: number; high: number };

/** "$89–$150" */
export const money = (r: Range) => `$${r.low.toLocaleString("en-US")}–$${r.high.toLocaleString("en-US")}`;

export const site = {
  brand: "Stillair",
  tagline: "Cool. Finally.",
  phone: "(305) 555-0142", // 555-01xx is reserved for fiction
  phoneHref: "tel:+13055550142",
  email: "hello@stillair.example",
  area: "Serving South Florida",
  demoLabel: "Demo concept · placeholder brand",
  rangeNote: "Typical South Florida ranges, not a quote. A home visit sets the real price.",
  sizeFootnote: "A proper load calculation sets the real size. This is a guide.",
  demoThanks: "This is a demo site, so no booking was made and nothing was sent.",
  credit: { text: "Site design & build by Elijah", href: "https://www.linkedin.com/in/elijah-johnson-data-ai/" },
};

export const nav = [
  { label: "Services", href: "/#services" },
  { label: "Tools", href: "/#tools" },
  { label: "Plans", href: "/#plans" },
  { label: "Commercial", href: "/commercial" },
];

export const prices = {
  diagnostic: { low: 89, high: 150 }, // credited to the repair if you go ahead
  // Per-part ranges (researched 2026-11-02; national and Florida cost guides, see BUILD-NOTES "Repair tool prices").
  capacitor: { low: 150, high: 350 },
  contactor: { low: 130, high: 300 },
  thermostat: { low: 100, high: 400 },
  controlBoard: { low: 200, high: 800 },
  refrigerantLeak: { low: 250, high: 1600 }, // find and fix the leak, then recharge
  fanMotor: { low: 200, high: 700 }, // outdoor condenser fan motor
  blowerMotor: { low: 450, high: 2000 }, // indoor blower motor
  drainLine: { low: 75, high: 250 },
  condensatePump: { low: 100, high: 500 },
  coilCleaning: { low: 100, high: 400 },
  evaporatorCoil: { low: 650, high: 2700 },
  compressor: { low: 850, high: 2800 },
  tuneUp: { low: 89, high: 249 },
  comfortPlanPerYear: 219,
};

export const plans = [
  {
    id: "tune-up",
    name: "Tune-up",
    need: "Tune-up",
    price: money(prices.tuneUp),
    unit: "typical range",
    points: ["A full check of a running system", "Cleaning and a written report"],
    cta: "Book a tune-up",
  },
  {
    id: "comfort",
    name: "Comfort Plan",
    need: "Comfort Plan",
    price: `$${prices.comfortPlanPerYear}`,
    unit: "/ year",
    points: ["2 tune-ups a year", "Priority visits", "15% off repairs"],
    cta: "Join the Comfort Plan",
    featured: true,
  },
  {
    id: "repair",
    name: "Repair visit",
    need: "Repair",
    price: money(prices.diagnostic),
    unit: "diagnostic, typical range",
    points: ["Credited to the repair if you go ahead", "Written quote before any work"],
    cta: "Book a diagnostic visit",
  },
];

export const services = [
  { name: "Repair", href: "/#tools", note: "Diagnose the fault, quote it in writing, fix it." },
  { name: "Replacement", href: "/#tools", note: "Honest advice on when a repair stops making sense." },
  { name: "Installation", href: "/#tools", note: "Mini-split and central (ducted) systems, sized properly." },
  { name: "Tune-ups", href: "/#plans", note: "Catch small problems before a hot week finds them." },
  { name: "Comfort Plan", href: "/#plans", note: "Two tune-ups a year and priority visits." },
];

export const symptoms = [
  {
    title: "It's blowing warm air",
    cause: "Often a failing capacitor, low refrigerant or a coil that can't shed heat.",
    check: "We check refrigerant pressure, the capacitor, the compressor start and both coils.",
  },
  {
    title: "It's suddenly loud",
    cause: "Usually a worn fan motor, a loose panel or a compressor under strain.",
    check: "We check the fan blades and motor, mounting, and the compressor's running sound and draw.",
  },
  {
    title: "My bill jumped",
    cause: "A system working harder than it should: dirty coils, weak airflow or a leak.",
    check: "We check coil condition, airflow, refrigerant charge and how long it runs to reach temperature.",
  },
];

export const parts = [
  { name: "Fan and motor", note: "We check the blades, bearings and motor draw." },
  { name: "Condenser coil", note: "We check for dirt, damage and poor heat transfer." },
  { name: "Compressor", note: "We check its start, running draw and sound." },
  { name: "Capacitor", note: "We test it against its rating and look for swelling." },
  { name: "Refrigerant lines", note: "We check insulation, kinks and signs of a leak." },
];

// Frame sequences. Drop frame-0001.webp … frame-NNNN.webp into the folder and set `count`.
// count 0 = no frames yet: the scene shows the still placeholders instead.
// The hero holds at 91° while the outdoor install plays (frames 1–98 of 212), then cools.
export const heroHold = 0.45;
export const frames = {
  hero: { dir: "/media/hero", phoneDir: "/media/hero-phone", count: 212 }, // outdoor install (Gemini) -> push into the wall -> room pulls back and cools (Gemini, reversed)
  unit: { dir: "/media/unit", phoneDir: "/media/unit", count: 0 },
};

export const stills = {
  hero: ["/media/hero-hot.webp", "/media/hero-cool.webp"],
  unit: ["/media/unit-assembled.webp"],
};

export const temps = { hot: 91, mid: 84, cool: 72 };

export const heroStages = [
  { temp: 91, text: "Heavy air." },
  { temp: 84, text: "Breathing again." },
  { temp: 72, text: "Cool. Finally." },
];

// Matched hot/cool pair of the same room (Flow stills S1 and S2, approved 2026-11-02).
export const roomCompare = {
  hot: "/media/room-hot.webp",
  cool: "/media/room-cool.webp",
  caption: "Drag to cool it down.",
};

// Sources:
// - 3 tons: typical cooling load for an average Florida single-family home.
// - 14.3 SEER2 & Jan 1, 2023: U.S. Department of Energy regional efficiency standard for
//   new split-system central air conditioners in the Southeast (10 CFR 430.32(c), effective Jan 1, 2023).
export const stats = [
  { value: "3 tons", label: "Typical size for a Florida home" },
  { value: "14.3 SEER2", label: "Federal minimum efficiency for new central AC in the Southeast since 2023" },
  { value: "Jan 1, 2023", label: "When the Southeast efficiency rule took effect" },
];

// Repair tab
type Fix = { label: string; note?: string; range: Range };
export const repairSymptoms: { id: string; label: string; likely: string; fixes: Fix[]; big?: Fix }[] = [
  {
    id: "warm", label: "Blowing warm air", likely: "A failed capacitor or a refrigerant leak. Less often, the compressor.",
    fixes: [
      { label: "Capacitor", note: "The part that starts the motors. A common Florida failure in summer heat.", range: prices.capacitor },
      { label: "Refrigerant leak", note: "Find and fix the leak, then recharge", range: prices.refrigerantLeak },
    ],
    big: { label: "If it is the compressor", note: "Compressor replacement", range: prices.compressor },
  },
  {
    id: "loud", label: "Loud or rattling", likely: "A worn fan motor or a loose panel. Less often, a compressor under strain.",
    fixes: [
      { label: "Outdoor fan motor", note: "Grinding or squealing outside", range: prices.fanMotor },
      { label: "Indoor blower motor", note: "Rattling or humming inside", range: prices.blowerMotor },
    ],
    big: { label: "If it is the compressor", note: "Compressor replacement", range: prices.compressor },
  },
  {
    id: "off", label: "Won't turn on", likely: "A capacitor, contactor or thermostat. Check the breaker first.",
    fixes: [
      { label: "Capacitor", range: prices.capacitor },
      { label: "Contactor", note: "The switch that tells the outdoor unit to run", range: prices.contactor },
      { label: "Thermostat", range: prices.thermostat },
    ],
    big: { label: "If it is the control board", note: "Control board replacement", range: prices.controlBoard },
  },
  {
    id: "leak", label: "Water leaking indoors", likely: "A blocked condensate drain line. Less often, a failed pump or coil.",
    fixes: [
      { label: "Drain line cleared", note: "The most common cause, and the cheapest", range: prices.drainLine },
      { label: "Condensate pump", range: prices.condensatePump },
    ],
    big: { label: "If it is the indoor coil", note: "Evaporator coil replacement", range: prices.evaporatorCoil },
  },
  {
    id: "bill", label: "Bill jumped", likely: "Dirty coils, weak airflow or low refrigerant.",
    fixes: [
      { label: "Coil cleaning", range: prices.coilCleaning },
      { label: "Refrigerant leak", note: "Find and fix the leak, then recharge", range: prices.refrigerantLeak },
    ],
  },
];

// Replace tab: the "$5,000 rule" (age × repair quote)
export const rule = { limit: 5000, ageMin: 1, ageMax: 25, quoteMin: 100, quoteMax: 5000, quoteStep: 50, defaultAge: 12, defaultQuote: 900 };

export const mini = [
  { id: "6k", chip: "6k", btu: "6,000 BTU", room: "Small bedroom or office", sqft: "about 150–250 sq ft", price: { low: 2500, high: 5000 }, photo: "/media/rooms/room-6k.webp" },
  { id: "9k", chip: "9k", btu: "9,000 BTU", room: "Bedroom", sqft: "about 250–400 sq ft", price: { low: 2500, high: 5000 }, photo: "/media/rooms/room-9k.webp" },
  { id: "12k", chip: "12k", btu: "12,000 BTU", room: "Living room or large bedroom", sqft: "about 400–550 sq ft", price: { low: 2500, high: 5000 }, photo: "/media/rooms/room-12k.webp" },
  { id: "18k", chip: "18–24k", btu: "18,000–24,000 BTU", room: "Open-plan living and kitchen", sqft: "about 700–1,000+ sq ft", price: { low: 4000, high: 7000 }, photo: "/media/rooms/room-18k.webp" },
];

export const central = [
  { id: "2t", size: "2 ton", note: "", price: { low: 5500, high: 8500 } },
  { id: "3t", size: "3 ton", note: "typical Florida home", price: { low: 7500, high: 12000 } },
  { id: "45t", size: "4–5 ton", note: "", price: { low: 9500, high: 15000 } },
];

export const centralRoom = { chip: "Whole home", photo: "/media/rooms/room-central.webp", room: "Central (ducted), whole home", sqft: "sized by a load calculation" };

// Install tab
export const installChoices = [
  { id: "new", label: "New room or addition", kind: "mini" as const, why: "No ducts needed, so one mini-split can cool a single new space." },
  { id: "none", label: "Home with no AC", kind: "central" as const, why: "A central (ducted) system cools the whole home from one unit." },
  { id: "ductless", label: "Upgrading to ductless", kind: "mini" as const, why: "A mini-split replaces a window unit or adds a zone, room by room." },
];

export const needs = ["Repair", "Replace", "Install", "Tune-up", "Comfort Plan"];

export const steps = [
  { title: "Call or book online", text: "Tell us what is going on. We find a visit that suits you." },
  { title: "We diagnose and quote, in writing", text: "You see the cause and the price before any work starts." },
  { title: "You approve, we fix", text: "Nothing happens until you say yes." },
];

// Commercial page
export const commercial = {
  headline: "Built for the whole building.",
  who: "Offices, shops and restaurants: ducted systems, rooftop units and the airflow between them.",
  cards: [
    { name: "Ducted system installs", text: "New ducted systems planned around how your building is used." },
    { name: "Duct repair and sealing", text: "Find and seal leaks so the air you pay to cool reaches the room." },
    { name: "Rooftop units", text: "Service, repair and replacement of rooftop packaged units." },
    { name: "Vents and airflow balancing", text: "Even out hot and cold spots across floors and rooms." },
  ],
  contract: { title: "Maintenance contracts", text: "Scheduled visits on your calendar, one point of contact.", price: "Quoted per site" },
  buildingTypes: ["Office", "Shop", "Restaurant", "Other"],
};


