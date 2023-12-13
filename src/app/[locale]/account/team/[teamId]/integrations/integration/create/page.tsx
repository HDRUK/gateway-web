import { getPermissions, getTeam, getUser } from "@/utils/permissions";
import { cookies } from "next/headers";
import { getTeamUser } from "@/utils/user";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import Typography from "@/components/Typography";
import CreateIntegrationForm from "./components/CreateIntegrationForm";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Integrations - Integration",
    description: "",
};

export default async function TeamCreateIntegrationPage({
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
            pagePermissions={["fe.account.nav.integrations.integration"]}>
            <BackButton label="Back to Integration Management" />
            <Paper sx={{ marginBottom: 1 }}>
                <Box>
                    <Typography variant="h2">Integration</Typography>
                    <Typography>
                        Input and edit the authentication information for the
                        Gateway system to use for the integration
                    </Typography>
                </Box>
            </Paper>
            <CreateIntegrationForm />
        </ProtectedAccountRoute>
    );
}
