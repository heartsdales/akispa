/**
 * Site-wide business information. Used for metadata, JSON-LD and page copy.
 * TODO(owner): confirm address, phone and opening hours before launch.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Akispa",
  brand: "AKISPA",
  url: resolveSiteUrl().replace(/\/$/, ""),
  tagline: "Rest · Restore · Reconnect",
  title: "Akispa | Massage & Spa in Kota Kinabalu – Book Online",
  description:
    "Akispa is a calm day spa on Gaya Street, Kota Kinabalu. Book a 60, 90 or 120-minute massage session online and save up to 60% with off-peak time-slot discounts.",
  keywords: [
    "spa Kota Kinabalu",
    "massage Kota Kinabalu",
    "Gaya Street spa",
    "加雅街 按摩",
    "aromatherapy massage",
    "deep tissue massage",
    "couples spa Sabah",
  ],
  locale: "en_MY",
  currency: "MYR",
  heroImage:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=85",
  address: {
    street: "Gaya Street",
    locality: "Kota Kinabalu",
    region: "Sabah",
    postalCode: "88000",
    country: "MY",
  },
  // Leave empty until confirmed; omitted from structured data when blank.
  phone: "" as string,
  email: "" as string,
  openingHours: { opens: "11:00", closes: "23:59", label: "Daily, 11:00 AM – late (last booking 11:00 PM)" },
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path}`;
