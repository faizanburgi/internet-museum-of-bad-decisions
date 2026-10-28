"use client";

import Link from "next/link";
import { useCallback, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ExhibitCard } from "@/components/exhibit-card";
import type { Category } from "@/lib/categories";
import type { Exhibit } from "@/lib/supabase";

const slideNames = ["Welcome", "Featured story", "Departments", "Latest stories", "Your turn"];
const curatorVerdicts = [
  "A bold choice. History will be baffled.",
  "The plaque says: seemed like a good idea.",
  "Remarkable. In the geological sense.",
  "We have questions. The museum has a frame.",
  "A small mistake with excellent museum energy."
];

export function MuseumCarousel({ exhibits, categories }: { exhibits: Exhibit[]; categories: readonly Category[] }) {
  const [active, setActive] = useState(0);
  const [verdict, setVerdict] = useState(0);
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
      <div className="carousel-slide carousel-cover" role="group" aria-roledescription="slide" aria-label="1 of 5: Welcome" aria-hidden={active !== 0} inert={active !== 0}>
        <div className="cover-statement"><span className="eyebrow">WELCOME TO THE INTERNET MUSEUM OF BAD DECISIONS</span><p>Everyday mishaps. Museum-level drama.</p></div>
        <div className="verdict-console"><span className="eyebrow">SIR REGRET&apos;S VERDICT</span><p aria-live="polite">{curatorVerdicts[verdict]}</p><button type="button" onClick={() => setVerdict((current) => (current + 1) % curatorVerdicts.length)}>Get Sir Regret&apos;s verdict <span aria-hidden="true">↻</span></button></div>
        <h1 className="cover-title">BAD DECISIONS</h1><span className="cover-index">USE ARROWS OR SWIPE TO EXPLORE · 01 / 05</span>
        <nav className="corner-nav" aria-label="Museum rooms"><button className="corner-link corner-projects" onClick={() => setActive(3)}><b>01</b><small>ROOM 04</small><span>Latest stories</span></button><button className="corner-link corner-experience" onClick={() => setActive(2)}><b>02</b><small>ROOM 03</small><span>Departments</span></button><button className="corner-link corner-profile" onClick={() => setActive(4)}><b>03</b><small>ROOM 05</small><span>Your turn</span></button><Link className="corner-link corner-contact" href="/submit"><b>04</b><small>YOUR TURN</small><span>Submit a story</span></Link></nav>
      </div>

      <div className="carousel-slide carousel-feature" role="group" aria-roledescription="slide" aria-label="2 of 5: Featured exhibit" aria-hidden={active !== 1} inert={active !== 1}>
        <div className="slide-heading"><span className="eyebrow section-label">Curator&apos;s pick</span><span className="slide-room">ROOM 02</span></div>
        <h2 className="serif">Featured story</h2>
        {feature ? <article className="featured"><div className="featured-visual"><span className="featured-art" aria-hidden="true">☕</span><div className="plaque">EXHIBIT NO. {String(feature.exhibit_number).padStart(4,"0")}</div></div><div className="featured-copy"><h3>{feature.curated_title}</h3><p>{feature.curated_description}</p><div className="featured-foot"><span>Approved story</span><Link className="text-link" href={"/exhibit/" + feature.id}>Read story →</Link></div></div></article> : <div className="carousel-empty"><strong>No stories on display yet.</strong><Link className="text-link" href="/submit">Submit the first story →</Link></div>}
      </div>

      <div className="carousel-slide carousel-departments" role="group" aria-roledescription="slide" aria-label="3 of 5: Departments" aria-hidden={active !== 2} inert={active !== 2}>
        <div className="slide-heading"><span className="eyebrow section-label">Browse by subject</span><span className="slide-room">ROOM 03 · PICK A TOPIC</span></div><h2 className="serif">Browse departments</h2>
        <div className="department-grid carousel-department-grid">{categories.map((item) => <Link key={item.slug} href={`/gallery/${item.slug}`} className="department"><span className="department-icon">{item.icon}</span><h3>{item.short}</h3><p>{item.description}</p><div className="department-count">ENTER DEPARTMENT&nbsp; ↗</div></Link>)}</div>
        <Link className="text-link all-galleries" href="/museum">View the complete collection →</Link>
      </div>

      <div className="carousel-slide carousel-recent" role="group" aria-roledescription="slide" aria-label="4 of 5: Recent acquisitions" aria-hidden={active !== 3} inert={active !== 3}>
        <div className="slide-heading"><span className="eyebrow section-label">Latest stories</span><span className="slide-room">ROOM 04</span></div><h2 className="serif">Fresh from the gallery</h2>
        {exhibits.length ? <div className="recent-list carousel-exhibits">{exhibits.slice(0,3).map((item) => <ExhibitCard key={item.id} exhibit={item}/>)}</div> : <div className="carousel-empty"><strong>The gallery is quiet.</strong><Link className="text-link" href="/submit">Add a story →</Link></div>}
        <Link className="text-link all-galleries" href="/hall-of-shame">See the community favorites →</Link>
      </div>

      <div className="carousel-slide carousel-visit" role="group" aria-roledescription="slide" aria-label="5 of 5: Your turn" aria-hidden={active !== 4} inert={active !== 4}>
        <div className="visit-copy"><span className="eyebrow">ROOM 05 · YOUR TURN</span><h2 className="serif">Got a story for the museum?</h2><p>Send it in. Sir Regret will review it, with great seriousness.</p><div className="actions"><Link className="button button-gold" href="/submit">Submit a story →</Link><Link className="button button-outline" href="/about">About the museum</Link></div></div>
        <div className="visit-links"><Link href="/privacy">Privacy</Link><Link href="/terms">Guidelines</Link><span>© {new Date().getFullYear()} THE INTERNET MUSEUM OF BAD DECISIONS</span></div>
      </div>
    </div>

    <div className="carousel-controls"><div className="carousel-dots" aria-label="Choose a museum room">{slideNames.map((name, index) => <button key={name} type="button" className={`carousel-dot${active === index ? " is-active" : ""}`} aria-label={`Go to ${name}`} aria-current={active === index ? "step" : undefined} onClick={() => setActive(index)}/>)}</div><span className="carousel-count">0{active + 1} <i>/</i> 0{slideNames.length}</span><div className="carousel-arrows"><button type="button" aria-label="Previous room" onClick={() => move(-1)}>←</button><button type="button" aria-label="Next room" onClick={() => move(1)}>→</button></div></div>
  </section>;
}
