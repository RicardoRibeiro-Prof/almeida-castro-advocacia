import DOMPurify from 'dompurify'

const config = {
  ALLOWED_TAGS: [
    'h2',
    'h3',
    'h4',
    'p',
    'strong',
    'b',
    'em',
    'i',
    'ul',
    'ol',
    'li',
    'a',
    'blockquote',
    'br',
    'hr',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
}

export function sanitizeHtml(html = '') {
  return DOMPurify.sanitize(html, config)
}
