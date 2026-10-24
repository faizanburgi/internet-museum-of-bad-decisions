export const categories = [
  { slug: "academic-miscalculations", title: "The Academic Miscalculations Wing", short: "Academic Miscalculations", description: "A permanent record of scholarly confidence meeting practical reality.", icon: "✒", color: "sage" },
  { slug: "technology-crimes", title: "The Technology Crimes Division", short: "Technology Crimes", description: "Digital disasters, accidental messages, and devices with evidence.", icon: "⌘", color: "blue" },
  { slug: "romantic-catastrophes", title: "The Romantic Catastrophes Hall", short: "Romantic Catastrophes", description: "Tender intentions, regrettable texts, and courtship under review.", icon: "♡", color: "rose" },
  { slug: "kitchen-disasters", title: "The Kitchen Disasters Wing", short: "Kitchen Disasters", description: "Culinary experiments that challenged the smoke detector.", icon: "♨", color: "ochre" },
  { slug: "financial-regrets", title: "The Financial Regrets Collection", short: "Financial Regrets", description: "Purchases made with confidence and explained with silence.", icon: "＄", color: "gold" },
  { slug: "social-embarrassments", title: "The Social Embarrassments Gallery", short: "Social Embarrassments", description: "Awkward encounters preserved at their most awkward.", icon: "◉", color: "lavender" },
  { slug: "3am-decisions", title: "The Department of 3 AM Decisions", short: "3 AM Decisions", description: "Ideas that seemed excellent after midnight. Allegedly.", icon: "☾", color: "night" },
  { slug: "miscellaneous-regrets", title: "The Miscellaneous Hall of Regret", short: "Miscellaneous Regrets", description: "For incidents that defy every existing department.", icon: "✳", color: "cream" }
] as const;

export type Category = (typeof categories)[number];
export function categoryBySlug(slug: string) { return categories.find((item) => item.slug === slug); }
