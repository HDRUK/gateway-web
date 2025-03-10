import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import metaData from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import Dashboard from "./components/Dashboard";

export const metadata = metaData({
    title: "Applications - My Account",
    description: "",
});

const DARApplicationsPage = async ({
    params,
}: {
    params: { teamId: string };
}) => {
    const { teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={[
                "data-access-template.read",
                "data-access-applications.provider.read",
                "data-access-applications.review.read",
            ]}>
            <Dashboard />
        </ProtectedAccountRoute>
    );
};

export default DARApplicationsPage;
