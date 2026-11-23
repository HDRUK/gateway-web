# Partners page (GAT-8366)

`/about/partners` renders a WordPress page and is linked from the **About** menu.

-   Route: `RouteName.PARTNERS` (`src/consts/routeName.ts`)
-   Nav entry: About → Partners (`src/config/nav.ts`)
-   Content: `getPartners()` in `src/utils/cms.ts` fetches the WordPress page with URI `partners`
-   Page: `src/app/[locale]/(logged-out)/about/partners/page.tsx`, the same layout as the other About CMS pages (banner + `wpStyles` content)

If the WordPress page doesn't exist, or isn't published at the `partners` slug, the route returns a 404.
