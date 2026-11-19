"use client";

import { useImperativeHandle, useRef, useState, type Ref } from "react";
import { createBooking, type CreateBookingRequest, type CreateBookingResponse } from "@/lib/api";
import { formatRM } from "@/lib/booking";

export type CheckoutDialogHandle = { open: () => void };

type Props = {
  ref: Ref<CheckoutDialogHandle>;
  request: Omit<CreateBookingRequest, "customer" | "notes">;
  totalSen: number;
  summary: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "done"; result: CreateBookingResponse };

export function CheckoutDialog({ ref, request, totalSen, summary }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useImperativeHandle(ref, () => ({
    open() {
      if (status.kind !== "submitting") setStatus({ kind: "idle" });
      dialogRef.current?.showModal();
    },
  }));

  const close = () => dialogRef.current?.close();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const customer = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
    };
    const notes = String(form.get("notes") ?? "").trim() || undefined;
    setStatus({ kind: "submitting" });
    try {
      const result = await createBooking({ ...request, customer, notes }, totalSen);
      setStatus({ kind: "done", result });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="checkout-title"
      className="m-auto w-[min(480px,calc(100%-2rem))] rounded-[14px] bg-white p-0 text-ink shadow-2xl backdrop:bg-black/50"
      onClick={(e) => e.target === dialogRef.current && close()}
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 id="checkout-title" className="font-heading text-[34px] leading-tight font-medium">
            {status.kind === "done" ? "Reservation received" : "Almost there"}
          </h2>
          <button type="button" onClick={close} className="rounded-full bg-sand px-3 py-2 text-sm" aria-label="Close">
            ✕
          </button>
        </div>

        <p className="mt-2 text-sm text-muted">{summary}</p>
        <p className="mt-1 text-lg font-bold text-primary">{formatRM(totalSen)}</p>

        {status.kind === "done" ? (
          <div className="mt-6 space-y-3 text-sm leading-relaxed">
            <p>
              Your booking reference is <strong className="font-mono">{status.result.reference}</strong>.
            </p>
            {status.result.demo && (
              <p className="rounded-lg bg-primary-soft p-3 text-primary-ink">
                Demo mode: the booking API is not connected yet, so no appointment was made and no payment was taken.
              </p>
            )}
            <button type="button" className="btn-primary mt-2 w-full rounded-lg" onClick={close}>
              Done
            </button>
          </div>
        ) : (
          <form className="mt-6" onSubmit={onSubmit}>
            <label htmlFor="c-name" className="field-label">
              Your name
            </label>
            <input id="c-name" name="name" className="input mb-5" placeholder="Full name" autoComplete="name" required />
            <label htmlFor="c-email" className="field-label">
              Email address
            </label>
            <input
              id="c-email"
              name="email"
              type="email"
              className="input mb-5"
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
            <label htmlFor="c-phone" className="field-label">
              Mobile number
            </label>
            <input
              id="c-phone"
              name="phone"
              type="tel"
              className="input mb-5"
              placeholder="+60 12-345 6789"
              autoComplete="tel"
              pattern="^\+?[0-9 \-]{8,16}$"
              title="Enter a valid mobile number"
              required
            />
            <label htmlFor="c-notes" className="field-label">
              Notes <span className="font-normal text-muted normal-case">(optional)</span>
            </label>
            <textarea id="c-notes" name="notes" rows={2} maxLength={500} className="input mb-4" />
            {status.kind === "error" && (
              <p role="alert" className="mb-3 text-sm text-primary-ink">
                {status.message}
              </p>
            )}
            <button type="submit" className="btn-primary w-full rounded-lg py-4" disabled={status.kind === "submitting"}>
              {status.kind === "submitting" ? "Reserving…" : "Confirm Reservation"}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Payment options will be available at checkout once our payment partner is connected.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
