"use client";

import React from "react";
import { useCreatorStore } from "@/store/useCreatorStore";
import { BouquetDesigner } from "./BouquetDesigner";

export function StepFlowerGarden() {
  const { 
    flowers, 
    bouquetWrapper, 
    setFlowers, 
    setBouquetWrapper, 
    customWrapperConfigs, 
    wrappers, 
    flowersList 
  } = useCreatorStore();

  return (
    <BouquetDesigner
      flowers={flowers}
      setFlowers={setFlowers}
      bouquetWrapper={bouquetWrapper}
      setBouquetWrapper={setBouquetWrapper}
      customWrapperConfigs={customWrapperConfigs}
      wrappers={wrappers}
      flowersList={flowersList}
    />
  );
}
