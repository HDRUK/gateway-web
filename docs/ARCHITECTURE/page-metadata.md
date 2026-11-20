# Page metadata and Open Graph

Every page exports its metadata through `metaData()` in `src/utils/metadata.ts`. It produces the `<title>`, description, robots, canonical, [Open Graph](https://ogp.me/) and Twitter card tags in one place, so pages only supply content.

## `metaData(meta, crawlers?)`

| Param         | Effect                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`       | Cleaned to plain text (`toPlainText`), then suffixed with ` - Health Data Research Gateway` unless `isDefault` is set. Used for `<title>`, `og:title`, `twitter:title`, and the generated share image. |
| `description` | Cleaned to plain text and cut at a word boundary to 160 characters (`toMetaDescription`). Safe to pass raw API or CMS content, `null` or `undefined`. Empty falls back to `SITE_DESCRIPTION`.          |
| `url`         | Path of the page, e.g. `/en/dataset/123`. Sets `<link rel="canonical">` and `og:url`.                                                                                                                  |
| `image`       | Overrides the generated share image.                                                                                                                                                                   |
| `entity`      | `{ type, id }` of the page's entity. The generated card looks up the entity's image (see below).                                                                                                       |
| `ogType`      | `og:type`; defaults to `website`. News and event articles pass `article`.                                                                                                                              |
| `siteName`    | Overrides `og:site_name`.                                                                                                                                                                              |
| `crawlers`    | Robots rules; pass `noFollowRobots` for pages that must not be indexed. Those pages also get no share tags (see below).                                                                                |

`toPlainText` (titles) reads text out of rich-text editor (TipTap) JSON, strips HTML tags, decodes HTML entities and collapses whitespace. `toMetaDescription` does the same and also reduces Markdown to its text, because collection descriptions, custodian introductions and network summaries are Markdown: links keep their text, images are dropped, `#` heading markers go, and `**`/`__` are removed only when they wrap text, so names like `CPRD__Aurum` survive. Titles are entity names, not Markdown, so they keep those characters. A tag is `<` followed by a letter up to the next `>`, so `<16` survives but text such as `a<b and c>d` loses `<b and c>`.

An empty description falls back to `SITE_DESCRIPTION` (`src/consts/application.ts`), so a page or entity with no description still gets a description and a full share preview.

`metadataBase` is set once in `src/app/layout.tsx` from `NEXT_PUBLIC_GATEWAY_URL`, so relative image and canonical URLs are emitted as absolute URLs, which link-preview crawlers require.

### Which pages get share tags

Open Graph and Twitter tags are opt-in per page, never inherited from a layout:

-   **Public pages** that call `metaData()` with the default robots get them. That includes the homepage (`src/app/[locale]/page.tsx`).
-   **Hidden pages** that pass `noFollowRobots` (account and team pages, search, verification) get `openGraph: null` and `twitter: null`. Setting `null` also blocks anything a parent layout might add.
-   **The `[locale]` layout** exports `defaultMetadata`: title, `SITE_DESCRIPTION` and robots only. Error pages (`/error/*`), `error.tsx` boundaries and 404s inherit only those, so they get no share tags.
-   **Widget routes** (`/widgets/[slug]`, the iframe embedded on third-party sites) sit outside `[locale]` and inherit only the root layout (`metadataBase` and icons). `src/app/widgets/[slug]/page.contract.test.tsx` fails if the widget page or the root layout ever gains share, canonical or page metadata.

The check is `crawlers === followRobots`, a reference comparison, not the `index` value. In environments with `BLOCK_ROBOTS=true` every page is `noindex`, but public pages still get share tags, so cards can be tested on dev and preprod.

## Share image: `/api/og`

`src/app/api/og/route.tsx` (`apis.ogImageInternalUrl`) renders a 1200×630 PNG (`OG_IMAGE_SIZE`) with `next/og` on the brand primary colour:

-   **Site card**: no title, or a title equal to `SITE_NAME` (the homepage). The Gateway logo alone, large and centred.
-   **Page card**: the Gateway logo above the page title (`?title=`, clamped to 100 characters).
-   **Entity card**: a page card with the entity's image in a white panel on the right, scaled to fit. The white panel keeps transparent logos legible on any platform.

`metaData()` points `og:image` and `twitter:image` at this route by default, so every page gets a card with no extra work.

### Entity images

The route never takes an image URL. It takes `?type=&id=` and looks the image up with the same getters the pages use. Only known types and numeric ids are accepted. Lookups are made with `isPublic`, so no visitor cookies are forwarded and a publicly cached card only ever shows what anonymous visitors can see.

Image URLs come from fields team admins control, so before fetching one the route checks it against the same `remotePatterns` that `next/image` uses (`src/config/remoteImagePatterns.js`, shared with `next.config.js`). Redirects are not followed. The server only ever fetches images from hosts the site already displays images from.

| `type`                 | Image                                                     |
| ---------------------- | --------------------------------------------------------- |
| `collection`           | Collection `image_link`, else its custodian's `team_logo` |
| `dataCustodian`        | `team_logo`                                               |
| `dataCustodianNetwork` | `img_url`                                                 |
| `dataset`              | Custodian's `team_logo`                                   |
| `dataUse`              | Custodian's `team_logo`                                   |

Tools and publications have no image and get the page card. Images must be PNG, JPEG or SVG and under 5 MB (a larger `Content-Length` is rejected before download); anything else, a disallowed host, a redirect or a failed fetch falls back to the page card.

### Logo, font and caching

-   The Gateway logo is `StaticImages.BASE.logo`. The title font is Source Sans 3 Bold, the site font. Satori can't read variable fonts or the WOFF2 that `next/font` serves, so the route fetches Google Fonts' static Bold TTF from a pinned, versioned `fonts.gstatic.com` URL (`FONT_URL`). The font is used, not redistributed, so nothing is committed and no licence file is needed. To pick up a newer version, take the TTF URL from `https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@700`, requested without a browser user agent.
-   Logo and font are loaded once per server process and kept in memory. Remote fetches have a 3 second timeout, and failures are logged through `logger` at location `api/og`. A failed load is retried on the next request; meanwhile the card shows the site name as text, or uses `next/og`'s default font (Geist Regular).
-   Responses are cached for a day (`Cache-Control: public, max-age=86400`) when the logo, font and any entity image loaded, and `no-store` otherwise, so a degraded card isn't cached. An entity with no image, or with an image in an unsupported format, is still cached because that won't change on retry. A missing entity, failed or redirected fetch, disallowed host or oversized image is not.
-   Colours come from `tokens` in `@hdruk/ui/theme`. Satori only understands inline `style` objects and `<img>`, so MUI `sx` and `next/image` don't apply in this file.

## Entity pages

Public entity pages use `generateMetadata` so shared links show the entity's own name and description:

| Page                   | Source                                             | Title / description             |
| ---------------------- | -------------------------------------------------- | ------------------------------- |
| Dataset                | `getDataset(id, "SchemaOrg", "GoogleRecommended")` | `name` / `description`          |
| Collection             | `getReducedCollection`                             | `name` / `description`          |
| Tool                   | `getReducedTool`                                   | `name` / `description`          |
| Data use               | `getDataUse`                                       | `project_title` / `lay_summary` |
| Publication            | `getPublication`                                   | `paper_title` / `abstract`      |
| Data custodian         | `getTeamInfo`                                      | `name` / `introduction`         |
| Data custodian network | `getNetworkInfo`                                   | `name` / `summary`              |
| News / event article   | `getContentPostQuery`                              | `title` / `content`             |

### Adding metadata to a new entity page

Call the same getter, with the same options, that the page body uses. Next memoises identical GET `fetch` calls within a request, so `generateMetadata` and the page share one API call. Fall back to a static title when the fetch fails; the page body is still responsible for `notFound()`.

```tsx
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; collectionId: string }>;
}) {
    const { locale, collectionId } = await params;
    const collection = await getReducedCollection(collectionId, {
        suppressError: true,
    });

    return metaData({
        title: collection?.name || PAGE_TITLE_FALLBACKS.collection,
        description: collection?.description,
        url: `/${locale}/${RouteName.COLLECTION_ITEM}/${collectionId}`,
        entity: { type: "collection", id: collectionId },
    });
}
```

Add the fallback title to `PAGE_TITLE_FALLBACKS` in `src/consts/application.ts`. If the entity has an image, add its type to `OgEntityType` in `src/utils/metadata.ts` and its lookup to `ENTITY_IMAGE_URLS` in the route, passing `PUBLIC_GET` and wrapping the result in `requireEntity`. If the image is served from a new host, add it to `src/config/remoteImagePatterns.js`.

The CMS is queried with POST requests, which Next does not memoise. Wrap the query in React `cache()` and call that wrapper from both `generateMetadata` and the page (see `news/article/[slug]/page.tsx`).
