import {
  Bot,
  BrainCircuit,
  ChartBarBig,
  Database,
  FileChartColumn,
  FolderTree,
  Gauge,
  MessagesSquare,
  MousePointerClick,
  Plug,
  ScanEye,
  Server,
  Sparkles,
  TreePine,
  Waypoints,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  siClaude,
  siDocker,
  siFastapi,
  siFlask,
  siFlutter,
  siGit,
  siModelcontextprotocol,
  siN8n,
  siNextdotjs,
  siOllama,
  siOpencv,
  siOpenjdk,
  siPandas,
  siPython,
  siPytorch,
  siReact,
  siSelenium,
  siStreamlit,
  siTensorflow,
  siThreedotjs,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

// Brand logos where a tool has one; a Lucide glyph for concepts.
const icons: Record<string, SimpleIcon | LucideIcon> = {
  "LLM agents": Bot,
  NLP: MessagesSquare,
  "Deep learning": BrainCircuit,
  "Computer vision": ScanEye,
  PyTorch: siPytorch,
  TensorFlow: siTensorflow,
  OpenCV: siOpencv,
  LightGBM: TreePine,
  SHAP: ChartBarBig,
  Ollama: siOllama,
  MCP: siModelcontextprotocol,
  n8n: siN8n,
  RPA: MousePointerClick,
  Selenium: siSelenium,
  "Business process automation": Workflow,
  "API integration": Plug,
  "Backend automation": Server,
  SQL: Database,
  "Data pipelines": Waypoints,
  "SQL reporting": FileChartColumn,
  "Data management": FolderTree,
  pandas: siPandas,
  "Evaluation harnesses": Gauge,
  Python: siPython,
  Java: siOpenjdk,
  TypeScript: siTypescript,
  FastAPI: siFastapi,
  Flask: siFlask,
  Streamlit: siStreamlit,
  "Next.js": siNextdotjs,
  React: siReact,
  Flutter: siFlutter,
  "Three.js": siThreedotjs,
  Docker: siDocker,
  Git: siGit,
  "Claude Code": siClaude,
};

export function SkillIcon({ name, className }: { name: string; className?: string }) {
  const icon = icons[name] ?? Sparkles;
  if ("path" in icon) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
        <path d={icon.path} />
      </svg>
    );
  }
  const Icon = icon;
  return <Icon aria-hidden strokeWidth={1.75} className={className} />;
}
