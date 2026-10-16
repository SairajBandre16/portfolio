import { ArrowDown } from "lucide-react";
import { TopBar } from "@/components/site/top-bar";
import { profile } from "@/lib/site";
import { Intro } from "./intro";
import { Gallery } from "./gallery";

const coords = `${Math.abs(profile.location.lat).toFixed(2)}° N, ${Math.abs(profile.location.lon).toFixed(2)}° W`;

/** First screen: the story on the left, project screens drifting by on the right. */
export function Hero() {
  return (
    <section className="lg:grid lg:h-dvh lg:min-h-[42rem] lg:grid-cols-[minmax(0,1fr)_clamp(19rem,30vw,28rem)] lg:grid-rows-[minmax(0,1fr)]">
      <div className="gutter flex flex-col lg:h-full lg:pr-14">
        <TopBar />
        <div className="flex flex-1 flex-col justify-center pt-10 pb-12 sm:pt-16 lg:py-8">
          <Intro />
        </div>
        <div className="hidden items-center justify-between pb-7 lg:flex">
          <a
            href="#work"
            className="group bg-surface text-fg hover:bg-surface-2 inline-flex h-10 items-center gap-2 rounded-full pr-4 pl-1.5 text-sm font-medium shadow-[inset_0_0_0_1px_var(--line)] transition-colors"
          >
            <span className="bg-fg text-bg grid size-7 place-items-center rounded-full">
              <ArrowDown
                size={14}
                strokeWidth={2.2}
                className="transition-transform duration-500 group-hover:translate-y-0.5"
              />
            </span>
            See everything
          </a>
          <p className="label text-soft">
            {coords} · {profile.location.city}
          </p>
        </div>
      </div>
      <div className="pb-4 lg:h-full lg:min-h-0 lg:pr-6 lg:pb-0">
        <Gallery />
      </div>
    </section>
  );
}
