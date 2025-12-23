# DataTable Define Module

Module avec l'API `defineDataTable` et `defineServerDataTable` pour créer des instances de tableaux réutilisables et enregistrées globalement.

## Installation

```bash
pnpm add @reportit/datatable-define
```

## Fonctionnalités

- `defineDataTable` : Crée un composable réutilisable pour tableaux côté client
- `defineServerDataTable` : Crée un composable réutilisable pour tableaux côté serveur
- Registry global pour partager les instances entre composants
- Payload builders prêts à l'emploi (Lomkit, GraphQL, default)

## Utilisation

### defineDataTable (client-side)
```typescript
import { defineDataTable } from '@reportit/datatable-define'

// Définir le tableau une fois
export const useUserTable = defineDataTable<User>('users', {
  headers: [
    { key: 'name', title: 'Nom', sortable: true },
    { key: 'email', title: 'Email', sortable: true }
  ],
  itemsPerPage: 10
})

// Utiliser dans n'importe quel composant
const { items, setItems, toggleSort, pagination } = useUserTable()
```

### defineServerDataTable (server-side)
```typescript
import { defineServerDataTable, lomkitPayloadBuilder } from '@reportit/datatable-define'

export const useAssetTable = defineServerDataTable<Asset>('assets', {
  headers: [
    { key: 'name', title: 'Nom', sortable: true },
    { key: 'type', title: 'Type', sortable: true }
  ],
  fetchFunction: async (payload) => {
    const response = await Asset.search(payload)
    return { items: response.data, total: response.meta.total }
  },
  payloadBuilder: lomkitPayloadBuilder,
  debounceMs: 300
})
```

## Payload Builders

### lomkitPayloadBuilder
```json
{
  "pagination": { "page": 1, "limit": 10 },
  "sorts": [{ "field": "name", "direction": "asc" }],
  "search": { "query": "cisco" },
  "filters": [{ "field": "type", "operator": "=", "value": "switch" }]
}
```

### graphqlPayloadBuilder
```json
{
  "pagination": { "page": 1, "limit": 10 },
  "sort": { "field": "name", "order": "ASC" },
  "search": "cisco",
  "filters": { "type": "switch" }
}
```

### defaultPayloadBuilder
```json
{
  "page": 1,
  "per_page": 10,
  "sort_by": "name",
  "sort_order": "asc",
  "search": "cisco",
  "filters": { "type": "switch" }
}
```

### Créer un builder custom
```typescript
import { createPayloadBuilder } from '@reportit/datatable-define'

const myBuilder = createPayloadBuilder((params) => ({
  pageNumber: params.page,
  pageSize: params.itemsPerPage,
  orderBy: params.sortBy,
  searchQuery: params.search
}))
```

## Registry

Le module maintient un registry global des instances :

```typescript
import { hasDataTable, clearDataTableRegistry } from '@reportit/datatable-define'

// Vérifier si un tableau existe
if (hasDataTable('users')) {
  // ...
}

// Nettoyer le registry (utile pour les tests)
clearDataTableRegistry()
```

## Exports

```typescript
export { defineDataTable } from './defineDataTable'
export { defineServerDataTable } from './defineServerDataTable'
export { defaultPayloadBuilder, lomkitPayloadBuilder, graphqlPayloadBuilder, createPayloadBuilder } from './payloadBuilders'
export { clearDataTableRegistry, hasDataTable } from './store/registry'
export type { DataTableSort, DataTablePagination, DataTableHeader, DataTableOptions, ... } from './types'
```
