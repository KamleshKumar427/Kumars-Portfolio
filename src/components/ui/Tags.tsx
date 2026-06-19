import { cn } from '@/lib/cn'

/** Mono tag pills — tech stacks, topics. The dossier's telemetry voice. */
export function Tags({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('mn-tags', className)}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
