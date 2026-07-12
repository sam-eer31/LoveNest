import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'Sakura' | 'Moonlight' | 'Galaxy' | 'Cafe' | 'Vintage' | 'Ocean' | 'Pastel' | 'Storybook' | 'Rain' | 'Clouds' | 'Anime' | 'Christmas' | 'Minimal' | 'Dark Romance';

export type JourneyPage = 'The Invitation' | 'Letter' | 'Memory Album' | 'Flower Garden' | 'Mini Game' | 'Gift Box' | 'Date Timeline' | 'Countdown';

export interface DateTimelineItem {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  emoji: string;
}

export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface Flower {
  id: string;
  type: string;
  x: number;
  y: number;
}

export interface CreatorState {
  // Step 1: Basic Info
  receiverName: string;
  nickname: string;
  relationship: string;
  emoji: string;
  
  // Step 2: Theme
  theme: Theme;
  
  // Step 3: Journey Pages
  journeyOrder: JourneyPage[];
  
  // Date Timeline
  timeline: DateTimelineItem[];
  
  // Letter
  letterContent: string;

  // Memory Album
  photos: MemoryPhoto[];

  // Flower Garden
  flowers: Flower[];
  bouquetWrapper: string;
  customWrapperConfigs: Record<string, { flowerMaskUrl?: string, frontMaskUrl?: string, visibleMaskUrl?: string, shadingMaskUrl?: string, flowerPositions?: { x: number, y: number }[], scale?: number }>;
  wrappers: { id: string; label: string; url: string; ext: string }[];
  flowersList: { id: string; label: string; url: string }[];

  // Gift Box
  giftLink: string;
  giftMessage: string;
  giftType: 'coupons' | 'scratch' | 'playlist';
  giftCoupons: { id: string; title: string; description: string; emoji: string }[];
  giftScratchMessage: string;
  giftPlaylistUrl: string;
  giftSongs: { id: string; name: string; url: string }[];

  // Countdown
  targetDate: string; // ISO string

  // Actions
  updateBasicInfo: (info: Partial<Pick<CreatorState, 'receiverName' | 'nickname' | 'relationship' | 'emoji'>>) => void;
  setTheme: (theme: Theme) => void;
  setJourneyOrder: (order: JourneyPage[]) => void;
  setTimeline: (timeline: DateTimelineItem[]) => void;
  setLetterContent: (content: string) => void;
  setPhotos: (photos: MemoryPhoto[]) => void;
  setFlowers: (flowers: Flower[]) => void;
  setBouquetWrapper: (wrapper: string) => void;
  setCustomWrapperConfig: (wrapperId: string, config: Partial<{ flowerMaskUrl?: string, frontMaskUrl?: string, visibleMaskUrl?: string, shadingMaskUrl?: string, flowerPositions?: { x: number, y: number }[], scale?: number }>) => void;
  addWrapper: (wrapper: { id: string; label: string; url: string; ext: string }) => void;
  deleteWrapper: (id: string) => void;
  addFlowerOption: (flower: { id: string; label: string; url: string }) => void;
  deleteFlowerOption: (id: string) => void;
  setGift: (link: string, message: string) => void;
  setGiftType: (type: 'coupons' | 'scratch' | 'playlist') => void;
  setGiftCoupons: (coupons: { id: string; title: string; description: string; emoji: string }[]) => void;
  setGiftScratchMessage: (message: string) => void;
  setGiftPlaylistUrl: (url: string) => void;
  setGiftSongs: (songs: { id: string; name: string; url: string }[]) => void;
  setTargetDate: (date: string) => void;
  reset: () => void;
}

const defaultWrappers = [
  { id: "classic", label: "Classic Elegance", url: "/bouquets/wrapper_classic.svg", ext: "svg" },
  { id: "modern", label: "Modern Edge", url: "/bouquets/wrapper_modern.svg", ext: "svg" },
  { id: "kraft", label: "Rustic Kraft", url: "/bouquets/wrapper_kraft.svg", ext: "svg" },
  { id: "main", label: "Sweet Satin", url: "/bouquets/wrapper_main.png", ext: "png" },
  { id: "paper", label: "Vintage Paper", url: "/bouquets/wrapper_paper.png", ext: "png" },
  { id: "2", label: "Blushing Ribbon", url: "/bouquets/wrapper_2.png", ext: "png" }
];

const defaultFlowers = [
  { id: "tulip", label: "Tulip", url: "/flowers/tulip.svg" },
  { id: "rose", label: "Rose", url: "/flowers/rose.svg" },
  { id: "sunflower", label: "Sunflower", url: "/flowers/sunflower.svg" },
  { id: "cherry", label: "Cherry", url: "/flowers/cherry_blossom.svg" },
  { id: "hibiscus", label: "Hibiscus", url: "/flowers/hibiscus.svg" },
  { id: "blossom", label: "Blossom", url: "/flowers/blossom.svg" },
  { id: "lotus", label: "Lotus", url: "/flowers/lotus.png" }
];

const initialState = {
  receiverName: '',
  nickname: '',
  relationship: '',
  emoji: '',
  theme: 'Sakura' as Theme,
  journeyOrder: ['The Invitation', 'Letter'] as JourneyPage[],
  timeline: [],
  letterContent: '',
  photos: [],
  flowers: [],
  bouquetWrapper: 'classic',
  customWrapperConfigs: {},
  wrappers: defaultWrappers,
  flowersList: defaultFlowers,
  giftLink: '',
  giftMessage: '',
  giftType: 'coupons' as 'coupons' | 'scratch' | 'playlist',
  giftCoupons: [
    { id: "1", title: "Candlelit Dinner", description: "I will cook your favorite meal, complete with candles and music.", emoji: "" },
    { id: "2", title: "Late Night Ice Cream", description: "A midnight trip to grab ice cream, my treat!", emoji: "" },
    { id: "3", title: "Warm Massage", description: "A relaxing 30-minute massage whenever you're tired.", emoji: "" }
  ],
  giftScratchMessage: 'I promise to take you on a surprise weekend getaway!',
  giftPlaylistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX7gIoKXt0gpf',
  giftSongs: [] as { id: string; name: string; url: string }[],
  targetDate: '',
};

export const useCreatorStore = create<CreatorState>()(
  persist(
    (set) => ({
      ...initialState,
      
      updateBasicInfo: (info) => set((state) => ({ ...state, ...info })),
      setTheme: (theme) => set({ theme }),
      setJourneyOrder: (journeyOrder) => set({ journeyOrder }),
      setTimeline: (timeline) => set({ timeline }),
      setLetterContent: (letterContent) => set({ letterContent }),
      setPhotos: (photos) => set({ photos }),
      setFlowers: (flowers) => set({ flowers }),
      setBouquetWrapper: (wrapper) => set({ bouquetWrapper: wrapper }),
      setCustomWrapperConfig: (wrapperId, config) => set((state) => ({ 
        customWrapperConfigs: { 
          ...state.customWrapperConfigs, 
          [wrapperId]: { 
            ...state.customWrapperConfigs[wrapperId], 
            ...config 
          } 
        } 
      })),
      addWrapper: (wrapper) => set((state) => ({
        wrappers: [...state.wrappers.filter(w => w.id !== wrapper.id), wrapper]
      })),
      deleteWrapper: (id) => set((state) => ({
        wrappers: state.wrappers.filter(w => w.id !== id)
      })),
      addFlowerOption: (flower) => set((state) => ({
        flowersList: [...state.flowersList.filter(f => f.id !== flower.id), flower]
      })),
      deleteFlowerOption: (id) => set((state) => ({
        flowersList: state.flowersList.filter(f => f.id !== id)
      })),
      setGift: (link, message) => set({ giftLink: link, giftMessage: message }),
      setGiftType: (giftType) => set({ giftType }),
      setGiftCoupons: (giftCoupons) => set({ giftCoupons }),
      setGiftScratchMessage: (giftScratchMessage) => set({ giftScratchMessage }),
      setGiftPlaylistUrl: (giftPlaylistUrl) => set({ giftPlaylistUrl }),
      setGiftSongs: (giftSongs) => set({ giftSongs }),
      setTargetDate: (targetDate) => set({ targetDate }),
      reset: () => set(initialState),
    }),
    {
      name: 'lovenest-creator-storage', // name of the item in the storage (must be unique)
    }
  )
);
