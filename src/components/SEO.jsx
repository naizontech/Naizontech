'use client'

import { useEffect } from 'react'

const SITE_URL = 'https://naizon.in'
const DEFAULT_IMAGE = `${SITE_URL}/images/hero.jpg`

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
}

export default function SEO({ title, description, path = '/', image = DEFAULT_IMAGE, noindex = false, schemas = [] }) {
  useEffect(() => {
    const canonical = `${SITE_URL}${path === '/' ? '' : path}`
    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large' })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'NAIZON — Custom Software Development & Digital Solutions' })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })

    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical

    document.querySelectorAll('script[data-naizon-schema]').forEach((node) => node.remove())
    schemas.forEach((schema) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.naizonSchema = 'true'
      script.text = JSON.stringify(schema)
      document.head.appendChild(script)
    })
  }, [title, description, path, image, noindex, schemas])

  return null
}

export { organizationSchema, websiteSchema, breadcrumbSchema } from '../data/schemas'
