/**
 * Approved founder videos from ArtyCry12/nfc-stands-site @ public/videos-1.
 * Exact GitHub filenames kept under public/videos/; ASCII aliases are symlinks.
 */
export const VIDEOS = {
  hero: {
    src: "/videos/hero-context-shift.mp4",
    original:
      "Product_display_across_changing_…_20261010123958.mp4",
    poster: "/media/posters/hero.jpg",
    role: "hero",
  },
  catalogue: {
    src: "/videos/catalogue-showcase.mp4",
    original: "Product_range_showcase_video_20261010124011.mp4",
    poster: "/media/posters/catalogue.jpg",
    role: "catalogue",
  },
  consultant: {
    src: "/videos/ai-consultant.mp4",
    original: "Conversational_AI_interface_moti…_20261010124005.mp4",
    poster: "/media/posters/ai-consultant.jpg",
    role: "consultant",
  },
  howNfc: {
    src: "/videos/how-nfc-works.mp4",
    original: "Smartphone_tapping_NFC_stand_20261010124017.mp4",
    poster: "/media/posters/how-nfc.jpg",
    role: "how-nfc",
  },
  nfcDemo: {
    src: "/videos/nfc-demo-real.mp4",
    original: "IMG_5953.MP4",
    poster: "/media/posters/nfc-demo.jpg",
    role: "nfc-demo",
  },
  padelPoint: {
    src: "/videos/padel-point-case.mov",
    original: "IMG_6235.MOV",
    poster: "/media/posters/padel-point.jpg",
    role: "case-padel",
  },
} as const;

export type VideoKey = keyof typeof VIDEOS;
