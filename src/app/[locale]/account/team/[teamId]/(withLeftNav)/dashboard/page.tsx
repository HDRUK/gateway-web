import { notFound } from "next/navigation";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getDashboardEntityCount, getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import { isCustodianDashboardEnabled } from "@/flags";
import Dashboard from "./dashboard";

export const metadata = metaData(
    {
        title: "Dashboard",
        description: "",
    },
    noFollowRobots
);

export default async function DashboardPage({
    params,
}: {
    params: Promise<{ teamId: string }>;
}) {
    const { teamId } = await params;

    if (!(await isCustodianDashboardEnabled())) {
        return notFound();
    }

    const [user, team] = await Promise.all([getUser(), getTeam(teamId)]);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["dashboard.read"]}>
            <DashboardContent
                teamId={teamId}
                teamName={team.name}
                isDarEnabled={team.is_question_bank}
            />
        </ProtectedAccountRoute>
    );
}

async function DashboardContent({
    teamId,
    teamName,
    isDarEnabled,
}: {
    teamId: string;
    teamName: string;
    isDarEnabled: boolean;
}) {
    const [datasets, datauses, tools, collections, publications] =
        await Promise.all([
            getDashboardEntityCount(teamId, "datasets"),
            getDashboardEntityCount(teamId, "datauses"),
            getDashboardEntityCount(teamId, "tools"),
            getDashboardEntityCount(teamId, "collections"),
            getDashboardEntityCount(teamId, "publications"),
        ]);

    return (
        <Dashboard
            teamId={teamId}
            teamName={teamName}
            isDarEnabled={isDarEnabled}
            initialCounts={{
                datasets,
                datauses,
                tools,
                collections,
                publications,
            }}
        />
    );
}
