import Link from "next/link";
import { categories } from "@/lib/categories";
import { discoveryHref, type DiscoveryState } from "@/lib/discovery";

export function CollectionFilters({
  path,
  state,
  showCategory = false
}: {
  path: string;
  state: DiscoveryState;
  showCategory?: boolean;
}) {
  const hasFilters = Boolean(state.search || state.category || state.sort === "popular");

  return (
    <form action={path} method="get" className="collection-filters">
      <div className="collection-filter-fields">
        <label htmlFor="collection-search">
          Search stories
          <input
            id="collection-search"
            type="search"
            name="q"
            maxLength={100}
            defaultValue={state.search}
            placeholder="Try “midnight cake”"
          />
        </label>
        {showCategory && (
          <label htmlFor="collection-category">
            Department
            <select id="collection-category" name="category" defaultValue={state.category}>
              <option value="">All departments</option>
              {categories.map((category) => <option key={category.slug} value={category.slug}>{category.short}</option>)}
            </select>
          </label>
        )}
        <label htmlFor="collection-sort">
          Sort by
          <select id="collection-sort" name="sort" defaultValue={state.sort}>
            <option value="recent">Newest first</option>
            <option value="popular">Most reacted</option>
          </select>
        </label>
      </div>
      <div className="collection-filter-actions">
        <button className="button button-dark" type="submit">Find stories</button>
        {hasFilters && <Link className="text-link" href={path}>Clear filters</Link>}
      </div>
    </form>
  );
}

export function CollectionPagination({
  path,
  state,
  pageCount
}: {
  path: string;
  state: DiscoveryState;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav className="collection-pagination" aria-label="Search result pages">
      {state.page > 1
        ? <Link href={discoveryHref(path, state, state.page - 1)} rel="prev">← Previous</Link>
        : <span aria-disabled="true">← Previous</span>}
      <span aria-current="page">Page {state.page} of {pageCount}</span>
      {state.page < pageCount
        ? <Link href={discoveryHref(path, state, state.page + 1)} rel="next">Next →</Link>
        : <span aria-disabled="true">Next →</span>}
    </nav>
  );
}
