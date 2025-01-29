"use client";

import { createContext, useState } from "react";

export const ThemeContext = createContext({
  isDark: true,
  toggle: () => {},
});

export const ThemeProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isDark, setDark] = useState(false);
  const toggle = () => setDark((p) => !p);
  return (
    <div>
      <ThemeContext.Provider value={{ isDark, toggle }}>
        {children}
      </ThemeContext.Provider>
    </div>
  );
};
