import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import UserPublications from "./components/UserPublications";

export const metadata = metaData(
    {
        title: "Publications",
        description: "",
    },
    noFollowRobots
);

export default async function UserPublicationsPage() {
    const user = await getUser();
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    // manually add papers permissions for individual users so that they have permissions on their owned papers.
    ["papers.update", "papers.delete"].forEach(value => {
        permissions[value] = true;
    });

    return <UserPublications permissions={permissions} userId={userId} />;
}
