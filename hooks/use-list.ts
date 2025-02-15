
import { useState } from 'react'

export function useList<T>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems)

  const addItem = (item: T) => {
    setItems([...items, item])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, newItem: T) => {
    setItems(items.map((item, i) => (i === index ? newItem : item)))
  }

  const clearList = () => {
    setItems([])
  }

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)
    setItems(newItems)
  }

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    clearList,
    moveItem
  }
}
