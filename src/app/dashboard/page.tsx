"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InviteDraft {
  inviteId: string;
  secret: string;
  name: string;
  createdAt: number;
}

export default function DashboardPage() {
  const [invites, setInvites] = useState<InviteDraft[]>([]);

  useEffect(() => {
    const drafts = JSON.parse(localStorage.getItem('lovenest-invites-created') || '[]');
    setInvites(drafts.sort((a: InviteDraft, b: InviteDraft) => b.createdAt - a.createdAt));
  }, []);

  const handleDelete = (inviteId: string) => {
    if (confirm("Are you sure you want to delete this invite? This action cannot be undone.")) {
      const drafts = JSON.parse(localStorage.getItem('lovenest-invites-created') || '[]');
      const updated = drafts.filter((d: InviteDraft) => d.inviteId !== inviteId);
      localStorage.setItem('lovenest-invites-created', JSON.stringify(updated));
      setInvites(updated);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white/50 px-6 backdrop-blur-md dark:bg-black/50">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-heading text-xl tracking-tight">
            Love<span className="text-primary">Nest</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/create" className={buttonVariants({ size: "sm" })}>
            New Invite
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <h1 className="mb-8 font-heading text-4xl">Your Invites</h1>
        
        {invites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-24 text-center bg-card shadow-sm">
            <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <h3 className="font-heading text-2xl">No invites yet</h3>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Create your first magical LoveNest invite and share it with someone special.
            </p>
            <Link href="/create" className={cn(buttonVariants(), "mt-6 shadow-lg shadow-primary/20")}>
              Create Date
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {invites.map((invite) => (
              <motion.div
                key={invite.inviteId}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4">
                  <h3 className="font-heading text-xl">For {invite.name || "Someone"}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(invite.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <Link href={`/date/${invite.inviteId}`} className={cn(buttonVariants({ variant: "default" }), "flex-1 text-center justify-center")}>
                    View Invite
                  </Link>
                  <Button variant="outline" size="icon" title="Copy Link" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/date/${invite.inviteId}`);
                    alert("Link copied!");
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200" title="Delete Invite" onClick={() => handleDelete(invite.inviteId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
