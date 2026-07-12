"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BouquetViewer } from "@/components/receiver/BouquetViewer";
import { Flower, useCreatorStore } from "@/store/useCreatorStore";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, HeartOff, Gift } from "lucide-react";

// Standard client-side base64 helper
function decodeBouquetData(base64Str: string): any {
  try {
    const decoded = decodeURIComponent(escape(atob(base64Str)));
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Decoding error:", e);
    return null;
  }
}

function BouquetViewContent() {
  const { wrappers, flowersList, customWrapperConfigs } = useCreatorStore();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawData = searchParams.get("data");
    if (rawData) {
      const decoded = decodeBouquetData(rawData);
      if (decoded) {
        setData(decoded);
      }
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl text-rose-500 flex items-center justify-center"
        >
          <Heart className="w-10 h-10 fill-rose-500 animate-pulse" />
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4 text-center bg-background px-4 font-sans">
        <div className="text-muted-foreground mb-2">
          <HeartOff className="w-16 h-16" />
        </div>
        <h1 className="font-heading text-4xl">This bouquet could not be found.</h1>
        <p className="text-muted-foreground">The link might be incomplete or broken.</p>
        <Link href="/bouquet" className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-6")}>
          Create Your Own Bouquet or Invitation
        </Link>
      </div>
    );
  }

  // Map encoded flower types back to the Flower objects structure expected by BouquetViewer
  const flowers: Flower[] = (data.f || []).map((type: string, i: number) => ({
    id: `flower-piece-${i}`,
    type,
    x: 0,
    y: 0
  }));

  const themeClass = data.t ? `theme-${data.t.toLowerCase().replace(" ", "-")}` : "";

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors duration-500 bg-background text-foreground ${themeClass}`}>
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
        <div className="absolute -top-[10%] -left-[10%] h-[50vh] w-[50vw] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[0%] h-[40vh] w-[40vw] rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[60vh] w-[60vw] rounded-full bg-accent/20 blur-[150px]" />
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center p-4 bg-primary/5"
            onClick={() => setIsOpen(true)}
          >
            <div className="group relative text-center">
              {/* Pulsing indicator */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-8 rounded-full bg-primary/20 blur-xl"
              />
              
              <div className="relative flex flex-col items-center gap-6">
                <div className="text-primary transition-transform duration-500 group-hover:scale-110">
                  <Gift className="w-20 h-20 animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                <div className="font-heading text-3xl tracking-wide text-foreground/80">
                  You received a bouquet!
                </div>
                <div className="text-md font-medium text-primary bg-primary/10 border border-primary/25 rounded-full px-5 py-1.5 shadow-sm">
                  For {data.to || "You"}
                </div>
                <div className="text-sm font-medium text-muted-foreground animate-pulse mt-2">
                  Tap to open
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="bouquet-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative z-10 mx-auto max-w-5xl px-4 py-8 flex flex-col items-center min-h-screen justify-center gap-8 md:gap-12"
          >
            <div className="text-center space-y-2">
              <h1 className="font-heading text-4xl sm:text-5xl">For You, {data.to || "Beautiful"}</h1>
              {data.from && (
                <p className="text-muted-foreground font-medium">With love from {data.from}</p>
              )}
            </div>

            <div className="grid w-full items-center justify-center gap-8 md:grid-cols-2 md:gap-12 max-w-4xl">
              {/* Bouquet display */}
              <div className="flex justify-center w-full">
                <BouquetViewer
                  flowers={flowers}
                  bouquetWrapper={data.w}
                  wrappers={wrappers}
                  flowersList={flowersList}
                  customWrapperConfigs={customWrapperConfigs}
                />
              </div>

              {/* Love Note */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
                className="relative rounded-3xl border border-primary/10 bg-white/70 p-8 shadow-xl backdrop-blur-md dark:bg-black/70 flex flex-col justify-between min-h-[300px] max-w-md mx-auto w-full group overflow-hidden"
              >
                {/* Decorative flower outline in letter corner */}
                <div className="absolute -bottom-8 -right-8 text-primary/5 select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <Gift className="w-40 h-40 opacity-20" />
                </div>

                <div className="space-y-6">
                  {/* Handwritten header line */}
                  <div className="border-b border-dashed border-primary/20 pb-4">
                    <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground block mb-1">A Love Letter</span>
                    <h3 className="font-heading text-xl text-primary">Dear {data.to},</h3>
                  </div>

                  {/* Body text with handwriting font */}
                  <p className="font-handwriting text-2xl text-foreground/95 leading-relaxed whitespace-pre-wrap pl-2 italic">
                    {data.msg || "I put together these beautiful flowers to remind you of how special you are. You make my world a lot brighter!"}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-dashed border-primary/10 flex justify-between items-end">
                  <div className="text-left font-sans text-xs text-muted-foreground select-none">
                    Created with <span className="text-primary font-medium">LoveNest</span>
                  </div>
                  {data.from && (
                    <div className="text-right">
                      <span className="font-sans text-xs text-muted-foreground block">With all my love,</span>
                      <span className="font-heading text-lg text-primary">{data.from}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Virality call to action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 2.2 }}
              className="text-center mt-6"
            >
              <Link 
                href="/" 
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }), 
                  "rounded-full border-primary/20 bg-background/50 hover:bg-primary/5"
                )}
              >
                Create Your Own Bouquet or Invitation
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BouquetViewPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-pulse" />
      </div>
    }>
      <BouquetViewContent />
    </Suspense>
  );
}
