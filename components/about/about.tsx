import { profile } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { ScrollWords } from "./scroll-words";

export function About() {
  const { about } = profile;
  return (
    <section id="about" data-scene="intro" className="container-page relative py-28 md:py-40">
      <div className="max-w-[min(100%,52rem)]">
        <SectionLabel index="01" label="About" />
        <ScrollWords
          text={about.manifesto}
          accents={["automation", "models"]}
          className="font-display text-lead text-fg mt-8 max-w-[34ch] leading-[1.25] font-semibold tracking-[-0.02em]"
        />

        <dl className="border-line mt-16 grid grid-cols-2 border-t md:grid-cols-4">
          {about.facts.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 0.06}
              className="border-line border-b py-6 pr-4 md:border-b-0 md:[&:not(:first-child)]:pl-5 md:[&:not(:last-child)]:border-r [&:nth-child(odd)]:border-r"
            >
              <dt className="tag text-accent">{f.label}</dt>
              <dd className="font-display text-fg mt-3 text-lg leading-tight font-bold">
                {f.value}
              </dd>
              <dd className="text-subtle mt-1 text-sm">{f.note}</dd>
            </Reveal>
          ))}
        </dl>

        <Reveal className="mt-16 flex items-start gap-4">
          <span
            aria-hidden
            className="border-line-strong mt-1 grid size-10 shrink-0 place-items-center rounded-full border"
          >
            <svg viewBox="0 0 100 100" className="fill-accent size-5 rotate-45">
              <path d="M50 3 53.6 9 54 40 94 58 94 63 54 55.5 53.4 82 68 92 68 95.5 52 92.5 50 97 48 92.5 32 95.5 32 92 46.6 82 46 55.5 6 63 6 58 46 40 46.4 9Z" />
            </svg>
          </span>
          <p className="text-muted max-w-[56ch] text-lg leading-relaxed">
            {about.aside}{" "}
            <span className="text-fg">
              Keep an eye on the sky while you scroll; there&apos;s one you can spot.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
