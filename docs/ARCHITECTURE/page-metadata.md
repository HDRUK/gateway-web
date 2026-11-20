# Page metadata and Open Graph

Every page exports its metadata through `metaData()` in `src/utils/metadata.ts`. It produces the `<title>`, description, robots, canonical, [Open Graph](https://ogp.me/) and Twitter card tags in one place, so pages only supply content.

## `metaData(meta, crawlers?)`

| Param         | Effect                                                                                                                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | Cleaned to plain text (`toPlainText`), then suffixed with ` - Health Data Research Gateway` unless `isDefault` is set. Used for `<title>`, `og:title` and `twitter:title`, never in the share image URL. |
| `description` | Cleaned to plain text and cut at a word boundary to 160 characters (`toMetaDescription`). Safe to pass raw API or CMS content, `null` or `undefined`. Empty falls back to `SITE_DESCRIPTION`.            |
| `url`         | Path of the page, e.g. `/en/dataset/123`. Sets `<link rel="canonical">` and `og:url`.                                                                                                                    |
| `image`       | Overrides the generated share image.                                                                                                                                                                     |
| `entity`      | `{ type, id }` of the page's entity, set by `pageMetaData`. The card URL becomes `/api/og?type=&id=` and the route looks up the title and image itself (see below).                                      |
| `ogType`      | `og:type`; defaults to `website`. News and event articles pass `article`.                                                                                                                                |
| `siteName`    | Overrides `og:site_name`.                                                                                                                                                                                |
| `crawlers`    | Robots rules; pass `noFollowRobots` for pages that must not be indexed. Those pages also get no share tags (see below).                                                                                  |

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

-   **Site card**: the Gateway logo alone, large and centred. This is `/api/og` with no `type`/`id`, used by the homepage and every page without an entity. It is also the result for any invalid query.
-   **Page card**: the Gateway logo above the entity's title (clamped to 100 characters).
-   **Entity card**: a page card with the entity's image in a white panel on the right, scaled to fit. The white panel keeps transparent logos legible on any platform.

`metaData()` points `og:image` and `twitter:image` at this route by default, so every page gets a card with no extra work. Entity pages (through `pageMetaData`) add `?type=&id=`.

### Titles and images come from the server

The route never accepts text or an image URL. It takes only `?type=&id=` and looks the title and image up through `loadPageCard` in `src/utils/pageMetadata.ts`, the same loaders the pages' `generateMetadata` uses. A card can therefore only show what the page itself shows, and the set of distinct card URLs is bounded by real entities. Anything else in the query string, including a `title`, is ignored.

-   `type` must be a key of `PAGE_TYPES`.
-   `id` must match `/^[a-z0-9-]+$/i`. Numeric entity ids and WordPress slugs both pass, and nothing else reaches the CMS query, which pastes the slug into GraphQL.
-   No or invalid `type`/`id` renders the site card, which is cacheable: one image whatever the query string. A valid `type`/`id` that isn't found, or whose lookup fails, renders the site card with `no-store`.
-   Lookups are made with `isPublic`, so no visitor cookies are forwarded and a publicly cached card only ever shows what anonymous visitors can see.

Image URLs come from fields team admins control, so before fetching one the route checks it against the same `remotePatterns` that `next/image` uses (`src/config/remoteImagePatterns.js`, shared with `next.config.js`). Redirects are not followed. The server only ever fetches images from hosts the site already displays images from.

| `type`                 | Image                                                     |
| ---------------------- | --------------------------------------------------------- |
| `collection`           | Collection `image_link`, else its custodian's `team_logo` |
| `dataCustodian`        | `team_logo`                                               |
| `dataCustodianNetwork` | `img_url`                                                 |
| `dataset`              | Custodian's `team_logo`                                   |
| `dataUse`              | Custodian's `team_logo`                                   |

Tools, publications, and news and event articles have no image and get the page card. Images must be PNG, JPEG or SVG and under 5 MB (a larger `Content-Length` is rejected before download); anything else, a disallowed host, a redirect or a failed fetch falls back to the page card.

### Logo, font and caching

-   The Gateway logo is `StaticImages.BASE.logo`. The title font is Source Sans 3 Bold, the site font. Satori can't read variable fonts or the WOFF2 that `next/font` serves, so the route fetches Google Fonts' static Bold TTF from a pinned, versioned `fonts.gstatic.com` URL (`FONT_URL`). The font is used, not redistributed, so nothing is committed and no licence file is needed. To pick up a newer version, take the TTF URL from `https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@700`, requested without a browser user agent.
-   Logo and font are loaded once per server process and kept in memory. Remote fetches have a 3 second timeout, and failures are logged through `logger` at location `api/og`. A failed load is retried on the next request; meanwhile the card shows the site name as text, or uses `next/og`'s default font (Geist Regular).
-   Responses are cached for a day (`Cache-Control: public, max-age=86400`) when the logo, font and any entity image loaded, and `no-store` otherwise, so a degraded card isn't cached. An entity with no image, or with an image in an unsupported format, is still cached because that won't change on retry. A missing entity, failed or redirected fetch, disallowed host or oversized image is not.
-   Colours come from `tokens` in `@hdruk/ui/theme`. Satori only understands inline `style` objects and `<img>`, so MUI `sx` and `next/image` don't apply in this file.

## Entity pages

Public entity pages call `pageMetaData(type, id, locale)` from `src/utils/pageMetadata.ts` in `generateMetadata`, so shared links show the entity's own name and description. `type` is an `EntityType` (`src/consts/application.ts`); its values are what `/api/og?type=` accepts. One `PAGE_TYPES` entry per type defines where the content comes from, and both the page and the share card use it:

| `type`                 | Source                                             | Title / description               | Image                                    |
| ---------------------- | -------------------------------------------------- | --------------------------------- | ---------------------------------------- |
| `dataset`              | `getDataset(id, "SchemaOrg", "GoogleRecommended")` | `name` / `description`            | custodian `team_logo`                    |
| `collection`           | `getReducedCollection`                             | `name` / `description`            | `image_link`, else custodian `team_logo` |
| `tool`                 | `getReducedTool`                                   | `name` / `description`            | —                                        |
| `dataUse`              | `getDataUse`                                       | `project_title` / `lay_summary`   | custodian `team_logo`                    |
| `publication`          | `getPublication`                                   | `paper_title` / `abstract`        | —                                        |
| `dataCustodian`        | `getTeamInfo`                                      | `name` / `introduction`           | `team_logo`                              |
| `dataCustodianNetwork` | `getNetworkInfo`                                   | `name` / `summary`                | `img_url`                                |
| `newsArticle`          | `getNewsArticle(slug)`                             | `title` + ` - News` / `content`   | —                                        |
| `eventArticle`         | `getEventArticle(slug)`                            | `title` + ` - Events` / `content` | —                                        |

### Nothing leaks from hidden entities

Each `load` returns nothing unless its page would show the entity. That rule mirrors the page's `notFound()` condition:

| `type`                                                    | Visible when                                                                   |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `collection`, `dataset`, `tool`, `dataUse`, `publication` | `status === DataStatus.ACTIVE`                                                 |
| `dataCustodian`, `dataCustodianNetwork`                   | the entity exists                                                              |
| `newsArticle`, `eventArticle`                             | the post is in `CmsCategory.NEWS` / `CmsCategory.EVENTS` (`src/consts/cms.ts`) |

The public API returns draft and archived entities to anonymous callers, so this check is what keeps them out:

-   A hidden or missing entity's page gets only the fallback title from `PAGE_TITLE_FALLBACKS` (`src/consts/application.ts`), or the slug for articles, plus the site description. That metadata is embedded in the 404 response, so without this check a draft's name and description would ship inside it.
-   Its card is the site card, with `no-store`.

The page body is still responsible for `notFound()`.

```tsx
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; collectionId: string }>;
}) {
    const { locale, collectionId } = await params;

    return pageMetaData(EntityType.COLLECTION, collectionId, locale);
}
```

### Adding a new entity page

1. Add a member to `EntityType` in `src/consts/application.ts`, and its fallback title to `PAGE_TITLE_FALLBACKS` (keyed by `EntityType`).
2. Add an entry to `PAGE_TYPES` with `route`, `fallbackTitle`, an optional `titleSuffix` and `ogType`, and `load(id, options)`. `load` returns `{ title, description, image }`, or nothing whenever the page would 404 (not found, not `ACTIVE`, wrong category). Get this wrong and the entity's details leak into 404 responses and cards.
3. `load` must call the same getter the page body uses and pass on the `options` it receives:
    - **Pages** pass `{ suppressError: true }`, so Next's request memoisation shares one API call between `generateMetadata` and the body. This was measured against the local API: one request per page view.
    - **The card route** also passes `isPublic`.
4. If the image is served from a new host, add the host to `src/config/remoteImagePatterns.js`.

The CMS is queried with POST requests, which Next does not memoise. `getNewsArticle` and `getEventArticle` therefore live in `pageMetadata.ts`, wrapped in React `cache()`, and the article pages use them for their body too. Jest runs React 18.2, which has no `cache`, so `jest.setup.js` polyfills it as a pass-through.
