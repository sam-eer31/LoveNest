import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Undo, Flower, Brush, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreatorStore } from '@/store/useCreatorStore';
import { Label } from '@/components/ui/label';

const WRAPPER_EXT: Record<string, string> = {
  classic: "svg",
  modern: "svg",
  kraft: "svg",
  main: "png",
  paper: "png",
  "2": "png",
};

export function ClipPathEditor({ 
  wrapperId, 
  existingMask, 
  existingShadingMask,
  onClose 
}: { 
  wrapperId: string; 
  existingMask?: string; 
  existingShadingMask?: string;
  onClose: () => void; 
}) {
  const { setCustomWrapperConfig, wrappers } = useCreatorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const wrapperObj = wrappers?.find(w => w.id === wrapperId);
  const imageUrl = wrapperObj ? wrapperObj.url : `/bouquets/wrapper_${wrapperId}.${WRAPPER_EXT[wrapperId] || "svg"}`;
  
  // Modes: 'spawn' (dot tool) or 'shading' (brush tool)
  const [activeMode, setActiveMode] = useState<'spawn' | 'shading'>('spawn');
  
  // Spawn Area polygon points
  const [spawnPoints, setSpawnPoints] = useState<{x: number, y: number}[]>([]);
  
  // Brush settings for Shading mode
  const [brushSize, setBrushSize] = useState(40);
  const [isErasing, setIsErasing] = useState(false);
  const isDrawing = useRef(false);
  const lastPos = useRef<{x: number, y: number} | null>(null);

  // Zoom state
  const [zoom, setZoom] = useState(1);

  // Drag and drop dot state
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);
  const isDraggingRef = useRef(false);

  const handleDotMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggedPointIndex(index);
    isDraggingRef.current = true;
  };

  const handleDotTouchStart = (e: React.TouchEvent, index: number) => {
    e.stopPropagation();
    setDraggedPointIndex(index);
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedPointIndex === null || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    
    const updatedPoints = [...spawnPoints];
    updatedPoints[draggedPointIndex] = { x, y };
    setSpawnPoints(updatedPoints);
  };

  const handleMouseUp = () => {
    setDraggedPointIndex(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedPointIndex === null || !containerRef.current || e.touches.length === 0) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    let y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
    
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    
    const updatedPoints = [...spawnPoints];
    updatedPoints[draggedPointIndex] = { x, y };
    setSpawnPoints(updatedPoints);
  };

  const handleTouchEnd = () => {
    setDraggedPointIndex(null);
  };
  
  // Parse existing spawn polygon and initialize canvas
  useEffect(() => {
    if (existingMask && existingMask.startsWith('polygon(')) {
      const pointStrings = existingMask.replace('polygon(', '').replace(')', '').split(', ');
      const parsedPoints = pointStrings.map(p => {
        const [x, y] = p.split(' ').map(val => parseFloat(val));
        return { x, y };
      }).filter(p => !isNaN(p.x) && !isNaN(p.y));
      
      if (parsedPoints.length > 0) {
        setSpawnPoints(parsedPoints);
      }
    }

    const canvas = canvasRef.current;
    if (canvas) {
      // Sync canvas dimensions to fixed 400x500 layout grid
      canvas.width = 400;
      canvas.height = 500;
      
      // Load previous brush shading if it exists
      if (existingShadingMask) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = existingShadingMask;
        }
      }
    }
  }, [existingMask, existingShadingMask]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (activeMode !== 'spawn' || !containerRef.current) return;
    
    // Ignore click if we just finished dragging a point to prevent duplicate placement
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setSpawnPoints([...spawnPoints, { x, y }]);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeMode !== 'shading') return;
    isDrawing.current = true;
    const pos = getCoordinates(e);
    if (pos) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        lastPos.current = pos;
      }
    }
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeMode !== 'shading' || !isDrawing.current || !canvasRef.current) return;
    e.preventDefault();

    const pos = getCoordinates(e);
    if (!pos) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isErasing) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#22c55e'; // Green shading paint
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handleUndo = () => {
    if (activeMode === 'spawn') {
      setSpawnPoints(spawnPoints.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (activeMode === 'spawn') {
      setSpawnPoints([]);
    } else {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = match ? match[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const uploadImage = async (dataUrl: string, filename: string, overwritePath?: string): Promise<string> => {
    try {
      const blob = dataURLtoBlob(dataUrl);
      const file = new File([blob], filename, { type: "image/png" });
      const formData = new FormData();
      formData.append("file", file);
      
      const endpoint = overwritePath 
        ? `/api/upload?overwritePath=${encodeURIComponent(overwritePath)}`
        : `/api/upload`;

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    } catch (e) {
      console.error("Upload error: ", e);
      return dataUrl; // fallback to base64 if upload fails
    }
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSaving(true);

    try {
      // 1. Get raw shading canvas image
      const shadingDataUrl = canvas.toDataURL('image/png');

      // 2. Create offscreen canvas to composite Spawn Polygon + Shading Area
      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const ctx = offscreen.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, offscreen.width, offscreen.height);

        // Draw the Spawn Polygon filled
        if (spawnPoints.length >= 3) {
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          spawnPoints.forEach((p, idx) => {
            const px = (p.x / 100) * offscreen.width;
            const py = (p.y / 100) * offscreen.height;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.fill();
        }

        // Layer the painted brush shading on top
        ctx.drawImage(canvas, 0, 0);
      }

      const visibleDataUrl = offscreen.toDataURL('image/png');
      const spawnString = spawnPoints.length >= 3 
        ? `polygon(${spawnPoints.map(p => `${p.x.toFixed(2)}% ${p.y.toFixed(2)}%`).join(', ')})`
        : undefined;

      // Upload images to backend overwriting the existing ones for this wrapper ID
      const [uploadedShadingUrl, uploadedVisibleUrl] = await Promise.all([
        uploadImage(shadingDataUrl, `shading_${wrapperId}.png`, `/bouquets/shading_${wrapperId}.png`),
        uploadImage(visibleDataUrl, `visible_${wrapperId}.png`, `/bouquets/visible_${wrapperId}.png`),
      ]);

      setCustomWrapperConfig(wrapperId, { 
        flowerMaskUrl: spawnString,
        visibleMaskUrl: uploadedVisibleUrl,
        shadingMaskUrl: uploadedShadingUrl
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save wrapper mask configuration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur flex flex-col items-center justify-center p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-5xl bg-card border rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row gap-8">
        
        {/* Editor Area */}
        <div className="flex-1 flex flex-col items-center select-none">
          <h2 className="text-2xl font-bold mb-2">Define Flower Mask</h2>
          
          <p className="text-muted-foreground text-sm text-center mb-6 max-w-md">
            Click dots to define where flowers **spawn** (Green Area). Use the brush tool to shade **extra overflow visible area** (like the top opening) to prevent sharp cuts.
          </p>

          {/* Scrollable Outer Container */}
          <div className="w-full max-w-[400px] aspect-[4/5] overflow-auto bg-muted/30 rounded-xl border border-dashed border-primary relative">
            {/* Editor Canvas Container (Scales with Zoom) */}
            <div 
              ref={containerRef}
              onClick={handleContainerClick}
              className="relative origin-top-left transition-all duration-200"
              style={{
                width: `${400 * zoom}px`,
                height: `${500 * zoom}px`,
              }}
            >
              <img 
                src={imageUrl} 
                alt="Wrapper"
                className="absolute inset-0 w-full h-full object-contain object-bottom opacity-40 pointer-events-none z-0"
              />
              
              {/* Draw Spawn Polygon Area Visual (Green) */}
              {spawnPoints.length > 2 && (
                <div 
                  className="absolute inset-0 bg-green-500/15 pointer-events-none z-10"
                  style={{ clipPath: `polygon(${spawnPoints.map(p => `${p.x}% ${p.y}%`).join(', ')})` }}
                />
              )}

              {/* Brush Shading Canvas */}
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className={`absolute inset-0 w-full h-full opacity-60 z-20 touch-none ${
                  activeMode === 'shading' ? 'cursor-brush block' : 'pointer-events-none block'
                }`}
              />

              {/* Draw SVG Lines for Spawn Polygon */}
              <svg 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none" 
                className="absolute inset-0 w-full h-full pointer-events-none z-30"
              >
                {spawnPoints.length > 0 && (
                  <polyline 
                    points={spawnPoints.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeDasharray="4"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
                {spawnPoints.length > 2 && (
                  <line 
                    x1={spawnPoints[spawnPoints.length-1].x} y1={spawnPoints[spawnPoints.length-1].y}
                    x2={spawnPoints[0].x} y2={spawnPoints[0].y}
                    stroke="#22c55e" 
                    strokeWidth="2.5" 
                    strokeDasharray="4"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>

              {/* Draw Dots for Spawn Area */}
              {spawnPoints.map((p, i) => (
                <div 
                  key={`spawn-${i}`}
                  onMouseDown={(e) => handleDotMouseDown(e, i)}
                  onTouchStart={(e) => handleDotTouchStart(e, i)}
                  className={cn(
                    "absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md z-40 cursor-grab hover:scale-125 transition-transform duration-100",
                    draggedPointIndex === i && "scale-125 bg-primary cursor-grabbing"
                  )}
                  style={{ 
                    left: `${p.x}%`, 
                    top: `${p.y}%`, 
                    pointerEvents: activeMode === 'spawn' ? 'auto' : 'none' 
                  }}
                >
                  {i === 0 && <div className="absolute -top-6 -left-2 text-[10px] font-bold text-green-600 bg-white px-1 rounded shadow-sm select-none pointer-events-none">Spawn Start</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full md:w-72 flex flex-col gap-6 pt-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Tool Selection</span>
            
            <Button 
              variant={activeMode === 'spawn' ? 'default' : 'outline'}
              className={`w-full justify-start gap-2 h-11 transition-all ${
                activeMode === 'spawn' ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:text-green-600'
              }`}
              onClick={() => setActiveMode('spawn')}
            >
              <Flower className="w-4 h-4" /> Spawn Area (Dots)
            </Button>
            
            <Button 
              variant={activeMode === 'shading' ? 'default' : 'outline'}
              className={`w-full justify-start gap-2 h-11 transition-all ${
                activeMode === 'shading' ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:text-green-600'
              }`}
              onClick={() => setActiveMode('shading')}
            >
              <Brush className="w-4 h-4" /> Visible Shading (Brush)
            </Button>
          </div>

          {activeMode === 'shading' && (
            <div className="space-y-3 pt-4 border-t transition-all">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Brush Settings</Label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="10" max="100" step="5" 
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs font-bold">{brushSize}px</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={!isErasing ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setIsErasing(false)}
                  className="flex-1"
                >
                  🖌️ Paint Visible
                </Button>
                <Button 
                  variant={isErasing ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setIsErasing(true)}
                  className="flex-1 text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
                >
                  🧹 Eraser
                </Button>
              </div>
            </div>
          )}

          {/* Zoom controls */}
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Editor Zoom</Label>
            <div className="grid grid-cols-4 gap-1">
              {[1, 1.5, 2, 2.5].map((z) => (
                <Button
                  key={z}
                  type="button"
                  variant={zoom === z ? "default" : "outline"}
                  size="sm"
                  onClick={() => setZoom(z)}
                  className="h-8 font-semibold text-xs"
                >
                  {z}x
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Editor Actions</span>
            {activeMode === 'spawn' && (
              <Button 
                variant="outline" 
                onClick={handleUndo} 
                disabled={spawnPoints.length === 0}
                className="w-full flex items-center justify-center gap-2"
              >
                <Undo className="w-4 h-4" /> Undo Last Dot
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleClear} 
              className="w-full text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear Current Mode
            </Button>
          </div>

          <div className="mt-auto flex flex-col gap-2 pt-8">
            <Button 
              size="lg" 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full font-bold text-lg h-12"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin inline" />
                  Saving Mask...
                </>
              ) : (
                "Save Area Mask"
              )}
            </Button>
            <Button variant="ghost" onClick={onClose} disabled={isSaving} className="w-full">
              Cancel
            </Button>
          </div>
        </div>

      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 rounded-full bg-background/50 hover:bg-background"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>
    </div>
  );
}
