import { cookies } from "next/headers";
import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import TeamTools from "./components/TeamTools";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Tools",
    description: "",
};

export default async function TeamToolsPage({
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
    const userId = user?.id?.toString();

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["tools.read"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <TeamTools
                    permissions={permissions}
                    teamId={teamId}
                    userId={userId}
                />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
