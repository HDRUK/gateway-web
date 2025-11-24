import { Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Box from "@/components/Box";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import { isWidgetsEnabled } from "@/flags";
import CreateNewWidget from "./components/CreateNewWidget";
import WidgetList from "./components/WidgetList";

const TRANSLATION_PATH = "pages.account.team.widgets";

export const metadata = metaData(
    {
        title: "Widgets - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function WidgetsPage({
    params,
}: {
    params: { teamId: string };
}) {
    const { teamId } = params;
    const cookieStore = cookies();
    const t = await getTranslations(TRANSLATION_PATH);
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);
    const widgetsEnabled = await isWidgetsEnabled();

    if (!widgetsEnabled) {
        return notFound();
    }

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["widgets.read"]}>
            <Box>
                <Typography variant="h1">{t("title")}</Typography>
                <Typography>{t("intro")}</Typography>
                {permissions["widgets.create"] && <CreateNewWidget />}
                <WidgetList permissions={permissions} teamId={teamId} />
            </Box>
        </ProtectedAccountRoute>
    );
}
