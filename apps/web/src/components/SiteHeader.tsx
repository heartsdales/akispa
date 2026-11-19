import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "#experience", label: "Experience" },
  { href: "#booking", label: "Reservations" },
  { href: "#faq", label: "FAQ" },
  { href: "#visit", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-[70px] max-w-[1200px] items-center justify-between px-5 sm:h-[78px]">
        <Link href="/" className="font-heading text-[26px] tracking-[2px] sm:text-[34px]" aria-label={`${site.name} home`}>
          {site.brand}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-6 text-[13px]">
          <ul className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-primary">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#booking" className="btn-primary px-5 py-3">
            Book Now
          </a>
        </nav>
      </div>
    </header>
  );
}
