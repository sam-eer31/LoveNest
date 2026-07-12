"use client";

import { useState } from "react";
import { useCreatorStore, JourneyPage } from "@/store/useCreatorStore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const ALL_PAGES: JourneyPage[] = [
  "Letter",
  "Memory Album",
  "Flower Garden",
  "Mini Game",
  "Gift Box",
  "Date Timeline",
  "Countdown",
];

const SortableItem = ({ id, onRemove }: { id: string; onRemove: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-colors ${
        isDragging ? "border-primary shadow-md" : ""
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1 font-medium">{id}</div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(id)}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function StepJourney() {
  const { journeyOrder, setJourneyOrder } = useCreatorStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = journeyOrder.indexOf(active.id as JourneyPage);
      const newIndex = journeyOrder.indexOf(over.id as JourneyPage);
      setJourneyOrder(arrayMove(journeyOrder, oldIndex, newIndex));
    }
  };

  const addPage = (page: JourneyPage) => {
    if (!journeyOrder.includes(page)) {
      setJourneyOrder([...journeyOrder, page]);
    }
  };

  const removePage = (page: string) => {
    setJourneyOrder(journeyOrder.filter((p) => p !== page));
  };

  const displayOrder = journeyOrder.filter(p => p !== "The Invitation");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-2 text-center">
        <h3 className="font-heading text-3xl">Craft the Journey</h3>
        <p className="text-muted-foreground">Drag to reorder pages. What story do you want to tell?</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Your Flow</h4>
          
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-primary mb-2">
            <div className="h-5 w-5" />
            <div className="flex-1 font-medium italic">The Invitation (Always First)</div>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={displayOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {displayOrder.map((id) => (
                  <SortableItem key={id} id={id} onRemove={removePage} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Available Pages</h4>
          <div className="flex flex-wrap gap-2">
            {ALL_PAGES.filter(p => !journeyOrder.includes(p)).map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addPage(page)}
                className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm shadow-sm hover:border-primary/50"
              >
                <Plus className="h-4 w-4 text-primary" />
                {page}
              </motion.button>
            ))}
            {ALL_PAGES.filter(p => !journeyOrder.includes(p)).length === 0 && (
              <div className="text-sm text-muted-foreground italic p-4">All pages added!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
