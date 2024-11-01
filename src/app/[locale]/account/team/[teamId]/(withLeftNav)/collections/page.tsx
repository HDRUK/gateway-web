import { cookies } from "next/headers";
import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metdata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import TeamCollections from "./components/TeamCollections";

export const metadata = metaData(
    {
        title: "Collections - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function TeamCollectionsPage({
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
            pagePermissions={["collections.read"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <TeamCollections
                    permissions={permissions}
                    teamId={teamId}
                    userId={userId}
                />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
