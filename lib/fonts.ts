import { Caveat, Fredoka, Poppins, Inter } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], weight: "variable" });
// export const krona = Poppins({
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
// });

export const fredoka = Fredoka({ subsets: ["latin"], weight: ["400"] });
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const caveat = Caveat({
  subsets: ["latin"],
});
