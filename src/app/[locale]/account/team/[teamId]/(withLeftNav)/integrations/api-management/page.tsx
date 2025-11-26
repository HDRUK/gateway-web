import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import ApiManagement from "./components/ApiManagement";

export const metadata = metaData(
    {
        title: "API Management - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function TeamApiManagementPage({
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
            pagePermissions={["applications.read"]}>
            <ApiManagement />
        </ProtectedAccountRoute>
    );
}
