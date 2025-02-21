import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import TeamManagement from "./components/TeamManagement";
import { ROLE_CUSTODIAN_DEVELOPER } from "@/consts/roles";

export const metadata = metaData(
    {
        title: "Team Management - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function TeamManagementPage({
    params,
}: {
    params: { teamId: string };
}) {
    const { teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);
    const isOnlyDev =
        teamUser?.roles?.length === 1 &&
        teamUser.roles[0]?.name === ROLE_CUSTODIAN_DEVELOPER;

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["roles.read"]}
            allowDevOnly={isOnlyDev}>
            <TeamManagement permissions={permissions} team={team} />
        </ProtectedAccountRoute>
    );
}
