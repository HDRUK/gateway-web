import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import UploadDataset from "./components/UploadDataset";

export const metadata = metaData(
    {
        title: "Dataset Upload - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function UploadDatasetPage({
    params,
}: {
    params: Promise<{ teamId: string }>;
}) {
    const { teamId } = await params;
    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["datasets.create"]}>
            <BoxContainer sx={{ mt: "14px" }}>
                <UploadDataset teamId={teamId} teamPid={team.pid} />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
