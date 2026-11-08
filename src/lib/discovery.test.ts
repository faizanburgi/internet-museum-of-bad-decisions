import { describe, expect, it } from "vitest";
import { discoveryHref, getPageCount, parseDiscoveryState } from "./discovery";

describe("discovery query state", () => {
  it("normalizes search, sort, and page values", () => {
    expect(parseDiscoveryState({ q: "  midnight cake ", sort: "popular", page: "3" })).toEqual({
      search: "midnight cake",
      category: "",
      sort: "popular",
      page: 3
    });
    expect(parseDiscoveryState({ q: "x".repeat(120), sort: "unexpected", page: "2oops" })).toEqual({
      search: "x".repeat(100),
      category: "",
      sort: "recent",
      page: 1
    });
  });

  it("builds shareable page links while preserving active filters", () => {
    const museumState = parseDiscoveryState({ q: "late night tea", category: "kitchen-disasters", sort: "popular" });
    const galleryState = parseDiscoveryState({ q: "late night tea", sort: "popular" });
    expect(discoveryHref("/museum", museumState, 2)).toBe("/museum?q=late+night+tea&category=kitchen-disasters&sort=popular&page=2");
    expect(discoveryHref("/gallery/kitchen-disasters", galleryState, 1)).toBe("/gallery/kitchen-disasters?q=late+night+tea&sort=popular");
  });

  it("calculates at least one page for empty results", () => {
    expect(getPageCount(0, 24)).toBe(1);
    expect(getPageCount(25, 24)).toBe(2);
  });
});
