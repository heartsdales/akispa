export const faqs = [
  {
    q: "Do I need to choose my treatment when booking?",
    a: "No. You reserve the session length, date and time online, then choose your treatment with our therapists when you arrive.",
  },
  {
    q: "How do time-slot discounts work?",
    a: "Each 30-minute start time has its own discount, applied to the basic session price. The discount is shown on every slot before you book.",
  },
  {
    q: "How many guests can I book for?",
    a: "Up to eight guests per reservation. The price shown is the total for all guests.",
  },
  {
    q: "Can I request a female or male therapist?",
    a: "Yes. Choose your therapist preference while booking and we will do our best to match it.",
  },
  {
    q: "How far ahead can I book?",
    a: "You can book up to 60 days in advance, and same-day bookings are welcome for any slot that hasn't started yet.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-[820px] px-5 py-16 sm:py-20">
      <h2 id="faq-title" className="text-center font-heading text-[40px] leading-tight font-medium sm:text-[44px]">
        Frequently asked questions
      </h2>
      <div className="mt-10 divide-y divide-line rounded-[13px] border border-line bg-surface">
        {faqs.map((f) => (
          <details key={f.q} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="text-xl text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
