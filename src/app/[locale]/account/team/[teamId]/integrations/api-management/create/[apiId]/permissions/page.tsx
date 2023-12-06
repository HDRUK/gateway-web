import {
    getApplication,
    getPermissions,
    getTeam,
    getUser,
} from "@/utils/permissions";
import { cookies } from "next/headers";
import { getTeamUser } from "@/utils/user";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import BackButton from "@/components/BackButton";
import ApplicationPermissions from "@/modules/ApplicationPermissions";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - API Management - Permissions",
    description: "",
};

export default async function TeamApiPermissionsPage({
    params,
}: {
    params: { teamId: string; apiId: string };
}) {
    const { teamId, apiId } = params;
    console.log("apiId: ", apiId);
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const application = await getApplication(cookieStore, apiId);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["fe.account.nav.integrations.api-management"]}>
            <BackButton label="Back to API Creation" />
            <ApplicationPermissions application={application} />
        </ProtectedAccountRoute>
    );
}
