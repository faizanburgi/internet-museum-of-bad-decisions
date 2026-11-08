import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { categories, categoryBySlug } from "@/lib/categories";
import { discoveryHref, getPageCount, parseDiscoveryState, type DiscoverySearchParams } from "@/lib/discovery";
import { getExhibitsPage } from "@/lib/supabase";
import { CollectionFilters, CollectionPagination } from "@/components/collection-controls";
import { ExhibitCard } from "@/components/exhibit-card";

const PAGE_SIZE = 24;

export function generateStaticParams() { return categories.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = categoryBySlug(slug);
  return { title: item?.short || "Department" };
}

export default async function GalleryPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<DiscoverySearchParams>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const department = categoryBySlug(slug);
  if (!department) notFound();

  const state = { ...parseDiscoveryState(query), category: "" };
  const result = await getExhibitsPage({ search: state.search, category: slug, order: state.sort, page: state.page, pageSize: PAGE_SIZE });
  const pageCount = getPageCount(result.total, PAGE_SIZE);
  if (state.page > pageCount) redirect(discoveryHref(`/gallery/${slug}`, state, pageCount));

  return (
    <div className="page-wrap">
      <div className="breadcrumb"><Link href="/museum">THE MUSEUM</Link> / STORY DEPARTMENT</div>
      <span className="department-icon gallery-department-icon" aria-hidden="true">{department.icon}</span>
      <h1 className="page-title">{department.title}</h1>
      <p className="page-intro">{department.description}</p>

      <CollectionFilters path={`/gallery/${slug}`} state={state} />

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
        ? <div className="empty-state"><strong>We can’t search this department right now.</strong><p>Please try again shortly.</p></div>
        : result.exhibits.length
        ? <div className="exhibit-grid">{result.exhibits.map((item) => <ExhibitCard key={item.id} exhibit={item} />)}</div>
        : <div className="empty-state"><strong>{state.search ? "No stories match that search." : "No stories in this department yet."}</strong>
          <p>{state.search ? "Try another phrase, or use Clear filters above." : "This gallery is waiting for its first exhibit."}</p>
          {!state.search && <Link className="text-link" href="/submit">Donate an exhibit →</Link>}
        </div>}
      {!result.unavailable && <CollectionPagination path={`/gallery/${slug}`} state={state} pageCount={pageCount} />}
    </div>
  );
}
