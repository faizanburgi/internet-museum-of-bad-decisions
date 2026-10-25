import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = localFont({ src: "../../public/fonts/dm-sans-latin.woff2", variable: "--font-dm-sans", display: "swap", weight: "400 700" });
const fraunces = localFont({ src: "../../public/fonts/fraunces-latin.woff2", variable: "--font-fraunces", display: "swap", weight: "400 700" });
const frauncesItalic = localFont({ src: "../../public/fonts/fraunces-italic-latin.woff2", variable: "--font-fraunces-italic", display: "swap", weight: "400", style: "italic" });

export const metadata: Metadata = {
  title: { default: "The Internet Museum of Bad Decisions", template: "%s | Internet Museum of Bad Decisions" },
  description: "Preserving humanity's finest moments of questionable judgment.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { title: "The Internet Museum of Bad Decisions", description: "Humanity has museums for its greatest achievements. We built one for its worst decisions.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${dmSans.variable} ${fraunces.variable} ${frauncesItalic.variable}`}><SiteHeader/><main>{children}</main><SiteFooter/></body></html>;
}
