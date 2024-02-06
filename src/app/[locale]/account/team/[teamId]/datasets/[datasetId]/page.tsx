import { cookies } from "next/headers";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Typography from "@/components/Typography";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import EditDataset from "../components/EditDataset";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Dataset",
    description: "",
};

export default async function TeamDatasetPage({
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
            pagePermissions={["datasets.update"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <Paper>
                    <Box sx={{ bgcolor: "white", mb: 0 }}>
                        <Typography variant="h2">Dataset</Typography>
                    </Box>
                </Paper>
                <EditDataset />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
