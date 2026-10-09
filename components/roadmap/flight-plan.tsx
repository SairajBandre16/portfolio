import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { RoadmapRoute } from "./roadmap";

export function FlightPlan() {
  return (
    <section id="flight-plan" className="relative border-y border-line bg-sunken/60 py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          id="flight-plan"
          kicker="Currently learning"
          title={
            <>
              The flight plan: <Accent>where I&apos;ve been, where I&apos;m heading.</Accent>
            </>
          }
          intro="Each waypoint is backed by something I built. Logged means shipped, en route means this term, planned means next."
        />
        <RoadmapRoute />
      </div>
    </section>
  );
}
