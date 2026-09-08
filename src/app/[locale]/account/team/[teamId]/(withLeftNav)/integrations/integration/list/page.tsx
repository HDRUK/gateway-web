import { getTranslations } from "next-intl/server";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { PREDEFINED_INTEGRATION_OVERVIEW_URL } from "@/config/hrefs";
import { RouteName } from "@/consts/routeName";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import IntegrationsPageHeader from "../../components/IntegrationsPageHeader";
import IntegrationList from "./components/IntegrationList";

export const metadata = metaData(
    {
        title: "Integrations - My Account",
        description: "",
    },
    noFollowRobots
);

const TRANSLATION_PATH = `pages.account.team.integrations.integrations`;

export default async function TeamIntegrationsListPage({
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
            pagePermissions={["integrations.metadata", "integrations.dar"]}>
            <IntegrationsPageHeader
                title={t("list.title")}
                howToLabel={t("howTo")}
                howToHref={PREDEFINED_INTEGRATION_OVERVIEW_URL}
                createLabel={t("list.create")}
                createHref={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.CREATE}`}
                showCreateButton
            />
            <IntegrationList />
        </ProtectedAccountRoute>
    );
}
