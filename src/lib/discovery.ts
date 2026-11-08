export type DiscoverySearchParams = Record<string, string | string[] | undefined>;

export type DiscoveryState = {
  search: string;
  category: string;
  sort: "recent" | "popular";
  page: number;
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function parseDiscoveryState(params: DiscoverySearchParams): DiscoveryState {
  const pageValue = first(params.page);
  const requestedPage = /^\d+$/.test(pageValue) ? Number(pageValue) : Number.NaN;
  return {
    search: first(params.q).trim().slice(0, 100),
    category: first(params.category).trim(),
    sort: first(params.sort) === "popular" ? "popular" : "recent",
    page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  };
}

export function getPageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
}

export function discoveryHref(path: string, state: DiscoveryState, page = state.page): string {
  const params = new URLSearchParams();
  if (state.search) params.set("q", state.search);
  if (state.category) params.set("category", state.category);
  if (state.sort === "popular") params.set("sort", state.sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}
