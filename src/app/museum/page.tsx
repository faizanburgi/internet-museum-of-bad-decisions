import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { categories, categoryBySlug } from "@/lib/categories";
import { discoveryHref, getPageCount, parseDiscoveryState, type DiscoverySearchParams } from "@/lib/discovery";
import { getExhibitsPage } from "@/lib/supabase";
import { CollectionFilters, CollectionPagination } from "@/components/collection-controls";
import { ExhibitCard } from "@/components/exhibit-card";

export const metadata: Metadata = { title: "The Museum" };
const PAGE_SIZE = 24;

export default async function MuseumPage({ searchParams }: { searchParams: Promise<DiscoverySearchParams> }) {
  const params = await searchParams;
  const parsed = parseDiscoveryState(params);
  const state = { ...parsed, category: categoryBySlug(parsed.category)?.slug ?? "" };
  const result = await getExhibitsPage({ search: state.search, category: state.category, order: state.sort, page: state.page, pageSize: PAGE_SIZE });
  const pageCount = getPageCount(result.total, PAGE_SIZE);
  if (state.page > pageCount) redirect(discoveryHref("/museum", state, pageCount));

  return (
    <div className="page-wrap">
      <div className="breadcrumb">THE MUSEUM / BROWSE ALL STORIES</div>
      <h1 className="page-title">The Museum</h1>
      <p className="page-intro">Find a story, or wander into a department.</p>

      <CollectionFilters path="/museum" state={state} showCategory />

      {!state.search && !state.category && (
        <section className="collection-departments" aria-labelledby="departments-title">
          <h2 id="departments-title">Browse departments</h2>
          <div className="department-grid">
            {categories.map((item) => <Link className="department" href={`/gallery/${item.slug}`} key={item.slug}>
              <span className="department-icon" aria-hidden="true">{item.icon}</span>
              <h3>{item.short}</h3>
              <p>{item.description}</p>
            </Link>)}
          </div>
        </section>
      )}

      <div className="collection-results-heading">
        <h2>Stories</h2>
        <p className="collection-result-count" role="status" aria-live="polite">
          {result.unavailable ? "Collection search is temporarily unavailable." : <>
            {result.total} {result.total === 1 ? "story" : "stories"} found
            {state.search ? <> for “{state.search}”</> : null}
          </>}
        </p>
      </div>
      {result.unavailable
        ? <div className="empty-state"><strong>We can’t search the collection right now.</strong><p>Please try again shortly.</p></div>
        : result.exhibits.length
        ? <div className="exhibit-grid">{result.exhibits.map((item) => <ExhibitCard key={item.id} exhibit={item} />)}</div>
        : <div className="empty-state"><strong>{state.search || state.category ? "No stories match those filters." : "No stories are on display yet."}</strong>
          <p>{state.search || state.category ? "Try another phrase, or use Clear filters above." : "The museum is waiting for its first exhibit."}</p>
          {!state.search && !state.category && <Link className="text-link" href="/submit">Donate the first exhibit →</Link>}
        </div>}
      {!result.unavailable && <CollectionPagination path="/museum" state={state} pageCount={pageCount} />}
    </div>
  );
}
