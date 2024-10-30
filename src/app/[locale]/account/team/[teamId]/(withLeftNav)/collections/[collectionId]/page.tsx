import { cookies } from "next/headers";
import CollectionForm from "@/components/CollectionForm";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Edit Collection",
    description: "Edit a collection",
};

export default async function CollectionEditPage({
    params,
}: {
    params: { teamId: string; collectionId: string };
}) {
    const { teamId, collectionId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["collections.update"]}>
            <CollectionForm teamId={teamId} collectionId={collectionId} />
        </ProtectedAccountRoute>
    );
}
