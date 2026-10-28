import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExhibit } from "@/lib/supabase";
import { categories } from "@/lib/categories";
import { ExhibitActions } from "./exhibit-actions";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await getExhibit(id);
  return item
    ? { title: item.curated_title, description: item.curated_description, openGraph: { images: [`/api/og/${id}`] } }
    : { title: "Exhibit not found" };
}

export default async function ExhibitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getExhibit(id);
  if (!item) notFound();

  const category = categories.find((entry) =>
    entry.slug === ((item as typeof item & { categories?: { slug: string } }).categories?.slug || item.category_id)
  );
  const counts: Record<string, number> = {};
  item.reactions?.forEach((reaction) => {
    counts[reaction.reaction_type] = (counts[reaction.reaction_type] || 0) + 1;
  });

  return (
    <div className="exhibit-page">
      <div className="breadcrumb"><Link href="/museum">THE MUSEUM</Link> / EXHIBIT {String(item.exhibit_number).padStart(4, "0")}</div>
      <article className="exhibit-sheet" style={{ marginTop: 20 }}>
        <div className="exhibit-number">EXHIBIT {String(item.exhibit_number).padStart(4, "0")}</div>
        <h1>{item.curated_title}</h1>
        <div className="exhibit-category">{category?.short || "Museum story"}</div>
        <div className="exhibit-rule" />
        <p className="exhibit-story">{item.curated_description}</p>
        <div className="exhibit-meta">
          {item.is_anonymous ? "Anonymous" : item.public_display_name || "A museum visitor"}
          {item.published_at ? ` · ${new Date(item.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}` : ""}
        </div>
      </article>
      <ExhibitActions id={item.id} counts={counts} />
      <p className="exhibit-submit-link"><Link className="text-link" href="/submit">Submit your own story →</Link></p>
    </div>
  );
}
