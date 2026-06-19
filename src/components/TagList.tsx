type TagListProps = {
  items: string[]
  className?: string
}

export function TagList({ items, className = '' }: TagListProps) {
  return (
    <ul className={`tag-list ${className}`.trim()}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
