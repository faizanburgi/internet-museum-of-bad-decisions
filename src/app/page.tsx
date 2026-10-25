import { categories } from "@/lib/categories";
import { getExhibits } from "@/lib/supabase";
import { MuseumCarousel } from "@/components/museum-carousel";

export default async function HomePage() {
  const exhibits = await getExhibits({ limit: 4 });
  return <MuseumCarousel exhibits={exhibits} categories={categories}/>;
}
