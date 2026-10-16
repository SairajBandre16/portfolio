"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <MotionConfig
        reducedMotion="user"
        transition={{ type: "spring", stiffness: 110, damping: 20 }}
      >
        {children}
      </MotionConfig>
    </ThemeProvider>
  );
}
