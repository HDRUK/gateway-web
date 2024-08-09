import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { ACCOUNT, CREATE, PAGES, TEAM, TOOLS } from "@/consts/translation";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import CreateTool from "../create/components/CreateTool";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Tool Edit",
    description: "",
};

export default async function ToolCreatePage({
    params,
}: {
    params: { teamId: string; toolId: string };
}) {
    const { teamId, toolId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const t = await getTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${TOOLS}.${CREATE}`
    );

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["tools.create"]}>
            <CreateTool teamId={teamId} userId={user.id} toolId={toolId} />
        </ProtectedAccountRoute>
    );
}
