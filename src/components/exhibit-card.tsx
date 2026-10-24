import Link from "next/link";
import type { Exhibit } from "@/lib/supabase";
import { categories } from "@/lib/categories";

export function ExhibitCard({ exhibit }: { exhibit: Exhibit }) {
  const category = categories.find((item) => item.slug === (exhibit as Exhibit & { categories?: { slug?: string } }).categories?.slug || item.slug === exhibit.category_id);
  const reactions = exhibit.reactions?.length ?? 0;
  return <article className="exhibit-card"><div className="meta">Exhibit No. {String(exhibit.exhibit_number).padStart(4, "0")} · {category?.short ?? "Museum Archive"}</div><h3><Link href={`/exhibit/${exhibit.id}`}>{exhibit.curated_title}</Link></h3><p>{exhibit.curated_description}</p><div className="card-foot"><span>{exhibit.is_anonymous ? "Anonymous benefactor" : exhibit.public_display_name || "A museum visitor"}</span><span>♡ {reactions}</span></div></article>;
}
