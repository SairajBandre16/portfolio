// Copy for the home page intro. Each inner array is one sentence; the page renders
// "strong" parts in full colour and "soft" parts in grey, so the story reads at two speeds.

export type IntroPart =
  | { kind: "strong"; text: string }
  | { kind: "soft"; text: string }
  /** A project name with its icon; hovering shows a preview of the project. */
  | { kind: "project"; slug: string }
  | { kind: "socials" };

export const intro: IntroPart[][] = [
  [
    { kind: "strong", text: "Hi, I’m Sairaj Bandre." },
    { kind: "soft", text: " MSc student at UCD, " },
    { kind: "strong", text: "learning AI by building real things with Claude Code." },
  ],
  [
    { kind: "strong", text: "Before this, I automated e-commerce operations at Ergode " },
    { kind: "soft", text: "with RPA bots and n8n agents." },
  ],
  [
    { kind: "strong", text: "I spend far too long on Flightradar, " },
    { kind: "soft", text: "so I built " },
    { kind: "project", slug: "squawk" },
    { kind: "strong", text: "." },
  ],
  [{ kind: "strong", text: "Find me on " }, { kind: "socials" }, { kind: "strong", text: "." }],
];

export const cta = {
  lead: "Building your AI team?",
  talk: "Let’s talk",
  or: " or ",
  resume: "grab my résumé",
};

/** The record on the hero's mini player. Audio streams from Spotify's embed. */
export const song = {
  title: "Smooth Operator",
  artist: "Sade",
  note: "On repeat",
  spotifyUri: "spotify:track:1Hv1VTm8zeOeybub15mA2R",
  url: "https://open.spotify.com/track/1Hv1VTm8zeOeybub15mA2R",
};

/** Cards in the scrolling gallery beside the intro, in order. */
export const gallery = [
  { slug: "queryforge", caption: "Text-to-SQL agent" },
  { slug: "squawk", caption: "Live plane-spotting in 3D" },
  { slug: "ownit", caption: "Own your AI draft" },
  { slug: "ctrl-automate", caption: "Automation blog" },
];

/** Other clocks in the flight-board dropdown. */
export const clocks = [
  { code: "DUB", city: "Dublin", timeZone: "Europe/Dublin", note: "Now" },
  { code: "BOM", city: "Mumbai", timeZone: "Asia/Kolkata", note: "Home" },
];

export const footer = {
  thanks: ["Thanks for", "stopping by."],
  madeBy: "Made by Sairaj Bandre.",
};
