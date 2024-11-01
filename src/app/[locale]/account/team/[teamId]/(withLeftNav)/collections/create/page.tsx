import { cookies } from "next/headers";
import CollectionForm from "@/components/CollectionForm";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import metaData, {noFollowRobots} from "@/utils/metdata";

export const metadata = metaData({
    title: "Create Collection - My Account",
    description: ""
}, noFollowRobots);
export default async function CollectionCreatePage({
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

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["collections.create"]}>
            <CollectionForm teamId={teamId} />
        </ProtectedAccountRoute>
    );
}
