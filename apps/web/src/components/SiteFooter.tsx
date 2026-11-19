import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-plum px-5 py-10 text-center text-[13px] text-cream">
      <p className="font-heading text-[34px] tracking-[2px]">{site.brand}</p>
      <p className="mt-3">Make time for yourself. Your wellness journey starts here.</p>
      <p className="mt-3 text-cream/70">
        {site.address.street}, {site.address.locality}, {site.address.region}
      </p>
      <p className="mt-3 text-cream/70">© {site.name}. All rights reserved.</p>
    </footer>
  );
}
