import { describe, it, expect } from "vitest";
import {
  defaultPayloadBuilder,
  lomkitPayloadBuilder,
  graphqlPayloadBuilder,
  createCustomPayloadBuilder,
} from "../index";
import type { ServerFetchParams } from "../types/ApiPayloadBuilder.types";

describe("Payload Builders Index", () => {
  const params: ServerFetchParams = {
    page: 2,
    itemsPerPage: 20,
  };

  it("defaultPayloadBuilder retourne le format de base", () => {
    const result = defaultPayloadBuilder(params) as Record<string, unknown>;

    expect(result.page).toBe(2);
    expect(result.per_page).toBe(20);
  });

  it("lomkitPayloadBuilder retourne le format Lomkit", () => {
    const result = lomkitPayloadBuilder(params) as Record<string, unknown>;

    expect(result.pagination).toEqual({ page: 2, limit: 20 });
  });

  it("graphqlPayloadBuilder retourne le format GraphQL", () => {
    const result = graphqlPayloadBuilder(params) as Record<string, unknown>;

    expect(result.pagination).toEqual({ page: 2, limit: 20 });
  });

  it("createCustomPayloadBuilder retourne la fonction fournie", () => {
    const customFn = (p: ServerFetchParams) => ({ custom: p.page });
    const builder = createCustomPayloadBuilder(customFn);

    expect(builder(params)).toEqual({ custom: 2 });
  });

  it("defaultPayloadBuilder gère tous les paramètres", () => {
    const fullParams: ServerFetchParams = {
      page: 3,
      itemsPerPage: 15,
      sortBy: "name",
      sortOrder: "desc",
      search: "test",
      filters: { status: "active" },
    };

    const result = defaultPayloadBuilder(fullParams) as Record<string, unknown>;

    expect(result.page).toBe(3);
    expect(result.per_page).toBe(15);
    expect(result.sort_by).toBe("name");
    expect(result.sort_order).toBe("desc");
    expect(result.search).toBe("test");
    expect(result.filters).toEqual({ status: "active" });
  });

  it("lomkitPayloadBuilder gère tous les paramètres", () => {
    const fullParams: ServerFetchParams = {
      page: 1,
      itemsPerPage: 10,
      sortBy: "created_at",
      sortOrder: "asc",
      search: "query",
      filters: { type: "premium" },
    };

    const result = lomkitPayloadBuilder(fullParams) as Record<string, unknown>;

    expect(result.pagination).toEqual({ page: 1, limit: 10 });
    expect(result.sorts).toEqual([{ field: "created_at", direction: "asc" }]);
    expect(result.search).toEqual({ query: "query" });
    expect(result.filters).toEqual([
      { field: "type", operator: "=", value: "premium" },
    ]);
  });

  it("graphqlPayloadBuilder gère tous les paramètres", () => {
    const fullParams: ServerFetchParams = {
      page: 2,
      itemsPerPage: 20,
      sortBy: "title",
      sortOrder: "desc",
      search: "graphql",
      filters: { category: "news" },
    };

    const result = graphqlPayloadBuilder(fullParams) as Record<string, unknown>;

    expect(result.pagination).toEqual({ page: 2, limit: 20 });
    expect(result.sort).toEqual({ field: "title", order: "DESC" });
    expect(result.search).toBe("graphql");
    expect(result.filters).toEqual({ category: "news" });
  });
});
