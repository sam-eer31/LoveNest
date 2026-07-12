"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flower } from "@/store/useCreatorStore";

const WRAPPER_EXT: Record<string, string> = {
  classic: "svg",
  modern: "svg",
  kraft: "svg",
  main: "png",
  paper: "png",
  "2": "png",
  korean_wrap: "png",
};

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
  },
  korean_wrap: {
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
  korean_wrap: "polygon(15% 25%, 85% 25%, 50% 85%)",
};

const DEFAULT_WRAPPERS = [
  { id: "main", label: "Sweet Satin", url: "/bouquets/wrapper_main.png", ext: "png" },
  { id: "paper", label: "Vintage Paper", url: "/bouquets/wrapper_paper.png", ext: "png" },
  { id: "2", label: "Blushing Ribbon", url: "/bouquets/wrapper_2.png", ext: "png" },
  { id: "korean_wrap", label: "Korean Wrap", url: "/bouquets/korean_wrap.png", ext: "png" }
];

const DEFAULT_FLOWERS = [
  { id: "tulip", label: "Tulip", url: "/flowers/tulip.svg" },
  { id: "rose", label: "Rose", url: "/flowers/rose.svg" },
  { id: "sunflower", label: "Sunflower", url: "/flowers/sunflower.svg" },
  { id: "cherry", label: "Cherry", url: "/flowers/cherry_blossom.svg" },
  { id: "hibiscus", label: "Hibiscus", url: "/flowers/hibiscus.svg" },
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
  if (!maskUrl) return [];
  const clean = maskUrl.replace(/polygon\s*\(/i, '').replace(/\)\s*$/, '').trim();
  if (!clean) return [];
  
  const pointStrings = clean.split(',');
  return pointStrings.map(p => {
    const parts = p.trim().split(/\s+/).map(val => parseFloat(val));
    return { x: parts[0], y: parts[1] };
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

export interface BouquetViewerProps {
  flowers: Flower[];
  bouquetWrapper?: string;
  customWrapperConfigs?: Record<string, { flowerMaskUrl?: string, visibleMaskUrl?: string, scale?: number }>;
  wrappers?: { id: string; label: string; url: string; ext: string }[];
  flowersList?: { id: string; label: string; url: string }[];
}

export function BouquetViewer({
  flowers,
  bouquetWrapper,
  customWrapperConfigs = {},
  wrappers,
  flowersList,
}: BouquetViewerProps) {
  const displayWrapper = bouquetWrapper || "classic";
  
  const finalWrappers = wrappers && wrappers.length > 0 ? wrappers : DEFAULT_WRAPPERS;
  const finalFlowersList = flowersList && flowersList.length > 0 ? flowersList : DEFAULT_FLOWERS;

  const defaultConfig = WRAPPER_CONFIGS[displayWrapper] || WRAPPER_CONFIGS.classic;
  const customConfig = customWrapperConfigs?.[displayWrapper];
  
  const currentConfig = {
    ...defaultConfig,
    ...(customConfig ? { 
      flowerMaskUrl: customConfig.flowerMaskUrl,
      visibleMaskUrl: customConfig.visibleMaskUrl,
      scale: customConfig.scale
    } : {})
  };

  const activeWrapperObj = finalWrappers.find(w => w.id === displayWrapper);
  const imageUrl = activeWrapperObj ? activeWrapperObj.url : `/bouquets/wrapper_${displayWrapper}.${WRAPPER_EXT[displayWrapper] || "svg"}`;

  const allFlowers = finalFlowersList.map(f => ({ id: f.id, src: f.url, label: f.label }));

  return (
    <div className="relative w-full max-w-sm aspect-[4/5] flex items-center justify-center font-sans">
      {(!flowers || flowers.length === 0) ? (
        <div className="flex h-full items-center justify-center text-muted-foreground pb-12 z-50">A beautiful bouquet.</div>
      ) : (
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <div className="relative w-full max-w-[400px] aspect-[4/5]">
            {/* 1. THE WRAPPER */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
              className="absolute inset-0 z-20 drop-shadow-2xl"
              style={{ transformOrigin: "bottom center" }}
            >
              <img 
                src={imageUrl} 
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
              {/* Full height absolute container for 1:1 coordinate matching */}
              <div className="absolute inset-0">
                <AnimatePresence>
                  {flowers.map((f, i) => {
                    const { left, top, rotation, scale, zIndex } = getFlowerStyle(i, displayWrapper, currentConfig.flowerMaskUrl, f.id);
                    const flowerSrc = allFlowers.find(ft => ft.id === f.type)?.src;

                    return (
                      <motion.div
                        key={f.id}
                        initial={{ scale: 0, opacity: 0, y: 50 }}
                        animate={{ scale: scale, opacity: 1, rotate: rotation, y: 0 }}
                        transition={{ delay: 0.8 + (i * 0.08), type: "spring", bounce: 0.4 }}
                        className="absolute cursor-pointer"
                        style={{
                          left,
                          top,
                          transformOrigin: "center center", 
                          marginLeft: "-3.5rem",
                          marginTop: "-3.5rem",
                          zIndex,
                        }}
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
      )}
    </div>
  );
}
