import { cookies } from "next/headers";
import BackButton from "@/components/BackButton";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getApplication, getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import EditApplicationForm from "../../components/EditApplicationForm";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - API Management - Edit",
    description: "",
};

export default async function TeamApiEditCreatePage({
    params,
}: {
    params: { teamId: string; apiId: string };
}) {
    const { teamId, apiId } = params;
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
            <BackButton label="Back to API Management" />
            <EditApplicationForm application={application} isTabView={false} />
        </ProtectedAccountRoute>
    );
}
