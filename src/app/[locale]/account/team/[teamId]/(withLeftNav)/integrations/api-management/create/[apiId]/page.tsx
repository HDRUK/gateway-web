import { cookies } from "next/headers";
import BackButton from "@/components/BackButton";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getApplication, getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import EditApplicationForm from "../../components/EditApplicationForm";
import metaData, { noFollowRobots } from "@/utils/metdata";


export const metadata = metaData(
    {
        title: "Edit - API Management",
        description: "",
    },
    noFollowRobots
);

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
            pagePermissions={["applications.update"]}>
            <BackButton label="Back" />
            <EditApplicationForm application={application} isTabView={false} />
        </ProtectedAccountRoute>
    );
}
