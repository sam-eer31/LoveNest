"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCreatorStore, JourneyPage } from "@/store/useCreatorStore";

import { StepBasicInfo } from "@/components/creator/StepBasicInfo";
import { StepTheme } from "@/components/creator/StepTheme";
import { StepJourney } from "@/components/creator/StepJourney";
import { StepTimeline } from "@/components/creator/StepTimeline";
import { StepLetter } from "@/components/creator/StepLetter";
import { StepPreview } from "@/components/creator/StepPreview";
import { StepMemoryAlbum } from "@/components/creator/StepMemoryAlbum";
import { StepFlowerGarden } from "@/components/creator/StepFlowerGarden";
import { StepGiftBox } from "@/components/creator/StepGiftBox";
import { StepMiniGame } from "@/components/creator/StepMiniGame";
import { StepCountdown } from "@/components/creator/StepCountdown";

const BASE_STEPS = [
  { id: "basic-info", title: "Who is this for?", component: StepBasicInfo },
  { id: "theme", title: "Choose Theme", component: StepTheme },
  { id: "journey", title: "Build Journey", component: StepJourney },
];

const JOURNEY_COMPONENT_MAP: Record<JourneyPage, React.ComponentType | null> = {
  "Letter": StepLetter,
  "Date Timeline": StepTimeline,
  "Memory Album": StepMemoryAlbum,
  "Flower Garden": StepFlowerGarden,
  "Gift Box": StepGiftBox,
  "Mini Game": StepMiniGame,
  "Countdown": StepCountdown,
  "The Invitation": null, // No configuration needed
};

export default function CreateFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const journeyOrder = useCreatorStore((state) => state.journeyOrder);

  const steps = useMemo(() => {
    const dynamicSteps = journeyOrder
      .map((page) => {
        const Comp = JOURNEY_COMPONENT_MAP[page];
        if (!Comp) return null;
        return { id: page, title: page, component: Comp };
      })
      .filter((step): step is { id: JourneyPage; title: JourneyPage; component: React.ComponentType } => step !== null);

    return [
      ...BASE_STEPS,
      ...dynamicSteps,
      { id: "preview", title: "Preview & Finish", component: StepPreview },
    ];
  }, [journeyOrder]);

  const CurrentComponent = steps[currentStep]?.component || StepPreview;

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-heading text-3xl">{steps[currentStep]?.title}</h2>
          <p className="text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
        <div className="flex gap-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 w-6 sm:w-8 rounded-full transition-colors ${
                idx <= currentStep ? "bg-primary" : "bg-primary/20"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative min-h-[400px] overflow-hidden rounded-3xl border bg-card p-4 sm:p-6 md:p-10 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <CurrentComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {currentStep < steps.length - 1 && (
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="w-24 sm:w-32"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="w-24 sm:w-32 shadow-lg shadow-primary/20"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
