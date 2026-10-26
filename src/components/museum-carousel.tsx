"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ExhibitCard } from "@/components/exhibit-card";
import type { Category } from "@/lib/categories";
import type { Exhibit } from "@/lib/supabase";

const slideNames = ["Welcome", "Featured story", "Browse departments", "Latest stories", "How it works"];

export function MuseumCarousel({ exhibits, categories }: { exhibits: Exhibit[]; categories: readonly Category[] }) {
  const [active, setActive] = useState(0);
  const [pointerStart, setPointerStart] = useState<number | null>(null);
  const move = useCallback((direction: number) => setActive((current) => (current + direction + slideNames.length) % slideNames.length), []);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if (event.key === "Home") { event.preventDefault(); setActive(0); }
    if (event.key === "End") { event.preventDefault(); setActive(slideNames.length - 1); }
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    if (pointerStart === null) return;
    const distance = event.clientX - pointerStart;
    if (Math.abs(distance) > 55) move(distance < 0 ? 1 : -1);
    setPointerStart(null);
  }

  const feature = exhibits[0];

  return <section className="museum-carousel" aria-label="Museum highlights" aria-roledescription="carousel" onKeyDown={onKeyDown} onPointerDown={(event) => setPointerStart(event.clientX)} onPointerUp={onPointerUp} onPointerCancel={() => setPointerStart(null)}>
    <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }} aria-live="polite">
      <div className="carousel-slide carousel-cover" role="group" aria-roledescription="slide" aria-label="1 of 5: The entrance" aria-hidden={active !== 0} inert={active !== 0}>
        <div className="cover-statement"><span className="eyebrow">WELCOME TO THE INTERNET MUSEUM OF BAD DECISIONS</span><p>A grand gallery of everyday mistakes—<br/>and the stories behind them.<br/>Sir Regret promises not to judge. Much.</p></div>
        <div className="hero-art" aria-label="Sir Regret, the museum's marble bust mascot"><svg className="regret-orbit" viewBox="0 0 900 620" role="presentation" aria-hidden="true"><path className="orbit-line" d="M66 520C165 510 210 460 159 423 115 390 136 352 245 356c130 5 210-6 179-48-25-34-114-25-156-53-51-34 3-74 142-71 151 4 245-9 205-49-28-28-92-22-103-61-8-29 27-48 90-50"/><g className="orbit-points"><circle cx="158" cy="423" r="12"/><circle cx="424" cy="308" r="12"/><circle cx="410" cy="184" r="12"/><circle cx="612" cy="75" r="12"/><circle cx="670" cy="552" r="12"/></g><g className="orbit-sparks"><path d="M141 394v-22m-19 42-16-12m52-14 15-18M405 278v-20m-17 49-20-6m52-29 15-16M394 158v-22m-18 42-16-12m52-14 15-18M596 48V28m-18 38-17-12m50-13 15-17M654 524v-22m-18 42-17-12m51-14 15-18"/></g></svg><div className="arch"/><div className="bust"><Image src="/art/sir-regret.svg" alt="" aria-hidden="true" width={400} height={480} priority/></div><div className="bust-caption"><strong>Sir Regret</strong><span>Curator Emeritus · Unimpressed</span></div><div className="floating-note note-one" aria-hidden="true">hmm.</div><div className="floating-note note-two" aria-hidden="true">A bold choice.</div></div>
        <h1 className="cover-title">BAD DECISIONS</h1><span className="cover-index">USE ARROWS OR SWIPE TO EXPLORE · 01 / 05</span>
        <nav className="corner-nav" aria-label="Museum rooms"><button className="corner-link corner-projects" onClick={() => setActive(3)}><b>01</b><small>ROOM 04</small><span>Latest stories</span></button><button className="corner-link corner-experience" onClick={() => setActive(2)}><b>02</b><small>ROOM 03</small><span>Departments</span></button><button className="corner-link corner-profile" onClick={() => setActive(4)}><b>03</b><small>ROOM 05</small><span>How it works</span></button><Link className="corner-link corner-contact" href="/submit"><b>04</b><small>YOUR TURN</small><span>Submit a story</span></Link></nav>
      </div>

      <div className="carousel-slide carousel-feature" role="group" aria-roledescription="slide" aria-label="2 of 5: Featured exhibit" aria-hidden={active !== 1} inert={active !== 1}>
        <div className="slide-heading"><span className="eyebrow section-label">A story from the collection</span><span className="slide-room">ROOM 02 · CURATOR&apos;S PICK</span></div>
        <h2 className="serif">Featured story</h2>
        {feature ? <article className="featured"><div className="featured-visual"><span className="featured-art"/><div className="plaque">EXHIBIT NO. {String(feature.exhibit_number).padStart(4,"0")}</div></div><div className="featured-copy"><div className="meta">A noteworthy lapse · Official museum archive</div><h3>{feature.curated_title}</h3><p>{feature.curated_description}</p><div className="featured-foot"><span>Preserved for future generations</span><Link className="text-link" href={`/exhibit/${feature.id}`}>Inspect exhibit →</Link></div></div></article> : <div className="carousel-empty"><strong>The first exhibit is still making its way through history.</strong><span>Sir Regret has prepared a plaque and is trying to look patient.</span><Link className="text-link" href="/submit">Donate the inaugural exhibit →</Link></div>}
      </div>

      <div className="carousel-slide carousel-departments" role="group" aria-roledescription="slide" aria-label="3 of 5: Departments" aria-hidden={active !== 2} inert={active !== 2}>
        <div className="slide-heading"><span className="eyebrow section-label">Browse by subject</span><span className="slide-room">ROOM 03 · PICK A TOPIC</span></div><h2 className="serif">Browse departments</h2>
        <div className="department-grid carousel-department-grid">{categories.map((item) => <Link key={item.slug} href={`/gallery/${item.slug}`} className="department"><span className="department-icon">{item.icon}</span><h3>{item.short}</h3><p>{item.description}</p><div className="department-count">ENTER DEPARTMENT&nbsp; ↗</div></Link>)}</div>
        <Link className="text-link all-galleries" href="/museum">View the complete collection →</Link>
      </div>

      <div className="carousel-slide carousel-recent" role="group" aria-roledescription="slide" aria-label="4 of 5: Recent acquisitions" aria-hidden={active !== 3} inert={active !== 3}>
        <div className="slide-heading"><span className="eyebrow section-label">Newly approved by our curator</span><span className="slide-room">ROOM 04 · LATEST STORIES</span></div><h2 className="serif">Recent museum stories</h2>
        {exhibits.length ? <div className="recent-list carousel-exhibits">{exhibits.slice(0,3).map((item) => <ExhibitCard key={item.id} exhibit={item}/>)}</div> : <div className="carousel-empty"><strong>The galleries are suspiciously quiet.</strong><span>Be the first to donate a story to the public archive.</span><Link className="text-link" href="/submit">Make questionable history →</Link></div>}
        <Link className="text-link all-galleries" href="/hall-of-shame">See the community favorites →</Link>
      </div>

      <div className="carousel-slide carousel-visit" role="group" aria-roledescription="slide" aria-label="5 of 5: Visit or contribute" aria-hidden={active !== 4} inert={active !== 4}>
        <div className="visit-copy"><span className="eyebrow">ROOM 05 · HOW THE MUSEUM WORKS</span><h2 className="serif">Your everyday mistake could become museum history.</h2><p>Share a story about a harmless everyday mishap. Submit it anonymously or add a display name. A human curator reviews every submission; if approved, it becomes a public exhibit for everyone to read and react to.</p><ol className="museum-steps"><li><b>1</b><span><strong>Tell us what happened</strong><small>Leave out private details and names.</small></span></li><li><b>2</b><span><strong>Our curator reviews it</strong><small>Your story stays private while it is pending.</small></span></li><li><b>3</b><span><strong>Read it in the museum</strong><small>Approved stories appear as public exhibits.</small></span></li></ol><div className="actions"><Link className="button button-gold" href="/submit">Share your story →</Link><Link className="button button-outline" href="/hall-of-shame">See community favorites</Link></div><Link className="visit-about" href="/about">About the museum →</Link></div>
        <div className="visit-aside"><div className="visit-quote">“Another remarkable contribution to human disappointment.”</div><Image src="/art/sir-regret.svg" alt="" aria-hidden="true" width={400} height={480}/><span>— Sir Regret, Curator Emeritus</span></div>
        <div className="visit-links"><Link href="/privacy">Privacy</Link><Link href="/terms">Guidelines</Link><span>© {new Date().getFullYear()} THE INTERNET MUSEUM OF BAD DECISIONS</span></div>
      </div>
    </div>

    <div className="carousel-controls"><div className="carousel-dots" aria-label="Choose a museum room">{slideNames.map((name, index) => <button key={name} type="button" className={`carousel-dot${active === index ? " is-active" : ""}`} aria-label={`Go to ${name}`} aria-current={active === index ? "step" : undefined} onClick={() => setActive(index)}/>)}</div><span className="carousel-count">0{active + 1} <i>/</i> 0{slideNames.length}</span><div className="carousel-arrows"><button type="button" aria-label="Previous room" onClick={() => move(-1)}>←</button><button type="button" aria-label="Next room" onClick={() => move(1)}>→</button></div></div>
  </section>;
}
