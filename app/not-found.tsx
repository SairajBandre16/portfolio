import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" data-scene="lost" className="container-page flex min-h-dvh flex-col justify-center py-28">
      <p className="tag text-accent">Error 404 · signal lost</p>
      <h1 className="headline mt-6 text-mega">
        4<span className="text-signal">0</span>4
      </h1>
      <p className="mt-6 max-w-[40ch] text-xl leading-relaxed text-muted">
        This page drifted off into space. The particles are looking for it; you can head home in the meantime.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-accent px-6 font-semibold text-ink transition-transform active:scale-[0.97]"
      >
        <ArrowLeft size={16} /> Back to base
      </Link>
    </main>
  );
}
