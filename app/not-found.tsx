import Link from "next/link";
import { TopBar } from "@/components/site/top-bar";

export default function NotFound() {
  return (
    <main id="main" className="gutter flex min-h-[70dvh] flex-col">
      <TopBar />
      <div className="text-intro my-auto max-w-[30em] py-16 leading-[1.45] tracking-[-0.016em]">
        <h1 className="inline">
          <span className="text-fg font-[560]">404. </span>
        </h1>
        <span className="text-soft">This page was diverted somewhere else. Nothing to spot here, </span>
        <Link
          href="/"
          className="text-fg font-[560] underline decoration-[color-mix(in_oklab,var(--fg)_30%,transparent)] decoration-[0.06em] underline-offset-[0.22em] hover:decoration-[var(--accent)]"
        >
          head back home
        </Link>
        <span className="text-soft">.</span>
      </div>
    </main>
  );
}
