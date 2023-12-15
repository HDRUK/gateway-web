import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { cookies } from "next/headers";
import { getTeamUser } from "@/utils/user";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import ImageMediaCard from "@/components/ImageMediaCard";
import Box from "@/components/Box";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - API Management",
    description: "",
};

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
            pagePermissions={["fe.account.nav.integrations.integration"]}>
            <Box
                sx={{
                    gridColumn: { tablet: "span 3", laptop: "span 4" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                <Box sx={{ display: "flex", gap: "40px" }}>
                    <ImageMediaCard
                        img="/images/account/teams/integrations/create.jpg"
                        href={`/account/team/${teamId}/integrations/integration/create`}
                        buttonText="Create new Integration"
                    />
                    <ImageMediaCard
                        img="/images/account/teams/integrations/manage.jpg"
                        href={`/account/team/${teamId}/integrations/integration/list`}
                        buttonText="Manage Integrations"
                    />
                </Box>
            </Box>
        </ProtectedAccountRoute>
    );
}
