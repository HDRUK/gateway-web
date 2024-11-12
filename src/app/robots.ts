import type { MetadataRoute } from 'next'

const { NEXT_PUBLIC_GATEWAY_URL } = process.env;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/sign-in', '/search'],
    },
    sitemap: `${NEXT_PUBLIC_GATEWAY_URL}/sitemap.xml`,
  }
}