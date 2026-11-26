# Partners page (GAT-8366)

`/about/partners` renders the WordPress **Partners** page and is linked from the **About** menu.

-   Route: `RouteName.PARTNERS` (`src/consts/routeName.ts`)
-   Nav entry: About → Partners (`src/config/nav.ts`)
-   Content: `getPartners()` in `src/utils/cms.ts` fetches the page with URI `partners`, plus its ACF fields
-   Page: `src/app/[locale]/(logged-out)/about/partners/page.tsx`

## WordPress fields

The page's body content is the intro text. The partners come from an ACF field group shown on the Partners page:

| ACF                                 | GraphQL                         | Rendered as                         |
| ----------------------------------- | ------------------------------- | ----------------------------------- |
| Field group (GraphQL type name)     | `partners`                      | —                                   |
| Repeater                            | `partnerList`                   | one row per partner                 |
| Title (Text)                        | `title`                         | `h3`                                |
| Description (WYSIWYG)               | `description`                   | sanitised HTML (`HTMLContent`)      |
| Image (Image)                       | `image.node.sourceUrl/altText`  | logo, left of the text from `sm` up |

Rows are rendered by `components/PartnerList`, with styles in `PartnerList.styles.ts`. Below `sm` the logo stacks above the text.

If the page isn't published at the `partners` slug, the route returns a 404. If the repeater is empty, only the intro renders.
