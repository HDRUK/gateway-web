# Account left nav

The account and team pages (`account/profile/layout.tsx`, `account/team/[teamId]/(withLeftNav)/layout.tsx`) render `src/modules/LeftNav`. The module is a thin adapter: it picks the items and works out which one is current, and `@hdruk/ui` draws the nav.

| Library component | Used for                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| `LeftNav`         | the `<nav>` landmark, the heading row with the collapse toggle, the icon-only rail and the mobile toggle |
| `MenuItem`        | each link, rendered as `next/link` via `component={Link}`                                                |
| `MenuDropdown`    | each item with `subItems`, which discloses its links                                                     |

## Items

`getProfileNav` and `getTeamNav` in `src/utils/nav.tsx` decide which items a user sees from their permissions, roles and feature flags. Add or remove an entry there, not in the module.

## Which item is current

-   A top-level link is current when its `href` equals the path without the locale.
-   A sub-link is current when the path equals its `matchPath ?? href`, or sits below it. `matchPath` lets one link stay current across several routes (Integrations › Custom Integrations is current on every `api-management/*` page).
-   The current link gets `selected` (green bar and bold label) and `aria-current="page"`.
-   A section opens whenever the current page becomes one of its sub-links, on first load or after client-side navigation (each `MenuDropdown` is keyed on whether it holds the current page, so it remounts open). Sections open and close independently after that, and moving between pages of the same section keeps the user's choice.

## Rail and persistence

The toggle in the heading row collapses the nav to a 48px icon-only rail, where each item keeps its accessible name and shows a tooltip. The choice is saved in the `leftNavOpen` cookie (`config.LEFT_NAV_COOKIE`) from `onChange`. The layouts read that cookie server-side and pass it as `initialLeftNavOpen`, so the nav renders in the right state with no flash.

Below the `sm` breakpoint the rail does not apply. The heading row becomes a toggle that shows and hides the list, and following a link closes it again.

## Icons

Item icons are `@hdruk/ui` `Icon` elements (Material Symbols names) set in `src/utils/nav.tsx` and size to 24px in the item's icon slot. The chevrons and the rail toggle use the library's `Icon`, which renders with the Material Symbols Rounded font. The locale layout (`src/app/[locale]/layout.tsx`) imports `@material-symbols/font-300/rounded.css`, which self-hosts the weight-300 face (matching `tokens.iconWeight`) and defines the `.material-symbols-rounded` class the `Icon` uses. It is served first-party, so visitors' browsers make no request to Google, and with `font-display: block` icons never flash as their ligature names. The browser only downloads the font on pages that render an icon. If `tokens.iconWeight` changes, swap the package for the matching `@material-symbols/font-<weight>`. Below the `sm` breakpoint the open mobile toggle is a selected horizontal `MenuItem`, so it shows the green bottom bar.

## Styling

Styles come from the library theme. To restyle the nav, add `HdrukLeftNav`, `HdrukMenuItem` or `HdrukMenuDropdown` overrides to the theme in `src/config/theme.ts`, never `sx` on the module. A site override wins over the library default, and the library styles it doesn't mention stay in place.
