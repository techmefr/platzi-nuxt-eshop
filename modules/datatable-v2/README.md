# DataTable V2 Module

Version 2 du module DataTable avec une architecture basée sur des classes et des composables Vue.

## Installation

```bash
pnpm add @reportit/datatable-v2
```

## Fonctionnalités

- Architecture basée sur des classes TypeScript
- Composable `useDataTable` pour une intégration Vue simplifiée
- Tri, pagination et sélection
- Typage fort avec génériques

## Utilisation

### Composable useDataTable
```typescript
import { useDataTable } from '@reportit/datatable-v2'

interface User {
  id: number
  name: string
  email: string
}

const {
  items,
  headers,
  sort,
  pagination,
  selectedItems,
  paginatedItems,
  toggleSort,
  setPage,
  selectItem,
} = useDataTable<User>({
  headers: [
    { key: 'name', title: 'Nom', sortable: true },
    { key: 'email', title: 'Email', sortable: true }
  ],
  items: users,
  itemsPerPage: 10
})
```

## Options de configuration

```typescript
interface DataTableOptions<T> {
  headers?: DataTableHeader[]
  items?: T[]
  itemsPerPage?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  multiSort?: boolean
  itemKey?: string | ((item: T) => string | number)
}
```

## Méthodes retournées

### État (ComputedRef)
- `items` : Tous les éléments
- `headers` : En-têtes du tableau
- `sort` : État du tri actuel
- `pagination` : État de la pagination
- `selectedItems` : Éléments sélectionnés
- `sortedItems` : Éléments triés
- `paginatedItems` : Éléments paginés
- `isAllSelected` : Tous sélectionnés
- `isPageSelected` : Page sélectionnée
- `isIndeterminate` : Sélection partielle
- `selectedCount` : Nombre sélectionnés
- `selectedIds` : IDs sélectionnés

### Actions
- `setItems(items)` : Définir les données
- `setHeaders(headers)` : Définir les en-têtes
- `toggleSort(key)` : Basculer le tri
- `setSort(key, order)` : Définir le tri
- `clearSort()` : Effacer le tri
- `setPage(page)` : Aller à une page
- `nextPage()` / `previousPage()` : Navigation
- `goToFirstPage()` / `goToLastPage()` : Extrémités
- `setItemsPerPage(count)` : Éléments par page
- `selectItem(item)` : Toggle sélection
- `selectItems(items)` / `deselectItems(items)` : Sélection multiple
- `selectAll()` / `selectPage()` : Sélection groupée
- `clearSelection()` : Vider la sélection
- `isSelected(item)` : Vérifier sélection
- `setLoading(loading)` : État de chargement
- `reset()` : Réinitialiser

## Architecture

Le module utilise une classe `DataTable` qui encapsule toute la logique :
- Gestion d'état réactif avec Vue refs
- Tri avec support des propriétés imbriquées
- Pagination avec calcul automatique des pages
- Sélection avec support de l'identification par clé ou fonction
