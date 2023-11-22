import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
  selectTheme: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("taskTheme");
    return storedTheme || "light";
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("taskTheme", newTheme);
  };

  const selectTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem("taskTheme", newTheme);
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("taskTheme");
    document.querySelector("html")?.setAttribute("data-theme", localTheme || "");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, selectTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
