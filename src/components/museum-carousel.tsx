"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ExhibitCard } from "@/components/exhibit-card";
import type { Category } from "@/lib/categories";
import type { Exhibit } from "@/lib/supabase";

const rooms = ["Welcome", "Curator’s pick", "Departments", "New arrivals", "Contribute"];
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
  const move = useCallback((direction: number) => setActive((current) => (current + direction + rooms.length) % rooms.length), []);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if (event.key === "Home") { event.preventDefault(); setActive(0); }
    if (event.key === "End") { event.preventDefault(); setActive(rooms.length - 1); }
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    if (pointerStart === null) return;
    const distance = event.clientX - pointerStart;
    if (Math.abs(distance) > 55) move(distance < 0 ? 1 : -1);
    setPointerStart(null);
  }

  const feature = exhibits[0];
  const latest = exhibits.length > 1 ? exhibits.slice(1, 4) : exhibits.slice(0, 3);

  return (
    <section
      className="museum-carousel storybook-carousel"
      aria-label="Explore the Internet Museum of Bad Decisions"
      aria-roledescription="carousel"
      onKeyDown={onKeyDown}
      onPointerDown={(event) => setPointerStart(event.clientX)}
      onPointerUp={onPointerUp}
      onPointerCancel={() => setPointerStart(null)}
    >
      <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
        <div className="carousel-slide carousel-cover storybook-room welcome-room" role="group" aria-roledescription="slide" aria-label="1 of 5: Welcome" aria-hidden={active !== 0} inert={active !== 0}>
          <div className="welcome-copy">
            <span className="storybook-kicker">THE INTERNET MUSEUM OF BAD DECISIONS</span>
            <h1>A museum for the things we probably shouldn’t have done.</h1>
            <p>Real-life mishaps, lovingly framed. Browse the exhibits or send in one of your own.</p>
            <div className="storybook-actions">
              <button className="story-button story-button-primary" type="button" onClick={() => setActive(1)}>Step inside <span aria-hidden="true">↗</span></button>
              <Link className="story-button story-button-secondary" href="/submit">Donate a story</Link>
            </div>
            <div className="verdict-note">
              <span className="verdict-stamp" aria-hidden="true">SR</span>
              <div><span className="storybook-kicker">SIR REGRET’S VERDICT</span><p aria-live="polite" aria-atomic="true">{curatorVerdicts[verdict]}</p></div>
              <button type="button" aria-label="Get another Sir Regret verdict" onClick={() => setVerdict((current) => (current + 1) % curatorVerdicts.length)}>Again? <span aria-hidden="true">↻</span></button>
            </div>
          </div>
          <div className="welcome-art" aria-hidden="true">
            <Image className="museum-front-art" src="/art/storybook/museum-front.svg" alt="" fill priority sizes="(max-width: 700px) 90vw, 52vw" />
            <figure className="archive-print archive-print-globe"><Image src="/art/archives/globe-mapping-instruments.jpg" alt="" fill sizes="180px" /><figcaption>An old map for our many wrong turns</figcaption></figure>
            <span className="welcome-spark spark-one">✳</span><span className="welcome-spark spark-two">✴</span>
            <div className="welcome-ticket"><span>ADMIT ONE</span><b>to the gallery<br/>of “oh no”</b><small>NO REFUNDS ON REGRETS</small></div>
          </div>
          <span className="room-number">01 <i>—</i> THE FRONT DOOR</span>
        </div>

        <div className="carousel-slide storybook-room feature-room" role="group" aria-roledescription="slide" aria-label="2 of 5: Curator’s pick" aria-hidden={active !== 1} inert={active !== 1}>
          <div className="room-intro"><span className="storybook-kicker">ROOM 02 · ONE FOR THE FRAME</span><h2>Curator’s pick</h2><p>A tiny triumph of questionable judgment, selected for posterity.</p></div>
          {feature ? <article className="storybook-feature"><div className="feature-artwell"><Image src="/art/storybook/featured-teacup.svg" alt="" fill sizes="(max-width: 700px) 84vw, 40vw" /><div className="feature-number">EXHIBIT {String(feature.exhibit_number).padStart(4, "0")}</div></div><div className="feature-plaque"><span className="plaque-kicker">A RECENTLY PRESERVED INCIDENT</span><h3>{feature.curated_title}</h3><p>{feature.curated_description}</p><div className="plaque-footer"><span>{feature.is_anonymous ? "Anonymous donor" : feature.public_display_name || "A museum visitor"}</span><Link href={`/exhibit/${feature.id}`}>Read the story <span aria-hidden="true">↗</span></Link></div></div></article> : <div className="storybook-empty"><Image src="/art/storybook/featured-teacup.svg" alt="" width={210} height={190} /><div><span className="storybook-kicker">THE GALLERY IS WAITING</span><h3>There’s room for the first exhibit.</h3><p>Share a harmless mishap and give it a frame.</p><Link className="story-button story-button-primary" href="/submit">Submit a story ↗</Link></div></div>}
          <span className="room-number">02 <i>—</i> THE LITTLE INCIDENT</span>
        </div>

        <div className="carousel-slide storybook-room departments-room" role="group" aria-roledescription="slide" aria-label="3 of 5: Departments" aria-hidden={active !== 2} inert={active !== 2}>
          <div className="room-intro room-intro-centered"><span className="storybook-kicker">ROOM 03 · FIND YOUR WING</span><h2>Pick a department</h2><p>Every variety of “what was I thinking?” has a place here.</p></div>
          <div className="department-map-art" aria-hidden="true"><Image src="/art/storybook/department-map.svg" alt="" fill sizes="100vw" /></div>
          <div className="storybook-department-grid">{categories.map((item, index) => <Link key={item.slug} href={`/gallery/${item.slug}`} className={`storybook-department department-tone-${index % 4}`}>
            {item.slug === "kitchen-disasters" ? <span className="department-archive-art"><Image src="/art/archives/kitchen-1842.jpg" alt="" fill sizes="120px" /></span> : <span className="department-doodle" aria-hidden="true">{item.icon}</span>}
            <span className="department-title">{item.short}</span><span className="department-enter" aria-hidden="true">↗</span>
          </Link>)}</div>
          <Link className="storybook-text-link" href="/museum">See the whole collection <span aria-hidden="true">→</span></Link>
          <span className="room-number">03 <i>—</i> THE DEPARTMENT MAP</span>
        </div>

        <div className="carousel-slide storybook-room arrivals-room" role="group" aria-roledescription="slide" aria-label="4 of 5: New arrivals" aria-hidden={active !== 3} inert={active !== 3}>
          <div className="room-intro"><span className="storybook-kicker">ROOM 04 · FRESHLY FRAMED</span><h2>New arrivals</h2><p>Fresh from the archive. Still a little hard to believe.</p></div>
          <div className="arrivals-shelf-art" aria-hidden="true"><Image src="/art/storybook/curiosity-shelf.svg" alt="" fill sizes="(max-width: 700px) 90vw, 45vw" /></div>
          {latest.length ? <div className="storybook-arrivals">{latest.map((item) => <ExhibitCard key={item.id} exhibit={item} />)}</div> : <div className="storybook-empty arrivals-empty"><span className="storybook-kicker">NO NEW ARRIVALS (YET)</span><h3>The display case is suspiciously tidy.</h3><Link className="storybook-text-link" href="/submit">Help mess it up <span aria-hidden="true">→</span></Link></div>}
          <Link className="storybook-text-link arrivals-more" href="/hall-of-shame">Visit the community favorites <span aria-hidden="true">→</span></Link>
          <span className="room-number">04 <i>—</i> THE CURIOSITY CABINET</span>
        </div>

        <div className="carousel-slide storybook-room contribute-room" role="group" aria-roledescription="slide" aria-label="5 of 5: Contribute" aria-hidden={active !== 4} inert={active !== 4}>
          <div className="contribute-art" aria-hidden="true"><Image src="/art/storybook/contribution-desk.svg" alt="" fill sizes="(max-width: 700px) 90vw, 44vw" /></div>
          <div className="contribute-copy"><span className="storybook-kicker">ROOM 05 · DONATIONS ACCEPTED</span><h2>Made a small blunder? We have a drawer for that.</h2><p>Tell us what happened. Stay anonymous, if you like. The curator will take it from here.</p><div className="storybook-actions"><Link className="story-button story-button-primary" href="/submit">Give it a plaque <span aria-hidden="true">↗</span></Link><Link className="storybook-text-link" href="/about">How this museum works <span aria-hidden="true">→</span></Link></div></div>
          <div className="contribute-footnote"><span>NO ACCOUNT NEEDED</span><span>PRIVATE UNTIL REVIEWED</span><span>GOOD STORIES LIVE FOREVER</span></div>
          <span className="room-number">05 <i>—</i> THE DONATION DESK</span>
        </div>
      </div>

      <nav className="storybook-controls" aria-label="Museum rooms">
        <button className="story-arrow" type="button" aria-label="Previous room" onClick={() => move(-1)}>←</button>
        <div className="room-tabs">{rooms.map((name, index) => <button key={name} type="button" className={`room-tab${active === index ? " is-current" : ""}`} aria-label={`Go to ${name}`} aria-current={active === index ? "step" : undefined} onClick={() => setActive(index)}><span className="room-tab-number">0{index + 1}</span><span className="room-tab-name">{name}</span></button>)}</div>
        <span className="storybook-count">0{active + 1}<i> / </i>0{rooms.length}</span>
        <button className="story-arrow" type="button" aria-label="Next room" onClick={() => move(1)}>→</button>
      </nav>
    </section>
  );
}
