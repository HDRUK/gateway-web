import { Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Box from "@/components/Box";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getTeamNames, getUser, getWidget } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import { isWidgetsEnabled } from "@/flags";
import WidgetCreator from "./components/WidgetCreator";
import { WIDGET_ID_CREATE } from "./const";

export const metadata = metaData(
    {
        title: "Widget - My Account",
        description: "",
    },
    noFollowRobots
);

const TRANSLATION_PATH = `pages.account.team.widgets.edit`;

export default async function WidgetCreationPage({
    params,
}: {
    params: Promise<{ teamId: string; widgetId: string }>;
}) {
    const { teamId, widgetId } = await params;
    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);
    const t = await getTranslations(TRANSLATION_PATH);
    const widgetsEnabled = await isWidgetsEnabled();

    if (!widgetsEnabled) {
        return notFound();
    }

    let widgetData;

    // Get widget data
    if (widgetId !== WIDGET_ID_CREATE) {
        widgetData = await getWidget(teamId, widgetId, {
            suppressError: true,
        });

        if (!widgetData) {
            notFound();
        }
    }

    // Get all teams
    const teamNames = await getTeamNames();

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["widgets.create"]}>
            <Box sx={{}}>
                <Typography variant="h1">
                    {widgetId === WIDGET_ID_CREATE
                        ? t("titleCreate")
                        : t("titleEdit")}
                </Typography>
                <Typography>{t("intro")}</Typography>
                <WidgetCreator
                    widget={widgetData}
                    teamNames={teamNames}
                    teamId={teamId}
                />
            </Box>
        </ProtectedAccountRoute>
    );
}
