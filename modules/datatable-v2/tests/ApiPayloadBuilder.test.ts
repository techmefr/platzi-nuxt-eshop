import { describe, it, expect, beforeEach } from "vitest";
import { ApiPayloadBuilder } from "../builders/ApiPayloadBuilder";
import type { ServerFetchParams } from "../types/ApiPayloadBuilder.types";

describe("ApiPayloadBuilder", () => {
  let builder: ApiPayloadBuilder;

  beforeEach(() => {
    builder = new ApiPayloadBuilder();
  });

  describe("buildDefault", () => {
    it("construit un payload avec pagination de base", () => {
      const params: ServerFetchParams = {
        page: 2,
        itemsPerPage: 20,
      };

      const result = builder.buildDefault(params) as Record<string, unknown>;

      expect(result.page).toBe(2);
      expect(result.per_page).toBe(20);
    });

    it("ajoute le tri si présent", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        sortBy: "name",
        sortOrder: "desc",
      };

      const result = builder.buildDefault(params) as Record<string, unknown>;

      expect(result.sort_by).toBe("name");
      expect(result.sort_order).toBe("desc");
    });

    it("utilise asc par défaut pour le tri", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        sortBy: "name",
      };

      const result = builder.buildDefault(params) as Record<string, unknown>;

      expect(result.sort_order).toBe("asc");
    });

    it("ajoute la recherche si présente", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        search: "test query",
      };

      const result = builder.buildDefault(params) as Record<string, unknown>;

      expect(result.search).toBe("test query");
    });

    it("ajoute les filtres si présents", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        filters: {
          status: "active",
          category: "tech",
        },
      };

      const result = builder.buildDefault(params) as Record<string, unknown>;

      expect(result.filters).toEqual({
        status: "active",
        category: "tech",
      });
    });

    it("ignore les filtres vides", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        filters: {},
      };

      const result = builder.buildDefault(params) as Record<string, unknown>;

      expect(result.filters).toBeUndefined();
    });
  });

  describe("buildLomkitPayload", () => {
    it("construit un payload Lomkit avec pagination", () => {
      const params: ServerFetchParams = {
        page: 3,
        itemsPerPage: 25,
      };

      const result = builder.buildLomkitPayload(params) as Record<string, unknown>;

      expect(result.pagination).toEqual({
        page: 3,
        limit: 25,
      });
    });

    it("ajoute le tri au format Lomkit", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        sortBy: "created_at",
        sortOrder: "desc",
      };

      const result = builder.buildLomkitPayload(params) as Record<string, unknown>;

      expect(result.sorts).toEqual([
        {
          field: "created_at",
          direction: "desc",
        },
      ]);
    });

    it("ajoute la recherche au format Lomkit", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        search: "keyword",
      };

      const result = builder.buildLomkitPayload(params) as Record<string, unknown>;

      expect(result.search).toEqual({
        query: "keyword",
      });
    });

    it("transforme les filtres au format Lomkit", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        filters: {
          status: "active",
          type: "premium",
        },
      };

      const result = builder.buildLomkitPayload(params) as Record<string, unknown>;

      expect(result.filters).toEqual([
        { field: "status", operator: "=", value: "active" },
        { field: "type", operator: "=", value: "premium" },
      ]);
    });
  });

  describe("buildGraphQLPayload", () => {
    it("construit un payload GraphQL avec pagination", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 50,
      };

      const result = builder.buildGraphQLPayload(params) as Record<string, unknown>;

      expect(result.pagination).toEqual({
        page: 1,
        limit: 50,
      });
    });

    it("ajoute le tri au format GraphQL", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        sortBy: "title",
        sortOrder: "asc",
      };

      const result = builder.buildGraphQLPayload(params) as Record<string, unknown>;

      expect(result.sort).toEqual({
        field: "title",
        order: "ASC",
      });
    });

    it("convertit sortOrder en majuscules", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        sortBy: "title",
        sortOrder: "desc",
      };

      const result = builder.buildGraphQLPayload(params) as Record<string, unknown>;

      expect(result.sort.order).toBe("DESC");
    });

    it("ajoute la recherche directement", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        search: "graphql query",
      };

      const result = builder.buildGraphQLPayload(params) as Record<string, unknown>;

      expect(result.search).toBe("graphql query");
    });

    it("ajoute les filtres directement", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
        filters: {
          category: "news",
        },
      };

      const result = builder.buildGraphQLPayload(params) as Record<string, unknown>;

      expect(result.filters).toEqual({
        category: "news",
      });
    });
  });

  describe("build", () => {
    it("utilise buildDefault par défaut", () => {
      const params: ServerFetchParams = {
        page: 1,
        itemsPerPage: 10,
      };

      const result = builder.build(params) as Record<string, unknown>;

      expect(result.page).toBe(1);
      expect(result.per_page).toBe(10);
    });
  });
});
