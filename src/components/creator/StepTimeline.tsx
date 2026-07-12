"use client";

import { useCreatorStore } from "@/store/useCreatorStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StepTimeline() {
  const { timeline, setTimeline } = useCreatorStore();

  const addEvent = () => {
    setTimeline([
      ...timeline,
      {
        id: Math.random().toString(36).slice(2, 9),
        title: "",
        time: "",
        location: "",
        description: "",
        emoji: "✨",
      },
    ]);
  };

  const removeEvent = (id: string) => {
    setTimeline(timeline.filter((e) => e.id !== id));
  };

  const updateEvent = (id: string, field: string, value: string) => {
    setTimeline(
      timeline.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-2 text-center">
        <h3 className="font-heading text-3xl">Plan the Date</h3>
        <p className="text-muted-foreground">Add the timeline of events for your magical date.</p>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {timeline.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm"
            >
              <div className="absolute right-4 top-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeEvent(event.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                  {index + 1}
                </div>
                <Input
                  value={event.emoji}
                  onChange={(e) => updateEvent(event.id, "emoji", e.target.value)}
                  className="h-10 w-16 text-center text-lg"
                  maxLength={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                    placeholder="e.g. Dinner at Luigi's" 
                    value={event.title}
                    onChange={(e) => updateEvent(event.id, "title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input 
                    placeholder="e.g. 7:00 PM" 
                    value={event.time}
                    onChange={(e) => updateEvent(event.id, "time", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Location</Label>
                  <Input 
                    placeholder="e.g. 123 Main St" 
                    value={event.location}
                    onChange={(e) => updateEvent(event.id, "location", e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button 
          variant="outline" 
          onClick={addEvent}
          className="w-full border-dashed py-8 text-muted-foreground hover:border-primary hover:text-primary"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Timeline Event
        </Button>
      </div>
    </div>
  );
}
