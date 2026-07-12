"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export function StepMiniGame() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-8 text-center">
      <div className="space-y-2">
        <h3 className="font-heading text-3xl">Memory Match Game</h3>
        <p className="text-muted-foreground">They'll have to play a little game to continue.</p>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 text-3xl"
              >
                {i === 1 || i === 4 ? "❤️" : "✨"}
              </motion.div>
            ))}
          </div>
        </div>
        
        <h4 className="font-heading text-xl">How it works</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          When they reach this part of the journey, they will need to match the hidden cards to prove they are paying attention before they can proceed to the next page!
        </p>
      </div>
    </div>
  );
}
