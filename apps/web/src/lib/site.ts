import { maxDiscount } from "./booking";

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
    `Akispa is a calm day spa on Gaya Street, Kota Kinabalu. Book Urut Aroma, Urut Kering or Lava Luxe hot stone massage online and save up to ${maxDiscount}% with off-peak time-slot discounts.`,
  keywords: [
    "spa Kota Kinabalu",
    "massage Kota Kinabalu",
    "Gaya Street spa",
    "加雅街 按摩",
    "aromatherapy massage",
    "traditional Malay massage",
    "hot stone massage",
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
  // Floating contact bubbles; each shows only once filled in.
  whatsapp: "" as string, // digits with country code, e.g. 60123456789
  wechatUrl: "" as string, // official WeChat contact link (https://…)
  wechatId: "" as string, // used when there is no link: copied for the guest to search
  openingHours: { opens: "11:00", closes: "23:59", label: "Daily, 11:00 AM – late (last booking 11:00 PM)" },
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path}`;
