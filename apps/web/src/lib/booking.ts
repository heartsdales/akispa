/**
 * Booking catalogue and pricing rules.
 *
 * These mirror what the Go API will serve (GET /v1/outlets, /v1/session-options,
 * /v1/availability). The API remains the source of truth: the client sends only
 * selections and the server recomputes the price.
 */

export type Outlet = { id: string; name: string };

export type Duration = 60 | 90 | 120;

export type Treatment = "aroma" | "traditional" | "luca";

export const treatmentOptions: { value: Treatment; label: string }[] = [
  { value: "aroma", label: "Aroma massage" },
  { value: "traditional", label: "Traditional massage" },
  { value: "luca", label: "Luca massage" },
];

export type TherapistPreference = "any" | "female" | "male";

export type Slot = { time: string; discountPercent: number };

export const outlets: Outlet[] = [{ id: "gaya-street", name: "Gaya Street 加雅街" }];

/** Basic session price per guest, in whole ringgit. */
export const sessionPrices: Record<Duration, number> = { 60: 120, 90: 180, 120: 230 };

export const durations = Object.keys(sessionPrices).map(Number) as Duration[];

export const therapistOptions: { value: TherapistPreference; label: string }[] = [
  { value: "any", label: "Any therapist" },
  { value: "female", label: "Female preferred" },
  { value: "male", label: "Male preferred" },
];

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 8;
export const BOOKING_WINDOW_DAYS = 60;

const slotDiscounts = [
  58, 58, 58, 58, 50, 50, 45, 45, 43, 40, 40, 40, 40, 40, 50, 55, 55, 55, 55, 40, 40, 40, 50, 50, 60,
];

/** 11:00 to 23:00 in 30-minute steps, each with its off-peak discount. */
export const slots: Slot[] = slotDiscounts.map((discountPercent, i) => {
  const minutes = 11 * 60 + i * 30;
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return { time: `${hh}:${mm}`, discountPercent };
});

export const maxDiscount = Math.max(...slotDiscounts);

export type Quote = {
  base: number;
  discountPercent: number;
  savings: number;
  total: number;
};

/** All amounts in sen (1/100 RM) to avoid floating point drift. */
export function quote(duration: Duration, guests: number, time: string): Quote {
  const base = sessionPrices[duration] * guests * 100;
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
