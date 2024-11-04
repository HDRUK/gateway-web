import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Typography from "@/components/Typography";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import EditIntegrationForm from "./components/EditIntegrationForm";
import metaData, { noFollowRobots } from "@/utils/metdata";

export const metadata = metaData(
    {
        title: "Integration -Integrations",
        description: "",
    },
    noFollowRobots
);

const TRANSLATION_PATH = `pages.account.team.integration.create`;

export default async function TeamEditIntegrationPage({
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

    const t = await getTranslations(TRANSLATION_PATH);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["integrations.metadata", "integrations.dar"]}>
            <BackButton label="Back to Integration Management" />
            <Paper sx={{ marginBottom: 1 }}>
                <Box>
                    <Typography variant="h2">{t("title")}</Typography>
                    <Typography>{t("text")}</Typography>
                    <Typography>{t("helper")}</Typography>
                </Box>
            </Paper>
            <EditIntegrationForm />
        </ProtectedAccountRoute>
    );
}
