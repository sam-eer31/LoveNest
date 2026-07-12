"use client";

import { useCreatorStore } from "@/store/useCreatorStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepCountdown() {
  const { targetDate, setTargetDate } = useCreatorStore();

  return (
    <div className="mx-auto w-full max-w-xl space-y-8 text-center">
      <div className="space-y-2">
        <h3 className="font-heading text-3xl">The Countdown</h3>
        <p className="text-muted-foreground">Set the date and time for when the magic happens.</p>
      </div>

      <div className="rounded-2xl border bg-card p-8 text-left shadow-sm">
        <div className="space-y-4">
          <Label htmlFor="date">When is the date?</Label>
          <Input 
            id="date" 
            type="datetime-local" 
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="h-14 text-lg bg-white/50 dark:bg-black/50"
          />
          <p className="text-sm text-muted-foreground">
            A beautiful ticking countdown will be displayed to build anticipation!
          </p>
        </div>
      </div>
    </div>
  );
}
