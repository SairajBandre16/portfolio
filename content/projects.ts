// Curated projects and case studies. Every number here comes from the project's own README,
// write-up or results file. Ergode work is described without company data or internal names.

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
  builtWithClaudeCode: boolean;
  links: { demo?: string; repo?: string };
  stats: Stat[];
  summary: string;
  image?: { src: string; alt: string };
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
    stack: ["Python", "FastAPI", "SQLite", "sqlglot", "Ollama", "Groq", "MCP", "React", "TypeScript"],
    builtWithClaudeCode: true,
    links: { demo: "https://queryforge-two.vercel.app" },
    stats: [
      { value: "70.8%", label: "execution accuracy on Spider dev" },
      { value: "1,034", label: "benchmark questions, no hand labels" },
      { value: "3B", label: "parameter model on a laptop GPU" },
    ],
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
    slug: "chainwatch",
    callsign: "CHW-02",
    title: "ChainWatch",
    tagline: "An early-warning system for supply-chain disruptions on India to Europe shipping lanes.",
    status: "In progress",
    year: "2026",
    role: "Solo research build",
    stack: ["Python", "Ollama", "NetworkX", "LightGBM", "SHAP", "FastAPI", "Streamlit", "GDELT"],
    builtWithClaudeCode: true,
    links: { repo: "https://github.com/SairajBandre16/ChainWatch" },
    stats: [
      { value: "≥30 days", label: "early warning on the 2023 Red Sea crisis (backtest)" },
      { value: "0.776", label: "ROC AUC, late-delivery model" },
      { value: "119", label: "offline tests" },
    ],
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
          caption: "Keyword extractor, 164 GDELT days, 41,937 news items, lane Nhava Sheva to Rotterdam.",
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
  {
    slug: "squawk",
    callsign: "SQK-03",
    title: "SQUAWK",
    tagline: "The sky above you, live in 3D. A plane-spotting app built from my favourite hobby.",
    status: "Live",
    year: "2026",
    role: "Solo build, design and engineering",
    stack: ["JavaScript", "Three.js", "WebGL", "ADS-B feeds", "Firebase", "PWA"],
    builtWithClaudeCode: true,
    links: { demo: "https://squawk-iota.vercel.app", repo: "https://github.com/SairajBandre16/SQUAWK" },
    stats: [
      { value: "5s", label: "live aircraft refresh around you" },
      { value: "~150", label: "satellites tracked, plus the ISS" },
      { value: "24", label: "aircraft families to collect" },
    ],
    image: { src: "/projects/squawk-wide.jpg", alt: "SQUAWK showing live aircraft over Ireland in 3D" },
    summary:
      "Squawk shows every aircraft around you in real time over satellite imagery. The sun sits where it really is, the clouds follow live weather, and tapping an aircraft tells you exactly where to look to see it with your own eyes.",
    sections: [
      {
        heading: "Why I built it",
        body: [
          "I'm a plane-spotter. Flight trackers tell you what's flying, but not where to look from where you're standing. Squawk started as that one feature and grew into a whole live planet.",
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
    slug: "ergode-automation",
    callsign: "ERG-04",
    title: "Warehouse automation at Ergode",
    tagline: "Pipelines and RPA that ran real e-commerce operations every day.",
    status: "Internal",
    year: "2025–2026",
    role: "AI Intern, then Executive, Supply Chain & Automation",
    stack: ["Python", "Selenium", "PaddleOCR", "n8n", "Google Sheets API", "Gmail API", "Excel", "SQL"],
    builtWithClaudeCode: false,
    links: {},
    stats: [
      { value: "2", label: "seller portals automated (Walmart DSV, Shein)" },
      { value: "Daily", label: "used in live operations" },
      { value: "RPA", label: "where the official API stopped" },
    ],
    summary:
      "Two systems from my time at Ergode, described without company data: an invoice and pallet-tracking pipeline with AI-generated insights, and a returns-processing bot that reads labels and barcodes.",
    sections: [
      {
        heading: "Invoice and pallet-tracking pipeline",
        body: [
          "Shipping invoices arrived by email and someone had to copy them into spreadsheets before anyone could see what was going on. I built a pipeline that does it end to end.",
        ],
        bullets: [
          "Pulls invoices from Gmail and writes structured rows into Google Sheets.",
          "Builds an Excel workbook tracking pallets, shipping variance and shipper performance.",
          "Adds AI-generated insights on top of the numbers, then sends an HTML email report to the team.",
        ],
      },
      {
        heading: "Returns-processing RPA",
        body: [
          "Returns meant reading labels, scanning barcodes and looking things up by hand. The bot does the repetitive part.",
        ],
        bullets: [
          "Selenium drives the browser workflows step by step, the way a person would.",
          "Barcode scanning plus OCR with PaddleOCR reads the label details.",
          "Google Sheets lookups match each return to the right record.",
        ],
      },
      {
        heading: "What it taught me",
        bullets: [
          "Automation that people rely on needs logging, retries and a clear way to see when it failed.",
          "The hardest integrations are the ones without an API. RPA is a valid tool when it's the only door.",
          "Turning stakeholder requests into maintainable tools is a skill in itself, and the one I use most in AI work now.",
        ],
      },
    ],
  },
  {
    slug: "personal-automations",
    callsign: "AUT-05",
    title: "I automate my own life",
    tagline: "Small pipelines for things that annoyed me: flat-hunting and job-hunting in Dublin.",
    status: "Running",
    year: "2026",
    role: "Personal tools",
    stack: ["Web scraping", "Scheduled jobs", "Email alerts"],
    // TODO(Sairaj): confirm stack and whether these were built with Claude Code; add repo links if public.
    builtWithClaudeCode: false,
    links: {},
    stats: [
      { value: "2", label: "pipelines running on a schedule" },
      { value: "0", label: "listings refreshed by hand" },
    ],
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
        body: [
          "A scraper collects fresh AI and ML roles every day and emails me the new ones.",
        ],
      },
      {
        heading: "Why it's here",
        body: [
          "These aren't big systems, but they're how I think: if something annoys me twice, I automate it. Most of my projects started that way.",
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
    title: "OwnIt",
    year: "2026",
    blurb: "Helps a student understand and rewrite an AI-assisted draft in their own words. Rule-based NLP, no LLMs.",
    stack: ["FastAPI", "spaCy", "Next.js"],
    href: "https://github.com/SairajBandre16/ownit",
  },
  {
    title: "RainWise",
    year: "2024",
    blurb: "Deep learning rainfall prediction on Indian weather data, delivered in a mobile app for rainwater storage.",
    stack: ["Flutter", "Python", "Deep learning"],
    href: "https://github.com/SairajBandre16/RainWise",
    note: "Paper · ICCCNT 2025",
  },
  {
    title: "Scan To Measure",
    year: "2023",
    blurb: "Real-time object size measurement with OpenCV and ArUco markers.",
    stack: ["Python", "OpenCV"],
    href: "https://github.com/SairajBandre16/Scan-to-Measure",
    note: "Paper · IJRTI 2023",
  },
  {
    title: "News Summarizer",
    year: "2023",
    blurb: "Full-stack NLP app that summarises news across categories.",
    stack: ["Next.js", "Flask", "NLP"],
    href: "https://github.com/SairajBandre16/News-Summarizer",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
