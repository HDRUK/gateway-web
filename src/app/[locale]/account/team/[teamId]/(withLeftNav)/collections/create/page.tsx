import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import CreateCollection from "./components";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Create Collection",
    description: "",
};

export default async function CollectionCreatePage({
    params,
}: {
    params: { teamId: string; };
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
            pagePermissions={["collections.create"]}>
            <CreateCollection
                teamId={teamId}
            />
        </ProtectedAccountRoute>
    );
}
