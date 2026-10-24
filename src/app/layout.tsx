import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "The Internet Museum of Bad Decisions", template: "%s | Internet Museum of Bad Decisions" },
  description: "Preserving humanity's finest moments of questionable judgment.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { title: "The Internet Museum of Bad Decisions", description: "Humanity has museums for its greatest achievements. We built one for its worst decisions.", type: "website" }
};

function Brand() {
  return <Link className="brand" href="/" aria-label="Internet Museum home"><span className="brand-stamp">♜</span><span>THE INTERNET MUSEUM<br/>OF BAD DECISIONS</span></Link>;
}
export function SiteHeader() {
  return <><header className="site-header"><Brand/><nav className="nav" aria-label="Main navigation"><Link href="/museum">The Museum</Link><Link href="/hall-of-shame">Hall of Shame</Link><Link href="/about">Our Story</Link><Link href="/submit" className="nav-cta">Donate an Exhibit&nbsp; ↗</Link></nav><button className="mobile-menu" aria-label="Open menu" onClick={() => document.querySelector(".mobile-bar")?.classList.toggle("open")}>☰</button></header><nav className="mobile-bar" aria-label="Mobile navigation"><Link href="/museum">The Museum</Link><Link href="/hall-of-shame">Hall of Shame</Link><Link href="/about">Our Story</Link><Link href="/submit">Donate an Exhibit ↗</Link></nav></>;
}
export function SiteFooter() {
  return <footer className="footer"><div className="footer-top"><Brand/><nav className="footer-nav"><Link href="/museum">The Museum</Link><Link href="/submit">Donate an Exhibit</Link><Link href="/about">Our Story</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Guidelines</Link></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} THE INTERNET MUSEUM OF BAD DECISIONS</span><span>AN INSTITUTION OF QUESTIONABLE IMPORTANCE</span></div></footer>;
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader/><main>{children}</main><SiteFooter/></body></html>;
}
