"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeContext } from "./contexts/theme-provider";

export function ModeToggle() {
  const { isDark, toggle } = useContext(ThemeContext);
  useEffect(() => {
    if (isDark) {
      document.body.classList.add(`dark`);
    } else {
      document.body.classList.remove(`dark`);
    }
  }, [isDark]);

  return (
    <Button
      onClick={() => {
        toggle();
      }}
      variant="outline"
      size="icon">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
