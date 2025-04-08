import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getDarTemplates, getTeam, getUser } from "@/utils/api";
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
    searchParams,
}: {
    params: { teamId: string };
    searchParams: { page?: string; published?: boolean };
}) {
    const { teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const queryPublished = new URLSearchParams();
    const queryDraft = new URLSearchParams();

    if (searchParams.page) {
        queryPublished.set("page", searchParams.page.toString());
        queryDraft.set("page", searchParams.page.toString());
    }

    queryPublished.set("published", "1");
    queryDraft.set("published", "0");

    const darTemplatesPublished = await getDarTemplates(
        cookieStore,
        teamId,
        queryPublished.toString()
    );

    const darTemplatesDraft = await getDarTemplates(
        cookieStore,
        teamId,
        queryDraft.toString()
    );

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["data-access-template.update"]}>
            <TeamTemplates
                permissions={permissions}
                templateData={
                    searchParams?.published === "1"
                        ? darTemplatesPublished
                        : darTemplatesDraft
                }
                countActive={darTemplatesPublished.active_count}
                countDraft={darTemplatesDraft.non_active_count}
                teamId={teamId}
            />
        </ProtectedAccountRoute>
    );
}
