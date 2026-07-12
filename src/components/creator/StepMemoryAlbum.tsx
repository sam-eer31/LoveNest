"use client";

import { useState } from "react";
import { useCreatorStore } from "@/store/useCreatorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StepMemoryAlbum() {
  const { photos, setPhotos } = useCreatorStore();
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const addPhoto = () => {
    setPhotos([
      ...photos,
      {
        id: Math.random().toString(36).slice(2, 9),
        url: "",
        caption: "",
      },
    ]);
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const updatePhoto = (id: string, field: "url" | "caption", value: string) => {
    setPhotos(
      photos.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleFileUpload = async (id: string, file: File) => {
    if (!file) return;
    setUploadingId(id);
    
    try {
      // Client-side image compression to fit within localStorage limits
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 jpeg at 70% quality
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          updatePhoto(id, "url", dataUrl);
          setUploadingId(null);
        };
        
        img.onerror = () => {
          alert("Failed to read image.");
          setUploadingId(null);
        };
      };
    } catch (error) {
      alert("Failed to process image. Please try again.");
      setUploadingId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-2 text-center">
        <h3 className="font-heading text-3xl">Memory Album</h3>
        <p className="text-muted-foreground">Upload photos to create a beautiful polaroid gallery.</p>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm"
            >
              <div className="absolute right-4 top-4 z-10">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removePhoto(photo.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex h-32 w-full md:w-32 shrink-0 items-center justify-center rounded-xl bg-muted overflow-hidden relative">
                  {uploadingId === photo.id ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : photo.url ? (
                    <img src={photo.url} alt="Preview" className="h-full w-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                  )}
                </div>
                
                <div className="flex flex-1 flex-col justify-center gap-4">
                  <div className="space-y-2">
                    <Label>Upload Image</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(photo.id, file);
                        }}
                        className="cursor-pointer file:cursor-pointer file:bg-primary/10 file:text-primary file:border-0 file:rounded-md file:px-4 file:py-1 hover:file:bg-primary/20 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Caption (Optional)</Label>
                    <Input 
                      placeholder="e.g. Our first date at the beach" 
                      value={photo.caption}
                      onChange={(e) => updatePhoto(photo.id, "caption", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button 
          variant="outline" 
          onClick={addPhoto}
          className="w-full border-dashed py-8 text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Photo
        </Button>
      </div>
    </div>
  );
}
