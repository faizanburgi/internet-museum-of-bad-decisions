import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "The Internet Museum of Bad Decisions", template: "%s | Internet Museum of Bad Decisions" },
  description: "Preserving humanity's finest moments of questionable judgment.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { title: "The Internet Museum of Bad Decisions", description: "Humanity has museums for its greatest achievements. We built one for its worst decisions.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader/><main>{children}</main><SiteFooter/></body></html>;
}
