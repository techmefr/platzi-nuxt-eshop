const dataTableRegistry = new Map<string, ReturnType<typeof Function>>()

export function registerDataTable<T>(id: string, factory: () => T): () => T {
  if (dataTableRegistry.has(id)) {
    return dataTableRegistry.get(id) as () => T
  }

  let instance: T | null = null

  const useTable = () => {
    if (!instance) {
      instance = factory()
    }
    return instance
  }

  dataTableRegistry.set(id, useTable)
  return useTable
}

export function clearDataTableRegistry(): void {
  dataTableRegistry.clear()
}

export function hasDataTable(id: string): boolean {
  return dataTableRegistry.has(id)
}
