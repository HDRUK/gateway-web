import Box from "@/components/Box";
import Typography from "@/components/Typography";
import Paper from "@/components/Paper";
import { cookies } from "next/headers";

import { getPermissions } from "@/utils/permissions";
import { getTeam, getUser } from "@/utils/api";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeamUser } from "@/utils/user";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Data Uses",
    description: "",
};

export default async function TeamDataUsesPage({
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
            pagePermissions={["fe.account.nav.dur"]}>
            <Paper>
                <Box>
                    <Typography variant="h2">Data Uses</Typography>
                </Box>
            </Paper>
        </ProtectedAccountRoute>
    );
}
