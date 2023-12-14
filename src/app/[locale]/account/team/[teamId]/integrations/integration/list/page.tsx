import { getPermissions, getTeam, getUser } from "@/utils/api";
import { cookies } from "next/headers";
import { getTeamUser } from "@/utils/user";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";

import IntegrationList from "./components/IntegrationList";
import BackButton from "@/components/BackButton";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Integrations",
    description: "",
};

export default async function TeamIntegrationsListPage({
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
            pagePermissions={["fe.account.nav.integrations.integration"]}>
            <BackButton label="Back to Integration management" />
            <IntegrationList />
        </ProtectedAccountRoute>
    );
}
