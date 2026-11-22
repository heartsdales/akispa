"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";
import {
  BOOKING_WINDOW_DAYS,
  MAX_GUESTS,
  MIN_GUESTS,
  durationsFor,
  formatDisplayDate,
  formatRM,
  isSlotPast,
  outlets,
  quote,
  getTreatment,
  slots,
  therapistOptions,
  toISODate,
  treatmentOptions,
  type Duration,
  type TherapistPreference,
  type Treatment,
} from "@/lib/booking";
import { CheckoutDialog, type CheckoutDialogHandle } from "./CheckoutDialog";

/** Current minute, updated every 30s on the client; null during prerender. */
function useNowMinute(): Date | null {
  const minute = useSyncExternalStore(
    (cb) => {
      const id = setInterval(cb, 30_000);
      return () => clearInterval(id);
    },
    () => Math.floor(Date.now() / 60_000),
    () => null,
  );
  return minute === null ? null : new Date(minute * 60_000);
}

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export function BookingForm() {
  const ids = { outlet: useId(), treatment: useId(), duration: useId(), guests: useId(), therapist: useId(), date: useId(), time: useId() };
  const dialog = useRef<CheckoutDialogHandle>(null);
  const now = useNowMinute();

  const [outletId, setOutletId] = useState(outlets[0].id);
  const [treatment, setTreatment] = useState<Treatment>("urut-aroma");
  const [pickedDuration, setDuration] = useState<Duration>(60);
  const [guests, setGuests] = useState(1);
  const [therapist, setTherapist] = useState<TherapistPreference>("any");
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [pickedTime, setPickedTime] = useState<string>("11:00");
  const [dateError, setDateError] = useState<string | null>(null);

  const today = now ? toISODate(now) : null;
  const todayHasSlots = now ? slots.some((s) => !isSlotPast(toISODate(now), s.time, now)) : true;
  const minDate = now ? toISODate(todayHasSlots ? now : addDays(now, 1)) : undefined;
  const maxDate = now ? toISODate(addDays(now, BOOKING_WINDOW_DAYS)) : undefined;
  const date = pickedDate ?? minDate ?? "";

  const slotPast = (time: string) => (now && date ? isSlotPast(date, time, now) : false);
  const firstOpen = slots.find((s) => !slotPast(s.time))?.time;
  const time = slotPast(pickedTime) ? firstOpen ?? pickedTime : pickedTime;

  const service = getTreatment(treatment);
  const durations = durationsFor(treatment);
  // Fall back to the shortest offered length when the treatment doesn't come in the picked one.
  const duration = durations.includes(pickedDuration) ? pickedDuration : durations[0];

  const q = quote(treatment, duration, guests, time);
  const outlet = outlets.find((o) => o.id === outletId) ?? outlets[0];
  const treatmentLabel = service.label;
  const therapistLabel = therapistOptions.find((t) => t.value === therapist)?.label ?? "";

  function continueToCheckout() {
    if (!date || (minDate && date < minDate) || (maxDate && date > maxDate)) {
      setDateError(`Please choose a date between today and ${BOOKING_WINDOW_DAYS} days from now.`);
      document.getElementById(ids.date)?.focus();
      return;
    }
    if (slotPast(time)) {
      setDateError("That time has already passed. Please pick another slot.");
      return;
    }
    setDateError(null);
    dialog.current?.open();
  }

  const summary: [string, React.ReactNode][] = [
    ["Outlet", outlet.name],
    ["Treatment", treatmentLabel],
    ["Duration", `${duration} minutes`],
    ["Basic price", formatRM(q.base) + (guests > 1 ? " total" : "")],
    ["Time-slot discount", `${q.discountPercent}% OFF`],
    ["Discount savings", `− ${formatRM(q.savings)}`],
  ];
  const details: [string, React.ReactNode][] = [
    ["Guests", guests],
    ["Therapist", therapistLabel],
    ["Date / time", `${date ? formatDisplayDate(date) : "Choose date"} · ${time}`],
  ];

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
        <div className="space-y-5">
          {/* 01 Location & duration */}
          <section className="panel" aria-labelledby={`${ids.outlet}-h`}>
            <h3 id={`${ids.outlet}-h`} className="panel-title">
              01. Choose Your Location
            </h3>
            <label htmlFor={ids.outlet} className="field-label">
              Spa outlet
            </label>
            <select id={ids.outlet} className="input mb-5" value={outletId} onChange={(e) => setOutletId(e.target.value)}>
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <p id={ids.treatment} className="field-label">
              Choose your treatment
            </p>
            <div role="group" aria-labelledby={ids.treatment} className="mb-6 grid gap-3 sm:grid-cols-2">
              {treatmentOptions.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className="chip min-h-[105px] rounded-[9px] p-[17px] text-left"
                  aria-pressed={treatment === t.value}
                  onClick={() => setTreatment(t.value)}
                >
                  <span className="mb-2 block font-bold">{t.label}</span>
                  {durationsFor(t.value).map((d) => (
                    <span key={d} className="block text-xs text-muted">
                      {d} mins · RM{t.prices[d]}
                    </span>
                  ))}
                </button>
              ))}
            </div>
            <p id={ids.duration} className="field-label">
              Choose your session duration
            </p>
            <div role="group" aria-labelledby={ids.duration} className="flex flex-wrap gap-2.5">
              {durations.map((d) => (
                <button key={d} type="button" className="chip" aria-pressed={duration === d} onClick={() => setDuration(d)}>
                  {d} mins · RM{service.prices[d]}
                </button>
              ))}
            </div>
          </section>

          {/* 02 Personalise */}
          <section className="panel" aria-labelledby={`${ids.guests}-h`}>
            <h3 id={`${ids.guests}-h`} className="panel-title">
              02. Personalize Your Visit
            </h3>
            <p id={ids.guests} className="field-label">
              Number of guests
            </p>
            <div role="group" aria-labelledby={ids.guests} className="mb-6 flex items-center gap-4">
              <button
                type="button"
                className="grid size-10 place-items-center rounded-full border border-line-strong bg-white text-lg disabled:opacity-40"
                onClick={() => setGuests((g) => Math.max(MIN_GUESTS, g - 1))}
                disabled={guests <= MIN_GUESTS}
                aria-label="Remove a guest"
              >
                −
              </button>
              <output aria-live="polite" className="min-w-6 text-center text-lg font-bold">
                {guests}
              </output>
              <button
                type="button"
                className="grid size-10 place-items-center rounded-full border border-line-strong bg-white text-lg disabled:opacity-40"
                onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                disabled={guests >= MAX_GUESTS}
                aria-label="Add a guest"
              >
                +
              </button>
              <span className="text-xs text-muted">Up to {MAX_GUESTS} guests</span>
            </div>
            <p id={ids.therapist} className="field-label">
              Therapist preference
            </p>
            <div role="group" aria-labelledby={ids.therapist} className="flex flex-wrap gap-2.5">
              {therapistOptions.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className="chip"
                  aria-pressed={therapist === t.value}
                  onClick={() => setTherapist(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          {/* 03 Date & time */}
          <section className="panel" aria-labelledby={`${ids.date}-h`}>
            <h3 id={`${ids.date}-h`} className="panel-title">
              03. Select Date &amp; Time
            </h3>
            <label htmlFor={ids.date} className="field-label">
              Appointment date
            </label>
            <input
              id={ids.date}
              type="date"
              className="input"
              value={date}
              min={minDate}
              max={maxDate}
              onChange={(e) => {
                setPickedDate(e.target.value);
                setDateError(null);
              }}
              aria-invalid={!!dateError}
              aria-describedby={dateError ? `${ids.date}-err` : undefined}
            />
            <p id={`${ids.date}-err`} role="alert" className="mt-2 min-h-5 text-sm text-primary-ink">
              {dateError}
            </p>
            <p id={ids.time} className="field-label mt-3">
              Preferred time
            </p>
            <div role="group" aria-labelledby={ids.time} className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5">
              {slots.map((s) => {
                const past = slotPast(s.time);
                return (
                  <button
                    key={s.time}
                    type="button"
                    className="chip px-2 text-center"
                    aria-pressed={time === s.time}
                    disabled={past}
                    onClick={() => setPickedTime(s.time)}
                  >
                    <span className="block font-medium">{s.time}</span>
                    <span className="mt-1 block text-[11px] font-bold text-primary-ink">
                      {past ? "Unavailable" : `${s.discountPercent}% OFF`}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Live therapist availability is confirmed after booking. {today ? "" : "Loading today's slots…"}
            </p>
          </section>
        </div>

        {/* Summary */}
        <aside aria-labelledby="summary-title">
          <div className="panel lg:sticky lg:top-24">
            <h3 id="summary-title" className="panel-title">
              Your Reservation
            </h3>
            <dl className="space-y-4 text-sm">
              {summary.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-bold">{v}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted">Discounted total</dt>
                <dd className="text-right text-[28px] font-bold text-primary">{formatRM(q.total)}</dd>
              </div>
              {details.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-bold">{v}</dd>
                </div>
              ))}
            </dl>
            <hr className="my-5 border-line" />
            <p className="text-xs leading-relaxed text-muted">
              Discount is applied to the basic session price for the selected time slot. Treatment and duration
              determine the basic price.
            </p>
            <button type="button" className="btn-primary mt-4 w-full rounded-lg py-4" onClick={continueToCheckout}>
              Continue to Checkout →
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile sticky total bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 border-t border-line bg-surface/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="leading-tight">
          <p className="text-[11px] text-muted uppercase">
            {duration} mins · {guests} guest{guests > 1 ? "s" : ""} · {time}
          </p>
          <p className="text-xl font-bold text-primary">{formatRM(q.total)}</p>
        </div>
        <button type="button" className="btn-primary" onClick={continueToCheckout}>
          Checkout →
        </button>
      </div>

      <CheckoutDialog
        ref={dialog}
        request={{ outletId, treatment, durationMinutes: duration, guests, therapistPreference: therapist, date, time }}
        totalSen={q.total}
        summary={`${outlet.name} · ${treatmentLabel} · ${duration} mins · ${guests} guest${guests > 1 ? "s" : ""} · ${date ? formatDisplayDate(date) : ""} ${time}`}
      />
    </>
  );
}
