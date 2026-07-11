import { load } from 'js-yaml'
import categoriesRaw from '../content/settings/categories.yml?raw'
import { createSlug } from '../utils/format'

const parsed = load(categoriesRaw) || {}

const categories = (parsed.categories || [])
  .map((category) => ({
    id: category.slug || createSlug(category.name),
    name: category.name,
    slug: category.slug || createSlug(category.name),
  }))
  .filter((category) => category.name)
  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

export async function getCategories() {
  return categories
}
