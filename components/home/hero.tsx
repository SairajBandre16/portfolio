import { TopBar } from "@/components/site/top-bar";
import { profile } from "@/lib/site";
import { Intro } from "./intro";
import { Gallery } from "./gallery";
import { MusicPlayer } from "./music-player";

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
        <div className="flex items-center justify-between gap-4 pb-7">
          <div className="settle" style={{ "--i": 6 } as React.CSSProperties}>
            <MusicPlayer />
          </div>
          <p className="label text-soft hidden lg:block">
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
