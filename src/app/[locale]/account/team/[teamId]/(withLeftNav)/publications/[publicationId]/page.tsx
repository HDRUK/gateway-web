import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import CreatePublication from "@/app/[locale]/account/profile/publications/components/CreatePublication";

export const metadata = metaData(
    {
        title: "Publication Edit - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function PublicationTeamsEditPage({
    params,
}: {
    params: { publicationId: string; teamId: string };
}) {
    const { publicationId, teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["papers.update"]}>
            <CreatePublication teamId={teamId} publicationId={publicationId} />
        </ProtectedAccountRoute>
    );
}
