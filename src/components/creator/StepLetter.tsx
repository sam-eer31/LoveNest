"use client";

import { useCreatorStore } from "@/store/useCreatorStore";
import { Label } from "@/components/ui/label";

export function StepLetter() {
  const { letterContent, setLetterContent } = useCreatorStore();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-2 text-center">
        <h3 className="font-heading text-3xl">Write a Love Letter</h3>
        <p className="text-muted-foreground">Pour your heart out. They will read this during the journey.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border bg-[#fdfbf7] p-8 shadow-sm dark:bg-[#1a1918]">
        <div className="absolute left-8 top-0 h-full w-[1.5px] bg-red-300 dark:bg-red-800/60" />
        
        <div className="relative z-10 pl-6">
          <Label htmlFor="letter" className="sr-only">Letter Content</Label>
          <textarea
            id="letter"
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            placeholder="Dear..."
            className="min-h-[400px] w-full resize-none bg-transparent pt-[8px] font-handwriting font-bold text-2xl leading-[32px] text-neutral-900 dark:text-neutral-100 focus:outline-none"
            style={{
              lineHeight: '32px',
              backgroundImage: 'linear-gradient(transparent 31px, rgba(147,197,253,0.35) 32px)',
              backgroundSize: '100% 32px',
              backgroundAttachment: 'local',
            }}
          />
        </div>
      </div>
    </div>
  );
}
