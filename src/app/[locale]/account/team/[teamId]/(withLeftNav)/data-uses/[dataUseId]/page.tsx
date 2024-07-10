import { cookies } from "next/headers";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Typography from "@/components/Typography";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Data Use",
    description: "",
};

export default async function TeamDataUsePage({
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
            pagePermissions={["dur.update"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <Paper>
                    <Box sx={{ bgcolor: "white", mb: 0 }}>
                        <Typography variant="h2">Data Use</Typography>
                    </Box>
                </Paper>
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
