import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import Tools from "../../team/[teamId]/(withLeftNav)/tools/components/TeamTools";

export const metadata = metaData(
    {
        title: "Tools",
        description: "",
    },
    noFollowRobots
);
export default async function TeamsPage() {
    const user = await getUser();
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    // manually add tools permissions for individual users so that they have permissions on their owned tools.
    ["tools.update", "tools.delete"].forEach(value => {
        permissions[value] = true;
    });

    return <Tools permissions={permissions} userId={userId} />;
}
