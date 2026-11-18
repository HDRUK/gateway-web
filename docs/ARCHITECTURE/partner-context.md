# Partner context from the onboarding form

Every dataset is stored with a partner context (`partner_context`: `HDRUK`, `CRUK`, `PRUK` or `CROCOD`). The GWDM dataset page (`/dataset/[datasetId]/_gwdm`) picks its template from it, so a dataset stored as `HDRUK` renders with the HDRUK layout even if it was written in another partner's schema.

The API stores the `x-partner-context` request header (`PARTNER_CONTEXT_HEADER`) as the partner context:

- on create, through `POST /api/v2/teams/{id}/datasets` (no header stores the deployment default)
- on update, through `PUT /api/v2/teams/{id}/datasets/{id}`, only when the header is sent; an unknown value is rejected with a 400

## What the form sends

While `SchemaOnboardingFormSelector` is on, `saveSchemaDatasetAction` sends the header on create and update:

- the chosen schema, when it is a partner's (`PARTNER_SCHEMAS` in `src/consts/schema.ts`)
- `DEFAULT_PARTNER_CONTEXT` (`HDRUK`) for any other schema

Switching a dataset's schema in the form therefore switches its partner context, including back to `HDRUK`. With the flag off the form sends no header, so updates leave the partner context unchanged. The legacy form never sends it.

A partner dataset is hidden from the Gateway's public pages while that partner's `RenderSchema<PARTNER>` flag is off.

## Not covered

Upload and GMI ingestion always store `HDRUK`.
