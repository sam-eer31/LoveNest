"use client";

import React, { useState } from "react";
import { useCreatorStore } from "@/store/useCreatorStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClipPathEditor } from "@/components/creator/ClipPathEditor";
import { Loader2, Plus, Trash2, Scissors, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function AdminPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { 
    wrappers, 
    addWrapper, 
    deleteWrapper, 
    customWrapperConfigs,
    setCustomWrapperConfig,
    flowersList,
    addFlowerOption,
    deleteFlowerOption
  } = useCreatorStore();

  const [editingWrapperId, setEditingWrapperId] = useState<string | null>(null);
  
  // New Wrapper Form State
  const [wrapperName, setWrapperName] = useState("");
  const [wrapperFile, setWrapperFile] = useState<File | null>(null);
  const [isUploadingWrapper, setIsUploadingWrapper] = useState(false);

  // New Flower Form State
  const [flowerName, setFlowerName] = useState("");
  const [flowerFile, setFlowerFile] = useState<File | null>(null);
  const [isUploadingFlower, setIsUploadingFlower] = useState(false);

  // Prevent Next.js hydration issues by waiting until mounted
  const [isHydrated, setIsHydrated] = useState(false);
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm font-medium">Loading admin settings...</p>
        </div>
      </div>
    );
  }

  const handleAddWrapper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wrapperName.trim() || !wrapperFile) return;

    setIsUploadingWrapper(true);
    try {
      const ext = wrapperFile.name.split(".").pop() || "png";
      const safeName = wrapperName.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "_");
      const customFilename = `${safeName}.${ext}`;

      const formData = new FormData();
      formData.append("file", wrapperFile, customFilename);

      const res = await fetch("/api/upload?type=bouquet&useOriginalName=true", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const newId = safeName;

      addWrapper({
        id: newId,
        label: wrapperName,
        url: data.url,
        ext,
      });

      setWrapperName("");
      setWrapperFile(null);
      const fileInput = document.getElementById("wrapper-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      alert("New wrapper added successfully! Edit its mask to configure it.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to upload wrapper.");
    } finally {
      setIsUploadingWrapper(false);
    }
  };

  const handleAddFlower = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowerName.trim() || !flowerFile) return;

    setIsUploadingFlower(true);
    try {
      const ext = flowerFile.name.split(".").pop() || "png";
      const safeName = flowerName.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "_");
      const customFilename = `${safeName}.${ext}`;

      const formData = new FormData();
      formData.append("file", flowerFile, customFilename);

      const res = await fetch("/api/upload?type=flower&useOriginalName=true", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const newId = safeName;

      addFlowerOption({
        id: newId,
        label: flowerName,
        url: data.url,
      });

      setFlowerName("");
      setFlowerFile(null);
      const fileInput = document.getElementById("flower-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      alert("New flower type added successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to upload flower.");
    } finally {
      setIsUploadingFlower(false);
    }
  };

  const activeConfig = editingWrapperId ? customWrapperConfigs[editingWrapperId] : null;

  return (
    <div className="min-h-screen bg-muted/20 pb-24 text-foreground">
      {editingWrapperId && (
        <ClipPathEditor
          wrapperId={editingWrapperId}
          existingMask={activeConfig?.flowerMaskUrl}
          existingShadingMask={activeConfig?.shadingMaskUrl}
          onClose={() => setEditingWrapperId(null)}
        />
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/50 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
        <h1 className="font-heading text-xl font-bold">Wrapper & Flower Admin Portal 🛠️</h1>
        <div className="w-24" /> {/* Spacer */}
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-12 space-y-12">
        
        {/* ================= SECTION 1: MANAGE WRAPPERS ================= */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">1. Bouquet Wrappers</h2>
            <p className="text-muted-foreground text-sm">Register wrapper pieces and configure their visual flower masking limits.</p>
          </div>

          <section className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold">Add New Wrapper</h3>
            <form onSubmit={handleAddWrapper} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="wrapper-name">Wrapper Name</Label>
                <Input
                  id="wrapper-name"
                  type="text"
                  placeholder="e.g. Lavender Lace"
                  value={wrapperName}
                  onChange={(e) => setWrapperName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wrapper-file">Image File (PNG/SVG preferred)</Label>
                <Input
                  id="wrapper-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setWrapperFile(e.target.files[0])}
                  required
                />
              </div>

              <Button type="submit" disabled={isUploadingWrapper} className="w-full gap-2 h-10 font-medium">
                {isUploadingWrapper ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Add Wrapper
                  </>
                )}
              </Button>
            </form>
          </section>

          {/* Wrappers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(wrappers || []).map((w) => {
              const config = customWrapperConfigs[w.id];
              const hasMask = !!config?.flowerMaskUrl;

              return (
                <div key={w.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow">
                  {/* Image Display */}
                  <div className="aspect-[4/5] bg-muted/30 relative flex items-end justify-center p-4 border-b">
                    <img 
                      src={w.url} 
                      alt={w.label}
                      className="w-full h-full object-contain object-bottom"
                    />
                    {hasMask && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Mask Defined
                      </div>
                    )}
                  </div>

                  {/* Wrapper Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{w.label}</h3>
                      <p className="text-xs text-muted-foreground font-mono">ID: {w.id}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1 gap-2 text-xs font-semibold"
                        onClick={() => setEditingWrapperId(w.id)}
                      >
                        <Scissors className="h-3.5 w-3.5" /> Edit Mask
                      </Button>

                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                        onClick={() => {
                          if (confirm(`Are you sure you want to completely delete wrapper "${w.label}"?`)) {
                            deleteWrapper(w.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= SECTION 2: MANAGE FLOWERS ================= */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">2. Flower Options</h2>
            <p className="text-muted-foreground text-sm">Add custom flowers that creators can select when arranging their bouquets.</p>
          </div>

          <section className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold">Add New Flower Type</h3>
            <form onSubmit={handleAddFlower} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="flower-name">Flower Name</Label>
                <Input
                  id="flower-name"
                  type="text"
                  placeholder="e.g. Orchid"
                  value={flowerName}
                  onChange={(e) => setFlowerName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flower-file">Flower Image File (PNG/SVG transparent)</Label>
                <Input
                  id="flower-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setFlowerFile(e.target.files[0])}
                  required
                />
              </div>

              <Button type="submit" disabled={isUploadingFlower} className="w-full gap-2 h-10 font-medium">
                {isUploadingFlower ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Add Flower
                  </>
                )}
              </Button>
            </form>
          </section>

          {/* Flowers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {(flowersList || []).map((f) => {
              return (
                <div key={f.id} className="bg-card border rounded-xl p-4 flex flex-col items-center justify-between text-center relative hover:border-primary/50 transition-colors">
                  <div className="w-16 h-16 flex items-center justify-center my-4">
                    <img src={f.url} alt={f.label} className="max-w-full max-h-full object-contain" />
                  </div>
                  
                  <div className="w-full space-y-2">
                    <p className="text-sm font-bold truncate">{f.label}</p>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="xs"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full h-8 gap-1.5 justify-center"
                      onClick={() => {
                        if (confirm(`Are you sure you want to completely delete flower "${f.label}"?`)) {
                          deleteFlowerOption(f.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
