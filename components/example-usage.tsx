
import { useList } from '@/hooks/use-list'

export function ExampleList() {
  const { items, addItem, removeItem, updateItem, clearList, moveItem } = useList<string>()

  return (
    <div>
      <button onClick={() => addItem('New Item')}>Add Item</button>
      <button onClick={() => clearList()}>Clear All</button>
      
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => removeItem(index)}>Remove</button>
            <button onClick={() => updateItem(index, 'Updated Item')}>Update</button>
            <button onClick={() => moveItem(index, Math.max(0, index - 1))}>Move Up</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
