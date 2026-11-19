const features = [
  {
    title: "Choose your treatment in store",
    body: "Reserve your time now and decide on the day. Our therapists will guide you through aromatherapy, deep tissue, traditional body massage and couples rituals.",
  },
  {
    title: "Pay less off-peak",
    body: "Every half-hour slot carries its own discount. Visit during quieter hours and save up to 60% on the basic session price.",
  },
  {
    title: "Your therapist, your way",
    body: "Tell us if you prefer a female or male therapist and how many guests are coming — up to eight in one reservation.",
  },
];

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="bg-surface">
      <div className="mx-auto max-w-[1120px] px-5 py-16 sm:py-20">
        <p className="eyebrow text-center text-primary">The Akispa experience</p>
        <h2 id="experience-title" className="mt-3 text-center font-heading text-[40px] leading-tight font-medium sm:text-[44px]">
          Unhurried care, simple booking
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <li key={f.title} className="rounded-[13px] border border-line bg-white p-6">
              <span className="font-heading text-3xl text-primary">0{i + 1}</span>
              <h3 className="mt-2 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
