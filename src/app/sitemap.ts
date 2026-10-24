import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { getExhibits } from "@/lib/supabase";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";const exhibits=await getExhibits({limit:1000});return [{url:base},{url:`${base}/museum`},{url:`${base}/hall-of-shame`},{url:`${base}/about`},...categories.map(({slug})=>({url:`${base}/gallery/${slug}`})),...exhibits.map(({id,published_at})=>({url:`${base}/exhibit/${id}`,lastModified:published_at||undefined}))]}
