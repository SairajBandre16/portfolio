// Curated projects and case studies. Every number here comes from the project's own README,
// write-up or results file.

export type ProjectStatus = "Live" | "In progress" | "Shipped" | "Internal" | "Running";

export type Stat = { value: string; label: string };

export type Section = {
  heading: string;
  body?: string[];
  bullets?: string[];
  table?: { head: string[]; rows: string[][]; caption?: string };
};

export type Project = {
  slug: string;
  callsign: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  year: string;
  role: string;
  stack: string[];
  /** A blog, not a build: the home page shows its latest posts. */
  kind?: "blog";
  links: { demo?: string; repo?: string };
  stats: Stat[];
  summary: string;
  /** Brand colour of the project itself, used for its chip and the work list. */
  tint: string;
  /**
   * Screenshot for previews and the case study. "window" frames a website screenshot,
   * "cover" fills the card edge to edge.
   */
  image?: { src: string; alt: string; width: number; height: number; frame: "window" | "cover" };
  /**
   * A short intro film with sound: shown in the home page player, in the work list preview
   * and on the case study. `poster` is its title card; `seconds` is its running time.
   */
  video?: { webm: string; mp4: string; poster: string; seconds: number; label: string };
  sections: Section[];
};

export const projects: Project[] = [
  {
    slug: "queryforge",
    callsign: "QFG-01",
    title: "QueryForge",
    tagline: "A natural-language-to-SQL agent that checks and corrects its own queries.",
    status: "Live",
    year: "2026",
    role: "Solo build, design to deployment",
    stack: [
      "Python",
      "FastAPI",
      "SQLite",
      "sqlglot",
      "Ollama",
      "Groq",
      "MCP",
      "React",
      "TypeScript",
    ],
    links: { demo: "https://queryforge-two.vercel.app" },
    stats: [
      { value: "70.8%", label: "execution accuracy on Spider dev" },
      { value: "1,034", label: "benchmark questions, no hand labels" },
      { value: "3B", label: "parameter model on a laptop GPU" },
    ],
    tint: "#c6ec4a",
    image: {
      src: "/projects/queryforge.jpg",
      alt: "QueryForge home page: ask a database in plain English, get SQL that was run and checked",
      width: 1200,
      height: 750,
      frame: "window",
    },
    video: {
      webm: "/projects/queryforge-intro.webm",
      mp4: "/projects/queryforge-intro.mp4",
      poster: "/projects/queryforge-poster.jpg",
      seconds: 21,
      label: "QueryForge intro film",
    },
    summary:
      "Give it a question and a database. It writes SQL, runs it against the database, reads the error or the result, and corrects itself when something goes wrong. Evaluated on the Spider benchmark by execution accuracy, with every component measured by ablation.",
    sections: [
      {
        heading: "The question",
        body: [
          "People who need numbers from a database often don't write SQL. Large hosted models translate questions into SQL well, but they cost money, send the schema to a third party, and still make mistakes nobody checks.",
          "So the question was: how far can a small, free, local model get when it is wrapped in an agent that checks its own work, and what does each part of that agent actually contribute?",
        ],
      },
      {
        heading: "How it works",
        bullets: [
          "Schema linking keeps only the tables relevant to the question, so prompts stay small on large schemas.",
          "Generation uses versioned prompts with the schema as CREATE TABLE statements.",
          "Safe execution: a static check, a SQLite authoriser and a read-only connection block every write. A timeout and row cap stop runaway queries.",
          "Self-correction sends the error back to the model for a fixed number of retries. This loop is what makes it an agent rather than a single prompt.",
          "Evaluation compares result sets the way the Spider test-suite does, and failures are categorised automatically.",
        ],
      },
      {
        heading: "What each component bought",
        body: [
          "Each run adds one change to the one before it, on the full Spider dev set with qwen2.5-coder:3b running locally.",
        ],
        table: {
          head: ["Run", "Change", "EX"],
          rows: [
            ["R1", "Zero-shot, one attempt", "68.8%"],
            ["R2", "+ retries on SQL errors", "70.4%"],
            ["R2b", "+ retry on empty results", "70.5%"],
            ["R3", "+ keyword schema linking (final)", "70.8%"],
            ["R4", "R3 + 5 few-shot examples", "70.3%"],
            ["R5", "R3 with a general model", "65.9%"],
          ],
          caption: "EX = execution accuracy. Every number traces back to a recorded run.",
        },
      },
      {
        heading: "What I learned",
        bullets: [
          "Self-correction was the biggest single gain (+1.6 points), and it's capped: a query that runs but answers the wrong question looks fine to the loop.",
          "Few-shot examples weren't a plain loss. Hard questions improved by 4.5 points but medium ones dropped by 3.5, because the model copied naming style from the examples.",
          "The code-tuned model matters: the same pipeline with a general 3B model scored 4.9 points lower.",
          "The most useful next step is better column grounding. In 69 of 85 malformed cases the model returned the same broken query after seeing the error.",
        ],
      },
      {
        heading: "Use it on your own data",
        body: [
          "The same pipeline works on any SQLite database or CSV and Excel files: from the web app, from Python, from the command line, or as an MCP server for Claude Desktop and Cursor. Everything stays read-only.",
        ],
      },
    ],
  },
  {
    slug: "ownit",
    callsign: "OWN-02",
    title: "OwnIt",
    tagline: "Turns an AI-assisted draft into a student's own work, and checks they understand it.",
    status: "Live",
    year: "2026",
    role: "Solo build, design to desktop app",
    stack: [
      "Python",
      "FastAPI",
      "spaCy",
      "NLTK",
      "LanguageTool",
      "Next.js",
      "TypeScript",
      "Docker",
    ],
    links: {
      demo: "https://ownit-nine.vercel.app",
      repo: "https://github.com/SairajBandre16/ownit",
    },
    stats: [
      { value: "5", label: "steps from AI draft to owned work" },
      { value: "0", label: "AI models or external APIs" },
      { value: "3", label: "desktop platforms: Windows, macOS, Linux" },
    ],
    tint: "#e8541c",
    image: {
      src: "/projects/ownit.jpg",
      alt: "OwnIt home page: humanise it, understand it, own it",
      width: 1200,
      height: 750,
      frame: "window",
    },
    video: {
      webm: "/projects/ownit-intro.webm",
      mp4: "/projects/ownit-intro.mp4",
      poster: "/projects/ownit-poster.jpg",
      seconds: 37,
      label: "OwnIt intro film",
    },
    summary:
      "OwnIt takes a draft written with AI and walks a student through making it theirs: humanise it, understand it, rewrite the generic parts in their own words, prove they understand it, then export. Every suggestion is rule-based and explained.",
    sections: [
      {
        heading: "The idea",
        body: [
          "Students use AI to draft. The hard part is owning the result: understanding it well enough to explain it, and sounding like themselves. OwnIt is built around that, not around hiding the AI.",
          "Everything is rule-based and explainable. There are no AI models and no external APIs, so every suggestion can say exactly why it was made.",
        ],
      },
      {
        heading: "Five steps",
        bullets: [
          "Humanise: a writing score, explained rewrites to accept or reject, and a report doctor for units, tense, claims and structure.",
          "Walkthrough: a one-line gist, key terms, a simpler version and a concept map that follows your scrolling.",
          "Make it yours: generic spots with prompts, your answers inserted as your own text, and an ownership heatmap.",
          "Prove it: a quiz, a teach-back and a viva simulator.",
          "Export: a .docx and an understanding report, unlocked once you pass the understanding gate.",
        ],
      },
      {
        heading: "How it's built",
        bullets: [
          "Backend: FastAPI with spaCy, NLTK and WordNet, readability and keyword tools, a trigram or KenLM fluency model and a self-hosted LanguageTool server.",
          "Frontend: Next.js, TypeScript, Tailwind and shadcn/ui, with TipTap for editing and React Flow for the concept map.",
          "A desktop app for Windows, macOS and Linux runs the whole backend locally through Docker and updates itself from GitHub releases.",
          "Extras: a voice fingerprint from your past writing, and spaced-repetition flashcards built from your glossary and missed questions.",
        ],
      },
    ],
  },
  {
    slug: "squawk",
    callsign: "SQK-03",
    title: "SQUAWK",
    tagline: "The sky above you, live in 3D. A plane-spotting app built from my favourite hobby.",
    status: "Live",
    year: "2026",
    role: "Solo build, design and engineering",
    stack: ["JavaScript", "Three.js", "WebGL", "ADS-B feeds", "Firebase", "PWA"],
    links: {
      demo: "https://squawk-iota.vercel.app",
      repo: "https://github.com/SairajBandre16/SQUAWK",
    },
    stats: [
      { value: "5s", label: "live aircraft refresh around you" },
      { value: "~150", label: "satellites tracked, plus the ISS" },
      { value: "24", label: "aircraft families to collect" },
    ],
    tint: "#f26a21",
    image: {
      src: "/projects/squawk-poster.jpg",
      alt: "SQUAWK title card: the sky above you, live in 3D",
      width: 1600,
      height: 900,
      frame: "cover",
    },
    video: {
      webm: "/projects/squawk-intro.webm",
      mp4: "/projects/squawk-intro.mp4",
      poster: "/projects/squawk-poster.jpg",
      seconds: 29,
      label: "SQUAWK intro film",
    },
    summary:
      "SQUAWK shows every aircraft around you in real time over satellite imagery. The sun sits where it really is, the clouds follow live weather, and tapping an aircraft tells you exactly where to look to see it with your own eyes.",
    sections: [
      {
        heading: "Why I built it",
        body: [
          "I'm a plane-spotter. Flight trackers tell you what's flying, but not where to look from where you're standing. SQUAWK started as that one feature and grew into a whole live planet.",
        ],
      },
      {
        heading: "Highlights",
        bullets: [
          "Live aircraft from community ADS-B networks, with the feed following the camera as you explore.",
          "Ground view puts you on the ground looking up at true angles, so the scene matches the sky outside.",
          "Sun and moon transit prediction, contrail forecasts from upper-air data, and visible satellite passes.",
          "A sky camera on phones: point it up and every aircraft in range gets a tag where it really is.",
          "A first-sighting guide, XP, streaks and a collection of aircraft families, with optional sign-in to sync progress.",
          "Falls back to realistic simulated traffic if no live feed is reachable, so it never shows an empty sky.",
        ],
      },
      {
        heading: "What it taught me",
        body: [
          "Real-time data is never as clean as the docs suggest. Most of the work was in fallbacks, rate limits, coordinate maths and keeping 3D smooth on a phone, which is the same reliability work that AI systems need.",
        ],
      },
    ],
  },
  {
    slug: "ctrl-automate",
    callsign: "CTA-04",
    title: "Ctrl+Automate",
    tagline:
      "My blog. Practical Python automation, AI tools and CS guides, with code you can copy.",
    status: "Live",
    year: "2026",
    role: "Writer and builder",
    stack: ["Next.js", "MDX", "Python", "n8n"],
    kind: "blog",
    links: { demo: "https://ctrl-automate.vercel.app" },
    stats: [
      { value: "3", label: "topics: Python automation, AI tools, n8n" },
      { value: "2", label: "free browser tools" },
    ],
    tint: "#2f6bf2",
    image: {
      src: "/projects/ctrl-automate.jpg",
      alt: "Ctrl+Automate blog home page: automate the boring stuff, ship the fun stuff",
      width: 1200,
      height: 750,
      frame: "window",
    },
    summary:
      "Ctrl+Automate is where I write up what I automate. Each post is a tested, copy-paste guide: sorting a Downloads folder, Telegram alerts for scripts, running Python on a schedule with GitHub Actions, turning raw CSVs into Excel reports.",
    sections: [
      {
        heading: "Why I write",
        body: [
          "If something annoys me twice, I automate it. Writing it up properly is how I make sure I understand it, and it saves the next person an afternoon.",
        ],
      },
      {
        heading: "What's there",
        bullets: [
          "Python automation tutorials: files, Excel, scraping, schedules and alerts.",
          "AI tools, starting with extracting structured data from text with an LLM.",
          "n8n workflows, including an honest n8n vs Zapier comparison.",
          "Two small browser tools: a JSON to Pydantic converter and a cron expression explainer.",
        ],
      },
    ],
  },
  {
    slug: "personal-automations",
    callsign: "AUT-05",
    title: "Life, automated",
    tagline:
      "I automate my own stuff. Small pipelines for things that annoyed me: flat-hunting and job-hunting in Dublin.",
    status: "Running",
    year: "2026",
    role: "Personal tools",
    stack: ["Web scraping", "Scheduled jobs", "Email alerts"],
    // TODO(Sairaj): confirm the stack and add repo links if public.
    links: {},
    stats: [
      { value: "2", label: "pipelines running on a schedule" },
      { value: "0", label: "listings refreshed by hand" },
    ],
    tint: "#e3b341",
    summary:
      "Moving to Dublin meant refreshing Daft.ie and job boards all day. So I stopped, and built two small pipelines that do the refreshing for me.",
    sections: [
      {
        heading: "Daft.ie apartment alerts",
        body: [
          "Dublin rentals go fast. The pipeline watches for new listings that match my filters and alerts me as soon as they appear, so I'm not the fortieth person to email the landlord.",
        ],
      },
      {
        heading: "Daily job-alert scraper",
        body: ["A scraper collects fresh AI and ML roles every day and emails me the new ones."],
      },
      {
        heading: "Why it's here",
        body: [
          "These aren't big systems, but they're how I think: if something annoys me twice, I automate it. Most of my projects started that way.",
        ],
      },
    ],
  },
  {
    slug: "rainwise",
    callsign: "RNW-06",
    title: "RainWise",
    tagline: "Predicts rainfall, then tells you how much rainwater to store.",
    status: "Shipped",
    year: "2024",
    role: "Undergraduate project, published at ICCCNT 2025",
    stack: ["Python", "Deep learning", "Flutter"],
    links: { repo: "https://github.com/SairajBandre16/RainWise" },
    stats: [{ value: "2025", label: "paper at ICCCNT" }],
    tint: "#3aa0d8",
    summary:
      "A deep learning model trained on Indian weather data predicts rainfall and drives a mobile app that recommends rainwater storage solutions. It took the project from data to model to something a person can act on.",
    sections: [
      {
        heading: "The idea",
        body: [
          "Rainwater harvesting works best when you know how much rain is coming. RainWise turns a rainfall forecast into a practical storage recommendation.",
        ],
      },
      {
        heading: "How it works",
        bullets: [
          "A deep learning model trained on Indian weather data predicts rainfall.",
          "A Flutter mobile app turns the prediction into rainwater storage recommendations.",
          "The work was published as RainWise: Smart Rainwater Harvesting at ICCCNT 2025.",
        ],
      },
    ],
  },
  {
    slug: "chainwatch",
    callsign: "CHW-07",
    title: "ChainWatch",
    tagline:
      "An early-warning system for supply-chain disruptions on India to Europe shipping lanes.",
    status: "In progress",
    year: "2026",
    role: "Solo research build",
    stack: ["Python", "Ollama", "NetworkX", "LightGBM", "SHAP", "FastAPI", "Streamlit", "GDELT"],
    links: { repo: "https://github.com/SairajBandre16/ChainWatch" },
    stats: [
      { value: "≥30 days", label: "early warning on the 2023 Red Sea crisis (backtest)" },
      { value: "0.776", label: "ROC AUC, late-delivery model" },
      { value: "119", label: "offline tests" },
    ],
    tint: "#2bb39a",
    summary:
      "ChainWatch reads global news, extracts disruption events with an LLM, maps them onto a trade-lane graph of ports and chokepoints, adds a delay-risk model with SHAP explanations, and has an agent write a grounded mitigation brief. It's where my supply-chain background meets AI.",
    sections: [
      {
        heading: "Why this one",
        body: [
          "I spent my first job watching shipments move. ChainWatch asks a question I care about from that work: how early could a system have flagged the 2021 Suez blockage and the 2023 Red Sea crisis, and how often does it cry wolf?",
          "Everything is free and runs on a laptop: local models through Ollama, open data, no paid APIs.",
        ],
      },
      {
        heading: "Architecture",
        bullets: [
          "Ingestion from six RSS feeds and GDELT, with an offline cache.",
          "LLM event extraction into a typed DisruptionEvent schema, with JSON self-repair retries.",
          "A knowledge graph of 58 ports, 35 waypoints (10 chokepoints) and 23 lanes, with exposure scoring and alternate routes.",
          "A LightGBM delay-risk model compared against baselines, explained with SHAP.",
          "An agent with eight typed tools, guard rails and a deterministic fallback that writes a cited mitigation brief.",
          "A spec-first backtest: the rules were written down before running it.",
        ],
      },
      {
        heading: "Results so far",
        table: {
          head: ["Disruption", "Onset", "Lead time"],
          rows: [
            ["Suez Canal blocked (Ever Given)", "2021-03-23", "Same-day detection"],
            ["Red Sea crisis", "2023-12-15", "≥ 30 days"],
            ["Quiet control periods", "60 days", "False-alarm rate 0.75"],
          ],
          caption:
            "Keyword extractor, 164 GDELT days, 41,937 news items, lane Nhava Sheva to Rotterdam.",
        },
      },
      {
        heading: "What failed, honestly",
        bullets: [
          "A 0.75 false-alarm rate makes the keyword-based system unusable as is. Pre-registered post-hoc fixes bring it to 0.367, still too high.",
          "The full LLM backtest didn't finish: a 3B model on a laptop CPU needs around 20 hours for the prefiltered items.",
          "Small LLMs make plain mistakes, like inventing a port code. Guard rails catch the structured errors; free-text summaries can still slip.",
          "Two disruptions is a tiny sample. The backtest illustrates behaviour, not statistical strength.",
        ],
      },
    ],
  },
];

export type ArchiveItem = {
  title: string;
  year: string;
  blurb: string;
  stack: string[];
  href: string;
  note?: string;
};

export const archive: ArchiveItem[] = [
  {
    title: "Scan To Measure",
    year: "2023",
    blurb: "Real-time object size measurement with OpenCV and ArUco markers.",
    stack: ["Python", "OpenCV"],
    href: "https://github.com/SairajBandre16/Scan-to-Measure",
    note: "Paper · IJRTI 2023",
  },
  {
    title: "News Summariser",
    year: "2023",
    blurb: "Full-stack NLP app that summarises news across categories.",
    stack: ["Next.js", "Flask", "NLP"],
    href: "https://github.com/SairajBandre16/News-Summarizer",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
