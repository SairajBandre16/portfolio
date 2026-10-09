import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <main id="main" className="relative isolate grid min-h-[100dvh] place-items-center overflow-hidden">
      <div
        aria-hidden
        className="hairline-grid absolute inset-0 -z-10 [mask-image:radial-gradient(circle_at_center,#000_15%,transparent_65%)]"
      />
      <div className="container-page max-w-2xl">
        <p className="hud text-accent">Squawk 7600 · lost comms</p>
        <h1 className="mt-6 text-hero leading-[0.95] font-medium tracking-[-0.045em] text-fg">
          404. <em className="font-serif font-normal text-accent">Off the radar.</em>
        </h1>
        <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-muted">
          This page doesn&apos;t exist, or it flew off somewhere. Let&apos;s get you back on the flight plan.
        </p>
        <div className="mt-10">
          <ButtonLink href="/" variant="primary">
            <ArrowLeft size={16} /> Return to base
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
