import Image from "next/image";
import { maxDiscount } from "@/lib/booking";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[340px] items-center justify-center overflow-hidden px-5 py-16 text-center text-white sm:min-h-[420px]">
      <Image
        src={site.heroImage}
        alt="Candle-lit treatment room with folded towels and orchids"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/75 to-forest/35" />
      <div className="max-w-2xl">
        <p className="eyebrow">{site.tagline}</p>
        <h1 className="my-5 font-heading text-[clamp(42px,6vw,72px)] leading-[1.06] font-medium">
          Your Moment of Calm
        </h1>
        <p className="mx-auto max-w-[560px] leading-relaxed text-white/90">
          A peaceful escape on Gaya Street, Kota Kinabalu — designed to renew your body, mind and spirit.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#booking" className="btn-primary">
            Reserve a session
          </a>
          <span className="rounded-full border border-white/40 px-5 py-3 text-sm backdrop-blur-sm">
            Off-peak savings up to {maxDiscount}%
          </span>
        </div>
      </div>
    </section>
  );
}
