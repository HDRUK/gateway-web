import { Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Box from "@/components/Box";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getTeamNames, getUser, getWidget } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import WidgetCreator from "./components/WidgetCreator";

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
    params: { teamId: string; widgetId: string };
}) {
    const { teamId, widgetId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);
    const t = await getTranslations(TRANSLATION_PATH);

    let widgetData;

    // Get widget data
    if (widgetId !== "create") {
        widgetData = await getWidget(cookieStore, teamId, widgetId, {
            suppressError: true,
        });

        if (!widgetData) {
            notFound();
        }
    }

    // Get all teams
    const teamNames = await getTeamNames(cookieStore);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["widgets.create"]}>
            <Box sx={{}}>
                <Typography variant="h1">
                    {widgetId === "create" ? t("titleCreate") : t("titleEdit")}
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
