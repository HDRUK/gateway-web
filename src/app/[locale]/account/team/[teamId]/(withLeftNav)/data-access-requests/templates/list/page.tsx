import { cookies } from "next/headers";
import BackButton from "@/components/BackButton";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import TeamTemplates from "./components/TeamTemplates";

export const metadata = metaData(
    {
        title: "Manage Data Access Request Templates - My Account",
        description: "",
    },
    noFollowRobots
);

export default async function DARTemplateListPage({
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
            pagePermissions={["data-access-template.update"]}>
            <BackButton label="Back to DAR template management" />
            <TeamTemplates permissions={permissions} />
        </ProtectedAccountRoute>
    );
}
