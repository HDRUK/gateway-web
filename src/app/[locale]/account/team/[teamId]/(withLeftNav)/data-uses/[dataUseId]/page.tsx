import { cookies } from "next/headers";
import BoxContainer from "@/components/BoxContainer";
import Paper from "@/components/Paper";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import EditDataUse from "./components";
import metaData, {noFollowRobots} from "@/utils/metdata";
export const metadata = metaData({
    title: "Data Use Edit - My Account",
    description: ""
}, noFollowRobots);
export default async function DataUseEditPage({
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
            pagePermissions={["dur.update"]}>
            <BoxContainer sx={{ gap: 0 }}>
                <Paper>
                    <EditDataUse />
                </Paper>
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
