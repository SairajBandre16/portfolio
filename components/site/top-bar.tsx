import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeSwitch } from "./theme-switch";
import { FlightClock } from "./flight-clock";
import { cn } from "@/lib/utils";

export function TopBar({ back, className }: { back?: boolean; className?: string }) {
  return (
    <header className={cn("flex items-center justify-between gap-4 py-5 sm:py-6", className)}>
      <div className="flex items-center gap-4">
        <ThemeSwitch />
        {back && (
          <Link
            href="/#work"
            className="group text-soft hover:text-fg inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            Sairaj Bandre
          </Link>
        )}
      </div>
      <FlightClock />
    </header>
  );
}
