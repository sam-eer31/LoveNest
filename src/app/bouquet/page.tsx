"use client";

import React from "react";
import Link from "next/link";
import { BouquetCreator } from "@/components/creator/BouquetCreator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StandaloneBouquetPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20 selection:bg-primary/30 font-sans">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white/50 px-6 backdrop-blur-md dark:bg-black/50">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-heading text-xl tracking-tight">
            Love<span className="text-primary">Nest</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Home
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12">
        <BouquetCreator />
      </main>
    </div>
  );
}
