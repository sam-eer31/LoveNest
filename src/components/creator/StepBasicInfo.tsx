"use client";

import { useCreatorStore } from "@/store/useCreatorStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export function StepBasicInfo() {
  const { receiverName, nickname, relationship, updateBasicInfo } = useCreatorStore();

  return (
    <div className="mx-auto max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h3 className="font-heading text-3xl">Let's start with the basics</h3>
        <p className="text-muted-foreground">Who is this magical experience for?</p>
      </div>

      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
          <Label htmlFor="receiverName">Their Name</Label>
          <Input 
            id="receiverName" 
            placeholder="e.g. Eleanor" 
            value={receiverName}
            onChange={(e) => updateBasicInfo({ receiverName: e.target.value })}
            className="h-12 text-lg bg-white/50 backdrop-blur-sm dark:bg-black/50"
          />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
          <Label htmlFor="nickname">Nickname (Optional)</Label>
          <Input 
            id="nickname" 
            placeholder="e.g. Ellie" 
            value={nickname}
            onChange={(e) => updateBasicInfo({ nickname: e.target.value })}
            className="h-12 text-lg bg-white/50 backdrop-blur-sm dark:bg-black/50"
          />
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
          <Label htmlFor="relationship">Relationship</Label>
          <Input 
            id="relationship" 
            placeholder="e.g. Girlfriend, Crush, Wife" 
            value={relationship}
            onChange={(e) => updateBasicInfo({ relationship: e.target.value })}
            className="h-12 text-lg bg-white/50 backdrop-blur-sm dark:bg-black/50"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
