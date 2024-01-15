import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Typography from "@/components/Typography";
import {
    ACCOUNT,
    CREATE,
    INTEGRATION,
    PAGES,
    TEAM,
    TEXT,
    TITLE,
} from "@/consts/translation";
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

    const t = await getTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${INTEGRATION}.${CREATE}`
    );

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["fe.account.nav.integrations.integration"]}>
            <BackButton label="Back to Integration Management" />
            <Paper sx={{ marginBottom: 1 }}>
                <Box>
                    <Typography variant="h2">{t(TITLE)}</Typography>
                    <Typography>{t(TEXT)}</Typography>
                </Box>
            </Paper>
            <CreateIntegrationForm />
        </ProtectedAccountRoute>
    );
}
