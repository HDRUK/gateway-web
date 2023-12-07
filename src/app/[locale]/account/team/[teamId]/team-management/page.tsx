import { getPermissions, getTeam, getUser } from "@/utils/permissions";
import { cookies } from "next/headers";
import { getTeamUser } from "@/utils/user";
import TeamManagement from "./TeamManagement";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Team Management",
    description: "",
};

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

    return <TeamManagement permissions={permissions} team={team} />;
}
