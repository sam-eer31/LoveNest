"use client";

import React, { useState, useRef } from "react";
import { useCreatorStore } from "@/store/useCreatorStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Music, Ticket, Sparkles, Trash2, PlusCircle, Play, Pause, Loader2, Upload } from "lucide-react";

export function StepGiftBox() {
  const { 
    giftType, 
    giftCoupons, 
    giftScratchMessage, 
    giftSongs,
    setGiftType,
    setGiftCoupons,
    setGiftScratchMessage,
    setGiftSongs
  } = useCreatorStore();

  const [uploading, setUploading] = useState(false);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddCoupon = () => {
    if (giftCoupons.length >= 6) return;
    const newCoupon = {
      id: Math.random().toString(36).slice(2, 9),
      title: "New Coupon",
      description: "Describe what this coupon is for.",
      emoji: "🎫"
    };
    setGiftCoupons([...giftCoupons, newCoupon]);
  };

  const handleUpdateCoupon = (id: string, updates: Partial<{ title: string; description: string; emoji: string }>) => {
    const updated = giftCoupons.map(c => c.id === id ? { ...c, ...updates } : c);
    setGiftCoupons(updated);
  };

  const handleRemoveCoupon = (id: string) => {
    setGiftCoupons(giftCoupons.filter(c => c.id !== id));
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (giftSongs.length >= 5) {
      alert("You can upload a maximum of 5 songs.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      const newSong = {
        id: Math.random().toString(36).slice(2, 9),
        name: file.name.replace(/\.[^/.]+$/, ""), // remove extension
        url: data.url
      };
      setGiftSongs([...giftSongs, newSong]);
    } catch (err) {
      console.error(err);
      alert("Audio upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveSong = (id: string) => {
    if (playingSongId === id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingSongId(null);
    }
    setGiftSongs(giftSongs.filter(s => s.id !== id));
  };

  const togglePreviewSong = (song: { id: string; url: string }) => {
    if (playingSongId === song.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingSongId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(song.url);
      audioRef.current = audio;
      audio.play().catch(() => {
        alert("Failed to play preview. Audio URL may be temporary or expired.");
      });
      setPlayingSongId(song.id);
      audio.onended = () => {
        setPlayingSongId(null);
      };
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-8">
      <div className="space-y-2 text-center">
        <h3 className="font-heading text-3xl">Digital Gift Box</h3>
        <p className="text-muted-foreground">Customize a special premium surprise for your recipient.</p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8 space-y-6">
        {/* Gift Type Selector */}
        <div className="space-y-3">
          <Label className="text-muted-foreground uppercase text-xs tracking-wider block text-center">Select Gift Style</Label>
          <div className="grid grid-cols-3 gap-2 bg-muted p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setGiftType('coupons')}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg text-xs font-bold transition-all gap-1 ${
                giftType === 'coupons' 
                  ? 'bg-background shadow text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Ticket className="w-4 h-4" />
              Vouchers
            </button>
            <button
              type="button"
              onClick={() => setGiftType('scratch')}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg text-xs font-bold transition-all gap-1 ${
                giftType === 'scratch' 
                  ? 'bg-background shadow text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Scratch Card
            </button>
            <button
              type="button"
              onClick={() => setGiftType('playlist')}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg text-xs font-bold transition-all gap-1 ${
                giftType === 'playlist' 
                  ? 'bg-background shadow text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Music className="w-4 h-4" />
              Mixtape
            </button>
          </div>
        </div>

        {/* Dynamic Editor Panel */}
        <div className="pt-2">
          {giftType === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Romantic Love Vouchers</h4>
                  <p className="text-xs text-muted-foreground">Receiver can click to redeem these in real-life.</p>
                </div>
                <Button 
                  type="button"
                  size="sm" 
                  variant="outline" 
                  onClick={handleAddCoupon} 
                  disabled={giftCoupons.length >= 6}
                  className="gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Add ({giftCoupons.length}/6)
                </Button>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {giftCoupons.map((coupon) => (
                  <motion.div 
                    key={coupon.id} 
                    layout
                    className="flex flex-col gap-2 p-3 border rounded-xl bg-muted/20 relative"
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={coupon.emoji} 
                        onChange={(e) => handleUpdateCoupon(coupon.id, { emoji: e.target.value })}
                        className="w-8 h-8 text-center text-lg bg-background border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                        maxLength={2}
                      />
                      <input 
                        type="text" 
                        placeholder="Voucher Title" 
                        value={coupon.title}
                        onChange={(e) => handleUpdateCoupon(coupon.id, { title: e.target.value })}
                        className="flex-1 px-3 py-1 text-sm font-semibold bg-background border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {giftCoupons.length > 1 && (
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveCoupon(coupon.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <textarea 
                      placeholder="Voucher description or rules..."
                      value={coupon.description}
                      onChange={(e) => handleUpdateCoupon(coupon.id, { description: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-background border rounded-lg resize-none h-12 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {giftType === 'scratch' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scratchMessage" className="font-semibold text-sm">Scratch Card Message</Label>
                <p className="text-xs text-muted-foreground">
                  The receiver will have to scratch off a virtual card to reveal this secret promise/reward.
                </p>
                <textarea 
                  id="scratchMessage" 
                  placeholder="e.g. I promise to take you on a surprise weekend trip! ✈️" 
                  value={giftScratchMessage}
                  onChange={(e) => setGiftScratchMessage(e.target.value)}
                  className="w-full min-h-[120px] bg-background border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            </div>
          )}

          {giftType === 'playlist' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm">Your Custom Mixtape</h4>
                <p className="text-xs text-muted-foreground">
                  Upload up to 5 romantic audio tracks (MP3/WAV/etc.). They will be played directly inside the rotating retro cassette tape!
                </p>
              </div>

              {/* Upload area */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/30 hover:border-primary/50 transition-colors bg-muted/10 relative">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    {uploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                        <p className="text-sm font-semibold text-primary">Uploading song to tmpfiles...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-semibold text-muted-foreground">Click to upload audio track</p>
                        <p className="text-xs text-muted-foreground/80 mt-1">MP3, WAV, M4A or WebM (max 5 songs)</p>
                      </>
                    )}
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="audio/*" 
                    onChange={handleAudioUpload}
                    disabled={uploading || giftSongs.length >= 5}
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Uploaded songs list */}
              <div className="space-y-2.5">
                <Label className="text-xs font-semibold text-muted-foreground block">Uploaded Songs ({giftSongs.length}/5)</Label>
                {giftSongs.length > 0 ? (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {giftSongs.map((song) => (
                      <div 
                        key={song.id} 
                        className="flex items-center justify-between p-2.5 border rounded-lg bg-muted/20"
                      >
                        <div className="flex items-center gap-2.5 truncate flex-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePreviewSong(song)}
                            className="h-8 w-8 text-primary hover:text-primary-foreground hover:bg-primary/20 shrink-0"
                          >
                            {playingSongId === song.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <span className="text-xs font-medium truncate">{song.name}</span>
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSong(song.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4 bg-muted/5 border rounded-lg">
                    No songs uploaded yet. Add some romantic tracks!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
