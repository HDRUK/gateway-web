import { getPermissions, getTeam, getUser } from "@/utils/permissions";
import { cookies } from "next/headers";
import { getTeamUser } from "@/utils/user";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Typography from "@/components/Typography";
import TeamDatasets from "./components/TeamDatasets";
import Paper from "@/components/Paper";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Datasets",
    description: "",
};

export default async function TeamDatasetsPage({
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
            pagePermissions={["fe.account.nav.datasets"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <Paper>
                    <Box sx={{ bgcolor: "white", mb: 0 }}>
                        <Typography variant="h2">Datasets</Typography>
                        <Typography>
                            View, add, edit, archive and check the status of
                            your datasets.
                        </Typography>
                    </Box>
                </Paper>
                <TeamDatasets />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
