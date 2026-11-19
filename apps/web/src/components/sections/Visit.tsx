import { site } from "@/lib/site";

export function Visit() {
  const { address } = site;
  const mapQuery = encodeURIComponent(`${site.name} ${address.street} ${address.locality}`);
  return (
    <section id="visit" aria-labelledby="visit-title" className="bg-surface">
      <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-16 sm:py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow text-primary">Visit us</p>
          <h2 id="visit-title" className="mt-3 font-heading text-[40px] leading-tight font-medium sm:text-[44px]">
            In the heart of Kota Kinabalu
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Find us on Gaya Street (加雅街), steps from the Sunday market and the waterfront.
          </p>
        </div>
        <address className="rounded-[13px] border border-line bg-white p-6 not-italic">
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="field-label mb-1">Address</dt>
              <dd>
                {address.street}, {address.postalCode} {address.locality}, {address.region}, Malaysia
              </dd>
            </div>
            <div>
              <dt className="field-label mb-1">Opening hours</dt>
              <dd>{site.openingHours.label}</dd>
            </div>
            {site.phone && (
              <div>
                <dt className="field-label mb-1">Phone</dt>
                <dd>
                  <a href={`tel:${site.phone}`}>{site.phone}</a>
                </dd>
              </div>
            )}
          </dl>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-sm font-semibold text-primary-ink underline underline-offset-4"
          >
            Get directions →
          </a>
        </address>
      </div>
    </section>
  );
}
