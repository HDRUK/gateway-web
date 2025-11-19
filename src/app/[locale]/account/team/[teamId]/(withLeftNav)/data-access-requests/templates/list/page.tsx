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
    params: Promise<{ teamId: string }>;
    searchParams: Promise<{ page?: string; published?: boolean }>;
}) {
    const { teamId } = await params;
    const { page, published } = await searchParams;
    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const queryPublished = new URLSearchParams();

    if (page) {
        queryPublished.set("page", page.toString());
    }

    if (published) {
        queryPublished.set("published", published.toString());
    }

    const darTemplateData = await getDarTemplates(
        teamId,
        queryPublished.toString()
    );

    const darTemplatesCount = await getDarTemplatesCount(teamId);

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
