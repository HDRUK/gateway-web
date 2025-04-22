import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import {
    getDarTemplates,
    getDarTemplatesCount,
    getTeam,
    getUser,
} from "@/utils/api";
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

    if (searchParams.page) {
        queryPublished.set("page", searchParams.page.toString());
    }

    if (searchParams.published) {
        queryPublished.set("published", searchParams.published.toString());
    }

    const darTemplateData = await getDarTemplates(
        cookieStore,
        teamId,
        queryPublished.toString()
    );

    const darTemplatesCount = await getDarTemplatesCount(cookieStore, teamId);

    if (!darTemplateData) {
        notFound();
    }

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["data-access-template.update"]}>
            <TeamTemplates
                permissions={permissions}
                templateData={darTemplateData}
                countActive={darTemplatesCount.active_count}
                countDraft={darTemplatesCount.non_active_count}
                teamId={teamId}
            />
        </ProtectedAccountRoute>
    );
}
