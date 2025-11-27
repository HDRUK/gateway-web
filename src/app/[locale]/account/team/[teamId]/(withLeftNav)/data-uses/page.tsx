import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import TeamDataUses from "./components/TeamDataUses";

export const metadata = metaData(
    {
        title: "Data Uses - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function TeamDataUsesPage({
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
            pagePermissions={["dur.read"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <TeamDataUses permissions={permissions} teamId={teamId} />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
