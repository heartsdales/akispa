import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 text-center">
      <div>
        <p className="eyebrow text-muted">404</p>
        <h1 className="mt-3 font-heading text-5xl font-medium">This page has drifted away</h1>
        <p className="mt-4 text-muted">The page you were looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn-primary mt-8">
          Back to Akispa
        </Link>
      </div>
    </main>
  );
}
