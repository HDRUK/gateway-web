import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import UserPublications from "@/app/[locale]/account/profile/publications/components/UserPublications";

export const metadata = metaData(
    {
        title: "Publications - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function UserPublicationsPage({
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
    const userId = user?.id?.toString();

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["papers.read"]}>
            <UserPublications
                permissions={permissions}
                teamId={teamId}
                userId={userId}
            />
        </ProtectedAccountRoute>
    );
}
