import { cookies } from "next/headers";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import UserPublications from "./components/UserPublications";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Publications",
    description: "",
};

export default async function UserPublicationsPage({
    params,
}: {
    params: { teamId: string };
}) {
    const { teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    // manually add papers permissions for individual users so that they have permissions on their owned papers.
    ["papers.update", "papers.delete"].forEach(
        value => (permissions[value] = true)
    );

    return (
        <UserPublications
            permissions={permissions}
            userId={userId}
            teamId={teamId}
        />
    );
}
