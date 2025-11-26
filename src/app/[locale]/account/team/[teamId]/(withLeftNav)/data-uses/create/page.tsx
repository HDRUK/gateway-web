import CreateDataUse from "./components/CreateDataUse";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";

export const metadata = metaData(
    {
        title: "Data Use Create - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function DataUseCreatePage({
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
            <CreateDataUse teamId={teamId} />
        </ProtectedAccountRoute>
    );
}
