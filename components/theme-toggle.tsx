"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <FiSun className="h-5 w-5" />
      <label className="theme-switch">
        <input
          type="checkbox"
          checked={resolvedTheme === "dark"}
          onChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        />
        <span className="slider"></span>
      </label>
      <FiMoon className="h-5 w-5" />
    </div>
  );
}