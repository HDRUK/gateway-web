import { getTranslations } from "next-intl/server";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { CUSTOM_INTEGRATION_OVERVIEW_URL } from "@/config/hrefs";
import { RouteName } from "@/consts/routeName";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import IntegrationsPageHeader from "../../components/IntegrationsPageHeader";
import ApplicationList from "./ApplicationList";

export const metadata = metaData(
    {
        title: "Applications List - Integrations",
        description: "",
    },
    noFollowRobots
);

const TRANSLATION_PATH = `pages.account.team.integrations.apiManagement`;

export default async function TeamApplicationsPage({
    params,
}: {
    params: Promise<{ teamId: string }>;
}) {
    const { teamId } = await params;
    const user = await getUser();
    const team = await getTeam(teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const t = await getTranslations(TRANSLATION_PATH);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["applications.read"]}>
            <IntegrationsPageHeader
                title={t("list.title")}
                howToLabel={t("howTo")}
                howToHref={CUSTOM_INTEGRATION_OVERVIEW_URL}
                createLabel={t("list.create")}
                createHref={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.CREATE}`}
                showCreateButton={permissions["applications.create"]}
                note={t("cannotCreate")}
            />
            <ApplicationList />
        </ProtectedAccountRoute>
    );
}
