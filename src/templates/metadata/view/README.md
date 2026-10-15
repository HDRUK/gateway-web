# Metadata view templates

How a dataset's metadata is rendered, per schema and per version.

```
src/templates/metadata/view/
  Default.mdx              global fallback, used when nothing else matches
  overrides/
    HDRUK/4.1.0/
      index.mdx            the template
      components.tsx       optional: extra components for this template only
    GWDM/2.2/
      index.mdx
      components.tsx
    GWDM/2.0/
      index.mdx            no components.tsx - gets the base vocabulary only
  components/              template vocabulary shared by every template
    DatasetSection/
    FieldStrip/
    Prose/
  baseComponents.tsx       binds that vocabulary to the dataset
  registry.ts              resolution chain (hand-written)
  registry.generated.ts    AUTO-GENERATED - never edit
  MetadataTemplate.tsx     resolves a template and renders it
  meta.ts                  shared types
```

The generic renderer itself lives separately in
[`src/modules/MetadataView`](../../../modules/MetadataView) — it is
schema-agnostic and intended to be extractable into its own package.

## Adding a template

**Create one file.** That is the whole process:

```
src/templates/metadata/view/overrides/HDRUK/4.2.0/index.mdx
```

The path _is_ the registration — `overrides/{SCHEMA_NAME}/{version}/index.mdx`.
There is no list to update and no import to add. A folder per version means a
template can grow its own components, notes or tests without cluttering the
schema folder.

Then restart the dev server. A generator (`generateTemplateRegistry.js` at the
repo root) scans the folder and rewrites `registry.generated.ts` with static
imports. It runs automatically from `next.config.js` whenever `next dev` or
`next build` starts, so the only reason to run it by hand is to inspect the
output:

```bash
npm run generate:template-registry
```

Because `next.config.js` is read once at startup, a _new_ template needs a dev
server restart. Editing an existing one hot-reloads normally.

> Codegen rather than a dynamic `import()` because this code is built four ways
> — Turbopack dev, Turbopack build, webpack Storybook, and Jest with no bundler
> at all. Context modules are a bundler feature and would be invisible to the
> last two. Generated static imports are just imports.

### Which template wins

Most specific first:

| Dataset schema  | Resolves to                                            |
| --------------- | ------------------------------------------------------ |
| `HDRUK` `4.1.0` | `overrides/HDRUK/4.1.0/index.mdx`                      |
| `HDRUK` `3.0.0` | `overrides/HDRUK/default/index.mdx`, if you create one |
| `CRUK` `1.0.0`  | `Default.mdx`                                          |

### Adding components for one template

Add `components.tsx` next to the template's `index.mdx`, exporting
`makeComponents` and a `Vocabulary` type. It is picked up automatically — same
rule, no registration.

```tsx
export type Section = keyof Hdruk420;

export type Vocabulary = BaseVocabulary<Section> & {
    MyThing: ComponentType;
};

export const makeComponents = (ctx: MetadataViewContext): Vocabulary => ({
    ...makeBaseComponents<Section>(ctx),
    MyThing: () => <Thing value={ctx.data.something} />,
});
```

Spread `makeBaseComponents(ctx)` first or the template loses `<Article>`,
`<MetadataView>`, `<DatasetSection>` and the layout primitives. Everything here
closes over the dataset, so templates use bare tags with no data wiring. The
`Vocabulary` type is what gives the `.mdx` typed tags — see
[Typing a template](#typing-a-template).

## What the default rendering does

Before reaching for an override, know what you already get. The generic
renderer picks a strategy per value, from the schema and the data together:

| Shape                                      | Renders as                                                                                                        |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Object, however deeply nested              | One label/value row per leaf — `provenance.origin.purpose` reads as a single row, "Purpose of dataset collection" |
| Array of uniform flat objects              | A table, columns from the item schema, all-empty columns dropped; one populated column collapses to a list        |
| Array of objects with nesting of their own | An accordion each, headed by the item's `name` or `title`                                                         |
| Array of scalars                           | Chips, or plain text when there is only one                                                                       |
| String containing `;,;`                    | Split and rendered as chips                                                                                       |
| String with `format: date`/`date-time`     | A formatted date                                                                                                  |
| String with `format: uri`/`url`            | A link                                                                                                            |

`structuralMetadata` needs no special handling as a result: `tables[]` carries
`columns[]`, so it becomes an accordion per table with a real columns table
inside, out of inference alone.

An `anyOf` resolves against the **data**, not just the schema. SchemaOrg's
`license` is `anyOf: [CreativeWork, string/uri, null]`; a plain URL picks the
string branch and renders as a link rather than resolving to an object with no
properties to show.

**A heading means a container, a row means a label/value pair** — nothing else
decides it. A section holding an object, list or table gets an `h2` and a rule
beneath; a section holding a single value is laid out as a field row, label in
the first third and value across the other two. That is why a scalar at the
top of the tree and a scalar three levels down look the same.

A heading shows its label plain, without the field labels' tooltip, so a
section title does not read as one of its own fields. Field labels keep the
tooltip wherever the schema supplies a `description`.

Labels and tooltips come from the schema's own `title` and `description`
throughout — the field's own, never borrowed from the `$def` behind a `$ref`,
which names a type (`Text`, `EmailAddress`) and not a field. A property with no
title of its own falls back to `startCase` of its key.

A field with no data renders nothing, and so does a section whose fields are
all empty, so a template can list every section unconditionally. `false` and
`0` are answers rather than absences and always render — a boolean reads
`Yes`/`No`. The schemas' own `-1` "not reported" sentinel still drops.

## Writing a template

Templates are MDX documents: markdown plus component tags. No imports, no
function declarations — if something needs a top-level function, it belongs in
the `components.tsx` sibling.

```mdx
export const meta = { description: "What this template is for." };

<Article>

# {props.title}

<MetadataView />

</Article>
```

### Typing a template

Two JSDoc typedefs at the top of the file do all the work:

```mdx
{/\*\*

-   @typedef {import("@/generated/schemas/HDRUK/4.1.0").Hdruk410} Hdruk410
-   @typedef {import("./components").Vocabulary} MDXProvidedComponents
-
-   @typedef Props
-   @property {Hdruk410} data
-   @property {string} [title]
    \*/}
```

`Props` types `props.data` to the generated model for the schema version, so
`props.data.summary.title` autocompletes. `MDXProvidedComponents` is the hook
the MDX language server uses to type the _tags_: an unknown tag name, a bad
prop, or a `name` that is not a section of this schema are all flagged. The
narrowing comes from `BaseVocabulary<keyof Hdruk410>` in `components.tsx`.

`Default.mdx` and templates with no `components.tsx` point
`MDXProvidedComponents` at `BaseVocabulary` instead.

> **This is editor-only.** `tsc` cannot parse `.mdx` at all, so `npm run
ts-lint` will never check a template and neither will CI. The diagnostics
> come from the MDX language server (the official MDX VS Code extension, or
> any editor running `mdx-analyzer`), switched on by `"mdx": { "checkMdx":
true }` in `tsconfig.json`. Treat a template as unchecked code that your
> editor happens to help with.

### Three levels of control

**1. Render everything.** The schema decides the sections, labels and tooltips.

```mdx
<MetadataView />
<MetadataView exclude={["provenance", "coverage"]} />
```

**2. Choose what renders** with `path`, which names one node and renders it as
a single titled section — its own heading, then its fields as rows.

```mdx
<MetadataView path="provenance" />
<MetadataView path="summary.publisher" />
```

`<MetadataView path="summary" />` and `<DatasetSection name="summary" />` are
the same thing; the latter only adds child injection.

Use `path` rather than passing `data` and `schema` by hand. Every property node
in these schemas is an `allOf`/`anyOf` wrapper around a `$ref`, so
`props.schema.properties.summary.properties` is **undefined** — a nested path
cannot be reached by property access at all. `path` resolves each hop, so it
can.

`exclude` always filters the children of whatever is being rendered: the
top-level sections normally, or the named node's own fields when `path` is
set. `include` is the selection, so `path` supersedes it — passing both ignores
`include`.

The explicit form remains for data you have computed yourself, where there is
no path to point at:

```mdx
<MetadataView
    data={{ ...props.data.summary, abstract: undefined }}
    schema={props.schema.properties.summary}
/>
```

`rootSchema` stays pinned to the full document behind the scenes, so `$ref`s
inside a subtree still resolve. Explicit `data`/`schema` win over `path`.

**3. Choose how a value renders** with `components`, keyed by render strategy
(`text`, `date`, `link`, `tagList`, `textList`, `objectGrid`, `objectList`,
`objectTable`, `nestedSection`) plus the `Container`, `Section` and
`FieldLabel` wrappers. A `Section` override receives `isBlock`, which says
whether the body is a labelled block or a single value — it accounts for a
one-column table collapsing to a list, so it is not simply the strategy.

```mdx
<MetadataView
    path="coverage"
    components={{ Section: p => <CardSection {...p} /> }}
/>
```

Each override receives `{ value, resolved, rootSchema, depth, renderDefault,
render }`, so it can decorate the built-in output rather than reimplement it,
or delegate child values back through `render` so they keep their normal
treatment.

> **Gotcha:** the components map resolves JSX element _names_, not identifiers.
> `components={{ Section: CardSection }}` fails with "CardSection is not
> defined" — wrap it as `p => <CardSection {...p} />`.

### Giving a section its own rendering

`<DatasetSection>` renders one section's fields. With children, it hands the
section's data to them instead, so a section can render as whatever its shape
actually calls for:

```mdx
{/* default: label/value rows */}

<DatasetSection name="provenance" />

{/* lift the abstract out as prose, then the remaining fields */}

<DatasetSection name="summary" fields exclude={["abstract"]}>
    <Prose field="abstract" />
</DatasetSection>
```

`fields` keeps the default rows alongside a custom child; `exclude` drops the
fields that child has already covered, so nothing renders twice.

Children are cloned with the section's `data`, its `schema` node and the full
`rootSchema`, so they need no wiring — and a child can hand a reshaped value
straight back to `<MetadataView>` rather than laying it out by hand:

```tsx
const StructuralMetadata = ({ data, schema, rootSchema }) => (
    <MetadataView
        data={{ ...data, tables: mergeTables(data?.tables ?? []) }}
        schema={schema}
        rootSchema={rootSchema}
    />
);
```

A child that passes its own `data` keeps it. This is injection rather than
React context deliberately: context would force `"use client"` on every
consumer and lose server rendering.

A child that _replaces_ the section — no `fields` — is wrapped in the
section's own heading and `#section-{key}` anchor, so the nav keeps working
and the title still comes from the schema. With `fields`, the default rows
already carry both, so the child is left bare and renders above them.

### The base vocabulary

Available in every template, bound to the dataset by `baseComponents.tsx`:

| Tag                                                 | What it does                                                                                              |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `<Article>`                                         | Centred single-column page wrapper                                                                        |
| `<DatasetLayout>`, `<Column name>`, `<Region area>` | The landing-page grid                                                                                     |
| `<MetadataView>`                                    | The generic renderer, pre-bound to this dataset                                                           |
| `<DatasetSection name>`                             | One section, with optional child injection                                                                |
| `<SectionNav sections>`                             | The left-column section nav — see [Section anchors](#section-anchors)                                     |
| `<FieldStrip fields>`                               | Named fields as one compact strip — for record-keeping like `identifier`, `version`, `issued`, `modified` |
| `<Prose field>`                                     | One field as a lead paragraph                                                                             |

### Section anchors

Every section that renders as a block gets `id="section-{key}"`, and
`<SectionNav>` turns a declared list of section keys into links to them.

```mdx
<SectionNav sections={["summary", "documentation", "provenance"]} />
```

The order is declared rather than derived because the nav sits in an earlier
column of the same server tree than the content, so it cannot observe what
rendered. **Keep the list in step with the `<DatasetSection>` tags.** Labels and
empty-section filtering still come from the schema, so a section with no data
disappears from the nav and the page together, and a key the schema does not
have is skipped rather than producing a dead link.

Deriving the list from the schema instead would be wrong: HDR UK's `revisions`
is populated but is deliberately never rendered as a section, so it would
appear in the nav pointing at nothing.

New shared tags go in `components/` as their own folder, following the repo's
component convention (`Name/Name.tsx` + `Name/index.ts`, co-located tests), and
are bound in `baseComponents.tsx`. Anything that is specific to one page rather
than one schema belongs in that template's `components.tsx` instead.

## Conventions that matter

-   **Markdown, not literal JSX, for text.** MDX only maps component overrides
    onto markdown-derived elements, so `# Heading` picks up the design-system
    heading while `<h1>` does not.
-   **Blank lines around markdown inside a JSX element**, or it is parsed as raw
    text.
-   **Keep `MetadataView` free of client-only concerns.** It is a server
    component; marking it `"use client"` breaks passing component overrides from
    a template.
