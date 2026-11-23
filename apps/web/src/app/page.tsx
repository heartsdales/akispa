import { BookingForm } from "@/components/booking/BookingForm";
import { ContactBubbles } from "@/components/ContactBubbles";
import { Hero } from "@/components/Hero";
import { Experience } from "@/components/sections/Experience";
import { Faq, faqs } from "@/components/sections/Faq";
import { Visit } from "@/components/sections/Visit";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { allPrices, durationsFor, treatmentOptions } from "@/lib/booking";
import { absoluteUrl, site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "DaySpa",
      "@id": absoluteUrl("/#spa"),
      name: site.name,
      url: absoluteUrl("/"),
      image: site.heroImage,
      description: site.description,
      priceRange: `RM${Math.min(...allPrices)}–RM${Math.max(...allPrices)}`,
      currenciesAccepted: site.currency,
      ...(site.phone && { telephone: site.phone }),
      ...(site.email && { email: site.email }),
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.locality,
        addressRegion: site.address.region,
        postalCode: site.address.postalCode,
        addressCountry: site.address.country,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: site.openingHours.opens,
        closes: site.openingHours.closes,
      },
      makesOffer: treatmentOptions.flatMap((t) =>
        durationsFor(t.value).map((mins) => ({
          "@type": "Offer",
          name: `${t.label} · ${mins} minutes`,
          price: t.prices[mins],
          priceCurrency: site.currency,
        })),
      ),
      potentialAction: {
        "@type": "ReserveAction",
        target: absoluteUrl("/#booking"),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteHeader />
      <main className="pb-20 lg:pb-0">
        <Hero />
        <section id="booking" aria-labelledby="booking-title" className="mx-auto max-w-[1120px] px-5 pt-14 pb-20">
          <h2 id="booking-title" className="text-center font-heading text-[40px] leading-tight font-medium sm:text-[44px]">
            Book Your Experience
          </h2>
          <p className="mt-2 mb-10 text-center text-muted">
            Choose your outlet and timeslot, then select your treatment and personalize your visit.
          </p>
          <BookingForm />
        </section>
        <Experience />
        <Faq />
        <Visit />
      </main>
      <SiteFooter />
      <ContactBubbles />
    </>
  );
}
