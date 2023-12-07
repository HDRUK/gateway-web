import { getPermissions, getTeam, getUser } from "@/utils/permissions";
import { cookies } from "next/headers";
import { getTeamUser } from "@/utils/user";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import BackButton from "@/components/BackButton";
import ApplicationTabs from "@/modules/ApplicationTabs";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Integrations - Application",
    description: "",
};

export default async function TeamApplicationPage({
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
            pagePermissions={["fe.account.nav.integrations.api-management"]}>
            <BackButton label="Back to API selection" />
            <ApplicationTabs />
        </ProtectedAccountRoute>
    );
}
