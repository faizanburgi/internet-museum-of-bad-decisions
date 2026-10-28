import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About the Museum" };

export default function AboutPage() {
  return (
    <div className="page-wrap">
      <div className="breadcrumb">THE MUSEUM / ABOUT</div>
      <h1 className="page-title">About the Museum</h1>
      <p className="page-intro">A grand home for the little mistakes that make us human.</p>
      <div className="about-copy about-sections">
        <section>
          <h2>What this place is</h2>
          <p>We collect everyday mishaps and turn them into lovingly overdramatic museum exhibits. The joke is always the situation, never the person.</p>
        </section>
        <section>
          <h2>How a story gets here</h2>
          <ol>
            <li>Send us a story. You can stay anonymous or choose a display name.</li>
            <li>A human curator reviews it. Submissions stay private while pending.</li>
            <li>If approved, it appears in the public museum for others to read and react to.</li>
          </ol>
        </section>
        <section>
          <h2>A little privacy, please</h2>
          <p>No account, email, or photo is needed. Leave out names and private details about yourself or anyone else. Use the report button on an exhibit if something needs another look.</p>
          <p>See our <Link className="text-link" href="/privacy">privacy policy</Link> and <Link className="text-link" href="/terms">story guidelines</Link>.</p>
        </section>
        <section className="about-curator">
          <h2>Our curator</h2>
          <p>Sir Regret is a fictional curator with a real talent for raising one eyebrow.</p>
          <blockquote>“A bold choice. History will be baffled.”</blockquote>
        </section>
        <Link className="button button-dark" href="/submit">Share a story →</Link>
      </div>
    </div>
  );
}
