import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import TeamDatasets from "./components/TeamDatasets";

export const metadata = metaData(
    {
        title: "Datasets - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function TeamDatasetsPage({
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
            pagePermissions={["datasets.read"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <TeamDatasets permissions={permissions} teamId={teamId} />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
