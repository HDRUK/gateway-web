import { cookies } from "next/headers";
import CollectionForm from "@/components/CollectionForm";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metdata";
import { getPermissions } from "@/utils/permissions";

export const metadata = metaData(
    {
        title: "Create Collection - My Account",
        description: "Create a collection",
    },
    noFollowRobots
);

export default async function CollectionCreatePage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["collections.create"]}>
            <CollectionForm userId={userId} />
        </ProtectedAccountRoute>
    );
}
