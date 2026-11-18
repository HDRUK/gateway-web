# Cohort Discovery access request

Page: `src/app/[locale]/account/profile/cohort-discovery-request/`

## Submission flow

1. `CohortAccessStepper` walks the user through profile checks and the user declaration.
2. `openTerms` opens `CohortRequestTermsDialog` with the CMS terms and `onSubmitted: refetch`.
3. Accepting the terms POSTs to `apis.cohortRequestsV1Url`.
4. On success the dialog closes and calls `onSubmitted`. That refetches `useCohortStatus`, so the stepper moves to its "in review" state. When no `onSubmitted` is passed, the dialog navigates to the cohort discovery request page instead.

No dialog is shown after submission. The stepper's "in review" state is the only confirmation (GAT-9868).

## NHS Research SDE access

The NHS Research SDE request is offered only through `NhsSdeAccessStepper` (via `RequestNhseSdeAccessButton`), gated by the `isNhsSdeApplicationsEnabled` feature flag. It is not offered as part of the Cohort Discovery submission.
