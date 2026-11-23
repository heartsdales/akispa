/**
 * Booking catalogue and pricing rules.
 *
 * These mirror what the Go API will serve (GET /v1/outlets, /v1/session-options,
 * /v1/availability). The API remains the source of truth: the client sends only
 * selections and the server recomputes the price.
 */

export type Outlet = { id: string; name: string };

export type Duration = 60 | 90 | 120;

export type Treatment = "urut-aroma" | "urut-kering" | "lava-luxe";

export type TreatmentOption = {
  value: Treatment;
  label: string;
  /** Basic session price per guest, in whole ringgit, for each duration offered. */
  prices: Partial<Record<Duration, number>>;
};

export const treatmentOptions: TreatmentOption[] = [
  { value: "urut-aroma", label: "Urut Aroma 传统精油按摩", prices: { 60: 110, 90: 150, 120: 175 } },
  { value: "urut-kering", label: "Urut Kering 传统马来按摩", prices: { 60: 150, 90: 170 } },
  { value: "lava-luxe", label: "Lava Luxe 热石按摩", prices: { 90: 145, 120: 175 } },
];

export const getTreatment = (value: Treatment) =>
  treatmentOptions.find((t) => t.value === value) ?? treatmentOptions[0];

/** Durations a treatment is offered in, shortest first. */
export const durationsFor = (value: Treatment) =>
  (Object.keys(getTreatment(value).prices).map(Number) as Duration[]).sort((a, b) => a - b);

/** Every listed price, for price ranges and structured data. */
export const allPrices = treatmentOptions.flatMap((t) => Object.values(t.prices) as number[]);

export type TherapistPreference = "any" | "female" | "male";

export type Slot = { time: string; discountPercent: number };

export const outlets: Outlet[] = [{ id: "gaya-street", name: "Gaya Street 加雅街" }];

export const therapistOptions: { value: TherapistPreference; label: string }[] = [
  { value: "any", label: "Any therapist" },
  { value: "female", label: "Female preferred" },
  { value: "male", label: "Male preferred" },
];

export const MIN_GUESTS = 1;
/** The spa seats at most this many guests at any moment. */
export const MAX_GUESTS = 7;
export const BOOKING_WINDOW_DAYS = 60;

/** Off-peak discount by start time (minutes after midnight). */
function discountAt(minutes: number): number {
  if (minutes < 13 * 60) return 38; // 11:00–12:30
  if (minutes < 17 * 60) return 30; // 13:00–16:30
  if (minutes <= 20 * 60 + 30) return 25; // 17:00–20:30
  return 28; // 21:00–23:00
}

/** 11:00 to 23:00 in 30-minute steps, each with its off-peak discount. */
export const slots: Slot[] = Array.from({ length: 25 }, (_, i) => {
  const minutes = 11 * 60 + i * 30;
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return { time: `${hh}:${mm}`, discountPercent: discountAt(minutes) };
});

export const maxDiscount = Math.max(...slots.map((s) => s.discountPercent));

export type Quote = {
  base: number;
  discountPercent: number;
  savings: number;
  total: number;
};

/** All amounts in sen (1/100 RM) to avoid floating point drift. */
export function quote(treatment: Treatment, duration: Duration, guests: number, time: string): Quote {
  const base = (getTreatment(treatment).prices[duration] ?? 0) * guests * 100;
  const discountPercent = slots.find((s) => s.time === time)?.discountPercent ?? 0;
  const savings = Math.round((base * discountPercent) / 100);
  return { base, discountPercent, savings, total: base - savings };
}

export const formatRM = (sen: number) =>
  `RM ${(sen / 100).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Local calendar date as YYYY-MM-DD. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** True when the slot on `date` has already started (relative to `now`). */
export function isSlotPast(date: string, time: string, now: Date): boolean {
  if (date !== toISODate(now)) return date < toISODate(now);
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
}
