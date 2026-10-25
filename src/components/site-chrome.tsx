import Link from "next/link";

function Brand() {
  return <Link className="brand" href="/" aria-label="Internet Museum home"><span className="brand-stamp" aria-hidden="true">♜</span><span>THE INTERNET MUSEUM<br/>OF BAD DECISIONS</span></Link>;
}

export function SiteHeader() {
  return <><header className="site-header"><Brand/><nav className="nav" aria-label="Main navigation"><Link href="/museum">The Museum</Link><Link href="/hall-of-shame">Hall of Shame</Link><Link href="/about">Our Story</Link><Link href="/submit" className="nav-cta">Donate an Exhibit&nbsp; ↗</Link></nav></header><nav className="mobile-bar" aria-label="Mobile navigation"><Link href="/museum">The Museum</Link><Link href="/hall-of-shame">Hall of Shame</Link><Link href="/about">Our Story</Link><Link href="/submit">Donate an Exhibit ↗</Link></nav></>;
}

export function SiteFooter() {
  return <footer className="footer"><div className="footer-top"><Brand/><nav className="footer-nav"><Link href="/museum">The Museum</Link><Link href="/submit">Donate an Exhibit</Link><Link href="/about">Our Story</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Guidelines</Link></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} THE INTERNET MUSEUM OF BAD DECISIONS</span><span>AN INSTITUTION OF QUESTIONABLE IMPORTANCE</span></div></footer>;
}
