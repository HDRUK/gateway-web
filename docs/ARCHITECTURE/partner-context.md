# Partner context from the onboarding form

Every dataset is stored with a partner context (`partner_context`: `HDRUK`, `CRUK`, `PRUK` or `CROCOD`). The GWDM dataset page (`/dataset/[datasetId]/_gwdm`) picks its template from it, so a dataset stored as `HDRUK` renders with the HDRUK layout even if it was written in another partner's schema.

The API stores the `x-partner-context` request header (`PARTNER_CONTEXT_HEADER`) as the partner context:

- on create, through `POST /api/v2/teams/{id}/datasets`
- on update, through `PUT /api/v2/teams/{id}/datasets/{id}`, while `SchemaOnboardingFormSelector` is on; no header stores the deployment default (`HDRUK` on the Gateway)

## What the form sends

`saveSchemaDatasetAction` sends the header, set to the schema chosen in the schema picker, on create and on update, when:

- the schema is a partner's (`PARTNER_SCHEMAS` in `src/consts/schema.ts`)
- `SchemaOnboardingFormSelector` is on

Switching a dataset's schema in the form therefore switches its partner context, and switching back to HDRUK restores `HDRUK`.

## Flags

Turn `SchemaOnboardingFormSelector` on only together with `SchemaOnboardingForm`. The legacy form, used while `SchemaOnboardingForm` is off, saves through the same update endpoint without the header, so it would reset partner datasets to `HDRUK`.

A partner dataset is hidden from the Gateway's public pages while that partner's `RenderSchema<PARTNER>` flag is off.

## Not covered

Upload and GMI ingestion always store `HDRUK`.
