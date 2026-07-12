import { motion } from "framer-motion";

export type WrapperStyle = "classic" | "modern" | "kraft";

interface BouquetWrapperProps {
  wrapperType: WrapperStyle;
  children: React.ReactNode;
}

export function BouquetWrapper({ wrapperType, children }: BouquetWrapperProps) {
  const isModern = wrapperType === "modern";
  const isKraft = wrapperType === "kraft";

  // CLASSIC ELEGANCE (Cream & Red)
  const classicBack = (
    <svg width="350" height="350" viewBox="0 0 350 350" className="absolute top-0 drop-shadow-2xl">
      {/* Outer back layer */}
      <path d="M 40,350 C -20,150 20,20 175,20 C 330,20 370,150 310,350 Z" fill="#f8f4e6" />
      {/* Inner back layer with slight rotation */}
      <path d="M 80,350 C 10,180 70,50 175,50 C 280,50 340,180 270,350 Z" fill="#fdfaf0" filter="drop-shadow(0px 10px 15px rgba(0,0,0,0.05))" />
    </svg>
  );

  const classicFront = (
    <svg width="350" height="300" viewBox="0 0 350 300" className="absolute bottom-0 z-30 drop-shadow-2xl pointer-events-none">
      <defs>
        <filter id="shadowFront" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="-10" stdDeviation="15" floodOpacity="0.15"/>
        </filter>
        <filter id="ribbonShadow">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Left Front Fold */}
      <path d="M 10,20 C 40,120 100,200 150,250 C 90,200 60,100 80,0 Z" fill="#f4ebd8" filter="url(#shadowFront)"/>
      
      {/* Right Front Fold */}
      <path d="M 340,20 C 310,120 250,200 200,250 C 260,200 290,100 270,0 Z" fill="#f4ebd8" filter="url(#shadowFront)"/>
      
      {/* Center Cup Wrap */}
      <path d="M 60,60 C 100,180 130,230 145,300 L 205,300 C 220,230 250,180 290,60 C 230,120 175,140 175,140 C 175,140 120,120 60,60 Z" fill="#fdfaf0" filter="url(#shadowFront)"/>
      
      {/* Ribbon Horizontal Wrap */}
      <path d="M 130,200 C 160,210 190,210 220,200 L 210,235 C 180,245 170,245 140,235 Z" fill="#a00f19" filter="url(#ribbonShadow)"/>
      
      {/* Ribbon Left Tail */}
      <path d="M 160,220 C 130,270 110,290 80,300 L 120,300 C 140,280 160,250 175,230 Z" fill="#c1121f" filter="url(#ribbonShadow)"/>
      
      {/* Ribbon Right Tail */}
      <path d="M 190,220 C 220,270 240,290 270,300 L 230,300 C 210,280 190,250 175,230 Z" fill="#c1121f" filter="url(#ribbonShadow)"/>
      
      {/* Ribbon Left Bow */}
      <path d="M 175,220 C 80,150 40,230 160,235 Z" fill="#c1121f" filter="url(#ribbonShadow)"/>
      <path d="M 165,225 C 100,180 80,220 150,230 Z" fill="#a00f19" /> {/* Inner shading */}
      
      {/* Ribbon Right Bow */}
      <path d="M 175,220 C 270,150 310,230 190,235 Z" fill="#c1121f" filter="url(#ribbonShadow)"/>
      <path d="M 185,225 C 250,180 270,220 200,230 Z" fill="#a00f19" /> {/* Inner shading */}
      
      {/* Center Knot */}
      <circle cx="175" cy="225" r="16" fill="#8c0c16" filter="url(#ribbonShadow)"/>
    </svg>
  );

  // MODERN EDGE (White, Black Borders, Velvet Ribbon)
  const modernBack = (
    <svg width="350" height="350" viewBox="0 0 350 350" className="absolute top-0 drop-shadow-2xl">
      <path d="M 20,350 L -10,120 L 100,10 L 250,10 L 360,120 L 330,350 Z" fill="#ffffff" stroke="#1f2937" strokeWidth="6" strokeLinejoin="round" />
      <path d="M 60,350 L 30,150 L 120,40 L 230,40 L 320,150 L 290,350 Z" fill="#f8fafc" stroke="#1f2937" strokeWidth="4" strokeLinejoin="round" />
      {/* Geometric intersecting lines */}
      <path d="M -10,120 L 120,40 M 360,120 L 230,40" stroke="#1f2937" strokeWidth="2" />
    </svg>
  );

  const modernFront = (
    <svg width="350" height="300" viewBox="0 0 350 300" className="absolute bottom-0 z-30 drop-shadow-2xl pointer-events-none">
      <defs>
        <filter id="shadowModern" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="-8" stdDeviation="12" floodOpacity="0.2"/>
        </filter>
      </defs>
      
      {/* Left overlapping geometric fold */}
      <path d="M -20,60 L 100,200 L 140,250 L 145,300 L 50,300 Z" fill="#f8fafc" stroke="#1f2937" strokeWidth="5" strokeLinejoin="round" filter="url(#shadowModern)"/>
      {/* Right overlapping geometric fold */}
      <path d="M 370,60 L 250,200 L 210,250 L 205,300 L 300,300 Z" fill="#f8fafc" stroke="#1f2937" strokeWidth="5" strokeLinejoin="round" filter="url(#shadowModern)"/>
      
      {/* Center wrap */}
      <path d="M 40,100 C 120,180 150,230 160,300 L 190,300 C 200,230 230,180 310,100 C 230,150 175,170 175,170 C 175,170 120,150 40,100 Z" fill="#ffffff" stroke="#1f2937" strokeWidth="5" strokeLinejoin="round" filter="url(#shadowModern)"/>

      {/* Velvet Ribbon Horizontal */}
      <path d="M 140,205 L 210,205 L 205,230 L 145,230 Z" fill="#0f172a" />
      
      {/* Velvet Ribbon Left Tail */}
      <path d="M 160,225 C 150,260 140,280 120,300 L 145,300 C 160,280 165,250 175,230 Z" fill="#0f172a" />
      
      {/* Velvet Ribbon Right Tail */}
      <path d="M 190,225 C 200,260 210,280 230,300 L 205,300 C 190,280 185,250 175,230 Z" fill="#0f172a" />
      
      {/* Thin elegant bow loops */}
      <path d="M 175,225 C 100,200 120,240 165,230" fill="none" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
      <path d="M 175,225 C 250,200 230,240 185,230" fill="none" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
      
      <circle cx="175" cy="225" r="8" fill="#020617" />
    </svg>
  );

  // RUSTIC KRAFT (Brown Paper, Twine)
  const kraftBack = (
    <svg width="350" height="350" viewBox="0 0 350 350" className="absolute top-0 drop-shadow-2xl">
      <path d="M 40,350 L -10,80 C 50,10 120,30 175,30 C 230,30 300,10 360,80 L 310,350 Z" fill="#c69c6d" />
      <path d="M 70,350 L 30,120 C 80,60 130,70 175,70 C 220,70 270,60 320,120 L 280,350 Z" fill="#d4aa78" filter="drop-shadow(0px 10px 10px rgba(0,0,0,0.1))" />
    </svg>
  );

  const kraftFront = (
    <svg width="350" height="300" viewBox="0 0 350 300" className="absolute bottom-0 z-30 drop-shadow-2xl pointer-events-none">
      <defs>
        <filter id="shadowKraft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="-6" stdDeviation="10" floodOpacity="0.25"/>
        </filter>
        <pattern id="kraftTexture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.03)" />
        </pattern>
      </defs>
      
      {/* Front Wrap */}
      <path d="M 20,40 C 80,150 120,200 140,300 L 210,300 C 230,200 270,150 330,40 C 260,110 190,130 175,130 C 160,130 90,110 20,40 Z" fill="#e2b989" filter="url(#shadowKraft)"/>
      <path d="M 20,40 C 80,150 120,200 140,300 L 210,300 C 230,200 270,150 330,40 C 260,110 190,130 175,130 C 160,130 90,110 20,40 Z" fill="url(#kraftTexture)"/>

      {/* Crinkled edges */}
      <path d="M -10,90 Q 50,150 130,250 L 140,300 L 50,300 Z" fill="#d4aa78" filter="url(#shadowKraft)"/>
      <path d="M 360,90 Q 300,150 220,250 L 210,300 L 300,300 Z" fill="#d4aa78" filter="url(#shadowKraft)"/>

      {/* Twine Wrap */}
      <path d="M 130,210 C 160,215 190,215 220,210 L 215,225 C 185,230 165,230 135,225 Z" fill="#784b28" />
      <path d="M 130,205 C 160,210 190,210 220,205 L 215,220 C 185,225 165,225 135,220 Z" fill="#8b5a2b" />
      
      {/* Twine Bow */}
      <path d="M 175,215 C 130,190 140,240 170,220" fill="none" stroke="#8b5a2b" strokeWidth="4" />
      <path d="M 175,215 C 220,190 210,240 180,220" fill="none" stroke="#8b5a2b" strokeWidth="4" />
      
      {/* Twine Tails */}
      <path d="M 172,218 Q 150,260 140,290" fill="none" stroke="#8b5a2b" strokeWidth="3" />
      <path d="M 178,218 Q 200,260 210,290" fill="none" stroke="#8b5a2b" strokeWidth="3" />
      
      <circle cx="175" cy="215" r="4" fill="#653d1f" />
    </svg>
  );

  return (
    <div className="relative flex h-[500px] w-[350px] flex-col items-center justify-end">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-end justify-center"
      >
        {isModern ? modernBack : isKraft ? kraftBack : classicBack}
      </motion.div>

      <div className="relative z-10 mb-48 flex w-full items-end justify-center">
        {children}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 z-30 flex h-[300px] w-full items-end justify-center pointer-events-none"
      >
        {isModern ? modernFront : isKraft ? kraftFront : classicFront}
      </motion.div>
    </div>
  );
}
