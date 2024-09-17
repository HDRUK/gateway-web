import { get } from "lodash";
import { cookies } from "next/headers";
import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { DataStatus } from "@/consts/application";
import { getDataset, getFormHydration, getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import EditDataset from "../components/CreateDataset";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Dataset",
    description: "",
};

const SCHEMA_NAME = "HDRUK";
const SCHEMA_VERSION = "3.0.0";

export default async function TeamDatasetPage({
    params,
    searchParams,
}: {
    params: { teamId: string; status: string; datasetId: string };
    searchParams: { [key: string]: string | undefined };
}) {
    const { teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const isDraft = searchParams.status === DataStatus.DRAFT;

    const dataset = await getDataset(
        cookieStore,
        params.datasetId,
        isDraft ? "" : SCHEMA_NAME,
        isDraft ? "" : SCHEMA_VERSION
    );

    const getMetadata = (isDraft: boolean) =>
        isDraft
            ? "versions[0].metadata.original_metadata"
            : "versions[0].metadata.metadata";

    const metadataLocation = getMetadata(isDraft);

    let latestMetadata = get(dataset, metadataLocation);

    const dataTypes =
        get(latestMetadata, "provenance.origin.datasetType") || [];

    const formJSON = await getFormHydration(
        cookieStore,
        SCHEMA_NAME,
        SCHEMA_VERSION,
        dataTypes
    );

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["datasets.update"]}>
            <BoxContainer sx={{ mt: "14px" }}>
                <EditDataset
                    formJSON={formJSON}
                    teamId={Number(teamId)}
                    user={user}
                />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
