"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Theme, DateTimelineItem, MemoryPhoto, Flower } from "@/store/useCreatorStore";
import { ArrowRight, Play, Pause, SkipForward, SkipBack, Volume2, Music, Heart, Sparkles, Gift, Mail, HeartOff, Flower as FlowerIcon } from "lucide-react";
import { BouquetViewer } from "@/components/receiver/BouquetViewer";

interface ReceiverJourneyProps {
  inviteData: {
    name: string;
    theme: Theme;
    journeyOrder: string[];
    timeline: DateTimelineItem[];
    letterContent: string;
    photos: MemoryPhoto[];
    flowers: Flower[];
    bouquetWrapper?: string;
    customWrapperConfigs?: Record<string, { flowerMaskUrl?: string, visibleMaskUrl?: string, scale?: number }>;
    wrappers?: { id: string; label: string; url: string; ext: string }[];
    flowersList?: { id: string; label: string; url: string }[];
    giftLink: string;
    giftMessage: string;
    giftType?: 'coupons' | 'scratch' | 'playlist';
    giftCoupons?: { id: string; title: string; description: string; emoji: string }[];
    giftScratchMessage?: string;
    giftPlaylistUrl?: string;
    giftSongs?: { id: string; name: string; url: string }[];
    targetDate: string;
  };
}

export function ReceiverJourney({ inviteData }: ReceiverJourneyProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Normalize pages to support old drafts and provide fallback
  const rawPages = inviteData?.journeyOrder || [];
  let pages = rawPages.map(p => p === "Final Question" ? "The Invitation" : p);
  
  // Always ensure "The Invitation" (dating confirmation) is the very first page
  pages = ["The Invitation", ...pages.filter(p => p !== "The Invitation")];
  
  const currentPage = pages[currentPageIndex];

  const handleNext = () => {
    setCurrentPageIndex((prev) => prev + 1);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      {/* Background decorations based on theme could go here */}

      <AnimatePresence mode="wait">
        {currentPageIndex >= pages.length ? (
          <SuccessPage key="success" name={inviteData.name} />
        ) : (
          <>
            {currentPage === "The Invitation" && (
              <TheInvitationPage key="invitation" onAccept={handleNext} />
            )}

            {currentPage === "Letter" && (
              <LetterPage key="letter" content={inviteData.letterContent} onNext={handleNext} />
            )}
            
            {currentPage === "Date Timeline" && (
              <TimelinePage key="timeline" timeline={inviteData.timeline} onNext={handleNext} />
            )}

            {currentPage === "Memory Album" && (
              <MemoryAlbumPage key="memory" photos={inviteData.photos} onNext={handleNext} />
            )}

            {currentPage === "Flower Garden" && (
              <FlowerGardenPage 
                key="flower" 
                flowers={inviteData.flowers} 
                wrapper={inviteData.bouquetWrapper} 
                customWrapperConfigs={inviteData.customWrapperConfigs}
                wrappers={inviteData.wrappers}
                flowersList={inviteData.flowersList}
                onNext={handleNext} 
              />
            )}

            {currentPage === "Gift Box" && (
              <GiftBoxPage 
                key="gift" 
                giftLink={inviteData.giftLink} 
                giftMessage={inviteData.giftMessage} 
                giftType={inviteData.giftType || "coupons"}
                giftCoupons={inviteData.giftCoupons || []}
                giftScratchMessage={inviteData.giftScratchMessage || ""}
                giftPlaylistUrl={inviteData.giftPlaylistUrl || ""}
                giftSongs={inviteData.giftSongs || []}
                onNext={handleNext} 
              />
            )}

            {currentPage === "Mini Game" && (
              <MiniGamePage key="game" onNext={handleNext} />
            )}

            {currentPage === "Countdown" && (
              <CountdownPage key="countdown" targetDate={inviteData.targetDate} onNext={handleNext} />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MemoryAlbumPage({ photos, onNext }: { photos: MemoryPhoto[]; onNext: () => void }) {
  const [current, setCurrent] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground mb-4">No memories added yet.</p>
        <Button onClick={onNext} className="gap-2 flex items-center mx-auto">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex w-full max-w-lg flex-col items-center gap-6"
    >
      <div className="relative aspect-[3/4] w-full max-w-sm rounded-lg border-[12px] border-b-[48px] border-white bg-white shadow-xl dark:border-[#f8f5f2] dark:bg-[#f8f5f2]">
        <div className="h-full w-full overflow-hidden bg-muted">
          <img src={photos[current].url} alt="Memory" className="h-full w-full object-contain" />
        </div>
        <div className="absolute -bottom-10 left-0 right-0 text-center font-handwriting text-2xl text-black">
          {photos[current].caption}
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0}>
          Prev
        </Button>
        {current === photos.length - 1 ? (
          <Button onClick={onNext} className="gap-2 flex items-center">
            Continue Journey <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={() => setCurrent(p => Math.min(photos.length - 1, p + 1))}>
            Next Photo
          </Button>
        )}
      </div>
    </motion.div>
  );
}

const WRAPPER_EXT: Record<string, string> = {
  classic: "svg",
  modern: "svg",
  kraft: "svg",
  main: "png",
  paper: "png",
  "2": "png",
};

const FLOWER_TYPES: { id: string; src: string; label: string }[] = [
  { id: "tulip", src: "/flowers/tulip.svg", label: "Tulip" },
  { id: "rose", src: "/flowers/rose.svg", label: "Rose" },
  { id: "sunflower", src: "/flowers/sunflower.svg", label: "Sunflower" },
  { id: "cherry", src: "/flowers/cherry_blossom.svg", label: "Cherry" },
  { id: "hibiscus", src: "/flowers/hibiscus.svg", label: "Hibiscus" },
  { id: "blossom", src: "/flowers/blossom.svg", label: "Blossom" },
  { id: "lotus", src: "/flowers/lotus.png", label: "Lotus" },
];

const WRAPPER_CONFIGS: Record<string, { bottomOffset: number, wrapperScale: number, translateY: number, frontClipPath: string }> = {
  classic: {
    bottomOffset: 160,
    wrapperScale: 1.15,
    translateY: 0,
    frontClipPath: "polygon(0% 100%, 100% 100%, 100% 25%, 95% 28%, 90% 32%, 85% 36%, 80% 40%, 75% 44%, 70% 47%, 65% 50%, 60% 52%, 55% 53%, 50% 54%, 45% 53%, 40% 52%, 35% 50%, 30% 47%, 25% 44%, 20% 40%, 15% 36%, 10% 32%, 5% 28%, 0% 25%)"
  },
  modern: {
    bottomOffset: 160,
    wrapperScale: 1.2,
    translateY: 10,
    frontClipPath: "polygon(0% 100%, 100% 100%, 100% 35%, 95% 38%, 90% 42%, 85% 46%, 80% 50%, 75% 53%, 70% 56%, 65% 58%, 60% 60%, 55% 61%, 50% 62%, 45% 61%, 40% 60%, 35% 58%, 30% 56%, 25% 53%, 20% 50%, 15% 46%, 10% 42%, 5% 38%, 0% 35%)"
  },
  kraft: {
    bottomOffset: 160,
    wrapperScale: 1.1,
    translateY: 0,
    frontClipPath: "polygon(0% 100%, 100% 100%, 100% 20%, 95% 23%, 90% 27%, 85% 32%, 80% 37%, 75% 41%, 70% 45%, 65% 48%, 60% 50%, 55% 51%, 50% 52%, 45% 51%, 40% 50%, 35% 48%, 30% 45%, 25% 41%, 20% 37%, 15% 32%, 10% 27%, 5% 23%, 0% 20%)"
  },
  main: {
    bottomOffset: 160,
    wrapperScale: 1.15,
    translateY: 0,
    frontClipPath: "polygon(0% 100%, 100% 100%, 100% 25%, 95% 28%, 90% 32%, 85% 36%, 80% 40%, 75% 44%, 70% 47%, 65% 50%, 60% 52%, 55% 53%, 50% 54%, 45% 53%, 40% 52%, 35% 50%, 30% 47%, 25% 44%, 20% 40%, 15% 36%, 10% 32%, 5% 28%, 0% 25%)"
  },
  paper: {
    bottomOffset: 160,
    wrapperScale: 1.15,
    translateY: 0,
    frontClipPath: "polygon(0% 100%, 100% 100%, 100% 25%, 95% 28%, 90% 32%, 85% 36%, 80% 40%, 75% 44%, 70% 47%, 65% 50%, 60% 52%, 55% 53%, 50% 54%, 45% 53%, 40% 52%, 35% 50%, 30% 47%, 25% 44%, 20% 40%, 15% 36%, 10% 32%, 5% 28%, 0% 25%)"
  },
  "2": {
    bottomOffset: 160,
    wrapperScale: 1.15,
    translateY: 0,
    frontClipPath: "polygon(0% 100%, 100% 100%, 100% 25%, 95% 28%, 90% 32%, 85% 36%, 80% 40%, 75% 44%, 70% 47%, 65% 50%, 60% 52%, 55% 53%, 50% 54%, 45% 53%, 40% 52%, 35% 50%, 30% 47%, 25% 44%, 20% 40%, 15% 36%, 10% 32%, 5% 28%, 0% 25%)"
  }
};

const DEFAULT_POLYGONS: Record<string, string> = {
  classic: "polygon(15% 25%, 85% 25%, 50% 85%)",
  modern: "polygon(15% 35%, 85% 35%, 50% 85%)",
  kraft: "polygon(15% 20%, 85% 20%, 50% 85%)",
  main: "polygon(15% 25%, 85% 25%, 50% 85%)",
  paper: "polygon(15% 25%, 85% 25%, 50% 85%)",
  "2": "polygon(15% 25%, 85% 25%, 50% 85%)",
};

const isPointInPolygon = (point: { x: number, y: number }, polygon: { x: number, y: number }[]) => {
  const x = point.x, y = point.y;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const parsePolygon = (maskUrl: string | undefined): { x: number, y: number }[] => {
  if (!maskUrl || !maskUrl.startsWith('polygon(')) return [];
  const pointStrings = maskUrl.replace('polygon(', '').replace(')', '').split(', ');
  return pointStrings.map(p => {
    const [x, y] = p.split(' ').map(val => parseFloat(val));
    return { x, y };
  }).filter(p => !isNaN(p.x) && !isNaN(p.y));
};

const getValidPositions = (polygon: { x: number, y: number }[]) => {
  if (polygon.length < 3) return [];
  
  const positions: { x: number, y: number }[] = [];
  const STEP_X = 6.5;
  const STEP_Y = 5.5;
  
  // Scan from bottom to top (90% to 10% height)
  for (let y = 88; y >= 12; y -= STEP_Y) {
    const isOdd = Math.round(y / STEP_Y) % 2 === 1;
    const xOffset = isOdd ? (STEP_X / 2) : 0;
    
    for (let x = 5; x <= 95; x += STEP_X) {
      const px = x + xOffset;
      if (px > 95) continue;
      
      const point = { x: px, y };
      if (isPointInPolygon(point, polygon)) {
        positions.push(point);
      }
    }
  }
  return positions;
};

const getFlowerStyle = (index: number, wrapperId: string, maskUrl: string | undefined) => {
  const activePolygonString = maskUrl || DEFAULT_POLYGONS[wrapperId] || DEFAULT_POLYGONS.classic;
  const polygon = parsePolygon(activePolygonString);
  const positions = getValidPositions(polygon);
  
  if (positions.length > 0) {
    const pos = positions[index % positions.length];
    
    const jitterX = Math.sin(index * 31) * 1.5; 
    const jitterY = Math.cos(index * 37) * 1.5;
    
    const rotation = Math.sin(index * 41) * 35; 
    const scale = 0.95 + (Math.sin(index * 13) * 0.1); 
    const zIndex = index;
    
    return {
      left: `${pos.x + jitterX}%`,
      top: `${pos.y + jitterY}%`,
      rotation,
      scale,
      zIndex
    };
  }
  
  return {
    left: "50%",
    top: "50%",
    rotation: 0,
    scale: 1,
    zIndex: index
  };
};

function FlowerGardenPage({ 
  flowers, 
  wrapper, 
  customWrapperConfigs,
  wrappers,
  flowersList,
  onNext 
}: { 
  flowers: Flower[]; 
  wrapper?: string; 
  customWrapperConfigs?: Record<string, { flowerMaskUrl?: string, visibleMaskUrl?: string, scale?: number }>;
  wrappers?: { id: string; label: string; url: string; ext: string }[];
  flowersList?: { id: string; label: string; url: string }[];
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex w-full max-w-2xl flex-col items-center gap-12"
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
        <h2 className="font-heading text-4xl">For You</h2>
        
        {/* Bouquet Container */}
        <div className="relative w-full max-w-sm aspect-[4/5] flex items-center justify-center -mt-10">
          <BouquetViewer
            flowers={flowers}
            bouquetWrapper={wrapper}
            customWrapperConfigs={customWrapperConfigs}
            wrappers={wrappers}
            flowersList={flowersList}
          />
        </div>
        <Button onClick={onNext} className="mt-4 shadow-lg shadow-primary/20 gap-2 flex items-center mx-auto font-sans">
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function GiftBoxPage({ 
  giftLink, 
  giftMessage, 
  giftType, 
  giftCoupons, 
  giftScratchMessage, 
  giftPlaylistUrl, 
  giftSongs,
  onNext 
}: { 
  giftLink: string; 
  giftMessage: string; 
  giftType: 'coupons' | 'scratch' | 'playlist';
  giftCoupons: { id: string; title: string; description: string; emoji: string }[];
  giftScratchMessage: string;
  giftPlaylistUrl: string;
  giftSongs: { id: string; name: string; url: string }[];
  onNext: () => void 
}) {
  const [opened, setOpened] = useState(false);
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});
  
  // Scratch Card states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scratched, setScratched] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  // Playlist Tape states
  const [isPlayingTape, setIsPlayingTape] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Scratch Card Canvas
  useEffect(() => {
    if (opened && giftType === 'scratch' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Match sizing
        canvas.width = canvas.parentElement?.offsetWidth || 350;
        canvas.height = canvas.parentElement?.offsetHeight || 200;

        // Draw background gradient
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#ec4899'); // pink-500
        grad.addColorStop(0.5, '#a855f7'); // purple-500
        grad.addColorStop(1, '#6366f1'); // indigo-500
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw overlay pattern/dots
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let i = 0; i < canvas.width; i += 12) {
          for (let j = 0; j < canvas.height; j += 12) {
            ctx.beginPath();
            ctx.arc(i, j, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Draw sparkle stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '24px sans-serif';
        ctx.fillText('✨', canvas.width * 0.15, canvas.height * 0.3);
        ctx.fillText('✨', canvas.width * 0.8, canvas.height * 0.7);

        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Scratch to Reveal Surprise! 🔍', canvas.width / 2, canvas.height / 2);
      }
    }
  }, [opened, giftType]);

  // Audio lifecycle cleanup
  useEffect(() => {
    return () => {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        audioInstanceRef.current = null;
      }
    };
  }, []);

  const handleScratchMove = (clientX: number, clientY: number) => {
    if (!canvasRef.current || scratched) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 36;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Check scratched percentage occasionally to prevent performance lag
    if (Math.random() < 0.15) {
      checkScratchPercentage(canvas, ctx);
    }
  };

  const checkScratchPercentage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let cleared = 0;
      // Sample every 12th pixel for lightweight calculation
      const step = 12 * 4;
      let totalSamples = 0;
      for (let i = 3; i < data.length; i += step) {
        totalSamples++;
        if (data[i] === 0) cleared++;
      }
      const ratio = cleared / totalSamples;
      setScratchProgress(Math.round(ratio * 100));
      if (ratio > 0.45) {
        setScratched(true);
      }
    } catch (e) {
      // In case of CORS issues or other errors, allow fallback
    }
  };

  // HTML5 Mixtape Controls
  const handlePlayPause = () => {
    if (!giftSongs || giftSongs.length === 0) {
      alert("No mixtape tracks uploaded!");
      return;
    }

    const currentSong = giftSongs[currentSongIndex];
    if (!currentSong) return;

    if (isPlayingTape) {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
      }
      setIsPlayingTape(false);
    } else {
      if (!audioInstanceRef.current) {
        createAndPlayAudio(currentSong.url);
      } else {
        audioInstanceRef.current.play().catch(() => {
          alert("Failed to play song. Audio URL may have expired.");
          setIsPlayingTape(false);
        });
        setIsPlayingTape(true);
      }
    }
  };

  const createAndPlayAudio = (url: string) => {
    const audio = new Audio(url);
    audioInstanceRef.current = audio;
    audio.onended = () => {
      handleNextSong();
    };
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    audio.play().catch(() => {
      alert("Failed to play song. Audio URL may have expired.");
      setIsPlayingTape(false);
    });
    setIsPlayingTape(true);
  };

  const handleNextSong = () => {
    if (!giftSongs || giftSongs.length <= 1) {
      // Loop single song or stop
      if (audioInstanceRef.current) {
        audioInstanceRef.current.currentTime = 0;
        audioInstanceRef.current.play().catch(() => {});
      }
      return;
    }
    const nextIndex = (currentSongIndex + 1) % giftSongs.length;
    switchSong(nextIndex);
  };

  const handlePrevSong = () => {
    if (!giftSongs || giftSongs.length <= 1) return;
    const prevIndex = (currentSongIndex - 1 + giftSongs.length) % giftSongs.length;
    switchSong(prevIndex);
  };

  const switchSong = (index: number) => {
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current = null;
    }
    setCurrentTime(0);
    setDuration(0);
    setCurrentSongIndex(index);
    const nextSong = giftSongs[index];
    if (nextSong && isPlayingTape) {
      createAndPlayAudio(nextSong.url);
    } else {
      setIsPlayingTape(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioInstanceRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = Math.max(0, Math.min((clickX / width) * duration, duration));
    audioInstanceRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex w-full max-w-lg flex-col items-center justify-center gap-8 text-center"
    >
      {!opened ? (
        <>
          <h2 className="font-heading text-4xl">A little surprise...</h2>
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 10, 0] }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpened(true)}
            className="cursor-pointer text-9xl drop-shadow-2xl transition-transform"
          >
            🎁
          </motion.div>
          <p className="text-muted-foreground">Tap to open</p>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full space-y-6 rounded-2xl border bg-card p-6 shadow-xl text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎁</span>
            <h3 className="font-heading text-2xl text-primary">Unwrapped!</h3>
          </div>

          {/* 1. Coupons Gift Type */}
          {giftType === 'coupons' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Redeem these special coupons whenever you'd like! Tap to claim.
              </p>
              
              <div className="space-y-3">
                {giftCoupons && giftCoupons.length > 0 ? (
                  giftCoupons.map((coupon) => (
                    <motion.div
                      key={coupon.id}
                      whileHover={{ scale: 1.01 }}
                      className="relative overflow-hidden border-2 border-dashed border-primary/40 rounded-2xl p-4 bg-muted/10 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{coupon.emoji}</span>
                        <div>
                          <h4 className="font-bold text-base text-foreground">{coupon.title}</h4>
                          <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                            {coupon.description}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant={claimed[coupon.id] ? "secondary" : "default"}
                        disabled={claimed[coupon.id]}
                        onClick={() => setClaimed(prev => ({ ...prev, [coupon.id]: true }))}
                        className="shrink-0 text-xs font-bold"
                      >
                        {claimed[coupon.id] ? "Redeemed" : "Claim"}
                      </Button>

                      {/* Claim Stamp Overlay */}
                      {claimed[coupon.id] && (
                        <motion.div
                          initial={{ scale: 2.5, opacity: 0, rotate: -45 }}
                          animate={{ scale: 1, opacity: 1, rotate: -12 }}
                          transition={{ type: "spring", stiffness: 150 }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none bg-red-500/5 border-2 border-red-500/80 rounded-2xl"
                        >
                          <span className="text-red-500 font-extrabold text-2xl uppercase tracking-widest border-2 border-red-500/80 px-3 py-1 bg-white/95 shadow-md flex items-center gap-1.5">
                            CLAIMED <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                          </span>
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center text-sm">No vouchers custom set.</p>
                )}
              </div>
            </div>
          )}

          {/* 2. Scratch Card Gift Type */}
          {giftType === 'scratch' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Rub the silver foil card with your cursor or finger to reveal a secret promise!
              </p>

              <div className="relative w-full h-[200px] rounded-xl overflow-hidden border shadow-inner flex items-center justify-center bg-muted/40">
                {/* Underneath Message Content */}
                <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center space-y-3 z-0 pointer-events-none select-none">
                  <Mail className="w-10 h-10 text-primary opacity-60 mb-2" />
                  <p className="font-handwriting text-2xl text-foreground/90 max-w-[280px] leading-snug">
                    {giftScratchMessage || giftMessage || "I promise to treat you to something special!"}
                  </p>
                </div>

                {/* Cover Canvas */}
                <canvas
                  ref={canvasRef}
                  onMouseDown={() => setIsScratching(true)}
                  onMouseUp={() => setIsScratching(false)}
                  onMouseLeave={() => setIsScratching(false)}
                  onMouseMove={(e) => {
                    if (isScratching) {
                      handleScratchMove(e.clientX, e.clientY);
                    }
                  }}
                  onTouchStart={() => setIsScratching(true)}
                  onTouchEnd={() => setIsScratching(false)}
                  onTouchMove={(e) => {
                    if (isScratching && e.touches.length > 0) {
                      handleScratchMove(e.touches[0].clientX, e.touches[0].clientY);
                    }
                  }}
                  style={{
                    opacity: scratched ? 0 : 1,
                    pointerEvents: scratched ? 'none' : 'auto',
                    transition: 'opacity 0.6s ease-out'
                  }}
                  className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
                />

                {/* Progress helper */}
                {!scratched && scratchProgress > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20 pointer-events-none">
                    Revealed {scratchProgress}%
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Playlist Gift Type (Now Custom Mixtape Songs) */}
          {giftType === 'playlist' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A custom mixtape created just for you! Tap play to listen to the uploaded tracks.
              </p>

              {/* CSS Retro Cassette Tape */}
              <div className="relative w-full max-w-[340px] mx-auto aspect-[1.6] bg-neutral-800 rounded-xl p-4 shadow-xl border-4 border-neutral-700 flex flex-col justify-between overflow-hidden">
                {/* Screws and Tape details */}
                <div className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-neutral-600" />
                <div className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-neutral-600" />
                <div className="absolute bottom-1 left-1.5 w-1 h-1 rounded-full bg-neutral-600" />
                <div className="absolute bottom-1 right-1.5 w-1 h-1 rounded-full bg-neutral-600" />

                {/* Label container */}
                <div className="w-full bg-rose-50 rounded-lg p-2.5 border-t-8 border-rose-300 flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">A-SIDE</span>
                    <span className="text-[9px] font-mono text-neutral-400">
                      {giftSongs && giftSongs.length > 0 ? `${currentSongIndex + 1}/${giftSongs.length}` : "NR-120"}
                    </span>
                  </div>
                  <div className="text-center font-handwriting text-xl text-neutral-700 border-b border-rose-200 py-0.5 leading-tight truncate">
                    {giftSongs && giftSongs.length > 0 ? giftSongs[currentSongIndex]?.name : (giftMessage || "Mixtape for You")}
                  </div>
                  
                  {/* Tape Spool window */}
                  <div className="w-2/3 mx-auto h-7 bg-neutral-950/90 rounded border-2 border-neutral-700 flex items-center justify-between px-3 mt-1.5">
                    {/* Left Spool */}
                    <motion.div 
                      animate={isPlayingTape ? { rotate: 360 } : {}}
                      transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                      className="w-4 h-4 rounded-full border-2 border-dashed border-rose-400 flex items-center justify-center animate-none"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    </motion.div>
                    
                    {/* Tape Window glass */}
                    <div className="flex-1 h-full bg-neutral-950/30 flex items-center justify-center">
                      <div className="w-8 h-1.5 bg-rose-900/50 rounded-full" />
                    </div>

                    {/* Right Spool */}
                    <motion.div 
                      animate={isPlayingTape ? { rotate: 360 } : {}}
                      transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                      className="w-4 h-4 rounded-full border-2 border-dashed border-rose-400 flex items-center justify-center animate-none"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    </motion.div>
                  </div>
                </div>

                {/* Tape Bottom Trapeze */}
                <div className="w-1/2 mx-auto h-2 bg-neutral-900 rounded-t" />
              </div>

              {/* Play / Tape Controls */}
              {giftSongs && giftSongs.length > 0 ? (
                <div className="flex flex-col items-center gap-4">
                  {/* Timeline Progress Bar */}
                  <div className="w-full max-w-[340px] mx-auto space-y-1 mt-1 bg-muted/20 p-2.5 rounded-xl border">
                    <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <div 
                      onClick={handleProgressClick}
                      className="w-full h-1.5 bg-muted rounded-full overflow-hidden cursor-pointer relative group mt-1"
                    >
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-100" 
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      />
                      {/* Hover seeker dot */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 6px)` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 w-full max-w-[280px] mx-auto">
                    {giftSongs.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handlePrevSong}
                        className="h-10 w-10 text-primary border-primary/20 hover:bg-primary/10 rounded-full animate-none"
                        title="Previous Track"
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePlayPause}
                      className="gap-2 text-xs font-bold px-6 py-2 border-primary text-primary hover:bg-primary/10 rounded-full flex-1 flex items-center justify-center"
                    >
                      {isPlayingTape ? (
                        <>
                          <Pause className="w-4 h-4" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> Play
                        </>
                      )}
                    </Button>

                    {giftSongs.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleNextSong}
                        className="h-10 w-10 text-primary border-primary/20 hover:bg-primary/10 rounded-full animate-none"
                        title="Next Track"
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Playlist queue list */}
                  <div className="w-full border rounded-xl p-3 bg-muted/10 space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Mixtape Tracks</span>
                    <div className="space-y-1">
                      {giftSongs.map((song, i) => (
                        <button
                          key={song.id}
                          type="button"
                          onClick={() => switchSong(i)}
                          className={`w-full text-left text-xs p-2 rounded-lg transition-all flex items-center justify-between font-medium ${
                            i === currentSongIndex 
                              ? 'bg-primary/10 text-primary font-bold border-l-2 border-primary' 
                              : 'hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          <span className="truncate">{i + 1}. {song.name}</span>
                          {i === currentSongIndex && isPlayingTape && (
                            <span className="text-[10px] flex items-center gap-1">
                              Playing <Volume2 className="w-3.5 h-3.5 text-primary animate-bounce" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6 bg-muted/10 border border-dashed rounded-xl">
                  No tracks were uploaded to this mixtape.
                </p>
              )}
            </div>
          )}

          <div className="pt-4 border-t flex justify-end">
            <Button onClick={onNext} className="shadow-lg shadow-primary/20 w-full sm:w-auto gap-2 flex items-center">
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function MiniGamePage({ onNext }: { onNext: () => void }) {
  const [cards, setCards] = useState([
    { id: 0, val: "❤️", flipped: false, matched: false },
    { id: 1, val: "✨", flipped: false, matched: false },
    { id: 2, val: "❤️", flipped: false, matched: false },
    { id: 3, val: "✨", flipped: false, matched: false },
  ].sort(() => Math.random() - 0.5));

  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const won = cards.every(c => c.matched);

  const handleCardClick = (index: number) => {
    if (flippedIds.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newFlipped = [...flippedIds, index];
    setFlippedIds(newFlipped);

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    if (newFlipped.length === 2) {
      const match = newCards[newFlipped[0]].val === newCards[newFlipped[1]].val;
      setTimeout(() => {
        const nextCards = [...newCards];
        if (match) {
          nextCards[newFlipped[0]].matched = true;
          nextCards[newFlipped[1]].matched = true;
        } else {
          nextCards[newFlipped[0]].flipped = false;
          nextCards[newFlipped[1]].flipped = false;
        }
        setCards(nextCards);
        setFlippedIds([]);
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex w-full max-w-md flex-col items-center gap-8 text-center"
    >
      <h2 className="font-heading text-4xl">Memory Match</h2>
      <p className="text-muted-foreground">Match the pairs to prove your dedication!</p>
      
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(i)}
            whileHover={!card.flipped ? { scale: 1.05 } : {}}
            whileTap={!card.flipped ? { scale: 0.95 } : {}}
            className={`flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border-2 text-4xl shadow-sm transition-colors ${
              card.flipped || card.matched ? "border-primary bg-primary/10" : "border-muted bg-card hover:border-primary/50"
            }`}
          >
            {(card.flipped || card.matched) && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                {card.val === "❤️" ? (
                  <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                ) : (
                  <Sparkles className="w-8 h-8 text-amber-500 fill-amber-500" />
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {won && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Button onClick={onNext} className="shadow-lg shadow-primary/20 gap-2 flex items-center">
              You did it! Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CountdownPage({ targetDate, onNext }: { targetDate: string; onNext: () => void }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    if (!targetDate) return;
    
    const target = new Date(targetDate).getTime();
    
    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex w-full max-w-md flex-col items-center gap-12 text-center"
    >
      <h2 className="font-heading text-4xl">The Countdown</h2>
      
      {targetDate ? (
        <div className="grid grid-cols-4 gap-4 w-full">
          {[
            { label: "Days", val: timeLeft.d },
            { label: "Hours", val: timeLeft.h },
            { label: "Mins", val: timeLeft.m },
            { label: "Secs", val: timeLeft.s }
          ].map((unit, i) => (
            <div key={i} className="flex flex-col items-center justify-center rounded-2xl border bg-card py-6 shadow-sm">
              <span className="font-heading text-3xl text-primary">{unit.val}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">{unit.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No date set!</p>
      )}

      <Button onClick={onNext} className="gap-2 flex items-center mx-auto">
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

function LetterPage({ content, onNext }: { content: string; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="flex w-full max-w-2xl flex-col items-center gap-8"
    >
      <div 
        className="relative w-full max-h-[450px] overflow-y-auto rounded-xl bg-[#fdfbf7] p-8 shadow-xl dark:bg-[#1a1918] scrollbar-thin"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(239, 68, 68, 0.3) 1.5px, transparent 1.5px), linear-gradient(transparent 31px, rgba(147, 197, 253, 0.35) 32px)',
          backgroundSize: '100% 100%, 100% 32px',
          backgroundPosition: '32px 0, 0 0',
          backgroundRepeat: 'no-repeat, repeat',
          backgroundAttachment: 'local',
        }}
      >
        <p 
          className="relative z-10 whitespace-pre-wrap pl-6 pt-[8px] font-handwriting font-bold text-2xl leading-[32px] text-neutral-900 dark:text-neutral-100"
          style={{ lineHeight: '32px' }}
        >
          {content || "I have something to ask you..."}
        </p>
      </div>
      <Button onClick={onNext} className="shadow-lg shadow-primary/20 gap-2 flex items-center">
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

function TimelinePage({ timeline, onNext }: { timeline: DateTimelineItem[]; onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="flex w-full max-w-2xl flex-col items-center gap-8"
    >
      <h2 className="font-heading text-4xl">The Plan</h2>
      <div className="w-full space-y-4">
        {timeline.map((event, i) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
              {event.emoji}
            </div>
            <div>
              <h3 className="font-heading text-xl">{event.title}</h3>
              <p className="text-sm text-muted-foreground">{event.time} • {event.location}</p>
            </div>
          </motion.div>
        ))}
        {timeline.length === 0 && (
          <p className="text-center text-muted-foreground">It's a surprise!</p>
        )}
      </div>
      <Button onClick={onNext} className="shadow-lg shadow-primary/20 gap-2 flex items-center">
        Next <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

function TheInvitationPage({ onAccept }: { onAccept: () => void }) {
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const handleHoverNo = () => {
    if (noButtonRef.current) {
      // Calculate a random offset relative to the button's starting position
      // to keep it within the viewport boundary
      const maxX = window.innerWidth / 2 - 100;
      const maxY = window.innerHeight / 2 - 100;
      const x = (Math.random() * 2 - 1) * maxX;
      const y = (Math.random() * 2 - 1) * maxY;
      
      noButtonRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex w-full flex-col items-center justify-center gap-12 text-center"
    >
      <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl">
        Will you go on <br /> this date with me?
      </h1>

      <div className="flex items-center justify-center gap-8 h-16">
        <Button
          size="lg"
          onClick={onAccept}
          className="h-16 rounded-full px-12 text-2xl font-bold shadow-xl shadow-primary/30 transition-transform hover:scale-110"
        >
          YES ❤️
        </Button>
        <Button
          ref={noButtonRef}
          variant="outline"
          size="lg"
          onMouseEnter={handleHoverNo}
          onTouchStart={handleHoverNo}
          onClick={handleHoverNo}
          className="h-16 rounded-full px-12 text-2xl font-bold bg-background text-foreground border-foreground/30 hover:bg-foreground/10 transition-transform duration-300 ease-out z-50"
        >
          NO
        </Button>
      </div>
    </motion.div>
  );
}

function SuccessPage({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex w-full flex-col items-center justify-center gap-8 text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="text-primary flex items-center justify-center"
      >
        <FlowerIcon className="w-24 h-24 text-primary" />
      </motion.div>
      <h1 className="font-heading text-5xl md:text-6xl text-primary">
        Yay! Can't wait!
      </h1>
      <p className="text-xl text-muted-foreground">
        A notification would be sent to the creator here.
      </p>
    </motion.div>
  );
}
