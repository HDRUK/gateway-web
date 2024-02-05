import { cookies } from "next/headers";
import BackButton from "@/components/BackButton";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import ApplicationList from "./ApplicationList";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Integrations - Applications List",
    description: "",
};

export default async function TeamApplicationsPage({
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
            pagePermissions={["applications.read"]}>
            <BackButton label="Back to API Management" />
            <ApplicationList />
        </ProtectedAccountRoute>
    );
}
