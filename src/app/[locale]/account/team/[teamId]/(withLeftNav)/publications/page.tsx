import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import UserPublications from "@/app/[locale]/account/profile/publications/components/UserPublications";

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

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["papers.read"]}>
            <UserPublications
                permissions={permissions}
                teamId={teamId}
                userId={userId}
            />
        </ProtectedAccountRoute>
    );
}
