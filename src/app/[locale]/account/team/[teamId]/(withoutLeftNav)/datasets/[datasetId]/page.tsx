import { get } from "lodash";
import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { DataStatus } from "@/consts/application";
import {
    getFormHydration,
    getSchemaFromTraser,
    getTeam,
    getTeamDataset,
    getTeamIdFromPid,
    getUser,
} from "@/utils/api";
import { extractNamesFromDataType } from "@/utils/extractNamesFromDataTypes";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import EditDataset from "../components/CreateDataset";

export const metadata = metaData(
    {
        title: "Dataset - My Account",
        description: "",
    },
    noFollowRobots
);
const SCHEMA_NAME = "HDRUK";
const SCHEMA_VERSION = "4.0.0";

export default async function TeamDatasetPage({
    params,
    searchParams,
}: {
    params: Promise<{ teamId: string; status: string; datasetId: string }>;
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const { teamId, datasetId } = await params;
    const { status } = await searchParams;
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

    const getMetadata = (isDraft: boolean) =>
        isDraft
            ? "versions[0].metadata.original_metadata"
            : "versions[0].metadata.metadata";

    const metadataLocation = getMetadata(isDraft);

    const latestMetadata = get(dataset, metadataLocation);

    interface DataSetTypeArrayType {
        name: string;
        subTypes: string[];
    }
    const dataSetTypes: DataSetTypeArrayType[] =
        get(latestMetadata, "provenance.origin.datasetType") ?? [];

    const datasetTypesForForm = dataSetTypes.map(item => {
        return {
            "Dataset type": item.name,
            "Dataset subtypes": item.subTypes,
        };
    });
    const dataTypes = extractNamesFromDataType(dataSetTypes);

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
        "Dataset type": dataTypes,
        "Dataset Type Array": datasetTypesForForm,
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
