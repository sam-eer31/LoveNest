"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Flower } from "@/store/useCreatorStore";
import { Shuffle, Trash2 } from "lucide-react";

const DEFAULT_WRAPPER_CONFIGS: Record<string, { bottomOffset: number, wrapperScale: number, translateY: number, frontClipPath: string }> = {
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

const DEFAULT_WRAPPERS = [
  { id: "classic", label: "Classic Elegance", url: "/bouquets/wrapper_classic.svg", ext: "svg" },
  { id: "modern", label: "Modern Edge", url: "/bouquets/wrapper_modern.svg", ext: "svg" },
  { id: "kraft", label: "Rustic Kraft", url: "/bouquets/wrapper_kraft.svg", ext: "svg" },
  { id: "main", label: "Sweet Satin", url: "/bouquets/wrapper_main.png", ext: "png" },
  { id: "paper", label: "Vintage Paper", url: "/bouquets/wrapper_paper.png", ext: "png" },
  { id: "2", label: "Blushing Ribbon", url: "/bouquets/wrapper_2.png", ext: "png" }
];

const DEFAULT_FLOWERS = [
  { id: "tulip", label: "Tulip", url: "/flowers/tulip.svg" },
  { id: "rose", label: "Rose", url: "/flowers/rose.svg" },
  { id: "sunflower", label: "Sunflower", url: "/flowers/sunflower.svg" },
  { id: "cherry", label: "Cherry", url: "/flowers/cherry_blossom.svg" },
  { id: "hibiscus", label: "Hibiscus", url: "/flowers/hibiscus.svg" },
  { id: "blossom", label: "Blossom", url: "/flowers/blossom.svg" },
  { id: "lotus", label: "Lotus", url: "/flowers/lotus.png" }
];

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

const getHashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const getFlowerStyle = (index: number, wrapperId: string, maskUrl: string | undefined, flowerId?: string) => {
  const activePolygonString = maskUrl || DEFAULT_POLYGONS[wrapperId] || DEFAULT_POLYGONS.classic;
  const polygon = parsePolygon(activePolygonString);
  const positions = getValidPositions(polygon);
  
  if (positions.length > 0) {
    const pos = positions[index % positions.length];
    
    // Add subtle, realistic organic offset/jitter
    const jitterX = Math.sin(index * 31) * 1.5; 
    const jitterY = Math.cos(index * 37) * 1.5;
    
    const rotation = Math.sin(index * 41) * 35; 
    const scale = 0.95 + (Math.sin(index * 13) * 0.1); 
    const zIndex = flowerId ? (getHashCode(flowerId) % 100) : index;
    
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

export interface BouquetDesignerProps {
  flowers: Flower[];
  setFlowers: (flowers: Flower[]) => void;
  bouquetWrapper: string;
  setBouquetWrapper: (wrapper: string) => void;
  customWrapperConfigs?: Record<string, { flowerMaskUrl?: string, frontMaskUrl?: string, visibleMaskUrl?: string, shadingMaskUrl?: string, scale?: number }>;
  wrappers?: { id: string; label: string; url: string; ext: string }[];
  flowersList?: { id: string; label: string; url: string }[];
}

export function BouquetDesigner({
  flowers,
  setFlowers,
  bouquetWrapper,
  setBouquetWrapper,
  customWrapperConfigs = {},
  wrappers,
  flowersList,
}: BouquetDesignerProps) {
  const [activeTab, setActiveTab] = useState<'flowers' | 'wrappers'>('flowers');

  const finalWrappers = wrappers && wrappers.length > 0 ? wrappers : DEFAULT_WRAPPERS;
  const finalFlowersList = flowersList && flowersList.length > 0 ? flowersList : DEFAULT_FLOWERS;

  const addFlower = (type: string) => {
    const newFlower = {
      id: `flower-piece-${flowers.length}`,
      type,
      x: 0,
      y: 0,
    };
    setFlowers([...flowers, newFlower]);
  };

  const removeFlower = (id: string) => {
    const filtered = flowers.filter((f) => f.id !== id);
    const reindexed = filtered.map((f, idx) => ({
      ...f,
      id: `flower-piece-${idx}`
    }));
    setFlowers(reindexed);
  };

  const rearrangeFlowers = () => {
    if (flowers.length <= 1) return;
    const shuffled = [...flowers].sort(() => Math.random() - 0.5);
    const reindexed = shuffled.map((f, idx) => ({
      ...f,
      id: `flower-piece-${idx}`
    }));
    setFlowers(reindexed);
  };

  // Find active wrapper configurations
  const activeWrapper = finalWrappers.find(w => w.id === bouquetWrapper) || finalWrappers[0] || { id: "classic", label: "Classic Elegance", url: "/bouquets/wrapper_classic.svg" };
  const defaultConfig = DEFAULT_WRAPPER_CONFIGS[activeWrapper.id] || DEFAULT_WRAPPER_CONFIGS.classic;
  const customConfig = customWrapperConfigs[activeWrapper.id];
  
  const currentConfig = {
    ...defaultConfig,
    ...(customConfig ? { 
      flowerMaskUrl: customConfig.flowerMaskUrl,
      visibleMaskUrl: customConfig.visibleMaskUrl,
      shadingMaskUrl: customConfig.shadingMaskUrl,
      scale: customConfig.scale
    } : {})
  };

  const allFlowers = finalFlowersList.map(f => ({ id: f.id, src: f.url, label: f.label }));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h3 className="font-heading text-3xl sm:text-4xl tracking-tight">Craft Your Bouquet</h3>
        <p className="text-muted-foreground text-sm">Select flowers and pick a wrapper to build the perfect arrangement.</p>
      </div>

      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RIGHT COLUMN: Interactive Bouquet Canvas (order-1 on mobile so it is top, order-2 on desktop) */}
        <div className="lg:col-span-6 lg:order-2 lg:sticky lg:top-6 flex flex-col items-center gap-4">
          <div 
            className="relative h-[450px] sm:h-[500px] w-full max-w-[400px] flex items-end justify-center rounded-3xl bg-card border shadow-inner overflow-hidden transition-colors font-sans"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('bg-primary/5');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('bg-primary/5');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('bg-primary/5');
              const type = e.dataTransfer.getData("flowerType");
              if (type) {
                if (flowers.length >= 64) {
                  alert("Your bouquet is absolutely stuffed! You can't add any more flowers.");
                  return;
                }
                addFlower(type);
              }
            }}
          >
            {/* Helper overlay */}
            {(!flowers || flowers.length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                <p className="text-muted-foreground text-sm font-medium animate-pulse">Add flowers to see them here!</p>
              </div>
            )}

            {/* Canvas wrapper and flowers list */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-4">
              <div className="relative w-full max-w-[400px] aspect-[4/5]">
                {/* 1. THE WRAPPER (z-20) */}
                <motion.div
                  key={`back-${activeWrapper.id}`}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                  className="absolute inset-0 z-20"
                  style={{ transformOrigin: "bottom center" }}
                >
                  <img 
                    src={activeWrapper.url} 
                    alt="Bouquet Wrapper"
                    className="w-full h-full object-contain object-bottom drop-shadow-2xl"
                  />
                </motion.div>

                {/* 2. THE FLOWERS (z-30) */}
                <div 
                  className="absolute inset-0 z-30 pointer-events-auto"
                  style={
                    currentConfig?.visibleMaskUrl && (currentConfig.visibleMaskUrl.startsWith('data:image') || currentConfig.visibleMaskUrl.startsWith('http') || currentConfig.visibleMaskUrl.startsWith('/'))
                      ? {
                          WebkitMaskImage: `url(${currentConfig.visibleMaskUrl})`,
                          WebkitMaskSize: '100% 100%',
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'bottom center',
                          maskImage: `url(${currentConfig.visibleMaskUrl})`,
                          maskSize: '100% 100%',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'bottom center'
                        }
                      : currentConfig?.flowerMaskUrl && currentConfig.flowerMaskUrl.startsWith('polygon')
                      ? { clipPath: currentConfig.flowerMaskUrl }
                      : undefined
                  }
                >
                  <div className="absolute inset-0">
                    <AnimatePresence>
                      {flowers.map((f, i) => {
                        const { left, top, rotation, scale, zIndex } = getFlowerStyle(i, activeWrapper.id, currentConfig.flowerMaskUrl, f.id);
                        const flowerSrc = allFlowers.find(ft => ft.id === f.type)?.src;

                        return (
                          <motion.div
                            key={f.id}
                            initial={{ scale: 0, opacity: 0, y: 50 }}
                            animate={{ scale: scale, opacity: 1, rotate: rotation, y: 0 }}
                            transition={{ type: "spring", bounce: 0.4 }}
                            exit={{ scale: 0, opacity: 0, y: 50 }}
                            className="absolute cursor-pointer animate-none"
                            style={{ 
                              left,
                              top,
                              transformOrigin: "center center", 
                              marginLeft: "-3.5rem",
                              marginTop: "-3.5rem",
                              zIndex,
                            }}
                            whileHover={{ scale: scale * 1.15, zIndex: 100 }}
                            onClick={() => removeFlower(f.id)}
                          >
                            {flowerSrc && (
                              <img 
                                src={flowerSrc} 
                                alt="Flower piece" 
                                className="w-28 h-28 object-contain"
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {flowers.length > 0 && (
            <p className="text-xs text-muted-foreground animate-pulse text-center">
              Tip: Click a flower in the bouquet to remove it.
            </p>
          )}
        </div>

        {/* LEFT COLUMN: Controls Dashboard (order-2 on mobile so it is bottom, order-1 on desktop) */}
        <div className="lg:col-span-6 lg:order-1 flex flex-col gap-6 bg-card/60 border rounded-3xl p-6 shadow-sm">
          {/* Tabs Selector Header */}
          <div className="flex border-b border-muted/60 pb-1">
            <button 
              type="button"
              onClick={() => setActiveTab('flowers')}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'flowers' 
                  ? 'border-primary text-primary scale-105' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Add Flowers
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('wrappers')}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'wrappers' 
                  ? 'border-primary text-primary scale-105' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Choose Wrapper
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'flowers' ? (
            <div className="space-y-4">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider block">Tap to add flowers (drag-and-drop on desktop)</Label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {allFlowers.map((ft) => {
                  const count = flowers.filter(f => f.type === ft.id).length;
                  return (
                    <motion.div
                      key={ft.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addFlower(ft.id)}
                      draggable
                      onDragStart={(e: any) => {
                        e.dataTransfer.setData("flowerType", ft.id);
                      }}
                      className="relative p-2.5 rounded-2xl bg-background border hover:border-primary/50 transition-colors flex flex-col items-center justify-center cursor-pointer text-center gap-1 group shadow-sm"
                    >
                      <img src={ft.src} alt={ft.id} className="w-10 h-10 object-contain pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="text-[10px] font-bold text-muted-foreground truncate w-full block select-none">{ft.label}</span>
                      {count > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                          {count}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider block">Choose a wrapper theme</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {finalWrappers.map((w) => {
                  const isActive = bouquetWrapper === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setBouquetWrapper(w.id)}
                      className={`relative p-3 rounded-2xl border text-left flex flex-col gap-2 transition-all group ${
                        isActive 
                          ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary' 
                          : 'bg-background hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="w-full h-16 bg-muted/20 rounded-xl overflow-hidden flex items-end justify-center p-2">
                        <img src={w.url} alt={w.label} className="h-full object-contain object-bottom group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-xs font-bold truncate block w-full select-none">{w.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Stats & Controls Menu */}
          {flowers.length > 0 && (
            <div className="border-t pt-4 flex items-center justify-between gap-4 mt-2">
              <div className="text-xs text-muted-foreground select-none">
                Total: <span className="font-bold text-foreground">{flowers.length} / 64</span> flowers
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  onClick={rearrangeFlowers} 
                  className="gap-1.5 px-3 font-semibold text-xs h-9"
                >
                  <Shuffle className="w-3.5 h-3.5" /> Rearrange
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFlowers([])} 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3 font-semibold text-xs h-9 gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Reset
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
