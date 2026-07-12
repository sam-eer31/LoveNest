"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatorStore } from "@/store/useCreatorStore";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";

export function StepPreview() {
  const store = useCreatorStore();
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Simulate API call for now (since Upstash Redis is not yet configured with ENV vars)
    // We will generate a random ID and save the secret to localStorage
    setTimeout(() => {
      const inviteId = Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
      const creatorSecret = Math.random().toString(36).slice(2, 15);
      
      // In a real scenario, this would be sent to POST /api/create
      // For now, let's just save the draft to localStorage to mock success
      const drafts = JSON.parse(localStorage.getItem('lovenest-invites-created') || '[]');
      drafts.push({ inviteId, secret: creatorSecret, name: store.receiverName, createdAt: Date.now() });
      localStorage.setItem('lovenest-invites-created', JSON.stringify(drafts));
      
      setIsPublishing(false);
      router.push(`/dashboard`);
    }, 2000);
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-8 text-center">
      <div className="space-y-2">
        <h3 className="font-heading text-3xl">Ready for Magic?</h3>
        <p className="text-muted-foreground">Review your choices before we weave the spell.</p>
      </div>

      <div className="rounded-2xl border bg-card p-6 text-left shadow-sm">
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between border-b pb-2">
            <dt className="text-muted-foreground">For</dt>
            <dd className="font-medium">{store.receiverName || "Someone special"}</dd>
          </div>
          <div className="flex justify-between border-b pb-2">
            <dt className="text-muted-foreground">Theme</dt>
            <dd className="font-medium">{store.theme}</dd>
          </div>
          <div className="flex justify-between border-b pb-2">
            <dt className="text-muted-foreground">Journey Pages</dt>
            <dd className="font-medium">{store.journeyOrder.length}</dd>
          </div>
          <div className="flex justify-between border-b pb-2">
            <dt className="text-muted-foreground">Timeline Events</dt>
            <dd className="font-medium">{store.timeline.length}</dd>
          </div>
          <div className="flex justify-between pb-2">
            <dt className="text-muted-foreground">Love Letter</dt>
            <dd className="font-medium">{store.letterContent ? "Written" : "Empty"}</dd>
          </div>
        </dl>
      </div>

      <Button 
        onClick={handlePublish} 
        disabled={isPublishing}
        size="lg" 
        className="h-14 w-full rounded-full text-lg shadow-xl shadow-primary/20"
      >
        {isPublishing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating Magic...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-5 w-5" />
            Publish LoveNest Invite
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground">
        Note: The link will expire automatically in 48 hours for security and privacy.
      </p>
    </div>
  );
}
