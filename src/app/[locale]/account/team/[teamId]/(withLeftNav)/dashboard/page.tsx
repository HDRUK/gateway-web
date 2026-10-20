import { notFound } from "next/navigation";
import { getDashboardEntityCount, getTeam } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
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

    const [team, datasets, datauses, tools, collections, publications] =
        await Promise.all([
            getTeam(teamId),
            getDashboardEntityCount(teamId, "datasets"),
            getDashboardEntityCount(teamId, "datauses"),
            getDashboardEntityCount(teamId, "tools"),
            getDashboardEntityCount(teamId, "collections"),
            getDashboardEntityCount(teamId, "publications"),
        ]);

    return (
        <Dashboard
            teamId={teamId}
            teamName={team.name}
            isDarEnabled={team.is_question_bank}
            initialCounts={{ datasets, datauses, tools, collections, publications }}
        />
    );
}
