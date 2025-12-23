const dateTimeRegistry = new Map<string, ReturnType<typeof Function>>()

export function registerDateTime<T>(id: string, factory: () => T): () => T {
  if (dateTimeRegistry.has(id)) {
    return dateTimeRegistry.get(id) as () => T
  }

  let instance: T | null = null

  const useDateTime = () => {
    if (!instance) {
      instance = factory()
    }
    return instance
  }

  dateTimeRegistry.set(id, useDateTime)
  return useDateTime
}

export function clearDateTimeRegistry(): void {
  dateTimeRegistry.clear()
}

export function hasDateTime(id: string): boolean {
  return dateTimeRegistry.has(id)
}
