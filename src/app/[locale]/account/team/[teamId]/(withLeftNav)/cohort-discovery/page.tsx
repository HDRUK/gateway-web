import { Box } from "@mui/material";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";

const getUrl = (id: number | string) =>
    `${process.env.NEXT_PUBLIC_COHORT_DISCOVERY_URL}/custodian-admin?external_id=${id}`;

export const metadata = metaData(
    {
        title: "Cohort Discovery - Team",
        description: "",
    },
    noFollowRobots
);
export default async function TeamCollectionsPage({
    params,
}: {
    params: Promise<{ teamId: string }>;
}) {
    const { teamId } = await params;
    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["cohort.team.read"]}>
            <Box
                component="iframe"
                src={getUrl(teamId)}
                title="Cohort discovery"
                sx={{
                    border: 0,
                    width: "100%",
                    flex: 1,
                    height: "calc(100vh - 200px)",
                }}
            />
        </ProtectedAccountRoute>
    );
}
