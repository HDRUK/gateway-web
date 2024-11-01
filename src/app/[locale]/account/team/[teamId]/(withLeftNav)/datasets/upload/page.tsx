import { cookies } from "next/headers";
import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import UploadDataset from "./components/UploadDataset";
import metaData, {noFollowRobots} from "@/utils/metdata";

export const metadata = metaData({
    title: "Dataset Upload - My Account",
    description: ""
}, noFollowRobots);
export default async function UploadDatasetPage({
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
            pagePermissions={["datasets.create"]}>
            <BoxContainer sx={{ mt: "14px" }}>
                <UploadDataset teamId={teamId} />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
