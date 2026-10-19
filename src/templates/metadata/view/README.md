# Metadata view templates

How a dataset's metadata is rendered on the Gateway dataset page.

The Gateway renders **native GWDM only**. The v2 API returns GWDM when no
schema is requested and says which version in `data.schema`; the page fetches
that version's JSON Schema from TRASER, and every label, tooltip and layout
decision comes from it. CRUK, PRUK and HDRUK datasets are all stored as GWDM,
so one renderer handles all of them - a partner never needs code to have its
datasets shown.

```
src/templates/metadata/view/
  overrides/
    HDRUK/default/index.mdx   the Gateway default - the existing page's layout
    CRUK/default/index.mdx    CRUK's arrangement (demonstration)
  components/                 template vocabulary shared by every template
    DatasetSection/  FieldStrip/  Prose/  SectionNav/
  baseComponents.tsx          binds that vocabulary to the dataset
  resolveTemplate.ts          resolution chain (pure, unit-tested)
  registry.ts                 resolves against the generated registry
  registry.generated.ts       AUTO-GENERATED - never edit
  meta.ts                     shared types
```

The generic renderer lives in [`src/modules/MetadataView`](../../../modules/MetadataView).
It is schema-agnostic.

## Turning it on

The existing route, `/dataset/[datasetId]`, renders this page when the
**`GwdmDatasetPage`** Pennant flag is on, and the existing HDRUK-translated
page when it is off (the default). Same URL either way, so every link to a
dataset keeps working; the flag is fetched per request (`no-store`) and, when
logged in, per user - so it can be enabled for internal testers first. The
GWDM page lives in the route's private `_gwdm/` folder.

## What a template controls - and what it cannot

```
┌──────────────────────── DatasetPageShell (fixed) ────────────────────────┐
│ back link · ActionBar (DAR, enquiries, library, downloads) · section nav │
│ title + custodian link · stats · mind map · Sources · linkages · JSON-LD │
│ ┌──────────────────── content area (template) ──────────────────────┐   │
│ │  <DatasetSection>, <FieldStrip>, <Prose>, <MetadataView>           │   │
│ └────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

Gateway branding is the shell's job, not the template's. Templates are given
**content tags only** - there is no tag for the action bar, the title or the
layout, so a template cannot drop or restyle them. Markdown inside a template
is mapped onto the design-system `Typography`/`Link` by
[`src/mdx-components.tsx`](../../../mdx-components.tsx), and the renderer uses
the same `@hdruk/ui` theme tokens as the rest of the site.

`DatasetPageShell.test.tsx` enforces this. It renders **every registered
template** against GWDM 2.0 and 2.1 fixtures and fails if the action bar, title,
custodian link or Sources are missing, or if any section nav link points at a
section that did not render. A new template is covered the moment it exists.

**Values render exactly as the production page renders them.**
[`gateway/gatewayComponents.tsx`](./gateway/gatewayComponents.tsx) maps the
renderer's strategies onto the components `DatasetContent` uses - sanitised
markdown for text, `DD/MM/YYYY` dates, comma-separated lists, green search
buttons for `summary.keywords` and `summary.datasetAliases`, `doi.org` links for
`summary.doiName`, and the bordered Gateway `Table`. Observations, demographics
and structural metadata use the production table and "Open table" modals
([`gateway/gatewaySections.tsx`](./gateway/gatewaySections.tsx)). The
vocabulary binds these for every template, and the generic `MetadataView`
stays brand-neutral; renderers recognise fields by the `path` they receive.

The production chrome components still read HDRUK paths. The shell gives them
a compatibility view built by `lib/gwdmPageFacts.ts` (custodian from
`summary.publisher`, material types from `tissuesSampleCollection`, GWDM's flat
`structuralMetadata` array as `{ tables }`), and maps their hard-coded scroll
anchors onto GWDM section anchors via `GWDM_SCROLL_TARGETS`.

## The HDRUK default mirrors the existing page

`overrides/HDRUK/default` sets `meta.layout: "production"` and renders
`<ProductionSections />` ([`production/`](./production)): the existing page's
own sections, field labels, tooltips, order, nav and anchors, taken from its
`datasetFields` config and read from native GWDM. `productionLayout.ts` maps
each of those HDRUK 4.1.0 fields to the GWDM field it is translated from - the
map was traced through TRASER itself - and a test fails if a production field
is neither mapped nor listed as absent from GWDM (`accessMode`,
`dataUsePermissions`). This layout needs no GWDM schema, so a TRASER outage
does not hide the metadata.

DUO codes (GWDM 2.2's `accessibility.usage.duoCodes`) render as the existing
page's labelled chips; GWDM has no DUO labels, so both pages read them from the
HDRUK schema's `DuoCodesEnum`.

## Which template wins

Templates are keyed by the dataset's `partner_context` and GWDM version, most
specific first:

```
overrides/{partner}/{gwdmVersion}  ->  overrides/{partner}/default
  -> overrides/HDRUK/{gwdmVersion} ->  overrides/HDRUK/default
```

| Dataset                      | Resolves to                       |
| ---------------------------- | --------------------------------- |
| CRUK, GWDM 2.1               | `CRUK/default`                    |
| PRUK, GWDM 2.2               | `HDRUK/default` (no PRUK folder)  |
| HDRUK, GWDM 2.2              | `HDRUK/default`, or `HDRUK/2.2` if created |

`HDRUK/default` must exist; resolution throws without it. A partner folder is
only ever about **arrangement** - order, emphasis, what is lifted into a strip -
because the data and schema are the same GWDM either way.

## Adding a template

Create one file - the path is the registration:

```
src/templates/metadata/view/overrides/PRUK/default/index.mdx
```

Restart the dev server. `next.config.js` runs
[`scripts/generateTemplateRegistry.js`](../../../../scripts/generateTemplateRegistry.js)
on startup, which rewrites `registry.generated.ts`; commit that alongside the
template. Run `npm run generate:template-registry` to do it by hand.

Every template exports `meta`:

```mdx
export const meta = {
  description: "What this arrangement is for.",
  sections: ["summary", "projectGrants", "coverage"],
};
```

`meta.sections` builds the section nav, which sits in an earlier column than
the content and so cannot observe what rendered. **List the sections in the
order the template renders them.** Sections with no data, and names a GWDM
version does not have, drop out of the nav and the page together.

For extra components used by one template only, add a sibling
`components.tsx` exporting `makeComponents(ctx)`; spread
`makeBaseComponents(ctx)` first.

## Writing a template

Templates are MDX: markdown plus component tags. **No imports** - the Jest
transform and the build both rely on that.

```mdx
<DatasetSection name="summary" fields exclude={["title", "abstract"]}>
  <Prose field="abstract" />
</DatasetSection>

<DatasetSection name="coverage" />

<FieldStrip path="required" fields={["version", "issued", "modified"]} />
```

| Tag                                   | What it does                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| `<DatasetSection name>`               | One GWDM section as label/value rows; children receive the section's data    |
| `<FieldStrip fields path?>`           | Named fields as one compact strip; `path` reaches nested nodes (`required`)   |
| `<Prose field>`                       | One field as a lead paragraph                                                |
| `<MetadataView path? include? exclude? components?>` | The generic renderer, pre-bound to the dataset              |

List every section unconditionally. A field with no data renders nothing; a
section whose fields are all empty renders nothing; `false` and `0` are answers
and always render; the schemas' `-1` "not reported" sentinel drops. Labels and
tooltips come from the schema's own `title` and `description`.

### How values render

| Shape                                      | Renders as                                                     |
| ------------------------------------------ | -------------------------------------------------------------- |
| Object, however deeply nested              | One label/value row per leaf                                   |
| Array of uniform flat objects              | A table, empty columns dropped; one column collapses to a list |
| Array of objects with nesting of their own | An accordion each                                              |
| Array of scalars, or a `;,;` string        | Chips                                                          |
| `format: date`/`date-time`, `uri`/`url`    | A formatted date, a link                                       |

A section holding a container gets a heading; one holding a single value is
laid out as a row. Both get the `#section-{key}` anchor the nav links to.

## Generated schema types

`src/generated/schemas/GWDM/{2.0,2.1,2.2}.ts` type `props.data` in the editor.
They are generated from schemata-2 - the same files TRASER serves - by
`npm run generate:schema-types`, which fetches over the network and does not
run on build. Re-run it when the upstream schema changes and commit the output.

Template type checking is **editor-only** (`"mdx": { "checkMdx": true }` in
`tsconfig.json`, via the MDX language server); `tsc` cannot read `.mdx`. The
contract test is what CI relies on.

## Testing

Jest compiles templates with [`jest/mdxTransform.js`](../../../../jest/mdxTransform.js),
which runs `@mdx-js/mdx` in a child process (it is ESM-only, and CI's Node 20
cannot `require()` it). Fixtures in `mocks/data/dataset/gwdm` are synthetic
GWDM 2.0 (HDRUK) and 2.1 (CRUK) records alongside the real public GWDM schemas.
