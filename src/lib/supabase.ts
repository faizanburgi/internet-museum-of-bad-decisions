import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const hasDatabase = Boolean(url && key);
export const adminDb = hasDatabase ? createClient(url!, key!, { auth: { persistSession: false } }) : null;

export type Exhibit = {
  id: string; exhibit_number: number; category_id: string; original_story: string;
  curated_title: string; curated_description: string; public_display_name: string | null;
  is_anonymous: boolean; classification: string; status: string; submitted_at: string;
  published_at: string | null; reactions?: { reaction_type: string }[];
};

export type PublicExhibit = Pick<Exhibit, "id" | "exhibit_number" | "category_id" | "classification" | "curated_title" | "curated_description" | "public_display_name" | "is_anonymous" | "published_at"> & {
  categories?: { slug?: string; title?: string };
  reactions?: { reaction_type: string }[];
  reaction_count?: number;
};

export type ExhibitPage = { exhibits: PublicExhibit[]; total: number; unavailable?: boolean };

const PUBLIC_EXHIBIT_FIELDS = "id,exhibit_number,category_id,classification,curated_title,curated_description,public_display_name,is_anonymous,published_at";

export async function getExhibits(options: { category?: string; limit?: number; order?: "recent" | "popular" } = {}): Promise<PublicExhibit[]> {
  if (!adminDb) return [];
  let query = adminDb.from("exhibits").select(`${PUBLIC_EXHIBIT_FIELDS}, categories!inner(slug), reactions(reaction_type)`).eq("status", "approved");
  if (options.category) query = query.eq("categories.slug", options.category);
  query = query.order("published_at", { ascending: false }).limit(options.order === "popular" ? Math.max(options.limit ?? 30, 100) : options.limit ?? 30);
  const { data, error } = await query;
  if (error || !data) return [];
  const exhibits = data as unknown as PublicExhibit[];
  if (options.order === "popular") exhibits.sort((a,b) => (b.reactions?.length ?? 0) - (a.reactions?.length ?? 0) || Date.parse(b.published_at || "") - Date.parse(a.published_at || ""));
  return exhibits.slice(0, options.limit ?? 30);
}

async function getMatchingExhibitCount(options: { search?: string; category?: string }): Promise<number> {
  if (!adminDb) return 0;
  let query = adminDb.from("exhibits").select("id, categories!inner(slug)", { count: "exact", head: true }).eq("status", "approved");
  if (options.category) query = query.eq("categories.slug", options.category);
  if (options.search) query = query.textSearch("search_document", options.search, { type: "websearch", config: "english" });
  const { count, error } = await query;
  return error ? 0 : count ?? 0;
}

export async function getExhibitsPage(options: { search?: string; category?: string; order?: "recent" | "popular"; page?: number; pageSize?: number } = {}): Promise<ExhibitPage> {
  if (!adminDb) return { exhibits: [], total: 0 };
  const page = Math.max(1, Math.floor(options.page ?? 1));
  const pageSize = Math.max(1, Math.min(60, Math.floor(options.pageSize ?? 24)));
  const search = options.search?.trim().slice(0, 100) || null;
  const { data, error } = await adminDb.rpc("search_public_exhibits", {
    search_text: search,
    category_slug: options.category || null,
    order_by: options.order === "popular" ? "popular" : "recent",
    page_size: pageSize,
    page_offset: (page - 1) * pageSize
  });
  if (error) {
    console.error("Failed to search public exhibits", error);
    return { exhibits: [], total: 0, unavailable: true };
  }
  const rows = (data ?? []) as unknown as (PublicExhibit & { category_slug: string; reaction_count: number; total_count: number })[];
  const total = rows.length ? Number(rows[0].total_count) : await getMatchingExhibitCount({ search: search ?? undefined, category: options.category });
  return {
    total,
    exhibits: rows.map((row) => ({
      id: row.id,
      exhibit_number: row.exhibit_number,
      category_id: row.category_id,
      classification: row.classification,
      curated_title: row.curated_title,
      curated_description: row.curated_description,
      public_display_name: row.public_display_name,
      is_anonymous: row.is_anonymous,
      published_at: row.published_at,
      categories: { slug: row.category_slug },
      reaction_count: Number(row.reaction_count)
    }))
  };
}

export async function getExhibit(id: string): Promise<PublicExhibit | null> {
  if (!adminDb) return null;
  const { data } = await adminDb.from("exhibits").select(`${PUBLIC_EXHIBIT_FIELDS}, categories(slug, title), reactions(reaction_type)`).eq("id", id).eq("status", "approved").maybeSingle();
  return (data as unknown as PublicExhibit | null) ?? null;
}
