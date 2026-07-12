"use client";

import { useCreatorStore, Theme } from "@/store/useCreatorStore";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const THEMES: { id: Theme; name: string; colors: string[] }[] = [
  { id: "Sakura", name: "Sakura Blossom", colors: ["#fdf2f8", "#fbcfe8", "#f472b6"] },
  { id: "Moonlight", name: "Midnight Moon", colors: ["#0f172a", "#1e293b", "#3b82f6"] },
  { id: "Galaxy", name: "Deep Galaxy", colors: ["#2e1065", "#4c1d95", "#8b5cf6"] },
  { id: "Cafe", name: "Warm Cafe", colors: ["#fffbeb", "#fef3c7", "#d97706"] },
  { id: "Vintage", name: "Vintage Letter", colors: ["#fef08a", "#fde047", "#a16207"] },
  { id: "Ocean", name: "Ocean Breeze", colors: ["#ecfeff", "#cffafe", "#06b6d4"] },
  { id: "Pastel", name: "Soft Pastel", colors: ["#faf5ff", "#f3e8ff", "#d8b4fe"] },
  { id: "Storybook", name: "Storybook", colors: ["#f0fdf4", "#dcfce7", "#22c55e"] },
  { id: "Minimal", name: "Minimalist", colors: ["#ffffff", "#f1f5f9", "#94a3b8"] },
  { id: "Dark Romance", name: "Dark Romance", colors: ["#000000", "#18181b", "#e11d48"] },
];

export function StepTheme() {
  const { theme, setTheme } = useCreatorStore();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div className="space-y-2 text-center">
        <h3 className="font-heading text-3xl">Choose an Aesthetic</h3>
        <p className="text-muted-foreground">This sets the mood and colors for the entire experience.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {THEMES.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(t.id)}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 p-3 transition-colors",
              theme === t.id
                ? "border-primary bg-primary/5"
                : "border-transparent hover:bg-muted"
            )}
          >
            <div 
              className="flex h-16 w-full items-center justify-center overflow-hidden rounded-xl shadow-sm transition-shadow group-hover:shadow-md"
              style={{
                background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})`
              }}
            >
              <div 
                className="h-8 w-8 rounded-full border-2 border-white/50 shadow-sm"
                style={{ backgroundColor: t.colors[2] }}
              />
            </div>
            <span className={cn(
              "text-sm font-medium transition-colors",
              theme === t.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}>
              {t.name}
            </span>
            
            {theme === t.id && (
              <motion.div
                layoutId="active-theme-indicator"
                className="absolute inset-0 rounded-2xl border-2 border-primary"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
