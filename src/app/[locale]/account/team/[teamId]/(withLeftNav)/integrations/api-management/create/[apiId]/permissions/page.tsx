import BackButton from "@/components/BackButton";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getApplication, getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import ApplicationPermissions from "../../../components/ApplicationPermissions";

export const metadata = metaData(
    {
        title: "Permissions - API Management",
        description: "",
    },
    noFollowRobots
);

export default async function TeamApiPermissionsPage({
    params,
}: {
    params: Promise<{ teamId: string; apiId: string }>;
}) {
    const { teamId, apiId } = await params;
    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const application = await getApplication(apiId);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["applications.update"]}>
            <BackButton label="Back" />
            <ApplicationPermissions application={application} />
        </ProtectedAccountRoute>
    );
}
