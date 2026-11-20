import { omit } from "lodash";
import { getTranslations } from "next-intl/server";
import BoxContainer from "@/components/BoxContainer";
import Typography from "@/components/Typography";
import { getCollabDraft } from "@/utils/api";
import { isCollabToken } from "@/utils/collab";
import metaData, { noFollowRobots } from "@/utils/metadata";
import SchemaDatasetForm from "@/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/_schema/components/SchemaDatasetForm";
import { hydrateFormValues } from "@/app/[locale]/account/team/[teamId]/(withoutLeftNav)/datasets/_schema/utils/hydrateFormValues";
import {
    isCollaborativeMetadataOnboardingEnabled,
    isSchemaOnboardingFormEnabled,
    isSchemaOnboardingFormSelectorEnabled,
} from "@/flags";
import {
    formTemplateMeta,
    getFormTemplate,
} from "@/templates/metadata/form/registry";
import { formVocabulary } from "@/templates/metadata/form/vocabulary";

// The URL carries a credential, so keep it out of search engines.
export const metadata = metaData(
    { title: "Dataset onboarding", description: "" },
    noFollowRobots
);

const TRANSLATION_PATH = "pages.collab";

interface CollabPageProps {
    params: Promise<{ token: string }>;
    searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export default async function CollabPage({
    params,
    searchParams,
}: CollabPageProps) {
    const { token } = await params;
    const t = await getTranslations(TRANSLATION_PATH);

    // Collab mode only exists on the schema-driven form. A switched-off
    // feature, a malformed token and a dead link all look the same to an
    // anonymous visitor - the API masks them identically too.
    const enabled =
        (await isCollaborativeMetadataOnboardingEnabled()) &&
        (await isSchemaOnboardingFormEnabled());
    const canChangeSchema = await isSchemaOnboardingFormSelectorEnabled();

    let draft;
    if (enabled && isCollabToken(token)) {
        const { schema, version } = (await searchParams) ?? {};
        const chosen =
            canChangeSchema && schema && version
                ? { model: schema, version }
                : undefined;

        draft = await getCollabDraft(token, chosen ?? {});
        // A chosen schema that can't be opened (e.g. no longer offered)
        // shouldn't read as a dead link - open the default instead.
        if (!draft && chosen) {
            draft = await getCollabDraft(token, {});
        }
    }

    if (!draft?.form) {
        return (
            <BoxContainer sx={{ mt: "14px" }}>
                <Typography variant="h2">{t("invalidLinkTitle")}</Typography>
                <Typography>{t("invalidLinkText")}</Typography>
            </BoxContainer>
        );
    }

    const { form } = draft;
    const { Template, meta } = getFormTemplate({
        partner: form.model,
        gwdmVersion: form.version,
    });

    return (
        <SchemaDatasetForm
            key={`${form.model}@${form.version}`}
            teamId={String(draft.team_id)}
            datasetId={String(draft.dataset_id)}
            isEditing
            form={omit(form, ["metadata", "defaultValues"])}
            values={hydrateFormValues(form)}
            meta={formTemplateMeta(meta)}
            defaultTeam={{ value: draft.team_id, label: draft.team_name }}
            isDraft
            canChangeSchema={canChangeSchema}
            collab={{ token, readyForReviewAt: draft.ready_for_review_at }}>
            <Template components={formVocabulary} />
        </SchemaDatasetForm>
    );
}
