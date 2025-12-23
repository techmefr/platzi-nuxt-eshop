import type { DataTableState } from '../state/DataTableState'

export class DataTableSelector<T = unknown> {
  protected itemKey: string | ((item: T) => string | number)

  constructor(
    protected state: DataTableState<T>,
    itemKey: string | ((item: T) => string | number) = 'id'
  ) {
    this.itemKey = itemKey
  }

  protected getItemId(item: T): string | number {
    if (typeof this.itemKey === 'function') {
      return this.itemKey(item)
    }
    return (item as Record<string, unknown>)[this.itemKey] as string | number
  }

  selectItem(item: T) {
    const selectedItems = this.state.getSelectedItems().value
    const itemId = this.getItemId(item)
    
    const index = selectedItems.findIndex(
      selectedItem => this.getItemId(selectedItem) === itemId
    )
    
    if (index === -1) {
      this.state.setSelectedItems([...selectedItems, item])
    } else {
      const newSelection = [...selectedItems]
      newSelection.splice(index, 1)
      this.state.setSelectedItems(newSelection)
    }
  }

  selectItems(items: T[]) {
    const selectedItems = this.state.getSelectedItems().value
    const selectedIds = new Set(selectedItems.map(item => this.getItemId(item)))
    
    items.forEach(item => {
      const itemId = this.getItemId(item)
      if (!selectedIds.has(itemId)) {
        selectedItems.push(item)
        selectedIds.add(itemId)
      }
    })
    
    this.state.setSelectedItems([...selectedItems])
  }

  deselectItems(items: T[]) {
    const selectedItems = this.state.getSelectedItems().value
    const idsToRemove = new Set(items.map(item => this.getItemId(item)))
    
    const newSelection = selectedItems.filter(
      item => !idsToRemove.has(this.getItemId(item))
    )
    
    this.state.setSelectedItems(newSelection)
  }

  selectAll() {
    const items = this.state.getItems().value
    const selectedItems = this.state.getSelectedItems().value
    
    if (selectedItems.length === items.length) {
      this.state.setSelectedItems([])
    } else {
      this.state.setSelectedItems([...items])
    }
  }

  selectPage(pageItems: T[]) {
    const selectedItems = this.state.getSelectedItems().value
    const selectedIds = new Set(selectedItems.map(item => this.getItemId(item)))
    
    const isAllPageSelected = pageItems.every(
      item => selectedIds.has(this.getItemId(item))
    )
    
    if (isAllPageSelected) {
      this.deselectItems(pageItems)
    } else {
      this.selectItems(pageItems)
    }
  }

  clearSelection() {
    this.state.setSelectedItems([])
  }

  isSelected(item: T): boolean {
    const selectedItems = this.state.getSelectedItems().value
    const itemId = this.getItemId(item)
    return selectedItems.some(
      selectedItem => this.getItemId(selectedItem) === itemId
    )
  }

  isAllSelected() {
    return computed(() => {
      const items = this.state.getItems().value
      const selectedItems = this.state.getSelectedItems().value
      return items.length > 0 && selectedItems.length === items.length
    })
  }

  isPageSelected(pageItems: T[]) {
    return computed(() => {
      const selectedItems = this.state.getSelectedItems().value
      const selectedIds = new Set(selectedItems.map(item => this.getItemId(item)))
      
      return pageItems.length > 0 && pageItems.every(
        item => selectedIds.has(this.getItemId(item))
      )
    })
  }

  isIndeterminate() {
    return computed(() => {
      const selectedItems = this.state.getSelectedItems().value
      const items = this.state.getItems().value
      return selectedItems.length > 0 && selectedItems.length < items.length
    })
  }

  isPageIndeterminate(pageItems: T[]) {
    return computed(() => {
      const selectedItems = this.state.getSelectedItems().value
      const selectedIds = new Set(selectedItems.map(item => this.getItemId(item)))
      
      const selectedInPage = pageItems.filter(
        item => selectedIds.has(this.getItemId(item))
      )
      
      return selectedInPage.length > 0 && selectedInPage.length < pageItems.length
    })
  }

  getSelectedCount() {
    return computed(() => this.state.getSelectedItems().value.length)
  }

  getSelectedIds() {
    return computed(() => 
      this.state.getSelectedItems().value.map(item => this.getItemId(item))
    )
  }
}
