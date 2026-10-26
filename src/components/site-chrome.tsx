import Link from "next/link";

function Brand() {
  return <Link className="brand" href="/" aria-label="Internet Museum home"><span className="brand-stamp" aria-hidden="true">♜</span><span>THE INTERNET MUSEUM<br/>OF BAD DECISIONS</span></Link>;
}

export function SiteHeader() {
  return <><header className="site-header"><Brand/><nav className="nav" aria-label="Main navigation"><Link href="/museum">Browse Stories</Link><Link href="/hall-of-shame">Community Favorites</Link><Link href="/about">About</Link><Link href="/submit" className="nav-cta">Submit a Story&nbsp; ↗</Link></nav></header><nav className="mobile-bar" aria-label="Mobile navigation"><Link href="/museum">Browse Stories</Link><Link href="/hall-of-shame">Community Favorites</Link><Link href="/about">About</Link><Link href="/submit">Submit a Story ↗</Link></nav></>;
}

export function SiteFooter() {
  return <footer className="footer"><div className="footer-top"><Brand/><nav className="footer-nav"><Link href="/museum">Browse Stories</Link><Link href="/submit">Submit a Story</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Guidelines</Link></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} THE INTERNET MUSEUM OF BAD DECISIONS</span><span>AN INSTITUTION OF QUESTIONABLE IMPORTANCE</span></div></footer>;
}
