# In-app feedback (experiments)

Super admins build feedback prompts and design reviews in **Profile → Search admin → Experiments**. A prompt can mix ratings, choices, free text, images and a Design A vs B pick, across several steps with branching. `<Experiments />` in the root layout shows prompts on the pages they target. The UI comes from the `@hdruk/experiments` package: `@hdruk/experiments` for types and validation, `@hdruk/experiments/client` for the prompt, and `@hdruk/experiments/builder` for the admin builder, so the builder stays out of the site-wide bundle. Gateway injects its translations (`modules.experimentBuilder` in `en.json`), the Wysiwyg rich-text editor and the image upload.

## Feature flag

The whole feature sits behind the `POC_FeedbackExperiments` flag (`isExperimentsEnabled` in `useFeatures()`), seeded **off**. While it is off, the web does not fetch or show prompts and hides the Experiments admin tab. The API also returns an empty list from `/experiments/active` (and `/active/me`) and a 404 for responses, so an older client can't show or submit a prompt either. The admin CRUD routes are not flagged. Turn the flag on in **Profile → Search admin → Features**. The web reads flags in the root layout, so reload the page to see the change.

## Theming

The package depends only on MUI, not `@hdruk/ui`. It reads colours and `shape.borderRadius` from the surrounding MUI theme, and its focus ring uses `palette.status.keyboardFocus` when the theme has it (falling back to `primary.main`), so under the Gateway theme it matches `@hdruk/ui`'s `focusRing`. Every styled part is a named slot, so Gateway can restyle any of them from its theme with `@hdruk/ui` values:

```ts
components: {
    HdrukExperiment: { styleOverrides: { scalePoint: ({ theme }) => ({}) } },
    HdrukExperimentBuilder: { styleOverrides: { item: ({ theme }) => ({}) } },
}
```

## Who sees a prompt

`GET /v1/experiments/active` (`/active/me` when signed in) returns the running experiments for the visitor. The API filters by status, start and end dates, audience (everyone, signed-in, signed-out, user IDs) and percentage. Percentage assignment is stable per user, or per `hdr-session-id` when signed out. The web then matches `paths` against the current page (`*` = one segment, `**` = any).

## Answers and contact opt-in

The last step of every prompt asks "Can we contact you about your feedback?" with an unticked "Yes, contact me" checkbox:

| Visitor    | When they tick it              | Email sent to the Helpdesk               |
| ---------- | ------------------------------ | ---------------------------------------- |
| Signed in  | Shown the email we will use    | Account preferred email, read by the API |
| Signed out | Must enter an email, validated | The email they typed                     |

Answers and the opt-in go in one request to `POST /v1/experiments/{id}/responses` (`/responses/me` when signed in), with `contact` and, when signed out, `email`. Signed-out visitors can respond, so feedback can be anonymous. Answers to blocks that are not questions are dropped.

The Gateway does not store responses or emails. The API passes the submission straight to an encrypted queued job (`ShouldBeEncrypted`) that raises the Helpdesk ticket, and only increments the experiment's response count.

## Bot check (reCAPTCHA v3)

Each response raises a Helpdesk ticket, so the API only accepts one with a Google reCAPTCHA v3 token. reCAPTCHA v3 is invisible: there is no checkbox or puzzle, Google scores the visit in the background.

-   When a prompt opens, `<Experiments />` loads Google's script (`loadRecaptcha` in `src/utils/recaptcha.ts`), so pages without a prompt never load it.
-   On submit it gets a token for the `experiment_response` action (`getRecaptchaToken`) and sends it as `recaptcha`. Tokens last 2 minutes and work once, so each attempt gets a new one.
-   The API checks the token, the action and the score with Google and rejects anything below `RECAPTCHA_MIN_SCORE` (default 0.5). If the check fails, the prompt shows its retry error.
-   The site key is `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`. Without it, submitting fails. The API needs the matching `RECAPTCHA_SECRET_KEY`.
-   Google's terms require its badge (or its notice text) to be visible in the user flow. Once loaded, the badge would otherwise stay on every page, behind the prompt's backdrop and the "Need support?" button. So `ThemeRegistry`'s global styles hide `.grecaptcha-badge`, and while a prompt is open `<Experiments />` adds `recaptchaBadgeOpen` (`Experiments.styles.ts`): the badge sits bottom-left above the backdrop, collapsed to the logo, and expands on hover. Hide it with `visibility`, never `display: none`, which stops reCAPTCHA working.
-   The site key must list every domain it is used on, including `localhost`. Otherwise Google returns `browser-error` and the API rejects the response. The API logs Google's reason at debug level.

The API also caps each experiment at 50 Helpdesk tickets an hour; see gateway-api's `docs/FEATURES/experiments.md`.

## When a prompt opens

| Show                                        | Behaviour                                                                                                                     |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| When the page loads                         | Straight away                                                                                                                 |
| After a delay                               | After `delaySeconds` on the page                                                                                              |
| When they are about to leave (desktop only) | When the pointer leaves through the top of the window (towards the tabs, address bar or close button). Never on touch devices |

Exit intent is a guess, not a guarantee: switching tabs or reaching for the bookmarks bar also triggers it, and phones have no pointer to track. Keep exit-intent prompts to one short question.

## Not showing a prompt again

The prompt stores one first-party cookie, `hdruk-experiments`, holding `{id}:{status}` pairs separated by `|` (for example `7:dismissed|12:answered`), where the status is `seen`, `dismissed` or `answered`. Entries are kept when an experiment drops out of the visitor's active list (for example after signing out), so an answered `once` prompt stays answered. The expiry is reset on every write to the day after the latest end date among the visitor's current experiments that it holds, or one year if any has no end date (whichever is sooner). It is `SameSite=Lax`, and `Secure` on https.

| Frequency       | Shown again after closing? | Shown again after answering? |
| --------------- | -------------------------- | ---------------------------- |
| `once`          | No                         | No                           |
| `untilAnswered` | No                         | No                           |
| `always`        | Yes                        | Yes                          |

`untilAnswered` still reappears if the person navigated away without closing or answering.

## Data protection

Responses can hold free text. The Gateway keeps neither the answers nor the email, nor a user or session ID: they go only to the Helpdesk ticket, so Jira's retention applies. The cookie is not strictly necessary, so the cookie policy should list it. reCAPTCHA loads Google's script and sets Google's `_GRECAPTCHA` cookie on pages with an open prompt, and Google uses the data it collects under its own privacy policy, so the privacy notice and cookie policy should cover it too.

## Helpdesk tickets

Each response becomes a Jira Service Management request in **Feedback Log** (desk 7) as **Gateway Enquiry** (request type 78). gateway-api's `CreateServiceDeskRequest` job sends it as soon as the response arrives.

| Field                                                    | Value                                                                                                                                                                                    |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Summary                                                  | `Feedback: {experiment name}`                                                                                                                                                            |
| Description                                              | Page, contact email (or "not requested"), signed in or not, then each answer with its question (a design choice also links its image and prototype). The user ID only when they opted in |
| Initial Enquiry Type                                     | Share Feedback                                                                                                                                                                           |
| "Happy to be asked your opinion on future developments?" | Always No: contact about this feedback is a different purpose                                                                                                                            |
| User Type                                                | Data Custodian if the user has any `custodian.*` team role, User if signed in, blank if not                                                                                              |

Field and option IDs are in `config/services.php` under `jsm.fields`. The connection uses `JSM_EMAIL`, `JSM_API_TOKEN` (a service-account token with `read:servicedesk-request` and `write:servicedesk-request`), `JSM_CLOUD_ID`, `JSM_SERVICE_DESK_ID` and `JSM_REQUEST_TYPE_ID`. If any are missing, no job is queued. Tests blank `JSM_API_TOKEN` in `phpunit.xml` so they can never reach Atlassian.

**Any environment with these set creates real tickets**, including local development.

## Not built yet

-   An admin "Area" dropdown. Gateway Enquiry has no area or feature field on its portal form, so there is nothing to set yet. Once the Helpdesk adds one, its options can be read from JSM.
