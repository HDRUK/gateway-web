import metaData, { noFollowRobots } from "@/utils/metadata";
import { getDashboardEntityCount } from "@/utils/api";
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
            initialCounts={{ datasets, datauses, tools, collections, publications }}
        />
    );
}
