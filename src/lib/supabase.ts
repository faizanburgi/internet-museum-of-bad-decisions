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

export async function getExhibits(options: { category?: string; limit?: number; order?: "recent" | "popular" } = {}): Promise<Exhibit[]> {
  if (!adminDb) return [];
  let query = adminDb.from("exhibits").select("*, categories!inner(slug), reactions(reaction_type)").eq("status", "approved");
  if (options.category) query = query.eq("categories.slug", options.category);
  query = query.order("published_at", { ascending: false }).limit(options.order === "popular" ? Math.max(options.limit ?? 30, 100) : options.limit ?? 30);
  const { data, error } = await query;
  if (error || !data) return [];
  const exhibits = data as unknown as Exhibit[];
  if (options.order === "popular") exhibits.sort((a,b) => (b.reactions?.length ?? 0) - (a.reactions?.length ?? 0) || Date.parse(b.published_at || "") - Date.parse(a.published_at || ""));
  return exhibits.slice(0, options.limit ?? 30);
}

export async function getExhibit(id: string): Promise<Exhibit | null> {
  if (!adminDb) return null;
  const { data } = await adminDb.from("exhibits").select("*, categories(slug, title), reactions(reaction_type)").eq("id", id).eq("status", "approved").maybeSingle();
  return (data as unknown as Exhibit | null) ?? null;
}
