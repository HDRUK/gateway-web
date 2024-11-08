import { cookies } from "next/headers";
import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { StaticImages } from "@/config/images";
import { RouteName } from "@/consts/routeName";
import { getTeam, getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";

export const metadata = metaData(
    {
        title: "API Management - My Account",
        description: "",
    },
    noFollowRobots
);
export default async function TeamIntegrationsPage({
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
            pagePermissions={["integrations.metadata", "integrations.dar"]}>
            <Box
                sx={{
                    gridColumn: { tablet: "span 3", laptop: "span 4" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                <Box sx={{ display: "flex", gap: "40px" }}>
                    <ImageMediaCard
                        img={
                            StaticImages.TEAM_INTEGRATIONS.createNewIntegration
                        }
                        href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.CREATE}`}
                        buttonText="Create new Integration"
                    />
                    <ImageMediaCard
                        img={StaticImages.TEAM_INTEGRATIONS.manageIntegrations}
                        href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.LIST}`}
                        buttonText="Manage Integrations"
                    />
                </Box>
            </Box>
        </ProtectedAccountRoute>
    );
}
