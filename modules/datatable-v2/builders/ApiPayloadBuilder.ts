import type { ServerFetchParams } from "../types/ApiPayloadBuilder.types";

export class ApiPayloadBuilder {
  build(params: ServerFetchParams): unknown {
    return this.buildDefault(params);
  }

  buildDefault(params: ServerFetchParams): unknown {
    const payload: Record<string, unknown> = {
      page: params.page,
      per_page: params.itemsPerPage,
    };

    if (params.sortBy) {
      payload.sort_by = params.sortBy;
      payload.sort_order = params.sortOrder || "asc";
    }

    if (params.search) {
      payload.search = params.search;
    }

    if (params.filters && Object.keys(params.filters).length > 0) {
      payload.filters = params.filters;
    }

    return payload;
  }

  buildLomkitPayload(params: ServerFetchParams): unknown {
    const payload: Record<string, unknown> = {
      pagination: {
        page: params.page,
        limit: params.itemsPerPage,
      },
    };

    if (params.sortBy) {
      payload.sorts = [
        {
          field: params.sortBy,
          direction: params.sortOrder || "asc",
        },
      ];
    }

    if (params.search) {
      payload.search = {
        query: params.search,
      };
    }

    if (params.filters && Object.keys(params.filters).length > 0) {
      payload.filters = Object.entries(params.filters).map(
        ([field, value]) => ({
          field,
          operator: "=",
          value,
        })
      );
    }

    return payload;
  }

  buildGraphQLPayload(params: ServerFetchParams): unknown {
    const payload: Record<string, unknown> = {
      pagination: {
        page: params.page,
        limit: params.itemsPerPage,
      },
    };

    if (params.sortBy) {
      payload.sort = {
        field: params.sortBy,
        order: params.sortOrder?.toUpperCase() || "ASC",
      };
    }

    if (params.search) {
      payload.search = params.search;
    }

    if (params.filters) {
      payload.filters = params.filters;
    }

    return payload;
  }
}
