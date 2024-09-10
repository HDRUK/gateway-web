  import { Metadata } from 'next'
  import { Robots } from 'next/dist/lib/metadata/types/metadata-types'
  
  export interface MetaParams {
    title: string
    url: string
    description: string
    image?: string
    siteName?: string
  }

  export const followRobots: Robots = {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }

  const defaultRobots: Robots = {
    index: false,
    follow: false,
    nocache: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }

  export default function generateMetaData(meta: MetaParams, crawlers:Robots = defaultRobots): Metadata {
    return {
      title: meta.title,
      metadataBase: new URL(meta.url),
      description: meta.description,
      openGraph:  (meta.image) ? {
        title: meta.title,
        description: meta.description,
        url: meta.url,
        siteName: meta.siteName ?? meta.title,
        images: [
          {
            url: meta.image,
            width: 800,
            height: 600
          }
        ],
        locale: 'en',
        type: 'website'
      } : undefined,
      robots: crawlers
    }
  }
  