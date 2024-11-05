import { cookies } from "next/headers";
import CollectionForm from "@/components/CollectionForm";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metdata";
import { getPermissions } from "@/utils/permissions";

export const metadata = metaData(
    {
        title: "Edit Collection - My Account",
        description: "Edit a collection",
    },
    noFollowRobots
);

export default async function CollectionEditPage({
    params,
}: {
    params: { collectionId: string };
}) {
    const { collectionId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["collections.update"]}>
            <CollectionForm collectionId={collectionId} userId={userId} />
        </ProtectedAccountRoute>
    );
}
