"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white/50 px-6 backdrop-blur-md dark:bg-black/50">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-heading text-xl tracking-tight">
            Love<span className="text-primary">Nest</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>
            Dashboard
          </Link>
          <Button variant="outline" size="sm">
            Save Draft
          </Button>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
