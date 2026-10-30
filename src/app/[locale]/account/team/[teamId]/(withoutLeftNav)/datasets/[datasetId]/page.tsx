import { get } from "lodash";
import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { DataStatus } from "@/consts/application";
import { SCHEMA_NAME, SCHEMA_VERSION } from "@/consts/schema";
import {
    getFormHydration,
    getSchemaFromTraser,
    getTeam,
    getTeamDataset,
    getTeamIdFromPid,
    getUser,
} from "@/utils/api";
import {
    getDatasetMetadataPath,
    getDatasetTypeValues,
} from "@/utils/datasetForm";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import { isSchemaOnboardingFormEnabled } from "@/flags";
import SchemaDatasetFormPage from "../_schema/SchemaDatasetFormPage";
import EditDataset from "../components/CreateDataset";

export const metadata = metaData(
    {
        title: "Dataset - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function TeamDatasetPage({
    params,
    searchParams,
}: {
    params: Promise<{ teamId: string; status: string; datasetId: string }>;
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const { teamId, datasetId } = await params;
    const {
        status,
        schema: schemaModel,
        version,
        duplicate,
    } = await searchParams;

    if (await isSchemaOnboardingFormEnabled()) {
        return SchemaDatasetFormPage({
            teamId,
            datasetId,
            model: schemaModel,
            version,
            isDraft: status === DataStatus.DRAFT,
            isDuplicate: duplicate === "true",
        });
    }

    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const isDraft = status === DataStatus.DRAFT;
    const dataset = await getTeamDataset(
        teamId,
        datasetId,
        isDraft ? "" : SCHEMA_NAME,
        isDraft ? "" : SCHEMA_VERSION
    );

    const latestMetadata = get(dataset, getDatasetMetadataPath(isDraft));

    const datasetTypeValues = getDatasetTypeValues(latestMetadata);
    const dataTypes = datasetTypeValues["Dataset type"];

    const dataCustodianIdentifier = get(
        latestMetadata,
        "summary.dataCustodian.identifier"
    );

    const isNotTeamId = Number.isNaN(Number(dataCustodianIdentifier));
    const dataCustodianId = isNotTeamId
        ? await getTeamIdFromPid(dataCustodianIdentifier || "")
        : dataCustodianIdentifier;
    const { schema } = await getSchemaFromTraser(SCHEMA_NAME, SCHEMA_VERSION);

    const formJSON = await getFormHydration(
        SCHEMA_NAME,
        SCHEMA_VERSION,
        dataTypes,
        dataCustodianId
    );

    formJSON.defaultValues = {
        ...formJSON.defaultValues,
        ...datasetTypeValues,
    };

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["datasets.update"]}>
            <BoxContainer sx={{ mt: "14px" }}>
                <EditDataset
                    formJSON={formJSON}
                    teamId={Number(teamId)}
                    user={user}
                    defaultTeamId={Number(dataCustodianId)}
                    schemadefs={schema.$defs}
                />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
