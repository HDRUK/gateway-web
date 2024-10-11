import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import CreateCollection from "./components";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Create Collection",
    description: "Create a collection",
};

export default async function CollectionCreatePage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["collections.create"]}>
            <CreateCollection userId={userId}/>
        </ProtectedAccountRoute>
    );
}
