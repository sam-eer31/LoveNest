"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { BouquetDesigner } from "@/components/creator/BouquetDesigner";
import { useCreatorStore, Flower } from "@/store/useCreatorStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Wand2, Copy, Check, ExternalLink, RotateCcw, ArrowRight, ArrowLeft, Heart } from "lucide-react";

// Standard client-side base64 helper
function encodeBouquetData(dataObj: any): string {
  try {
    const jsonStr = JSON.stringify(dataObj);
    return btoa(unescape(encodeURIComponent(jsonStr)));
  } catch (e) {
    console.error("Encoding error:", e);
    return "";
  }
}

const THEME_OPTIONS = [
  { id: "Sakura", label: "Sakura", colors: "from-[#fdf2f8] to-[#fbcfe8] border-pink-200 text-pink-700 bg-pink-50" },
  { id: "Moonlight", label: "Moonlight", colors: "from-[#0f172a] to-[#1e293b] border-slate-700 text-slate-200 bg-slate-900" },
  { id: "Galaxy", label: "Galaxy", colors: "from-[#2e1065] to-[#4c1d95] border-violet-800 text-violet-200 bg-violet-950" },
  { id: "Cafe", label: "Cafe", colors: "from-[#fafaf9] to-[#d6d3d1] border-stone-200 text-stone-700 bg-stone-50" },
  { id: "Vintage", label: "Vintage", colors: "from-[#fefcbf] to-[#fef3c7] border-amber-200 text-amber-800 bg-amber-50" },
  { id: "Ocean", label: "Ocean", colors: "from-[#ecfeff] to-[#a5f3fc] border-cyan-200 text-cyan-700 bg-cyan-50" },
  { id: "Pastel", label: "Pastel", colors: "from-[#f5f3ff] to-[#ddd6fe] border-purple-200 text-purple-700 bg-purple-50" },
  { id: "Storybook", label: "Storybook", colors: "from-[#f0fdf4] to-[#bbf7d0] border-emerald-200 text-emerald-700 bg-emerald-50" },
  { id: "Dark Romance", label: "Dark Romance", colors: "from-[#090507] to-[#1a0b12] border-rose-950 text-rose-200 bg-[#12070c]" }
];

export function BouquetCreator() {
  const { wrappers, flowersList, customWrapperConfigs } = useCreatorStore();

  const [step, setStep] = useState<"design" | "details" | "share">("design");
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [bouquetWrapper, setBouquetWrapper] = useState<string>("classic");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [loveMessage, setLoveMessage] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("Sakura");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  // Prevent Next.js hydration issues by waiting until mounted
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
    if (wrappers && wrappers.length > 0) {
      // Ensure selected wrapper exists in custom/default wrappers list
      const hasSelected = wrappers.some(w => w.id === bouquetWrapper);
      if (!hasSelected) {
        const hasClassic = wrappers.some(w => w.id === "classic");
        setBouquetWrapper(hasClassic ? "classic" : wrappers[0].id);
      }
    }
  }, [wrappers]);

  const handleGenerateLink = () => {
    if (!recipientName.trim()) {
      alert("Please enter the recipient's name to make it personal!");
      return;
    }

    const payload = {
      w: bouquetWrapper,
      f: flowers.map(f => f.type),
      to: recipientName.trim(),
      from: senderName.trim(),
      msg: loveMessage.trim(),
      t: selectedTheme
    };

    const hash = encodeBouquetData(payload);
    const origin = window.location.origin;
    const link = `${origin}/bouquet/view?data=${hash}`;

    setGeneratedLink(link);
    setStep("share");

    // Save to local bouquet history
    try {
      const history = JSON.parse(localStorage.getItem("bouquets-created") || "[]");
      history.push({
        id: Math.random().toString(36).slice(2, 9),
        to: recipientName.trim(),
        from: senderName.trim(),
        theme: selectedTheme,
        createdAt: Date.now(),
        link: link
      });
      localStorage.setItem("bouquets-created", JSON.stringify(history));
    } catch (e) {
      console.error("Error saving history:", e);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFlowers([]);
    const hasClassic = wrappers.some(w => w.id === "classic");
    setBouquetWrapper(hasClassic ? "classic" : (wrappers[0]?.id || "classic"));
    setRecipientName("");
    setSenderName("");
    setLoveMessage("");
    setSelectedTheme("Sakura");
    setGeneratedLink("");
    setStep("design");
  };

  if (!isHydrated) {
    return (
      <div className="w-full text-left">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-heading text-3xl">Design Your Bouquet</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Select flowers and wrap them beautifully.</p>
          </div>
          <div className="flex gap-2">
            <div className="h-2 w-12 rounded-full bg-primary" />
            <div className="h-2 w-12 rounded-full bg-primary/20" />
            <div className="h-2 w-12 rounded-full bg-primary/20" />
          </div>
        </div>
        <div className="flex min-h-[400px] items-center justify-center rounded-3xl border bg-card p-6 sm:p-8 md:p-10 shadow-sm">
          <div className="text-muted-foreground text-sm font-medium">Loading designer...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl">
            {step === "design" && "Design Your Bouquet"}
            {step === "details" && "Personalize Your Gift"}
            {step === "share" && "Your Bouquet is Ready!"}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {step === "design" && "Select flowers and wrap them beautifully."}
            {step === "details" && "Write a special love note for them."}
            {step === "share" && "Send this link to your loved one."}
          </p>
        </div>
        <div className="flex gap-2">
          {["design", "details", "share"].map((s, idx) => (
            <div
              key={s}
              className={cn(
                "h-2 w-12 rounded-full transition-colors",
                (step === "design" && idx === 0) ||
                (step === "details" && idx <= 1) ||
                (step === "share" && idx <= 2)
                  ? "bg-primary"
                  : "bg-primary/20"
              )}
            />
          ))}
        </div>
      </div>

      <div className="relative min-h-[400px] overflow-hidden rounded-3xl border bg-card p-6 sm:p-8 md:p-10 shadow-sm transition-all duration-300">
        <AnimatePresence mode="wait">
          {step === "design" && (
            <motion.div
              key="design-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <BouquetDesigner
                flowers={flowers}
                setFlowers={setFlowers}
                bouquetWrapper={bouquetWrapper}
                setBouquetWrapper={setBouquetWrapper}
                customWrapperConfigs={customWrapperConfigs}
                wrappers={wrappers}
                flowersList={flowersList}
              />
              
              <div className="mt-8 flex justify-end">
                <Button
                  onClick={() => setStep("details")}
                  disabled={flowers.length === 0}
                  className="w-full sm:w-48 shadow-lg shadow-primary/25 h-12 rounded-full font-medium"
                >
                  Next: Add Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              key="details-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 max-w-xl mx-auto"
            >
              <div className="space-y-4 text-left">
                <div className="grid gap-2">
                  <Label htmlFor="recipient">Who is this bouquet for? <span className="text-red-500">*</span></Label>
                  <Input
                    id="recipient"
                    placeholder="e.g. My Princess, Sarah, Love of my life"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    maxLength={50}
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sender">From who? (Optional)</Label>
                  <Input
                    id="sender"
                    placeholder="e.g. Your Romeo, Alex"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    maxLength={50}
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">A love note... (Optional)</Label>
                  <textarea
                    id="message"
                    placeholder="Write a sweet message to go with your bouquet. It will appear on a handwritten card next to the flowers..."
                    value={loveMessage}
                    onChange={(e) => setLoveMessage(e.target.value)}
                    maxLength={500}
                    rows={4}
                    className="w-full min-w-0 rounded-xl border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 resize-none h-28"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Select Visual Theme</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-center">
                    {THEME_OPTIONS.map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={cn(
                          "group cursor-pointer rounded-2xl border p-3 text-center transition-all hover:scale-105 active:scale-95 shadow-sm relative overflow-hidden",
                          selectedTheme === theme.id 
                            ? "ring-2 ring-primary border-transparent font-medium" 
                            : "border-border/60 hover:border-primary/40 bg-card"
                        )}
                      >
                        <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", theme.colors)} />
                        <span className="relative z-10 text-sm select-none">{theme.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setStep("design")}
                  className="w-full sm:w-36 h-12 rounded-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Edit Bouquet
                </Button>
                <Button
                  onClick={handleGenerateLink}
                  disabled={!recipientName.trim()}
                  className="w-full sm:w-56 shadow-lg shadow-primary/25 h-12 rounded-full font-medium"
                >
                  <Wand2 className="mr-2 h-4 w-4" /> Generate Magic Link
                </Button>
              </div>
            </motion.div>
          )}

          {step === "share" && (
            <motion.div
              key="share-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-center max-w-md mx-auto"
            >
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                <Heart className="h-10 w-10 fill-current animate-pulse text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-2xl">Bouquet Sealed with Love!</h3>
                <p className="text-muted-foreground text-sm">
                  Copy the link below and send it to your partner. When they open it, they'll see the envelope and open your gorgeous bouquet!
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border bg-muted/40 p-4">
                <div className="w-full truncate rounded-xl border bg-card p-3 text-left text-sm text-muted-foreground select-all">
                  {generatedLink}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCopyLink} className="flex-1 rounded-xl h-11">
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" /> Copy Link
                      </>
                    )}
                  </Button>
                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-xl h-11 flex items-center justify-center px-4")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="flex justify-center pt-6 border-t gap-4">
                <Button variant="ghost" onClick={handleReset} className="text-muted-foreground flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" /> Create Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
