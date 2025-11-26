import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import Teams from "./teams";

export const metadata = metaData(
    {
        title: "Teams",
        description: "",
    },
    noFollowRobots
);
export default async function TeamsPage() {
    const user = await getUser();
    const permissions = getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["custodians.read"]}>
            <Teams permissions={permissions} />
        </ProtectedAccountRoute>
    );
}
