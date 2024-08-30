import { cookies } from "next/headers";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import CreatePublication from "../components/CreatePublication";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Publication Create",
    description: "",
};

export default async function PublicationCreatePage() {
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const permissions = getPermissions(user.roles);

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["papers.create"]}>
            <CreatePublication userId={user.id} />
        </ProtectedAccountRoute>
    );
}
