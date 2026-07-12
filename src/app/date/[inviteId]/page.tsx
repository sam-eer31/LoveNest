"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReceiverJourney } from "@/components/receiver/ReceiverJourney";
import { Heart, HeartOff, Mail } from "lucide-react";

export default function DateReceiverPage({
  params,
}: {
  params: Promise<{ inviteId: string }>;
}) {
  const resolvedParams = use(params);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState<any>(null);

  useEffect(() => {
    // We mock the API call by checking localStorage for the created invite
    // and using the Zustand store's current state as the payload
    // since we haven't wired up Redis yet.
    const timer = setTimeout(() => {
      const drafts = JSON.parse(localStorage.getItem('lovenest-invites-created') || '[]');
      const found = drafts.find((d: any) => d.inviteId === resolvedParams.inviteId);
      
      if (found) {
        // Fetch the payload from zustand for the demo
        const stateStr = localStorage.getItem('lovenest-creator-storage');
        if (stateStr) {
          try {
            const parsed = JSON.parse(stateStr).state;
            setInviteData({
              name: parsed.receiverName || "You",
              theme: parsed.theme || "Sakura",
              journeyOrder: parsed.journeyOrder || [],
              timeline: parsed.timeline || [],
              letterContent: parsed.letterContent || "",
              photos: parsed.photos || [],
              flowers: parsed.flowers || [],
              bouquetWrapper: parsed.bouquetWrapper || "classic",
              customWrapperConfigs: parsed.customWrapperConfigs || {},
              wrappers: parsed.wrappers || [],
              flowersList: parsed.flowersList || [],
              giftLink: parsed.giftLink || "",
              giftMessage: parsed.giftMessage || "",
              giftType: parsed.giftType || "coupons",
              giftCoupons: parsed.giftCoupons || [],
              giftScratchMessage: parsed.giftScratchMessage || "",
              giftPlaylistUrl: parsed.giftPlaylistUrl || "",
              giftSongs: parsed.giftSongs || [],
              targetDate: parsed.targetDate || "",
            });
          } catch(e) {}
        }
      }
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [resolvedParams.inviteId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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

  if (!inviteData) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4 text-center">
        <div className="text-muted-foreground mb-2">
          <HeartOff className="w-16 h-16" />
        </div>
        <h1 className="font-heading text-4xl">This invite has expired or doesn't exist.</h1>
        <p className="text-muted-foreground">The magic might have faded.</p>
      </div>
    );
  }

  const themeClass = inviteData.theme ? `theme-${inviteData.theme.toLowerCase().replace(" ", "-")}` : '';

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${themeClass}`}>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-primary/5"
            onClick={() => setIsOpen(true)}
          >
            <div className="group relative">
              {/* Pulsing indicator */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-8 rounded-full bg-primary/20 blur-xl"
              />
              
              <div className="relative flex flex-col items-center gap-6">
                <div className="text-primary transition-transform duration-500 group-hover:scale-110">
                  <Mail className="w-20 h-20 animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                <div className="font-heading text-2xl tracking-wide text-foreground/70">
                  Tap to open
                </div>
                <div className="text-sm font-medium text-primary">
                  For {inviteData.name || "You"}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-0"
          >
            <ReceiverJourney inviteData={inviteData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
