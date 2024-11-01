import { cookies } from "next/headers";
import CollectionForm from "@/components/CollectionForm";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Create Collection",
    description: "Create a collection",
};

export default async function CollectionCreatePage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);
    const userId = user?.id?.toString();

    return <CollectionForm userId={userId} />;
}
