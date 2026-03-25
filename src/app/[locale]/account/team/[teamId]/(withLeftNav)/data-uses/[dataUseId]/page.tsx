import BoxContainer from "@/components/BoxContainer";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import EditDataUse from "./components";

export const metadata = metaData(
    {
        title: "Data Use Edit - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function DataUseEditPage({
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
            pagePermissions={["dur.update"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <Paper>
                    <EditDataUse />
                </Paper>
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
