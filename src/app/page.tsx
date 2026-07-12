"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  useEffect(() => {
    try {
      const oldKey = 'date-invite-creator-storage';
      const newKey = 'lovenest-creator-storage';
      const oldInvites = 'date-invites-created';
      const newInvites = 'lovenest-invites-created';
      
      if (typeof window !== 'undefined') {
        const oldVal = localStorage.getItem(oldKey);
        const newVal = localStorage.getItem(newKey);
        if (oldVal && !newVal) {
          localStorage.setItem(newKey, oldVal);
          window.location.reload();
        }
        
        const oldInvVal = localStorage.getItem(oldInvites);
        const newInvVal = localStorage.getItem(newInvites);
        if (oldInvVal && !newInvVal) {
          localStorage.setItem(newInvites, oldInvVal);
        }
      }
    } catch (e) {}
  }, []);
  return (
    <main className="relative min-h-screen overflow-y-auto bg-background text-foreground selection:bg-primary/30">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[50vh] w-[50vw] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[0%] h-[40vh] w-[40vw] rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[60vh] w-[60vw] rounded-full bg-accent/20 blur-[150px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl space-y-8"
        >
          <div className="inline-block rounded-full border border-primary/20 bg-white/40 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md dark:bg-black/40">
            LoveNest 💖 A Magical Experience
          </div>
          
          <h1 className="font-heading text-5xl tracking-tight sm:text-7xl md:text-8xl">
            Ask someone out <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              beautifully.
            </span>
          </h1>
          
          <p className="mx-auto max-w-xl text-lg text-muted-foreground sm:text-xl">
            Don't just send a text. Craft an emotional journey, complete with memories, interactive games, and a little bit of magic.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/create" className={cn(buttonVariants({ size: "lg" }), "h-14 rounded-full px-8 text-lg font-medium shadow-xl shadow-primary/25 transition-transform hover:scale-105 active:scale-95")}>
              Create Date
            </Link>
            <Link
              href="/bouquet"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-14 rounded-full border border-primary/20 bg-card px-8 text-lg font-medium shadow-md transition-transform hover:scale-105 active:scale-95 hover:border-primary/50 text-foreground flex items-center gap-2 cursor-pointer")}
            >
              Craft a Bouquet
            </Link>
            <Link href="/demo" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 rounded-full border-primary/10 bg-transparent px-8 text-lg font-medium backdrop-blur-md hover:bg-primary/5")}>
              Explore Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
