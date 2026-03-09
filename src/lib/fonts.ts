import { Playfair_Display, DM_Sans, Poppins } from "next/font/google";

export const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const dmSans = DM_Sans({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
