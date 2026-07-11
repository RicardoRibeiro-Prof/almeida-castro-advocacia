import { FileSearch } from 'lucide-react'

export default function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <FileSearch size={38} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
