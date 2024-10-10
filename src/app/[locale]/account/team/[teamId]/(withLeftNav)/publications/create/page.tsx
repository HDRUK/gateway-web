import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import CreatePublication from "@/app/[locale]/account/profile/publications/components/CreatePublication";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Publication Create",
    description: "",
};

export default async function PublicationTeamsCreatePage({
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
            pagePermissions={["papers.create"]}>
            <CreatePublication teamId={teamId} />
        </ProtectedAccountRoute>
    );
}
