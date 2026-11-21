import type { Duration, TherapistPreference, Treatment } from "./booking";

export type CreateBookingRequest = {
  outletId: string;
  treatment: Treatment;
  durationMinutes: Duration;
  guests: number;
  therapistPreference: TherapistPreference;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  customer: { name: string; email: string; phone: string };
  notes?: string;
};

export type CreateBookingResponse = {
  reference: string;
  status: "pending_payment" | "confirmed";
  totalSen: number;
  demo?: boolean;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

/**
 * Creates a booking via the Go API. Until NEXT_PUBLIC_API_URL is configured,
 * resolves with a demo reference so the flow can be exercised end to end.
 */
export async function createBooking(
  req: CreateBookingRequest,
  totalSen: number,
): Promise<CreateBookingResponse> {
  if (!API_URL) {
    await new Promise((r) => setTimeout(r, 600));
    const ref = "AK-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    return { reference: ref, status: "pending_payment", totalSen, demo: true };
  }

  const res = await fetch(`${API_URL}/v1/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body?.message ?? "Booking could not be created.", res.status);
  }
  return res.json();
}
