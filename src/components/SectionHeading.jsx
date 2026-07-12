export default function SectionHeading({ eyebrow, title, description, align = 'left', titleId }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 id={titleId}>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
