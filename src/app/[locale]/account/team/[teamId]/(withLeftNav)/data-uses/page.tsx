import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions, hasPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import DataUsesList from "./DataUsesList";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Data Uses",
    description: "",
};

export default async function TeamDataUsesPage({
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
            pagePermissions={[
                "dur.read",
                "dur.create",
                "dur.update",
                "dur.delete",
            ]}>
            <DataUsesList
                isCreate={hasPermissions(permissions, ["dur.create"])}
                isEdit={hasPermissions(permissions, ["dur.update"])}
                isArchive={hasPermissions(permissions, ["dur.delete"])}
            />
        </ProtectedAccountRoute>
    );
}
