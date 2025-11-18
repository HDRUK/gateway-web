import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import CreatePublication from "@/app/[locale]/account/profile/publications/components/CreatePublication";

export const metadata = metaData(
    {
        title: "Publication Create - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function PublicationTeamsCreatePage({
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
            pagePermissions={["papers.create"]}>
            <CreatePublication teamId={teamId} />
        </ProtectedAccountRoute>
    );
}
