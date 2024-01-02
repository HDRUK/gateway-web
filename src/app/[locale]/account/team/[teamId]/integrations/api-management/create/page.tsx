import { getTranslations } from "next-intl/server";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { cookies } from "next/headers";
import { getTeamUser } from "@/utils/user";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import CreateApplicationForm from "./components/CreateApplicationForm";
import {
    ACCOUNT,
    API_MANAGEMENT,
    CREATE,
    INTEGRATIONS,
    PAGES,
    TEAM,
    TEXT,
    TITLE,
} from "@/consts/translation";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - API Management",
    description: "",
};

export default async function TeamCreatePage({
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
        `${PAGES}.${ACCOUNT}.${TEAM}.${INTEGRATIONS}.${API_MANAGEMENT}.${CREATE}`
    );

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["fe.account.nav.integrations.api-management"]}>
            <BackButton label="Back to API Management" />
            <Paper sx={{ marginBottom: 1 }}>
                <Box>
                    <Typography variant="h2">{t(TITLE)}</Typography>
                    <Typography sx={{ marginBottom: 2 }}>{t(TEXT)}</Typography>
                </Box>
            </Paper>
            <CreateApplicationForm />
        </ProtectedAccountRoute>
    );
}
