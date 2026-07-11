import { Link } from 'react-router-dom'
import { SITE_SHORT_NAME } from '../utils/constants'

export default function Brand({ footer = false }) {
  return (
    <Link
      className={`brand ${footer ? 'brand--footer' : ''}`}
      to="/"
      aria-label={`${SITE_SHORT_NAME} - página inicial`}
    >
      <span className="brand__mark" aria-hidden="true">
        <span className="brand__letter brand__letter--top">A</span>
        <span className="brand__amp">&</span>
        <span className="brand__letter brand__letter--bottom">C</span>
      </span>

      <span className="brand__text">
        <strong>Almeida & Castro</strong>
        <small>Advocacia</small>
      </span>
    </Link>
  )
}
