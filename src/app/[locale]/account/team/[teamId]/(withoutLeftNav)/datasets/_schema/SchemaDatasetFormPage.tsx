import { resolveField } from "@hdruk/metadata-onboard";
import { get, merge, omit, set } from "lodash";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import {
    getOnboardingForm,
    getTeam,
    getTeamDataset,
    getUser,
} from "@/utils/api";
import { getToday } from "@/utils/date";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import {
    formTemplateMeta,
    getFormTemplate,
} from "@/templates/metadata/form/registry";
import { formVocabulary } from "@/templates/metadata/form/vocabulary";
import SchemaDatasetForm from "./components/SchemaDatasetForm";

const CUSTODIAN_LOGO = "summary.dataCustodian.logo";

const isBlank = (value: unknown): boolean =>
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

interface SchemaDatasetFormPageProps {
    teamId: string;
    datasetId?: string;
    model?: string;
    version?: string;
    isDraft?: boolean;
    isDuplicate?: boolean;
}

export default async function SchemaDatasetFormPage({
    teamId,
    datasetId,
    model,
    version,
    isDraft = false,
    isDuplicate = false,
}: SchemaDatasetFormPageProps) {
    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const [form, dataset] = await Promise.all([
        getOnboardingForm(teamId, { model, version, datasetId }),
        datasetId ? getTeamDataset(teamId, datasetId) : undefined,
    ]);
    const { Template, meta } = getFormTemplate({
        partner: form.model,
        gwdmVersion: form.version,
    });
    const templateMeta = formTemplateMeta(meta);

    const loaded = isDuplicate
        ? omit(form.metadata ?? {}, templateMeta.clearOnDuplicate ?? [])
        : form.metadata;
    const defaultLogo = get(form.defaultValues, CUSTODIAN_LOGO);
    if (typeof defaultLogo === "string" && defaultLogo) {
        set(form.defaultValues, CUSTODIAN_LOGO, encodeURI(defaultLogo));
    }
    const values = merge({}, form.defaultValues, loaded);
    const today = getToday();
    if (!datasetId) {
        const fallbacks: Record<string, unknown> = {
            "summary.contactPoint": user.email,
            "summary.dataCustodian.contactPoint": user.email,
            version: "1.0.0",
            revisions: [{ version: "1.0.0", url: "http://www.example.com/" }],
            issued: today,
            modified: today,
        };
        Object.entries(fallbacks).forEach(([path, value]) => {
            const isOverride = path === "summary.contactPoint";
            if (
                (isOverride || isBlank(get(values, path))) &&
                resolveField(form.schema, path)
            ) {
                set(values, path, value);
            }
        });
    }

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={[
                datasetId && !isDuplicate
                    ? "datasets.update"
                    : "datasets.create",
            ]}>
            <SchemaDatasetForm
                key={`${form.model}@${form.version}`}
                teamId={teamId}
                datasetId={isDuplicate ? undefined : datasetId}
                isEditing={!!datasetId}
                form={omit(form, ["metadata", "defaultValues"])}
                values={values}
                meta={templateMeta}
                defaultTeam={{ value: team.id, label: team.name }}
                isDraft={isDraft}
                isCohortDiscovery={dataset?.is_cohort_discovery}>
                <Template components={formVocabulary} />
            </SchemaDatasetForm>
        </ProtectedAccountRoute>
    );
}
